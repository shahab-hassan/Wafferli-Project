const { ApiError } = require("../utils/apiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  return res.status(500).json({
    statusCode: 500,
    message: err.message || "Internal Server Error",
    success: false,
    data: null,
    error: err.stack,
  });
};

module.exports = errorHandler;
