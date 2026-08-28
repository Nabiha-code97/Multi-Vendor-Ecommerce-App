import Shop from "../../models/Shop.js";
import jwt from "jsonwebtoken";

import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendEmail } from "../../utils/sendMail.js";
import { uploadImage } from "../../utils/cloudinary.js";
import sendShopToken from "../../utils/shopToken.js";

export const createShop = async (req, res, next) => {
  try {
    const { name, email, password, address, phoneNumber, zipCode } = req.body;

    if (!name || !email || !password || !address || !phoneNumber || !zipCode || !req.file) {
      return next(new ErrorHandler("Please fill complete form", 422));
    }

    const existingShop = await Shop.findOne({ email });

    if (existingShop) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    // Upload avatar to Cloudinary
    const result = await uploadImage(req.file);

    // Temporary shop object (password hashed later by the Shop model's pre-save hook)
    const shop = {
      name,
      email,
      password,
      address,
      phoneNumber,
      zipCode,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };

    // Generate activation token
    const activationToken = generateActivationToken(shop);

    // Activation URL
    const activationURL = `${process.env.FRONTEND_URL}/seller/activation/${activationToken}`;

    await sendEmail(shop.email, shop.name, activationURL);

    return res.status(201).json({
      success: true,
      message: `Please check your email (${shop.email}) to activate your shop.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Activate Shop
export const activateShop = async (req, res, next) => {
  try {
    const { activationToken } = req.body;

    const { shop } = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

    if (!shop) {
      return next(new ErrorHandler("Invalid or expired activation token", 400));
    }

    const { name, email, password, address, phoneNumber, zipCode, avatar } = shop;

    const existingShop = await Shop.findOne({ email });

    if (existingShop) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    const createdShop = await Shop.create({
      name,
      email,
      password,
      address,
      phoneNumber,
      zipCode,
      avatar,
    });

    sendShopToken(createdShop, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const loginShop = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await shop.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    return sendShopToken(shop, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// log out seller
export const logoutShop = async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
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
};

// Generate Activation Token
const generateActivationToken = (shop) => {
  return jwt.sign({ shop }, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
