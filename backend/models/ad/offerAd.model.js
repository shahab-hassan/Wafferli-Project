const mongoose = require("mongoose");
const BaseAd = require("./baseAd.model");
const { offerCategoryEnum } = require("../../utils/data");

const offerAdSchema = new mongoose.Schema({
  flashDeal: {
    type: Boolean,
    default: false,
  },
  expiryDate: {
    type: Date,
    required: function () {
      return !this.flashDeal;
    },
  },
  category: {
    type: String,
    required: true,
    enum: offerCategoryEnum,
  },
  claimDeal: {
    type: Boolean,
    default: false,
  },
  discountDeal: {
    type: Boolean,
    default: false,
  },
  fullPrice: {
    type: Number,
    required: function () {
      return this.discountDeal;
    },
  },
  discountPercent: {
    type: Number,
    required: function () {
      return this.discountDeal;
    },
    min: 0,
    max: 100,
  },
  offerDetail: {
    type: String,
    required: function () {
      return !this.discountDeal;
    },
    maxLength: 70,
  },
});

// Pre-save middleware to set expiry date for flash deals
offerAdSchema.pre("save", function (next) {
  if (this.flashDeal && !this.expiryDate) {
    // Set expiry to 24 hours from creation
    this.expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = BaseAd.discriminator("offer", offerAdSchema);
