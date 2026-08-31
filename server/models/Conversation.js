import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  members: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  lastMessage: {
    type: String,
  },
  lastMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
}, {
  // updatedAt bumps whenever a new message is saved to the conversation, so
  // inbox lists can sort by most-recently-active thread
  timestamps: true,
});

// one thread per buyer-shop pair; also the index sendMessage's find-or-create relies on
conversationSchema.index({ "members.user": 1, "members.shop": 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
