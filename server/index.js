import app from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./db/db.js";
import { connectCloudinary } from "./config/cloudinary.js";


dotenv.config();
//connect DB
connectDB();
// connect cloudinary
connectCloudinary();

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});


const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
