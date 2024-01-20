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
const GroupProduct = require('../models/groupModel');

exports.getAllProducts = factory.getAll(
  Product,
  'Retrieved data products successfully'
);

exports.getProduct = factory.getOne(
  Product,
  { path: '_id' },
  'Retrieved a data product successfully'
);

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    brandName,
    groupName,
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

  const group = await GroupProduct.findOne({ groupName });
  const category = await CategoryProduct.findOne({ categoryName });
  const subCategory = await SubCategoryProduct.findOne({ subCategoryName });
  const typeProduct = await ProductType.findOne({ type: typeProductName });
  const vendor = await VendorProduct.findOne({ vendorName });

  const product = await Product.create({
    brandName,
    group: group._id,
    groupId: group.groupId,
    groupName,
    groupSlug: group.groupSlug,
    category: category._id,
    categoryId: category.categoryId,
    categoryName,
    categorySlug: category.categorySlug,
    subCategory: subCategory._id,
    subCategoryId: subCategory.subCategoryId,
    subCategoryName,
    subCategorySlug: subCategory.subCategorySlug,
    typeProduct: typeProduct._id,
    typeProductId: typeProduct.typeProductId,
    typeProductName,
    vendor: vendor._id,
    vendorName,
    vendorSlug: vendor.vendorSlug,
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
