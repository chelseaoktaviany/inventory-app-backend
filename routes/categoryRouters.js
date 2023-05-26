const express = require('express');

const router = express.Router();

// controllers
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').get(categoryController.getAllCategories);

router.route('/:id').get(categoryController.getCategory);

router.route('/:categorySlug').get(categoryController.getCategoryByName);

router.use(authController.restrictTo('Admin'));

router.route('/').post(categoryController.createCategory);

router
  .route('/:id')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
