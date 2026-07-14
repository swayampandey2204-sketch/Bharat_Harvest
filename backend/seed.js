require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const categoriesData = [
  { name: 'Raw Sourcing', slug: 'raw', description: 'Premium quality raw & unprocessed lotus seeds' },
  { name: 'Flavoured Roast', slug: 'flavored', description: 'Crispy roasted foxnuts seasoned with premium spices' },
];

const productsData = [
  {
    name: 'Premium Raw Makhana',
    tagline: 'Unflavored & Whole Foxnuts',
    desc: 'Hand-picked, high-quality lotus seeds. 100% natural, raw & unprocessed — the healthiest snack staple.',
    slug: 'raw-premium-makhana',
    image: '/images/raw-premium.jpg',
    categorySlug: 'raw',
    variants: [
      { packSize: '100g Bag', price: 229, stock: 150 },
      { packSize: '200g Bag', price: 399, stock: 120 },
    ],
    isFeatured: true,
  },
  {
    name: 'Peri Peri Makhana',
    tagline: 'Spicy & Roasted Foxnuts',
    desc: 'Fiery African bird\'s eye chili, sweet paprika & tangy lemon. Vacuum cooked, not deep fried.',
    slug: 'peri-peri',
    image: '/images/peri-peri.jpg',
    categorySlug: 'flavored',
    variants: [
      { packSize: '50g Pouch', price: 189, stock: 90 },
      { packSize: '90g Jar', price: 249, stock: 80 },
    ],
    isFeatured: true,
  },
  {
    name: 'Cheesy Delight Makhana',
    tagline: 'Rich & Creamy Foxnuts',
    desc: 'Gourmet cheddar cheese dust tossed lightly on crispy roasted makhana. 100% roasted, not fried.',
    slug: 'cheese',
    image: '/images/cheesy.jpg',
    categorySlug: 'flavored',
    variants: [
      { packSize: '50g Pouch', price: 189, stock: 110 },
      { packSize: '90g Jar', price: 249, stock: 70 },
    ],
    isFeatured: false,
  },
  {
    name: 'Himalayan Salt Makhana',
    tagline: 'Light & Clean Foxnuts',
    desc: 'Lightly roasted with a touch of cold-pressed oil and dusted with pure Himalayan pink salt.',
    slug: 'himalayan-salt',
    image: '/images/himalayan-salt.jpg',
    categorySlug: 'flavored',
    variants: [
      { packSize: '50g Pouch', price: 189, stock: 140 },
      { packSize: '90g Jar', price: 249, stock: 95 },
    ],
    isFeatured: true,
  },
  {
    name: 'Pudina Magic Makhana',
    tagline: 'Minty & Roasted Foxnuts',
    desc: 'Refreshing field mint powder with zesty dry mango seasoning and classic Indian heritage spices.',
    slug: 'pudina',
    image: '/images/pudina.jpg',
    categorySlug: 'flavored',
    variants: [
      { packSize: '50g Pouch', price: 189, stock: 85 },
      { packSize: '90g Jar', price: 249, stock: 65 },
    ],
    isFeatured: false,
  },
  {
    name: 'Achari Tadka Makhana',
    tagline: 'Pickle-Flavored Tadka Foxnuts',
    desc: 'Traditional pickle spices, raw green mango zest & mustard seed extracts over wood-fired makhana.',
    slug: 'achari',
    image: '/images/achari-brown.jpg',
    categorySlug: 'flavored',
    variants: [
      { packSize: '50g Pouch', price: 189, stock: 100 },
      { packSize: '90g Jar', price: 249, stock: 75 },
    ],
    isFeatured: false,
  },
  {
    name: 'Tomato Twist Makhana',
    tagline: 'Tangy & Spicy Roasted Foxnuts',
    desc: 'Sun-ripened tomato seasoning blended with Indian spices for a tangy, bold crunch. Vacuum cooked.',
    slug: 'tomato-twist',
    image: '/images/tomato-twist.jpg',
    categorySlug: 'flavored',
    variants: [
      { packSize: '50g Pouch', price: 189, stock: 120 },
      { packSize: '90g Jar', price: 249, stock: 85 },
    ],
    isFeatured: false,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing categories and products...');

    // Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${categories.length} categories successfully.`);

    // Seed Products
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    const productsToInsert = productsData.map((p) => {
      const categoryId = categoryMap[p.categorySlug];
      if (!categoryId) {
        throw new Error(`Category mapping not found for slug: ${p.categorySlug}`);
      }
      return {
        name: p.name,
        tagline: p.tagline,
        desc: p.desc,
        slug: p.slug,
        image: p.image,
        category: categoryId,
        variants: p.variants,
        isFeatured: p.isFeatured,
      };
    });

    const products = await Product.insertMany(productsToInsert);
    console.log(`Seeded ${products.length} products successfully.`);

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
