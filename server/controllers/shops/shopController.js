import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "../../utils/cloudinary.js";

// current logged-in seller
export const getSeller = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller.id);

    if (!shop) {
      return next(new ErrorHandler("Shop doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      seller: shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// public shop profile
export const getShopInfo = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return next(new ErrorHandler("Shop doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update seller info (name/description/address/phone/zip — not password)
export const updateSellerInfo = async (req, res, next) => {
  try {
    const { name, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findById(req.seller.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update shop avatar
export const updateShopAvatar = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller.id);

    if (req.file) {
      const imageId = shop.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);

      const result = await uploadImage(req.file);

      shop.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// update payout method
export const updatePaymentMethods = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    shop.withdrawMethod = req.body;

    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// remove payout method
export const deleteWithdrawMethod = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    shop.withdrawMethod = null;

    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
