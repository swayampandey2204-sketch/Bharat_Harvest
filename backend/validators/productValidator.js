const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required().trim(),
  tagline: Joi.string().allow('').trim(),
  desc: Joi.string().required().trim(),
  image: Joi.string().allow(''), // image URL, could be uploaded via multer
  categoryName: Joi.string().required().trim(), // Category name to find or create ref
  variants: Joi.array()
    .items(
      Joi.object({
        packSize: Joi.string().required().trim(),
        price: Joi.number().required().min(0),
        stock: Joi.number().required().min(0),
      })
    )
    .min(1)
    .required(),
  isFeatured: Joi.boolean().default(false),
});

const categorySchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().allow('').trim(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().required().trim(),
});

module.exports = {
  productSchema,
  categorySchema,
  reviewSchema,
};
