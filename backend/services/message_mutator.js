import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.js";

const app = express();
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", async ({ receiverId, text }) => {
    if (!text) return;

    const newMessage = await Message.create({
      senderId: userId,
      receiverId,
      text,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

    socket.emit("newMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
