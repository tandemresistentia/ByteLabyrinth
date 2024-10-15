const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:projectId', protect, chatController.getMessages);
router.post('/', protect, chatController.sendMessage);

module.exports = router;