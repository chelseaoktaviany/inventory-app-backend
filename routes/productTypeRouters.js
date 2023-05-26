const express = require('express');

const router = express.Router();

// controllers
const productTypeController = require('../controllers/productTypeController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').get(productTypeController.getAllProductTypes);

router.route('/:id').get(productTypeController.getProductType);

router.use(authController.restrictTo('Admin'));

router.route('/').post(productTypeController.createProductType);

router
  .route('/:id')
  .patch(productTypeController.updateProductType)
  .delete(productTypeController.deleteProductType);

module.exports = router;
