const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const generateToken = asyncHandler(async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY || "1d",
  });

  return token;
});

module.exports = generateToken;
