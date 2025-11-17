const Seller = require("../models/seller.model");
const User = require("../models/user.model");
const { ApiResponse } = require("../utils/apiResponse");
const { ApiError } = require("../utils/apiError");
const { uploadToCloudinary } = require("../config/cloudinaryConfig");

// 🧾 Create Seller Profile
const createSeller = async (req, res) => {
  try {
    const {
      businessType,
      city,
      neighbourhood,
      category,
      name,
      description,
      website,
      socialLinks,
    } = req.body;

    const userId = req.user._id;

    if (!userId) throw new ApiError(400, "User ID is required");
    if (!businessType) throw new ApiError(400, "Business type is required");
    if (!category) throw new ApiError(400, "Category is required");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Check if seller profile already exists
    const existingSeller = await Seller.findOne({ userId });
    if (existingSeller)
      throw new ApiError(400, "You already created a seller profile");

    console.log(existingSeller, "existingSeller");

    let parsedSocialLinks = {};
    if (typeof socialLinks === "string") {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch (err) {
        parsedSocialLinks = { links: [socialLinks] };
      }
    } else if (Array.isArray(socialLinks)) {
      parsedSocialLinks = { links: socialLinks };
    }
    const sellerData = {
      userId,
      businessType,
      category,
      city,
      neighbourhood,
      socialLinks: parsedSocialLinks,
    };

    if (businessType === "individual") {
      sellerData.city = city;
      sellerData.neighbourhood = neighbourhood;
      sellerData.website = website;
    } else if (businessType === "business") {
      sellerData.name = name;
      sellerData.description = description;
      sellerData.website = website;

      // Upload logo
      if (req.files?.logo) {
        const uploadedLogo = await uploadToCloudinary(req.files.logo[0].path);
        sellerData.logo = uploadedLogo.secure_url;
      }

      // Upload images
      if (req.files?.images) {
        const uploadedImages = await Promise.all(
          req.files.images.map(async (img) => {
            const result = await uploadToCloudinary(img.path);
            return result.secure_url;
          })
        );
        sellerData.images = uploadedImages;
      }
    }

    const seller = await Seller.create(sellerData);

    // Update user role
    user.role = "seller";
    await user.save();

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          seller,
          user: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
          },
        },
        "Seller profile created successfully"
      )
    );
  } catch (error) {
    console.error("Create Seller Error:", error);
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new ApiResponse(status, null, error.message || "Internal Server Error")
      );
  }
};

module.exports = { createSeller };
