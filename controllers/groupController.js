const factory = require('./handleFactory');

// util
const catchAsync = require('../utils/catchAsync');

// models
const GroupProduct = require('../models/groupModel');

exports.getAllGroups = factory.getAll(
  GroupProduct,
  'Retrieved data groups successfully'
);

exports.getGroup = factory.getOne(
  GroupProduct,
  { path: '_id' },
  'Retrieved data group successfully'
);

exports.createGroup = catchAsync(async (req, res, next) => {
  const { groupName } = req.body;

  const group = await GroupProduct.create({ groupName });

  res.status(201).json({
    status: 0,
    msg: 'Add group success',
    data: group,
  });
});

exports.deleteGroup = factory.deleteOne(
  GroupProduct,
  'Deleted group successfully'
);
