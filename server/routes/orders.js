const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/email');

// Place order
router.post('/', async (req, res) => {
  try {
    const { customerInfo, shippingAddress, items, pricing, paymentMethod, notes, userId } = req.body;

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      user: userId || null,
      customerInfo, shippingAddress, items, pricing, paymentMethod, notes,
      estimatedDelivery: '5-7 business days'
    });

    // Send confirmation email
    await sendOrderConfirmation(order);

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
