const { verifyToken } = require('../utils/token');
const User = require('../models/User');
const { sanitizeUser } = require('../utils/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

