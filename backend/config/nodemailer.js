const nodemailer = require('nodemailer');

const port = Number(process.env.EMAIL_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection configuration on load
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ SMTP Transporter Connection Warning:', error.message);
  } else {
    console.log('✅ SMTP Transporter Connection Established Successfully');
  }
});

module.exports = transporter;
