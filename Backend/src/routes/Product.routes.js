const express = require("express");
const { body, param } = require("express-validator");
const upload = require("../middleware/upload.middleware");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const createValidators = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
];

const updateValidators = [
  param("id").isMongoId().withMessage("Product ID is invalid"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
];

const deleteValidators = [
  param("id").isMongoId().withMessage("Product ID is invalid"),
];

router.get("/", getAllProducts);
router.post(
  "/",
  protect,
  upload.array("images", 7),
  createValidators,
  createProduct,
);
router.put(
  "/:id",
  protect,
  upload.array("images", 7),
  updateValidators,
  updateProduct,
);
router.delete("/:id", protect, deleteValidators, deleteProduct);

module.exports = router;
