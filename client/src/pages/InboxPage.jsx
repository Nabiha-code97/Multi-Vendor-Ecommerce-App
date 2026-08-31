import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";

const InboxPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.messages);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const activeConversation = conversations.find((c) => c._id === conversationId);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 w-full 800px:w-11/12 mx-auto shadow-sm">
        <div
          className={`${
            conversationId ? "hidden 800px:block" : "block"
          } w-full 800px:w-[340px] h-full shrink-0`}
        >
          <ConversationList
            viewerType="user"
            activeConversationId={conversationId}
            basePath="/inbox"
          />
        </div>
        <div className={`${conversationId ? "block" : "hidden 800px:block"} flex-1 h-full`}>
          <ChatWindow
            conversationId={conversationId}
            viewerType="user"
            viewerId={user?._id}
            otherMember={activeConversation?.members?.shop}
            basePath="/inbox"
          />
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
