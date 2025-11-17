const mongoose = require("mongoose");
const BaseAd = require("./baseAd.model");
const {
  productSubCategoriesEnum,
  productCategoriesEnum,
} = require("../../utils/data");

const productAdSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: productCategoriesEnum },
  subCategory: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return productSubCategoriesEnum[this.category]?.includes(v);
      },
      message: (props) =>
        `${props.value} is not a valid subcategory for ${props.instance.category}`,
    },
  },
  quantity: { type: Number, default: null },
  discount: { type: Boolean, default: false },
  recurring: { type: Boolean, default: false },
  askingPrice: { type: Number, required: true },
  discountPercent: { type: Number, default: null },
});

module.exports = BaseAd.discriminator("product", productAdSchema);
