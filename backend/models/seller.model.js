const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessType: {
      type: String,
      enum: ["individual", "business"],
      required: true,
    },
    // Common fields
    category: { type: String, required: true },

    // For individual
    city: { type: String },
    neighbourhood: { type: String },

    // For business
    name: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String },
    images: [{ type: String }],

    // Social links
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      youtube: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
