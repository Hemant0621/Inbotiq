const jwt = require('jsonwebtoken');

const ensureSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  return process.env.JWT_SECRET;
};

const signToken = (payload, options = {}) => {
  const secret = ensureSecret();
  return jwt.sign(payload, secret);
};

const verifyToken = (token) => {
  const secret = ensureSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  verifyToken,
};

