import express from "express";
import { isSeller } from "../../middleware/auth.js";
import {
  createCoupon,
  getSellerCoupons,
  deleteCoupon,
  getCouponValue,
} from "../../controllers/coupons/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/create-coupon", isSeller, createCoupon);
couponRouter.get("/get-seller-coupons", isSeller, getSellerCoupons);
couponRouter.delete("/delete-coupon/:id", isSeller, deleteCoupon);
couponRouter.get("/get-coupon-value/:name", getCouponValue);

export default couponRouter;
