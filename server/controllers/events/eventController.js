import Event from "../../models/Event.js";
import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "../../utils/cloudinary.js";

// create event — shopId always comes from the authenticated seller, never the client
export const createEvent = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    const { name, description, category, tags, originalPrice, discountPrice, stock, startDate, finishDate } = req.body;

    if (!name || !description || !category || !discountPrice || !stock || !startDate || !finishDate || !req.files || req.files.length === 0) {
      return next(new ErrorHandler("Please fill the complete form and add at least one image", 422));
    }

    if (new Date(finishDate) <= new Date(startDate)) {
      return next(new ErrorHandler("Finish date must be after the start date", 422));
    }

    const imagesLinks = [];
    for (const file of req.files) {
      const result = await uploadImage(file);
      imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
    }

    const event = await Event.create({
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      startDate,
      finishDate,
      images: imagesLinks,
      shopId: shop._id,
      shop,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all events belonging to one shop (public) — includes expired ones so the seller can manage them
export const getAllEventsShop = async (req, res, next) => {
  try {
    const events = await Event.find({ shopId: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete an event — seller must own it
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new ErrorHandler("Event not found with this id", 400));
    }

    if (event.shopId.toString() !== req.seller.id) {
      return next(new ErrorHandler("You are not allowed to delete this event", 403));
    }

    for (const image of event.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all currently-running events, platform-wide (public) — expired events are excluded here;
// they still exist in the DB (visible on the seller's own shop listing) until the seller removes them
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ finishDate: { $gt: new Date() } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
