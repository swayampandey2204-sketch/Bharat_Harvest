require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle Unhandled Promise Rejections gracefully
    process.on('unhandledRejection', (err) => {
      console.log(`Error: ${err.message}`);
      console.log('Shutting down the server due to Unhandled Promise Rejection...');
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error('MongoDB database connection failed:', err);
    process.exit(1);
  });

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception...');
  process.exit(1);
});
