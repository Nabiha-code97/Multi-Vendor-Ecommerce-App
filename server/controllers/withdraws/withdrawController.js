import Withdraw from "../../models/Withdraw.js";
import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// create a withdraw request — the requested amount is escrowed out of availableBalance
// immediately (so it can't be double-withdrawn while Processing), and refunded if an
// admin later rejects the request
export const createWithdrawRequest = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return next(new ErrorHandler("Please enter a valid withdrawal amount", 400));
    }

    const shop = await Shop.findById(req.seller.id);

    if (amount > shop.availableBalance) {
      return next(new ErrorHandler("Withdrawal amount exceeds your available balance", 400));
    }

    const withdraw = await Withdraw.create({
      shopId: shop._id,
      amount,
    });

    shop.availableBalance -= amount;
    await shop.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      withdraw,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all withdraw requests belonging to the logged-in seller's shop
export const getSellerWithdraws = async (req, res, next) => {
  try {
    const withdraws = await Withdraw.find({ shopId: req.seller.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdraws,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
