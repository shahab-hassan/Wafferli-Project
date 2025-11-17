const Ad = require("../../models/ad/baseAd.model");
const mongoose = require("mongoose");
const Seller = require("../../models/seller.model");
const Review = require("../../models/ad/review.model");
const Favorite = require("../../models/ad/favorite.model");
const User = require("../../models/user.model");
const NotificationService = require("../../utils/notificationService");

const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");
const cloudinary = require("cloudinary").v2;
const {
  validateBaseFields,
  validateExploreFields,
  validateOfferFields,
  validateProductFields,
  validateEventFields,
  validateServiceFields,
} = require("../../utils/validation");
const {
  getFeaturedProducts,
  getProductDetails,
  getAllProducts,
  searchProducts,
} = require("./product.controller");

const {
  getFeaturedExplore,
  getExploreDetails,
  getAllExplore,
  searchExplore,
} = require("./explore.controller");

const {
  getFeaturedEvents,
  getEventDetails,
  getAllEvents,
  searchEvents,
} = require("./event.controller");

const {
  getFeaturedService,
  getServiceDetails,
  getAllService,
  searchService,
} = require("./service.controller");

const {
  getFeaturedFlashDeals,
  getOfferDetails,
  getAllOffers,
  searchAllOffers,
  claimOffer,
  searchFlashDeals,
  getAllFlashDeals,
  myClaimedOffers,
} = require("./offer.controller");
const {
  createNotificationsForNewAd,
} = require("../../utils/createNotification");

// const createAd = async (req, res, next) => {
//   try {
//     console.log("📥 Request received:", {
//       body: req.body,
//       files: req.files,
//       user: req.user,
//     });

//     const { adType } = req.body;

//     //  Validate adType
//     const allowedTypes = ["product", "service", "event", "offer", "explore"];
//     if (!adType || !allowedTypes.includes(adType)) {
//       console.log(" Invalid adType:", adType);
//       throw new ApiError(
//         400,
//         "adType is required and must be one of: " + allowedTypes.join(", ")
//       );
//     }

//     console.log(" adType validated:", adType);

//     //  Handle image uploads
//     let images = [];
//     if (req.files && req.files.images) {
//       console.log("📸 Files received:", req.files.images.length);
//       if (req.files.images.length > 5) {
//         throw new ApiError(400, "Maximum 5 images allowed");
//       }
//       images = req.files.images.map((file) => file.path);
//     }

//     console.log("🖼️ Images processed:", images);

//     //  Prepare ad data
//     const adData = {
//       ...req.body,
//       images,
//       userId: req.user ? req.user._id : null,
//     };

//     console.log("📦 Prepared adData:", adData);

//     //  Validate base fields
//     const baseErrors = validateBaseFields(adData);
//     if (baseErrors.length > 0) {
//       console.log(" Base validation errors:", baseErrors);
//       throw new ApiError(400, "Validation error", baseErrors);
//     }

//     console.log(" Base validation passed");

//     //  Validate specific ad type fields
//     let typeErrors = [];
//     switch (adType) {
//       case "offer":
//         console.log(" Validating offer fields...");
//         typeErrors = validateOfferFields(adData);
//         break;
//       case "product":
//         typeErrors = validateProductFields(adData);
//         break;
//       case "event":
//         typeErrors = validateEventFields(adData);
//         break;
//       case "service":
//         typeErrors = validateServiceFields(adData);
//         break;
//       case "explore":
//         typeErrors = validateExploreFields(adData);
//         break;
//       default:
//         typeErrors.push("Unknown adType");
//     }

//     console.log("🔍 Type validation errors:", typeErrors);

//     if (typeErrors.length > 0) {
//       throw new ApiError(400, "Validation errors", typeErrors);
//     }

//     console.log(" Type validation passed");

//     //  Handle locationSameAsProfile
//     if (
//       adData.locationSameAsProfile === "true" ||
//       adData.locationSameAsProfile === true
//     ) {
//       console.log(" Using profile location...");
//       const seller = await Seller.findOne({ userId: req.user?._id });
//       if (!seller) {
//         throw new ApiError(
//           404,
//           "You are not Seller firsly create seller profile"
//         );
//       }

//       adData.city = seller?.city || adData.city;
//       adData.neighbourhood = seller?.neighbourhood || adData.neighbourhood;
//     }

//     console.log("💾 Saving ad to database...");

//     //  Save ad
//     const newAd = new Ad(adData);
//     await newAd.save();

