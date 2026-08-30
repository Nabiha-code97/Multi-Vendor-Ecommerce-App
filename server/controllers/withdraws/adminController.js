import Withdraw from "../../models/Withdraw.js";
import Shop from "../../models/Shop.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// all withdraw requests, platform-wide — for admin
export const getAllWithdrawsAdmin = async (req, res, next) => {
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdraws,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// admin approves or rejects a Processing withdraw request
export const updateWithdrawStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["Succeeded", "Rejected"].includes(status)) {
      return next(new ErrorHandler('Status must be "Succeeded" or "Rejected"', 400));
    }

    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return next(new ErrorHandler("Withdraw request not found", 400));
    }

    if (withdraw.status !== "Processing") {
      return next(new ErrorHandler(`This request has already been ${withdraw.status.toLowerCase()}`, 400));
    }

    withdraw.status = status;
    withdraw.updatedAt = Date.now();
    await withdraw.save();

    const shop = await Shop.findById(withdraw.shopId);

    if (status === "Succeeded") {
      shop.transactions.push({ amount: withdraw.amount, status: "Succeeded", updatedAt: withdraw.updatedAt });
    } else {
      // rejected — the amount that was escrowed out on request goes back to the seller
      shop.availableBalance += withdraw.amount;
    }

    await shop.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      withdraw,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
