const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Total Sales & Orders Count
  const salesData = await Order.aggregate([
    { $match: { 'paymentDetails.status': 'paid' } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$pricing.total' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const totalSales = salesData[0]?.totalSales || 0;
  const paidOrdersCount = salesData[0]?.totalOrders || 0;

  // 2. Count of registered users
  const totalUsers = await User.countDocuments({ role: 'user' });

  // 3. Count of total products
  const totalProducts = await Product.countDocuments();

  // 4. Check for low-stock variants (< 15 items)
  const products = await Product.find().populate('category', 'name');
  const lowStockAlerts = [];
  products.forEach((product) => {
    product.variants.forEach((v) => {
      if (v.stock < 15) {
        lowStockAlerts.push({
          productId: product._id,
          name: product.name,
          packSize: v.packSize,
          stock: v.stock,
          category: product.category?.name || 'Uncategorized',
        });
      }
    });
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSales,
        paidOrdersCount,
        totalUsers,
        totalProducts,
        lowStockAlerts,
      },
      'Dashboard stats retrieved successfully'
    )
  );
});

const getUsersList = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, users, 'Users list retrieved successfully'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true }).select(
    '-password'
  );

  return res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
});

const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const matchStage = { 'paymentDetails.status': 'paid' };
  if (startDate || endDate) {
    matchStage.createdAt = dateFilter;
  }

  const reports = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        dailySales: { $sum: '$pricing.total' },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.status(200).json(new ApiResponse(200, reports, 'Sales report generated successfully'));
});

module.exports = {
  getDashboardStats,
  getUsersList,
  updateUserRole,
  getSalesReport,
};
