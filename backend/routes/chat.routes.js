const express = require("express");
const {
  getChatUsers,
  getChatRoomMessages,
  markAsRead,
  getAdDetailsForChat,
  getOrCreateChatRoom,
} = require("../controllers/chat.controller");
const { authorized } = require("../middlewares/authorization");

const router = express.Router();

// Get all chat users for sidebar
router.get("/ad-details/:id", authorized, getAdDetailsForChat);
router.get("/users", authorized, getChatUsers);

// Get messages of specific chat room
router.get("/messages/:id", authorized, getChatRoomMessages);
router.get("/room/:otherUserId", authorized, getOrCreateChatRoom);
router.post("/mark-read/:chatRoomId", authorized, markAsRead);

// Mark messages as read
router.put("/mark-read/:chatRoomId", authorized, markAsRead);

module.exports = router;
