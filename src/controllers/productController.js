const imagekit = require("../config/imagekit");
const ProductService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      if (req.headers.accept && req.headers.accept.includes("html")) {
        req.flash("error", "Semua field wajib diisi.");
        return res.redirect("/view/products/create");
      } else {
        return res.status(400).json({
          error: "All fields (name, price, and category) are required",
        });
      }
    }

    if (!req.file) {
      if (req.headers.accept && req.headers.accept.includes("html")) {
        req.flash("error", "Gambar produk wajib diunggah.");
        return res.redirect("/view/products/create");
      } else {
        return res.status(400).json({ error: "Product image is required" });
      }
    }

    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    const newProduct = await ProductService.create({
      name,
      price: parseFloat(price),
      category,
      image: uploadResult.url,
    });

    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("success", "Produk berhasil ditambahkan.");
      return res.redirect("/view/products");
    } else {
      return res.status(201).json({
        message: "Product created successfully with image",
        data: newProduct,
      });
    }
  } catch (err) {
    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("error", "Gagal menambahkan produk.");
      return res.redirect("/view/products/create");
    } else {
      return res
        .status(500)
        .json({ error: "Failed to create product", details: err.message });
    }
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 8, category } = req.query;
    const products = await ProductService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
    });
    if (products.length > 0) {
      return res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    }
    return res.status(404).json({ message: "No products found" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getById(parseInt(id));
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch product", details: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      if (req.headers.accept && req.headers.accept.includes("html")) {
        req.flash("error", "Semua field wajib diisi.");
        return res.redirect(`/products/${id}/edit`);
      } else {
        return res.status(400).json({
          error: "All fields (name, price, and category) are required",
        });
      }
    }

    let updatedData = {
      name,
      price: parseFloat(price),
      category,
    };

    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      updatedData.image = uploadResult.url;
    }

    const updatedProduct = await ProductService.update(
      parseInt(id),
      updatedData
    );

    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("success", "Produk berhasil diperbarui.");
      return res.redirect("/view/products");
    } else {
      return res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    }
  } catch (err) {
    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("error", "Gagal memperbarui produk.");
      return res.redirect(`/products/${req.params.id}/edit`);
    } else {
      return res.status(500).json({
        error: "Failed to update product",
        details: err.message,
      });
    }
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductService.delete(parseInt(id));

    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("success", "Produk berhasil dihapus.");
      return res.redirect("/view/products");
    } else {
      return res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (err) {
    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("error", "Gagal menghapus produk.");
      return res.redirect("/view/products");
    } else {
      return res.status(500).json({
        error: "Failed to delete product",
        details: err.message,
      });
    }
  }
};

const renderProductList = async (req, res) => {
  try {
    const { page = 1, limit = 8, category } = req.query;

    const products = await ProductService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
    });

    const totalProducts = await ProductService.count({ category });
    const totalPages = Math.ceil(totalProducts / limit);

    res.render("products/index", {
      title: "Daftar Produk",
      products,
      currentPage: parseInt(page),
      totalPages,
      success_msg: req.flash("success"),
      error_msg: req.flash("error"),
    });
  } catch (err) {
    console.error("Gagal memuat produk:", err);
    req.flash("error", "Terjadi kesalahan saat memuat produk.");
    res.redirect("/");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  renderProductList,
};
