import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    // whoever sent it, resolved against senderType (same pattern as Order.cart.itemType)
    refPath: "senderType",
    required: true,
  },
  senderType: {
    type: String,
    enum: ["User", "Shop"],
    required: true,
  },
  text: {
    type: String,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
