const jwt = require('jsonwebtoken');

// utilities
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { generateOTP } = require('../utils/otp');

const Email = require('../utils/email');

// using model
const User = require('../models/userModel');

// global variables
let emailAddress;

// generate OTP
const generateAndSaveOtp = async (user) => {
  // mengirim otp
  const otp = generateOTP(4);
  user.otp = otp;
  user.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // berlaku selama 5 menit

  await user.save();
  return otp;
};

// token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, msg, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });

  // mengirim response
  res.status(statusCode).json({
    status: 0,
    msg,
    data: {
      id: user._id,
    },
    token,
  });
};

/**
 * Pendaftaran user, setelah data valid, dapat melakukan aktivasi akun pengguna
 * @async
 * @method
 * @field - {username - nama pengguna, emailAddress - alamat e-mail}
 * @returns status, msg, data:{user}
 * @throws - 401 (User exists) & 500 (Internal Server Error)
 */
exports.signUp = catchAsync(async (req, res, next) => {
  emailAddress = req.body.emailAddress;

  const { username, role } = req.body;

  const existedUser = await User.findOne({ emailAddress });

  if (existedUser) {
    return next(new AppError('E-mail already registered', 409));
  }

  const newUser = await User.create({
    username,
    emailAddress,
    role,
  });

  try {
    // send email OTP
    newUser.otp = await generateAndSaveOtp(newUser);

    // email untuk OTP
    await new Email(newUser).sendOTP();

    // mengirim response
    res.status(201).json({
      status: 0,
      msg: 'We have sent the code to your e-mail',
      data: {
        username: newUser.username,
        emailAddress: newUser.emailAddress,
        role: newUser.role,
      },
    });
  } catch (err) {
    existedUser.otp = undefined;
    existedUser.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'An error has been occurred while sending e-mail! Please try again later',
        500
      )
    );
  }
});

/**
 * Pengiriman OTP, mengirim OTP kepada e-mail pengguna
 * @async
 * @method
 * @field - {emailAddress: e-mail}
 * @returns status, msg
 * @throws - 404 (User not found), 429 (Too many requests) & 500 (Internal Server Error)
 */
exports.resendOTP = catchAsync(async (req, res, next) => {
  try {
    // send otp melalui e-mail (namun kalau mengirim OTP sebanyak 3 kali aka limit=3)
    const user = await User.findOne({ emailAddress });

    if (!user) {
      return next(new AppError('Akun pengguna tidak ditemukan'));
    }

    user.otp = await generateAndSaveOtp(user);
    user.save({ validateBeforeSave: false });

    // e-mail untuk OTP
    await new Email(user).sendOTP();

    // kirim response
    res.status(201).json({
      status: 0,
      msg: 'We have sent the code to your e-mail',
    });
  } catch (err) {
    const user = await User.findOne({ emailAddress });
    user.otp = undefined;

    return next(
      new AppError(
        'An error has been occurred while sending an OTP! Please try again later',
        500
      )
    );
  }
});

/**
 * Verifikasi OTP, melakukan verifikasi OTP dari e-mail
 * @async
 * @method
 * @field - {id - user._id, otp: OTP}
 * @returns status, msg
 * @throws - 404 (User not found), 400 (OTP invalid or wrong) & 500 (Internal Server Error)
 */
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const otp = req.body.otp;
  const user = await User.findOne({ emailAddress });

  // memeriksa jika user tidak ditemukan
  if (!user) {
    return next(new AppError('Account not found', 404));
  }

  // memeriksa jika otp benar
  if (otp !== user.otp) {
    return next(
      new AppError(
        'Invalid OTP! Please click resend OTP to get OTP code again',
        401
      )
    );
  }

  // memeriksa jika kode OTP kedaluarsa
  if (user.otpExpiration < new Date()) {
    user.otp = undefined;
    user.otpExpiration = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError('OTP sudah kedaluarsa', 401));
  }

  // otp is valid
  user.otp = undefined;
  user.otpExpiration = undefined;
  user.save({ validateBeforeSave: true });

  // create token
  createSendToken(user, 200, 'Your account has been verified', req, res);
});
