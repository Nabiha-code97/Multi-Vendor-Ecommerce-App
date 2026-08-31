import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  conversationsLoading: false,
  conversations: [],
  messagesLoading: false,
  messages: [],
  // which conversation `messages` belongs to, so a live socket event knows
  // whether it belongs to the thread currently open on screen
  activeConversationId: null,
};

export const messageReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("createConversationRequest", (state) => {
      state.createLoading = true;
    })
    .addCase("createConversationSuccess", (state, action) => {
      state.createLoading = false;
      const exists = state.conversations.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    })
    .addCase("createConversationFailed", (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
    })

    .addCase("getConversationsRequest", (state) => {
      state.conversationsLoading = true;
    })
    .addCase("getConversationsSuccess", (state, action) => {
      state.conversationsLoading = false;
      state.conversations = action.payload;
    })
    .addCase("getConversationsFailed", (state, action) => {
      state.conversationsLoading = false;
      state.error = action.payload;
    })

    .addCase("getMessagesRequest", (state) => {
      state.messagesLoading = true;
    })
    .addCase("getMessagesSuccess", (state, action) => {
      state.messagesLoading = false;
      state.activeConversationId = action.payload.conversationId;
      state.messages = action.payload.messages;
    })
    .addCase("getMessagesFailed", (state, action) => {
      state.messagesLoading = false;
      state.error = action.payload;
    })

    .addCase("messageReceived", (state, action) => {
      const message = action.payload;
      if (message.conversationId === state.activeConversationId) {
        state.messages.push(message);
      }
      const conversation = state.conversations.find((c) => c._id === message.conversationId);
      if (conversation) {
        conversation.lastMessage = message.text;
      }
    })
    .addCase("messageSeenUpdated", (state, action) => {
      const message = state.messages.find((m) => m._id === action.payload._id);
      if (message) {
        message.seen = true;
      }
    });
});
