const express = require('express');
const rateLimit = require('express-rate-limit');

const { signup, login, forgotPassword, changePassword, logout, googleLogin, refreshAccessToken } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const router = express.Router();

// Set up rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.',
  });

router.post('/signup', registerValidator, loginLimiter, signup);
router.post('/login', loginValidator, loginLimiter, login);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', authMiddleware, changePassword);
router.post('/logout', logout);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshAccessToken);


module.exports = router; 