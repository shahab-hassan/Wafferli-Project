// routes/notifications.js
const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAsClicked,
} = require("../controllers/notification.controller");
const { authorized } = require("../middlewares/authorization");

router.use(authorized);

// GET /api/notifications?page=1&limit=10&isRead=true
router.get("/", getNotifications);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", markAsRead);

// PATCH /api/notifications/:id/click
router.patch("/:id/click", markAsClicked);

module.exports = router;
