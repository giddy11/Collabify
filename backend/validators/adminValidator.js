const { check } = require('express-validator');

exports.permissionValidator = [
    check('permission_name', 'Permission Name is Required').not().isEmpty(),
];

exports.permissionDeleteValidator = [
    check('id', 'ID is Required').not().isEmpty(),
];

exports.permissionUpdateValidator = [
    check('id', 'ID is Required').not().isEmpty(),
    check('permission_name', 'Permission Name is Required').not().isEmpty(),
];

exports.categoryAddValidator = [
    check('category_name', 'Category Name is Required').not().isEmpty(),
];

exports.categoryDeleteValidator = [
    check('id', 'ID is Required').not().isEmpty(),
];

exports.categoryUpdateValidator = [
    check('id', 'ID is Required').not().isEmpty(),
    check('category_name', 'Category Name is Required').not().isEmpty(),
    check('description', 'Description is Required').not().isEmpty(),
];

exports.postAddValidator = [
    check('title', 'Title is Required').not().isEmpty(),
];

exports.postDeleteValidator = [
    check('id', 'ID is Required').not().isEmpty(),
];

exports.postUpdateValidator = [
    check('id', 'ID is Required').not().isEmpty(),
    check('title', 'Title is Required').not().isEmpty(),
    check('description', 'Description is Required').not().isEmpty(),
];

exports.roleAddValidator = [
    check('role_name', 'Role name is Required').not().isEmpty(),
    check('value', 'Value is Required').not().isEmpty(),
];

exports.roleDeleteValidator = [
    check('id', 'ID is Required').not().isEmpty(),
];

exports.roleUpdateValidator = [
    check('role_name', 'Role name is Required').not().isEmpty(),
    check('value', 'Value is Required').not().isEmpty(),
];

exports.userAddValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({gmail_remove_dots:true}),
    check('fullName', 'Full Name is Required').not().isEmpty(),
    check('role', 'Role is Required').not().isEmpty(),
    check('field', 'Field is Required').not().isEmpty(),
];

exports.userUpdateValidator = [
    check('id', 'ID is Required').not().isEmpty(),
];

exports.userDeleteValidator = [
    check('id', 'ID is Required').not().isEmpty(),
];

exports.routerPermissionAddValidator = [
    check('router_endpoint', 'router_endpoint is Required').not().isEmpty(),
    check('role', 'role is Required').not().isEmpty(),
    check('permission', 'permission must be an array').isArray()
];

exports.getRouterPermissionValidator = [
    check('router_endpoint', 'router_endpoint is Required').not().isEmpty(),
];