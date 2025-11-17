// Product
const mongoose = require("mongoose");
const Ad = require("../../models/ad/baseAd.model");
const Seller = require("../../models/seller.model");
const Review = require("../../models/ad/review.model");
const Favorite = require("../../models/ad/favorite.model");
const User = require("../../models/user.model");
const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");

const getFeaturedExplore = async (req, res) => {
  try {
    const userId = req.user?._id; // Get user ID if authenticated

    const exploreAds = await Ad.find({ adType: "explore" })
      .limit(8)
      .sort({ createdAt: -1 })
      .select(
        "title images description exploreName exploreDescription startTime endTime city neighbourhood phone showPhone rating reviewsCount createdAt"
      )
      .lean();

    // if (!exploreAds || exploreAds.length === 0) {
    //   throw new ApiError(404, "No featured explore places found");
    // }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: exploreAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate average ratings and get reviews count for each explore
    const exploreAdsWithStats = await Promise.all(
      exploreAds.map(async (ad) => {
        const reviewsStats = await Review.aggregate([
          { $match: { adId: ad._id } },
          {
            $group: {
              _id: "$adId",
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ]);

        const stats = reviewsStats[0] || {
          averageRating: ad.rating || 0,
          totalReviews: ad.reviewsCount || 0,
        };

        return {
          ...ad,
          rating: parseFloat(stats.averageRating.toFixed(1)),
          reviewsCount: stats.totalReviews,
          isFavorited: favoriteAdIds.includes(ad._id.toString()), // Add favorite status
        };
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          exploreAdsWithStats,
          "Featured explore ads fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching featured explore:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching featured explore ads", [
          error.message,
        ]).toJSON()
      );
  }
};

const getExploreDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id; // Get user ID if authenticated

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid explore ID");
    }

    // Find explore ad
    const explore = await Ad.findOne({ _id: id, adType: "explore" }).lean();

    if (!explore) {
      throw new ApiError(404, "Explore place not found");
    }

    // Check if user has favorited this ad
    let isFavorited = false;
    if (userId) {
      const favorite = await Favorite.findOne({
        userId: userId,
        adId: id,
      });
      isFavorited = !!favorite;
    }

    // Get reviews statistics
    const reviewsStats = await Review.aggregate([
      { $match: { adId: explore._id } },
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
      averageRating: explore.rating || 0,
      totalReviews: explore.reviewsCount || 0,
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

    // Update explore with real-time stats
    explore.rating = parseFloat(stats.averageRating.toFixed(1));
    explore.reviewsCount = stats.totalReviews;

    // Get seller details if userId exists
    let sellerDetails = null;
    if (explore.userId) {
      sellerDetails = await Seller.findOne({ userId: explore.userId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt"
        )
        .lean();

      // Add seller stats
      if (sellerDetails) {
        const sellerAds = await Ad.find({ userId: explore.userId });
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
      }
    }

    // Get related explore ads
    const relatedExploreAds = await Ad.find({
      _id: { $ne: id },
      adType: "explore",
      city: explore.city,
    })
      .limit(4)
      .select(
        "title images description city neighbourhood exploreName exploreDescription startTime endTime rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    // Get favorite status for related explore ads
    let relatedExploreAdsWithFavorites = relatedExploreAds;

    if (userId) {
      // Get all favorite ad IDs for this user
      const favoriteAds = await Favorite.find({
        userId: userId,
        adId: { $in: relatedExploreAds.map((p) => p._id) },
      })
        .select("adId")
        .lean();

      const favoriteAdIds = favoriteAds.map((fav) => fav.adId.toString());

      // Add isFavorited field to each related explore
      relatedExploreAdsWithFavorites = relatedExploreAds.map((exploreAd) => ({
        ...exploreAd,
        isFavorited: favoriteAdIds.includes(exploreAd._id.toString()),
      }));
    } else {
      // If user is not logged in, set isFavorited to false for all
      relatedExploreAdsWithFavorites = relatedExploreAds.map((exploreAd) => ({
        ...exploreAd,
        isFavorited: false,
      }));
    }

    const responseData = {
      explore: {
        ...explore,
        isFavorited, // Add favorite status to main explore
      },
      seller: sellerDetails,
      relatedExploreAds: relatedExploreAdsWithFavorites, // Updated with isFavorited
      ratingDistribution,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Explore details fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching explore details:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching explore details", [
          error.message,
        ]).toJSON()
      );
  }
};

const getAllExplore = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      city,
      neighbourhood,
      minRating,
      maxRating,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      query, // For search functionality
    } = req.query;

    const userId = req.user?._id; // Get user ID if authenticated

    console.log("Received filters:", req.query); // Debug log

    // Build filter object
    const filter = { adType: "explore" };

    // Category filter
    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }

    // Location filters
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

    // Search filter - handle both 'search' and 'query' parameters
    const searchTerm = search || query;
    if (searchTerm && searchTerm.trim() !== "") {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { exploreName: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { exploreDescription: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { neighbourhood: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Sort options - Map frontend sort values to database fields
    const sortOptions = {};
    const sortMapping = {
      newest: "createdAt",
      rating: "rating",
      reviews: "reviewsCount",
      name: "exploreName",
    };

    const validSortOrders = ["asc", "desc"];

    const dbSortField = sortMapping[sortBy] || sortMapping["newest"];
    const sortDir = validSortOrders.includes(sortOrder) ? sortOrder : "desc";

    sortOptions[dbSortField] = sortDir === "desc" ? -1 : 1;

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit)); // Limit maximum items per page
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Ad.countDocuments(filter);

    // Get explore ads with pagination and sorting
    const exploreAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description exploreName exploreDescription startTime endTime city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt category"
      )
      .lean();

    if (!exploreAds || exploreAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            exploreAds: [],
            pagination: {
              currentPage: pageNum,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: limitNum,
              hasNextPage: false,
              hasPrevPage: false,
            },
            filters: {
              categories: [],
              cities: [],
              neighbourhoods: [],
              ratingRange: {
                minRating: 0,
                maxRating: 5,
                avgRating: 0,
              },
            },
            appliedFilters: {
              category,
              city,
              neighbourhood,
              minRating,
              maxRating,
              search: searchTerm,
              sortBy,
              sortOrder,
            },
          },
          "No explore places found"
        )
      );
    }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: exploreAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate average ratings and get reviews count for each explore
    const exploreAdsWithStats = await Promise.all(
      exploreAds.map(async (ad) => {
        const reviewsStats = await Review.aggregate([
          { $match: { adId: ad._id } },
          {
            $group: {
              _id: "$adId",
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ]);

        const stats = reviewsStats[0] || {
          averageRating: ad.rating || 0,
          totalReviews: ad.reviewsCount || 0,
        };

        return {
          ...ad,
          rating: parseFloat(stats.averageRating.toFixed(1)),
          reviewsCount: stats.totalReviews,
          isFavorited: favoriteAdIds.includes(ad._id.toString()), // Add favorite status
        };
      })
    );

    // Get available filters for frontend (based on current filter)
    const availableFilters = await Ad.aggregate([
      { $match: filter }, // Use current filter to get relevant available options
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
          ratingStats: [
            {
              $group: {
                _id: null,
                minRating: { $min: "$rating" },
                maxRating: { $max: "$rating" },
                avgRating: { $avg: "$rating" },
              },
            },
          ],
        },
      },
    ]);

    const responseData = {
      exploreAds: exploreAdsWithStats, // Updated with isFavorited
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
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
      },
      appliedFilters: {
        category,
        city,
        neighbourhood,
        minRating,
        maxRating,
        search: searchTerm,
        sortBy,
        sortOrder,
      },
    };

    console.log("Response data count:", exploreAdsWithStats.length); // Debug log

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Explore ads fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching explore ads:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching explore ads", [
          error.message,
        ]).toJSON()
      );
  }
};

