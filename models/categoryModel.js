const mongoose = require('mongoose');

const { generateNameSlug } = require('../utils/slugify');

const categorySchema = new mongoose.Schema({
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
