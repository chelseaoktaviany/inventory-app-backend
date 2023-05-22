const jwt = require('jsonwebtoken');
const { promisify } = require('util');

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
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, msg, req, res) => {
  const token = signToken(user._id, user.role);

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
      role: user.role,
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
    await newUser.save({ validateBeforeSave: false });

    // email untuk OTP
    await new Email(newUser).sendOTP();

    // mengirim response
    res.status(201).json({
      status: 0,
      msg: 'We have sent the code to your e-mail',
      data: {
        userId: newUser.userId,
        username: newUser.username,
        emailAddress: newUser.emailAddress,
        role: newUser.role,
      },
    });
  } catch (err) {
    existedUser.otp = undefined;
    await existedUser.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'An error has been occurred while sending e-mail! Please try again later',
        500
      )
    );
  }
});

/**
 * Sign in user, setelah data valid, dapat melakukan aktivasi akun pengguna
 * @async
 * @method
 * @field - {emailAddress - alamat e-mail, role - peran pengguna}
 * @returns status, msg, data:{user}
 * @throws - 401 (E-mail not registered) & 500 (Internal Server Error)
 */
exports.signIn = catchAsync(async (req, res, next) => {
  emailAddress = req.body.emailAddress;

  const { role } = req.body;

  const user = await User.findOne({ emailAddress, role });

  if (!user) {
    return next(new AppError('E-mail not registered', 401));
  }

  try {
    // send email OTP
    user.otp = await generateAndSaveOtp(user);
    await user.save({ validateBeforeSave: false });

    // email untuk OTP
    await new Email(user).sendOTP();

    // mengirim response
    res.status(200).json({
      status: 0,
      msg: 'We have sent the code to your e-mail',
      data: {
        username: user.username,
        emailAddress: user.emailAddress,
        role: user.role,
      },
    });
  } catch (err) {
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });

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
    await user.save({ validateBeforeSave: false });

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
    await user.save({ validateBeforeSave: false });

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
  if (!otp || !user.otp) {
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
    await user.save({ validateBeforeSave: false });

    return next(new AppError('OTP sudah kedaluarsa', 401));
  }

  // otp is valid
  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save({ validateBeforeSave: true });

  // create token
  createSendToken(user, 200, 'Your account has been verified', req, res);
});

// sign out
exports.signOut = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 0, msg: 'Success' });
});

// protect
exports.protect = catchAsync(async (req, res, next) => {
  // getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'Anda belum log in, mohon lakukan login untuk mendapatkan akses token',
        401
      )
    );
  }

  // verifikasi token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // memeriksa jika pengguna sudah ada
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The token belonging to this token user does no longer exist'
      )
    );
  }

  // grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// is logged in
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // verifikasi token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // memeriksa jika pengguna sudah ada
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // ada pengguna yang sudah login
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
};

// restrict to specified roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles['admin', 'super-admin'], role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    next();
  };
};
