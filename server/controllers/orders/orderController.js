import Order from "../../models/Order.js";
import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// a seller can only push a paid order forward one step at a time
const allowedNextStatus = {
  Processing: "Shipped",
  Shipped: "Delivered",
};

// platform keeps 10% of a delivered order; the rest settles to the seller's available balance
const PLATFORM_FEE_RATE = 0.1;

// all orders placed by the logged-in user
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all orders belonging to the logged-in seller's shop
export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ shopId: req.seller._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// seller moves a paid order through Processing -> Shipped -> Delivered
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    if (order.shopId.toString() !== req.seller._id.toString()) {
      return next(new ErrorHandler("You are not allowed to update this order", 403));
    }

    if (allowedNextStatus[order.status] !== status) {
      return next(new ErrorHandler(`Order cannot move from "${order.status}" to "${status}"`, 400));
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();

      const sellerCut = order.totalPrice * (1 - PLATFORM_FEE_RATE);
      const shop = await Shop.findById(order.shopId);
      shop.availableBalance += sellerCut;
      shop.transactions.push({ amount: sellerCut });
      await shop.save({ validateBeforeSave: false });
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
