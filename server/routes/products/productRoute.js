import express from "express";
import { isSeller, isAuthenticated } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import {
  createProduct,
  getAllProductsShop,
  deleteProduct,
  getAllProducts,
  createNewReview,
} from "../../controllers/products/productController.js";

const productRouter = express.Router();

productRouter.post("/create-product", isSeller, upload.array("images", 10), createProduct);
productRouter.get("/get-all-products-shop/:id", getAllProductsShop);
productRouter.delete("/delete-shop-product/:id", isSeller, deleteProduct);
productRouter.get("/get-all-products", getAllProducts);
productRouter.put("/create-new-review", isAuthenticated, createNewReview);

export default productRouter;