//     console.log(" Ad saved successfully:", newAd._id);

//     //  Send success response
//     return res
//       .status(201)
//       .json(new ApiResponse(201, newAd, "Ad created successfully"));
//   } catch (error) {
//     console.error("❌ CreateAd Error:", error);

//     // If it's an instance of ApiError (custom error)
//     if (error instanceof ApiError) {
//       console.log("⚠️ Sending ApiError response...");
//       return res.status(error.statusCode).json({
//         statusCode: error.statusCode,
//         message: error.message,
//         success: error.success,
//         data: error.data,
//         error: error.error, // 👈 use 'error' instead of 'errors'
//       });
//     }

//     // If it's a mongoose validation error
//     if (error.name === "ValidationError") {
//       console.log("⚠️ Sending Mongoose validation error response...");
//       const errors = Object.values(error.errors).map((err) => err.message);
//       return res.status(400).json({
//         statusCode: 400,
//         message: "Mongoose validation failed",
//         success: false,
//         data: null,
//         error: errors,
//       });
//     }

//     // Generic unknown error
//     console.log("⚠️ Sending generic error response...");
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Error creating ad",
//       success: false,
//       data: null,
//       error: [error.message],
//     });
//   }
// };

const createAd = async (req, res, next) => {
  try {
    console.log("📥 Request received:", {
      body: req.body,
      files: req.files,
      user: req.user,
    });

    const { adType } = req.body;

    // Validate adType
    const allowedTypes = ["product", "service", "event", "offer", "explore"];
    if (!adType || !allowedTypes.includes(adType)) {
      console.log("❌ Invalid adType:", adType);
      throw new ApiError(
        400,
        "adType is required and must be one of: " + allowedTypes.join(", ")
      );
    }

    console.log("✅ adType validated:", adType);

    // Handle image uploads
    let images = [];
    if (req.files && req.files.images) {
      console.log("📸 Files received:", req.files.images.length);
      if (req.files.images.length > 5) {
        throw new ApiError(400, "Maximum 5 images allowed");
      }
      images = req.files.images.map((file) => file.path);
    }

    console.log("🖼️ Images processed:", images);

    // Prepare ad data
    const adData = {
      ...req.body,
      images,
      userId: req.user ? req.user._id : null,
    };

    console.log("📦 Prepared adData:", adData);

    // Validate base fields
    const baseErrors = validateBaseFields(adData);
    if (baseErrors.length > 0) {
      console.log("❌ Base validation errors:", baseErrors);
      throw new ApiError(400, "Validation error", baseErrors);
    }

    console.log("✅ Base validation passed");

    // Validate specific ad type fields
    let typeErrors = [];
    switch (adType) {
      case "offer":
        console.log("🔍 Validating offer fields...");
        typeErrors = validateOfferFields(adData);
        break;
      case "product":
        typeErrors = validateProductFields(adData);
        break;
      case "event":
        typeErrors = validateEventFields(adData);
        break;
      case "service":
        typeErrors = validateServiceFields(adData);
        break;
      case "explore":
        typeErrors = validateExploreFields(adData);
        break;
      default:
        typeErrors.push("Unknown adType");
    }

    console.log("🔍 Type validation errors:", typeErrors);

    if (typeErrors.length > 0) {
      throw new ApiError(400, "Validation errors", typeErrors);
    }

    console.log("✅ Type validation passed");

    // Handle locationSameAsProfile
    if (
      adData.locationSameAsProfile === "true" ||
      adData.locationSameAsProfile === true
    ) {
      console.log("📍 Using profile location...");
      const seller = await Seller.findOne({ userId: req.user?._id });
      if (!seller) {
        throw new ApiError(
          404,
          "You are not Seller firstly create seller profile"
        );
      }

      adData.city = seller?.city || adData.city;
      adData.neighbourhood = seller?.neighbourhood || adData.neighbourhood;
    }

    console.log("💾 Saving ad to database...");

    // Save ad
    const newAd = new Ad(adData);
    await newAd.save();

    console.log("✅ Ad saved successfully:", newAd._id);

    // 🚀 NOTIFICATIONS AUTOMATICALLY CREATE KARO YAHAN SE
    console.log("🔔 Creating notifications for new ad...");
    await createNotificationsForNewAd(newAd);

    // Send success response
    return res
      .status(201)
      .json(new ApiResponse(201, newAd, "Ad created successfully"));
  } catch (error) {
    console.error("❌ CreateAd Error:", error);

    // If it's an instance of ApiError (custom error)
    if (error instanceof ApiError) {
      console.log("⚠️ Sending ApiError response...");
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: error.success,
        data: null,
        error: error.error,
      });
    }

    // If it's a mongoose validation error
    if (error.name === "ValidationError") {
      console.log("⚠️ Sending Mongoose validation error response...");
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        statusCode: 400,
        message: "Mongoose validation failed",
        success: false,
        data: null,
        error: errors,
      });
    }

    // Generic unknown error
    console.log("⚠️ Sending generic error response...");
    return res.status(500).json({
      statusCode: 500,
      message: "Error creating ad",
      success: false,
      data: null,
      error: [error.message],
    });
  }
};

