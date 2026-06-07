const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

const emailValidator = body('email').isEmail().withMessage('Email must be valid').normalizeEmail();
const passwordValidator = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long');

router.post('/register', [emailValidator, passwordValidator], register);
router.post('/login', [emailValidator, passwordValidator], login);

module.exports = router;
