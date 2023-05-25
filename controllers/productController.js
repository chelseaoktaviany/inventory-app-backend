/* eslint-disable radix */
const factory = require('./handleFactory');

// models
const Product = require('../models/productModel');
const ProductType = require('../models/productTypeModel');
const CategoryProduct = require('../models/categoryModel');
const SubCategoryProduct = require('../models/subCategoryModel');
const VendorProduct = require('../models/vendorModel');

// utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProducts = factory.getAll(
  Product,
  'Retrieved data products successfully'
);

exports.getProduct = factory.getOne(
  Product,
  { path: 'group' },
  'Retrieved a data product successfully'
);

// exports.createProduct = factory.createOne(
//   Product,
//   'Created data product successfully'
// );

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    brandName,
    group,
    categoryName,
    subCategoryName,
    typeProductName,
    vendorName,
    purchaseDate,
    quantity,
    eachPrice,
    currentLocation,
    conditionGood,
    conditionBad,
  } = req.body;

  const category = await CategoryProduct.findOne({ categoryName });
  const subCategory = await SubCategoryProduct.findOne({ subCategoryName });
  const typeProduct = await ProductType.findOne({ type: typeProductName });
  const vendor = await VendorProduct.findOne({ vendorName });

  const product = await Product.create({
    brandName,
    group,
    category: category._id,
    categoryName,
    subCategory: subCategory._id,
    subCategoryName,
    typeProduct: typeProduct._id,
    typeProductName,
    vendor: vendor._id,
    vendorName,
    purchaseDate,
    quantity,
    eachPrice,
    currentLocation,
    conditionGood,
    conditionBad,
  });

  res.status(201).json({
    status: 0,
    msg: 'Created data product successfully',
    data: product,
  });
});

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

  const pipeline = [
    {
      $facet: {
        products: [
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
        ],
        productTypes: [
          {
            $match: {
              purchaseDateProductType: {
                $gte: new Date(`${year}-${month}-01`),
                $lte: new Date(`${year}-${month}-31`),
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$purchaseDateProductType' },
                year: { $year: '$purchaseDateProductType' },
              },
              numProducts: { $sum: 1 },
              totalPrice: { $sum: '$eachPriceProductType' },
              numCondGood: {
                $sum: '$conditionGoodProductType',
              },
              numCondBad: {
                $sum: '$conditionBadProductType',
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        products: { $arrayElemAt: ['$products', 0] },
        productTypes: { $arrayElemAt: ['$productTypes', 0] },
      },
    },
  ];

  const productReports = await Product.aggregate(pipeline);
  const productTypeReports = await ProductType.aggregate(pipeline);

  // send response
  res.status(200).json({
    status: 0,
    msg: 'Retrieved data product report successfully',
    data: [productReports, productTypeReports],
  });

  return {
    products: productReports[0].products,
    productTypes: productTypeReports[0].productTypes,
  };
});
