import Event from "../../models/Event.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// all events, platform-wide (including expired) — for admin
export const getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
