const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const ProductService = require("../services/productService");
const upload = require("../middlewares/upload");
const productValidation = require("../middlewares/productValidation");

// API ROUTES
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

// VIEW ROUTES
router.get("/view/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const category = req.query.category;

    const { products, totalItems, totalPages } =
      await ProductService.getAllWithPagination({ page, limit, category });

    res.render("products/index", {
      title: "Daftar Produk",
      products,
      totalProducts: totalItems,
      currentPage: page,
      totalPages,
      successMessage: req.flash("success"),
      errorMessage: req.flash("error"),
    });
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    res.status(500).send("Terjadi kesalahan saat memuat produk.");
  }
});

router.get("/view/products/create", (req, res) => {
  res.render("products/create", {
    title: "Tambah Produk Baru",
  });
});

router.get("/view/products/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getById(parseInt(id));
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.render("products/edit", {
      title: "Edit Produk",
      product,
    });
  } catch (error) {
    console.error("Error loading product:", error);
    res.status(500).send("Terjadi kesalahan saat memuat produk.");
  }
});

module.exports = router;
