const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name tagline image variants slug category',
    populate: { path: 'category', select: 'name slug' },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, cart || { items: [] }, 'Cart retrieved successfully'));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, packSize, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Verify variant packSize exists
  const variant = product.variants.find((v) => v.packSize === packSize);
  if (!variant) {
    throw new ApiError(400, `Variant size ${packSize} does not exist for this product`);
  }

  const cart = await getOrCreateCart(req.user._id);

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.packSize === packSize
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, packSize, quantity: Number(quantity) });
  }

  await cart.save();

  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name tagline image variants slug',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, 'Item added to cart successfully'));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId, packSize, quantity } = req.body;

  if (quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.packSize === packSize
  );

  if (itemIndex === -1) {
    throw new ApiError(404, 'Item not found in cart');
  }

  cart.items[itemIndex].quantity = Number(quantity);
  await cart.save();

  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name tagline image variants slug',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, 'Cart item quantity updated successfully'));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, packSize } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => !(item.product.toString() === productId && item.packSize === packSize)
  );

  await cart.save();

  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name tagline image variants slug',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, 'Item removed from cart successfully'));
});

const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { productId, packSize, quantity }

  if (!Array.isArray(items)) {
    throw new ApiError(400, 'Items list must be an array');
  }

  const cart = await getOrCreateCart(req.user._id);

  for (const guestItem of items) {
    const { productId, packSize, quantity } = guestItem;
    
    // Validate product and variant
    const product = await Product.findById(productId);
    if (!product) continue;

    const variant = product.variants.find((v) => v.packSize === packSize);
    if (!variant) continue;

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.packSize === packSize
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = Number(quantity);
    } else {
      cart.items.push({ product: productId, packSize, quantity: Number(quantity) });
    }
  }

  await cart.save();

  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name tagline image variants slug',
  });

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, 'Cart synchronized successfully'));
});

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  syncCart,
};
