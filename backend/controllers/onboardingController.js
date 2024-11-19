const Onboarding = require("../models/onboarding");

// Create Onboarding
const createOnboarding = async (req, res) => {
  const { name, department, topic, noOfAcceptance, link } = req.body;

  try {
    const newOnboarding = new Onboarding({
      name,
      department,
      topic,
      noOfAcceptance,
      link,
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

// Get All Onboardings
const getAllOnboardings = async (req, res) => {
  try {
    const onboardings = await Onboarding.find();
    return res.status(200).json({ success: true, onboardings });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Onboarding by ID
const getOnboardingById = async (req, res) => {
  const { id } = req.params;

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
const deleteOnboarding = async (req, res) => {
  const { id } = req.params;

  try {
    const onboarding = await Onboarding.findById(id);

    if (!onboarding) {
      return res
        .status(404)
        .json({ success: false, message: "Onboarding not found" });
    }

    await onboarding.remove();

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