const mongoose = require("mongoose");
const Ad = require("../../models/ad/baseAd.model");
const Seller = require("../../models/seller.model");
const Review = require("../../models/ad/review.model");
const Favorite = require("../../models/ad/favorite.model");
const User = require("../../models/user.model");
const ClaimOffer = require("../../models/ad/claimOffer.model");
const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");

// Common function to calculate discounted price (without decimal points)
const calculateDiscountedPrice = (ad) => {
  if (ad.discountDeal && ad.fullPrice && ad.discountPercent) {
    const discountedPrice =
      ad.fullPrice - (ad.fullPrice * ad.discountPercent) / 100;
    return Math.round(discountedPrice);
  }
  return null;
};

// Helper function to get user's claimed offer IDs
const getUserClaimedOfferIds = async (userId) => {
  if (!userId) return [];
  const claimedOffers = await ClaimOffer.find({ userId })
    .select("offerId")
    .lean();
  return claimedOffers.map((claim) => claim.offerId.toString());
};

// Enhanced utility function to process ads with favorites, discount, and claim status
const processAdsWithDiscountFavoritesAndClaims = async (
  ads,
  userId = null,
  favoriteAdIds = [],
  claimedOfferIds = []
) => {
  // Handle empty or invalid ads array
  if (!ads || !Array.isArray(ads) || ads.length === 0) {
    return [];
  }

  // Get claim counts for all offers
  const offerIds = ads.map((ad) => ad._id);

  let claimCounts = [];
  if (offerIds.length > 0) {
    claimCounts = await ClaimOffer.aggregate([
      { $match: { offerId: { $in: offerIds } } },
      { $group: { _id: "$offerId", count: { $sum: 1 } } },
    ]);
  }

  const claimCountMap = {};
  claimCounts.forEach((claim) => {
    claimCountMap[claim._id.toString()] = claim.count;
  });

  return ads.map((ad) => {
    const discountedPrice = calculateDiscountedPrice(ad);
    const adId = ad._id.toString();

    return {
      ...ad,
      discountedPrice: discountedPrice,
      isFavorited: favoriteAdIds.includes(adId),
      isClaimed: claimedOfferIds.includes(adId),
      totalClaims: claimCountMap[adId] || 0,
      claimDeal: claimedOfferIds.includes(adId), // Add claimDeal status
    };
  });
};

const generateClaimCode = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

