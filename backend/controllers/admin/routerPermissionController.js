const { validationResult } = require("express-validator");
const RouterPermission = require("../../models/routerPermission");

const addRouterPermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { router_endpoint, role, permission } = req.body;
    const routerPermission = await RouterPermission.findOneAndUpdate(
      {router_endpoint, role},
      {router_endpoint, role, permission},
      {upsert:true, new:true, setDefaultsOnInsert:true},
    )

    return res.status(200).json({
      success: true,
      message: "Router Permission added/updated Successfully!",
      data: routerPermission,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getRouterPermissions = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { router_endpoint } = req.body;

    const routerPermissions = await RouterPermission.find({
      router_endpoint
    });

    return res.status(200).json({
      success: true,
      message: "Router Permissions Fetched Successfully!",
      data: routerPermissions,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getRouters = async (req, res) => {
  try {
    const routes = [];
    const stack = req.app._router.stack;

    stack.forEach(data => {
      console.log(data);
      if(data.name === 'router' && data.handle.stack){
        data.handle.stack.forEach((handler) => {
          routes.push({
            path: handler.route.path,
            methods: handler.route.methods
          });
        })
      }
      // console.log(`data.name...${data.name}`);
      // console.log(`dta...${data}`);
    })
    // const routerPermissions = await RouterPermission.find({value: {
    //   $ne:1 //admin
    // }});

    return res.status(200).json({
      success: true,
      message: "RouterPermissions Fetched Successfully!",
      data: routes,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRouterPermission = async (req, res) => {
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

const deleteRouterPermission = async (req, res) => {
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
  addRouterPermission,
  getRouterPermissions,
  updateRouterPermission,
  deleteRouterPermission,
  getRouters
};
