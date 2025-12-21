const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getAllSellers,
    getSellerDetails,
    deleteUser,
    toggleUserVerification,
    getUserStatistics
} = require("../controllers/adminUserCtrl");
const { authorizeAdmin } = require("../middlewares/authorization");

// User routes
router.get("/users/all", authorizeAdmin, getAllUsers);
router.get("/users/statistics", authorizeAdmin, getUserStatistics);
router.delete("/users/delete/:id", authorizeAdmin, deleteUser);
router.patch("/users/toggle-verification/:id", authorizeAdmin, toggleUserVerification);

// Seller routes
router.get("/sellers/all", authorizeAdmin, getAllSellers);
router.get("/sellers/:id", authorizeAdmin, getSellerDetails);

module.exports = router;