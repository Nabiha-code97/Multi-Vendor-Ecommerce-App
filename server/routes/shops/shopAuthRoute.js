import express from "express";
import { upload } from "../../middleware/upload.js";
import { createShop, activateShop, loginShop, logoutShop } from "../../controllers/shops/shopAuthController.js";

const shopAuthRouter = express.Router();

shopAuthRouter.post("/create-shop", upload.single("avatar"), createShop);
shopAuthRouter.post("/activation", activateShop);
shopAuthRouter.post("/login-shop", loginShop);
shopAuthRouter.post("/logout", logoutShop);

export default shopAuthRouter;