const getAllMyAds = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const { adType, page = 1, limit = 10 } = req.query;

    const filter = { userId: userId };
    if (adType && adType !== "all") {
      filter.adType = adType;
    }

    let adsQuery = Ad.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const ads = await adsQuery;
    const totalAds = await Ad.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ads: ads,
          totalAds: totalAds,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalAds / limit),
          adType: adType || "all",
        },
        `User ${adType ? adType + " " : ""}ads retrieved successfully`
      )
    );
  } catch (error) {
    console.error("Error getting user ads:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error retrieving user ads", [error.message]).toJSON()
      );
  }
};

const getAdById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ad ID");
    }

    // Find ad by ID
    const ad = await Ad.findById(id);

    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ad: ad,
        },
        "Ad retrieved successfully"
      )
    );
  } catch (error) {
    console.error("Error getting ad by ID:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(new ApiError(500, "Error retrieving ad", [error.message]).toJSON());
  }
};

const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Multer se files aur body alag alag aate hain
    const updateData = req.body;
    const files = req.files;

    console.log("📥 Raw request body:", req.body);
    console.log("📁 Files:", files);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ad ID");
    }

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Check if ad exists and user owns it
    const existingAd = await Ad.findById(id);
    if (!existingAd) {
      throw new ApiError(404, "Ad not found");
    }

    if (existingAd.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only update your own ads");
    }

    let specificModel;

    switch (existingAd.adType) {
      case "explore":
        specificModel = require("../../models/ad/exploreAd.model");
        break;
      case "service":
        specificModel = require("../../models/ad/serviceAd.model");
        break;
      case "product":
        specificModel = require("../../models/ad/productAd.model");
        break;
      case "event":
        specificModel = require("../../models/ad/eventAd.model");
        break;
      case "offer":
        specificModel = require("../../models/ad/offerAd.model");
        break;
      default:
        specificModel = Ad;
        console.log(`ℹ️ Using base model for ad type: ${existingAd.adType}`);
    }

    // Remove forbidden fields
    const forbiddenFields = [
      "_id",
      "userId",
      "createdAt",
      "updatedAt",
      "__v",
      "adType",
    ];
    forbiddenFields.forEach((field) => {
      delete updateData[field];
    });

    // ✅ Debug: Log incoming data
    console.log("🔍 Incoming updateData:", updateData);

    // ✅ Handle array fields conversion (common issue with form data)
    const fieldsToConvert = [
      // Base fields
      "description",
      "title",
      // Explore fields
      "exploreDescription",
      "exploreName",
      // Service fields
      "serviceDescription",
      "serviceName",
      // Product fields
      "productDescription",
      "productName",
      // Event fields
      "eventDescription",
      "eventName",
      // Offer fields
      "offerDetail",
    ];

    fieldsToConvert.forEach((field) => {
      if (updateData[field] && Array.isArray(updateData[field])) {
        updateData[field] = updateData[field][0];
        console.log(
          `🔍 Converted ${field} from array to string:`,
          updateData[field]
        );
      }
    });

    // ✅ Handle featuresAmenities array for event ads
    if (updateData.featuresAmenities) {
      try {
        if (typeof updateData.featuresAmenities === "string") {
          updateData.featuresAmenities = JSON.parse(
            updateData.featuresAmenities
          );
        }
        console.log(
          `🔍 Processed featuresAmenities:`,
          updateData.featuresAmenities
        );
      } catch (error) {
        console.error("Error parsing featuresAmenities:", error);
        // Agar parse nahi ho saka, comma separated string ko array mein convert karo
        if (typeof updateData.featuresAmenities === "string") {
          updateData.featuresAmenities = updateData.featuresAmenities
            .split(",")
            .map((item) => item.trim());
        }
      }
    }

    // ✅ Start with existing images
    let finalImages = [...existingAd.images];

    // ✅ Handle removed existing images
    if (updateData.removedImages) {
      try {
        const removedIndices = JSON.parse(updateData.removedImages);
        finalImages = finalImages.filter(
          (_, idx) => !removedIndices.includes(idx)
        );
        console.log(
          `🗑️ Removed ${removedIndices.length} images, remaining: ${finalImages.length}`
        );
      } catch (parseError) {
        console.error("Error parsing removedImages:", parseError);
      }
      delete updateData.removedImages;
    }

    // ✅ Handle new uploaded images
    if (files && files.images && files.images.length > 0) {
      console.log("Processing new uploaded images:", files.images.length);

      for (const file of files.images) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "wafferli/uploads",
          });
          finalImages.push(result.secure_url);
          console.log(`✅ Uploaded image: ${result.secure_url}`);
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          throw new ApiError(500, "Error uploading images");
        }
      }
    }

    // ✅ Ensure we don't exceed max images (optional)
    const MAX_IMAGES = 10;
    if (finalImages.length > MAX_IMAGES) {
      console.log(
        `⚠️ Limiting images from ${finalImages.length} to ${MAX_IMAGES}`
      );
      finalImages = finalImages.slice(0, MAX_IMAGES);
    }

    // ✅ Update images array in updateData
    updateData.images = finalImages;

    // ✅ Handle boolean conversions for ALL models
    const booleanFields = [
      // Base fields
      "locationSameAsProfile",
      "showPhone",
      // Offer fields
      "flashDeal",
      "discountDeal",
      // Product fields
      "discount",
      "recurring",
    ];

    booleanFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updateData[field] =
          updateData[field] === "true" ||
          updateData[field] === true ||
          updateData[field] === "1";
        console.log(`🔧 Converted ${field} to boolean:`, updateData[field]);
      }
    });

    // ✅ Handle number conversions for ALL models
    const numberFields = [
      // Base fields
      "rating",
      "reviewsCount",
      "favoritesCount",
      // Service fields
      "servicePrice",
      // Product fields
      "quantity",
      "askingPrice",
      "discountPercent",
      // Offer fields
      "fullPrice",
      "discountPercent",
    ];

    numberFields.forEach((field) => {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== null &&
        updateData[field] !== ""
      ) {
        updateData[field] = parseFloat(updateData[field]);
        console.log(`🔧 Converted ${field} to number:`, updateData[field]);
      }
    });

    // ✅ Handle date conversions
    const dateFields = ["eventDate", "expiryDate"];
    dateFields.forEach((field) => {
      if (updateData[field]) {
        updateData[field] = new Date(updateData[field]);
        console.log(`🔧 Converted ${field} to Date:`, updateData[field]);
      }
    });

    // ✅ Handle time/string fields
    const timeFields = ["startTime", "endTime", "eventTime"];
    timeFields.forEach((field) => {
      if (updateData[field]) {
        updateData[field] = updateData[field].toString();
        console.log(`🔧 Processed ${field}:`, updateData[field]);
      }
    });

    // ✅ Handle enum fields validation
    if (updateData.eventType) {
      const validEventTypes = [
        "concert",
        "sports",
        "exhibition",
        "festival",
        "conference",
        "workshop",
        "party",
        "other",
      ];
      if (!validEventTypes.includes(updateData.eventType)) {
        throw new ApiError(
          400,
          `Invalid event type. Must be one of: ${validEventTypes.join(", ")}`
        );
      }
    }

    if (updateData.serviceType) {
      const validServiceTypes = [
        "consultation",
        "repair",
        "installation",
        "cleaning",
        "beauty",
        "fitness",
        "education",
        "healthcare",
        "technical",
        "creative",
        "transport",
        "event",
        "legal",
        "financial",
      ];
      if (!validServiceTypes.includes(updateData.serviceType)) {
        throw new ApiError(
          400,
          `Invalid service type. Must be one of: ${validServiceTypes.join(
            ", "
          )}`
        );
      }
    }

    if (updateData.paymentMode) {
      const validPaymentModes = ["monthly", "annually", null];
      if (!validPaymentModes.includes(updateData.paymentMode)) {
        throw new ApiError(
          400,
          `Invalid payment mode. Must be one of: monthly, annually`
        );
      }
    }

    // ✅ Handle offer-specific conditional validations
    if (existingAd.adType === "offer") {
      // Agar discountDeal true hay tou fullPrice aur discountPercent required
      if (updateData.discountDeal === true) {
        if (!updateData.fullPrice && !existingAd.fullPrice) {
          throw new ApiError(400, "fullPrice is required for discount deals");
        }
        if (!updateData.discountPercent && !existingAd.discountPercent) {
          throw new ApiError(
            400,
            "discountPercent is required for discount deals"
          );
        }
      }

      // Agar discountDeal false hay aur flashDeal bhi false hay tou offerDetail required
      if (updateData.discountDeal === false && updateData.flashDeal === false) {
        if (!updateData.offerDetail && !existingAd.offerDetail) {
          throw new ApiError(
            400,
            "offerDetail is required for non-discount, non-flash deals"
          );
        }
      }

      // Flash deal ke liye expiryDate automatically set karo agar nahi hay
      if (
        updateData.flashDeal === true &&
        !updateData.expiryDate &&
        !existingAd.expiryDate
      ) {
        updateData.expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        console.log(
          `🔧 Auto-set expiryDate for flash deal:`,
          updateData.expiryDate
        );
      }
    }

    console.log("✅ Final update data before save:", updateData);
    console.log("✅ Final images array:", finalImages);
    console.log(`🔧 Using model for ad type: ${existingAd.adType}`);

    // ✅ IMPORTANT: Use the specific model for update
    const updatedAd = await specificModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("✅ Successfully updated ad:", updatedAd._id);
    console.log("📋 Updated ad type:", updatedAd.adType);

    // Debug: Check specific fields based on ad type
    switch (existingAd.adType) {
      case "explore":
        console.log("🔍 Explore fields check:", {
          exploreName: updatedAd.exploreName,
          exploreDescription: updatedAd.exploreDescription,
          startTime: updatedAd.startTime,
          endTime: updatedAd.endTime,
        });
        break;
      case "event": {
        console.log("🔍 Event fields check:", {
          eventDate: updatedAd.eventDate,
          eventTime: updatedAd.eventTime,
          eventType: updatedAd.eventType,
          featuresAmenities: updatedAd.featuresAmenities,
        });
        // Notify nearby users about updated event
        const NotificationService = require("../../utils/notificationService");
        const eventNearbyUsers = await NotificationService.findNearbyUsers(
          updatedAd
        );
        if (eventNearbyUsers.length > 0) {
          await NotificationService.notifyNearbyEvent(
            updatedAd,
            eventNearbyUsers
          );
          console.log(
            `🎪 Sent updated event notifications to ${eventNearbyUsers.length} users`
          );
        }
        break;
      }
      case "offer": {
        console.log("🔍 Offer fields check:", {
          flashDeal: updatedAd.flashDeal,
          expiryDate: updatedAd.expiryDate,
          discountDeal: updatedAd.discountDeal,
          fullPrice: updatedAd.fullPrice,
          discountPercent: updatedAd.discountPercent,
          offerDetail: updatedAd.offerDetail,
        });
        // Notify users about updated offer/flash deal
        const NotificationService = require("../../utils/notificationService");
        if (updatedAd.discountPercent && updatedAd.discountPercent > 0) {
          await NotificationService.notifyNewFlashDeal(updatedAd);
          console.log(
            `🎁 Sent updated offer notifications for flash deal: ${updatedAd.title}`
          );
        }
        break;
      }
      case "product": {
        console.log("🔍 Product fields check:", {
          category: updatedAd.category,
          subCategory: updatedAd.subCategory,
          quantity: updatedAd.quantity,
          discount: updatedAd.discount,
          recurring: updatedAd.recurring,
          askingPrice: updatedAd.askingPrice,
          discountPercent: updatedAd.discountPercent,
        });
        // Notify nearby users about updated product
        const NotificationService = require("../../utils/notificationService");
        const nearbyUsers = await NotificationService.findNearbyUsers(
          updatedAd
        );
        if (nearbyUsers.length > 0) {
          await NotificationService.notifyNearbyProduct(updatedAd, nearbyUsers);
          console.log(
            `📍 Sent updated product notifications to ${nearbyUsers.length} users`
          );
        }
        // Notify city-based users
        await NotificationService.notifyDealInYourArea(
          updatedAd,
          updatedAd.city
        );
        console.log(
          `🏙️ Sent updated city-based notifications for ${updatedAd.city}`
        );
        break;
      }
      case "service": {
        console.log("🔍 Service fields check:", {
          category: updatedAd.category,
          subCategory: updatedAd.subCategory,
          servicePrice: updatedAd.servicePrice,
          serviceType: updatedAd.serviceType,
        });
        // Notify nearby users about updated service
        const NotificationService = require("../../utils/notificationService");
        const serviceNearbyUsers = await NotificationService.findNearbyUsers(
          updatedAd
        );
        if (serviceNearbyUsers.length > 0) {
          await NotificationService.notifyNearbyService(
            updatedAd,
            serviceNearbyUsers
          );
          console.log(
            `🔧 Sent updated service notifications to ${serviceNearbyUsers.length} users`
          );
        }
        break;
      }
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ad: updatedAd,
        },
        "Ad updated successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error updating ad:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json(new ApiError(400, "Validation error", errors).toJSON());
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      return res
        .status(400)
        .json(new ApiError(400, "Duplicate field value entered").toJSON());
    }

    return res
      .status(500)
      .json(new ApiError(500, "Error updating ad", [error.message]).toJSON());
  }
};
const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ad ID");
    }

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Check if ad exists and user owns it
    const existingAd = await Ad.findById(id);
    if (!existingAd) {
      throw new ApiError(404, "Ad not found");
    }

    if (existingAd.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own ads");
    }

    // ✅ Cloudinary se images delete karna
    if (existingAd.images && existingAd.images.length > 0) {
      try {
        for (const imageUrl of existingAd.images) {
          // Extract public_id from Cloudinary URL
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        }
      } catch (cloudinaryError) {
        console.error(
          "Error deleting images from Cloudinary:",
          cloudinaryError
        );
        // Continue with deletion even if image deletion fails
      }
    }

    // ✅ Favorites se bhi remove karna
    await Favorite.deleteMany({ adId: id });

    // ✅ Ad delete karna
    await Ad.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Ad deleted successfully"));
  } catch (error) {
    console.error("Error deleting ad:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(new ApiError(500, "Error deleting ad", [error.message]).toJSON());
  }
};

