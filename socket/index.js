import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import Message from "../server/models/Message.js";
import Conversation from "../server/models/Conversation.js";

dotenv.config();

// Message/Conversation are registered against the server package's own mongoose
// install (a separate copy from this package's node_modules), so we reuse that
// exact instance via Model.base rather than importing "mongoose" fresh here —
// connecting a second, unrelated instance would leave these models' real
// connection permanently disconnected, and every write against them would
// hang forever waiting on mongoose's command buffer instead of erroring.
const mongoose = Message.base;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Socket service: MongoDB connected"))
  .catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.send("Chat socket server is running");
});

// userId/shopId -> socketId, so we know where to deliver a live message. Purely
// in-memory by design: presence should reset on reconnect/restart, unlike messages.
const onlineMembers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (memberId) => {
    onlineMembers.set(memberId, socket.id);
    io.emit("getOnlineUsers", Array.from(onlineMembers.keys()));
  });

  socket.on("sendMessage", async ({ conversationId, senderId, senderType, receiverId, text, images }) => {
    try {
      const message = await Message.create({
        conversationId,
        sender: senderId,
        senderType,
        text,
        images,
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastMessageId: message._id,
      });

      // echo back to the sender's own socket too, so their chat window renders
      // the message with its real DB id instead of a client-guessed placeholder
      socket.emit("getMessage", message);

      const receiverSocketId = onlineMembers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", message);
      }
    } catch (error) {
      socket.emit("messageError", { message: error.message });
    }
  });

  socket.on("messageSeen", async ({ messageId, senderId }) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { seen: true }, { returnDocument: "after" });

      const senderSocketId = onlineMembers.get(senderId);
      if (senderSocketId && message) {
        io.to(senderSocketId).emit("messageSeen", message);
      }
    } catch (error) {
      socket.emit("messageError", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    for (const [memberId, socketId] of onlineMembers) {
      if (socketId === socket.id) {
        onlineMembers.delete(memberId);
        break;
      }
    }
    io.emit("getOnlineUsers", Array.from(onlineMembers.keys()));
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Socket server is running on port ${process.env.PORT || 4000}`);
});
