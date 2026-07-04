const Review = require('../models/Review');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Helper function to update product ratings cache
const updateProductRatingCache = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews
      : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    numReviews,
  });
};

const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({ user: req.user._id, product: productId });
  if (existingReview) {
    throw new ApiError(400, 'You have already submitted a review for this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
  });

  await updateProductRatingCache(productId);

  return res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Allow only the author of the review or an admin to delete it
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to delete this review');
  }

  const productId = review.product;
  await Review.findByIdAndDelete(reviewId);

  await updateProductRatingCache(productId);

  return res.status(200).json(new ApiResponse(200, {}, 'Review deleted successfully'));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, 'Reviews retrieved successfully'));
});

module.exports = {
  addReview,
  deleteReview,
  getProductReviews,
};
