const mongoose = require("mongoose");
const BaseAd = require("./baseAd.model");
const {
  serviceCategoriesEnum,
  serviceSubCategoriesEnum,
  serviceTypeEnum,
} = require("../../utils/data");

const serviceAdSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: serviceCategoriesEnum },
  subCategory: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return serviceSubCategoriesEnum[this.category]?.includes(v);
      },
      message: (props) =>
        `${props.value} is not a valid subcategory for ${props.instance.category}`,
    },
  },
  servicePrice: { type: Number },
  serviceType: {
    type: String,
    enum: serviceTypeEnum,
  },
});

module.exports = BaseAd.discriminator("service", serviceAdSchema);
