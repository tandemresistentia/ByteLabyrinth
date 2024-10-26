// models/Chat.js
const mongoose = require('mongoose');

// Schema for individual chat messages
const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Main chat schema
const chatSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],  // Array of messages using the message schema
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add methods to the chat schema if needed
chatSchema.methods.addMessage = async function(userId, message) {
  this.messages.push({
    user: userId,
    message: message
  });
  return this.save();
};

// Create indexes for better query performance
chatSchema.index({ projectId: 1 });
chatSchema.index({ 'messages.timestamp': 1 });
chatSchema.index({ participants: 1});

module.exports = mongoose.model('Chat', chatSchema);