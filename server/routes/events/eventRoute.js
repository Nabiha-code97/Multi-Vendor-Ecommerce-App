import express from "express";
import { isSeller } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import {
  createEvent,
  getAllEventsShop,
  deleteEvent,
  getAllEvents,
} from "../../controllers/events/eventController.js";

const eventRouter = express.Router();

eventRouter.post("/create-event", isSeller, upload.array("images", 10), createEvent);
eventRouter.get("/get-all-events-shop/:id", getAllEventsShop);
eventRouter.delete("/delete-shop-event/:id", isSeller, deleteEvent);
eventRouter.get("/get-all-events", getAllEvents);

export default eventRouter;
