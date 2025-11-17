// controllers/notification.controller.js
const Notification = require("../models/notification.model");
const { ApiResponse } = require("../utils/apiResponse");
const { ApiError } = require("../utils/apiError");
const mongoose = require("mongoose");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) throw new ApiError(401, "User not authenticated");

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const isRead =
      req.query.isRead === undefined ? undefined : req.query.isRead === "true";

    const skip = (page - 1) * limit;

    // Build filter: exclude notifications created by this user himself
    const filter = {
      userId: { $ne: new mongoose.Types.ObjectId(userId) }, // exclude self
    };
    if (typeof isRead === "boolean") filter.isRead = isRead;

    const totalCount = await Notification.countDocuments(filter);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("adId", "title images price");

    return res.status(200).json(
      new ApiResponse(200, {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      })
    );
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    if (error instanceof ApiError)
      return res.status(error.statusCode).json(error.toJSON());
    return res
      .status(500)
      .json(new ApiError(500, "Error fetching notifications", [error.message]));
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const notificationId = req.params.id;

    if (!userId) throw new ApiError(401, "User not authenticated");
    if (!notificationId) throw new ApiError(400, "Notification id required");

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.isRead = true;

    await notification.save();
    return res.status(200).json(new ApiResponse(200, { notification }));
  } catch (error) {
    console.error("❌ Error marking notification read:", error);
    if (error instanceof ApiError)
      return res.status(error.statusCode).json(error.toJSON());
    return res
      .status(500)
      .json(new ApiError(500, "Error marking as read", [error.message]));
  }
};

const markAsClicked = async (req, res, next) => {
  try {
    const notificationId = req.params.id;

    console.log("CLICK ID:", notificationId);

    if (!notificationId) {
      throw new ApiError(400, "Notification ID is required");
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.isClicked = true;
    notification.clickedAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as clicked",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAsClicked,
};
