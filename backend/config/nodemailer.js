const nodemailer = require('nodemailer');

const host = (process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
const port = Number(process.env.EMAIL_PORT) || 587;
const user = (process.env.EMAIL_USER || '').trim().replace(/^["']|["']$/g, '');
const pass = (process.env.EMAIL_PASS || '').trim().replace(/^["']|["']$/g, '');

// Use Nodemailer's built-in 'gmail' service config for Gmail accounts
const transportOptions = host.includes('gmail')
  ? {
      service: 'gmail',
      auth: { user, pass },
    }
  : {
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    };

const transporter = nodemailer.createTransport(transportOptions);

// Verify connection configuration on load
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ SMTP Transporter Connection Warning:', error.message);
  } else {
    console.log('✅ SMTP Transporter Connection Established Successfully');
  }
});

module.exports = transporter;
