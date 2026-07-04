const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsersList,
  updateUserRole,
  getSalesReport,
} = require('../controllers/adminController');
const { verifyJWT, authorizeRoles } = require('../middleware/auth');

router.use(verifyJWT);
router.use(authorizeRoles('admin')); // All admin dashboard routes require admin privilege

router.get('/stats', getDashboardStats);
router.get('/users', getUsersList);
router.put('/users/role/:userId', updateUserRole);
router.get('/sales-report', getSalesReport);

module.exports = router;
