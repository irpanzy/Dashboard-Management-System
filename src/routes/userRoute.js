const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidation = require("../middlewares/userValidation");
const UserService = require("../services/userService");

// API ROUTES
router.get("/api/v1/users", userController.getAllUsers);
router.get("/api/v1/users/:id", userController.getUserById);
router.post("/api/v1/users", userValidation, userController.createUser);
router.put("/api/v1/users/:id", userController.updateUser);
router.delete("/api/v1/users/:id", userController.deleteUser);

// VIEW ROUTES
router.get("/view/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const name = req.query.name;

    const { users, totalItems, totalPages } =
      await UserService.getAllWithPagination({ page, limit, name });

    res.render("users/index", {
      title: "Daftar User",
      users,
      totalUsers: totalItems,
      currentPage: page,
      totalPages,
      succesMessage: req.flash("success"),
      errorMessage: req.flash("error"),
    });
  } catch (error) {
    console.error("Gagal memuat user:", error);
    res.status(500).send("Terjadi kesalahan saat memuat user.");
  }
});

module.exports = router;
