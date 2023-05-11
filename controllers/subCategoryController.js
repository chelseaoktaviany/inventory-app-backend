// dependencies
const multer = require('multer');
const sharp = require('sharp');

const path = require('path');

// controllers
const factory = require('./handleFactory');

// models
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
  { path: 'category' },
  'Retrieved data sub category successfully'
);

exports.getSubCategoryByName = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategoryProduct.findOne({
    subCategorySlug: req.params.subCategorySlug,
  });
  if (!subCategory) {
    return next(new AppError('Sub category not found', 404));
  }
  return res.status(200).json({
    status: 0,
    msg: 'Retrieved data sub category successfully',
    data: subCategory,
  });
});

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'category', 'subCategoryName');

  const file = req.file.path.replace(/\\/g, '/');
  const outputPath = path
    .join('uploads', 'sub-categories', `resized-${req.file.filename}`)
    .replace(/\\/g, '/');

  sharp(file).resize({ width: 500, height: 500 }).toFile(outputPath);

  const subCategory = await SubCategoryProduct.create({
    category: filteredBody.category,
    subCategoryName: filteredBody.subCategoryName,
    subCategoryImage: outputPath,
  });

  res.status(201).json({
    status: 0,
    msg: 'Add sub category success',
    data: { subCategory },
  });
});

// exports.createSubCategory = factory.createOne(
//   SubCategoryProduct,
//   'Add sub category success'
// );

exports.updateSubCategory = factory.updateOne(
  SubCategoryProduct,
  'Edit sub category success'
);

exports.deleteSubCategory = factory.deleteOne(
  SubCategoryProduct,
  'Deleted sub category success'
);
