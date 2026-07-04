const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');
const { verifyJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categorySchema } = require('../validators/productValidator');

router
  .route('/')
  .post(verifyJWT, authorizeRoles('admin'), validate(categorySchema), createCategory)
  .get(getCategories);

router.delete('/:id', verifyJWT, authorizeRoles('admin'), deleteCategory);

module.exports = router;
