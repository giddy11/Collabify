const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const randomString = require("randomstring");
const mongoose = require('mongoose');
const UserPermission = require('../models/userPermission');
const Permission = require('../models/permission');
const userPermission = require("../models/userPermission");

// Create User
const createUser = async (req, res) => {
  const { email, fullName, field, role } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
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
      field,
      role,
      password: hashedPassword,
    };

    if (req.body.role && req.body.role == 1) {
      return res.status(400).json({
        success: false,
        message: "You cant create Admin",
      });
    } else if (req.body.role) {
      obj.role = req.body.role;
    }

    const newUser = new User(obj);

    await newUser.save();

    // add permission to user if coming in request
    if(req.body.permissions != undefined && req.body.permissions.length > 0) {
      const addPermission = req.body.permissions;

      const permissionArray = [];

      await Promise.all(addPermission.map(async(permission) => {
        const permissionData = await Permission.findOne({_id: permission.id});

      console.log(`permissionData: ${permission.value}`);


        permissionArray.push({
          permission_name: permissionData.permission_name,
          permission_value: permission.value,
        });

      }));

      const userPermission = new UserPermission({
        user_id: newUser._id,
        permissions: permissionArray        
      });
      // console.log(userPermission);

      await userPermission.save();
    }

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
        field: newUser.field,
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
    // const users = await User.find({
    //   _id: {
    //     $ne: req.user._id,
    //   },
    // });

    const users = await User.aggregate([
      {
        $match: {
          _id:{
            // $ne: req.user._id
            $ne: new mongoose.Types.ObjectId(req.user._id)
          }
        }
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions"
        }
      },
      {
        $project: {
          _id: 1,
          fullName:1,
          email:1,
          role:1,
          permissions:{
            $cond:{
              if: {$isArray: "$permissions"},
              then: {$arrayElemAt: ["$permissions", 0]},
              else:null
            }
          }
        }
      },
      {
        $addFields:{
          "permissions":{
            "permissions": "$permissions.permissions"
          }
        }
      }
    ])



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
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id, email, fullName, field, dob, phone, country, city, address } =
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
      email,
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

    // add permission to user if coming in request
    if(req.body.permissions != undefined && req.body.permissions.length > 0) {
      const addPermission = req.body.permissions;

      const permissionArray = [];

      await Promise.all(addPermission.map(async(permission) => {
        const permissionData = await Permission.findOne({_id: permission.id});

        permissionArray.push({
          permission_name: permissionData.permission_name,
          permission_value: permissionData.value,
        });

      }));

      await UserPermission.findOneAndUpdate(
        {user_id: updatedData._id},
        {permissions: permissionArray},
        {upsert: true, new:true, setDefaultsOnInsert:true}
    )

    }

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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
};
