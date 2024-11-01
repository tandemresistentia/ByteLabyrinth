const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Controllers
const chatController = require('./controllers/chatController');

// Load environment variables
dotenv.config();

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
// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Middleware
app.use(cors());
app.use(express.json());
app.set('io', io); // Make io available to routes

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);  
app.use('/api', chatRoutes);  


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
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();