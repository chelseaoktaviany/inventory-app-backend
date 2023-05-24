/* eslint-disable no-else-return */
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    productId: { type: String, unique: true },
    brandName: {
      type: String,
      required: [true, 'Please enter the product name!'],
    },
    group: {
      type: String,
      enum: ['Passive', 'Active'],
      required: [true, 'Please choose the group!'],
    },
    categoryName: {
      type: mongoose.Schema.Types.String,
      ref: 'CategoryProduct',
      required: [true, 'Fill in the category first!'],
    },
    subCategoryName: {
      type: mongoose.Schema.Types.String,
      ref: 'SubCategoryProduct',
      required: [true, 'Fill in the sub-category first!'],
    },
    typeProduct: {
      type: mongoose.Schema.Types.String,
      ref: 'ProductType',
      required: [true, 'Please enter the type of the product!'],
    },
    vendorName: {
      type: mongoose.Schema.Types.String,
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

// pre hook
productSchema.pre('save', function (next) {
  const doc = this;
  if (doc.isNew) {
    // code here
    const categoryId = doc.categoryId;
    const paddedCategoryId = categoryId.padStart(2, '0'); // Ensure two-digit category number
    const productId = `${paddedCategoryId}-${Math.floor(
      100000000000 + Math.random() * 900000000000
    )}`; // Generate random four-digit number
    doc.productId = productId;
  }
  next();
});

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

// productSchema.pre(/^find/, function (next) {
//   this.populate([
//     {
//       path: 'category',
//       select: 'categoryName',
//     },
//     { path: 'subCategory', select: 'subCategoryName' },
//     { path: 'typeProduct', select: 'type' },
//     { path: 'vendorProduct', select: 'vendorName' },
//   ]);

//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
