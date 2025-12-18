const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

exports.authorized = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401);
    throw new Error("Please login to access this resource!");
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error("Please login to access this resource!");
  }

  const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  req.user = await User.findById(decode.id);

  if (!req.user) {
    res.status(401);
    throw new Error("User not found, please login!");
  }

  next();
});

exports.optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
});









// const { ApiError } = require("../utils/apiError");

// exports.authorized = asyncHandler(async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return next(new ApiError(401, "No token provided"));
//     }

//     // ✅ Use Promise-based verification
//     const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return next(new ApiError(401, "User not found"));
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error.message);
//     return next(new ApiError(403, "Invalid or expired token"));
//   }
// });

// exports.optionalAuth = asyncHandler(async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token) {
//       // No token provided - continue without user
//       req.user = null;
//       return next();
//     }

//     // ✅ Use Promise-based verification
//     const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       // User not found but token was valid - continue without user
//       req.user = null;
//       return next();
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("Optional auth error:", error.message);
//     // Invalid token - continue without user (don't throw error)
//     req.user = null;
//     next();
//   }
// });
























// exports.authorizeAdmin = asyncHandler(async (req, res, next) => {

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         res.status(401);
//         throw new Error("Please login to access this resource!");
//     }

//     const token = authHeader.split(' ')[1];

//     if (!token) {
//         res.status(401);
//         throw new Error("Please login to access this resource!");
//     }

//     const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
//     req.admin = await adminModel.findById(decode.id);

//     if (!req.admin) {
//         res.status(401);
//         throw new Error("User not found, please login!");
//     }

//     next();
// });

// exports.authorizedRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             res.status(403)
//             throw new Error(`${req.user.role} is not allowed to access this Resource`);
//         }
//         next();
//     }
// }

// exports.combinedAuthorization = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader && authHeader.startsWith("Admin"))
//         this.authorizeAdmin(req, res, next);
//     else
//         this.authorized(req, res, next);
// };