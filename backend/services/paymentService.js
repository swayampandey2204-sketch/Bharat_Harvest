const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');

const createRazorpayOrder = async (amount, receiptId) => {
  const options = {
    amount: Math.round(amount * 100), // amount in paisa (1 INR = 100 Paisa)
    currency: 'INR',
    receipt: receiptId.toString(),
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Failed:', error);
    throw error;
  }
};

const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
};
