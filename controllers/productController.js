/* eslint-disable radix */
const factory = require('./handleFactory');

// models
const Product = require('../models/productModel');

// utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.getProdReports = catchAsync(async (req, res, next) => {
  const month = parseInt(req.params.month);
  const year = req.params.year;

  if (Number.isNaN(month) || month < 1 || month > 12 || Number.isNaN(year)) {
    return next(new AppError('Invalid month or year', 400));
  }

  const reports = await Product.aggregate([
    { $unwind: '$purchaseDate' },
    {
      $match: {
        purchaseDate: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$purchaseDate' },
          year: { $year: '$purchaseDate' },
        },
        numProducts: { $sum: 1 },
        totalPrice: { $sum: '$eachPrice' },
        numCondGood: {
          $sum: '$conditionGood',
        },
        numCondBad: {
          $sum: '$conditionBad',
        },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numProdStarts: -1 },
    },
  ]);

  // send response
  res.status(200).json({
    status: 0,
    msg: 'Retrieved data product  report successfully',
    data: reports,
  });
});
