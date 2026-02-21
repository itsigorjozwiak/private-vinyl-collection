const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nick: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  haslo: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);