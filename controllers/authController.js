const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Auth = require('../models/Auth');
const PersonalDetail = require('../models/PersonalDetail');

// Signup Controller
exports.signup = async (req, res) => {
  
  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, name, phone, position, email, role } = req.body;

  try {
    // Check if the username already exists in Auth collection
    const existingAuthUser = await Auth.findOne({ username });
    if (existingAuthUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if the email already exists in PersonalDetail collection
    const existingEmail = await PersonalDetail.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the username and hashed password in Auth collection
    const authData = new Auth({
      username,
      password: hashedPassword,
      role,
    });
    await authData.save();

    // Save personal details in PersonalDetail collection
    const personalDetails = new PersonalDetail({
      username,
      name,
      phone,
      position,
      email,
    });
    await personalDetails.save();

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Server error occurred while signing up' });
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await Auth.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Check if the token generate proper
    console.log('Generated Token:', token);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error occurred while logging in' });
  }
};