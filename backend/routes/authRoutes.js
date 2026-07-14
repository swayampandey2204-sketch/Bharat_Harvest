const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { verifyJWT } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema, resendVerificationSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', validate(resendVerificationSchema), resendVerificationEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/profile', verifyJWT, getUserProfile);
router.put('/profile', verifyJWT, updateUserProfile);

module.exports = router;