// Helper function to update ad rating statistics
const updateAdRatingStats = async (adId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { adId: mongoose.Types.ObjectId.createFromHexString(adId) } },
      {
        $group: {
          _id: "$adId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Ad.findByIdAndUpdate(adId, {
        rating: parseFloat(stats[0].averageRating.toFixed(1)),
        reviewsCount: stats[0].totalReviews,
      });
    }
  } catch (error) {
    console.error("Error updating ad rating stats:", error);
  }
};

// Add a new review
const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText, userName } = req.body;
    const userId = req.user?._id; // Assuming you have auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ad ID");
    }

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Validate input
    if (!rating || !reviewText) {
      throw new ApiError(400, "Rating and review text are required");
    }

    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    if (reviewText.trim().length === 0) {
      throw new ApiError(400, "Review text cannot be empty");
    }

    if (reviewText.length > 500) {
      throw new ApiError(400, "Review text cannot exceed 500 characters");
    }

    // Check if ad exists
    const ad = await Ad.findById(id);
    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    // Check if user is trying to review their own ad
    if (ad.userId && ad.userId.toString() === userId.toString()) {
      return res
        .status(403)
        .json(new ApiError(403, "You cannot review your own ad", []));
    }

    // Get user details (you might need to fetch from User model)
    const user = await mongoose
      .model("User")
      .findById(userId)
      .select("name avatar")
      .lean();

    // Create new review
    const newReview = new Review({
      adId: id,
      userId: userId,
      rating: parseInt(rating),
      reviewText: reviewText.trim(),
      userName: userName || user?.fullName || "Anonymous",
    });

    await newReview.save();

    // Update ad's rating and reviews count
    await updateAdRatingStats(id);

    return res
      .status(201)
      .json(new ApiResponse(201, newReview, "Review added successfully"));
  } catch (error) {
    console.error("Error adding review:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(new ApiError(500, "Error adding review", [error.message]).toJSON());
  }
};
// Get reviews for an ad with pagination
const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default 5 reviews per page
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const ratingFilter = req.query.rating ? parseInt(req.query.rating) : null;

    // Validate ObjectIdve
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ad ID");
    }

    // Build filter
    const filter = { adId: new mongoose.Types.ObjectId(id) };
    if (ratingFilter) {
      filter.rating = ratingFilter;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute all database calls in parallel
    const [reviews, totalReviews, ratingStats] = await Promise.all([
      // Get paginated reviews
      Review.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select("userId userName  rating reviewText likes createdAt")
        .lean(),

      // Get total count
      Review.countDocuments(filter),

      // Get rating statistics
      Review.aggregate([
        { $match: { adId: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: "$adId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: "$rating",
            },
          },
        },
      ]),
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [],
    };

    // Calculate rating distribution
    const ratingDistribution = {
      5: stats.ratingDistribution.filter((r) => r === 5).length,
      4: stats.ratingDistribution.filter((r) => r === 4).length,
      3: stats.ratingDistribution.filter((r) => r === 3).length,
      2: stats.ratingDistribution.filter((r) => r === 2).length,
      1: stats.ratingDistribution.filter((r) => r === 1).length,
    };

    const totalPages = Math.ceil(totalReviews / limit);

    const response = {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit: limit,
      },
      statistics: {
        averageRating: parseFloat(stats.averageRating.toFixed(1)),
        totalReviews: stats.totalReviews,
        ratingDistribution,
      },
    };

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Reviews fetched successfully"));
  } catch (error) {
    console.error("Error fetching reviews:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching reviews", [error.message]).toJSON()
      );
  }
};

