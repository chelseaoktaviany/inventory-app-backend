const express = require('express');

const router = express.Router();

// controllers
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router.use(authController.protect);

// get reports
router
  .route('/prod-reports/:month/:year')
  .get(productController.getProdReports);

router.use(authController.restrictTo('Admin'));

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.route('/:id').get(productController.getProduct);

router
  .route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
