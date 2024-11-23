const express = require("express");
const {
    addRoute,
    getRoutes,
    updateRoute,
    deleteRoute,
} = require("../../controllers/admin/routerPermissionController");
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  roleAddValidator,
  roleUpdateValidator,
  roleDeleteValidator,
} = require("../../validators/adminValidator");
const { onlyAdminAccess } = require("../../middlewares/adminMiddleware");
const router = express.Router();

router.post("/route", authMiddleware, onlyAdminAccess, roleAddValidator, addRoute);
router.get("/routes", authMiddleware, onlyAdminAccess, getRoutes);
router.put("/route", authMiddleware, onlyAdminAccess, roleUpdateValidator, updateRoute);
router.delete("/route", authMiddleware, onlyAdminAccess, roleDeleteValidator, deleteRoute);

module.exports = router;