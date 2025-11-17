const mongoose = require("mongoose");
const BaseAd = require("./baseAd.model");
const { eventTypeEnum } = require("../../utils/data");

const eventAdSchema = new mongoose.Schema({
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  endTime: { type: String, required: true },
  eventType: {
    type: String,
    enum: eventTypeEnum,
    required: true,
  },
  featuresAmenities: { type: [String], default: [] },
});

module.exports = BaseAd.discriminator("event", eventAdSchema);
