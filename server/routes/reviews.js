const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.get('/product/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const review = await Review.create({ product: productId, user: req.user._id, name: req.user.name, rating, title, comment });
    
    // Update product ratings
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { 'ratings.average': avg.toFixed(1), 'ratings.count': reviews.length });
    
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
