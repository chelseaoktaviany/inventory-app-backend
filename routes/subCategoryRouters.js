const express = require('express');

const router = express.Router();

// controllers
const subCategoryController = require('../controllers/subCategoryController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').get(subCategoryController.getAllSubCategories);

router.route('/:id').get(subCategoryController.getSubCategory);

router
  .route('/:subCategorySlug')
  .get(subCategoryController.getSubCategoryByName);

router.use(authController.restrictTo('Admin'));

router
  .route('/')
  .post(
    subCategoryController.uploadSubCategImage,
    subCategoryController.createSubCategory
  );

router
  .route('/:id')
  .patch(
    subCategoryController.uploadSubCategImage,
    subCategoryController.updateSubCategory
  )
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