const searchExplore = async (req, res) => {
  try {
    const {
      query, // Main search query
      page = 1,
      limit = 9,
      category,
      city,
      neighbourhood,
      minRating,
      maxRating,
      sortBy = "relevance", // Default sort by relevance
      sortOrder = "desc",
      features,
      priceRange,
      openNow, // Filter for places open now
    } = req.query;

    const userId = req.user?._id; // Get user ID if authenticated

    // Build search filter
    const filter = { adType: "explore" };

    // Main search query across multiple fields
    if (query && query.trim() !== "") {
      const searchRegex = { $regex: query.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { exploreName: searchRegex },
        { description: searchRegex },
        { exploreDescription: searchRegex },
        { city: searchRegex },
        { neighbourhood: searchRegex },
        { category: searchRegex },
      ];
    }

    // Additional filters
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (neighbourhood) {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }

    // Rating filter
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    // Features filter
    if (features) {
      const featuresArray = Array.isArray(features) ? features : [features];
      filter.FeaturesAmenities = { $in: featuresArray };
    }

    // Open now filter (based on current time)
    if (openNow === "true") {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format

      filter.$or = [
        {
          $and: [
            { startTime: { $exists: true, $ne: null } },
            { endTime: { $exists: true, $ne: null } },
            {
              $expr: {
                $and: [
                  {
                    $lte: [
                      {
                        $toInt: {
                          $replaceAll: {
                            input: "$startTime",
                            find: ":",
                            replacement: "",
                          },
                        },
                      },
                      currentTime,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $toInt: {
                          $replaceAll: {
                            input: "$endTime",
                            find: ":",
                            replacement: "",
                          },
                        },
                      },
                      currentTime,
                    ],
                  },
                ],
              },
            },
          ],
        },
        // Include places that don't have timing specified
        {
          $or: [
            { startTime: { $exists: false } },
            { startTime: null },
            { endTime: { $exists: false } },
            { endTime: null },
          ],
        },
      ];
    }

    // Sort options with relevance scoring for search
    const sortOptions = {};

    switch (sortBy) {
      case "relevance":
        if (query) {
          // Relevance scoring based on search query matches
          // This is a simple implementation - you might want to use MongoDB Atlas Search for better relevance
          sortOptions.score = -1;
        } else {
          sortOptions.createdAt = -1;
        }
        break;
      case "rating":
        sortOptions.rating = sortOrder === "desc" ? -1 : 1;
        break;
      case "reviews":
        sortOptions.reviewsCount = sortOrder === "desc" ? -1 : 1;
        break;
      case "newest":
        sortOptions.createdAt = -1;
        break;
      case "oldest":
        sortOptions.createdAt = 1;
        break;
      case "name":
        sortOptions.exploreName = sortOrder === "desc" ? -1 : 1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Ad.countDocuments(filter);

    // Get search results with pagination
    let exploreAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description exploreName exploreDescription startTime endTime city neighbourhood phone showPhone rating reviewsCount favoritesCount FeaturesAmenities createdAt category"
      )
      .lean();

    if (!exploreAds || exploreAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            exploreAds: [],
            pagination: {
              currentPage: pageNum,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: limitNum,
              hasNextPage: false,
              hasPrevPage: false,
            },
            searchSummary: {
              query,
              totalResults: 0,
              searchTime: 0,
            },
            filters: {
              categories: [],
              cities: [],
              neighbourhoods: [],
              features: [],
            },
          },
          "No explore places found for your search"
        )
      );
    }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: exploreAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate relevance score for search results (simple implementation)
    if (query) {
      exploreAds = exploreAds.map((ad) => {
        let score = 0;
        const searchTerm = query.toLowerCase();

        // Score based on field matches
        if (ad.exploreName?.toLowerCase().includes(searchTerm)) score += 10;
        if (ad.title?.toLowerCase().includes(searchTerm)) score += 8;
        if (ad.category?.toLowerCase().includes(searchTerm)) score += 6;
        if (ad.city?.toLowerCase().includes(searchTerm)) score += 4;
        if (ad.neighbourhood?.toLowerCase().includes(searchTerm)) score += 3;
        if (ad.description?.toLowerCase().includes(searchTerm)) score += 2;
        if (ad.exploreDescription?.toLowerCase().includes(searchTerm))
          score += 2;

        return { ...ad, score };
      });

      // Sort by relevance score if it's a search query
      if (sortBy === "relevance") {
        exploreAds.sort((a, b) => b.score - a.score);
      }
    }

    // Calculate average ratings and get reviews count for each explore
    const exploreAdsWithStats = await Promise.all(
      exploreAds.map(async (ad) => {
        const reviewsStats = await Review.aggregate([
          { $match: { adId: ad._id } },
          {
            $group: {
              _id: "$adId",
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ]);

        const stats = reviewsStats[0] || {
          averageRating: ad.rating || 0,
          totalReviews: ad.reviewsCount || 0,
        };

        return {
          ...ad,
          rating: parseFloat(stats.averageRating.toFixed(1)),
          reviewsCount: stats.totalReviews,
          isFavorited: favoriteAdIds.includes(ad._id.toString()), // Add favorite status
          // Remove score from final response if not needed
          ...(ad.score && { _score: ad.score }),
        };
      })
    );

    // Get available filters for current search results
    const availableFilters = await Ad.aggregate([
      { $match: filter },
      {
        $facet: {
          categories: [
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          cities: [
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          neighbourhoods: [
            { $group: { _id: "$neighbourhood", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          features: [
            { $unwind: "$FeaturesAmenities" },
            { $group: { _id: "$FeaturesAmenities", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const responseData = {
      exploreAds: exploreAdsWithStats, // Updated with isFavorited
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
        showingResults: exploreAdsWithStats.length,
      },
      filters: {
        categories: availableFilters[0]?.categories || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        features: availableFilters[0]?.features || [],
      },
      appliedFilters: {
        query,
        category,
        city,
        neighbourhood,
        minRating,
        maxRating,
        features: features
          ? Array.isArray(features)
            ? features
            : [features]
          : [],
        sortBy,
        sortOrder,
        openNow: openNow === "true",
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          query
            ? "Search results fetched successfully"
            : "Explore ads fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error searching explore ads:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error searching explore ads", [
          error.message,
        ]).toJSON()
      );
  }
};
module.exports = {
  getFeaturedExplore,
  getExploreDetails,
  getAllExplore,
  searchExplore,
};
