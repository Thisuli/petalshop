// ================================
// USER MODEL
// Defines how user data is stored
// in MongoDB database
// ================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// Define the User Schema
// This is like a blueprint for every user
const UserSchema = new mongoose.Schema(
  {
    // User's first name
    firstName: {
      type:     String,
      required: [true, 'First name is required'],
      trim:     true,
    },

    // User's last name
    lastName: {
      type:     String,
      required: [true, 'Last name is required'],
      trim:     true,
    },

    // User's email — must be unique
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      trim:     true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    // Password — will be hashed before saving
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // Role — either 'user' (customer) or 'admin'
    role: {
      type:    String,
      enum:    ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ─── HASH PASSWORD BEFORE SAVING ─────────
// This runs automatically before every save()
// It converts plain password → encrypted hash
UserSchema.pre('save', async function (next) {

  // Only hash if password was changed or is new
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt (random string to make hash unique)
  // 10 = how complex the hash is (10 is standard)
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the salt
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ─── METHOD: COMPARE PASSWORD ─────────────
// Used during login to check if password matches
// Returns true if match, false if not
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
module.exports = mongoose.model('User', UserSchema);