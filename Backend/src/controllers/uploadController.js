const imagekit = require("../config/imagekit");

exports.uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // 🔥 IMPORTANT (no base64 needed)
      fileName: `${Date.now()}_${req.file.originalname}`,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.log(error); // debug
    next(error);
  }
};
