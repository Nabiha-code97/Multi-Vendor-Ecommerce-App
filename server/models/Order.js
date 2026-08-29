import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        // a cart line can be a regular Product or a flash-sale Event; itemType picks which
        // collection this id actually points at
        refPath: "cart.itemType",
        required: true,
      },
      itemType: {
        type: String,
        enum: ["Product", "Event"],
        default: "Product",
      },
      name: {
        type: String,
        required: true,
      },
      discountPrice: {
        type: Number,
        required: true,
      },
      images: [
        {
          public_id: String,
          url: String,
        },
      ],
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    zipCode: {
      type: Number,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending Payment",
      "Payment Failed",
      "Processing",
      "Shipped",
      "Delivered",
      "Refund Requested",
      "Refunded",
    ],
    default: "Pending Payment",
  },
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
    type: {
      type: String,
      default: "Stripe",
    },
  },
  paidAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
