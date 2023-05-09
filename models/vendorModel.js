const mongoose = require('mongoose');
const { generateNameSlug } = require('../utils/slugify');

const vendorProductSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, 'Please fill the category name!'],
    unique: true,
  },
  vendorSlug: { type: String, index: true },
});

// pre hook
vendorProductSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('vendorName')) {
    this.vendorSlug = generateNameSlug(this.vendorName);
  }
  next();
});

// indexing
vendorProductSchema.index({ vendorSlug: 1 });

const VendorProduct = mongoose.model('VendorProduct', vendorProductSchema);

module.exports = VendorProduct;
