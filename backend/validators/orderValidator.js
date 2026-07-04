const Joi = require('joi');

const addressSchema = Joi.object({
  fullName: Joi.string().required().trim(),
  addressLine1: Joi.string().required().trim(),
  addressLine2: Joi.string().allow('').trim(),
  city: Joi.string().required().trim(),
  state: Joi.string().required().trim(),
  postalCode: Joi.string().required().trim(),
  country: Joi.string().trim().default('India'),
  phone: Joi.string().required().trim(),
  isDefault: Joi.boolean(),
});

const placeOrderSchema = Joi.object({
  addressId: Joi.string().required().trim(),
  couponCode: Joi.string().allow('').trim().uppercase(),
});

module.exports = {
  addressSchema,
  placeOrderSchema,
};
