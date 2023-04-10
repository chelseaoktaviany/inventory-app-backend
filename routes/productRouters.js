const express = require('express');

const router = express.Router();

// controllers
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
