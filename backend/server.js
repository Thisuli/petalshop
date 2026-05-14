// ================================
// PETALSHOP — MAIN SERVER FILE
// ================================

require('dotenv').config();

const express    = require('express');
const connectDB  = require('./config/db');
const cors       = require('cors');
const path       = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// ─── MIDDLEWARE ──────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── ROUTES ──────────────────────────────

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '🌸 Welcome to PetalShop API!',
    status:  'Server is running',
    version: '1.0.0',
    routes: {
      auth:     '/api/auth',
      products: '/api/products',
      orders:   '/api/orders (coming May 18)',
    }
  });
});

// Auth routes (Register + Login)
app.use('/api/auth', require('./routes/authRoutes'));

// Product routes
app.use('/api/products', require('./routes/productRoutes'));

// ─── 404 HANDLER ─────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── ERROR HANDLER ────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── START SERVER ─────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PetalShop server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV}`);
});