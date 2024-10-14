const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, projectController.createProject);
router.get('/user-projects/:userId', authMiddleware, projectController.getUserProjects);

module.exports = router;