import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Processing", "Succeeded", "Rejected"],
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

export default Withdraw;
