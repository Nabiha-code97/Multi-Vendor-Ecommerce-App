import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/users/authRoute.js";
import userRouter from "./routes/users/userRoute.js";
import adminRouter from "./routes/users/adminRoute.js";
import shopAuthRouter from "./routes/shops/shopAuthRoute.js";
import shopRouter from "./routes/shops/shopRoute.js";
import shopAdminRouter from "./routes/shops/adminRoute.js";
import productRouter from "./routes/products/productRoute.js";
import productAdminRouter from "./routes/products/adminRoute.js";
import orderRouter from "./routes/orders/orderRoute.js";
import orderAdminRouter from "./routes/orders/adminRoute.js";
import eventRouter from "./routes/events/eventRoute.js";
import eventAdminRouter from "./routes/events/adminRoute.js";
import couponRouter from "./routes/coupons/couponRoute.js";
import couponAdminRouter from "./routes/coupons/adminRoute.js";
import withdrawRouter from "./routes/withdraws/withdrawRoute.js";
import withdrawAdminRouter from "./routes/withdraws/adminRoute.js";
import messageRouter from "./routes/messages/messageRoute.js";
import paymentRouter, { webhookRouter } from "./routes/paymentRoute.js";
import errorMiddleware from "./middleware/error.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());

// Stripe webhook needs the raw request body to verify its signature, so it
// must be registered before express.json() parses (and consumes) the body.
app.use("/api/payment", webhookRouter);

app.use(express.json());
app.use("/api/payment", paymentRouter);
app.use("/api/user", authRouter);
app.use("/api/user", userRouter);
app.use("/api/user", adminRouter);
app.use("/api/shop", shopAuthRouter);
app.use("/api/shop", shopRouter);
app.use("/api/shop", shopAdminRouter);
app.use("/api/product", productRouter);
app.use("/api/product", productAdminRouter);
app.use("/api/order", orderRouter);
app.use("/api/order", orderAdminRouter);
app.use("/api/event", eventRouter);
app.use("/api/event", eventAdminRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/coupon", couponAdminRouter);
app.use("/api/withdraw", withdrawRouter);
app.use("/api/withdraw", withdrawAdminRouter);
app.use("/api/message", messageRouter);

app.use("/test", (req, res) => {
  res.send("Hello");
});

// must be registered last, after all routes
app.use(errorMiddleware);

export default app;

// app.use(bodyParser.urlencoded({ extended: true }));
