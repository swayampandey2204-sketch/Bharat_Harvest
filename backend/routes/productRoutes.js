const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductByIdOrSlug,
} = require('../controllers/productController');
const { verifyJWT, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { productSchema } = require('../validators/productValidator');

router
  .route('/')
  .post(verifyJWT, authorizeRoles('admin'), upload.single('image'), validate(productSchema), createProduct)
  .get(getProducts);

router
  .route('/:id')
  .put(verifyJWT, authorizeRoles('admin'), upload.single('image'), updateProduct)
  .delete(verifyJWT, authorizeRoles('admin'), deleteProduct);

router.get('/details/:idOrSlug', getProductByIdOrSlug);

module.exports = router;
