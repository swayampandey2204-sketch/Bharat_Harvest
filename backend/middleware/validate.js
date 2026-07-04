const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  if (!schema) return next();
  
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  
  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    return next(new ApiError(400, 'Validation Failed', errorDetails));
  }
  
  next();
};

module.exports = validate;
