const mongoose = require("mongoose");

// Reply sub-schema
const replySchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false }
);

// Product reference sub-schema
const productReferenceSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: String,
    price: Number,
    image: String,
  },
  { _id: false }
);

// Main message schema
const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
      default: null,
    },
  ],
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  replyTo: replySchema,
  productReference: productReferenceSchema,
  isEdited: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  readAt: {
    type: Date,
    default: null,
  },
});

const chatRoomsSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
    lastMessage: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique index
chatRoomsSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model("ChatRoom", chatRoomsSchema);
