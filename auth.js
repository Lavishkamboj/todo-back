const jwt = require('jsonwebtoken');
const JWT_SECRET="lavish"

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token,JWT_SECRET);
    req.user = decoded; // make user info available in req
   
    next();
    
  } catch (err) {
    return res.status(400).send('Invalid token.');
  }
};
module.exports=requireAuth;
