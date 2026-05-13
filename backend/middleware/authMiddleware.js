// ================================
// AUTH MIDDLEWARE
// Protects routes that need login
// ================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── PROTECT MIDDLEWARE ───────────────────
// Add this to any route that needs the user
// to be logged in
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header has a Bearer token
  // Format: "Authorization: Bearer eyJhbGci..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token
      // .select('-password') means: get all fields EXCEPT password
      req.user = await User.findById(decoded.id).select('-password');

      // Move to the next function (the actual route)
      next();

    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized — invalid token',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }
};

// ─── ADMIN MIDDLEWARE ────────────────────
// Add this to routes that only admins can use
// Must be used AFTER protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin — allow access
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied — admin only',
    });
  }
};

module.exports = { protect, adminOnly };