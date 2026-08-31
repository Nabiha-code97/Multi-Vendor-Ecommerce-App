import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../components/Shop/Layout/DashboardSideBar";
import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";

const ShopInboxPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { isSeller, isLoading, seller } = useSelector((state) => state.seller);
  const { conversations } = useSelector((state) => state.messages);

  useEffect(() => {
    if (!isLoading && !isSeller) {
      navigate("/shop-login");
    }
  }, [isLoading, isSeller, navigate]);

  if (!isSeller) {
    return null;
  }

  const activeConversation = conversations.find((c) => c._id === conversationId);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex flex-1 min-h-0">
        <div
          className={`${
            conversationId ? "hidden 800px:block" : "block"
          } w-[80px] 800px:w-[330px] h-full overflow-y-auto shrink-0`}
        >
          <DashboardSideBar active={10} />
        </div>
        <div
          className={`${
            conversationId ? "hidden 800px:block" : "block"
          } w-full 800px:w-[340px] h-full shrink-0`}
        >
          <ConversationList
            viewerType="shop"
            activeConversationId={conversationId}
            basePath="/dashboard-messages"
          />
        </div>
        <div className={`${conversationId ? "block" : "hidden 800px:block"} flex-1 h-full`}>
          <ChatWindow
            conversationId={conversationId}
            viewerType="shop"
            viewerId={seller?._id}
            otherMember={activeConversation?.members?.user}
            basePath="/dashboard-messages"
          />
        </div>
      </div>
    </div>
  );
};

export default ShopInboxPage;
