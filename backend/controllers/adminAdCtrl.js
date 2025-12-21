const Ad = require("../models/ad/baseAd.model");
const User = require("../models/user.model");
const Seller = require("../models/seller.model");

// Generic function to get all ads of a specific type
const getAllAds = async (req, res, adType) => {
    try {
        const { filterType, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        let query = {};

        // Filter by ad type if specified
        if (adType) {
            query.adType = adType;
        }

        // Apply search filter
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };

            // Search in user fields
            const users = await User.find({
                $or: [
                    { email: searchRegex },
                    { fullName: searchRegex },
                    { phone: searchRegex }
                ]
            }).select('_id');

            const userIds = users.map(u => u._id);

            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { userId: { $in: userIds } }
            ];
        }

        // Apply filter type
        if (filterType && filterType !== 'All') {
            switch (filterType) {
                case 'Paid':
                    query.paymentMode = { $in: ["monthly", "annually"] };
                    break;
                case 'Free':
                    query.paymentMode = null;
                    break;
                case 'HighRated':
                    query.rating = { $gte: 4 };
                    break;
                case 'LowRated':
                    query.rating = { $lt: 3 };
                    break;
                case 'Popular':
                    query.favoritesCount = { $gte: 10 };
                    break;
            }
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const ads = await Ad.find(query)
            .populate({
                path: 'userId',
                select: 'email fullName phone'
            })
            .sort(sort);

        // Populate seller information
        const adsWithSeller = await Promise.all(ads.map(async (ad) => {
            const seller = await Seller.findOne({ userId: ad.userId?._id });
            return {
                ...ad.toObject(),
                seller: seller ? {
                    businessType: seller.businessType,
                    name: seller.name,
                    category: seller.category
                } : null
            };
        }));

        res.status(200).json({
            success: true,
            ads: adsWithSeller,
            count: adsWithSeller.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Product Ads
const getAllProductAds = (req, res) => getAllAds(req, res, 'product');

// Service Ads
const getAllServiceAds = (req, res) => getAllAds(req, res, 'service');

// Event Ads
const getAllEventAds = (req, res) => getAllAds(req, res, 'event');

// Explore Ads
const getAllExploreAds = (req, res) => getAllAds(req, res, 'explore');

// Offer Ads
const getAllOfferAds = (req, res) => getAllAds(req, res, 'offer');

// Get Single Ad Details
const getAdDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const ad = await Ad.findById(id).populate({
            path: 'userId',
            select: '-password -otp -otpExpiry -token'
        });

        if (!ad) {
            return res.status(404).json({ success: false, error: "Ad not found" });
        }

        // Get seller information
        const seller = await Seller.findOne({ userId: ad.userId._id });

        const adDetails = {
            ...ad.toObject(),
            seller: seller || null
        };

        res.status(200).json({ success: true, ad: adDetails });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete Ad
const deleteAd = async (req, res) => {
    try {
        const { id } = req.params;

        const ad = await Ad.findById(id);
        if (!ad) {
            return res.status(404).json({ success: false, error: "Ad not found" });
        }

        await Ad.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Ad deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Ad Status/Featured
const updateAdStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMode } = req.body;

        const ad = await Ad.findById(id);
        if (!ad) {
            return res.status(404).json({ success: false, error: "Ad not found" });
        }

        ad.paymentMode = paymentMode;
        await ad.save();

        res.status(200).json({
            success: true,
            message: "Ad status updated successfully",
            ad
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Ad Statistics
const getAdStatistics = async (req, res) => {
    try {
        const { adType } = req.query;

        let query = {};
        if (adType && adType !== 'all') {
            query.adType = adType;
        }

        const totalAds = await Ad.countDocuments(query);
        const paidAds = await Ad.countDocuments({
            ...query,
            paymentMode: { $in: ["monthly", "annually"] }
        });
        const freeAds = totalAds - paidAds;

        // Get ads by payment mode
        const monthlyAds = await Ad.countDocuments({
            ...query,
            paymentMode: "monthly"
        });
        const annuallyAds = await Ad.countDocuments({
            ...query,
            paymentMode: "annually"
        });

        // Get engagement statistics
        const engagement = await Ad.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: "$reviewsCount" },
                    totalFavorites: { $sum: "$favoritesCount" },
                    avgRating: { $avg: "$rating" },
                    maxRating: { $max: "$rating" },
                    minRating: { $min: "$rating" }
                }
            }
        ]);

        // Get top rated ads
        const topRatedAds = await Ad.find(query)
            .sort({ rating: -1 })
            .limit(5)
            .populate('userId', 'email fullName');

        // Get most favorited ads
        const mostFavoritedAds = await Ad.find(query)
            .sort({ favoritesCount: -1 })
            .limit(5)
            .populate('userId', 'email fullName');

        // Get ads growth by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const adsGrowth = await Ad.aggregate([
            { $match: { ...query, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Get ads by type
        const adsByType = await Ad.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$adType",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            statistics: {
                totalAds,
                paidAds,
                freeAds,
                monthlyAds,
                annuallyAds,
                engagement: engagement[0] || {
                    totalReviews: 0,
                    totalFavorites: 0,
                    avgRating: 0,
                    maxRating: 0,
                    minRating: 0
                },
                topRatedAds,
                mostFavoritedAds,
                adsGrowth,
                adsByType
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Bulk Delete Ads
const bulkDeleteAds = async (req, res) => {
    try {
        const { adIds } = req.body;

        if (!adIds || !Array.isArray(adIds) || adIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Please provide an array of ad IDs"
            });
        }

        await Ad.deleteMany({ _id: { $in: adIds } });

        res.status(200).json({
            success: true,
            message: `${adIds.length} ad(s) deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Bulk Update Ad Status
const bulkUpdateAdStatus = async (req, res) => {
    try {
        const { adIds, paymentMode } = req.body;

        if (!adIds || !Array.isArray(adIds) || adIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Please provide an array of ad IDs"
            });
        }

        await Ad.updateMany(
            { _id: { $in: adIds } },
            { paymentMode }
        );

        res.status(200).json({
            success: true,
            message: `${adIds.length} ad(s) updated successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllProductAds,
    getAllServiceAds,
    getAllEventAds,
    getAllExploreAds,
    getAllOfferAds,
    getAdDetails,
    deleteAd,
    updateAdStatus,
    getAdStatistics,
    bulkDeleteAds,
    bulkUpdateAdStatus
};