const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new user
router.post("/user", authMiddleware, createUser);

// Get all users
router.get("/users", authMiddleware, getAllUsers);

// Get user by ID
router.get("/user/:id", authMiddleware, getUserById);

// Update user by ID
router.put("/user/:id", authMiddleware, updateUser);

// Delete user by ID
router.delete("/user/:id", authMiddleware, deleteUser);

module.exports = router;