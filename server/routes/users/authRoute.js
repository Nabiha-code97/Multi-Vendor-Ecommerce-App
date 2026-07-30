import express from "express";
import { upload } from "../../middleware/upload.js";
import { registerUser, activateUser, loginUser } from "../../controllers/users/authController.js";
const authRouter = express.Router();

authRouter.post("/register",upload.single("avatar"), registerUser);
authRouter.post("/activation", activateUser);
authRouter.post("/login", loginUser);
// authRouter.post("/logout", logoutUser);

export default authRouter;