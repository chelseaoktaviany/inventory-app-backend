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
router.get('/signOut', authController.signOut);

// otp
router.get('/resendOTP', resendOTPRateLimiter, authController.resendOTP);
router.post('/verified', verifyOTPRateLimiter, authController.verifyOTP);

// router protection
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);

// using restriction middleware
// router.use(authController.restrictTo('Super Admin'));

// user management
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
