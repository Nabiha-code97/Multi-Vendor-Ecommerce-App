import express from "express";
import { isAuthenticated, isSeller, isAuthenticatedUserOrSeller } from "../../middleware/auth.js";
import {
  createConversation,
  getUserConversations,
  getSellerConversations,
  getMessages,
} from "../../controllers/messages/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/create-conversation", isAuthenticated, createConversation);
messageRouter.get("/get-user-conversations", isAuthenticated, getUserConversations);
messageRouter.get("/get-seller-conversations", isSeller, getSellerConversations);
messageRouter.get(
  "/get-messages/:conversationId",
  isAuthenticatedUserOrSeller,
  getMessages
);

export default messageRouter;
