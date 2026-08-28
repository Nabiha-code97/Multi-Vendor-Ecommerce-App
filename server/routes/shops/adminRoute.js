import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllSellers, deleteSeller } from "../../controllers/shops/adminController.js";

const shopAdminRouter = express.Router();

shopAdminRouter.get("/admin-all-sellers", isAuthenticated, isAdmin("admin"), getAllSellers);
shopAdminRouter.delete("/delete-seller/:id", isAuthenticated, isAdmin("admin"), deleteSeller);

export default shopAdminRouter;
