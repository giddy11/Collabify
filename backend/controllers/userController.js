const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const randomString = require("randomstring");
const mongoose = require('mongoose');
// Create User
const createUser = async (req, res) => {
  const { email, fullName, phone, role } = req.body;
  console.log("From creat user backend ", role);
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    // Validate the role value
    if (![0, 1].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use." });
    }

    const password = randomString.generate(8);
    const hashedPassword = await bcrypt.hash(password, 10);

    var obj = {
      email,
      fullName,
      phone,
      role,
      password: hashedPassword,
    };

    // if (req.body.role && req.body.role == 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You cant create Admin",
    //   });
    // } else if (req.body.role) {
    //   obj.role = req.body.role;
    // }

    // if (req.body.role) {
    //   obj.role = req.body.role;
    // }

    const newUser = new User(obj);

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
      data: { 
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role,
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
    const users = await User.find({
      _id: {
        $ne: req.user._id,
      },
    });

    return res
      .status(200) 
      .json({   
        success: true,
        message: "Users Fetched Successfully",
        data: users,  
      }); 
  } catch (error) {
    console.error(error); 
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get User by ID
// const getUserById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//     return res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

const getUserById = async (req, res) => {
  const { id } = req.params;

  // Validate if the provided id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    }); 
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id, fullName, field, dob, phone, country, city, address } =
      req.body;

    const isExists = await User.findOne({
      _id: id,
    });

    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    var updateObj = {
      fullName,
      field,
      dob,
      phone,
      country,
      city,
      address,
    };

    if (req.body.role != undefined) {
      updateObj.role = req.body.role;
    }

    const updatedData = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: updateObj,
      }, 
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedData,
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
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const isExists = await User.findOne({
      _id: id,
    });

    if (!isExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete({ _id: id });

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

const getProfile = async (req, res) => {
  try {
    console.log("hello");
    const user_id = req.user.id;
    console.log(user_id);
    const userData = await User.findOne({ _id: user_id });

    return res.status(200).json({
      success: true,
      message: "Profile Data",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Change User Role
const changeUserRole = async (req, res) => {
  const { id, role } = req.body;

  if (role === undefined) {
    return res.status(400).json({
      success: false,
      message: "Role is required",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Updating the user's role
    user.role = role;
 
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
  changeUserRole
};