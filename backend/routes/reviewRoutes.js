const express = require('express');
const router = express.Router();
const {
  addReview,
  deleteReview,
  getProductReviews,
} = require('../controllers/reviewController');
const { verifyJWT } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewSchema } = require('../validators/productValidator');

router.get('/:productId', getProductReviews);

// Protected routes
router.post('/:productId', verifyJWT, validate(reviewSchema), addReview);
router.delete('/:reviewId', verifyJWT, deleteReview);

module.exports = router;
