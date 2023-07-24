const mongoose = require('mongoose');

const { generateNameSlug } = require('../utils/slugify');

const subCategorySchema = new mongoose.Schema(
  {
    subCategoryId: { type: String, unique: true },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupProduct',
      required: [true, 'Group belongs to category'],
    },
    groupName: {
      type: mongoose.Schema.Types.String,
      ref: 'GroupProduct',
      required: [true, 'Group name is belong to category'],
    },
    groupSlug: {
      type: mongoose.Schema.Types.String,
      ref: 'GroupProduct',
      required: [true, 'Group slug is belong to category'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryProduct',
      required: [true, 'Category is belonging to product'],
    },
    categoryName: {
      type: mongoose.Schema.Types.String,
      ref: 'CategoryProduct',
      required: [true, 'Fill in the category first!'],
    },
    categorySlug: {
      type: mongoose.Schema.Types.String,
      ref: 'CategoryProduct',
      required: [true, 'Category slug is required'],
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
subCategorySchema.pre('save', async function (next) {
  const subCategory = this;

  if (!subCategory.isNew) {
    return next(); // Only generate subCategoryId for new sub categories
  }

  try {
    const count = await mongoose.models.SubCategoryProduct.countDocuments();

    subCategory.subCategoryId = (count + 1).toString().padStart(2, '0'); // Generate subCategoryId with leading zeros

    next();
  } catch (error) {
    next(error);
  }
});

subCategorySchema.pre('save', function (next) {
  if (this.isNew || this.isModified('groupName')) {
    this.groupSlug = generateNameSlug(this.groupName);
  }

  if (this.isNew || this.isModified('categoryName')) {
    this.categorySlug = generateNameSlug(this.categoryName);
  }

  if (this.isNew || this.isModified('subCategoryName')) {
    this.subCategorySlug = generateNameSlug(this.subCategoryName);
  }

  next();
});

subCategorySchema.pre(/^find/, function (next) {
  this.populate('category').populate({
    path: 'category',
    select: 'categoryId categoryName categorySlug',
  });

  this.populate('group').populate({
    path: 'group',
    select: 'groupId groupName groupSlug',
  });

  next();
});

// indexing
subCategorySchema.index({ subCategorySlug: 1 });

const SubCategoryProduct = mongoose.model(
  'SubCategoryProduct',
  subCategorySchema
);

module.exports = SubCategoryProduct;
