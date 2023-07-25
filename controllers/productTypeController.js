const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// models
const ProductType = require('../models/productTypeModel');
const VendorProduct = require('../models/vendorModel');

exports.getAllProductTypes = factory.getAll(
  ProductType,
  'Retrieved data product types successfully'
);

exports.getProductType = factory.getOne(
  ProductType,
  { path: '_id' },
  'Retrieved a data product type successfully'
);

exports.createProductType = catchAsync(async (req, res, next) => {
  const {
    type,
    vendorName,
    purchaseDateProductType,
    quantityProductType,
    eachPriceProductType,
    currentLocationProductType,
    conditionGoodProductType,
    conditionBadProductType,
  } = req.body;

  const vendor = await VendorProduct.findOne({ vendorName });

  const productType = await ProductType.create({
    type,
    vendor: vendor._id,
    vendorName,
    vendorSlug: vendor.vendorSlug,
    purchaseDateProductType,
    quantityProductType,
    eachPriceProductType,
    currentLocationProductType,
    conditionGoodProductType,
    conditionBadProductType,
  });

  res.status(200).json({
    status: 0,
    msg: 'Add product type success',
    data: productType,
  });
});

exports.updateProductType = factory.updateOne(
  ProductType,
  'Edit product type success'
);

exports.deleteProductType = factory.deleteOne(
  ProductType,
  'Delete product type success'
);
