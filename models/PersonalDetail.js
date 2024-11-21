const mongoose = require('mongoose');

const personalDetailSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Link to Auth collection
  name: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('PersonalDetail', personalDetailSchema, 'personaldetails'); // Explicitly set collection name