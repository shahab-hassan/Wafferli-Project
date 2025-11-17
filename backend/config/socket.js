const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const ChatRoom = require("../models/chat.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(
  "🔗 Cloudinary configured:",
  process.env.CLOUDINARY_CLOUD_NAME ? "Yes" : "No"
);

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
});

// Store online users and typing users
const userSocketMap = {};
const onlineUsers = new Map();
const typingUsers = new Map();

// Upload directory for temporary files (optional)
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper functions
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidImage = (base64String) => {
  if (!base64String || typeof base64String !== "string") return false;
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  return base64Regex.test(base64String);
};

const isValidLocation = (location) => {
  return (
    location &&
    typeof location === "object" &&
    typeof location.lat === "number" &&
    typeof location.lng === "number"
  );
};

const sanitizeMessage = (message) => {
  if (!message || typeof message !== "string") return "";
  return message.trim().slice(0, 5000);
};

// ✅ UPDATED: Upload image to Cloudinary
const uploadImageToCloudinary = async (base64Image, senderId) => {
  try {
    console.log("☁️ Uploading image to Cloudinary...");

    if (!isValidImage(base64Image)) {
      throw new Error("Invalid image data format");
    }

    // Upload directly from base64
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "chat_images",
      resource_type: "image",
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Resize for optimization
        { quality: "auto" }, // Auto quality
        { format: "auto" }, // Auto format
      ],
      public_id: `chat_${senderId}_${Date.now()}`,
    });

    console.log("✅ Image uploaded to Cloudinary:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// ✅ NEW: Upload multiple images to Cloudinary
const uploadMultipleImages = async (images, senderId) => {
  const uploadPromises = images.map((image, index) =>
    uploadImageToCloudinary(image, `${senderId}_${index}`)
  );

  return await Promise.all(uploadPromises);
};

// ✅ NEW: Clean up temporary files (if using local uploads)
const cleanupTempFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🧹 Cleaned up temp file:", filePath);
    }
  });
};

