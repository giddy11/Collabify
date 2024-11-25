const User = require("../models/user");
const { generateToken } = require("../config/jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const firebaseAdmin = require("../config/firebase");
const cookie = require("cookie");
const { validationResult } = require('express-validator');
const UserPermission = require('../models/userPermission');
const Permission = require('../models/permission');

/** POST: http://localhost:4001/api/auth/signup 
 * @param : {
  "email": "example@gmail.com",
  "password": "admin123"
}
*/
const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
    });

    await newUser.save();

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email, fullName: newUser.fullName, role: newUser.role },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "550m" } // Short expiry for access token
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" } // Longer expiry for refresh token
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Include the tokens in the response body
    return res.status(201).json({
      success: true,
      tokenType: "Bearer",
      message: "Registration successful",
      data: {
        email: newUser.email,
        _id: newUser._id,
        fullName: newUser.fullName,
        role: newUser.role,
      },
      accessToken, // Add the access token to the response body
      refreshToken, // Add the refresh token to the response body (if needed)
    }); 
  } catch (error) {
    console.error(error);
    return res
      .status(500) 
      .json({ success: false, message: "Server error", error: error.message });
  }
};


// Forgot Password Feature
/** POST: http://localhost:4001/api/auth/forgot-password 
 * @param : {
   "email": "example@gmail.com" 
}
*/
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User with this email does not exist.",
        });
    }

    // Generate a default password
    const defaultPassword = Math.random().toString(36).slice(-8); // Generate a random 8-character password

    // Hash the default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Send the default password to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset - Your New Password",
      text: `Hello,\n\nYour password has been reset. Use the following password to log in:\n\nDefault Password: ${defaultPassword}\n\nPlease log in and change your password immediately for security purposes.\n\nThank you,\nThe Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "A new password has been sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/** POST: http://localhost:4001/api/auth/change-password 
 * @param : {
   "currentPassword": "oldPassword123",
   "newPassword": "newPassword123" 
}
*/
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming user ID is available via authentication middleware

  try {
    // Validate new password length
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters long.",
        });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    // Fetch user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/** POST: http://localhost:4001/api/auth/login 
 * @param : {
  "email": "example@gmail.com",
  "password": "admin123"
}
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(200).json({ 
        success: false,
        message: 'Errors', 
        errors: errors.array()
      });
    }

    const userData = await User.findOne({ email });
    if (!userData) return res.status(401).json({ success: false, error: "email not found" });

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid)
      return res.status(401).json({ success: false, message: "invalid password", error: "wrong password" });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: userData._id, role: userData.role },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "550m" }
    );
    const refreshToken = jwt.sign(
      { id: userData._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Update user's refresh token in DB
    userData.refreshToken = refreshToken;
    await userData.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      tokenType: 'Bearer',
      accessToken, // Include accessToken here for client storage
      // data: { email: userData.email, _id: userData._id, fullName: userData.fullName, role: userData.role },
      // data: userData
      data: userData
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Login failed", details: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(403).json({ success: false, message: "Refresh token required" });

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Set new access token in cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    res
      .status(403)
      .json({
        success: false,
        message: "Refresh token expired or invalid",
        error: error.message,
      });
  }
};

/** POST: http://localhost:5024/api/auth/login 
 * 
}
*/
const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Logout failed", details: error.message, success: false });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const googleId = decodedToken.uid;
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({ email: decodedToken.email, googleId });
    }

    const token = generateToken(user);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        sameSite: "Strict",
        path: "/",
      })
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Google login failed", error });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  changePassword,
  logout,
  googleLogin,
  refreshAccessToken,
};