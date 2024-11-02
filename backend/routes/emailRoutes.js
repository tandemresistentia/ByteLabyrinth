// routes.js
const express = require('express');
const router = express.Router();
const emailController = require('./controllers/email.controller');

router.post('/email/project-notification', emailController.sendProjectNotifications);

module.exports = router;