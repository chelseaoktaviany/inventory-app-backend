const express = require('express');

const router = express.Router();

// controllers
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.use(authController.restrictTo('Admin'));

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router.route('/:categorySlug').get(categoryController.getCategoryByName);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
