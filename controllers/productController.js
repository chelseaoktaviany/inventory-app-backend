const factory = require('./handleFactory');

// models
const Product = require('../models/productModel');

// utils
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = factory.getAll(
  Product,
  'Retrieved data products successfully'
);

exports.getProduct = factory.getAll(
  Product,
  'Retrieved a data product successfully'
);

exports.createProduct = factory.createOne(
  Product,
  'Created data product successfully'
);

exports.updateProduct = factory.updateOne(
  Product,
  'Updated data product successfully'
);

exports.deleteProduct = factory.deleteOne(
  Product,
  'Deleted data product successfully'
);

exports.getItemReports = catchAsync(async (req, res, next) => {
  const reports = await Product.aggregate([]);
});
