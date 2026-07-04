const fs = require('fs');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');

const createProduct = asyncHandler(async (req, res) => {
  const { name, tagline, desc, categoryName, variants, isFeatured } = req.body;

  let category = await Category.findOne({
    name: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') },
  });

  if (!category) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    category = await Category.create({
      name: categoryName,
      slug,
    });
  }

  let imageUrl = '';
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bharat_harvest/products',
      });
      imageUrl = result.secure_url;
      // Delete temporary local file
      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      throw new ApiError(500, 'Failed to upload product image to cloud storage');
    }
  } else {
    throw new ApiError(400, 'Product image is required');
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const product = await Product.create({
    name,
    tagline,
    desc,
    slug,
    image: imageUrl,
    category: category._id,
    variants: typeof variants === 'string' ? JSON.parse(variants) : variants,
    isFeatured: isFeatured === 'true' || isFeatured === true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, tagline, desc, categoryName, variants, isFeatured } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  let updateFields = {};

  if (name) {
    updateFields.name = name;
    updateFields.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (tagline !== undefined) updateFields.tagline = tagline;
  if (desc) updateFields.desc = desc;
  if (isFeatured !== undefined) {
    updateFields.isFeatured = isFeatured === 'true' || isFeatured === true;
  }

  if (variants) {
    updateFields.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
  }

  if (categoryName) {
    let category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') },
    });
    if (!category) {
      const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      category = await Category.create({ name: categoryName, slug: catSlug });
    }
    updateFields.category = category._id;
  }

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bharat_harvest/products',
      });
      updateFields.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      throw new ApiError(500, 'Failed to upload product image to cloud storage');
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Product deleted successfully'));
});

const getProducts = asyncHandler(async (req, res) => {
  const { search, category, rating, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const queryObj = {};

  // Search by name/tagline
  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tagline: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by Category slug
  if (category && category !== 'all') {
    const foundCategory = await Category.findOne({ slug: category });
    if (foundCategory) {
      queryObj.category = foundCategory._id;
    } else {
      queryObj.category = null; // force empty results if category doesn't exist
    }
  }

  // Filter by rating
  if (rating) {
    queryObj.averageRating = { $gte: Number(rating) };
  }

  // Filter by variant price range
  if (minPrice || maxPrice) {
    queryObj['variants.price'] = {};
    if (minPrice) queryObj['variants.price'].$gte = Number(minPrice);
    if (maxPrice) queryObj['variants.price'].$lte = Number(maxPrice);
  }

  // Define sort criteria
  let sortCriteria = { createdAt: -1 }; // default newest
  if (sort) {
    if (sort === 'price-asc') {
      sortCriteria = { 'variants.price': 1 };
    } else if (sort === 'price-desc') {
      sortCriteria = { 'variants.price': -1 };
    } else if (sort === 'rating') {
      sortCriteria = { averageRating: -1 };
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(queryObj)
    .populate('category', 'name slug')
    .sort(sortCriteria)
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(queryObj);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
        totalProducts,
      },
      'Products fetched successfully'
    )
  );
});

const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  let query = {};
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    query._id = idOrSlug;
  } else {
    query.slug = idOrSlug;
  }

  const product = await Product.findOne(query).populate('category', 'name slug');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched successfully'));
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductByIdOrSlug,
};
