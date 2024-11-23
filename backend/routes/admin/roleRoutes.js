const express = require("express");
const {
    addRole,
    getRoles,
    updateRole,
    deleteRole,
} = require("../../controllers/admin/roleController");
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  roleAddValidator,
  roleUpdateValidator,
  roleDeleteValidator,
} = require("../../validators/adminValidator");
const { onlyAdminAccess } = require("../../middlewares/adminMiddleware");
const router = express.Router();

router.post("/role", authMiddleware, onlyAdminAccess, roleAddValidator, addRole);
router.get("/roles", authMiddleware, onlyAdminAccess, getRoles);
router.put("/role", authMiddleware, onlyAdminAccess, roleUpdateValidator, updateRole);
router.delete("/role", authMiddleware, onlyAdminAccess, roleDeleteValidator, deleteRole);

module.exports = router;