// Check if claim code is unique
const generateUniqueClaimCode = async () => {
  let claimCode;
  let isUnique = false;

  while (!isUnique) {
    claimCode = generateClaimCode();
    const existingClaim = await ClaimOffer.findOne({ claimCode });
    if (!existingClaim) {
      isUnique = true;
    }
  }

  return claimCode;
};
const generateReferralCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WF-${random}`;
};

const claimOffer = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { offerId, termsAndConditions, notification, loyaltyPoints } =
      req.body;

    if (!userId) throw new ApiError(401, "User not authenticated");
    if (!loyaltyPoints) throw new ApiError(401, "loyaltyPoints is required");
    if (!offerId) throw new ApiError(400, "Offer ID is required");
    if (!termsAndConditions)
      throw new ApiError(400, "Please accept terms & conditions");

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      throw new ApiError(400, "Invalid offer ID");
    }

    const offer = await Ad.findOne({
      _id: offerId,
      adType: "offer",
      expiryDate: { $gt: new Date() },
    });

    if (!offer) throw new ApiError(404, "Offer not found or expired");

    // Check if already claimed
    const existingClaim = await ClaimOffer.findOne({ userId, offerId });
    if (existingClaim) {
      throw new ApiError(409, "Already claimed", {
        claimCode: existingClaim.claimCode,
      });
    }

    // Generate claim code
    const claimCode = await generateUniqueClaimCode();

    // ⭐ Update user total loyalty points
    const user = await User.findById(userId);
    user.totalloyaltiyPoints =
      (user.totalloyaltiyPoints || 0) + (loyaltyPoints || 0);
    await user.save();

    // ⭐ Save offer loyalty points separately
    const claimRecord = await ClaimOffer.create({
      userId,
      offerId,
      claimCode,
      termsAndConditions,
      notification: notification || false,
      loyaltyPoints: loyaltyPoints,
    });

    await Ad.findByIdAndUpdate(offerId, { claimDeal: true });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          claimId: claimRecord._id,
          claimCode,
          offerId,
          loyaltyPoints: claimRecord.loyaltyPoints, // ⭐ THIS OFFER POINTS
          totalUserPoints: user.totalloyaltiyPoints, // ⭐ USER TOTAL POINTS
          claimedAt: claimRecord.claimedAt,
        },
        "Offer claimed successfully"
      )
    );
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError)
      return res.status(error.statusCode).json(error.toJSON());

    if (error.code === 11000) {
      return res
        .status(409)
        .json(new ApiError(409, "Already claimed this offer").toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error claiming offer", [error.message]).toJSON()
      );
  }
};

// Get user's claimed offers
const myClaimedOffers = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) throw new ApiError(401, "User not authenticated");

    // Fetch User
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Generate referral code if missing
    if (!user.referralCode) {
      user.referralCode = generateReferralCode();
      await user.save();
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await ClaimOffer.countDocuments({ userId });

    // Fetch claimed offers
    const claimedOffers = await ClaimOffer.find({ userId })
      .sort({ claimedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate({
        path: "offerId",
        select:
          "title images description category city neighbourhood expiryDate fullPrice discountPercent offerDetail claimDeal userId",
      })
      .lean();

    // Attach seller info
    for (let offer of claimedOffers) {
      if (offer.offerId?.userId) {
        const seller = await Seller.findOne({ userId: offer.offerId.userId })
          .select(
            "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
          )
          .lean();

        if (seller) {
          const sellerUser = await User.findById(seller.userId).select(
            "fullName email phone"
          );

          offer.seller = {
            ...seller,
            userDetails: sellerUser || null,
          };
        }
      }
    }

    // ⭐ USER TOTAL POINTS
    const totalPoints = user.totalloyaltiyPoints || 0;

    // ⭐ MEMBERSHIP LEVEL
    let membershipStatus = "Bronze";
    if (totalPoints > 3000) membershipStatus = "Diamond";
    else if (totalPoints > 2000) membershipStatus = "Gold";
    else if (totalPoints > 1000) membershipStatus = "Silver";

    // ⭐ FINAL RESPONSE
    const responseData = {
      user: {
        name: user.fullName,
        email: user.email,
        referralCode: user.referralCode,
      },

      loyaltySummary: {
        totalPoints,
        membershipStatus,
      },

      claims: claimedOffers, // contains loyaltyPoints per offer

      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Claimed offers fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching claimed offers:", error);

    if (error instanceof ApiError)
      return res.status(error.statusCode).json(error.toJSON());

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching claimed offers", [
          error.message,
        ]).toJSON()
      );
  }
};

// Search offers by title with seller info
const searchClaimOffers = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Fetch all claimed offers of user first
    let claimedOffers = await ClaimOffer.find({ userId })
      .sort({ claimedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate({
        path: "offerId",
        select:
          "title images description category city neighbourhood expiryDate fullPrice discountPercent offerDetail claimDeal userId",
      })
      .lean();

    // Filter by search after populate
    if (query) {
      const regex = new RegExp(query, "i");
      claimedOffers = claimedOffers.filter(
        (offer) => offer.offerId && regex.test(offer.offerId.title)
      );
    }

    // Total count (after filtering)
    const totalCount = claimedOffers.length;

    // Attach seller info
    for (let offer of claimedOffers) {
      if (offer.offerId?.userId) {
        const seller = await Seller.findOne({ userId: offer.offerId.userId })
          .select(
            "businessType name description logo website images socialLinks category city neighbourhood createdAt"
          )
          .lean();
        if (seller) {
          const sellerUser = await User.findById(seller.userId).select(
            "fullName email phone"
          );
          offer.seller = {
            ...seller,
            userDetails: sellerUser
              ? {
                  fullName: sellerUser.fullName,
                  email: sellerUser.email,
                  phone: sellerUser.phone,
                }
              : null,
          };
        }
      }
    }

    return res.status(200).json({
      status: 200,
      data: {
        claims: claimedOffers,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
      message: "Claimed offers fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching claimed offers:", error);
    return res.status(500).json({
      status: 500,
      message: "Error fetching claimed offers",
      errors: [error.message],
    });
  }
};

const getAllFlashDeals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      city,
      neighbourhood,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      sortBy = "newest",
      search,
    } = req.query;

    const userId = req.user?._id;

    const filter = {
      adType: "offer",
      flashDeal: true, // ONLY FLASH DEALS
      expiryDate: { $gt: new Date() },
    };

    // Apply all filters
    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (city && city !== "") {
      filter.city = { $regex: city, $options: "i" };
    }
    if (neighbourhood && neighbourhood !== "") {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }
    if (minPrice || maxPrice) {
      filter.fullPrice = {};
      if (minPrice && minPrice !== "0")
        filter.fullPrice.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice !== "0")
        filter.fullPrice.$lte = parseFloat(maxPrice);
    }
    if (minDiscount || maxDiscount) {
      filter.discountPercent = {};
      if (minDiscount && minDiscount !== "0")
        filter.discountPercent.$gte = parseFloat(minDiscount);
      if (maxDiscount && maxDiscount !== "0")
        filter.discountPercent.$lte = parseFloat(maxDiscount);
    }
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { neighbourhood: { $regex: search, $options: "i" } },
        { offerDetail: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions.createdAt = -1;
        break;
      case "oldest":
        sortOptions.createdAt = 1;
        break;
      case "rating":
        sortOptions.rating = -1;
        break;
      case "reviews":
        sortOptions.reviewsCount = -1;
        break;
      case "name":
        sortOptions.title = 1;
        break;
      case "priceLowToHigh":
        sortOptions.fullPrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.fullPrice = -1;
        break;
      case "discountHighToLow":
        sortOptions.discountPercent = -1;
        break;
      case "discountLowToHigh":
        sortOptions.discountPercent = 1;
        break;
      case "expirySoon":
        sortOptions.expiryDate = 1;
        break;
      case "mostClaimed":
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Ad.countDocuments(filter);

    const flashDeals = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt flashDeal expiryDate discountDeal fullPrice discountPercent offerDetail adType category userId claimDeal"
      )
      .lean();

    let favoriteAdIds = [];
    let claimedOfferIds = [];

    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: flashDeals.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();
      favoriteAdIds = favorites.map((fav) => fav.adId.toString());

      claimedOfferIds = await getUserClaimedOfferIds(userId);
    }

    // Process flash deals with seller details
    const flashDealsWithSellerDetails = await Promise.all(
      flashDeals.map(async (deal) => {
        let sellerDetails = null;

        if (deal.userId) {
          sellerDetails = await Seller.findOne({ userId: deal.userId })
            .select(
              "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
            )
            .lean();

          if (sellerDetails) {
            const sellerAds = await Ad.find({ userId: deal.userId });
            const totalAds = sellerAds.length;

            sellerDetails.stats = {
              totalAds,
              memberSince: sellerDetails.createdAt,
            };

            if (sellerDetails.businessType === "individual") {
              const user = await User.findById(sellerDetails.userId)
                .select("fullName email phone profilePicture")
                .lean();

              if (user) {
                sellerDetails.userDetails = {
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  profilePicture: user.profilePicture,
                };
              }
            }
          }
        }

        return {
          ...deal,
          sellerDetails,
        };
      })
    );

    // Apply claim status and counts
    const processedFlashDeals = await processAdsWithDiscountFavoritesAndClaims(
      flashDealsWithSellerDetails,
      userId,
      favoriteAdIds,
      claimedOfferIds
    );

    // Sort by most claimed if requested
    let finalFlashDeals = processedFlashDeals;
    if (sortBy === "mostClaimed") {
      finalFlashDeals = processedFlashDeals.sort(
        (a, b) => b.totalClaims - a.totalClaims
      );
    }

    // Get available filters
    const availableFilters = await Ad.aggregate([
      { $match: { ...filter, flashDeal: true } },
      {
        $facet: {
          categories: [
            { $match: { category: { $exists: true, $ne: "" } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          cities: [
            { $match: { city: { $exists: true, $ne: "" } } },
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          neighbourhoods: [
            { $match: { neighbourhood: { $exists: true, $ne: "" } } },
            { $group: { _id: "$neighbourhood", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          priceStats: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$fullPrice" },
                maxPrice: { $max: "$fullPrice" },
                avgPrice: { $avg: "$fullPrice" },
              },
            },
          ],
          discountStats: [
            {
              $group: {
                _id: null,
                minDiscount: { $min: "$discountPercent" },
                maxDiscount: { $max: "$discountPercent" },
                avgDiscount: { $avg: "$discountPercent" },
              },
            },
          ],
        },
      },
    ]);

    const priceStats = availableFilters[0]?.priceStats[0] || {};
    const discountStats = availableFilters[0]?.discountStats[0] || {};

    const responseData = {
      flashDeals: finalFlashDeals,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
      filters: {
        categories: availableFilters[0]?.categories || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        priceRange: {
          minPrice: priceStats.minPrice || 0,
          maxPrice: priceStats.maxPrice || 1000,
          avgPrice: priceStats.avgPrice || 0,
        },
        discountRange: {
          minDiscount: discountStats.minDiscount || 0,
          maxDiscount: discountStats.maxDiscount || 100,
          avgDiscount: discountStats.avgDiscount || 0,
        },
      },
      appliedFilters: {
        category,
        city,
        neighbourhood,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        search,
        sortBy,
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Flash deals fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching flash deals:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching flash deals", [
          error.message,
        ]).toJSON()
      );
  }
};

// Search flash deals (NEW API)
const searchFlashDeals = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 12,
      category,
      city,
      neighbourhood,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      sortBy = "relevance",
    } = req.query;

    const userId = req.user?._id;

    // Build search filter - ONLY FLASH DEALS
    const filter = {
      adType: "offer",
      flashDeal: true, // Only search flash deals
      expiryDate: { $gt: new Date() },
    };

    // Search query
    if (query && query.trim() !== "") {
      const searchRegex = { $regex: query.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { neighbourhood: searchRegex },
        { offerDetail: searchRegex },
      ];
    }

    // Additional filters
    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (city && city !== "") {
      filter.city = { $regex: city, $options: "i" };
    }
    if (neighbourhood && neighbourhood !== "") {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }

    // Rating filter
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.fullPrice = {};
      if (minPrice && minPrice !== "0")
        filter.fullPrice.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice !== "0")
        filter.fullPrice.$lte = parseFloat(maxPrice);
    }

    // Discount filter
    if (minDiscount || maxDiscount) {
      filter.discountPercent = {};
      if (minDiscount && minDiscount !== "0")
        filter.discountPercent.$gte = parseFloat(minDiscount);
      if (maxDiscount && maxDiscount !== "0")
        filter.discountPercent.$lte = parseFloat(maxDiscount);
    }

    // Sort options
    const sortOptions = {};
    switch (sortBy) {
      case "relevance":
        if (query) {
          sortOptions.createdAt = -1;
        } else {
          sortOptions.createdAt = -1;
        }
        break;
      case "newest":
        sortOptions.createdAt = -1;
        break;
      case "discount":
      case "discountHighToLow":
        sortOptions.discountPercent = -1;
        break;
      case "expirySoon":
      case "ending":
        sortOptions.expiryDate = 1;
        break;
      case "popular":
        sortOptions.reviewsCount = -1;
        break;
      case "rating":
        sortOptions.rating = -1;
        break;
      case "priceLowToHigh":
        sortOptions.fullPrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.fullPrice = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const totalCount = await Ad.countDocuments(filter);

    // Get search results
    let flashDeals = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt flashDeal expiryDate discountDeal fullPrice discountPercent offerDetail adType category userId claimDeal"
      )
      .lean();

    // Calculate relevance score for search results
    if (query && sortBy === "relevance") {
      flashDeals = flashDeals.map((deal) => {
        let score = 0;
        const searchTerm = query.toLowerCase();

        if (deal.title?.toLowerCase().includes(searchTerm)) score += 10;
        if (deal.category?.toLowerCase().includes(searchTerm)) score += 8;
        if (deal.description?.toLowerCase().includes(searchTerm)) score += 5;
        if (deal.city?.toLowerCase().includes(searchTerm)) score += 3;
        if (deal.neighbourhood?.toLowerCase().includes(searchTerm)) score += 2;
        if (deal.offerDetail?.toLowerCase().includes(searchTerm)) score += 6;

        // Bonus for exact matches and high discounts
        if (deal.title?.toLowerCase() === searchTerm) score += 5;
        if (deal.discountPercent > 50) score += 3;

        return { ...deal, score };
      });

      flashDeals.sort((a, b) => b.score - a.score);
    }

    let favoriteAdIds = [];
    let claimedOfferIds = [];

    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: flashDeals.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();
      favoriteAdIds = favorites.map((fav) => fav.adId.toString());

      claimedOfferIds = await getUserClaimedOfferIds(userId);
    }

    // Process flash deals with seller details
    const flashDealsWithSellerDetails = await Promise.all(
      flashDeals.map(async (deal) => {
        let sellerDetails = null;

        if (deal.userId) {
          sellerDetails = await Seller.findOne({ userId: deal.userId })
            .select(
              "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
            )
            .lean();

          if (sellerDetails) {
            const sellerAds = await Ad.find({ userId: deal.userId });
            const totalAds = sellerAds.length;

            sellerDetails.stats = {
              totalAds,
              memberSince: sellerDetails.createdAt,
            };

            if (sellerDetails.businessType === "individual") {
              const user = await User.findById(sellerDetails.userId)
                .select("fullName email phone profilePicture")
                .lean();

              if (user) {
                sellerDetails.userDetails = {
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  profilePicture: user.profilePicture,
                };
              }
            }
          }
        }

        return {
          ...deal,
          sellerDetails,
        };
      })
    );

    const processedFlashDeals = await processAdsWithDiscountFavoritesAndClaims(
      flashDealsWithSellerDetails,
      userId,
      favoriteAdIds,
      claimedOfferIds
    );

    const responseData = {
      flashDeals: processedFlashDeals,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
      searchSummary: {
        query: query || null,
        totalResults: totalCount,
        searchTime: new Date().toISOString(),
      },
      appliedFilters: {
        query,
        category,
        city,
        neighbourhood,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        sortBy,
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Flash deals search completed successfully"
        )
      );
  } catch (error) {
    console.error("Error searching flash deals:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(500)
      .json(
        new ApiError(500, "Error searching flash deals", [
          error.message,
        ]).toJSON()
      );
  }
};

// Updated getFeaturedFlashDeals with claim status
const getFeaturedFlashDeals = async (req, res) => {
  try {
    const userId = req.user?._id;

    const flashDealAds = await Ad.find({
      adType: "offer",
      flashDeal: true,
      expiryDate: { $gt: new Date() },
    })
      .limit(8)
      .sort({ createdAt: -1 })
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt flashDeal expiryDate discountDeal fullPrice category discountPercent offerDetail adType claimDeal userId"
      )
      .lean();

    let favoriteAdIds = [];
    let claimedOfferIds = [];

    if (userId) {
      // Get favorites
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: flashDealAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();
      favoriteAdIds = favorites.map((fav) => fav.adId.toString());

      // Get claimed offers
      claimedOfferIds = await getUserClaimedOfferIds(userId);
    }

    // Get seller details
    const flashDealsWithSellerDetails = await Promise.all(
      flashDealAds.map(async (deal) => {
        let sellerDetails = null;

        if (deal.userId) {
          sellerDetails = await Seller.findOne({ userId: deal.userId })
            .select(
              "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
            )
            .lean();

          if (sellerDetails) {
            const sellerAds = await Ad.find({ userId: deal.userId });
            const totalAds = sellerAds.length;

            sellerDetails.stats = {
              totalAds,
              memberSince: sellerDetails.createdAt,
            };

            if (sellerDetails.businessType === "individual") {
              const user = await User.findById(sellerDetails.userId)
                .select("fullName email phone profilePicture")
                .lean();

              if (user) {
                sellerDetails.userDetails = {
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  profilePicture: user.profilePicture,
                };
              }
            }
          }
        }

        return {
          ...deal,
          sellerDetails,
        };
      })
    );
    const flashDealsWithDetails =
      await processAdsWithDiscountFavoritesAndClaims(
        flashDealsWithSellerDetails,
        userId,
        favoriteAdIds,
        claimedOfferIds
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          flashDealsWithDetails,
          "Featured flash deals fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching featured flash deals:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching featured flash deals", [
          error.message,
        ]).toJSON()
      );
  }
};

const getAllOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      city,
      neighbourhood,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      sortBy = "newest",
      search,
    } = req.query;

    const userId = req.user?._id;

    const filter = {
      adType: "offer",
      flashDeal: false,
      expiryDate: { $gt: new Date() },
    };

    // Apply all filters
    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (city && city !== "") {
      filter.city = { $regex: city, $options: "i" };
    }
    if (neighbourhood && neighbourhood !== "") {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }
    if (minPrice || maxPrice) {
      filter.fullPrice = {};
      if (minPrice && minPrice !== "0")
        filter.fullPrice.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice !== "0")
        filter.fullPrice.$lte = parseFloat(maxPrice);
    }
    if (minDiscount || maxDiscount) {
      filter.discountPercent = {};
      if (minDiscount && minDiscount !== "0")
        filter.discountPercent.$gte = parseFloat(minDiscount);
      if (maxDiscount && maxDiscount !== "0")
        filter.discountPercent.$lte = parseFloat(maxDiscount);
    }
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { neighbourhood: { $regex: search, $options: "i" } },
        { offerDetail: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions.createdAt = -1;
        break;
      case "oldest":
        sortOptions.createdAt = 1;
        break;
      case "rating":
        sortOptions.rating = -1;
        break;
      case "reviews":
        sortOptions.reviewsCount = -1;
        break;
      case "name":
        sortOptions.title = 1;
        break;
      case "priceLowToHigh":
        sortOptions.fullPrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.fullPrice = -1;
        break;
      case "discountHighToLow":
        sortOptions.discountPercent = -1;
        break;
      case "discountLowToHigh":
        sortOptions.discountPercent = 1;
        break;
      case "mostClaimed":
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Ad.countDocuments(filter);

    const offers = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt flashDeal expiryDate discountDeal fullPrice discountPercent offerDetail adType category userId claimDeal"
      )
      .lean();

    let favoriteAdIds = [];
    let claimedOfferIds = [];

    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: offers.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();
      favoriteAdIds = favorites.map((fav) => fav.adId.toString());

      claimedOfferIds = await getUserClaimedOfferIds(userId);
    }

    // Process offers with seller details
    const offersWithSellerDetails = await Promise.all(
      offers.map(async (offer) => {
        let sellerDetails = null;

        if (offer.userId) {
          sellerDetails = await Seller.findOne({ userId: offer.userId })
            .select(
              "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
            )
            .lean();

          if (sellerDetails) {
            const sellerAds = await Ad.find({ userId: offer.userId });
            const totalAds = sellerAds.length;

            sellerDetails.stats = {
              totalAds,
              memberSince: sellerDetails.createdAt,
            };

            if (sellerDetails.businessType === "individual") {
              const user = await User.findById(sellerDetails.userId)
                .select("fullName email phone profilePicture")
                .lean();

              if (user) {
                sellerDetails.userDetails = {
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  profilePicture: user.profilePicture,
                };
              }
            }
          }
        }

        return {
          ...offer,
          sellerDetails,
        };
      })
    );

    // Apply claim status and counts
    const processedOffers = await processAdsWithDiscountFavoritesAndClaims(
      offersWithSellerDetails,
      userId,
      favoriteAdIds,
      claimedOfferIds
    );

    // Sort by most claimed if requested
    let finalOffers = processedOffers;
    if (sortBy === "mostClaimed") {
      finalOffers = processedOffers.sort(
        (a, b) => b.totalClaims - a.totalClaims
      );
    }

    // Get available filters
    const availableFilters = await Ad.aggregate([
      { $match: { ...filter, flashDeal: false } },
      {
        $facet: {
          categories: [
            { $match: { category: { $exists: true, $ne: "" } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          cities: [
            { $match: { city: { $exists: true, $ne: "" } } },
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          neighbourhoods: [
            { $match: { neighbourhood: { $exists: true, $ne: "" } } },
            { $group: { _id: "$neighbourhood", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          priceStats: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$fullPrice" },
                maxPrice: { $max: "$fullPrice" },
                avgPrice: { $avg: "$fullPrice" },
              },
            },
          ],
          discountStats: [
            {
              $group: {
                _id: null,
                minDiscount: { $min: "$discountPercent" },
                maxDiscount: { $max: "$discountPercent" },
                avgDiscount: { $avg: "$discountPercent" },
              },
            },
          ],
        },
      },
    ]);

    const priceStats = availableFilters[0]?.priceStats[0] || {};
    const discountStats = availableFilters[0]?.discountStats[0] || {};

    const responseData = {
      offers: finalOffers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
      filters: {
        categories: availableFilters[0]?.categories || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        priceRange: {
          minPrice: priceStats.minPrice || 0,
          maxPrice: priceStats.maxPrice || 1000,
          avgPrice: priceStats.avgPrice || 0,
        },
        discountRange: {
          minDiscount: discountStats.minDiscount || 0,
          maxDiscount: discountStats.maxDiscount || 100,
          avgDiscount: discountStats.avgDiscount || 0,
        },
      },
      appliedFilters: {
        category,
        city,
        neighbourhood,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        search,
        sortBy,
      },
    };

    return res
      .status(200)
      .json(new ApiResponse(200, responseData, "Offers fetched successfully"));
  } catch (error) {
    console.error("Error fetching offers:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching offers", [error.message]).toJSON()
      );
  }
};

// Updated getOfferDetails with claim status
const getOfferDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid offer ID");
    }

    const offer = await Ad.findOne({ _id: id, adType: "offer" }).lean();
    if (!offer) {
      throw new ApiError(404, "Offer not found");
    }

    const offerDiscountedPrice = calculateDiscountedPrice(offer);

    let isFavorited = false;
    let isClaimed = false;

    if (userId) {
      const favorite = await Favorite.findOne({
        userId: userId,
        adId: id,
      });
      isFavorited = !!favorite;

      // Check if user has claimed this offer
      const claim = await ClaimOffer.findOne({
        userId: userId,
        offerId: id,
      });
      isClaimed = !!claim;
    }

    // Get total claims count
    const totalClaims = await ClaimOffer.countDocuments({ offerId: id });

    // Get reviews statistics
    const reviewsStats = await Review.aggregate([
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
    ]);

    const stats = reviewsStats[0] || {
      averageRating: offer.rating || 0,
      totalReviews: offer.reviewsCount || 0,
      ratingDistribution: [],
    };

    const ratingDistribution = {
      5: stats.ratingDistribution.filter((r) => r === 5).length,
      4: stats.ratingDistribution.filter((r) => r === 4).length,
      3: stats.ratingDistribution.filter((r) => r === 3).length,
      2: stats.ratingDistribution.filter((r) => r === 2).length,
      1: stats.ratingDistribution.filter((r) => r === 1).length,
    };

    offer.rating = stats.averageRating
      ? parseFloat(stats.averageRating.toFixed(1))
      : 0;
    offer.reviewsCount = stats.totalReviews || 0;

    // Get seller details
    let sellerDetails = null;
    if (offer.userId) {
      sellerDetails = await Seller.findOne({ userId: offer.userId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
        )
        .lean();

      if (sellerDetails) {
        const sellerAds = await Ad.find({ userId: offer.userId });
        const totalAds = sellerAds.length;

        const user = await User.findById(sellerDetails.userId).select(
          "fullName email phone"
        );
        if (sellerDetails.businessType === "individual" && user) {
          sellerDetails.userDetails = {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
          };
        }
        sellerDetails.stats = {
          totalAds,
          memberSince: sellerDetails.createdAt,
        };

        if (sellerDetails.businessType === "individual") {
          const user = await User.findById(sellerDetails.userId)
            .select("fullName email phone")
            .lean();

          if (user) {
            sellerDetails.userDetails = {
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
            };
          }
        }
      }
    }

    // Get related offers
    const relatedOffers = await Ad.find({
      _id: { $ne: id },
      adType: "offer",
      category: offer.category,
    })
      .limit(4)
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt flashDeal expiryDate discountDeal fullPrice discountPercent offerDetail adType claimDeal userId"
      )
      .lean();

    let relatedFavoriteAdIds = [];
    let relatedClaimedOfferIds = [];

    if (userId) {
      const favoriteAds = await Favorite.find({
        userId: userId,
        adId: { $in: relatedOffers.map((offer) => offer._id) },
      })
        .select("adId")
        .lean();
      relatedFavoriteAdIds = favoriteAds.map((fav) => fav.adId.toString());

      relatedClaimedOfferIds = await getUserClaimedOfferIds(userId);
    }

    // Process related offers with seller details
    const relatedOffersWithSellerDetails = await Promise.all(
      relatedOffers.map(async (relatedOffer) => {
        let relatedSellerDetails = null;

        if (relatedOffer.userId) {
          relatedSellerDetails = await Seller.findOne({
            userId: relatedOffer.userId,
          })
            .select(
              "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
            )
            .lean();

          if (relatedSellerDetails) {
            const relatedSellerAds = await Ad.find({
              userId: relatedOffer.userId,
            });
            const relatedTotalAds = relatedSellerAds.length;

            relatedSellerDetails.stats = {
              totalAds: relatedTotalAds,
              memberSince: relatedSellerDetails.createdAt,
            };

            if (relatedSellerDetails.businessType === "individual") {
              const relatedUser = await User.findById(
                relatedSellerDetails.userId
              )
                .select("fullName email phone profilePicture")
                .lean();

              if (relatedUser) {
                relatedSellerDetails.userDetails = {
                  fullName: relatedUser.fullName,
                  email: relatedUser.email,
                  phone: relatedUser.phone,
                  profilePicture: relatedUser.profilePicture,
                };
              }
            }
          }
        }

        return {
          ...relatedOffer,
          sellerDetails: relatedSellerDetails,
        };
      })
    );

    // Apply claim status and counts to related offers
    const processedRelatedOffers =
      await processAdsWithDiscountFavoritesAndClaims(
        relatedOffersWithSellerDetails,
        userId,
        relatedFavoriteAdIds,
        relatedClaimedOfferIds
      );

    const responseData = {
      offer: {
        ...offer,
        discountedPrice: offerDiscountedPrice,
        isFavorited,
        isClaimed,
        totalClaims,
        claimDeal: isClaimed, // Add claimDeal status
        discountPercentage: offer.discountPercent || null,
        fullPrice: offer.fullPrice || null,
      },
      seller: sellerDetails,
      relatedOffers: processedRelatedOffers,
      ratingDistribution,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Offer details fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching offer details:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(500)
      .json(new ApiError(500, "Error fetching offer details", [error.message]));
  }
};

const searchAllOffers = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 12,
      category,
      city,
      neighbourhood,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      sortBy = "relevance",
    } = req.query;

    const userId = req.user?._id;

    // Build search filter - ONLY NON-FLASH DEALS
    const filter = {
      adType: "offer",
      flashDeal: false, // Only search non-flash deals
      expiryDate: { $gt: new Date() }, // Only non-expired
    };

    // Search query
    if (query && query.trim() !== "") {
      const searchRegex = { $regex: query.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { neighbourhood: searchRegex },
        { offerDetail: searchRegex },
      ];
    }

    // Additional filters
    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (city && city !== "") {
      filter.city = { $regex: city, $options: "i" };
    }
    if (neighbourhood && neighbourhood !== "") {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }

    // Rating filter
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.fullPrice = {};
      if (minPrice && minPrice !== "0")
        filter.fullPrice.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice !== "0")
        filter.fullPrice.$lte = parseFloat(maxPrice);
    }

    // Discount filter
    if (minDiscount || maxDiscount) {
      filter.discountPercent = {};
      if (minDiscount && minDiscount !== "0")
        filter.discountPercent.$gte = parseFloat(minDiscount);
      if (maxDiscount && maxDiscount !== "0")
        filter.discountPercent.$lte = parseFloat(maxDiscount);
    }

    // Sort options
    const sortOptions = {};
    switch (sortBy) {
      case "relevance":
        if (query) {
          sortOptions.createdAt = -1;
        } else {
          sortOptions.createdAt = -1;
        }
        break;
      case "newest":
        sortOptions.createdAt = -1;
        break;
      case "discount":
      case "discountHighToLow":
        sortOptions.discountPercent = -1;
        break;
      case "expirySoon":
      case "ending":
        sortOptions.expiryDate = 1;
        break;
      case "popular":
        sortOptions.reviewsCount = -1;
        break;
      case "rating":
        sortOptions.rating = -1;
        break;
      case "priceLowToHigh":
        sortOptions.fullPrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.fullPrice = -1;
        break;
      case "nearest":
        sortOptions.createdAt = -1; // Default for now
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const totalCount = await Ad.countDocuments(filter);

    // Get search results
    let offers = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt flashDeal expiryDate discountDeal fullPrice discountPercent offerDetail adType category userId claimDeal"
      )
      .lean();

    // Calculate relevance score for search results
    if (query && sortBy === "relevance") {
      offers = offers.map((offer) => {
        let score = 0;
        const searchTerm = query.toLowerCase();

        if (offer.title?.toLowerCase().includes(searchTerm)) score += 10;
        if (offer.category?.toLowerCase().includes(searchTerm)) score += 8;
        if (offer.description?.toLowerCase().includes(searchTerm)) score += 5;
        if (offer.city?.toLowerCase().includes(searchTerm)) score += 3;
        if (offer.neighbourhood?.toLowerCase().includes(searchTerm)) score += 2;
        if (offer.offerDetail?.toLowerCase().includes(searchTerm)) score += 6;

        // Bonus for exact matches and high discounts
        if (offer.title?.toLowerCase() === searchTerm) score += 5;
        if (offer.discountPercent > 50) score += 3;

        return { ...offer, score };
      });

      offers.sort((a, b) => b.score - a.score);
    }

    let favoriteAdIds = [];
    let claimedOfferIds = [];

    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: offers.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();
      favoriteAdIds = favorites.map((fav) => fav.adId.toString());

      claimedOfferIds = await getUserClaimedOfferIds(userId);
    }

    // Process offers with seller details
    const offersWithSellerDetails = await Promise.all(
      offers.map(async (offer) => {
        let sellerDetails = null;

        if (offer.userId) {
          sellerDetails = await Seller.findOne({ userId: offer.userId })
            .select(
              "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
            )
            .lean();

          if (sellerDetails) {
            const sellerAds = await Ad.find({ userId: offer.userId });
            const totalAds = sellerAds.length;

            sellerDetails.stats = {
              totalAds,
              memberSince: sellerDetails.createdAt,
            };

            if (sellerDetails.businessType === "individual") {
              const user = await User.findById(sellerDetails.userId)
                .select("fullName email phone profilePicture")
                .lean();

              if (user) {
                sellerDetails.userDetails = {
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  profilePicture: user.profilePicture,
                };
              }
            }
          }
        }

        return {
          ...offer,
          sellerDetails,
        };
      })
    );

    const processedOffers = await processAdsWithDiscountFavoritesAndClaims(
      offersWithSellerDetails,
      userId,
      favoriteAdIds,
      claimedOfferIds
    );

    const responseData = {
      offers: processedOffers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
      searchSummary: {
        query: query || null,
        totalResults: totalCount,
        searchTime: new Date().toISOString(),
      },
      appliedFilters: {
        query,
        category,
        city,
        neighbourhood,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        sortBy,
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Offers search completed successfully"
        )
      );
  } catch (error) {
    console.error("Error searching offers:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(500)
      .json(
        new ApiError(500, "Error searching offers", [error.message]).toJSON()
      );
  }
};

module.exports = {
  getFeaturedFlashDeals,
  getOfferDetails,
  getAllFlashDeals,
  searchFlashDeals,
  getAllOffers,
  searchAllOffers,
  claimOffer,
  myClaimedOffers,
  searchClaimOffers,
};
