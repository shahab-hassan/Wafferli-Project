// Product
const mongoose = require("mongoose");
const Ad = require("../../models/ad/baseAd.model");
const Seller = require("../../models/seller.model");
const Review = require("../../models/ad/review.model");
const Favorite = require("../../models/ad/favorite.model");
const User = require("../../models/user.model");
const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");
// Get featured events
const getFeaturedEvents = async (req, res) => {
  try {
    const userId = req.user?._id; // Get user ID if authenticated

    const eventAds = await Ad.find({ adType: "event" })
      .limit(8)
      .sort({ createdAt: -1 })
      .select(
        "title images description eventDate eventTime eventType featuresAmenities city neighbourhood phone showPhone createdAt rating reviewsCount"
      )
      .lean();

    // if (!eventAds || eventAds.length === 0) {
    //   throw new ApiError(404, "No featured events found");
    // }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: eventAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Add isFavorited field to each event
    const eventsWithFavorites = eventAds.map((event) => ({
      ...event,
      isFavorited: favoriteAdIds.includes(event._id.toString()),
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        eventsWithFavorites, // Updated with isFavorited
        "Featured events fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching featured events:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching featured events", [
          error.message,
        ]).toJSON()
      );
  }
};
const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid event ID");
    }

    // Find event ad
    const event = await Ad.findOne({ _id: id, adType: "event" }).lean();

    if (!event) {
      throw new ApiError(404, "Event not found");
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
      { $match: { adId: event._id } },
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
      averageRating: event.rating || 0,
      totalReviews: event.reviewsCount || 0,
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

    // Update event with real-time stats
    event.rating = parseFloat(stats.averageRating.toFixed(1));
    event.reviewsCount = stats.totalReviews;

    // Check if event is upcoming or past
    const eventDate = new Date(event.eventDate);
    const now = new Date();
    const isUpcoming = eventDate > now;
    const daysUntilEvent = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

    // Get seller details if userId exists
    let sellerDetails = null;
    if (event.userId) {
      sellerDetails = await Seller.findOne({ userId: event.userId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt"
        )
        .lean();

      // Add seller stats
      if (sellerDetails) {
        const sellerAds = await Ad.find({ userId: event.userId });
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

    // Get related events (same event type or same city)
    const relatedEvents = await Ad.find({
      _id: { $ne: id },
      adType: "event",
      $or: [{ eventType: event.eventType }, { city: event.city }],
    })
      .limit(4)
      .select(
        "title images description city neighbourhood eventDate eventTime eventType featuresAmenities rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    // Format event date for display
    const formattedEventDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const responseData = {
      event: {
        ...event,
        isFavorited,
        isUpcoming,
        daysUntilEvent: isUpcoming ? daysUntilEvent : null,
        formattedEventDate,
        formattedEventTime: event.eventTime,
      },
      seller: sellerDetails,
      relatedEvents,
      ratingDistribution,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Event details fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching event details:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching event details", [
          error.message,
        ]).toJSON()
      );
  }
};

const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      eventType,
      city,
      neighbourhood,
      minRating,
      maxRating,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      query, // For search functionality
      features,
    } = req.query;

    const userId = req.user?._id; // Get user ID if authenticated

    console.log("Received event filters:", req.query); // Debug log

    // Build filter object
    const filter = { adType: "event" };

    // Event type filter
    if (eventType && eventType !== "") {
      filter.eventType = { $regex: eventType, $options: "i" };
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

    // Date range filter
    if (startDate || endDate) {
      filter.eventDate = {};
      if (startDate) filter.eventDate.$gte = new Date(startDate);
      if (endDate) filter.eventDate.$lte = new Date(endDate);
    }

    // Features filter
    if (features) {
      const featuresArray = Array.isArray(features) ? features : [features];
      filter.featuresAmenities = { $in: featuresArray };
    }

    // Search filter - handle both 'search' and 'query' parameters
    const searchTerm = search || query;
    if (searchTerm && searchTerm.trim() !== "") {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { eventType: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { neighbourhood: { $regex: searchTerm, $options: "i" } },
      ];
    }

    console.log("Final event filter object:", JSON.stringify(filter, null, 2)); // Debug log

    // Sort options - Map frontend sort values to database fields
    const sortOptions = {};
    const sortMapping = {
      newest: "createdAt",
      rating: "rating",
      reviews: "reviewsCount",
      name: "title",
      date: "eventDate",
      dateAsc: "eventDate",
      dateDesc: "eventDate",
    };

    const validSortOrders = ["asc", "desc"];

    const dbSortField = sortMapping[sortBy] || sortMapping["newest"];
    let sortDir = validSortOrders.includes(sortOrder) ? sortOrder : "desc";

    // Handle date sorting specifically
    if (sortBy === "dateDesc") {
      sortDir = "desc";
    } else if (sortBy === "dateAsc") {
      sortDir = "asc";
    }

    sortOptions[dbSortField] = sortDir === "desc" ? -1 : 1;

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit)); // Limit maximum items per page
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Ad.countDocuments(filter);

    // Get event ads with pagination and sorting
    const eventAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description eventDate eventTime eventType featuresAmenities city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    if (!eventAds || eventAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            eventAds: [],
            pagination: {
              currentPage: pageNum,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: limitNum,
              hasNextPage: false,
              hasPrevPage: false,
            },
            filters: {
              eventTypes: [],
              cities: [],
              neighbourhoods: [],
              features: [],
              dateRange: {
                minDate: null,
                maxDate: null,
              },
              ratingRange: {
                minRating: 0,
                maxRating: 5,
                avgRating: 0,
              },
            },
            appliedFilters: {
              eventType,
              city,
              neighbourhood,
              minRating,
              maxRating,
              startDate,
              endDate,
              features: features
                ? Array.isArray(features)
                  ? features
                  : [features]
                : [],
              search: searchTerm,
              sortBy,
              sortOrder,
            },
          },
          "No events found"
        )
      );
    }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: eventAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate average ratings and get reviews count for each event
    const eventAdsWithStats = await Promise.all(
      eventAds.map(async (ad) => {
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
          eventTypes: [
            { $match: { eventType: { $exists: true, $ne: "" } } },
            { $group: { _id: "$eventType", count: { $sum: 1 } } },
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
          features: [
            { $unwind: "$featuresAmenities" },
            { $match: { featuresAmenities: { $exists: true, $ne: "" } } },
            { $group: { _id: "$featuresAmenities", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          dateStats: [
            {
              $group: {
                _id: null,
                minDate: { $min: "$eventDate" },
                maxDate: { $max: "$eventDate" },
              },
            },
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
      eventAds: eventAdsWithStats, // Updated with isFavorited
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      },
      filters: {
        eventTypes: availableFilters[0]?.eventTypes || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        features: availableFilters[0]?.features || [],
        dateRange: availableFilters[0]?.dateStats[0] || {
          minDate: null,
          maxDate: null,
        },
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
      },
      appliedFilters: {
        eventType,
        city,
        neighbourhood,
        minRating,
        maxRating,
        startDate,
        endDate,
        features: features
          ? Array.isArray(features)
            ? features
            : [features]
          : [],
        search: searchTerm,
        sortBy,
        sortOrder,
      },
    };

    console.log("Event response data count:", eventAdsWithStats.length); // Debug log

    return res
      .status(200)
      .json(new ApiResponse(200, responseData, "Events fetched successfully"));
  } catch (error) {
    console.error("Error fetching events:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching events", [error.message]).toJSON()
      );
  }
};

const searchEvents = async (req, res) => {
  try {
    const {
      query, // Main search query
      page = 1,
      limit = 9,
      eventType,
      city,
      neighbourhood,
      minRating,
      maxRating,
      startDate,
      endDate,
      sortBy = "relevance", // Default sort by relevance
      sortOrder = "desc",
      features,
      upcoming, // Filter for upcoming events only
    } = req.query;

    const userId = req.user?._id; // Get user ID if authenticated

    // Build search filter
    const filter = { adType: "event" };

    // Main search query across multiple fields
    if (query && query.trim() !== "") {
      const searchRegex = { $regex: query.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { eventType: searchRegex },
        { city: searchRegex },
        { neighbourhood: searchRegex },
      ];
    }

    // Additional filters
    if (eventType && eventType !== "") {
      filter.eventType = { $regex: eventType, $options: "i" };
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

    // Date range filter
    if (startDate || endDate) {
      filter.eventDate = {};
      if (startDate) filter.eventDate.$gte = new Date(startDate);
      if (endDate) filter.eventDate.$lte = new Date(endDate);
    }

    // Upcoming events filter
    if (upcoming === "true") {
      filter.eventDate = { ...filter.eventDate, $gte: new Date() };
    }

    // Features filter
    if (features) {
      const featuresArray = Array.isArray(features) ? features : [features];
      filter.featuresAmenities = { $in: featuresArray };
    }

    console.log("Event search filter:", JSON.stringify(filter, null, 2)); // Debug log

    // Sort options with relevance scoring for search
    const sortOptions = {};

    switch (sortBy) {
      case "relevance":
        if (query) {
          // Relevance scoring based on search query matches
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
        sortOptions.title = sortOrder === "desc" ? -1 : 1;
        break;
      case "date":
        sortOptions.eventDate = sortOrder === "desc" ? -1 : 1;
        break;
      case "dateAsc":
        sortOptions.eventDate = 1;
        break;
      case "dateDesc":
        sortOptions.eventDate = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Ad.countDocuments(filter);

    // Get search results with pagination
    let eventAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description eventDate eventTime eventType featuresAmenities city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    if (!eventAds || eventAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            eventAds: [],
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
              searchTime: new Date().toISOString(),
            },
            filters: {
              eventTypes: [],
              cities: [],
              neighbourhoods: [],
              features: [],
              dateRange: {
                minDate: null,
                maxDate: null,
              },
              ratingRange: {
                minRating: 0,
                maxRating: 5,
                avgRating: 0,
              },
            },
          },
          "No events found for your search"
        )
      );
    }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: eventAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate relevance score for search results
    if (query) {
      eventAds = eventAds.map((ad) => {
        let score = 0;
        const searchTerm = query.toLowerCase();

        // Score based on field matches
        if (ad.title?.toLowerCase().includes(searchTerm)) score += 10;
        if (ad.eventType?.toLowerCase().includes(searchTerm)) score += 8;
        if (ad.description?.toLowerCase().includes(searchTerm)) score += 5;
        if (ad.city?.toLowerCase().includes(searchTerm)) score += 3;
        if (ad.neighbourhood?.toLowerCase().includes(searchTerm)) score += 2;

        // Bonus points for exact matches
        if (ad.title?.toLowerCase() === searchTerm) score += 5;
        if (ad.eventType?.toLowerCase() === searchTerm) score += 3;

        return { ...ad, score };
      });

      // Sort by relevance score if it's a search query
      if (sortBy === "relevance") {
        eventAds.sort((a, b) => b.score - a.score);
      }
    }

    // Calculate average ratings and get reviews count for each event
    const eventAdsWithStats = await Promise.all(
      eventAds.map(async (ad) => {
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
          eventTypes: [
            { $match: { eventType: { $exists: true, $ne: "" } } },
            { $group: { _id: "$eventType", count: { $sum: 1 } } },
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
          features: [
            { $unwind: "$featuresAmenities" },
            { $match: { featuresAmenities: { $exists: true, $ne: "" } } },
            { $group: { _id: "$featuresAmenities", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          dateStats: [
            {
              $group: {
                _id: null,
                minDate: { $min: "$eventDate" },
                maxDate: { $max: "$eventDate" },
              },
            },
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
          upcomingStats: [
            {
              $group: {
                _id: {
                  $cond: [
                    { $gte: ["$eventDate", new Date()] },
                    "upcoming",
                    "past",
                  ],
                },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const responseData = {
      eventAds: eventAdsWithStats, // Updated with isFavorited
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
        showingResults: eventAdsWithStats.length,
        hasUpcoming:
          availableFilters[0]?.upcomingStats?.some(
            (stat) => stat._id === "upcoming"
          ) || false,
      },
      filters: {
        eventTypes: availableFilters[0]?.eventTypes || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        features: availableFilters[0]?.features || [],
        dateRange: availableFilters[0]?.dateStats[0] || {
          minDate: null,
          maxDate: null,
        },
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
        upcomingStats: availableFilters[0]?.upcomingStats || [],
      },
      appliedFilters: {
        query,
        eventType,
        city,
        neighbourhood,
        minRating,
        maxRating,
        startDate,
        endDate,
        features: features
          ? Array.isArray(features)
            ? features
            : [features]
          : [],
        upcoming: upcoming === "true",
        sortBy,
        sortOrder,
      },
    };

    console.log("Event search results count:", eventAdsWithStats.length); // Debug log

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          query
            ? "Event search results fetched successfully"
            : "Events fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error searching events:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error searching events", [error.message]).toJSON()
      );
  }
};
module.exports = {
  getFeaturedEvents,
  getEventDetails,
  getAllEvents,
  searchEvents,
};
