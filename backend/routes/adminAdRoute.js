const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/adminAdCtrl");
const { authorizeAdmin } = require("../middlewares/authorization");

// Statistics
router.get("/statistics", authorizeAdmin, getAdStatistics);

// Product Ads
router.get("/products/all", authorizeAdmin, getAllProductAds);

// Service Ads
router.get("/services/all", authorizeAdmin, getAllServiceAds);

// Event Ads
router.get("/events/all", authorizeAdmin, getAllEventAds);

// Explore Ads
router.get("/explore/all", authorizeAdmin, getAllExploreAds);

// Offer Ads
router.get("/offers/all", authorizeAdmin, getAllOfferAds);

// Common operations
router.get("/:id", authorizeAdmin, getAdDetails);
router.delete("/delete/:id", authorizeAdmin, deleteAd);
router.patch("/update-status/:id", authorizeAdmin, updateAdStatus);

// Bulk operations
router.post("/bulk-delete", authorizeAdmin, bulkDeleteAds);
router.post("/bulk-update-status", authorizeAdmin, bulkUpdateAdStatus);

module.exports = router;