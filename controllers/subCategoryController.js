// dependencies
const multer = require('multer');

const path = require('path');

// controllers
const factory = require('./handleFactory');

// models
const CategoryProduct = require('../models/categoryModel');
const SubCategoryProduct = require('../models/subCategoryModel');

// utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/sub-categories/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `sub-category-${Date.now()}${ext}`);
  },
});

// multer filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('File must be in an image file format', 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 },
});

exports.uploadSubCategImage = upload.single('subCategoryImage');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllSubCategories = factory.getAll(
  SubCategoryProduct,
  'Retrieved data sub categories successfully'
);

exports.getSubCategory = factory.getOne(
  SubCategoryProduct,
  { path: '_id' },
  'Retrieved data sub category successfully'
);

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'categoryName', 'subCategoryName');

  const url = `${req.protocol}://${req.get('host')}/v1/im`;

  const category = await CategoryProduct.findOne({
    categoryName: filteredBody.categoryName,
  });

  if (!category) {
    return next(new AppError('No category found', 404));
  }

  const subCategory = await SubCategoryProduct.create({
    category: category._id,
    categoryName: filteredBody.categoryName,
    categorySlug: category.categorySlug,
    subCategoryName: filteredBody.subCategoryName,
    subCategoryImage: `${url}/uploads/sub-categories/${req.file.filename}`,
  });

  res.status(201).json({
    status: 0,
    msg: 'Add sub category success',
    data: subCategory,
  });
});

exports.updateSubCategory = factory.updateOne(
  SubCategoryProduct,
  'Edit sub category success'
);

exports.deleteSubCategory = factory.deleteOne(
  SubCategoryProduct,
  'Deleted sub category success'
);
