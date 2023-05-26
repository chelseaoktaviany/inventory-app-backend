/* eslint-disable no-else-return */
const mongoose = require('mongoose');

const { generateNameSlug } = require('../utils/slugify');

const productTypeSchema = new mongoose.Schema(
  {
    productTypeId: { type: String, unique: true },
    type: {
      type: String,
      required: [true, 'Please enter the type of the product!'],
      unique: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProduct',
    },
    vendorName: {
      type: mongoose.Schema.Types.String,
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
    productTypeSlug: {
      type: String,
      index: true,
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

// pre hook
productTypeSchema.pre('save', async function (next) {
  const productType = this;

  if (!productType.isNew) {
    return next(); // Only generate productTypeId for new product types
  }

  try {
    const count = await mongoose.models.ProductType.countDocuments();

    productType.productTypeId = (count + 1).toString().padStart(2, '0'); // Generate productTypeId with leading zeros

    next();
  } catch (error) {
    next(error);
  }
});

productTypeSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('type')) {
    this.productTypeSlug = generateNameSlug(this.type);
  }
  next();
});

productTypeSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

productTypeSchema.pre(/^find/, function (next) {
  this.populate('vendor').populate({
    path: 'vendor',
    select: 'vendorName vendorSlug',
  });

  next();
});

productTypeSchema.index({ productTypeSlug: 1 });

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
