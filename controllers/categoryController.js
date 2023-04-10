const factory = require('./handleFactory');

// util
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// models
const CategoryProduct = require('../models/categoryModel');

exports.getAllCategories = factory.getAll(
  CategoryProduct,
  'Retrieved data categories successfully'
);

exports.getCategory = factory.getAll(
  CategoryProduct,
  'Retrieved data category successfully'
);

exports.createCategory = catchAsync(async (req, res, next) => {
  const { categoryName } = req.body;

  const category = await CategoryProduct.findOne({ categoryName });

  // memeriksa jika kategori sudah ada
  if (category) {
    return next(new AppError('Category Already Exist', 409));
  }

  const newCategory = await CategoryProduct.create({ categoryName });

  res.status(201).json({
    status: 0,
    msg: 'Add category success',
    data: newCategory,
  });
});

exports.updateCategory = factory.updateOne(
  CategoryProduct,
  'Edit category success'
);

exports.deleteCategory = factory.deleteOne(
  CategoryProduct,
  'Deleted category successfully'
);