// Like/Unlike a review
const toggleReviewLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid review ID");
    }

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    const hasLiked = review.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      review.likes = review.likes.filter((like) => !like.equals(userId));
    } else {
      // Like
      review.likes.push(userId);
    }

    await review.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likes: review.likes.length, hasLiked: !hasLiked },
          hasLiked ? "Review unliked successfully" : "Review liked successfully"
        )
      );
  } catch (error) {
    console.error("Error toggling review like:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error toggling review like", [
          error.message,
        ]).toJSON()
      );
  }
};

// Toggle favorite (Add/Remove)
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ad ID");
    }

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Check if ad exists
    const ad = await Ad.findById(id);
    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: userId,
      adId: id,
    });

    let isFavorited;
    let favoritesCount;

    if (existingFavorite) {
      // Remove from favorites
      await Favorite.findByIdAndDelete(existingFavorite._id);

      // Decrement favorites count
      await Ad.findByIdAndUpdate(id, {
        $inc: { favoritesCount: -1 },
      });

      isFavorited = false;
    } else {
      // Add to favorites
      await Favorite.create({
        userId: userId,
        adId: id,
        adType: ad.adType,
      });

      // Increment favorites count
      await Ad.findByIdAndUpdate(id, {
        $inc: { favoritesCount: 1 },
      });

      isFavorited = true;
    }

    // Get updated favorites count
    const updatedAd = await Ad.findById(id);
    favoritesCount = updatedAd.favoritesCount;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isFavorited,
          favoritesCount,
          adId: id, //  Ad ID bhi response mein bhejo
        },
        existingFavorite ? "Removed from favorites" : "Added to favorites"
      )
    );
  } catch (error) {
    console.error("Error toggling favorite:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error toggling favorite", [error.message]).toJSON()
      );
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    console.log("🟡 User ID:", userId);

    // Step 1: User ke favorites find karo
    const favorites = await Favorite.find({ userId: userId }).sort({
      createdAt: -1,
    });

    console.log("🟡 Favorites found:", favorites.length);

    if (favorites.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            favorites: [],
            count: 0,
          },
          "No favorites found"
        )
      );
    }

    // Step 2: Ad IDs nikaalo
    const adIds = favorites.map((fav) => fav.adId);
    console.log("🟡 Ad IDs:", adIds);

    // Step 3: Aggregation se pure documents lao
    const favoritesData = await Favorite.aggregate([
      // Current user ke favorites
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      // Sort by latest favorite
      {
        $sort: { createdAt: -1 },
      },
      // Lookup - ads collection se data lao
      {
        $lookup: {
          from: "ads", // Collection name
          localField: "adId",
          foreignField: "_id",
          as: "adData",
        },
      },
      // Unwind adData array
      {
        $unwind: "$adData",
      },
      // Replace root - combine favorite and ad data
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$adData", // All ad fields (base + specific)
              {
                favoritedAt: "$createdAt",
                favoriteId: "$_id",
                isFavorited: true,
              },
            ],
          },
        },
      },
    ]);

    console.log("🟡 Final favorites data:", favoritesData.length);
    console.log(
      "🟡 Sample ad:",
      favoritesData[0]
        ? {
            _id: favoritesData[0]._id,
            title: favoritesData[0].title,
            adType: favoritesData[0].adType,
            hasExtraFields:
              !!favoritesData[0].category || !!favoritesData[0].eventDate,
          }
        : "No data"
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          favorites: favoritesData,
          count: favoritesData.length,
        },
        favoritesData.length > 0
          ? "Favorites retrieved successfully"
          : "No active ads found in favorites"
      )
    );
  } catch (error) {
    console.error("🔴 Error getting favorites:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error retrieving favorites", [
          error.message,
        ]).toJSON()
      );
  }
};

