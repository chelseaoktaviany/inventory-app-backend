const express = require('express');

// controllers
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// middlewares
const {
  resendOTPRateLimiter,
  verifyOTPRateLimiter,
} = require('../middleware/rateLimiter');

// using express router
const router = express.Router();

// authentication
router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);

// otp
router.get('/resendOTP', resendOTPRateLimiter, authController.resendOTP);
router.post('/verified', verifyOTPRateLimiter, authController.verifyOTP);

// router protection (nanti)
router.use(authController.protect);

// using restriction middleware (nanti)
router.use(authController.restrictTo('admin', 'super-admin'));

// user management
router.route('/').get(userController.getAllUsers);

module.exports = router;
