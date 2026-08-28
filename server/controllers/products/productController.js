import Product from "../../models/Product.js";
import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "../../utils/cloudinary.js";

// create product — shopId always comes from the authenticated seller, never the client
export const createProduct = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.seller.id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    const { name, description, category, tags, originalPrice, discountPrice, stock } = req.body;

    if (!name || !description || !category || !discountPrice || !stock || !req.files || req.files.length === 0) {
      return next(new ErrorHandler("Please fill the complete form and add at least one image", 422));
    }

    const imagesLinks = [];
    for (const file of req.files) {
      const result = await uploadImage(file);
      imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
    }

    const product = await Product.create({
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images: imagesLinks,
      shopId: shop._id,
      shop,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all products belonging to one shop (public)
export const getAllProductsShop = async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// delete a product — seller must own it
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found with this id", 400));
    }

    if (product.shopId.toString() !== req.seller.id) {
      return next(new ErrorHandler("You are not allowed to delete this product", 403));
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all products, platform-wide (public)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// create/update a review — identity always comes from req.user, never the client body
export const createNewReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 400));
    }

    const review = {
      user: req.user,
      rating,
      comment,
      productId,
    };

    const existingReview = product.reviews.find(
      (rev) => rev.user._id.toString() === req.user._id.toString()
    );

    if (existingReview) {
      product.reviews.forEach((rev) => {
        if (rev.user._id.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
    }

    let totalRatings = 0;
    product.reviews.forEach((rev) => {
      totalRatings += rev.rating;
    });
    product.ratings = totalRatings / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
