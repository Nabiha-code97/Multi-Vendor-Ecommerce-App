import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllWithdrawsAdmin, updateWithdrawStatus } from "../../controllers/withdraws/adminController.js";

const withdrawAdminRouter = express.Router();

withdrawAdminRouter.get("/admin-all-withdraws", isAuthenticated, isAdmin("admin"), getAllWithdrawsAdmin);
withdrawAdminRouter.put("/update-withdraw-status/:id", isAuthenticated, isAdmin("admin"), updateWithdrawStatus);

export default withdrawAdminRouter;
