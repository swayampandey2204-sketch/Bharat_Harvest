const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

async function updateImage() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoSelectFamily: false,
    });
    console.log('Connected to MongoDB successfully.');

    const result = await Product.updateOne(
      { slug: 'himalayan-salt' },
      { $set: { image: '/images/himalayan-salt.jpg' } }
    );

    console.log('Database Update Result:', result);
    mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Failed to update product image in database:', error);
  }
}

updateImage();
