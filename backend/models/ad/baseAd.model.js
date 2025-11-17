const mongoose = require("mongoose");
const { cityEnum, neighborhoodEnum } = require("../../utils/data");

const baseAdSchema = new mongoose.Schema(
  {
    images: { type: [String], default: [] },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    locationSameAsProfile: { type: Boolean, default: false },
    city: { type: String, enum: cityEnum },
    neighbourhood: { type: String, enum: neighborhoodEnum },
    phone: { type: String, required: true },
    showPhone: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    paymentMode: {
      type: String,
      enum: ["monthly", "annually", null],
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "adType",
  }
);

module.exports = mongoose.model("Ad", baseAdSchema);
