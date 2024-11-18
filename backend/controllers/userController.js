const User = require("../models/user");
const { generateToken } = require("../config/jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const firebaseAdmin = require("../config/firebase");
const cookie = require("cookie");

/** POST: http://localhost:4001/api/auth/signup 
 * @param : {
  "email": "example@gmail.com",
  "password": "admin123"
}
*/
const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // Check if fullName is provided
    if (!fullName) {
      return res.status(400).json({ message: "Full name is required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
      { id: newUser._id, email: newUser.email, fullName: newUser.fullName },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "150m" } // Short expiry for access token
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

    return res.status(201).json({
      success: true, // Include success field here
      message: "Registration successful",
      user: {
        email: newUser.email,
        id: newUser._id,
        fullName: newUser.fullName,
        role: newUser.role
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// New Feature: Add User by Another User
/** POST: http://localhost:4001/api/auth/create-user 
 * @param : {
  "email": "example@gmail.com",
  "fullName": "Gideon Daniel",
  "field": "Software development",
  "password": "admin123"
  "role": "user"
}
*/
const createUser = async (req, res) => {
  const { email, fullName, field, password, role } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use." });
    }

    // Validate role
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role specified." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      fullName,
      field,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Send email to the new user with login details
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
      subject: "Welcome to Collabify",
      text: `Hello ${fullName},\n\nYour account has been created successfully.\n\nHere are your login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password immediately.\n\nThank you,\nThe Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message:
        "User created successfully. Login details have been sent to the user's email.",
      user: {
        email: newUser.email,
        fullName: newUser.fullName,
        field: newUser.field,
        role: newUser.role,
      },
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

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "email not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "wrong password" });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "150m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Update user's refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

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
      accessToken, // Include accessToken here for client storage
      user: { email: user.email, id: user._id },
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
    return res.status(403).json({ message: "Refresh token required" });

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
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
  createUser,
  login,
  forgotPassword,
  changePassword,
  logout,
  googleLogin,
  refreshAccessToken,
};
