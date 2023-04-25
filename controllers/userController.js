const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// using model
const User = require('../models/userModel');

exports.getAllUsers = factory.getAll(User, 'Retrieved data successfully');

// get user
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.getUser = factory.getOne(
  User,
  { path: '_id' },
  'Retrieved data successfully'
);

exports.editUser = factory.updateOne(User, 'Account updated');

exports.deleteUser = factory.deleteOne(User, 'Deleted user success');
