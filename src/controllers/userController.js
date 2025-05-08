const UserService = require("../services/userService");

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 8, name } = req.query;
    const users = await UserService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      name,
    });
    if (users.length > 0) {
      return res.status(200).json({
        message: "Users fetched successfully",
        data: users,
      });
    }
    return res.status(404).json({ message: "Users not found" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch users", details: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getById(parseInt(id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch user", details: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const newUser = await UserService.create({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create user", details: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const updatedUser = await UserService.update(parseInt(id), {
      name,
      email,
      password,
    });

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserService.delete(parseInt(id));

    if (req.headers.accept && req.headers.accept.includes("html")) {
      // Jika dari browser/EJS form
      req.flash("success", "User berhasil dihapus.");
      return res.redirect("/view/users");
    } else {
      // Jika dari API client seperti Postman
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (err) {
    if (req.headers.accept && req.headers.accept.includes("html")) {
      req.flash("error", "Gagal menghapus user.");
      return res.redirect("/view/users");
    } else {
      return res.status(500).json({
        error: "Failed to delete user",
        details: err.message,
      });
    }
  }
};

const renderUserList = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;

    const users = await UserService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const totalUsers = await UserService.count();
    const totalPages = Math.ceil(totalUsers / limit);

    res.render("users/index", {
      title: "Daftar User",
      users,
      currentPage: parseInt(page),
      totalPages,
      success_msg: req.flash("success"),
      error_msg: req.flash("error"),
    });
  } catch (err) {
    console.error("Gagal memuat user:", err);
    req.flash("error", "Terjadi kesalahan saat memuat user.");
    res.redirect("/");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  renderUserList,
};
