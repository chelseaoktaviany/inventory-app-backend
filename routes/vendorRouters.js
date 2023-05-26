const express = require('express');

const router = express.Router();

// controllers
const vendorController = require('../controllers/vendorController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').get(vendorController.getAllVendors);

router.route('/:id').get(vendorController.getVendor);

router.route('/:vendorSlug').get(vendorController.getVendorByName);

router.use(authController.restrictTo('Admin'));

router.route('/').post(vendorController.createVendor);

router
  .route('/:id')
  .patch(vendorController.updateVendor)
  .delete(vendorController.deleteVendor);

module.exports = router;
