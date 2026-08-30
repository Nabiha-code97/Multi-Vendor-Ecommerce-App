import Coupon from "../../models/Coupon.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// all coupons, platform-wide — for admin
export const getAllCouponsAdmin = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
