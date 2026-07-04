const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
} = require('../controllers/couponController');
const { verifyJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { couponSchema } = require('../validators/couponValidator');

router.use(verifyJWT); // All coupon actions require authentication

router.post('/', authorizeRoles('admin'), validate(couponSchema), createCoupon);
router.get('/', getCoupons);
router.delete('/:id', authorizeRoles('admin'), deleteCoupon);
router.post('/apply', applyCoupon);

module.exports = router;