// Connection handling
io.on("connection", async (socket) => {
  console.log("🔌 New connection:", socket.id);

  const userId = socket.handshake.query.userId;

  // Validation
  if (!userId || userId === "undefined" || userId === "null") {
    console.error("❌ Invalid user ID");
    socket.emit("error", { message: "Invalid user ID" });
    socket.disconnect();
    return;
  }

  if (!isValidObjectId(userId)) {
    console.error("❌ Invalid ObjectId format");
    socket.emit("error", { message: "Invalid user ID format" });
    socket.disconnect();
    return;
  }

  try {
    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      console.error("❌ User not found");
      socket.emit("error", { message: "User not found" });
      socket.disconnect();
      return;
    }

    // Store socket connections
    userSocketMap[userId] = socket.id;
    onlineUsers.set(userId.toString(), socket.id);

    // Join user's personal room
    socket.join(userId.toString());

    console.log("✅ User connected successfully:", userId);

    // Send connection confirmation
    socket.emit("connection_success", {
      message: "Successfully connected to chat",
      userId: userId,
      socketId: socket.id,
    });

    // Handle undelivered messages
    try {
      const chatRooms = await ChatRoom.find({
        $or: [{ user1: userId }, { user2: userId }],
      }).populate("messages.user");

      for (const room of chatRooms) {
        let updated = false;
        for (const msg of room.messages) {
          if (msg.user._id.toString() !== userId && !msg.deliveredAt) {
            msg.deliveredAt = new Date();
            updated = true;

            const senderSocket = getReceiverSocketId(msg.user._id.toString());
            if (senderSocket) {
              io.to(senderSocket).emit("message_delivered", {
                chatRoomId: room._id,
                messageId: msg._id,
              });
            }
          }
        }
        if (updated) await room.save();
      }
    } catch (deliveryError) {
      console.error("⚠️ Error handling undelivered messages:", deliveryError);
    }

    // Broadcast online users
    const onlineUserIds = Object.keys(userSocketMap);
    io.emit("online_users_updated", onlineUserIds);
    console.log("👥 Online users:", onlineUserIds.length);
  } catch (error) {
    console.error("❌ Connection setup error:", error);
    socket.emit("error", { message: "Connection setup failed" });
    socket.disconnect();
    return;
  }

  // ✅ ENHANCED: SEND MESSAGE WITH CLOUDINARY IMAGE UPLOAD
  socket.on("send_message", async (data) => {
    console.log("📤 Message request received:", {
      senderId: data.senderId,
      receiverId: data.receiverId,
      hasMessage: !!data.message,
      imageCount: data.images?.length || 0,
      hasLocation: !!data.location,
      hasReply: !!data.replyTo,
      hasProduct: !!data.productReference,
    });

    try {
      const {
        senderId,
        receiverId,
        message,
        images,
        location,
        replyTo,
        productReference,
      } = data;

      // Basic validation
      if (!senderId || !receiverId) {
        console.error("❌ Missing sender or receiver ID");
        socket.emit("error", {
          message: "Sender and receiver IDs are required",
        });
        return;
      }

      // Prevent self-chat
      if (senderId === receiverId) {
        socket.emit("error", { message: "Cannot send message to yourself" });
        return;
      }

      if (senderId !== userId) {
        console.error("❌ Sender ID mismatch:", { senderId, userId });
        socket.emit("error", { message: "Unauthorized: Sender ID mismatch" });
        return;
      }

      if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
        socket.emit("error", { message: "Invalid user ID format" });
        return;
      }

      // Verify users exist
      const [sender, receiver] = await Promise.all([
        User.findById(senderId),
        User.findById(receiverId),
      ]);

      if (!sender || !receiver) {
        console.error("❌ User not found:", {
          sender: !!sender,
          receiver: !!receiver,
        });
        socket.emit("error", { message: "User not found" });
        return;
      }

      // Process message content
      const hasMessage = message && message.trim().length > 0;
      const hasImages = images && images.length > 0;
      const hasLocation = isValidLocation(location);

      if (!hasMessage && !hasImages && !hasLocation) {
        socket.emit("error", {
          message: "Message, images, or location is required",
        });
        return;
      }

      const sanitizedMessage = hasMessage ? sanitizeMessage(message) : "";
      let imageUrls = [];

      // ✅ UPDATED: Process multiple images with Cloudinary
      if (hasImages) {
        if (images.length > 5) {
          socket.emit("error", { message: "Maximum 5 images allowed" });
          return;
        }

        try {
          console.log("☁️ Uploading images to Cloudinary...");
          imageUrls = await uploadMultipleImages(images, senderId);
          console.log("✅ Images uploaded successfully:", imageUrls.length);
        } catch (uploadError) {
          console.error("❌ Cloudinary upload failed:", uploadError);
          socket.emit("error", {
            message: "Failed to upload images. Please try again.",
            details: uploadError.message,
          });
          return;
        }
      }

      // Find or create chat room
      let chatRoom = await ChatRoom.findOne({
        $or: [
          { user1: senderId, user2: receiverId },
          { user1: receiverId, user2: senderId },
        ],
      });

      if (!chatRoom) {
        console.log("📝 Creating new chat room");
        chatRoom = new ChatRoom({
          user1: senderId,
          user2: receiverId,
          messages: [],
          unreadCount: 0,
        });
      }

      // Create message object with reply support
      const newMessage = {
        _id: new mongoose.Types.ObjectId(),
        user: senderId,
        message: sanitizedMessage,
        images: imageUrls, // ✅ Now contains Cloudinary URLs
        location: hasLocation ? location : undefined,
        replyTo: replyTo
          ? {
              messageId: replyTo._id || replyTo.messageId,
              text: replyTo.message || replyTo.text,
              user: replyTo.user?._id || replyTo.user,
            }
          : undefined,
        productReference: productReference
          ? {
              productId: productReference.productId,
              title: productReference.title,
              price: productReference.price,
              image: productReference.image,
            }
          : undefined,
        createdAt: new Date(),
        deliveredAt: null,
        readAt: null,
        isEdited: false,
        isDeleted: false,
      };

      // Add message to chat room
      chatRoom.messages.push(newMessage);

      // Update last message
      let lastMessageText = "";
      if (sanitizedMessage) lastMessageText = sanitizedMessage;
      else if (imageUrls.length > 0)
        lastMessageText = `📷 ${imageUrls.length} image${
          imageUrls.length > 1 ? "s" : ""
        }`;
      else if (hasLocation) lastMessageText = "📍 Location";

      chatRoom.lastMessage = {
        user: senderId,
        message: lastMessageText,
        images: imageUrls,
        createdAt: new Date(),
      };

      // Update unread count for receiver
      chatRoom.unreadCount = (chatRoom.unreadCount || 0) + 1;

      // Save chat room
      await chatRoom.save();
      console.log(
        "✅ Message saved to database. Total messages:",
        chatRoom.messages.length
      );

      // Safe population without breaking on missing fields
      const populatedRoom = await ChatRoom.findById(chatRoom._id)
        .populate("user1", "fullName profileImage role")
        .populate("user2", "fullName profileImage role")
        .populate("messages.user", "fullName profileImage role");

      const savedMessage =
        populatedRoom.messages[populatedRoom.messages.length - 1];

      // Manually populate replyTo.user if it exists
      if (savedMessage.replyTo && savedMessage.replyTo.user) {
        const replyUser = await User.findById(savedMessage.replyTo.user).select(
          "fullName profileImage role"
        );
        savedMessage.replyTo.user = replyUser;
      }

      const messageResponse = {
        ...savedMessage.toObject(),
        chatRoomId: chatRoom._id,
      };

      console.log("📨 Sending message response");

      // Send confirmation to sender
      socket.emit("message_sent", messageResponse);
      console.log("✅ Message sent confirmation to sender");

      // Send to receiver if online
      const receiverSocket = getReceiverSocketId(receiverId);
      if (receiverSocket) {
        // Mark as delivered
        const msgIndex = chatRoom.messages.length - 1;
        chatRoom.messages[msgIndex].deliveredAt = new Date();
        await chatRoom.save();

        // Update the response with delivery time
        messageResponse.deliveredAt = new Date();

        io.to(receiverId.toString()).emit("new_message", messageResponse);
        console.log("✅ Message delivered to receiver");

        // Send notification
        io.to(receiverId.toString()).emit("new_message_notification", {
          from: sender.fullName,
          message:
            sanitizedMessage ||
            (imageUrls.length > 0
              ? `Sent ${imageUrls.length} image${
                  imageUrls.length > 1 ? "s" : ""
                }`
              : "Sent a location"),
          chatRoomId: chatRoom._id,
          senderId: senderId,
        });

        // Notify sender of delivery
        socket.emit("message_delivered", {
          chatRoomId: chatRoom._id,
          messageId: savedMessage._id,
        });
      } else {
        console.log("⚠️ Receiver offline, message will be delivered later");
      }

      // Update sidebar for both users
      const updatedChatRoom = await ChatRoom.findById(chatRoom._id)
        .populate("user1", "fullName profileImage role")
        .populate("user2", "fullName profileImage role")
        .populate("lastMessage.user", "fullName profileImage role");

      io.to(senderId.toString()).emit("chat_room_updated", updatedChatRoom);
      io.to(receiverId.toString()).emit("chat_room_updated", updatedChatRoom);

      console.log("✅ Message delivery complete");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("error", {
        message: "Failed to send message. Please try again.",
        details: error.message,
      });
    }
  });

  // ✅ EDIT MESSAGE
  socket.on("edit_message", async (data) => {
    try {
      const { chatRoomId, messageId, message } = data;

      if (!chatRoomId || !messageId || !message) {
        socket.emit("error", { message: "Missing required fields" });
        return;
      }

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        socket.emit("error", { message: "Chat room not found" });
        return;
      }

      const msg = chatRoom.messages.id(messageId);
      if (!msg) {
        socket.emit("error", { message: "Message not found" });
        return;
      }

      if (msg.user.toString() !== userId) {
        socket.emit("error", {
          message: "Not authorized to edit this message",
        });
        return;
      }

      msg.message = sanitizeMessage(message);
      msg.isEdited = true;
      await chatRoom.save();

      // Broadcast edited message to all participants
      io.to(chatRoomId).emit("message_edited", {
        chatRoomId,
        messageId,
        message: msg.message,
        isEdited: true,
      });

      console.log("✅ Message edited:", messageId);
    } catch (error) {
      console.error("❌ Error editing message:", error);
      socket.emit("error", { message: "Failed to edit message" });
    }
  });

  // ✅ DELETE MESSAGE (Also delete images from Cloudinary)
  socket.on("delete_message", async (data) => {
    try {
      const { chatRoomId, messageId } = data;

      if (!chatRoomId || !messageId) {
        socket.emit("error", { message: "Missing required fields" });
        return;
      }

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        socket.emit("error", { message: "Chat room not found" });
        return;
      }

      const msg = chatRoom.messages.id(messageId);
      if (!msg) {
        socket.emit("error", { message: "Message not found" });
        return;
      }

      if (msg.user.toString() !== userId) {
        socket.emit("error", {
          message: "Not authorized to delete this message",
        });
        return;
      }

      // ✅ OPTIONAL: Delete images from Cloudinary
      if (msg.images && msg.images.length > 0) {
        console.log("🗑️ Deleting images from Cloudinary...");
        const deletePromises = msg.images.map((imageUrl) => {
          // Extract public_id from Cloudinary URL
          const publicId = imageUrl.split("/").pop().split(".")[0];
          return cloudinary.uploader
            .destroy(`chat_images/${publicId}`)
            .catch((err) =>
              console.warn("⚠️ Failed to delete image from Cloudinary:", err)
            );
        });

        await Promise.all(deletePromises);
        console.log("✅ Images deleted from Cloudinary");
      }

      // Soft delete
      msg.isDeleted = true;
      await chatRoom.save();

      // Broadcast deletion to all participants
      io.to(chatRoomId).emit("message_deleted", {
        chatRoomId,
        messageId,
      });

      console.log("✅ Message deleted:", messageId);
    } catch (error) {
      console.error("❌ Error deleting message:", error);
      socket.emit("error", { message: "Failed to delete message" });
    }
  });

  // TYPING INDICATORS
  socket.on("typing_start", (data) => {
    try {
      const { chatRoomId, userId: typingUserId } = data;
      if (!chatRoomId || !typingUserId || typingUserId !== userId) return;
      if (!isValidObjectId(chatRoomId) || !isValidObjectId(typingUserId))
        return;

      typingUsers.set(socket.id, { chatRoomId, userId: typingUserId });

      socket.broadcast.to(chatRoomId).emit("user_typing", {
        userId: typingUserId,
        isTyping: true,
      });
    } catch (error) {
      console.error("Error in typing_start:", error);
    }
  });

  socket.on("typing_stop", (data) => {
    try {
      const { chatRoomId, userId: typingUserId } = data;
      if (!chatRoomId || !typingUserId || typingUserId !== userId) return;
      if (!isValidObjectId(chatRoomId) || !isValidObjectId(typingUserId))
        return;

      typingUsers.delete(socket.id);

      socket.broadcast.to(chatRoomId).emit("user_typing", {
        userId: typingUserId,
        isTyping: false,
      });
    } catch (error) {
      console.error("Error in typing_stop:", error);
    }
  });

  // MARK MESSAGES AS READ
  socket.on("mark_messages_read", async (data) => {
    try {
      const { chatRoomId, userId: readUserId } = data;
      if (!chatRoomId || !readUserId || readUserId !== userId) {
        socket.emit("error", { message: "Invalid parameters" });
        return;
      }

      if (!isValidObjectId(chatRoomId) || !isValidObjectId(readUserId)) {
        socket.emit("error", { message: "Invalid ID format" });
        return;
      }

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        socket.emit("error", { message: "Chat room not found" });
        return;
      }

      const isParticipant = [
        chatRoom.user1.toString(),
        chatRoom.user2.toString(),
      ].includes(readUserId);

      if (!isParticipant) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      let updated = false;
      const readMessageIds = [];

      for (const msg of chatRoom.messages) {
        if (msg.user.toString() !== readUserId && !msg.readAt) {
          msg.readAt = new Date();
          updated = true;
          readMessageIds.push(msg._id);
        }
      }

      chatRoom.unreadCount = 0;
      if (updated) await chatRoom.save();

      // Notify other user
      const otherUserId =
        chatRoom.user1.toString() === readUserId
          ? chatRoom.user2.toString()
          : chatRoom.user1.toString();

      io.to(otherUserId).emit("messages_read", {
        chatRoomId,
        messageIds: readMessageIds,
      });

      // Update sidebar
      const updatedChatRoom = await ChatRoom.findById(chatRoomId)
        .populate("user1", "fullName profileImage role")
        .populate("user2", "fullName profileImage role")
        .populate("lastMessage.user", "fullName profileImage role");

      io.to(readUserId).emit("chat_room_updated", updatedChatRoom);
      io.to(otherUserId).emit("chat_room_updated", updatedChatRoom);

      console.log("✅ Messages marked as read:", readMessageIds.length);
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  });

  // JOIN CHAT ROOM
  socket.on("join_chat_room", async (chatRoomId) => {
    try {
      if (!chatRoomId || !isValidObjectId(chatRoomId)) return;

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) return;

      const isParticipant = [
        chatRoom.user1.toString(),
        chatRoom.user2.toString(),
      ].includes(userId);

      if (!isParticipant) return;

      socket.join(chatRoomId);
      console.log(`✅ User ${userId} joined chat room: ${chatRoomId}`);
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
  });

  // LEAVE CHAT ROOM
  socket.on("leave_chat_room", (chatRoomId) => {
    if (!chatRoomId) return;
    socket.leave(chatRoomId);
    console.log(`👋 User ${userId} left chat room: ${chatRoomId}`);
  });

  // ERROR HANDLING
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // DISCONNECTION
  socket.on("disconnect", (reason) => {
    console.log("🔌 User disconnected:", socket.id, "Reason:", reason);

    // Clean up typing indicators
    const typingData = typingUsers.get(socket.id);
    if (typingData) {
      socket.to(typingData.chatRoomId).emit("user_typing", {
        userId: typingData.userId,
        isTyping: false,
      });
      typingUsers.delete(socket.id);
    }

    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
      onlineUsers.delete(userId.toString());

      const onlineUserIds = Object.keys(userSocketMap);
      io.emit("online_users_updated", onlineUserIds);
      console.log(`👥 Online users: ${onlineUserIds.length}`);
    }
  });
});

// Health check endpoint
app.get("/socket-health", (req, res) => {
  res.json({
    status: "ok",
    onlineUsers: Object.keys(userSocketMap).length,
    timestamp: new Date().toISOString(),
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME
      ? "configured"
      : "not configured",
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Socket server is running!" });
});

module.exports = { app, io, server, getReceiverSocketId };
