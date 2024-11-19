const Onboarding = require("../models/onboarding");
const mongoose = require('mongoose');

// Create Onboarding
/** 
 * POST: http://localhost:4001/api/onboarding
 * Creates a new onboarding item.
 * @param {Object} data - The onboarding data to create.
 * Example:
 * {
 *   "name": "John Doe",
 *   "department": "Engineering",
 *   "topic": "Software Design",
 *   "noOfAcceptance": 15,
 *   "link": "http://example.com"
 * }
 * @returns {Promise<Object>} The created onboarding item.
 */
const createOnboarding = async (req, res) => {
  const { name, department, topic, noOfAcceptance, link } = req.body;

  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {  // Use req.user.id instead of req.user._id
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newOnboarding = new Onboarding({
      name,
      department,
      topic,
      noOfAcceptance,
      link,
      userId: req.user.id, // Associate with the logged-in user
    });

    await newOnboarding.save();

    return res.status(201).json({
      success: true,
      message: "Onboarding created successfully",
      onboarding: newOnboarding,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};



/** 
 * GET: http://localhost:4001/api/onboardings
 * Fetches all onboarding items from the backend.
 * @returns {Promise<Array>} List of onboarding items.
 */
const getAllOnboardings2 = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch onboarding items for the logged-in user
    const onboardings = await Onboarding.find({ userId: req.user._id });

    return res.status(200).json({ success: true, onboardings });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllOnboardings = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch onboarding items for the logged-in user
    const onboardings = await Onboarding.find({ userId: req.user.id });

    return res.status(200).json({ success: true, onboardings });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// Get Onboarding by ID
/** 
 * GET: http://localhost:4001/api/onboarding/:id
 * Fetches details of a specific onboarding item.
 * @param {string} id - The ID of the onboarding item.
 * @returns {Promise<Object>} The onboarding item details.
 */
const getOnboardingById = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  } 

  try {
    const onboarding = await Onboarding.findById(id);

    if (!onboarding) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding not found" });
    }

    return res.status(200).json({ success: true, onboarding });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Onboarding
/** 
 * PUT: http://localhost:4001/api/onboarding/:id
 * Updates an existing onboarding item.
 * @param {string} id - The ID of the onboarding item to update.
 * @param {Object} data - The updated onboarding data.
 * Example:
 * {
 *   "name": "Jane Doe",
 *   "department": "HR",
 *   "topic": "Team Management",
 *   "noOfAcceptance": 20,
 *   "link": "http://example.com"
 * }
 * @returns {Promise<Object>} The updated onboarding item.
 */
const updateOnboarding = async (req, res) => {
  const { id } = req.params;
  const { name, department, topic, noOfAcceptance, link } = req.body;

  try {
    const onboarding = await Onboarding.findById(id);
 
    if (!onboarding) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding not found" });
    }

    if (name) onboarding.name = name;
    if (department) onboarding.department = department;
    if (topic) onboarding.topic = topic;
    if (noOfAcceptance) onboarding.noOfAcceptance = noOfAcceptance;
    if (link) onboarding.link = link;

    await onboarding.save();

    return res.status(200).json({
      success: true,
      message: "Onboarding updated successfully",
      onboarding,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Onboarding
/** 
 * DELETE: http://localhost:4001/api/onboarding/:id
 * Deletes an onboarding item.
 * @param {string} id - The ID of the onboarding item to delete.
 * @returns {Promise<Object>} Success or failure message.
 */
const deleteOnboarding = async (req, res) => {
  const { id } = req.params;

  try {
    const onboarding = await Onboarding.findById(id);

    if (!onboarding) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding not found" });
    }

    // Use deleteOne() or findByIdAndDelete()
    await Onboarding.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Onboarding deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createOnboarding,
  getAllOnboardings,
  getOnboardingById,
  updateOnboarding,
  deleteOnboarding,
};