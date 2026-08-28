import Product from "../../models/Product.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// all products, platform-wide — for admin
export const getAllProductsAdmin = async (req, res, next) => {
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
