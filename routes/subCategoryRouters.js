const express = require('express');

const router = express.Router();

// controllers
const subCategoryController = require('../controllers/subCategoryController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(subCategoryController.getAllSubCategories)
  .post(
    subCategoryController.uploadImage,
    subCategoryController.resizeImage,
    subCategoryController.createSubCategory
  );

router
  .route('/:id')
  .get(subCategoryController.getSubCategory)
  .patch(subCategoryController.updateSubCategory)
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
