const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'name tagline image variants slug averageRating desc'
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, 'Wishlist retrieved successfully'));
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  const isAlreadyAdded = wishlist.products.includes(productId);
  if (isAlreadyAdded) {
    return res
      .status(400)
      .json(new ApiResponse(400, wishlist, 'Product is already in wishlist'));
  }

  wishlist.products.push(productId);
  await wishlist.save();

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
    'products',
    'name tagline image variants slug averageRating desc'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedWishlist, 'Product added to wishlist'));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  await wishlist.save();

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
    'products',
    'name tagline image variants slug averageRating desc'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedWishlist, 'Product removed from wishlist'));
});

const clearWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  wishlist.products = [];
  await wishlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, 'Wishlist cleared successfully'));
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  const isAlreadyAdded = wishlist.products.includes(productId);

  if (isAlreadyAdded) {
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  } else {
    wishlist.products.push(productId);
  }
  await wishlist.save();

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
    'products',
    'name tagline image variants slug averageRating desc'
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedWishlist,
        isAlreadyAdded ? 'Product removed from wishlist' : 'Product added to wishlist'
      )
    );
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
};
