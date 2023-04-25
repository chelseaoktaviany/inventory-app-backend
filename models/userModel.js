const mongoose = require('mongoose');
const validator = require('validator');

// membuat sebuah skema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide your username'],
    },
    emailAddress: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide your email address'],
      validate: [validator.isEmail, 'Make sure your e-mail address is valid'],
    },
    profileImage: {
      type: String,
      default: 'default.jpeg',
    },
    otp: {
      type: String,
      expires: '5m',
      index: true,
    },
    otpExpiration: Date,
    role: {
      type: String,
      enum: ['User', 'Admin', 'Super Admin'],
      default: 'User',
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
