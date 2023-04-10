const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryProduct',
      required: [true, 'Fill in the category first!'],
    },
    subCategoryName: {
      type: String,
      required: [true, 'Please fill the sub-category name!'],
      unique: true,
    },
    subCategoryImage: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'categoryName',
  });

  next();
});

const SubCategoryProduct = mongoose.model(
  'SubCategoryProduct',
  subCategorySchema
);

module.exports = SubCategoryProduct;
