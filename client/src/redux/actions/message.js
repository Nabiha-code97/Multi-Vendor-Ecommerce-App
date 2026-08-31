import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// buyer opens (or reopens) a chat with a shop
export const createConversation = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "createConversationRequest" });
    const { data } = await axios.post(
      `${BACKEND_URL}/api/message/create-conversation`,
      { shopId },
      { withCredentials: true }
    );
    dispatch({ type: "createConversationSuccess", payload: data.conversation });
    return data.conversation;
  } catch (error) {
    dispatch({ type: "createConversationFailed", payload: error.response.data.message });
  }
};

// all of the logged-in buyer's chat threads
export const getUserConversations = () => async (dispatch) => {
  try {
    dispatch({ type: "getConversationsRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/message/get-user-conversations`, {
      withCredentials: true,
    });
    dispatch({ type: "getConversationsSuccess", payload: data.conversations });
  } catch (error) {
    dispatch({ type: "getConversationsFailed", payload: error.response.data.message });
  }
};

// all of the logged-in seller's chat threads
export const getSellerConversations = () => async (dispatch) => {
  try {
    dispatch({ type: "getConversationsRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/message/get-seller-conversations`, {
      withCredentials: true,
    });
    dispatch({ type: "getConversationsSuccess", payload: data.conversations });
  } catch (error) {
    dispatch({ type: "getConversationsFailed", payload: error.response.data.message });
  }
};

// message history for one thread
export const getMessages = (conversationId) => async (dispatch) => {
  try {
    dispatch({ type: "getMessagesRequest" });
    const { data } = await axios.get(
      `${BACKEND_URL}/api/message/get-messages/${conversationId}`,
      { withCredentials: true }
    );
    dispatch({
      type: "getMessagesSuccess",
      payload: { conversationId, messages: data.messages },
    });
  } catch (error) {
    dispatch({ type: "getMessagesFailed", payload: error.response.data.message });
  }
};

// a message arriving live over the socket, for whichever conversation is open
export const messageReceived = (message) => ({
  type: "messageReceived",
  payload: message,
});

// the other side has seen a message we sent
export const messageSeenUpdated = (message) => ({
  type: "messageSeenUpdated",
  payload: message,
});
