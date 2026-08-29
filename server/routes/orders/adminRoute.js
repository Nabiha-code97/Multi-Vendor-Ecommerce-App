import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllOrdersAdmin } from "../../controllers/orders/adminController.js";

const orderAdminRouter = express.Router();

orderAdminRouter.get("/admin-all-orders", isAuthenticated, isAdmin("admin"), getAllOrdersAdmin);

export default orderAdminRouter;
