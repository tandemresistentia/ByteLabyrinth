const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

// Chat routes
router.post('/projects/:projectId/messages', auth, chatController.sendMessage);
router.get('/projects/:projectId/messages', auth, chatController.getMessages);

module.exports = router;