const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(400).send('Invalid token.');
  }
};

module.exports = requireAuth;
