const transporter = require('../config/nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Bharat Harvest" <${process.env.EMAIL_FROM || 'no-reply@bharatharvest.com'}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Email delivery failed to ${to}: ${error.message}`);
  }
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || 'https://bharat-harvest.vercel.app'}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c89030; border-radius: 10px; background-color: #0c1e0e; color: #f0ead6;">
      <h2 style="color: #c89030; text-align: center;">Verify Your Account</h2>
      <p>Hello,</p>
      <p>Thank you for registering with Bharat Harvest. Please click the button below to verify your email address and activate your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #c89030; color: #0c1e0e; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
      </div>
      <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #a8c098;">${url}</p>
      <p style="margin-top: 40px; border-t: 1px solid #c89030; padding-top: 20px; font-size: 12px; color: #4a704a; text-align: center;">Bharat Harvest — Premium Artisanal Fox Nuts</p>
    </div>
  `;
  await sendEmail({ to: email, subject: 'Verify Your Bharat Harvest Account', html });
};

const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || 'https://bharat-harvest.vercel.app'}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c89030; border-radius: 10px; background-color: #0c1e0e; color: #f0ead6;">
      <h2 style="color: #c89030; text-align: center;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Please click the button below to reset it. This link is valid for 1 hour:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #c89030; color: #0c1e0e; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p style="word-break: break-all; color: #a8c098;">${url}</p>
      <p style="margin-top: 40px; border-t: 1px solid #c89030; padding-top: 20px; font-size: 12px; color: #4a704a; text-align: center;">Bharat Harvest — Premium Artisanal Fox Nuts</p>
    </div>
  `;
  await sendEmail({ to: email, subject: 'Reset Your Password - Bharat Harvest', html });
};

const sendOrderConfirmationEmail = async (email, order) => {
  const itemsList = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #2a4a2c;">${item.name} (${item.packSize})</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a4a2c; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a4a2c; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #c89030; border-radius: 10px; background-color: #0c1e0e; color: #f0ead6;">
      <h2 style="color: #c89030; text-align: center;">Order Confirmed!</h2>
      <p>Hello,</p>
      <p>Thank you for shopping with Bharat Harvest! Your order has been placed and is currently being processed. Here are the order details:</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #122313; color: #c89030;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>
      <div style="margin-top: 20px; text-align: right; font-size: 16px;">
        <p><strong>Subtotal:</strong> ₹${order.pricing.subtotal.toFixed(2)}</p>
        ${order.pricing.discount > 0 ? `<p style="color: #c89030;"><strong>Discount Applied:</strong> -₹${order.pricing.discount.toFixed(2)}</p>` : ''}
        <p><strong>Shipping:</strong> Free</p>
        <p style="font-size: 20px; color: #c89030;"><strong>Total:</strong> ₹${order.pricing.total.toFixed(2)}</p>
      </div>
      <p style="margin-top: 40px; border-t: 1px solid #c89030; padding-top: 20px; font-size: 12px; color: #4a704a; text-align: center;">Bharat Harvest — Premium Artisanal Fox Nuts</p>
    </div>
  `;
  await sendEmail({ to: email, subject: 'Your Order has been Confirmed! - Bharat Harvest', html });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
