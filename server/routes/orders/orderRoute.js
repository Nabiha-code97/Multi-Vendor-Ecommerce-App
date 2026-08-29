import express from "express";
import { isSeller, isAuthenticated } from "../../middleware/auth.js";
import {
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
} from "../../controllers/orders/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/get-user-orders", isAuthenticated, getUserOrders);
orderRouter.get("/get-seller-orders", isSeller, getSellerOrders);
orderRouter.put("/update-order-status/:id", isSeller, updateOrderStatus);

export default orderRouter;
