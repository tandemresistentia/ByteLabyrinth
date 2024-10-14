const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // This is now available thanks to the middleware
    const newProject = new Project({
      name,
      description,
      createdBy: userId
    });

    const savedProject = await newProject.save();

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
    
    // Ensure the requesting user can only access their own projects
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied: You can only view your own projects' });
    }

    const projects = await Project.find({ createdBy: userId });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching user projects', error: error.message });
  }
};