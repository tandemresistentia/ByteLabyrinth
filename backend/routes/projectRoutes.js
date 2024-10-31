const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/create', authMiddleware, projectController.createProject);
router.get('/projects/:userId', authMiddleware, projectController.getUserProjects);
router.patch('/projects/:projectId/status', authMiddleware, projectController.updateProjectStatus);
router.post('/projects/:projectId/upload',authMiddleware,upload.single('file'),projectController.uploadProjectFile);
router.get('/projects/:projectId/download',authMiddleware,projectController.downloadProjectFile);

module.exports = router;