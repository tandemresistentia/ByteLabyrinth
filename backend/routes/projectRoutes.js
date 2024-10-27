const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, projectController.createProject);
router.get('/projects/:userId', authMiddleware, projectController.getUserProjects);
router.patch('/projects/:projectId/status', authMiddleware, projectController.updateProjectStatus);

module.exports = router;