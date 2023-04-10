const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, 'Please enter the product name!'],
      unique: true,
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
    condition: {
      condition_good: {
        type: Number,
        required: [true, 'Please enter the condition of the products'],
      },
      condition_bad: {
        type: Number,
        required: [true, 'Please enter the condition of the products!'],
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'category',
      select: '-__v',
    },
    { path: 'subCategory', select: '-__v' },
    { path: 'typeProduct', select: '-__v' },
    { path: 'vendorProduct', select: '-__v' },
  ]);

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
