// const express = require("express");
// const Message = require("../models/message");
// const UserExtractor = require("../middleware/login_middleware");

// const router = express.Router();

// router.get("/", UserExtractor, async (req, res) => {
//   try {
//     const messages = await Message.find({ sender: req.user.id })
//       .sort({ createdTime: 1 });
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/", UserExtractor, async (req, res) => {
//   const { receiverId, messageText } = req.body;

//   if (!messageText) {
//     return res.status(400).json({ error: "Message text required" });
//   }

//   try {
//     const newMessage = new Message({
//       sender: req.user.id,
//       receiver: receiverId || null,
//       username: req.user.username,
//       messageText,
//     });

//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


import express from "express";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/messageController.js";
import UserExtractor from "../middleware/login_middleware.js";

const router = express.Router();

router.get("/users", UserExtractor, getUsersForSidebar);

router.get("/:id", UserExtractor, getMessages);

router.post("/:id", UserExtractor, sendMessage);

export default router;
