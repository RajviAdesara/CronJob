const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  contactNo: Number,
  gender: String,
  isAdmin: { type: Boolean, default: false }
});

const NewUser = mongoose.model('User', userSchema);

module.exports = NewUser;
