const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const ProductService = require("../services/productService");
const upload = require("../middlewares/upload");
const productValidation = require("../middlewares/productValidation");

router.get("/api/v1/products", productController.getAllProducts);
router.get("/api/v1/products/:id", productController.getProductById);
router.post(
  "/api/v1/products",
  upload.single("image"),
  productValidation,
  productController.createProduct
);
router.put(
  "/api/v1/products/:id",
  upload.single("image"),
  productController.updateProduct
);
router.delete("/api/v1/products/:id", productController.deleteProduct);

module.exports = router;
