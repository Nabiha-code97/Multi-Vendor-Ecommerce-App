import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.js";
import { getAllEventsAdmin } from "../../controllers/events/adminController.js";

const eventAdminRouter = express.Router();

eventAdminRouter.get("/admin-all-events", isAuthenticated, isAdmin("admin"), getAllEventsAdmin);

export default eventAdminRouter;
