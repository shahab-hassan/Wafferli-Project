const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "NEW_FLASH_DEAL",
        "FLASH_DEAL_ENDING_SOON",
        "DEAL_IN_YOUR_AREA",
        "NEW_AD",
        "PRICE_DROP",
        "OUT_OF_STOCK",
        "ORDER_UPDATE",
      ],
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    description: { type: String, default: null },
    adId: { type: mongoose.Schema.Types.ObjectId, ref: "Ad", default: null },
    priceData: {
      originalPrice: Number,
      newPrice: Number,
      discountPercent: Number,
    },
    actionData: {
      actionType: String,
      actionUrl: String,
      actionParams: mongoose.Schema.Types.Mixed,
    },
    tags: [String],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    isClicked: { type: Boolean, default: false },
    clickedAt: { type: Date, default: null },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: true,
    },
  },
  { timestamps: true }
);

// Methods
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Notification", notificationSchema);
