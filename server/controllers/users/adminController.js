import User from "../../models/User.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";

// all users --- for admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete user --- admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler("User is not available with this id", 400)
      );
    }

    const imageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
