// Product
const mongoose = require("mongoose");
const Ad = require("../../models/ad/baseAd.model");
const Seller = require("../../models/seller.model");
const Review = require("../../models/ad/review.model");
const Favorite = require("../../models/ad/favorite.model");
const User = require("../../models/user.model");
const { ApiResponse } = require("../../utils/apiResponse");
const { ApiError } = require("../../utils/apiError");
const getFeaturedProducts = async (req, res) => {
  try {
    const userId = req.user?._id; // Get user ID if authenticated

    const productAds = await Ad.find({ adType: "product" })
      .limit(8)
      .sort({ createdAt: -1 })
      .select(
        "title images description category subCategory askingPrice discount discountPercent quantity city neighbourhood rating reviewsCount phone showPhone createdAt"
      )
      .lean();

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: productAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Add isFavorited field and calculate discounted price for each product
    const productsWithFavorites = productAds.map((product) => {
      // Calculate discounted price for each product
      let discountedPrice = null;
      if (product.discount && product.discountPercent) {
        discountedPrice =
          product.askingPrice -
          (product.askingPrice * product.discountPercent) / 100;
      }

      return {
        ...product,
        isFavorited: favoriteAdIds.includes(product._id.toString()),
        discountedPrice: discountedPrice
          ? parseFloat(discountedPrice.toFixed(2))
          : null,
        originalPrice: product.askingPrice,
      };
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        productsWithFavorites, // Updated with isFavorited and discounted prices
        "Featured products fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching featured products:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching featured products", [
          error.message,
        ]).toJSON()
      );
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
    }

    // Find product ad
    const product = await Ad.findOne({ _id: id, adType: "product" }).lean();

    if (!product) {
      throw new ApiError(404, "Product not found");
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
      { $match: { adId: product._id } },
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
      averageRating: product.rating || 0,
      totalReviews: product.reviewsCount || 0,
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

    // Update product with real-time stats
    product.rating = parseFloat(stats.averageRating.toFixed(1));
    product.reviewsCount = stats.totalReviews;

    // Get seller details if userId exists
    let sellerDetails = null;
    if (product.userId) {
      sellerDetails = await Seller.findOne({ userId: product.userId })
        .select(
          "businessType name description logo website images socialLinks category city neighbourhood createdAt userId"
        )
        .lean();

      // Add seller stats
      if (sellerDetails) {
        const sellerAds = await Ad.find({ userId: product.userId });
        const totalAds = sellerAds.length;

        // Get user details for individual seller
        const user = await User.findById(sellerDetails.userId).select(
          "fullName email phone"
        );

        // Individual seller ke case mein user details seller ke saath hi include karen
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

    // Get related products
    const relatedProducts = await Ad.find({
      _id: { $ne: id },
      adType: "product",
      category: product.category,
    })
      .limit(4)
      .select(
        "title images description city neighbourhood category subCategory askingPrice discount discountPercent rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    // Get favorite status for related products
    let relatedProductsWithFavorites = relatedProducts;

    if (userId) {
      const favoriteAds = await Favorite.find({
        userId: userId,
        adId: { $in: relatedProducts.map((p) => p._id) },
      })
        .select("adId")
        .lean();

      const favoriteAdIds = favoriteAds.map((fav) => fav.adId.toString());

      relatedProductsWithFavorites = relatedProducts.map((product) => ({
        ...product,
        isFavorited: favoriteAdIds.includes(product._id.toString()),
      }));
    } else {
      relatedProductsWithFavorites = relatedProducts.map((product) => ({
        ...product,
        isFavorited: false,
      }));
    }

    // Calculate discounted price
    let discountedPrice = null;
    if (product.discount && product.discountPercent) {
      discountedPrice =
        product.askingPrice -
        (product.askingPrice * product.discountPercent) / 100;
    }

    const responseData = {
      product: {
        ...product,
        isFavorited,
        discountedPrice: discountedPrice
          ? parseFloat(discountedPrice.toFixed(2))
          : null,
        originalPrice: product.askingPrice,
      },
      seller: sellerDetails, // Isme ab individual seller ke case mein userDetails bhi hoga
      relatedProducts: relatedProductsWithFavorites,
      ratingDistribution,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          "Product details fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching product details:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching product details", [
          error.message,
        ]).toJSON()
      );
  }
};
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      subcategory, // This is the query parameter name
      city,
      neighbourhood,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      sortBy = "newest",
      search,
      query,
      discount,
    } = req.query;

    const userId = req.user?._id;

    console.log("Received product filters:", req.query);

    // Build filter object
    const filter = { adType: "product" };

    // Category filters
    if (category && category !== "") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (subcategory && subcategory !== "") {
      filter.subCategory = { $regex: subcategory, $options: "i" }; // Fixed: subCategory is the field name in database
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

    // Price filter - include both askingPrice and discountedPrice
    if (minPrice || maxPrice) {
      filter.$or = [{ askingPrice: {} }, { discountedPrice: {} }];

      if (minPrice && minPrice !== "0") {
        const minPriceNum = parseFloat(minPrice);
        filter.$or[0].askingPrice.$gte = minPriceNum;
        filter.$or[1].discountedPrice.$gte = minPriceNum;
      }
      if (maxPrice && maxPrice !== "0") {
        const maxPriceNum = parseFloat(maxPrice);
        filter.$or[0].askingPrice.$lte = maxPriceNum;
        filter.$or[1].discountedPrice.$lte = maxPriceNum;
      }
    }

    // Discount filter
    if (discount !== undefined) {
      filter.discount = discount === "true";
      // Agar discount filter true hai to sirf discounted products dikhao
      if (discount === "true") {
        filter.discountPercent = { $gt: 0 };
      }
    }

    // Search filter
    const searchTerm = search || query;
    if (searchTerm && searchTerm.trim() !== "") {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { subCategory: { $regex: searchTerm, $options: "i" } }, // Fixed: subCategory
        { city: { $regex: searchTerm, $options: "i" } },
        { neighbourhood: { $regex: searchTerm, $options: "i" } },
      ];
    }

    console.log(
      "Final product filter object:",
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
        sortOptions.askingPrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.askingPrice = -1;
        break;
      case "discountHighToLow":
        sortOptions.discountPercent = -1; // High discount first
        break;
      case "discountLowToHigh":
        sortOptions.discountPercent = 1; // Low discount first
        break;
      default:
        sortOptions.createdAt = -1; // Default to newest
    }

    console.log("Applied sort options:", sortOptions);

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Ad.countDocuments(filter);

    // Get product ads with pagination and sorting
    const productAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description category subCategory quantity discount recurring askingPrice discountPercent city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    if (!productAds || productAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            productAds: [],
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
              subcategory, // Fixed: use subcategory (query parameter name)
              city,
              neighbourhood,
              minRating,
              maxRating,
              minPrice,
              maxPrice,
              discount,
              search: searchTerm,
              sortBy,
            },
          },
          "No products found"
        )
      );
    }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: productAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate average ratings and get reviews count for each product
    const productAdsWithStats = await Promise.all(
      productAds.map(async (ad) => {
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

        // Calculate discounted price if discount exists
        let discountedPrice = null;
        let discountPercent = ad.discountPercent || 0;

        if (ad.discount && ad.discountPercent && ad.askingPrice) {
          discountedPrice =
            ad.askingPrice - (ad.askingPrice * ad.discountPercent) / 100;
          discountPercent = ad.discountPercent;
        }

        // Agar discount hai but discountPercent nahi hai, to calculate karo
        if (
          ad.discount &&
          !ad.discountPercent &&
          ad.askingPrice &&
          ad.discountedPrice
        ) {
          discountPercent =
            ((ad.askingPrice - ad.discountedPrice) / ad.askingPrice) * 100;
        }

        return {
          ...ad,
          rating: parseFloat(stats.averageRating.toFixed(1)),
          reviewsCount: stats.totalReviews,
          discountedPrice: discountedPrice
            ? parseFloat(discountedPrice.toFixed(2))
            : ad.discountedPrice
            ? parseFloat(ad.discountedPrice.toFixed(2))
            : null,
          discountPercent: parseFloat(discountPercent.toFixed(1)),
          isFavorited: favoriteAdIds.includes(ad._id.toString()),
          hasDiscount:
            ad.discount && (ad.discountPercent > 0 || discountedPrice !== null),
        };
      })
    );

    // Get available filters for frontend
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
          priceStats: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$askingPrice" },
                maxPrice: { $max: "$askingPrice" },
                avgPrice: { $avg: "$askingPrice" },
                minDiscountedPrice: { $min: "$discountedPrice" },
                maxDiscountedPrice: { $max: "$discountedPrice" },
                avgDiscountedPrice: { $avg: "$discountedPrice" },
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
          discountStats: [
            {
              $group: {
                _id: "$discount",
                count: { $sum: 1 },
              },
            },
          ],
          discountPercentStats: [
            {
              $match: { discountPercent: { $exists: true, $gt: 0 } },
            },
            {
              $group: {
                _id: null,
                minDiscountPercent: { $min: "$discountPercent" },
                maxDiscountPercent: { $max: "$discountPercent" },
                avgDiscountPercent: { $avg: "$discountPercent" },
              },
            },
          ],
        },
      },
    ]);

    const priceStats = availableFilters[0]?.priceStats[0] || {};
    const discountPercentStats =
      availableFilters[0]?.discountPercentStats[0] || {};

    const responseData = {
      productAds: productAdsWithStats,
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
        subCategories: availableFilters[0]?.subCategories || [], // Fixed: subCategories
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        priceRange: {
          minPrice: priceStats.minPrice || 0,
          maxPrice: priceStats.maxPrice || 0,
          avgPrice: priceStats.avgPrice || 0,
          minDiscountedPrice: priceStats.minDiscountedPrice || 0,
          maxDiscountedPrice: priceStats.maxDiscountedPrice || 0,
          avgDiscountedPrice: priceStats.avgDiscountedPrice || 0,
        },
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
        discountStats: availableFilters[0]?.discountStats || [],
        discountPercentRange: {
          minDiscountPercent: discountPercentStats.minDiscountPercent || 0,
          maxDiscountPercent: discountPercentStats.maxDiscountPercent || 0,
          avgDiscountPercent: discountPercentStats.avgDiscountPercent || 0,
        },
      },
      appliedFilters: {
        category,
        subcategory, // Fixed: use subcategory (query parameter name)
        city,
        neighbourhood,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        discount,
        search: searchTerm,
        sortBy,
      },
    };

    console.log("Product response data count:", productAdsWithStats.length);
    console.log("Sorting applied:", sortOptions);

    return res
      .status(200)
      .json(
        new ApiResponse(200, responseData, "Products fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error fetching products", [error.message]).toJSON()
      );
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      query, // Main search query
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
      sortBy = "relevance", // Default sort by relevance
      sortOrder = "desc",
      discount, // Filter for discounted products
      inStock, // Filter for products in stock
      minDiscountPercent, // New: Filter by minimum discount percentage
      maxDiscountPercent, // New: Filter by maximum discount percentage
    } = req.query;

    const userId = req.user?._id; // Get user ID if authenticated

    // Build search filter
    const filter = { adType: "product" };

    // Main search query across multiple fields
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

    // Additional filters
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

    // Rating filter
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating && minRating !== "0")
        filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    // Price filter - include both askingPrice and discountedPrice
    if (minPrice || maxPrice) {
      filter.$or = [{ askingPrice: {} }, { discountedPrice: {} }];

      if (minPrice && minPrice !== "0") {
        const minPriceNum = parseFloat(minPrice);
        filter.$or[0].askingPrice.$gte = minPriceNum;
        filter.$or[1].discountedPrice.$gte = minPriceNum;
      }
      if (maxPrice && maxPrice !== "0") {
        const maxPriceNum = parseFloat(maxPrice);
        filter.$or[0].askingPrice.$lte = maxPriceNum;
        filter.$or[1].discountedPrice.$lte = maxPriceNum;
      }
    }

    // Discount filter
    if (discount !== undefined) {
      filter.discount = discount === "true";
      // Agar discount filter true hai to sirf discounted products dikhao
      if (discount === "true") {
        filter.discountPercent = { $gt: 0 };
      }
    }

    // Discount percentage filter
    if (minDiscountPercent || maxDiscountPercent) {
      filter.discountPercent = {};
      if (minDiscountPercent && minDiscountPercent !== "0")
        filter.discountPercent.$gte = parseFloat(minDiscountPercent);
      if (maxDiscountPercent && maxDiscountPercent !== "0")
        filter.discountPercent.$lte = parseFloat(maxDiscountPercent);
    }

    // In stock filter (quantity > 0)
    if (inStock === "true") {
      filter.$or = [
        { quantity: { $gt: 0 } },
        { quantity: null }, // Include products where quantity is not specified
        { quantity: { $exists: false } }, // Include products without quantity field
      ];
    }

    console.log("Product search filter:", JSON.stringify(filter, null, 2)); // Debug log

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
      case "priceLowToHigh":
        sortOptions.askingPrice = 1;
        break;
      case "priceHighToLow":
        sortOptions.askingPrice = -1;
        break;
      case "discountHighToLow":
        sortOptions.discountPercent = -1; // High discount first
        break;
      case "discountLowToHigh":
        sortOptions.discountPercent = 1; // Low discount first
        break;
      case "bestDeal":
        // Sort by discount percentage (highest first) then by price (lowest first)
        sortOptions.discountPercent = -1;
        sortOptions.discountedPrice = 1;
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
    let productAds = await Ad.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "title images description category subCategory quantity discount recurring askingPrice discountPercent discountedPrice city neighbourhood phone showPhone rating reviewsCount favoritesCount createdAt"
      )
      .lean();

    if (!productAds || productAds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            productAds: [],
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
          "No products found for your search"
        )
      );
    }

    // Get all favorite ad IDs for this user
    let favoriteAdIds = [];
    if (userId) {
      const favorites = await Favorite.find({
        userId: userId,
        adId: { $in: productAds.map((ad) => ad._id) },
      })
        .select("adId")
        .lean();

      favoriteAdIds = favorites.map((fav) => fav.adId.toString());
    }

    // Calculate relevance score for search results
    if (query) {
      productAds = productAds.map((ad) => {
        let score = 0;
        const searchTerm = query.toLowerCase();

        // Score based on field matches
        if (ad.title?.toLowerCase().includes(searchTerm)) score += 10;
        if (ad.category?.toLowerCase().includes(searchTerm)) score += 8;
        if (ad.subCategory?.toLowerCase().includes(searchTerm)) score += 7;
        if (ad.description?.toLowerCase().includes(searchTerm)) score += 5;
        if (ad.city?.toLowerCase().includes(searchTerm)) score += 3;
        if (ad.neighbourhood?.toLowerCase().includes(searchTerm)) score += 2;

        // Bonus points for exact matches
        if (ad.title?.toLowerCase() === searchTerm) score += 5;
        if (ad.category?.toLowerCase() === searchTerm) score += 3;

        // Bonus points for discounted products in search
        if (ad.discount && ad.discountPercent > 0) score += 3;

        return { ...ad, score };
      });

      // Sort by relevance score if it's a search query
      if (sortBy === "relevance") {
        productAds.sort((a, b) => b.score - a.score);
      }
    }

    // Calculate average ratings, reviews count, and discounted prices
    const productAdsWithStats = await Promise.all(
      productAds.map(async (ad) => {
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

        // Calculate discounted price if discount exists
        let discountedPrice = null;
        let discountPercent = ad.discountPercent || 0;

        if (ad.discount && ad.discountPercent && ad.askingPrice) {
          discountedPrice =
            ad.askingPrice - (ad.askingPrice * ad.discountPercent) / 100;
          discountPercent = ad.discountPercent;
        }

        // Agar discount hai but discountPercent nahi hai, to calculate karo
        if (
          ad.discount &&
          !ad.discountPercent &&
          ad.askingPrice &&
          ad.discountedPrice
        ) {
          discountPercent =
            ((ad.askingPrice - ad.discountedPrice) / ad.askingPrice) * 100;
        }

        return {
          ...ad,
          rating: parseFloat(stats.averageRating.toFixed(1)),
          reviewsCount: stats.totalReviews,
          discountedPrice: discountedPrice
            ? parseFloat(discountedPrice.toFixed(2))
            : ad.discountedPrice
            ? parseFloat(ad.discountedPrice.toFixed(2))
            : null,
          discountPercent: parseFloat(discountPercent.toFixed(1)),
          isFavorited: favoriteAdIds.includes(ad._id.toString()),
          hasDiscount:
            ad.discount && (ad.discountPercent > 0 || discountedPrice !== null),
          savingsAmount:
            discountedPrice && ad.askingPrice
              ? parseFloat((ad.askingPrice - discountedPrice).toFixed(2))
              : null,
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
          priceStats: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$askingPrice" },
                maxPrice: { $max: "$askingPrice" },
                avgPrice: { $avg: "$askingPrice" },
                minDiscountedPrice: { $min: "$discountedPrice" },
                maxDiscountedPrice: { $max: "$discountedPrice" },
                avgDiscountedPrice: { $avg: "$discountedPrice" },
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
          discountStats: [
            {
              $group: {
                _id: "$discount",
                count: { $sum: 1 },
              },
            },
          ],
          discountPercentStats: [
            {
              $match: { discountPercent: { $exists: true, $gt: 0 } },
            },
            {
              $group: {
                _id: null,
                minDiscountPercent: { $min: "$discountPercent" },
                maxDiscountPercent: { $max: "$discountPercent" },
                avgDiscountPercent: { $avg: "$discountPercent" },
              },
            },
          ],
          stockStats: [
            {
              $group: {
                _id: {
                  $cond: [
                    {
                      $or: [
                        { $gt: ["$quantity", 0] },
                        { $eq: ["$quantity", null] },
                        { $not: ["$quantity"] },
                      ],
                    },
                    "inStock",
                    "outOfStock",
                  ],
                },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const priceStats = availableFilters[0]?.priceStats[0] || {};
    const discountPercentStats =
      availableFilters[0]?.discountPercentStats[0] || {};

    const responseData = {
      productAds: productAdsWithStats, // Updated with isFavorited and discount fields
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
        showingResults: productAdsWithStats.length,
        hasDiscount:
          availableFilters[0]?.discountStats?.some(
            (stat) => stat._id === true
          ) || false,
        hasInStock:
          availableFilters[0]?.stockStats?.some(
            (stat) => stat._id === "inStock"
          ) || false,
        totalDiscountedProducts:
          availableFilters[0]?.discountStats?.find((stat) => stat._id === true)
            ?.count || 0,
        discountRange: {
          minDiscountPercent: discountPercentStats.minDiscountPercent || 0,
          maxDiscountPercent: discountPercentStats.maxDiscountPercent || 0,
        },
      },
      filters: {
        categories: availableFilters[0]?.categories || [],
        subCategories: availableFilters[0]?.subCategories || [],
        cities: availableFilters[0]?.cities || [],
        neighbourhoods: availableFilters[0]?.neighbourhoods || [],
        priceRange: {
          minPrice: priceStats.minPrice || 0,
          maxPrice: priceStats.maxPrice || 0,
          avgPrice: priceStats.avgPrice || 0,
          minDiscountedPrice: priceStats.minDiscountedPrice || 0,
          maxDiscountedPrice: priceStats.maxDiscountedPrice || 0,
          avgDiscountedPrice: priceStats.avgDiscountedPrice || 0,
        },
        ratingRange: availableFilters[0]?.ratingStats[0] || {
          minRating: 0,
          maxRating: 5,
          avgRating: 0,
        },
        discountStats: availableFilters[0]?.discountStats || [],
        discountPercentRange: {
          minDiscountPercent: discountPercentStats.minDiscountPercent || 0,
          maxDiscountPercent: discountPercentStats.maxDiscountPercent || 0,
          avgDiscountPercent: discountPercentStats.avgDiscountPercent || 0,
        },
        stockStats: availableFilters[0]?.stockStats || [],
      },
      appliedFilters: {
        query,
        category,
        subCategory,
        city,
        neighbourhood,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        minDiscountPercent,
        maxDiscountPercent,
        discount: discount === "true",
        inStock: inStock === "true",
        sortBy,
        sortOrder,
      },
    };

    console.log("Product search results count:", productAdsWithStats.length); // Debug log

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          query
            ? "Product search results fetched successfully"
            : "Products fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error searching products:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res
      .status(500)
      .json(
        new ApiError(500, "Error searching products", [error.message]).toJSON()
      );
  }
};

module.exports = {
  getFeaturedProducts,
  getProductDetails,
  getAllProducts,
  searchProducts,
};
