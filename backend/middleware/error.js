const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, build it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Handle invalid Mongoose Object ID
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid path: ${err.path}`;
    error = new ApiError(400, message);
  }

  // Handle expired JWT
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token has expired. Please login again.';
    error = new ApiError(401, message);
  }

  // Handle invalid JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid JSON Web Token. Please log in again.';
    error = new ApiError(401, message);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
