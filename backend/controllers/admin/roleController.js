const { validationResult } = require("express-validator");
const Role = require("../../models/role");

const addRole = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { role_name, value } = req.body;

    const isExists = await Role.findOne({
      name: {
        $regex: role_name,
        $options: "i",
      },
    });

    if (isExists) {
      return res
        .status(400)
        .json({ success: false, message: "Role Name already exists!" });
    }

    const role = new Role({
      role_name,
      value,
    });

    const roleData = await role.save();

    return res.status(200).json({
      success: true,
      message: "Role added Successfully!",
      data: roleData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({value: {
      $ne:1 //admin
    }});

    return res.status(200).json({
      success: true,
      message: "Roles Fetched Successfully!",
      data: roles,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id, role_name, value } = req.body;

    // const isExists = await Category.findOne({ _id: id });
    const isExists = await Role.findOne({
      _id: { $ne: id },
      name: {
        $regex: role_name,
        $options: "i",
      },
    });

    if (!isExists) {
      return res
        .status(400)
        .json({ success: false, message: "Role ID Not found!" });
    }

    const isNameAssigned = await Role.findOne({
      _id: { $ne: id },
      role_name: {
        $regex: role_name,
        $options: "i",
      },
      value,
    });

    if (isNameAssigned) {
      return res.status(400).json({
        success: false,
        message: "Role Name already assigned to another permission!",
      });
    }

    var updateRole = {
      role_name,
      value,
    };

    const updatedRole = await Category.findByIdAndUpdate(
      { _id: id },
      { $set: updateRole },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Role Updated Successfully!",
      data: updatedRole,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Role is not found!",
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const isExists = await Role.findOne({ _id: id });

    if(!isExists){
      return res.status(400).json({
        success: false,
        message: error.message || "Role doesn't exists!",
      });
    }

    await Role.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Role Deleted Successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
};
