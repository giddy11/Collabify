const User = require('../models/user');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const firebaseAdmin = require('../config/firebase');
const cookie = require('cookie');

/** POST: http://localhost:4001/api/auth/signup 
 * @param : {
  "email": "example@gmail.com",
  "password": "admin123"
}
*/
const signup = async (req, res) => {
    const { email, password, instituteName } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        instituteName
      });
  
      await newUser.save();
  
      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        { id: newUser._id, email: newUser.email, instituteName: newUser.instituteName },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "15m" } // Short expiry for access token
      );
      const refreshToken = jwt.sign(
        { id: newUser._id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "7d" } // Longer expiry for refresh token
      );
  
      newUser.refreshToken = refreshToken;
      await newUser.save();
  
      // Set cookies
      res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  
      return res.status(201).json({
        success: true, // Include success field here
        message: "Registration successful",
        user: {
          email: newUser.email,
          id: newUser._id,
          instituteName: newUser.instituteName,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
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
      const { instituteName, email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });
  
      // Generate tokens
      const accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
  
      // Update user's refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();
  
      // Set cookies
      res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  
      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken, // Include accessToken here for client storage
        user: { email: user.email, id: user._id, instituteName: user.instituteName }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Login failed", details: error.message });
    }
  };

  const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ message: "Refresh token required" });
  
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
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
      res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
  
      res.status(200).json({ message: "Access token refreshed" });
    } catch (error) {
      res.status(403).json({ message: "Refresh token expired or invalid", error: error.message });
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
      res.status(500).json({ error: "Logout failed", details: error.message, success:false });
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

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: 'Strict',
      path: '/'
    }));

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Google login failed', error });
  }
};

module.exports = { signup, login, logout, googleLogin, refreshAccessToken };