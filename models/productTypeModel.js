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
    purchaseDate: Date,
    quantity: {
      type: Number,
      required: [true, 'Please enter the numbers of product'],
    },
    eachPrice: {
      type: Number,
      required: [true, 'Please enter the product unit price!'],
    },
    currentLocation: {
      type: String,
      required: [true, 'Please enter the current location of the product!'],
    },
    conditionGood: {
      type: Number,
      required: [true, 'Please enter the condition of the products'],
    },
    conditionBad: {
      type: Number,
      required: [true, 'Please enter the condition of the products'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// define virtual property
productTypeSchema.virtual('productTypeCondition').get(function () {
  if (this.conditionGood >= this.conditionBad) {
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
  this.populate([{ path: 'vendorProduct', select: '-__v' }]);

  next();
});

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
