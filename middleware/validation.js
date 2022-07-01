const { check } = require("express-validator");



exports.registerCheck = [
    check('email').trim()
        .isEmail().withMessage('Please enter a valid email'),
    check("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    })
        .withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number, and one special character")
];

exports.loginCheck=[
    check('email').trim()
    .isEmail().withMessage('Please enter a valid email')
];

exports.postCheck=[
    check('title').trim().notEmpty().withMessage('Should have a title')
        .isLength({ min: 3, max: 50 }).withMessage("Title should be in 3 to 50 characters"),
    check('content').trim().notEmpty().withMessage('Should have a content')
        .isLength({ min: 3, max: 500 }).withMessage("Content should be in 3 to 500 characters"),
];