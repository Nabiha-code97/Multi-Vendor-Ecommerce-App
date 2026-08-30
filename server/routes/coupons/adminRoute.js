import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllCouponsAdmin } from "../../controllers/coupons/adminController.js";

const couponAdminRouter = express.Router();

couponAdminRouter.get("/admin-all-coupons", isAuthenticated, isAdmin("admin"), getAllCouponsAdmin);

export default couponAdminRouter;
