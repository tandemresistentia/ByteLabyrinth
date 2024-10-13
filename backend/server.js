const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db'); // Adjust the path if needed
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB(); // Connect to MongoDB
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});