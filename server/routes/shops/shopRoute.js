import express from "express";
import { isSeller } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import {
  getSeller,
  getShopInfo,
  updateSellerInfo,
  updateShopAvatar,
  updatePaymentMethods,
  deleteWithdrawMethod,
} from "../../controllers/shops/shopController.js";

const shopRouter = express.Router();

shopRouter.get("/getSeller", isSeller, getSeller);
shopRouter.get("/get-shop-info/:id", getShopInfo);
shopRouter.put("/update-seller-info", isSeller, updateSellerInfo);
shopRouter.put("/update-shop-avatar", isSeller, upload.single("avatar"), updateShopAvatar);
shopRouter.put("/update-payment-methods", isSeller, updatePaymentMethods);
shopRouter.delete("/delete-withdraw-method", isSeller, deleteWithdrawMethod);

export default shopRouter;
