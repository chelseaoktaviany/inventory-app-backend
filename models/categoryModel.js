const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Please fill the category name!'],
    unique: true,
  },
});

const CategoryProduct = mongoose.model('CategoryProduct', categorySchema);

module.exports = CategoryProduct;
