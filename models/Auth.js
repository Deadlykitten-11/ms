const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Auth', authSchema, 'auths'); // Explicitly set collection name