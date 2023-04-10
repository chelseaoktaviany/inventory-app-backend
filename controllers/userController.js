const factory = require('./handleFactory');

// using model
const User = require('../models/userModel');

exports.getAllUsers = factory.getAll(User, 'Retrieved data successfully');

exports.getUser = factory.getOne(User, 'Retrieved data successfully');

exports.editUser = factory.updateOne(User, 'Account updated');

exports.deleteUser = factory.deleteOne(User, 'Deleted user success');
