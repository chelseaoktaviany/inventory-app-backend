const mongoose = require('mongoose');

const { generateNameSlug } = require('../utils/slugify');

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.String,
      ref: 'CategoryProduct',
      required: [true, 'Fill in the category first!'],
    },
    subCategoryName: {
      type: String,
      required: [true, 'Please fill the sub-category name!'],
      unique: true,
    },
    subCategoryImage: String,
    subCategorySlug: { type: String, index: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// pre hook
subCategorySchema.pre('save', function (next) {
  if (this.isNew || this.isModified('subCategoryName')) {
    this.subCategorySlug = generateNameSlug(this.subCategoryName);
  }
  next();
});

// subCategorySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'category',
//     select: 'categoryName categorySlug',
//   });

//   next();
// });

// indexing
subCategorySchema.index({ subCategorySlug: 1 });

const SubCategoryProduct = mongoose.model(
  'SubCategoryProduct',
  subCategorySchema
);

module.exports = SubCategoryProduct;
