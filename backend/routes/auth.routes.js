const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
} = require('../utils/validators');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new portal user
 * @access  Public
 */
router.post('/signup', signupValidation, validate, authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);

module.exports = router;

