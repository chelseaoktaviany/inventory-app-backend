const factory = require('./handleFactory');

// models
const VendorProduct = require('../models/vendorModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVendors = factory.getAll(
  VendorProduct,
  'Retrieved data vendors successfully'
);

exports.getVendor = factory.getOne(
  VendorProduct,
  { path: '_id' },
  'Retrieved data vendor successfully'
);

exports.getVendorByName = catchAsync(async (req, res, next) => {
  const vendor = await VendorProduct.findOne({
    vendorSlug: req.params.vendorSlug,
  });
  if (!vendor) {
    return next(new AppError('Vendor not found', 404));
  }
  return res.status(200).json({
    status: 0,
    msg: 'Retrieved data vendor successfully',
    data: vendor,
  });
});

exports.createVendor = factory.createOne(VendorProduct, 'Add vendor success');

exports.updateVendor = factory.updateOne(VendorProduct, 'Edit vendor success');

exports.deleteVendor = factory.deleteOne(
  VendorProduct,
  'Delete vendor success'
);
