const { validationResult } = require("express-validator");
const Product = require("../models/Product.model");
const imagekit = require("../config/imagekit");

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    const totalProducts = await Product.countDocuments(query);
    let products = [];

    if (
      req.query.page ||
      req.query.limit ||
      req.query.search ||
      req.query.category
    ) {
      products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      products = await Product.find().sort({ createdAt: -1 });
    }

    const mappedProducts = products.map((product) => {
      const doc = product.toObject();
      if (!doc.images || doc.images.length === 0) {
        doc.images = doc.image ? [doc.image] : [];
      }
      return doc;
    });

    const hasMore = skip + products.length < totalProducts;

    res
      .status(200)
      .json({ products: mappedProducts, hasMore, total: totalProducts });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one product image is required" });
  }

  try {
    const uploadedImages = [];
    for (const file of req.files) {
      try {
        const response = await imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}_${file.originalname || "image.webp"}`,
        });
        uploadedImages.push(response.url);
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload image to ImageKit",
          error: uploadError.message || uploadError,
        });
      }
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      images: uploadedImages,
      image: uploadedImages[0],
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res
      .status(500)
      .json({
        message: "Internal server error during product creation",
        error: error.message,
      });
  }
};

exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let existingImages = [];
    if (req.body.existingImages) {
      if (typeof req.body.existingImages === "string") {
        try {
          existingImages = JSON.parse(req.body.existingImages || "[]");
        } catch (e) {
          // Fallback if not stringified JSON (e.g. single string appended)
          existingImages = [req.body.existingImages];
        }
      } else if (Array.isArray(req.body.existingImages)) {
        existingImages = req.body.existingImages;
      }
    }

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("EXISTING:", existingImages);

    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const response = await imagekit.upload({
            file: file.buffer,
            fileName: `${Date.now()}_${file.originalname || "image.webp"}`,
          });
          uploadedImages.push(response.url);
        } catch (uploadError) {
          console.error("ImageKit upload error on update:", uploadError);
          return res.status(500).json({
            message: "Failed to upload image to ImageKit",
            error: uploadError.message || uploadError,
          });
        }
      }
    }

    const finalImages =
      uploadedImages.length > 0
        ? [...existingImages, ...uploadedImages]
        : existingImages;

    if (finalImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least 1 product image is required." });
    }

    if (finalImages.length > 7) {
      return res
        .status(400)
        .json({ message: "Maximum 7 images allowed total." });
    }

    const updateData = {
      ...req.body,
      images: finalImages,
    };

    if (finalImages.length > 0) {
      updateData.image = finalImages[0];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = updatedProduct.toObject();
    if (!result.images || result.images.length === 0) {
      result.images = result.image ? [result.image] : [];
    }

    console.log("Updated product images:", result.images);

    res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        product: result,
      });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ message: "Product update failed", error: error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};
