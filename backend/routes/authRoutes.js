// ================================
// AUTH ROUTES
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me
// ================================

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ─── HELPER: GENERATE JWT TOKEN ──────────
// Creates a token with the user's ID inside
// Token expires in 30 days
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // payload
    process.env.JWT_SECRET,          // secret key from .env
    { expiresIn: '30d' }             // expiry
  );
};

// ══════════════════════════════════════════
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (anyone can register)
// ══════════════════════════════════════════
router.post('/register', async (req, res) => {
  try {
    // Get data sent from frontend
    const { firstName, lastName, email, password, role } = req.body;

    // ── Validation ──────────────────────
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // ── Check if email already exists ───
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // ── Create new user ─────────────────
    // Password will be hashed automatically
    // by the pre-save hook in User model
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'user', // default to 'user' if not provided
    });

    // ── Send response ───────────────────
    res.status(201).json({
      success: true,
      message: 'Account created successfully! 🌸',
      data: {
        _id:       user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
        token:     generateToken(user._id),
      },
    });

  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
});

// ══════════════════════════════════════════
// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
// ══════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // ── Validation ──────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // ── Find user by email ───────────────
    // +password means: include password field
    // (we excluded it by default in the model)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ── Check password ───────────────────
    // Uses the matchPassword method we defined in User model
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ── Send success response ────────────
    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back 🌸',
      data: {
        _id:       user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
        token:     generateToken(user._id),
      },
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
});

// ══════════════════════════════════════════
// @route   GET /api/auth/me
// @desc    Get current logged-in user info
// @access  Private (needs JWT token)
// ══════════════════════════════════════════
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        _id:       user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;