const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  syncCart,
} = require('../controllers/cartController');
const { verifyJWT } = require('../middleware/auth');

router.use(verifyJWT); // All cart routes require user login

router.route('/').get(getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItemQuantity);
router.delete('/remove', removeFromCart);
router.post('/sync', syncCart);

module.exports = router;
