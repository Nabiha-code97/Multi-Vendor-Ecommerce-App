import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendEmail, sendResetPasswordEmail } from "../../utils/sendMail.js";
import { uploadImage } from "../../utils/cloudinary.js";
import sendToken from "../../utils/jwtToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.file) {
      return next(new ErrorHandler("Please fill complete form", 422));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Upload avatar to Cloudinary
    const result = await uploadImage(req.file);

    // Temporary user object (password hashed later by the User model's pre-save hook)
    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };

    // Generate activation token
    const activationToken = generateActivationToken(user);

    // Activation URL
    const activationURL = `${process.env.FRONTEND_URL}/activation/${activationToken}`;

    await sendEmail(user.email, user.name, activationURL);

    return res.status(201).json({
      success: true,
      message: `Please check your email (${user.email}) to activate your account.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Activate User
export const activateUser = async (req, res, next) => {
  try {
    const { activationToken } = req.body;

    const { user } = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

    if (!user) {
      return next(new ErrorHandler("Invalid or expired activation token", 400));
    }

    const { name, email, password, avatar } = user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const createdUser = await User.create({
      name,
      email,
      password,
      avatar,
    });

    sendToken(createdUser, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Login user
    return sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// log out user
export const logoutUser = async (req, res, next) => {
    try {
      // must mirror sendToken's cookie options exactly — a clearing Set-Cookie only
      // overwrites the browser's copy if secure/sameSite match how it was originally set
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
      res.status(200).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }


// Request password reset
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Please enter your email", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendResetPasswordEmail(user.email, user.name, resetURL);

      return res.status(200).json({
        success: true,
        message: `A password reset link has been sent to ${user.email}`,
      });
    } catch (error) {
      // token is useless without a delivered email, so don't leave it valid
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Reset password using the emailed token
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return next(
        new ErrorHandler("Please enter and confirm your new password", 400)
      );
    }

    if (password !== confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTime: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler("Reset password token is invalid or has expired", 400)
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save();

    return sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Generate Activation Token
const generateActivationToken = (user) => {
  return jwt.sign({ user }, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
