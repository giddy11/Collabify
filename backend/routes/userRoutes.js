const express = require('express');
const { signup, login, logout, googleLogin, refreshAccessToken } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshAccessToken);


module.exports = router; 