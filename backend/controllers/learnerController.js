const Learner = require('../models/learner');

/** POST: http://localhost:4001/api/learners/learner 
 * @param : {
  "fullName": "John Doe",
  "email": "john@example.com",
  "number": "1234567890",
  "fieldOfStudy": "Computer Science"
}
*/
const createLearner = async (req, res) => {
  const { fullName, email, number, fieldOfStudy } = req.body;

  try {
    const existingLearner = await Learner.findOne({ email });
    if (existingLearner) {
      return res.status(400).json({ message: "Learner already exists" });
    }

    const newLearner = new Learner({
      fullName,
      email,
      number,
      fieldOfStudy,
      noOfDocumentation: 0,
      noOfResolvedIssues: 0,
      rating: 0
    });

    await newLearner.save();

    return res.status(201).json({
      success: true,
      message: "Learner registered successfully",
      learner: {
        id: newLearner._id,
        fullName: newLearner.fullName,
        email: newLearner.email,
        fieldOfStudy: newLearner.fieldOfStudy,
        rating: newLearner.rating
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/** GET: http://localhost:4001/api/learners */
const getAllLearners = async (req, res) => {
    try {
      const learners = await Learner.find();
      return res.status(200).json({ success: true, learners });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

/** GET: http://localhost:4001/api/learners/:id */
const getLearner = async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    return res.status(200).json({ success: true, learner });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/** PUT: http://localhost:4001/api/learners/:id */
const updateLearner = async (req, res) => {
  const { fullName, number, fieldOfStudy, noOfDocumentation, noOfResolvedIssues, rating } = req.body;

  try {
    const learner = await Learner.findById(req.params.id);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    learner.fullName = fullName || learner.fullName;
    learner.number = number || learner.number;
    learner.fieldOfStudy = fieldOfStudy || learner.fieldOfStudy;
    learner.noOfDocumentation = noOfDocumentation !== undefined ? noOfDocumentation : learner.noOfDocumentation;
    learner.noOfResolvedIssues = noOfResolvedIssues !== undefined ? noOfResolvedIssues : learner.noOfResolvedIssues;
    learner.rating = rating !== undefined ? rating : learner.rating;

    await learner.save();

    return res.status(200).json({ success: true, message: "Learner updated successfully", learner });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/** DELETE: http://localhost:4001/api/learners/:id */
const deleteLearner = async (req, res) => {
  try {
    const learner = await Learner.findByIdAndDelete(req.params.id);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    return res.status(200).json({ success: true, message: "Learner deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createLearner, getAllLearners, getLearner, updateLearner, deleteLearner };
