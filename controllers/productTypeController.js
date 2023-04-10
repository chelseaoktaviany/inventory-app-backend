const factory = require('./handleFactory');

// models
const ProductType = require('../models/productTypeModel');

exports.getAllProductTypes = factory.getAll(
  ProductType,
  'Retrieved data product types successfully'
);

exports.getProductType = factory.getAll(
  ProductType,
  'Retrieved a data product type successfully'
);

exports.createProductType = factory.createOne(
  ProductType,
  'Add product type success'
);

exports.updateProductType = factory.updateOne(
  ProductType,
  'Edit product type success'
);

exports.deleteProductType = factory.deleteOne(
  ProductType,
  'Delete product type success'
);
