const Project = require('../models/Project');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const fs = require('fs');

const { PROJECT_STATUSES, isAdmin, ADMIN_USER_IDS } = require('../models/constants');

exports.createProject = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const userId = req.user.id;

    const newProject = new Project({
      name,
      description,
      createdBy: userId,
      price,
    });

    const savedProject = await newProject.save();
    const chatParticipants = [userId, ...ADMIN_USER_IDS];
    const uniqueParticipants = [...new Set(chatParticipants)];

    const newChat = new Chat({
      projectId: savedProject._id,
      participants: uniqueParticipants,
      messages: []
    });

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
    if (isAdmin(requestingUserId)) {
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

exports.uploadProjectFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const requestingUserId = req.user.id;

    // Check if user is admin
    if (!isAdmin(requestingUserId)) {
      return res.status(403).json({ 
        message: 'Only admins can upload project files' 
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      // Remove uploaded file if project not found
      if (req.file) {
        await fs.promises.unlink(req.file.path);
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete old file if it exists
    if (project.file && project.file.path) {
      try {
        await fs.promises.unlink(project.file.path);
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    // Update project with new file information
    project.file = {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      path: req.file.path,
      uploadedBy: requestingUserId
    };

    await project.save();

    res.json({
      message: 'File uploaded successfully',
      file: {
        fileName: project.file.fileName,
        fileSize: project.file.fileSize,
        uploadedAt: project.file.uploadedAt
      }
    });
  } catch (error) {
    // Clean up uploaded file in case of error
    if (req.file) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file after failed upload:', unlinkError);
      }
    }

    console.error('Error uploading file:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
};

exports.downloadProjectFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const requestingUserId = req.user.id;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has permission to download
    const hasPermission = isAdmin(requestingUserId) || 
                         project.createdBy.toString() === requestingUserId;
    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'You do not have permission to download this file' 
      });
    }

    // Check if project is completed (for non-admin users)
    if (!isAdmin(requestingUserId) && project.status !== 'Completed') {
      return res.status(403).json({ 
        message: 'File is only available after project completion' 
      });
    }

    // Verify file exists
    if (!project.file || !project.file.path) {
      return res.status(404).json({ message: 'No file available for this project' });
    }

    // Send file
    res.download(project.file.path, project.file.fileName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      message: 'Error downloading file',
      error: error.message
    });
  }
};