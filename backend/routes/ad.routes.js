const express = require("express");
const upload = require("../config/multer");
const { authorized, optionalAuth } = require("../middlewares/authorization");
const {
  createAd,
  getSearchSuggestions,

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
  updateAd,
  getAllMyAds,
  getAdById,
  deleteAd,
  getSellerDetail,
} = require("../controllers/ad");
const { searchClaimOffers } = require("../controllers/ad/offer.controller");

const router = express.Router();

// Create a new ad
router.post(
  "/create",
  authorized,
  upload.fields([{ name: "images", maxCount: 5 }]),
  createAd
);

router.get("/my-ads", authorized, getAllMyAds);
router.get("/get/:id", authorized, getAdById);

router.delete("/delete/:id", authorized, deleteAd);
router.put(
  "/update/:id",
  authorized,
  upload.fields([{ name: "images", maxCount: 5 }]),
  updateAd
);
router.get("/search/suggestions", optionalAuth, getSearchSuggestions);
router.get("/seller-details", authorized, getSellerDetail);

// Explore
router.get("/featured-explore", optionalAuth, getFeaturedExplore);
router.get("/explore-details/:id", optionalAuth, getExploreDetails);
router.get("/explore/all", optionalAuth, getAllExplore);
router.get("/explore/search", optionalAuth, searchExplore);

// Product
router.get("/featured-products", optionalAuth, getFeaturedProducts);
router.get("/product-details/:id", optionalAuth, getProductDetails);
router.get("/product/all", optionalAuth, getAllProducts);
router.get("/product/search", optionalAuth, searchProducts);

// Event
router.get("/featured-events", optionalAuth, getFeaturedEvents);
router.get("/event-details/:id", optionalAuth, getEventDetails);
router.get("/event/all", optionalAuth, getAllEvents);
router.get("/event/search", optionalAuth, searchEvents);

// Service
router.get("/featured-service", optionalAuth, getFeaturedService);
router.get("/service-details/:id", optionalAuth, getServiceDetails);
router.get("/service/all", optionalAuth, getAllService);
router.get("/service/search", optionalAuth, searchService);

// Offers/FlashDeal
router.get("/featured-flashdeals", optionalAuth, getFeaturedFlashDeals);
router.get("/flashdeal/all", optionalAuth, getAllFlashDeals);
router.get("/flashdeal/search", optionalAuth, searchFlashDeals);
router.get("/offer-details/:id", optionalAuth, getOfferDetails);
router.get("/offer/all", optionalAuth, getAllOffers);
router.get("/offer/search", optionalAuth, searchAllOffers);
router.post("/offer/claim", authorized, claimOffer);
router.get("/offer/my-wallet", authorized, myClaimedOffers);
router.get("/offer/search-wallet", authorized, searchClaimOffers);

// Review
router.get("/reviews/:id", getReviews);
router.post("/add-review/:id", authorized, addReview);
router.post("/toggle-review-like/:id", authorized, toggleReviewLike);

// Favorite
router.post("/toggle-favorite/:id", authorized, toggleFavorite);
router.get("/favorites", authorized, getFavorites);
module.exports = router;
