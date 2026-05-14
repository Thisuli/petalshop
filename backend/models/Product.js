// ================================
// PRODUCT MODEL
// Defines how flower products
// are stored in MongoDB
// ================================

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    // Product name e.g. "Red Rose Bouquet"
    name: {
      type:     String,
      required: [true, 'Product name is required'],
      trim:     true,
    },

    // Detailed description
    description: {
      type:     String,
      required: [true, 'Product description is required'],
    },

    // Price in dollars
    price: {
      type:     Number,
      required: [true, 'Product price is required'],
      min:      [0, 'Price cannot be negative'],
    },

    // Original price (for showing discount)
    oldPrice: {
      type:    Number,
      default: null,
    },

    // How many are available
    stock: {
      type:    Number,
      required: [true, 'Stock quantity is required'],
      min:      [0, 'Stock cannot be negative'],
      default:  0,
    },

    // Category e.g. "roses", "tulips", "bouquets"
    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum: [
        'roses',
        'sunflowers',
        'tulips',
        'lilies',
        'bouquets',
        'seasonal',
        'daisies',
        'other',
      ],
      lowercase: true,
    },

    // Image URL — uploaded via Multer
    imageUrl: {
      type:    String,
      default: '',
    },

    // Occasions e.g. ["Birthday", "Wedding"]
    occasion: {
      type:    [String],
      default: [],
    },

    // Badge e.g. "New", "Sale", "Popular"
    badge: {
      type:    String,
      default: '',
    },

    // Star rating (1-5)
    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5,
    },

    // Number of reviews
    numReviews: {
      type:    Number,
      default: 0,
    },

    // Is this product active/visible?
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Product', ProductSchema);