import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/users/authRoute.js";
import errorMiddleware from "./middleware/error.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use("/api/user", authRouter);

app.use("/test", (req, res) => {
  res.send("Hello");
});

// must be registered last, after all routes
app.use(errorMiddleware);

export default app;

// app.use(bodyParser.urlencoded({ extended: true }));
