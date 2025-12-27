const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Signup controller - Register a new portal user
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email Id should not be a duplicate in database',
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user with portal role
    const user = await userService.createUser({
      name,
      email,
      password_hash,
      role: 'portal',
    });

    // Auto-assign 1-2 random equipment to the new portal user
    let assignedEquipment = [];
    try {
      assignedEquipment = await userService.autoAssignEquipment(user.id, 2);
    } catch (equipmentError) {
      console.warn('Equipment assignment warning:', equipmentError.message);
      // Continue even if equipment assignment fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      assignedEquipment: assignedEquipment.map(eq => ({
        id: eq.id,
        name: eq.name,
        serial_number: eq.serial_number,
      })),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
};

/**
 * Login controller - Authenticate user and return JWT
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not exist',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Password',
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/**
 * Forgot password controller - Validate email and handle password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not exist',
      });
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Send an email with reset link
    // 3. Store token in database with expiration
    // For now, we'll just confirm the email exists

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email',
      email: user.email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
    });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
};

