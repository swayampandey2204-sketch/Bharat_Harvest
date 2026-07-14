const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required',
  }),
  email: Joi.string().required().email().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().min(6).messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(6).messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
