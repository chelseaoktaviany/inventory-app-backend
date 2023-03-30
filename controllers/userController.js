const factory = require('./handleFactory');

// using model
const User = require('../models/userModel');

exports.getAllUsers = factory.getAll(User, 'Retrieved data successfully');
