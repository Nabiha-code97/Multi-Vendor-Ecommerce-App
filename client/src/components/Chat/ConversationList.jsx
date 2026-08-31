import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserConversations, getSellerConversations } from "../../redux/actions/message";
import { useChat } from "../../context/ChatContext";

// viewerType picks which side of `members` is "the other person" to show,
// and which redux thunk fetches the right owner's threads
const ConversationList = ({ viewerType, activeConversationId, basePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOnline } = useChat();
  const { conversations, conversationsLoading } = useSelector((state) => state.messages);

  useEffect(() => {
    if (viewerType === "user") {
      dispatch(getUserConversations());
    } else {
      dispatch(getSellerConversations());
    }
  }, [viewerType, dispatch]);

  if (conversationsLoading) {
    return <p className="p-4">Loading conversations...</p>;
  }

  if (!conversations.length) {
    return <p className="p-4 text-[#666]">No conversations yet</p>;
  }

  return (
    <div className="w-full h-full overflow-y-auto border-r">
      {conversations.map((conversation) => {
        const otherMember = viewerType === "user" ? conversation.members.shop : conversation.members.user;
        const isActive = conversation._id === activeConversationId;
        return (
          <div
            key={conversation._id}
            onClick={() => navigate(`${basePath}/${conversation._id}`)}
            className={`w-full flex items-center p-3 cursor-pointer border-b ${
              isActive ? "bg-[#f0f0ff]" : "hover:bg-[#f7f7f7]"
            }`}
          >
            <div className="relative mr-3">
              <img
                src={otherMember?.avatar?.url}
                alt=""
                className="w-[45px] h-[45px] rounded-full bg-gray-200"
              />
              {isOnline(otherMember?._id) && (
                <span className="w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-[#40d132] border-2 border-white" />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="font-[600] truncate">{otherMember?.name}</h5>
              <p className="text-[13px] text-[#777] truncate">
                {conversation.lastMessage || "No messages yet"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
