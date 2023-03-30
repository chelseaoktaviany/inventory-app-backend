const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `E-mail ${value} is registered`;

  return new AppError(msg, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const msg = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again later', 401);

const handleJWTExpiredError = () =>
  new AppError('Token is expired already, please log in again later', 401);

// mengirimkan error saat mode dev
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/v1')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      msg: err.message,
      stack: err.stack,
    });
  }

  // render (nanti)
  console.error('ERROR! ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/v1')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
      });
    }

    // error terprogram
    console.error('ERROR! ', err);
    return res.status(500).json({
      status: 2,
      msg: 'An error has been occurred! Please try again later',
    });
  }

  // render (nanti)
  // A) operational, trusted error: mengirim pesan kepada klien
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Ada kesalahan yang terjadi',
      msg: err.message,
    });
  }

  // B) terprogram atau error yang tidak diketahui
  // 1) log error
  console.error('ERROR! ', err);
  // 2) mengirim pesan umum (response)
  return res.status(err.statusCode).render('error', {
    title: 'Ada kesalahan yang terjadi',
    msg: 'Mohon dicoba lagi',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 2;

  // dev
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);

    // production
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    error.msg = err.message;

    // handling cast error
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // handling duplicated fields
    if (error.name === 11000) error = handleDuplicateFieldsDB(error);

    // handling validation errors
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    // handling json web token error
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // handling json expired error
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
