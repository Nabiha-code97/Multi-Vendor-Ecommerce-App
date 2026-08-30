import express from "express";
import { isSeller } from "../../middleware/auth.js";
import { createWithdrawRequest, getSellerWithdraws } from "../../controllers/withdraws/withdrawController.js";

const withdrawRouter = express.Router();

withdrawRouter.post("/create-withdraw-request", isSeller, createWithdrawRequest);
withdrawRouter.get("/get-seller-withdraws", isSeller, getSellerWithdraws);

export default withdrawRouter;
