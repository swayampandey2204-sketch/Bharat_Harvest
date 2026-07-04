const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  packSize: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
      phone: { type: String, required: true },
    },
    paymentDetails: {
      method: { type: String, required: true, default: 'Razorpay' },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, required: true, default: 0 },
      shipping: { type: Number, required: true, default: 0 },
      total: { type: Number, required: true },
    },
    couponCode: {
      type: String,
      trim: true,
    },
    trackingDetails: {
      carrier: { type: String, default: '' },
      trackingNumber: { type: String, default: '' },
      status: { type: String, default: 'preparing' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
