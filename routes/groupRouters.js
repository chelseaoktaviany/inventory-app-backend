const express = require('express');

const router = express.Router();

// controllers
const groupController = require('../controllers/groupController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').get(groupController.getAllGroups);

router.use(authController.restrictTo('Admin'));

router.route('/').post(groupController.createGroup);

router.route('/:id').delete(groupController.deleteGroup);

module.exports = router;
