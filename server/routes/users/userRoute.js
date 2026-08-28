import express from "express"
import { isAuthenticated } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import {
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
  updateUserAddresses,
  deleteUserAddress,
  updateUserPassword,
  getUserById,
} from "../../controllers/users/userController.js";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticated, getCurrentUser);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-avatar", isAuthenticated, upload.single("avatar"), updateUserAvatar);
userRouter.put("/update-user-addresses", isAuthenticated, updateUserAddresses);
userRouter.delete("/delete-user-address/:id", isAuthenticated, deleteUserAddress);
userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);
userRouter.get("/user-info/:id", getUserById);

export default userRouter;
