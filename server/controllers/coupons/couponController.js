import Coupon from "../../models/Coupon.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// create a coupon — shopId always comes from the authenticated seller, never the client
export const createCoupon = async (req, res, next) => {
  try {
    const { name, value, minAmount, maxAmount, selectedProduct } = req.body;

    if (!name || value === undefined) {
      return next(new ErrorHandler("Please provide a coupon name and discount value", 422));
    }

    const existingCoupon = await Coupon.findOne({ name: name.trim().toUpperCase() });

    if (existingCoupon) {
      return next(new ErrorHandler("A coupon with this code already exists", 400));
    }

    const coupon = await Coupon.create({
      name,
      value,
      minAmount,
      maxAmount,
      selectedProduct,
      shopId: req.seller.id,
    });

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all coupons belonging to the logged-in seller's shop
export const getSellerCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ shopId: req.seller.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete a coupon — seller must own it
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return next(new ErrorHandler("Coupon not found with this id", 400));
    }

    if (coupon.shopId.toString() !== req.seller.id) {
      return next(new ErrorHandler("You are not allowed to delete this coupon", 403));
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// look up a coupon by its code (public — used at checkout to validate/apply a code)
export const getCouponValue = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ name: req.params.name.trim().toUpperCase() });

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
