const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure multer storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "listings",
//     allowed_formats: ["jpg", "jpeg", "png"],
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "pics/");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});
// const upload = multer({ storage: storage });

// Initialize multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
