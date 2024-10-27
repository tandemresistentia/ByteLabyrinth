const Project = require('../models/Project');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const {PROJECT_STATUSES, ADMIN_USER_ID} = require('../models/constants');

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

exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;
    const requestingUserId = req.user.id;

    // Verify project exists and user has permission
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only allow project creator or admin to update status
    if (requestingUserId !== ADMIN_USER_ID) {
      return res.status(403).json({ message: 'Not authorized to update project status' });
    }

    // Validate status is allowed
    if (!PROJECT_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the project status
    project.status = status;
    await project.save();

    res.json({ message: 'Project status updated successfully', project });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ 
      message: 'Error updating project status', 
      error: error.message 
    });
  }
};