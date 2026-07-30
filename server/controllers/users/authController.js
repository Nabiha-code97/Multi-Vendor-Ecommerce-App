import User from "../../models/User.js";
import bcrypt from "bcrypt";
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

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Temporary user object
    const user = {
      name,
      email,
      password: passwordHash,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };

    console.log(user);

    // Generate activation token
    const activationToken = generateActivationToken(user);

    console.log("Activation token:", activationToken);

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
    // const passwordHash = bcrypt.hash(password, 10);
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    console.log(user);
    // Login user
    return sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// log out user
export const logoutUser = async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
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
