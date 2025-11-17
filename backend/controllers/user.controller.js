const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const generateToken = require("../utils/generateToken");
const { sendVerificationCode } = require("../utils/sendEmail");
const ClaimOffer = require("../models/ad/claimOffer.model");

// Send Signup OTP
const sendSignupOtp = async (req, res, next) => {
  try {
    const { email, phoneNumber, referralCode } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new ApiError(400, "Invalid email format");

    const phoneRegex = /^\+?[1-9]\d{5,14}$/;
    if (!phoneRegex.test(phoneNumber))
      throw new ApiError(400, "Invalid phone number format");

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      throw new ApiError(400, "Email already registered");
    }

    if (referralCode) {
      const refUser = await User.findOne({ referralCode });
      if (!refUser) {
        throw new ApiError(400, "Invalid referral code");
      }
    }

    if (existingUser && existingUser.isVerified === false) {
      // Not verified → resend OTP but return success message
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      existingUser.otp = otp;
      existingUser.otpExpiry = expiry;
      await existingUser.save();

      await sendVerificationCode(email, otp);

      return res.status(201).json(
        new ApiResponse(201, {
          message: "User already exists but not verified — OTP resent",
        })
      );
    }

    // Phone number check
    const existingPhone = await User.findOne({ phone: phoneNumber });
    if (existingPhone && existingPhone.isVerified)
      throw new ApiError(400, "Phone Number is already registered");

    // Create new temporary user
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const tempUser = new User({
      email,
      phone: phoneNumber,
      otp,
      otpExpiry: expiry,
      isVerified: false,
    });

    await tempUser.save();
    await sendVerificationCode(email, otp);

    return res
      .status(200)
      .json(new ApiResponse(200, { message: "Signup OTP sent successfully" }));
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.statusCode).json(error.toJSON());
    next(error);
  }
};

// SIGNUP (Updated)
const signup = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const phoneRegex = /^\+?[1-9]\d{5,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new ApiError(400, "Invalid phone number format (e.g. +1234567890)");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    // Check if user exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      throw new ApiError(400, "Email already registered");
    }

    // Check if user exists but not verified
    const unverifiedUser = await User.findOne({ email, isVerified: false });
    if (unverifiedUser) {
      throw new ApiError(400, "Please verify your email first using OTP");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone: phoneNumber,
      password: hashedPassword,
      isVerified: true, // Set to true after OTP verification in the new flow
    });

    const token = await generateToken(user);

    return res
      .status(201)
      .json(new ApiResponse(201, { user, token }, "Account Created"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

// Verify Signup OTP
const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp, fullName, phoneNumber, password, referralCode } =
      req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new ApiError(400, "Invalid email format");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    if (user.otp !== otp) throw new ApiError(400, "Invalid OTP");
    if (new Date() > user.otpExpiry) throw new ApiError(400, "OTP expired");

    // Verify additional fields for signup
    if (!fullName || !phoneNumber || !password) {
      throw new ApiError(400, "All fields are required for signup");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    // ✅ Referral code validation and loyalty points
    if (referralCode) {
      const refUser = await User.findOne({ referralCode });
      if (!refUser) {
        throw new ApiError(400, "Invalid referral code");
      }

      // Add 100 points to referral user
      refUser.loyalityPoints = (refUser.loyalityPoints || 0) + 100;
      await refUser.save();
    }

    // Check if phone already exists for verified users
    const existingPhone = await User.findOne({
      phone: phoneNumber,
      isVerified: true,
    });
    if (existingPhone)
      throw new ApiError(400, "Phone number already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with verified status and complete information
    user.fullName = fullName;
    user.phone = phoneNumber;
    user.password = hashedPassword;
    user.otp = "";
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    const token = await generateToken(user);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user, token }, "Signup completed successfully")
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

//  LOGIN
// LOGIN (Updated to check verification)
const signin = async (req, res, next) => {
  try {
    const { emailorPhone, password } = req.body;

    if (!emailorPhone || !password) {
      throw new ApiError(400, "Email or Phone and Password are required");
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    let user;

    if (phoneRegex.test(emailorPhone)) {
      user = await User.findOne({ phone: emailorPhone });
    } else {
      user = await User.findOne({ email: emailorPhone.toLowerCase().trim() });
    }

    if (!user) throw new ApiError(404, "User Not Found");

    // Check if user is verified
    if (!user.isVerified) {
      throw new ApiError(401, "Please verify your account before logging in");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    const token = await generateToken(user);

    return res
      .status(200)
      .json(new ApiResponse(200, { user, token }, "Login Successful"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

//  CHECK AUTH
const checkAuth = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");

    // Fetch full user doc
    const fullUser = await User.findById(user._id);

    if (!fullUser) {
      throw new ApiError(404, "User not found");
    }

    const userLoyaltyPoints = fullUser.totalloyaltiyPoints || 0;

    let membershipStatus = "Basic";
    if (userLoyaltyPoints > 1000) membershipStatus = "Diamond";
    else if (userLoyaltyPoints > 700) membershipStatus = "Gold";
    else if (userLoyaltyPoints > 500) membershipStatus = "Silver";

    const userData = {
      _id: fullUser._id,
      fullName: fullUser.fullName,
      email: fullUser.email,
      referralCode: fullUser.referralCode,
      loyaltyPoints: userLoyaltyPoints, // ✅ Direct from user model
      membershipStatus, // ✅ Calculated based on user's points
    };

    return res
      .status(200)
      .json(new ApiResponse(200, userData, "Authenticated User"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

// LOGOUT
const signout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { token: null });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendVerificationCode(email, otp);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP sent successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

//  Verify OTP
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new ApiError(400, "Invalid email format");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    if (user.otp !== otp) throw new ApiError(400, "Invalid OTP");
    if (new Date() > user.otpExpiry) throw new ApiError(400, "OTP expired");

    user.otp = "";
    user.otpExpiry = null;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP verified successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Generate new OTP and expiry time (10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send OTP again
    await sendVerificationCode(email, otp);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "New OTP sent successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

//  Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new ApiError(400, "Invalid email format");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successful"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { fullName, email, phone } = req.body;

    // Validation
    if (!fullName && !email && !phone) {
      throw new ApiError(400, "At least one field must be provided");
    }

    // Email validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        throw new ApiError(400, "Invalid email format");

      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) throw new ApiError(400, "Email already in use");
    }

    // Phone validation (if provided)
    if (phone) {
      const phoneRegex = /^\+(?:[1-9]\d{1,3})[1-9]\d{6,10}$/;
      if (!phoneRegex.test(phone))
        throw new ApiError(
          400,
          "Invalid phone number format (e.g. +923331234567)"
        );

      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: userId },
      });
      if (existingPhone) throw new ApiError(400, "Phone number already in use");
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "User details updated successfully")
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Old and new passwords are required");
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new ApiError(400, "Old password is incorrect");

    // New password validation
    if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters");
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
};
module.exports = {
  signup,
  signin,
  signout,
  checkAuth,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
  verifySignupOtp,
  updateProfile,
  changePassword,
  resendOtp,
  sendSignupOtp,
};
