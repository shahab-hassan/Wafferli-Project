// Backend: controllers (Updated getChatUsers, getOrCreateChatRoom, no lastSeen)
const ChatRoom = require("../models/chat.model");
const User = require("../models/user.model");
const Seller = require("../models/seller.model");
const Ad = require("../models/ad/baseAd.model");
const mongoose = require("mongoose");
const { ApiResponse } = require("../utils/apiResponse");
const { ApiError } = require("../utils/apiError");

const getAdDetailsForChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    console.log(userId, "userId");

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
    }

    // Find product ad
    const product = await Ad.findOne({ _id: id }).lean();

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Get seller details if userId exists
    let sellerDetails = null;
    if (product.userId) {
      sellerDetails = await Seller.findOne({ userId: product.userId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
        )
        .lean();
    }

    const user = await User.findById(sellerDetails.userId);

    const responseData = {
      product: {
        ...product,
      },
      seller: sellerDetails,
      user, // Updated with isFavorited
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Product details fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching product details:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching product details", [
          error.message,
        ]).toJSON()
      );
  }
};

const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const chatRooms = await ChatRoom.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate("user1", "fullName email phone role")
      .populate("user2", "fullName email phone role")
      .populate("lastMessage.user", "fullName")
      .sort({ updatedAt: -1 });

    const chatUsers = chatRooms
      .map((room) => {
        const otherUser =
          room.user1._id.toString() === userId ? room.user2 : room.user1;

        // ✅ skip if same user (don’t show yourself)
        if (otherUser._id.toString() === userId) return null;

        return {
          chatRoomId: room._id,
          user: {
            _id: otherUser._id,
            fullName: otherUser.fullName,
            email: otherUser.email,
            phone: otherUser.phone,
            role: otherUser.role,
          },
          lastMessage: room.lastMessage,
          unreadCount: room.unreadCount,
          updatedAt: room.updatedAt,
        };
      })
      .filter(Boolean); // remove nulls

    res.status(200).json({
      message: "Chat users fetched successfully",
      chatUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get specific chat room messages
const getChatRoomMessages = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.id).populate(
      "messages.user",
      "fullName"
    );

    res.status(200).json({
      message: "Messages fetched successfully",
      messages: chatRoom.messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const userId = req.user._id;

    const chatRoom = await ChatRoom.findById(chatRoomId);

    // Reset unread count for this user
    chatRoom.unreadCount = 0;
    await chatRoom.save();

    res.status(200).json({
      message: "Messages marked as read",
      chatRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// New: Get or create chat room
const getOrCreateChatRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params; // or body

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let chatRoom = await ChatRoom.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId },
      ],
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        user1: userId,
        user2: otherUserId,
        messages: [],
      });
      await chatRoom.save();
    }

    const populatedRoom = await ChatRoom.findById(chatRoom._id)
      .populate("user1", "fullName email phone role")
      .populate("user2", "fullName email phone role");

    res.status(200).json({
      message: "Chat room ready",
      chatRoom: populatedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getChatUsers,
  getChatRoomMessages,
  markAsRead,
  getAdDetailsForChat,
  getOrCreateChatRoom,
};
