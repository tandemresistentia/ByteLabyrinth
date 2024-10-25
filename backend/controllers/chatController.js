const ChatMessage = require('../models/ChatMessage');

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ projectId: req.params.projectId })
      .populate('user', 'username')
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const newMessage = new ChatMessage({
      projectId,
      user: req.user.id, // Assuming req.user.id is set by your auth middleware
      message
    });
    await newMessage.save();
    
    // Populate the user field before sending the response
    await newMessage.populate('user', 'username');

    // Get the io instance
    const io = req.app.get('io');
    
    if (!io) {
      throw new Error('Socket.IO instance not found');
    }

    // Emit the message to all connected clients in the project room
    io.to(projectId).emit('message', newMessage);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};