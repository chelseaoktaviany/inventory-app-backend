const factory = require('./handleFactory');

// models
const VendorProduct = require('../models/vendorModel');

exports.getAllVendors = factory.getAll(
  VendorProduct,
  'Retrieved data vendors successfully'
);

exports.getVendor = factory.getAll(
  VendorProduct,
  'Retrieved data vendor successfully'
);

exports.createVendor = factory.createOne(VendorProduct, 'Add vendor success');

exports.updateVendor = factory.updateOne(VendorProduct, 'Edit vendor success');

exports.deleteVendor = factory.deleteOne(
  VendorProduct,
  'Delete vendor success'
);
