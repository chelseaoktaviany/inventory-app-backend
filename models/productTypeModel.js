/* eslint-disable no-else-return */
const mongoose = require('mongoose');

const productTypeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please enter the type of the product!'],
      unique: true,
    },
    vendorProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProduct',
      required: [true, 'Please select the vendor!'],
    },
    purchaseDateProductType: Date,
    quantityProductType: {
      type: Number,
      required: [true, 'Please enter the numbers of product'],
    },
    eachPriceProductType: {
      type: Number,
      required: [true, 'Please enter the product unit price!'],
    },
    currentLocationProductType: {
      type: String,
      required: [true, 'Please enter the current location of the product!'],
    },
    conditionGoodProductType: {
      type: Number,
      required: [true, 'Please enter the condition of the products'],
    },
    conditionBadProductType: {
      type: Number,
      required: [true, 'Please enter the condition of the products'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// define virtual property
productTypeSchema.virtual('productTypeCondition').get(function () {
  if (this.conditionGoodProductType >= this.conditionBadProductType) {
    return 'Good';
  } else {
    return 'Bad';
  }
});

productTypeSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

productTypeSchema.pre(/^find/, function (next) {
  this.populate([{ path: 'vendorProduct', select: 'vendorName' }]);

  next();
});

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
