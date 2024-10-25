const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Make io available to our routes
app.set('io', io);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api/chat', chatRoutes);

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', (projectId) => {
    socket.join(projectId);
    console.log(`User joined chat for project ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB(); // Connect to MongoDB
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});