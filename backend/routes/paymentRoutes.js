const express = require('express');
const router = express.Router();
const {
  checkout,
  verifyPayment,
  handleFailedPayment,
  handleRazorpayWebhook,
} = require('../controllers/paymentController');
const { verifyJWT } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { placeOrderSchema } = require('../validators/orderValidator');

// Webhook route is public (Razorpay calls it)
router.post('/webhook', handleRazorpayWebhook);

// Protected routes
router.use(verifyJWT);
router.post('/checkout', validate(placeOrderSchema), checkout);
router.post('/verify', verifyPayment);
router.post('/failed', handleFailedPayment);

module.exports = router;
