const express = require("express");
const { createSeller } = require("../controllers/seller.controller");
const upload = require("../config/multer");
const { authorized } = require("../middlewares/authorization");

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  authorized,
  createSeller
);

module.exports = router;
