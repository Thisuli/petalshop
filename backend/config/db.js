// ================================
// DATABASE CONNECTION
// Connects our app to MongoDB
// ================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, print the host name
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // If connection fails, print the error and stop the app
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;