import User from "../../models/User.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "../../utils/cloudinary.js";

export const getCurrentUser = async(req, res, next)=>{
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
}

// update user info
export const updateUserInfo = async (req, res, next) => {
  try {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update user avatar
export const updateUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.file) {
      const imageId = user.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);

      const result = await uploadImage(req.file);

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update user addresses
export const updateUserAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const existsAddress = user.addresses.find(
      (address) => address._id.toString() === req.body._id
    );

    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`, 400)
        );
      }

      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete user address
export const deleteUserAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update user password
export const updateUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password doesn't match with confirm password!", 400)
      );
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// find user information by id (public)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};