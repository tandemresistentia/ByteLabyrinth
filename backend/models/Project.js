const mongoose = require('mongoose');

const {PROJECT_STATUSES} = require('./constants');

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: PROJECT_STATUSES,
    default: 'Pending'
  },
  deadline: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  }
});

// Create indexes for better query performance
projectSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Project', projectSchema);