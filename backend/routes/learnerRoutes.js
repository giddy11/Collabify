const express = require('express');
const { createLearner, getAllLearners, getLearner, updateLearner, deleteLearner } = require('../controllers/learnerController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/learner', authMiddleware, createLearner);
router.get('/learners', authMiddleware, getAllLearners);
router.get('/learner:id', authMiddleware, getLearner);
router.put('/learner:id', authMiddleware, updateLearner);
router.delete('/learner:id', authMiddleware, deleteLearner);

module.exports = router;