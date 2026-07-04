const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { verifyJWT } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/profile', verifyJWT, getUserProfile);
router.put('/profile', verifyJWT, updateUserProfile);

module.exports = router;
