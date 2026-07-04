const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountAmount, minPurchaseAmount, expiryDate, isActive } = req.body;

  const couponExisted = await Coupon.findOne({ code: code.toUpperCase() });
  if (couponExisted) {
    throw new ApiError(400, 'Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountAmount,
    minPurchaseAmount,
    expiryDate,
    isActive,
  });

  return res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'));
});

const getCoupons = asyncHandler(async (req, res) => {
  // Admins get everything, users might get active coupons only
  const filter = req.user && req.user.role === 'admin' ? {} : { isActive: true, expiryDate: { $gt: new Date() } };
  const coupons = await Coupon.find(filter);

  return res.status(200).json(new ApiResponse(200, coupons, 'Coupons fetched successfully'));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Coupon deleted successfully'));
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || !subtotal) {
    throw new ApiError(400, 'Coupon code and subtotal are required');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    throw new ApiError(404, 'Coupon code is invalid');
  }

  if (!coupon.isActive) {
    throw new ApiError(400, 'Coupon is no longer active');
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    throw new ApiError(400, 'Coupon code has expired');
  }

  if (subtotal < coupon.minPurchaseAmount) {
    throw new ApiError(
      400,
      `Minimum purchase amount to apply this coupon is ₹${coupon.minPurchaseAmount}`
    );
  }

  // Check if current user has already used this coupon
  const alreadyUsed = coupon.usedBy.includes(req.user._id);
  if (alreadyUsed) {
    throw new ApiError(400, 'You have already redeemed this coupon once');
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountAmount) / 100;
  } else {
    discount = coupon.discountAmount;
  }

  // Discount shouldn't exceed subtotal
  discount = Math.min(discount, subtotal);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        calculatedDiscount: discount,
        finalTotal: subtotal - discount,
      },
      'Coupon applied successfully'
    )
  );
});

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
};
