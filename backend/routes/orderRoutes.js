const express = require('express');
const router = express.Router();
const {
  getOrderHistory,
  getOrderDetails,
  cancelOrder,
  trackOrder,
  getInvoice,
  getAdminAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { verifyJWT, authorizeRoles } = require('../middleware/auth');

router.use(verifyJWT); // All order actions require authentication

router.get('/history', getOrderHistory);
router.get('/details/:id', getOrderDetails);
router.post('/cancel/:id', cancelOrder);
router.get('/track/:id', trackOrder);
router.get('/invoice/:id', getInvoice);

// Admin-only order routes
router.get('/admin/all', authorizeRoles('admin'), getAdminAllOrders);
router.put('/admin/status/:id', authorizeRoles('admin'), updateOrderStatus);

module.exports = router;
