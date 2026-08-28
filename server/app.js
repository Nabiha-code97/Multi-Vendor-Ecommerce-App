import express from "express";
import dotenv from "dotenv";
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
import paymentRouter from "./routes/paymentRoute.js";
import errorMiddleware from "./middleware/error.js";

const app = express();

// Stripe webhook needs the raw request body to verify its signature, so it
// must be registered before express.json() parses (and consumes) the body.
app.use("/api/payment", paymentRouter);

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use("/api/user", userRouter);
app.use("/api/user", adminRouter);
app.use("/api/shop", shopAuthRouter);
app.use("/api/shop", shopRouter);
app.use("/api/shop", shopAdminRouter);
app.use("/api/product", productRouter);
app.use("/api/product", productAdminRouter);

app.use("/test", (req, res) => {
  res.send("Hello");
});

// must be registered last, after all routes
app.use(errorMiddleware);

export default app;

// app.use(bodyParser.urlencoded({ extended: true }));
