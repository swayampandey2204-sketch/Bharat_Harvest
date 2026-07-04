const crypto = require('crypto');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Payment = require('../models/Payment');
const Address = require('../models/Address');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/paymentService');
const { sendOrderConfirmationEmail } = require('../services/emailService');

const checkout = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;

  // Retrieve user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty');
  }

  // Retrieve selected shipping address
  const address = await Address.findById(addressId);
  if (!address || address.user.toString() !== req.user._id.toString()) {
    throw new ApiError(404, 'Invalid shipping address');
  }

  // Calculate prices using database data (prevent client tampering)
  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    const variant = product.variants.find((v) => v.packSize === item.packSize);
    if (!variant) {
      throw new ApiError(400, `Variant size ${item.packSize} is missing for ${product.name}`);
    }

    if (variant.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name} (${item.packSize})`);
    }

    const price = variant.price;
    subtotal += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      packSize: item.packSize,
      price: price,
      quantity: item.quantity,
      image: product.image,
    });
  }

  // Handle coupon discount
  let discount = 0;
  let verifiedCoupon = null;
  if (couponCode) {
    verifiedCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (verifiedCoupon && new Date(verifiedCoupon.expiryDate) > new Date() && subtotal >= verifiedCoupon.minPurchaseAmount) {
      const alreadyUsed = verifiedCoupon.usedBy.includes(req.user._id);
      if (!alreadyUsed) {
        if (verifiedCoupon.discountType === 'percentage') {
          discount = (subtotal * verifiedCoupon.discountAmount) / 100;
        } else {
          discount = verifiedCoupon.discountAmount;
        }
        discount = Math.min(discount, subtotal);
      }
    }
  }

  const shipping = 0; // free shipping
  const total = subtotal - discount + shipping;

  // Create Razorpay Order
  const receiptId = `receipt_${Date.now()}`;
  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder(total, receiptId);
  } catch (error) {
    throw new ApiError(500, `Razorpay order initiation failed: ${error.message}`);
  }

  // Create Order in DB (Pending Payment)
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: {
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
    },
    paymentDetails: {
      method: 'Razorpay',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    },
    pricing: {
      subtotal,
      discount,
      shipping,
      total,
    },
    couponCode: verifiedCoupon ? verifiedCoupon.code : undefined,
  });

  // Create Payment log in DB
  await Payment.create({
    order: order._id,
    user: req.user._id,
    razorpayOrderId: razorpayOrder.id,
    amount: total,
    status: 'pending',
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      },
      'Checkout order initialized successfully'
    )
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const isVerified = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isVerified) {
    throw new ApiError(400, 'Payment signature verification failed. Transaction tampered!');
  }

  const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': razorpayOrderId });
  if (!order) {
    throw new ApiError(404, 'Order not found matching payment');
  }

  // Deduct stock for ordered items
  for (const item of order.orderItems) {
    await Product.updateOne(
      { _id: item.product, 'variants.packSize': item.packSize },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
  }

  // Update Order
  order.paymentDetails.status = 'paid';
  order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
  order.status = 'processing';
  await order.save();

  // Update Payment Log
  await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      $set: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'captured',
      },
    }
  );

  // If coupon was applied, add user to usedBy list
  if (order.couponCode) {
    await Coupon.updateOne(
      { code: order.couponCode },
      { $addToSet: { usedBy: req.user._id } }
    );
  }

  // Clear Cart items
  await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

  // Send Order Confirmation Email
  await sendOrderConfirmationEmail(req.user.email, order);

  return res.status(200).json(new ApiResponse(200, order, 'Payment verified and captured successfully'));
});

const handleFailedPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, errorReason, rawPayload } = req.body;

  const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': razorpayOrderId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Update Order
  order.paymentDetails.status = 'failed';
  await order.save();

  // Update Payment Log
  await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      $set: {
        status: 'failed',
        errorReason: errorReason || 'Payment failed',
        rawPayload,
      },
    }
  );

  return res.status(200).json(new ApiResponse(200, {}, 'Payment failure logged successfully'));
});

const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_123';

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== webhookSignature) {
    throw new ApiError(400, 'Invalid webhook signature');
  }

  const { event, payload } = req.body;

  if (event === 'payment.captured') {
    const paymentEntity = payload.payment.entity;
    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;

    const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': razorpayOrderId });
    if (order && order.paymentDetails.status !== 'paid') {
      // Deduct stock
      for (const item of order.orderItems) {
        await Product.updateOne(
          { _id: item.product, 'variants.packSize': item.packSize },
          { $inc: { 'variants.$.stock': -item.quantity } }
        );
      }

      order.paymentDetails.status = 'paid';
      order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
      order.status = 'processing';
      await order.save();

      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
          $set: {
            razorpayPaymentId,
            status: 'captured',
            rawPayload: paymentEntity,
          },
        }
      );

      if (order.couponCode) {
        await Coupon.updateOne(
          { code: order.couponCode },
          { $addToSet: { usedBy: order.user } }
        );
      }

      // Clear cart
      await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
    }
  } else if (event === 'payment.failed') {
    const paymentEntity = payload.payment.entity;
    const razorpayOrderId = paymentEntity.order_id;

    const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': razorpayOrderId });
    if (order) {
      order.paymentDetails.status = 'failed';
      await order.save();

      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
          $set: {
            status: 'failed',
            errorReason: paymentEntity.error_description || 'Payment failed',
            rawPayload: paymentEntity,
          },
        }
      );
    }
  }

  return res.status(200).json({ success: true });
});

module.exports = {
  checkout,
  verifyPayment,
  handleFailedPayment,
  handleRazorpayWebhook,
};
