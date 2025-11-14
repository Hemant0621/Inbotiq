const authMiddleware = require('./auth');

const adminMiddleware = (req, res, next) => {
  // First verify authentication
  authMiddleware(req, res, () => {
    // Then check if user is admin
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Admin access required' });
    }
  });
};

module.exports = adminMiddleware;

