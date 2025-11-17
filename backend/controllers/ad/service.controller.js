// Product
const mongoose = require("mongoose");
const Ad = require("../../models/ad/baseAd.model");
const Seller = require("../../models/seller.model");
const Review = require("../../models/ad/review.model");
const Favorite = require("../../models/ad/favorite.model");
const User = require("../../models/user.model");
const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");

const getFeaturedService = async (req, res) => {
  try {
    const userId = req.user?._id;

    const serviceAds = await Ad.find({ adType: "service" })
      .limit(8)
      .sort({ createdAt: -1 })
      .select(
        "title images description city neighbourhood rating reviewsCount phone showPhone createdAt category subCategory servicePrice serviceType"
      )
      .lean();

    // if (!serviceAds || serviceAds.length === 0) {
    //   throw new ApiError(404, "No featured Service found");
    // }

    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: serviceAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    const serviceWithFavorites = serviceAds.map((service) => ({
      ...service,
      isFavorited: favoriteAdIds.includes(service._id.toString()),
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          serviceWithFavorites,
          "Featured service fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching featured services:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching featured service", [
          error.message,
        ]).toJSON()
      );
  }
};

const getServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid service ID");
    }

    const service = await Ad.findOne({ _id: id, adType: "service" }).lean();

    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    let isFavorited = false;
    if (userId) {
      const favorite = await Favorite.findOne({
        userId: userId,
        adId: id,
      });
      isFavorited = !!favorite;
    }

    const reviewsStats = await Review.aggregate([
      { $match: { adId: service._id } },
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
      averageRating: service.rating || 0,
      totalReviews: service.reviewsCount || 0,
      ratingDistribution: [],
    };

    const ratingDistribution = {
      5: stats.ratingDistribution.filter((r) => r === 5).length,
      4: stats.ratingDistribution.filter((r) => r === 4).length,
      3: stats.ratingDistribution.filter((r) => r === 3).length,
      2: stats.ratingDistribution.filter((r) => r === 2).length,
      1: stats.ratingDistribution.filter((r) => r === 1).length,
    };

    service.rating = parseFloat(stats.averageRating.toFixed(1));
    service.reviewsCount = stats.totalReviews;

    let sellerDetails = null;
    if (service.userId) {
      sellerDetails = await Seller.findOne({ userId: service.userId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
        )
        .lean();

      if (sellerDetails) {
        const sellerAds = await Ad.find({ userId: service.userId });
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

    const user = sellerDetails
      ? await User.findById(sellerDetails.userId)
      : null;

    const relatedServices = await Ad.find({
      _id: { $ne: id },
      adType: "service",
      category: service.category,
    })
      .limit(4)
      .select(
        "title images description city neighbourhood category subCategory servicePrice serviceType rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    let relatedServicesWithFavorites = relatedServices;
    if (userId) {
      const favoriteAds = await Favorite.find({
        userId: userId,
        adId: { $in: relatedServices.map((s) => s._id) },
      })
        .select("adId")
        .lean();

      const favoriteAdIds = favoriteAds.map((fav) => fav.adId.toString());

      relatedServicesWithFavorites = relatedServices.map((serviceItem) => ({
        ...serviceItem,
        isFavorited: favoriteAdIds.includes(serviceItem._id.toString()),
      }));
    } else {
      relatedServicesWithFavorites = relatedServices.map((serviceItem) => ({
        ...serviceItem,
        isFavorited: false,
      }));
    }

    const responseData = {
      service: {
        ...service,
        isFavorited,
      },
      seller: sellerDetails,
      relatedServices: relatedServicesWithFavorites,
      user,
      ratingDistribution,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Service details fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching service details:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching service details", [
          error.message,
        ]).toJSON()
      );
  }
};

const getAllService = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      subCategory,
      city,
      neighbourhood,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      serviceType,
      sortBy = "newest",
      search,
      query,
    } = req.query;

    const userId = req.user?._id;

    console.log("Received service filters:", req.query);

    const filter = { adType: "service" };

    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (subCategory && subCategory !== "") {
      filter.subCategory = { $regex: subCategory, $options: "i" };
    }

    if (city && city !== "") {
      filter.city = { $regex: city, $options: "i" };
    }
    if (neighbourhood && neighbourhood !== "") {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }

    if (serviceType && serviceType !== "") {
      filter.serviceType = serviceType;
    }

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    if (minPrice || maxPrice) {
      filter.servicePrice = {};
      if (minPrice && minPrice !== "0")
        filter.servicePrice.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice !== "0")
        filter.servicePrice.$lte = parseFloat(maxPrice);
    }

    const searchTerm = search || query;
    if (searchTerm && searchTerm.trim() !== "") {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { subCategory: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { neighbourhood: { $regex: searchTerm, $options: "i" } },
      ];
    }

    console.log(
      "Final service filter object:",
      JSON.stringify(filter, null, 2)
    );

    // FIXED: Handle all sorting options from frontend
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
        sortOptions.title = 1; // A to Z
        break;
      case "priceLowToHigh":
        sortOptions.servicePrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.servicePrice = -1;
        break;
      default:
        sortOptions.createdAt = -1; // Default to newest
    }

    console.log("Applied sort options:", sortOptions);

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Ad.countDocuments(filter);

    const serviceAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description category subCategory servicePrice serviceType city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    if (!serviceAds || serviceAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            serviceAds: [],
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
              subCategories: [],
              cities: [],
              neighbourhoods: [],
              serviceTypes: [],
              priceRange: {
                minPrice: 0,
                maxPrice: 0,
                avgPrice: 0,
              },
              ratingRange: {
                minRating: 0,
                maxRating: 5,
                avgRating: 0,
              },
            },
            appliedFilters: {
              category,
              subCategory,
              city,
              neighbourhood,
              serviceType,
              minRating,
              maxRating,
              minPrice,
              maxPrice,
              search: searchTerm,
              sortBy,
            },
          },
          "No services found"
        )
      );
    }

    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: serviceAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    const serviceAdsWithStats = await Promise.all(
      serviceAds.map(async (ad) => {
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
          isFavorited: favoriteAdIds.includes(ad._id.toString()),
        };
      })
    );

    const availableFilters = await Ad.aggregate([
      { $match: filter },
      {
        $facet: {
          categories: [
            { $match: { category: { $exists: true, $ne: "" } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          subCategories: [
            { $match: { subCategory: { $exists: true, $ne: "" } } },
            { $group: { _id: "$subCategory", count: { $sum: 1 } } },
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
          serviceTypes: [
            { $match: { serviceType: { $exists: true, $ne: "" } } },
            { $group: { _id: "$serviceType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          priceStats: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$servicePrice" },
                maxPrice: { $max: "$servicePrice" },
                avgPrice: { $avg: "$servicePrice" },
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
      serviceAds: serviceAdsWithStats,
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
        subCategories: availableFilters[0]?.subCategories || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        serviceTypes: availableFilters[0]?.serviceTypes || [],
        priceRange: availableFilters[0]?.priceStats[0] || {
          minPrice: 0,
          maxPrice: 0,
          avgPrice: 0,
        },
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
      },
      appliedFilters: {
        category,
        subCategory,
        city,
        neighbourhood,
        serviceType,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        search: searchTerm,
        sortBy,
      },
    };

    console.log("Service response data count:", serviceAdsWithStats.length);
    console.log("Sorting applied:", sortOptions);

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Services fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching services:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching services", [error.message]).toJSON()
      );
  }
};

const searchService = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 9,
      category,
      subCategory,
      city,
      neighbourhood,
      serviceType,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      sortBy = "relevance",
      sortOrder = "desc",
    } = req.query;

    const userId = req.user?._id;

    const filter = { adType: "service" };

    if (query && query.trim() !== "") {
      const searchRegex = { $regex: query.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { subCategory: searchRegex },
        { city: searchRegex },
        { neighbourhood: searchRegex },
      ];
    }

    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }

    if (subCategory && subCategory !== "") {
      filter.subCategory = { $regex: subCategory, $options: "i" };
    }

    if (city && city !== "") {
      filter.city = { $regex: city, $options: "i" };
    }

    if (neighbourhood && neighbourhood !== "") {
      filter.neighbourhood = { $regex: neighbourhood, $options: "i" };
    }

    if (serviceType && serviceType !== "") {
      filter.serviceType = serviceType;
    }

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    if (minPrice || maxPrice) {
      filter.servicePrice = {};
      if (minPrice && minPrice !== "0")
        filter.servicePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.servicePrice.$lte = parseFloat(maxPrice);
    }

    console.log("Service search filter:", JSON.stringify(filter, null, 2));

    const sortOptions = {};

    switch (sortBy) {
      case "relevance":
        if (query) {
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
      case "priceLowToHigh":
        sortOptions.servicePrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.servicePrice = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Ad.countDocuments(filter);

    let serviceAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description category subCategory servicePrice serviceType city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    if (!serviceAds || serviceAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            serviceAds: [],
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
              categories: [],
              subCategories: [],
              cities: [],
              neighbourhoods: [],
              serviceTypes: [],
              priceRange: {
                minPrice: 0,
                maxPrice: 0,
                avgPrice: 0,
              },
              ratingRange: {
                minRating: 0,
                maxRating: 5,
                avgRating: 0,
              },
            },
          },
          "No services found for your search"
        )
      );
    }

    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: serviceAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    if (query) {
      serviceAds = serviceAds.map((ad) => {
        let score = 0;
        const searchTerm = query.toLowerCase();

        if (ad.title?.toLowerCase().includes(searchTerm)) score += 10;
        if (ad.category?.toLowerCase().includes(searchTerm)) score += 8;
        if (ad.subCategory?.toLowerCase().includes(searchTerm)) score += 7;
        if (ad.description?.toLowerCase().includes(searchTerm)) score += 5;
        if (ad.city?.toLowerCase().includes(searchTerm)) score += 3;
        if (ad.neighbourhood?.toLowerCase().includes(searchTerm)) score += 2;

        if (ad.title?.toLowerCase() === searchTerm) score += 5;
        if (ad.category?.toLowerCase() === searchTerm) score += 3;

        return { ...ad, score };
      });

      if (sortBy === "relevance") {
        serviceAds.sort((a, b) => b.score - a.score);
      }
    }

    const serviceAdsWithStats = await Promise.all(
      serviceAds.map(async (ad) => {
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
          isFavorited: favoriteAdIds.includes(ad._id.toString()),
          ...(ad.score && { _score: ad.score }),
        };
      })
    );

    const availableFilters = await Ad.aggregate([
      { $match: filter },
      {
        $facet: {
          categories: [
            { $match: { category: { $exists: true, $ne: "" } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          subCategories: [
            { $match: { subCategory: { $exists: true, $ne: "" } } },
            { $group: { _id: "$subCategory", count: { $sum: 1 } } },
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
          serviceTypes: [
            { $match: { serviceType: { $exists: true, $ne: "" } } },
            { $group: { _id: "$serviceType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          priceStats: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$servicePrice" },
                maxPrice: { $max: "$servicePrice" },
                avgPrice: { $avg: "$servicePrice" },
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
      serviceAds: serviceAdsWithStats,
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
        showingResults: serviceAdsWithStats.length,
      },
      filters: {
        categories: availableFilters[0]?.categories || [],
        subCategories: availableFilters[0]?.subCategories || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        serviceTypes: availableFilters[0]?.serviceTypes || [],
        priceRange: availableFilters[0]?.priceStats[0] || {
          minPrice: 0,
          maxPrice: 0,
          avgPrice: 0,
        },
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
      },
      appliedFilters: {
        query,
        category,
        subCategory,
        city,
        neighbourhood,
        serviceType,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      },
    };

    console.log("Service search results count:", serviceAdsWithStats.length);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          query
            ? "Service search results fetched successfully"
            : "Services fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error searching services:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error searching services", [error.message]).toJSON()
      );
  }
};
module.exports = {
  getFeaturedService,
  getServiceDetails,
  getAllService,
  searchService,
};
