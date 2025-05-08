const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidation = require("../middlewares/userValidation");
const UserService = require("../services/userService");

router.get("/api/v1/users", userController.getAllUsers);
router.get("/api/v1/users/:id", userController.getUserById);
router.post("/api/v1/users", userValidation, userController.createUser);
router.put("/api/v1/users/:id", userController.updateUser);
router.delete("/api/v1/users/:id", userController.deleteUser);

module.exports = router;
