// ================================
// PETALSHOP — MAIN SERVER FILE
// This is where our app starts
// ================================

// Load environment variables from .env file
require('dotenv').config();

// Import express framework
const express = require('express');

// Import our database connection function
const connectDB = require('./config/db');

// Import cors (allows frontend to call our API)
const cors = require('cors');

// Import path (for serving files)
const path = require('path');

// ─── CREATE EXPRESS APP ──────────────────
const app = express();

// ─── CONNECT TO DATABASE ─────────────────
// Call the connectDB function we made
connectDB();

// ─── MIDDLEWARE ──────────────────────────
// These run on EVERY request before our routes

// Allow requests from our frontend
app.use(cors({
  origin: '*', // In production, change to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON data
// This lets us read req.body in our routes
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
// So we can access them at /uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── ROUTES ──────────────────────────────
// We will add these one by one this week

// Test route — to check server is working
app.get('/', (req, res) => {
  res.json({
    message: '🌸 Welcome to PetalShop API!',
    status:  'Server is running',
    version: '1.0.0'
  });
});

// ─── AUTH ROUTES (Added May 12) ──────────
// app.use('/api/auth', require('./routes/authRoutes'));

// ─── PRODUCT ROUTES (Added May 14) ───────
// app.use('/api/products', require('./routes/productRoutes'));

// ─── ORDER ROUTES (Added May 18) ─────────
// app.use('/api/orders', require('./routes/orderRoutes'));

// ─── 404 HANDLER ─────────────────────────
// If no route matches, send 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ─── GLOBAL ERROR HANDLER ────────────────
// Catches any errors that happen in routes
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ─── START SERVER ─────────────────────────
// Read PORT from .env, default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PetalShop server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});