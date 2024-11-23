const express = require("express");
const {
    addRouterPermission,
    getRouterPermissions,
    updateRouterPermission,
    deleteRouterPermission,
} = require("../../controllers/admin/routerPermissionController");
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  roleUpdateValidator,
  roleDeleteValidator,
  routerPermissionAddValidator,
  getRouterPermissionValidator,
} = require("../../validators/adminValidator");
const { onlyAdminAccess } = require("../../middlewares/adminMiddleware");
const router = express.Router();

router.post("/router", authMiddleware, onlyAdminAccess, routerPermissionAddValidator, addRouterPermission);
router.get("/routers", authMiddleware, onlyAdminAccess, getRouterPermissionValidator, getRouterPermissions);
router.put("/router", authMiddleware, onlyAdminAccess, roleUpdateValidator, updateRouterPermission);
router.delete("/router", authMiddleware, onlyAdminAccess, roleDeleteValidator, deleteRouterPermission);

module.exports = router;