const express = require("express");
const {
  signup,
  checkAuth,
  signin,
  signout,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetOtp, // Renamed
  verifySignupOtp, // New
  resetPassword,
  resendOtp,
  sendSignupOtp, // New
} = require("../controllers/user.controller");
const { authorized } = require("../middlewares/authorization");

const router = express.Router();

router.post("/signup", signup); // Keep for backward compatibility
router.post("/send-signup-otp", sendSignupOtp); // New route
router.post("/verify-signup-otp", verifySignupOtp); // New route
router.post("/signout", authorized, signout);
router.post("/signin", signin);
router.patch("/update-profile", authorized, updateProfile);
router.patch("/change-password", authorized, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp); // Renamed route
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);
router.get("/check-auth", authorized, checkAuth);

module.exports = router;
