import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";

// all sellers --- for admin
export const getAllSellers = async (req, res, next) => {
  try {
    const sellers = await Shop.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete seller --- admin
export const deleteSeller = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return next(
        new ErrorHandler("Seller is not available with this id", 400)
      );
    }

    const imageId = shop.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);

    await Shop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Seller deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
