const mongoose = require("mongoose");

const claimOfferSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
      required: true,
    },
    claimCode: {
      type: String,
      required: true,
      unique: true,
      length: 9,
    },
    termsAndConditions: {
      type: Boolean,
      required: true,
      default: false,
    },
    notification: {
      type: Boolean,
      default: false,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one user can claim an offer only once
claimOfferSchema.index({ userId: 1, offerId: 1 }, { unique: true });

module.exports = mongoose.model("ClaimOffer", claimOfferSchema);
