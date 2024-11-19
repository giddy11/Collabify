const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Create User
const createUser = async (req, res) => {
  const { email, fullName, field, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use." });
    }

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role specified." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      field,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, fullName, field, dob, phone, country, city, address } =
    req.body;

  try {
    const user = await User.findById(id); // Fetch user by ID

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only update fields that are not excluded
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (field) user.field = field;
    if (dob) user.dob = dob;
    if (phone) user.phone = phone;
    if (country) user.country = country;
    if (city) user.city = city;
    if (address) user.address = address;

    await user.save(); // Save the updated user

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        email: user.email,
        fullName: user.fullName,
        field: user.field,
        dob: user.dob,
        phone: user.phone,
        country: user.country,
        city: user.city,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.remove();
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};