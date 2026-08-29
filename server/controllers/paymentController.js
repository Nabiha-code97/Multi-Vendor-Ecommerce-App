import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Event from "../models/Event.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const itemModels = { Product, Event };

let stripe;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// create Pending-Payment orders (split per shop) + one PaymentIntent covering their combined total.
// prices are always re-read from the DB — the cart in the request body is never trusted for money math.
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { cart, shippingAddress } = req.body;

    if (!cart || cart.length === 0) {
      return next(new ErrorHandler("Cart is empty", 400));
    }

    if (!shippingAddress || !shippingAddress.country || !shippingAddress.city || !shippingAddress.address1 || !shippingAddress.zipCode) {
      return next(new ErrorHandler("Please provide a complete shipping address", 400));
    }

    const shopGroups = new Map();

    for (const cartItem of cart) {
      const itemType = cartItem.itemType === "Event" ? "Event" : "Product";
      const Model = itemModels[itemType];
      const item = await Model.findById(cartItem._id);

      if (!item) {
        return next(new ErrorHandler(`${itemType} not found`, 400));
      }

      if (item.stock < cartItem.qty) {
        return next(new ErrorHandler(`${item.name} is out of stock`, 400));
      }

      const shopId = item.shopId.toString();
      if (!shopGroups.has(shopId)) {
        shopGroups.set(shopId, []);
      }

      shopGroups.get(shopId).push({
        product: item._id,
        itemType,
        name: item.name,
        discountPrice: item.discountPrice,
        images: item.images,
        qty: cartItem.qty,
      });
    }

    const orders = [];
    let grandTotal = 0;

    for (const [shopId, items] of shopGroups) {
      const totalPrice = items.reduce((sum, item) => sum + item.discountPrice * item.qty, 0);
      grandTotal += totalPrice;

      const order = await Order.create({
        cart: items,
        shippingAddress,
        user: req.user._id,
        shopId,
        totalPrice,
      });

      orders.push(order);
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(grandTotal * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderIds: orders.map((order) => order._id.toString()).join(","),
        userId: req.user._id.toString(),
      },
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// marks the orders behind a PaymentIntent as paid and takes the stock/sold_out hit.
// Stripe delivers webhooks at-least-once, so this must be safe to run twice for the same event —
// the Pending Payment check makes a repeat delivery a no-op instead of double-decrementing stock.
export const fulfillOrders = async (paymentIntent) => {
  const orderIds = (paymentIntent.metadata.orderIds || "").split(",").filter(Boolean);

  for (const orderId of orderIds) {
    const order = await Order.findById(orderId);

    if (!order || order.status !== "Pending Payment") {
      continue;
    }

    order.status = "Processing";
    order.paidAt = Date.now();
    order.paymentInfo = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      type: "Stripe",
    };
    await order.save();

    for (const item of order.cart) {
      const Model = itemModels[item.itemType] || Product;
      await Model.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty, sold_out: item.qty },
      });
    }
  }
};

export const failOrders = async (paymentIntent) => {
  const orderIds = (paymentIntent.metadata.orderIds || "").split(",").filter(Boolean);

  await Order.updateMany(
    { _id: { $in: orderIds }, status: "Pending Payment" },
    { status: "Payment Failed" }
  );
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook signature verification failed: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    await fulfillOrders(event.data.object);
  } else if (event.type === "payment_intent.payment_failed") {
    await failOrders(event.data.object);
  }

  res.json({ received: true });
};
