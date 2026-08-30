import User from "../../models/User.js";
import jwt from "jsonwebtoken";

import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendEmail } from "../../utils/sendMail.js";
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


// Generate Activation Token
const generateActivationToken = (user) => {
  return jwt.sign({ user }, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
