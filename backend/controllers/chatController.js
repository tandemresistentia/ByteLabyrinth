const Chat = require('../models/Chat');
const Project = require('../models/Project');
const mongoose = require('mongoose');

const ADMIN_USER_ID = '671d191ddff639d00bb44512';

exports.getMessages = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user.id;
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    // Verify project exists and user has access
    const project = await Project.findById(projectObjectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or project creator
    if (userId !== ADMIN_USER_ID && project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    const chat = await Chat.findOne({ 
      projectId: projectObjectId
    })
      .populate('messages.user', 'username')
      .sort({ 'messages.timestamp': 1 })
      .exec();

    if (!chat) {
      return res.json([]);
    }

    const io = req.app.get('io');
    if (io) {
      const socketIo = req.headers['socket-id'];
      if (socketIo && io.sockets.sockets.get(socketIo)) {
        io.sockets.sockets.get(socketIo).join(projectId);
      }
    }

    res.json(chat.messages || []);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { message } = req.body;
    const userId = req.user.id;

    // Convert IDs to ObjectId
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Verify project exists and user has access
    const project = await Project.findById(projectObjectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or project creator
    if (userId !== ADMIN_USER_ID && project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // Find or create chat
    let chat = await Chat.findOne({ projectId: projectObjectId }).exec();
    
    if (!chat) {
      console.log('Creating new chat');
      chat = new Chat({
        projectId: projectObjectId,
        messages: []
      });
    }

    // Add message
    chat.messages.push({
      user: userObjectId,
      message: message,
      timestamp: new Date()
    });

    await chat.save();
    console.log('Chat saved successfully');

    // Populate user info for the new message
    await chat.populate('messages.user', 'username email');
    const populatedMessage = chat.messages[chat.messages.length - 1];

    // Emit to Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(projectId).emit('new-message', {
        ...populatedMessage.toObject(),
        projectId
      });
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      message: 'Error sending message',
      error: error.message 
    });
  }
};

exports.handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle joining project chat rooms
    socket.on('join-project', async (data) => {
      const { projectId, userId } = data;
      
      try {
        // Verify project and user authorization
        const project = await Project.findById(projectId);
        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // Allow if admin or project creator
        if (userId === ADMIN_USER_ID || project.createdBy.toString() === userId) {
          socket.join(projectId);
          console.log(`User ${userId} joined project chat: ${projectId}`);
          socket.emit('joined-project', { projectId });
        } else {
          socket.emit('error', { message: 'Not authorized to join this chat' });
        }
      } catch (error) {
        console.error('Error joining project chat:', error);
        socket.emit('error', { message: 'Error joining project chat' });
      }
    });

    // Handle leaving project chat rooms
    socket.on('leave-project', (projectId) => {
      socket.leave(projectId);
      console.log(`User left project chat: ${projectId}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { projectId, userId, username } = data;
      socket.to(projectId).emit('user-typing', { userId, username });
    });

    socket.on('stop-typing', (data) => {
      const { projectId, userId } = data;
      socket.to(projectId).emit('user-stop-typing', { userId });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};