// Get search suggestions (autocomplete)
const getSearchSuggestions = async (req, res) => {
  try {
    const { q: query, type = "all" } = req.query;

    if (!query || query.trim().length < 2) {
      return res
        .status(200)
        .json({ suggestions: [], message: "Query too short" });
    }

    const searchRegex = { $regex: query.trim(), $options: "i" };

    // Search by title, city, or neighbourhood
    const suggestions = await Ad.find({
      $or: [
        { title: searchRegex },
        { city: searchRegex },
        { neighbourhood: searchRegex },
      ],
    })
      .limit(8)
      .select("title city neighbourhood images adType _id") // fields we need
      .lean();

    const formatted = suggestions.map((ad) => ({
      id: ad._id,
      title: ad.title,
      city: ad.city,
      neighbourhood: ad.neighbourhood,
      image: ad.images?.[0] || null,
      adType: ad.adType,
    }));

    return res.status(200).json({
      success: true,
      data: { suggestions: formatted },
      message: "Search suggestions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching search suggestions",
      error: error.message,
    });
  }
};

const getSellerDetail = async (req, res) => {
  try {
    const { sellerId, adType, page = 1, limit = 10 } = req.query;

    if (!sellerId) {
      throw new ApiError(400, "sellerId is required");
    }

    let sellerDetails;

    // Try finding by _id first
    if (mongoose.Types.ObjectId.isValid(sellerId)) {
      sellerDetails = await Seller.findById(sellerId)
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
        )
        .lean();
    }

    // If not found by _id, try finding by userId
    if (!sellerDetails) {
      sellerDetails = await Seller.findOne({ userId: sellerId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
        )
        .lean();
    }

    console.log("Seller found:", sellerDetails);

    if (!sellerDetails) {
      throw new ApiError(404, "Seller not found");
    }

    // Use the actual userId from seller document for ads query
    const actualUserId = sellerDetails.userId;

    // Seller stats
    const sellerAdsCount = await Ad.countDocuments({ userId: actualUserId });
    sellerDetails.stats = {
      totalAds: sellerAdsCount,
      memberSince: sellerDetails.createdAt,
    };

    // Include user details if individual seller
    if (sellerDetails.businessType === "individual") {
      const user = await User.findById(actualUserId).select(
        "fullName email phone"
      );
      if (user) {
        sellerDetails.userDetails = {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        };
      }
    }

    // Ads filter - use the actual userId from seller document
    const adFilter = { userId: actualUserId };
    if (adType && adType !== "all") {
      adFilter.adType = adType;
    }

    const ads = await Ad.find(adFilter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const totalAds = await Ad.countDocuments(adFilter);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          seller: sellerDetails,
          ads,
          totalAds,
          currentPage: Number(page),
          totalPages: Math.ceil(totalAds / Number(limit)),
          adType: adType || "all",
        },
        `Seller ${adType ? adType + " " : ""}ads retrieved successfully`
      )
    );
  } catch (error) {
    console.error("Error getting seller ads:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error retrieving seller ads", [
          error.message,
        ]).toJSON()
      );
  }
};

module.exports = {
  createAd,
  getAllMyAds,
  getAdById,
  updateAd,
  deleteAd,
  getSearchSuggestions,
  getSellerDetail,
  // Products
  getFeaturedProducts,
  getProductDetails,
  getAllProducts,
  searchProducts,
  // Explore
  getFeaturedExplore,
  getExploreDetails,
  getAllExplore,
  searchExplore,
  // Events
  getFeaturedEvents,
  getEventDetails,
  getAllEvents,
  searchEvents,

  // Service
  getFeaturedService,
  getServiceDetails,
  getAllService,
  searchService,

  // Offers/FlashDeal
  getFeaturedFlashDeals,
  getOfferDetails,
  searchFlashDeals,
  getAllFlashDeals,
  getAllOffers,
  searchAllOffers,
  claimOffer,
  myClaimedOffers,
  // Review
  addReview,
  getReviews,
  toggleReviewLike,
  // Favorite
  toggleFavorite,
  getFavorites,
};
