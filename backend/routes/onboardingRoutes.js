const express = require("express");
const {
  createOnboarding,
  getAllOnboardings,
  getOnboardingById,
  updateOnboarding,
  deleteOnboarding,
} = require("../controllers/onboardingController");
const authMiddleware = require("../middlewares/authMiddleware");
const { onlyAdminAccess } = require("../middlewares/adminMiddleware");

const router = express.Router();

// Create a new onboarding record
router.post("/onboarding", authMiddleware, onlyAdminAccess, createOnboarding);

// Get all onboarding records
router.get("/onboardings", authMiddleware, getAllOnboardings);

// Get onboarding record by ID
router.get("/onboarding/:id", authMiddleware, getOnboardingById);

// Update onboarding record by ID
router.put("/onboarding/:id", authMiddleware, onlyAdminAccess, updateOnboarding);

// Delete onboarding record by ID
router.delete("/onboarding/:id", authMiddleware, onlyAdminAccess, deleteOnboarding);

module.exports = router;