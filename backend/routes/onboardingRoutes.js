const express = require("express");
const {
  createOnboarding,
  getAllOnboardings,
  getOnboardingById,
  updateOnboarding,
  deleteOnboarding,
} = require("../controllers/onboardingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new onboarding record
router.post("/onboarding", authMiddleware, createOnboarding);

// Get all onboarding records
router.get("/onboardings", authMiddleware, getAllOnboardings);

// Get onboarding record by ID
router.get("/onboarding/:id", authMiddleware, getOnboardingById);

// Update onboarding record by ID
router.put("/onboarding/:id", authMiddleware, updateOnboarding);

// Delete onboarding record by ID
router.delete("/onboarding/:id", authMiddleware, deleteOnboarding);

module.exports = router;