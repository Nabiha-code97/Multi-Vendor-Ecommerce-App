import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();


app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true }));


if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: "server/config/.env",
  });
}

export default app;