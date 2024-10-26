const Project = require('../models/Project');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const ADMIN_USER_ID = '671d191ddff639d00bb44512';

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const newProject = new Project({
      name,
      description,
      createdBy: userId
    });

    const savedProject = await newProject.save();

    const newChat = new Chat({
      projectId: savedProject._id,
      participants: [userId, ADMIN_USER_ID],
      messages: []
    })

    await newChat.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: savedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      message: 'An error occurred while creating the project',
      error: error.message
    });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;
    
    // If admin is requesting, show all projects
    if (requestingUserId === ADMIN_USER_ID) {
      const allProjects = await Project.find({})
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 });
      return res.json(allProjects);
    }
    
    // For regular users, only show their own projects
    if (requestingUserId !== userId) {
      return res.status(403).json({ 
        message: 'Access denied: You can only view your own projects' 
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const projects = await Project.find({ createdBy: userObjectId })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ 
      message: 'Error fetching user projects', 
      error: error.message 
    });
  }
};