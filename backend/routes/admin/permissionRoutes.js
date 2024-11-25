const express = require('express');
const { permissionValidator, permissionDeleteValidator, permissionUpdateValidator } = require('../../validators/adminValidator');
const { addPermission, getPermissions, deletePermission, updatePermission } = require('../../controllers/admin/permissionController');
const authMiddleware = require('../../middlewares/authMiddleware');
const { onlyAdminAccess } = require('../../middlewares/adminMiddleware');
const router = express.Router();

//permissions routes
router.post('/permission', authMiddleware, onlyAdminAccess, permissionValidator, addPermission);
router.get('/permissions', authMiddleware, onlyAdminAccess, permissionValidator, getPermissions);
router.delete('/permission', authMiddleware, onlyAdminAccess, permissionDeleteValidator, deletePermission);
router.put('/permission', authMiddleware, onlyAdminAccess, permissionUpdateValidator, updatePermission);

module.exports = router;