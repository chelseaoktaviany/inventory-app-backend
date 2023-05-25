const mongoose = require('mongoose');

const { generateNameSlug } = require('../utils/slugify');

const categorySchema = new mongoose.Schema({
  categoryId: { type: String, unique: true },
  categoryName: {
    type: String,
    required: [true, 'Please fill the category name!'],
    unique: true,
  },
  categorySlug: {
    type: String,
    index: true,
  },
});

// pre hook
categorySchema.pre('save', async function (next) {
  const category = this;

  if (!category.isNew) {
    return next(); // Only generate categoryId for new categories
  }

  try {
    const count = await mongoose.models.CategoryProduct.countDocuments();

    category.categoryId = (count + 1).toString().padStart(2, '0'); // Generate categoryId with leading zeros

    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre('save', function (next) {
  if (this.isNew || this.isModified('categoryName')) {
    this.categorySlug = generateNameSlug(this.categoryName);
  }
  next();
});

// indexing
categorySchema.index({ categorySlug: 1 });

const CategoryProduct = mongoose.model('CategoryProduct', categorySchema);

module.exports = CategoryProduct;
