import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/Shop/Layout/DashboardLayout";
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
    <DashboardLayout active={10}>
      <div className="flex h-full">
        {/* flex-1 (not w-full) so this shares space with the nav sidebar
            instead of demanding the full viewport width and overflowing */}
        <div
          className={`${
            conversationId ? "hidden 800px:block" : "block"
          } flex-1 800px:flex-none 800px:w-[340px] h-full shrink-0`}
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
    </DashboardLayout>
  );
};

export default ShopInboxPage;
