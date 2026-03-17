const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOrderConfirmation = async (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f5e6e8;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #f5e6e8;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f5e6e8;text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Soul Stitches 🧶" <${process.env.EMAIL_USER}>`,
    to: order.customerInfo.email,
    subject: `Order Confirmed! #${order.orderId} - Soul Stitches`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Georgia',serif;background:#fdf6f0;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    
    <div style="background:linear-gradient(135deg,#f8b4c8,#dbb6f0);padding:40px;text-align:center;">
      <h1 style="color:#fff;font-size:28px;margin:0;letter-spacing:2px;">🧶 Soul Stitches</h1>
      <p style="color:#fff;margin:10px 0 0;font-size:14px;opacity:0.9;">Handmade with love, stitched with soul</p>
    </div>

    <div style="padding:30px;">
      <div style="background:#fef9ff;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #f8b4c8;">
        <h2 style="color:#7c4d8a;margin:0 0 8px;">✨ Order Confirmed!</h2>
        <p style="color:#666;margin:0;">Thank you, <strong>${order.customerInfo.name}</strong>! Your order has been placed successfully.</p>
        <p style="color:#f8b4c8;font-size:20px;font-weight:bold;margin:8px 0 0;">Order ID: #${order.orderId}</p>
      </div>

      <h3 style="color:#7c4d8a;border-bottom:2px solid #fce4ec;padding-bottom:8px;">📦 Order Summary</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#fce4ec;">
            <th style="padding:10px;text-align:left;color:#7c4d8a;">Product</th>
            <th style="padding:10px;text-align:center;color:#7c4d8a;">Qty</th>
            <th style="padding:10px;text-align:right;color:#7c4d8a;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px;font-weight:bold;color:#7c4d8a;font-size:16px;">Total</td>
            <td style="padding:12px;font-weight:bold;color:#7c4d8a;font-size:16px;text-align:right;">₹${order.pricing.total.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="color:#7c4d8a;border-bottom:2px solid #fce4ec;padding-bottom:8px;margin-top:24px;">🏠 Shipping Address</h3>
      <p style="color:#555;line-height:1.6;background:#fdf6f0;padding:15px;border-radius:10px;">
        ${order.customerInfo.name}<br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
        📞 ${order.customerInfo.phone}
      </p>

      <div style="background:linear-gradient(135deg,#e8f5e9,#f3e5f5);border-radius:12px;padding:20px;margin-top:24px;text-align:center;">
        <p style="color:#7c4d8a;font-size:16px;margin:0;"><strong>🚚 Estimated Delivery: 5-7 Business Days</strong></p>
        <p style="color:#888;margin:8px 0 0;font-size:13px;">Payment: ${order.paymentMethod.toUpperCase()}</p>
      </div>

      <div style="text-align:center;margin-top:30px;padding:20px;background:#fdf6f0;border-radius:12px;">
  <p style="color:#7c4d8a;font-size:22px;margin:0;">🎉 Thank you for your purchase!</p>
  <p style="color:#888;font-size:14px;margin:8px 0 0;">We are so grateful for your support 💕</p>
  <p style="color:#888;font-size:14px;margin:4px 0 0;">Your order is being handcrafted with love just for you 🧶</p>
  <p style="color:#f8b4c8;font-size:13px;margin:8px 0 0;">— The Soul Stitches Team 🌸</p>
</div>

    <div style="background:#f8b4c8;padding:20px;text-align:center;">
      <p style="color:#fff;margin:0;font-size:13px;">Soul Stitches | Handmade Crochet | contact@soulstitches.in</p>
    </div>
  </div>
</body>
</html>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Order confirmation email sent to', order.customerInfo.email);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};
