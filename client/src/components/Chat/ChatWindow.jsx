import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSend, AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getMessages } from "../../redux/actions/message";
import { useChat } from "../../context/ChatContext";

// viewerType/viewerId identify who's looking at the thread; otherMember is the
// other side of the conversation (populated by the conversations list query).
// basePath is where the mobile-only back button returns to (the conversation
// list), since below 800px the list and the open thread occupy the same pane.
const ChatWindow = ({ conversationId, viewerType, viewerId, otherMember, basePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isOnline } = useChat();
  const { messages, messagesLoading } = useSelector((state) => state.messages);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  // the DB is updated the moment we emit "messageSeen"; the echo of that update
  // only reaches the original sender, so our own copy of `messages` never flips
  // to seen: true locally — track what we've already sent so we don't re-emit it
  const seenSentRef = useRef(new Set());

  useEffect(() => {
    if (conversationId) {
      dispatch(getMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // mark the other side's unseen messages as seen once we've loaded the thread
  useEffect(() => {
    if (!socket) return;
    const wantedSenderType = viewerType === "user" ? "Shop" : "User";
    messages
      .filter(
        (message) =>
          !message.seen &&
          message.senderType === wantedSenderType &&
          !seenSentRef.current.has(message._id)
      )
      .forEach((message) => {
        seenSentRef.current.add(message._id);
        socket.emit("messageSeen", { messageId: message._id, senderId: otherMember?._id });
      });
  }, [messages, socket, viewerType, otherMember]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || !otherMember?._id) return;

    socket.emit("sendMessage", {
      conversationId,
      senderId: viewerId,
      senderType: viewerType === "user" ? "User" : "Shop",
      receiverId: otherMember._id,
      text,
    });
    setText("");
  };

  if (!conversationId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#666]">
        Select a conversation to start chatting
      </div>
    );
  }

  // otherMember comes from the conversations list fetch, which can still be
  // in flight right after a brand-new conversation is created (e.g. a buyer
  // clicking "Send Message" and typing immediately) — render a wait state
  // instead of an interactive form whose send button would silently no-op
  if (!otherMember) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#666]">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center border-b p-4">
        {basePath && (
          <AiOutlineArrowLeft
            size={22}
            className="mr-3 cursor-pointer shrink-0 800px:hidden"
            onClick={() => navigate(basePath)}
          />
        )}
        <img
          src={otherMember?.avatar?.url}
          alt=""
          className="w-[40px] h-[40px] rounded-full mr-2 bg-gray-200"
        />
        <div>
          <h4 className="font-[600]">{otherMember?.name}</h4>
          <span className="text-[12px] text-[#888]">
            {isOnline(otherMember?._id) ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messagesLoading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderType === (viewerType === "user" ? "User" : "Shop");
            return (
              <div
                key={message._id}
                className={`w-full flex mb-3 ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-[10px] ${
                    isMine ? "bg-[#3321c8] text-white" : "bg-[#f0f0f0] text-[#222]"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="w-full flex items-center border-t p-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 mr-2"
        />
        <button
          type="submit"
          className="bg-[#3321c8] text-white rounded-full w-10 h-10 flex items-center justify-center"
        >
          <AiOutlineSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
