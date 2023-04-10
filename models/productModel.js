/* eslint-disable no-else-return */
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, 'Please enter the product name!'],
    },
    group: {
      type: String,
      enum: ['Passive', 'Active'],
      required: [true, 'Please choose the group!'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryProduct',
      required: [true, 'Fill in the category first!'],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategoryProduct',
      required: [true, 'Fill in the sub-category first!'],
    },
    typeProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType',
      required: [true, 'Please enter the type of the product!'],
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
productSchema.virtual('productCondition').get(function () {
  if (this.conditionGood >= this.conditionBad) {
    return 'Good';
  } else {
    return 'Bad';
  }
});

productSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'category',
      select: 'categoryName',
    },
    { path: 'subCategory', select: 'subCategoryName' },
    { path: 'typeProduct', select: 'type' },
    { path: 'vendorProduct', select: 'vendorName' },
  ]);

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
