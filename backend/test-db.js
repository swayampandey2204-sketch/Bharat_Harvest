const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  autoSelectFamily: false,
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
.then((conn) => {
  console.log('SUCCESS! MongoDB Connected to host:', conn.connection.host);
  process.exit(0);
})
.catch((err) => {
  console.error('FAILURE! Connection failed:', err.message);
  process.exit(1);
});
