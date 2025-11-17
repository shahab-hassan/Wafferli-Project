const mongoose = require("mongoose");
const BaseAd = require("./baseAd.model");

const exploreAdSchema = new mongoose.Schema({
  exploreName: { type: String, required: true, maxLength: 70 },
  exploreDescription: { type: String, required: true, maxLength: 1000 },
  startTime: { type: String, default: null }, // HH:MM format
  endTime: { type: String, default: null }, // HH:MM format
});

module.exports = BaseAd.discriminator("explore", exploreAdSchema);
