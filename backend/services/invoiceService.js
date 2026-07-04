const generateInvoiceHTML = (order) => {
  const items = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.packSize}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 8px;">
          <table style="width: 100%; line-height: inherit; text-align: left;">
            <tr>
              <td colspan="5">
                <table style="width: 100%;">
                  <tr>
                    <td>
                      <h2>BHARAT HARVEST</h2>
                      <p>Premium Artisanal Fox Nuts & Healthy Snacks</p>
                    </td>
                    <td style="text-align: right;">
                      <h3>INVOICE</h3>
                      <p>Order ID: ${order._id}</p>
                      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr style="background-color: #f7f7f7;">
              <td colspan="2" style="padding: 15px; border-radius: 4px;">
                <strong>Billed To:</strong><br>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.addressLine1}<br>
                ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}<br>` : ''}
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                Phone: ${order.shippingAddress.phone}
              </td>
              <td colspan="3" style="padding: 15px; border-radius: 4px; text-align: right;">
                <strong>Payment Info:</strong><br>
                Method: ${order.paymentDetails.method}<br>
                Status: ${order.paymentDetails.status}<br>
                Order Status: ${order.status}
              </td>
            </tr>
            <tr><td colspan="5" style="height: 20px;"></td></tr>
            <tr style="background-color: #eee; font-weight: bold;">
              <td style="padding: 10px;">Item</td>
              <td style="padding: 10px; text-align: center;">Pack Size</td>
              <td style="padding: 10px; text-align: center;">Qty</td>
              <td style="padding: 10px; text-align: right;">Unit Price</td>
              <td style="padding: 10px; text-align: right;">Total</td>
            </tr>
            ${items}
            <tr>
              <td colspan="3"></td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">₹${order.pricing.subtotal.toFixed(2)}</td>
            </tr>
            ${
              order.pricing.discount > 0
                ? `
            <tr>
              <td colspan="3"></td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: green;">Discount:</td>
              <td style="padding: 10px; text-align: right; color: green;">-₹${order.pricing.discount.toFixed(2)}</td>
            </tr>
            `
                : ''
            }
            <tr>
              <td colspan="3"></td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">Free</td>
            </tr>
            <tr style="font-size: 18px; font-weight: bold;">
              <td colspan="3"></td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #333;">Total Paid:</td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #333; color: #c89030;">₹${order.pricing.total.toFixed(2)}</td>
            </tr>
          </table>
          <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #777;">Thank you for shopping with Bharat Harvest! For any queries, reach out to contact@bharatharvest.com</p>
        </div>
      </body>
    </html>
  `;
};

module.exports = {
  generateInvoiceHTML,
};
