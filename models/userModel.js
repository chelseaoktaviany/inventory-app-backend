const mongoose = require('mongoose');
const validator = require('validator');

// membuat sebuah skema
const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },
    username: {
      type: String,
      required: [true, 'Please provide your username'],
    },
    emailAddress: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide your email address'],
      validate: [validator.isEmail, 'Make sure your e-mail address is valid'],
    },
    profileImage: {
      type: String,
      default: 'uploads/users/default.jpeg',
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

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isNew) {
    return next(); // Only generate userId for new users
  }

  try {
    const count = await mongoose.models.User.countDocuments();
    user.userId = (count + 1).toString(); // Generate userId based on current user count
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
