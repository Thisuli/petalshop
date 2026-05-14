// ================================
// PRODUCT ROUTES
// GET    /api/products          — get all products
// GET    /api/products/:id      — get one product
// POST   /api/products          — add product (admin)
// PUT    /api/products/:id      — update product (admin)
// DELETE /api/products/:id      — delete product (admin)
// POST   /api/products/images/add — upload image (admin)
// ================================

const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const Product  = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─── MULTER SETUP (Image Upload) ─────────
// Defines where and how to save uploaded images

const storage = multer.diskStorage({

  // Save images in the uploads/ folder
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  // Give each image a unique filename
  // e.g. product-1715123456789.jpg
  filename: function (req, file, cb) {
    cb(
      null,
      'product-' + Date.now() +
      path.extname(file.originalname) // gets .jpg, .png etc
    );
  },
});

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage:    storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// ══════════════════════════════════════════
// @route   GET /api/products
// @desc    Get all active products
// @access  Public
// ══════════════════════════════════════════
router.get('/', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { category, minPrice, maxPrice, sort } = req.query;

    // Build filter object
    let filter = { isActive: true };

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort option
    let sortOption = {};
    if (sort === 'price-low')  sortOption = { price:  1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating')     sortOption = { rating: -1 };
    if (sort === 'newest')     sortOption = { createdAt: -1 };

    // Find all products matching filter
    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count:   products.length,
      data:    products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ══════════════════════════════════════════
// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
// ══════════════════════════════════════════
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data:    product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ══════════════════════════════════════════
// @route   POST /api/products
// @desc    Add a new product (Admin only)
// @access  Private/Admin
// ══════════════════════════════════════════
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name, description, price, oldPrice,
      stock, category, imageUrl, occasion,
      badge, rating,
    } = req.body;

    // Basic validation
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create the product
    const product = await Product.create({
      name,
      description,
      price:      Number(price),
      oldPrice:   oldPrice ? Number(oldPrice) : null,
      stock:      Number(stock),
      category:   category.toLowerCase(),
      imageUrl:   imageUrl || '',
      occasion:   occasion || [],
      badge:      badge    || '',
      rating:     rating   || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully! 🌸',
      data:    product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ══════════════════════════════════════════
// @route   POST /api/products/images/add
// @desc    Upload a product image (Admin only)
// @access  Private/Admin
// ══════════════════════════════════════════
router.post(
  '/images/add',
  protect,
  adminOnly,
  upload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image file',
        });
      }

      // Build the URL to access the image
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      res.status(200).json({
        success:  true,
        message:  'Image uploaded successfully!',
        imageUrl: imageUrl,
        filename: req.file.filename,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ══════════════════════════════════════════
// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
// ══════════════════════════════════════════
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new:          true, // return updated document
        runValidators: true, // run schema validators
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data:    updatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ══════════════════════════════════════════
// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
// ══════════════════════════════════════════
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;