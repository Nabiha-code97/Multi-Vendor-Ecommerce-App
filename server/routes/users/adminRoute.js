import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllUsers, deleteUser } from "../../controllers/users/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/admin-all-users", isAuthenticated, isAdmin("admin"), getAllUsers);
adminRouter.delete("/delete-user/:id", isAuthenticated, isAdmin("admin"), deleteUser);

export default adminRouter;
