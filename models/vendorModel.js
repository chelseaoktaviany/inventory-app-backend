const mongoose = require('mongoose');

const vendorProductSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, 'Please fill the category name!'],
    unique: true,
  },
});

const VendorProduct = mongoose.model('VendorProduct', vendorProductSchema);

module.exports = VendorProduct;
