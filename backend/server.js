// server.js
const path = require('path');
// Load dotenv FIRST, before any other imports
const dotenv = require('dotenv');
// Configure dotenv with the absolute path
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Now import all other dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./db');

// Route imports
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');
const emailRoutes = require('./routes/emailRoutes');

// Controllers
const chatController = require('./controllers/chatController');

// Initialize express and create HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);  
app.use('/api', chatRoutes);  
app.use('/api', emailRoutes);

// File routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize socket event handlers
chatController.handleSocketEvents(io);

// Server startup
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();