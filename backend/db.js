// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', err => {
});

mongoose.connection.on('disconnected', () => {
  setTimeout(connectDB, 5000); // Attempt to reconnect after 5 seconds
});

module.exports = connectDB;