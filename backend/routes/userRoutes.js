const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { onlyAdminAccess } = require("../middlewares/adminMiddleware");
const { userAddValidator, userUpdateValidator, userDeleteValidator } = require("../validators/adminValidator");

const router = express.Router();

// Create a new user
router.post("/user", authMiddleware, onlyAdminAccess, userAddValidator, createUser);

// Get all users
router.get("/users", authMiddleware, onlyAdminAccess, getAllUsers);

// Get user by ID
router.get("/user/:id", authMiddleware, onlyAdminAccess, getUserById);
router.get('/profile', authMiddleware, getProfile);

// Update user by ID
// router.put("/user/:id", authMiddleware, onlyAdminAccess, updateUser);
router.put("/user", authMiddleware, userUpdateValidator, updateUser);

// Delete user by ID
// router.delete("/user/:id", authMiddleware, deleteUser);
router.delete("/user", authMiddleware, onlyAdminAccess, userDeleteValidator, deleteUser);


module.exports = router;