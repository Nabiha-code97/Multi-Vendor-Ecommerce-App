import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { messageReceived, messageSeenUpdated } from "../redux/actions/message";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const ChatContext = createContext(null);

export const useChat = () => useContext(ChatContext);

// One socket per browser tab, created once and reused by every chat screen.
// A person can be logged in as both a buyer and a seller at once (separate
// cookies), so we register both ids on the same connection when present.
export const ChatProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const [socket, setSocket] = useState(null);
  const [onlineMembers, setOnlineMembers] = useState([]);
  // mirrors the ids below so the "connect" handler (which fires on every
  // reconnect, not just the first) always re-announces the latest identity
  const idsRef = useRef({ userId: null, sellerId: null });

  useEffect(() => {
    idsRef.current.userId = isAuthenticated && user?._id ? user._id : null;
  }, [isAuthenticated, user]);

  useEffect(() => {
    idsRef.current.sellerId = isSeller && seller?._id ? seller._id : null;
  }, [isSeller, seller]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    // "connect" fires on the initial connection AND every automatic reconnect
    // (e.g. the socket service restarting) — re-announcing presence here is what
    // keeps the server's online-members map from going stale after a restart,
    // since socket.io-client reuses the same Socket object across a reconnect
    // and a one-time mount effect would never re-run to notice.
    newSocket.on("connect", () => {
      if (idsRef.current.userId) newSocket.emit("addUser", idsRef.current.userId);
      if (idsRef.current.sellerId) newSocket.emit("addUser", idsRef.current.sellerId);
    });
    newSocket.on("getOnlineUsers", (members) => setOnlineMembers(members));
    newSocket.on("getMessage", (message) => dispatch(messageReceived(message)));
    newSocket.on("messageSeen", (message) => dispatch(messageSeenUpdated(message)));

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [dispatch]);

  useEffect(() => {
    if (socket && isAuthenticated && user?._id) {
      socket.emit("addUser", user._id);
    }
  }, [socket, isAuthenticated, user]);

  useEffect(() => {
    if (socket && isSeller && seller?._id) {
      socket.emit("addUser", seller._id);
    }
  }, [socket, isSeller, seller]);

  const value = {
    socket,
    onlineMembers,
    isOnline: (memberId) => onlineMembers.includes(memberId),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
