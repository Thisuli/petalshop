// ================================
// USER MODEL
// Defines how user data is stored
// in MongoDB database
// ================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
// This is like a blueprint for every user
const UserSchema = new mongoose.Schema(
  {
    // User's first name
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    // User's last name
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    // User's email must be unique
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    // Password will be hashed before saving
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // Role can be user or admin
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// ================================
// HASH PASSWORD BEFORE SAVING
// ================================
UserSchema.pre('save', async function () {
  // Only hash if password was changed or user is new
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash password
  this.password = await bcrypt.hash(this.password, salt);
});

// ================================
// COMPARE PASSWORD DURING LOGIN
// ================================
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
module.exports = mongoose.model('User', UserSchema);