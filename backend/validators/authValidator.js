const { check } = require('express-validator');

exports.registerValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({gmail_remove_dots:true}),
    check('fullName', 'Full Name is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
];

exports.loginValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({gmail_remove_dots:true}),
    check('password', 'password is required').not().isEmpty(),
];