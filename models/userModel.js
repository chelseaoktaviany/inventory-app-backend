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

userSchema.pre('save', function (next) {
  const doc = this;
  if (doc.isNew) {
    // Auto-increment userId only for new documents
    mongoose
      .model('User', userSchema)
      .findOne({}, { userId: 1 }, { sort: { userId: -1 } })
      .then((err, lastUser) => {
        if (err) {
          return next(err);
        }
        doc.userId = lastUser ? lastUser.userId + 1 : 1;
        next();
      });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
