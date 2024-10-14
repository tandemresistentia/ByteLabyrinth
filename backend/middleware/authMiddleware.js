const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Authentication token must be Bearer token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // Attach user ID to request
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
};