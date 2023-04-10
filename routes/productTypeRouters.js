const express = require('express');

const router = express.Router();

// controllers
const productTypeController = require('../controllers/productTypeController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(productTypeController.getAllProductTypes)
  .post(productTypeController.createProductType);

router
  .route('/:id')
  .get(productTypeController.getProductType)
  .patch(productTypeController.updateProductType)
  .delete(productTypeController.deleteProductType);

module.exports = router;
