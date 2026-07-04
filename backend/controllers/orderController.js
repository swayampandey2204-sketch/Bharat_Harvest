const Order = require('../models/Order');
const Address = require('../models/Address');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateInvoiceHTML } = require('../services/invoiceService');

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, orders, 'Order history fetched successfully'));
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate('orderItems.product', 'name tagline image');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Authorize: Only the owner or an admin can view the order details
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to view this order');
  }

  return res.status(200).json(new ApiResponse(200, order, 'Order details fetched successfully'));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to cancel this order');
  }

  if (order.status === 'delivered') {
    throw new ApiError(400, 'Delivered orders cannot be cancelled');
  }

  if (order.status === 'cancelled') {
    throw new ApiError(400, 'Order is already cancelled');
  }

  order.status = 'cancelled';
  await order.save();

  return res.status(200).json(new ApiResponse(200, order, 'Order cancelled successfully'));
});

const trackOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).select('status trackingDetails');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res.status(200).json(new ApiResponse(200, order, 'Order tracking details fetched'));
});

const getInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to access this invoice');
  }

  const invoiceHTML = generateInvoiceHTML(order);
  res.setHeader('Content-Type', 'text/html');
  return res.send(invoiceHTML);
});

// Admin Panel APIs
const getAdminAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, orders, 'All orders fetched successfully'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, carrier, trackingNumber, trackingStatus } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (status) {
    order.status = status;
  }

  if (carrier !== undefined) order.trackingDetails.carrier = carrier;
  if (trackingNumber !== undefined) order.trackingDetails.trackingNumber = trackingNumber;
  if (trackingStatus !== undefined) order.trackingDetails.status = trackingStatus;

  await order.save();

  return res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
});

module.exports = {
  getOrderHistory,
  getOrderDetails,
  cancelOrder,
  trackOrder,
  getInvoice,
  getAdminAllOrders,
  updateOrderStatus,
};
