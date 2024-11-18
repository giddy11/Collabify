const express = require('express');
const { signup, createUser, login, forgotPassword, changePassword, logout, googleLogin, refreshAccessToken } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/create-user', authMiddleware, createUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', authMiddleware, changePassword);
router.post('/logout', logout);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshAccessToken);


module.exports = router;