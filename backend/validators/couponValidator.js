const Joi = require('joi');

const couponSchema = Joi.object({
  code: Joi.string().required().uppercase().trim(),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountAmount: Joi.number().required().min(0),
  minPurchaseAmount: Joi.number().min(0).default(0),
  expiryDate: Joi.date().required(),
  isActive: Joi.boolean().default(true),
});

module.exports = {
  couponSchema,
};
