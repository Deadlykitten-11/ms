const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const Auth = require('../models/Auth');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Signup route with validation
router.post(
  '/signup',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('position').notEmpty().withMessage('Position is required'),
  ],
  authController.signup
);

// Login route
router.post('/login', authController.loginUser);

// Add a route to get all user details
router.get('/users', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const users = await Auth.find();
    console.log("Fetched Users: ", users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error occurred while fetching users' });
  }
});

// Update user role (Protected route for admin)
router.put('/users/:username', verifyRole('admin'), async (req, res) => {
  try {
    const username = req.params.username;  // Extract username from URL parameter
    const newRole = req.body.role;  // Get new role from request body

    // Find the user by username and update their role
    const updatedUser = await Auth.findOneAndUpdate(
      { username: username },
      { role: newRole },
      { new: true } // Return the updated document
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error occurred while updating user role' });
  }
});


module.exports = router;


