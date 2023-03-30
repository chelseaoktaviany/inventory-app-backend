const rateLimit = require('express-rate-limit');
const AppError = require('../utils/appError');

const resendOTPRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3, // batasan untuk IP menjadi 3 permintaan kirim ulang OTP
  handler: function (req, res, next) {
    return next(
      new AppError(
        'Failed to send the code 3 times, please try again for 1x24 hours/tomorrow',
        429
      )
    );
  },
  headers: true,
});

const verifyOTPRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3, // batasan untuk IP menjadi 3 permintaan kirim ulang OTP
  handler: function (req, res, next) {
    return next(
      new AppError(
        'Failed to enter OTP correctly. Please wait next day to re-verify',
        429
      )
    );
  },
  headers: true,
});

module.exports = { resendOTPRateLimiter, verifyOTPRateLimiter };
