const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.find()
    ]);
    const revenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, stats: { totalOrders, totalProducts, totalUsers, revenue }, recentOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status
router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All products (including inactive)
router.get('/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
});

// Seed products
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = getSeedProducts();
    await Product.insertMany(products);
    res.json({ success: true, message: `${products.length} products seeded` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function getSeedProducts() {
  return [
    { name: 'Cozy Cream Crochet Sweater', description: 'A beautiful handmade crochet sweater in soft cream yarn. Perfect for cozy winter days. Made with love using premium acrylic yarn.', price: 1299, originalPrice: 1599, category: 'sweaters', images: ['https://i.pinimg.com/736x/ec/db/a1/ecdba1ed4c2dd955f3161b2a86ddd612.jpg'], stock: 15, colors: ['Cream', 'Beige', 'White'], sizes: ['S', 'M', 'L', 'XL'], isFeatured: true, isTrending: true, ratings: { average: 4.8, count: 24 }, tags: ['sweater', 'winter', 'cozy'] },
    { name: 'Pink Boho Crochet Bag', description: 'Trendy bohemian crochet bag perfect for summer outings. Spacious and stylish with a long strap.', price: 799, originalPrice: 999, category: 'bags', images: ['https://i.pinimg.com/736x/02/b7/26/02b7261abccc79149c7ebcb6ef82eb2e.jpg'], stock: 20, colors: ['Pink', 'Beige', 'White'], isFeatured: true, ratings: { average: 4.9, count: 42 }, tags: ['bag', 'boho', 'summer'] },
    { name: 'Lavender Crochet Scarf', description: 'Soft lavender infinity scarf crocheted with premium yarn. Lightweight and versatile for all seasons.', price: 499, originalPrice: 649, category: 'scarves', images: ['https://i.pinimg.com/736x/b6/39/6b/b6396b299f869ae09d2147d9362863ba.jpg'], stock: 30, colors: ['Lavender', 'Pink', 'White'], isTrending: true, ratings: { average: 4.7, count: 18 }, tags: ['scarf', 'lavender', 'soft'] },
    { name: 'Cute Crochet Bear Plushie', description: 'Adorable handmade crochet bear plushie. Perfect gift for kids and crochet lovers. Soft and huggable.', price: 599, originalPrice: 749, category: 'plushies', images: ['https://i.pinimg.com/736x/80/5c/b5/805cb5638847e419d09149abeeb4a519.jpg'], stock: 25, colors: ['Brown', 'Cream', 'Pink'], isFeatured: true, isTrending: true, ratings: { average: 5.0, count: 67 }, tags: ['plushie', 'bear', 'gift'] },
    { name: 'Rose Crochet Flower Bouquet', description: 'Beautiful everlasting crochet flower bouquet. Never wilts, perfect for home decor or gifting.', price: 899, originalPrice: 1099, category: 'bouquets', images: ['https://i.pinimg.com/736x/90/0f/ac/900fac46f1ac904c368c57ee6be65c4d.jpg'], stock: 12, colors: ['Red', 'Pink', 'Mixed'], isFeatured: true, ratings: { average: 4.9, count: 31 }, tags: ['bouquet', 'flowers', 'gift'] },
    { name: 'Strawberry Crochet Keychain', description: 'Cute miniature strawberry crochet keychain. Perfect bag charm or key accessory. Lightweight and adorable.', price: 199, originalPrice: 249, category: 'keychains', images: ['https://i.pinimg.com/1200x/24/8e/92/248e926c310607faaa7c81808edd01cf.jpg'], stock: 50, colors: ['Red', 'Pink'], isTrending: true, ratings: { average: 4.8, count: 89 }, tags: ['keychain', 'strawberry', 'cute'] },
    { name: 'Pastel Rainbow Coaster Set', description: 'Set of 4 handmade crochet coasters in pastel rainbow colors. Protects surfaces while adding charm to your home.', price: 349, originalPrice: 449, category: 'coasters', images: ['https://i.pinimg.com/1200x/25/72/b2/2572b2f28da7c3a535628476a96fe9e3.jpg'], stock: 35, colors: ['Multicolor', 'Pastel'], isFeatured: true, ratings: { average: 4.6, count: 22 }, tags: ['coasters', 'set', 'pastel'] },
    { name: 'Fluffy Winter Muffler', description: 'Extra fluffy crochet muffler in warm winter tones. Super cozy and stylish for cold weather.', price: 649, originalPrice: 849, category: 'mufflers', images: ['https://i.pinimg.com/736x/2d/ea/8e/2dea8e41192d0d3ce5571506613d8118.jpg'], stock: 18, colors: ['Cream', 'Grey', 'Brown'], isTrending: true, ratings: { average: 4.7, count: 15 }, tags: ['muffler', 'winter', 'fluffy'] },
    { name: 'Sunflower Crochet Hair Band', description: 'Beautiful crochet sunflower hair band. Perfect summer accessory for a cute boho look.', price: 249, originalPrice: 299, category: 'accessories', images: ['https://i.pinimg.com/736x/e3/f4/8a/e3f48a455fa238041d24dba9c49d6cc4.jpg'], stock: 40, colors: ['Yellow', 'Orange'], isFeatured: true, ratings: { average: 4.9, count: 56 }, tags: ['hairband', 'sunflower', 'accessory'] },
    { name: 'Mini Crochet Flower Bunch', description: 'Set of 5 mini crochet flowers. Great for hair accessories, home decoration, or gifting.', price: 399, originalPrice: 499, category: 'flowers', images: ['https://i.pinimg.com/736x/f5/12/12/f512125839895d8bb2461151f758f1de.jpg'], stock: 28, colors: ['Mixed', 'Pink', 'Purple'], ratings: { average: 4.8, count: 33 }, tags: ['flowers', 'mini', 'decor'] },
    { name: 'Crochet Bunny Plushie', description: 'Fluffy crochet bunny plushie with long ears. A perfect companion for kids and adults alike.', price: 699, originalPrice: 899, category: 'plushies', images: ['https://i.pinimg.com/1200x/2c/80/1c/2c801c20ea1b08d8ee83ab6aa7a031bd.jpg'], stock: 20, colors: ['White', 'Pink', 'Grey'], isTrending: true, ratings: { average: 5.0, count: 44 }, tags: ['bunny', 'plushie', 'soft'] },
    { name: 'Bohemian Crochet Tote Bag', description: 'Large boho crochet tote bag perfect for beach trips, shopping, or casual outings. Durable and stylish.', price: 999, originalPrice: 1299, category: 'bags', images: ['https://i.pinimg.com/1200x/f7/54/b3/f754b33896202bde9f039695afe8ef91.jpg'], stock: 15, colors: ['Natural', 'White', 'Beige'], isFeatured: true, isTrending: true, ratings: { average: 4.8, count: 28 }, tags: ['tote', 'boho', 'beach'] }
    
  ];
}

module.exports = router;
