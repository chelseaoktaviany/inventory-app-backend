class AppError extends Error {
  constructor(msg, statusCode) {
    super(msg);

    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith('4') ? 1 : 2;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
