const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = require('../controllers/wishlistController');
const { verifyJWT } = require('../middleware/auth');

router.use(verifyJWT); // All wishlist routes require login

router.route('/')
  .get(getWishlist);

router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);
router.delete('/clear', clearWishlist);
router.post('/toggle', toggleWishlist);

module.exports = router;
