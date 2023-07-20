const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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

// exports.editUser = factory.updateOne(User, 'Account updated');

exports.editUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const role = req.body.role;

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { role: role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError('No user found', 404));
  }

  res.status(200).json({
    status: 0,
    msg: 'User updated successfully',
    data: user,
  });
});

exports.deleteUser = factory.deleteOne(User, 'Deleted user success');
