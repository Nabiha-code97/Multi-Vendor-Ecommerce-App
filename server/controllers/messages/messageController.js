import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";
import ErrorHandler from "../../utils/ErrorHandler.js";

// buyer opens a chat with a shop; reuses the thread if one already exists
export const createConversation = async (req, res, next) => {
  try {
    const { shopId } = req.body;

    let conversation = await Conversation.findOne({
      "members.user": req.user._id,
      "members.shop": shopId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: { user: req.user._id, shop: shopId },
      });
    }

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all of the logged-in buyer's chat threads, most recently active first
export const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ "members.user": req.user._id })
      .populate("members.shop", "name avatar")
      .sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// all of the logged-in seller's chat threads
export const getSellerConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ "members.shop": req.seller._id })
      .populate("members.user", "name avatar")
      .sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// message history for one thread; caller must be one of its two members
export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return next(new ErrorHandler("Conversation not found with this id", 400));
    }

    const callerId = (req.user || req.seller)._id.toString();
    const isMember =
      conversation.members.user.toString() === callerId ||
      conversation.members.shop.toString() === callerId;

    if (!isMember) {
      return next(new ErrorHandler("You are not part of this conversation", 403));
    }

    const messages = await Message.find({ conversationId: req.params.conversationId }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
