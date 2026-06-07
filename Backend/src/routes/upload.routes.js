const express = require("express");
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadImage);

module.exports = router;
