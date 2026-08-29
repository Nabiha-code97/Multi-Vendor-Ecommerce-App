import express from "express";
import { stripeWebhook, createPaymentIntent } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middleware/auth.js";

// mounted before express.json() in app.js, so Stripe's signature check sees the raw body.
export const webhookRouter = express.Router();
webhookRouter.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// mounted after express.json(), cors, and cookieParser — safe to use req.body/req.cookies normally.
const paymentRouter = express.Router();
paymentRouter.post("/create-payment-intent", isAuthenticated, createPaymentIntent);

export default paymentRouter;
