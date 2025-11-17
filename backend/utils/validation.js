const mongoose = require("mongoose");

require("../models/ad/exploreAd.model");
require("../models/ad/productAd.model");
require("../models/ad/eventAd.model");
require("../models/ad/serviceAd.model");
require("../models/ad/offerAd.model");

// Validation helper functions
const isValidPhone = (phone) => /^\+?\d{10,15}$/.test(phone);
const isValidDate = (date) => !isNaN(Date.parse(date));
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateBaseFields = (data) => {
  const errors = [];

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim().length === 0
  ) {
    errors.push("Title is required and must be a non-empty string");
  }
  if (data.title && data.title.length > 100) {
    errors.push("Title must not exceed 100 characters");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    errors.push("Description is required and must be a non-empty string");
  }

  if (!data.locationSameAsProfile) {
    if (
      !data.city ||
      typeof data.city !== "string" ||
      data.city.trim().length === 0
    ) {
      errors.push("City is required and must be a non-empty string");
    }

    if (
      !data.neighbourhood ||
      typeof data.neighbourhood !== "string" ||
      data.neighbourhood.trim().length === 0
    ) {
      errors.push("Neighbourhood is required and must be a non-empty string");
    }
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push(
      "Phone is required and must be a valid phone number (10-15 digits, optional + prefix)"
    );
  }

  if (
    data.paymentMode &&
    !["monthly", "annually", null].includes(data.paymentMode)
  ) {
    errors.push("paymentMode must be 'monthly', 'annually', or null");
  }

  return errors;
};

const validateOfferFields = (data) => {
  const errors = [];

  if (!data.expiryDate || !isValidDate(data.expiryDate)) {
    errors.push("expiryDate is required and must be a valid date");
  } else if (new Date(data.expiryDate) < new Date()) {
    errors.push("expiryDate cannot be in the past");
  }

  if (!data.category) {
    errors.push("category is required");
  }
  if (!data.fullPrice) {
    errors.push("FullPrice is required");
  }

  if (data.discountDeal === true) {
    if (!data.fullPrice) {
      errors.push(
        "fullPrice is required for discountDeal and must be a positive number"
      );
    }
    if (
      !data.discountPercent ||
      data.discountPercent < 0 ||
      data.discountPercent > 100
    ) {
      errors.push(
        "discountPercent is required for discountDeal and must be between 0 and 100"
      );
    }
  }
  // ✅ offerDetail required only when discountDeal is false
  if (data.discountDeal === false) {
    if (
      !data.offerDetail ||
      typeof data.offerDetail !== "string" ||
      data.offerDetail.trim().length === 0
    ) {
      errors.push(
        "offerDetail is required when discountDeal is false and must be a non-empty string"
      );
    }
  }
  // ✅ limit length if present (always check if offerDetail exists)
  if (data.offerDetail && data.offerDetail.length > 70) {
    errors.push("offerDetail must not exceed 70 characters");
  }

  return errors;
};

const validateProductFields = (data) => {
  const errors = [];

  if (
    !data.category ||
    typeof data.category !== "string" ||
    data.category.trim().length === 0
  ) {
    errors.push("category is required and must be a non-empty string");
  }

  if (
    !data.subCategory ||
    typeof data.subCategory !== "string" ||
    data.subCategory.trim().length === 0
  ) {
    errors.push("subCategory is required and must be a non-empty string");
  }

  if (data.recurring === false) {
    if (!data.quantity || data.quantity < 10) {
      errors.push("Quantity is required and must be 10 or more");
    }
  }

  if (data.discount === false) {
    const percent = Number(data.discountPercent);
    if (!percent || percent <= 0 || percent > 100) {
      errors.push("discountPercent is required and must be between 1 and 100");
    }
  }
  // discount false ho toh koi error nahi

  return errors;
};

const validateEventFields = (data) => {
  const errors = [];

  if (!data.eventDate || !isValidDate(data.eventDate)) {
    errors.push("eventDate is required and must be a valid date");
  } else if (new Date(data.eventDate) < new Date()) {
    errors.push("eventDate cannot be in the past");
  }

  if (!data.eventTime || data.eventTime.trim().length === 0) {
    errors.push("eventTime is required and must be a non-empty string");
  }
  if (data.featuresAmenities && !Array.isArray(data.featuresAmenities)) {
    errors.push("featuresAmenities must be an array");
  }
  if (
    !data.eventType ||
    ![
      "concert",
      "sports",
      "exhibition",
      "festival",
      "conference",
      "workshop",
      "party",
      "other",
    ].includes(data.eventType)
  ) {
    errors.push(
      "eventType is required and must be 'concert', 'sports', or 'exhibition'"
    );
  }

  return errors;
};

const validateServiceFields = (data) => {
  const errors = [];

  if (
    !data.category ||
    typeof data.category !== "string" ||
    data.category.trim().length === 0
  ) {
    errors.push("category is required and must be a non-empty string");
  }

  if (
    !data.subCategory ||
    typeof data.subCategory !== "string" ||
    data.subCategory.trim().length === 0
  ) {
    errors.push("subCategory is required and must be a non-empty string");
  }

  return errors;
};

const validateExploreFields = (data) => {
  const errors = [];

  if (
    !data.exploreName ||
    typeof data.exploreName !== "string" ||
    data.exploreName.trim().length === 0
  ) {
    errors.push("exploreName is required and must be a non-empty string");
  } else if (data.exploreName && data.exploreName.length > 70) {
    errors.push("exploreName must not exceed 70 characters");
  }

  if (
    !data.exploreDescription ||
    typeof data.exploreDescription !== "string" ||
    data.exploreDescription.trim().length === 0
  ) {
    errors.push(
      "exploreDescription is required and must be a non-empty string"
    );
  } else if (data.exploreDescription && data.exploreDescription.length > 1000) {
    errors.push("exploreDescription must not exceed 1000 characters");
  }

  return errors;
};

module.exports = {
  validateBaseFields,
  validateOfferFields,
  validateProductFields,
  validateEventFields,
  validateServiceFields,
  validateExploreFields,
};
