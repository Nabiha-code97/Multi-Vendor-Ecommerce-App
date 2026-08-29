import Order from "../../models/Order.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// all orders, platform-wide — for admin
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
