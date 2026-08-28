import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllProductsAdmin } from "../../controllers/products/adminController.js";

const productAdminRouter = express.Router();

productAdminRouter.get("/admin-all-products", isAuthenticated, isAdmin("admin"), getAllProductsAdmin);

export default productAdminRouter;
