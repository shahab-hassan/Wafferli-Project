const User = require("../models/user.model");
const Seller = require("../models/seller.model");
const Ad = require("../models/ad/baseAd.model");

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const { filterType, search } = req.query;

        let query = {};

        // Apply search filter
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Apply role/status filter
        if (filterType && filterType !== 'All') {
            if (filterType === 'Verified') {
                query.isVerified = true;
            } else if (filterType === 'Unverified') {
                query.isVerified = false;
            } else if (filterType === 'Sellers') {
                query.role = 'seller';
            } else if (filterType === 'Users') {
                query.role = 'user';
            }
        }

        const users = await User.find(query)
            .select('-password -otp -otpExpiry -token')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, users, count: users.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get All Sellers
const getAllSellers = async (req, res) => {
    try {
        const { filterType, search } = req.query;

        let userQuery = {};
        let sellerQuery = {};

        // Apply search filter
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const users = await User.find({
                $or: [
                    { email: searchRegex },
                    { fullName: searchRegex },
                    { phone: searchRegex }
                ]
            }).select('_id');

            const userIds = users.map(u => u._id);
            sellerQuery.$or = [
                { userId: { $in: userIds } },
                { name: searchRegex },
                { category: searchRegex }
            ];
        }

        // Apply filter type
        if (filterType && filterType !== 'All') {
            if (filterType === 'Business') {
                sellerQuery.businessType = 'business';
            } else if (filterType === 'Individual') {
                sellerQuery.businessType = 'individual';
            } else if (filterType === 'Paid') {
                // Get user IDs with paid ads
                const paidUserIds = await Ad.distinct("userId", {
                    paymentMode: { $in: ["monthly", "annually"] }
                });
                sellerQuery.userId = { $in: paidUserIds };
            } else if (filterType === 'Free') {
                // Get user IDs without paid ads
                const paidUserIds = await Ad.distinct("userId", {
                    paymentMode: { $in: ["monthly", "annually"] }
                });
                sellerQuery.userId = { $nin: paidUserIds };
            }
        }

        const sellers = await Seller.find(sellerQuery)
            .populate({
                path: 'userId',
                select: '-password -otp -otpExpiry -token'
            })
            .sort({ createdAt: -1 });

        // Calculate additional stats for each seller
        const sellersWithStats = await Promise.all(sellers.map(async (seller) => {
            const totalAds = await Ad.countDocuments({ userId: seller.userId._id });
            const paidAds = await Ad.countDocuments({
                userId: seller.userId._id,
                paymentMode: { $in: ["monthly", "annually"] }
            });

            return {
                ...seller.toObject(),
                totalAds,
                paidAds,
                freeAds: totalAds - paidAds
            };
        }));

        res.status(200).json({
            success: true,
            sellers: sellersWithStats,
            count: sellersWithStats.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Single Seller Details
const getSellerDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const seller = await Seller.findById(id)
            .populate({
                path: 'userId',
                select: '-password -otp -otpExpiry -token'
            });

        if (!seller) {
            return res.status(404).json({ success: false, error: "Seller not found" });
        }

        // Get seller's ads statistics
        const totalAds = await Ad.countDocuments({ userId: seller.userId._id });
        const productAds = await Ad.countDocuments({ userId: seller.userId._id, adType: "product" });
        const serviceAds = await Ad.countDocuments({ userId: seller.userId._id, adType: "service" });
        const eventAds = await Ad.countDocuments({ userId: seller.userId._id, adType: "event" });
        const exploreAds = await Ad.countDocuments({ userId: seller.userId._id, adType: "explore" });
        const offerAds = await Ad.countDocuments({ userId: seller.userId._id, adType: "offer" });

        const paidAds = await Ad.countDocuments({
            userId: seller.userId._id,
            paymentMode: { $in: ["monthly", "annually"] }
        });

        // Get recent ads
        const recentAds = await Ad.find({ userId: seller.userId._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title adType createdAt rating reviewsCount favoritesCount');

        // Calculate total engagement
        const engagement = await Ad.aggregate([
            { $match: { userId: seller.userId._id } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: "$reviewsCount" },
                    totalFavorites: { $sum: "$favoritesCount" },
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        const sellerDetails = {
            ...seller.toObject(),
            stats: {
                totalAds,
                productAds,
                serviceAds,
                eventAds,
                exploreAds,
                offerAds,
                paidAds,
                freeAds: totalAds - paidAds,
                totalReviews: engagement[0]?.totalReviews || 0,
                totalFavorites: engagement[0]?.totalFavorites || 0,
                avgRating: engagement[0]?.avgRating || 0
            },
            recentAds
        };

        res.status(200).json({ success: true, seller: sellerDetails });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // If user is a seller, delete seller profile and all ads
        if (user.role === 'seller') {
            await Seller.deleteOne({ userId: id });
            await Ad.deleteMany({ userId: id });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Toggle User Verification
const toggleUserVerification = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        user.isVerified = !user.isVerified;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
            isVerified: user.isVerified
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get User Statistics
const getUserStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const sellerUsers = await User.countDocuments({ role: 'seller' });
        const regularUsers = await User.countDocuments({ role: 'user' });

        // Get recent users
        const recentUsers = await User.find()
            .select('-password -otp -otpExpiry -token')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get user growth by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
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

        res.status(200).json({
            success: true,
            statistics: {
                totalUsers,
                verifiedUsers,
                unverifiedUsers: totalUsers - verifiedUsers,
                sellerUsers,
                regularUsers,
                recentUsers,
                userGrowth
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllSellers,
    getSellerDetails,
    deleteUser,
    toggleUserVerification,
    getUserStatistics
};