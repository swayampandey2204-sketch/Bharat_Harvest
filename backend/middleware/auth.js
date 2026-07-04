const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request. Access token is missing.');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'access_secret_123'
    );

    const user = await User.findById(decodedToken._id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token. User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role: ${req.user?.role || 'Guest'} is not authorized to access this resource`
      );
    }
    next();
  };
};

module.exports = {
  verifyJWT,
  authorizeRoles,
};
