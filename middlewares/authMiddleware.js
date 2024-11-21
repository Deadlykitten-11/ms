// Middlewares (middlewares/authMiddleware.js)
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Generate a token using the secret key
function generateToken(user) {
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
    );
    return token;
}

// Middleware to verify the token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;  // Attach decoded token to request
      next();  // Proceed to the next middleware or route handler
    } catch (err) {
      console.error('Invalid Token:', err);
      res.status(400).json({ message: 'Invalid token' });
    }
  };
  

// Middleware to verify user role
exports.verifyRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      console.error('Role Mismatch: Required', role, 'but got', req.user?.role);
      res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }
  };
  