// dependencies
const multer = require('multer');
const sharp = require('sharp');

// controllers
const factory = require('./handleFactory');

// models
const SubCategoryProduct = require('../models/subCategoryModel');

// utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// multer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File must be in an image file format', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadSubCategImage = upload.single('subCategoryImage');

exports.resizeSubCategImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.subCategoryImage = `sub-category-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/sub-categories/${req.body.subCategoryImage}`);

  next();
});

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

exports.createSubCategory = factory.createOne(
  SubCategoryProduct,
  'Add sub category success'
);

exports.updateSubCategory = factory.updateOne(
  SubCategoryProduct,
  'Edit sub category success'
);

exports.deleteSubCategory = factory.deleteOne(
  SubCategoryProduct,
  'Deleted sub category success'
);
