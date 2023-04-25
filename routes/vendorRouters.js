const express = require('express');

const router = express.Router();

// controllers
const vendorController = require('../controllers/vendorController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.use(authController.restrictTo('Admin'));

router
  .route('/')
  .get(vendorController.getAllVendors)
  .post(vendorController.createVendor);

router
  .route('/:id')
  .get(vendorController.getVendor)
  .patch(vendorController.updateVendor)
  .delete(vendorController.deleteVendor);

module.exports = router;
