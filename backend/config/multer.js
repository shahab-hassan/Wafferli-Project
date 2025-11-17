const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wafferli/uploads",
    resource_type: "auto",
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
});

module.exports = upload;
