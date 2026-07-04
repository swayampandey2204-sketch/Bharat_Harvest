const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existedCategory = await Category.findOne({ name });
  if (existedCategory) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = await Category.create({
    name,
    slug,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, 'Category created successfully'));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return res
    .status(200)
    .json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Category deleted successfully'));
});

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
