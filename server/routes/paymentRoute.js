import express from "express";
import { stripeWebhook } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default paymentRouter;
