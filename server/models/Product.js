const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: {
    type: String,
    required: true,
    enum: ['sweaters', 'scarves', 'bags', 'flowers', 'bouquets', 'plushies', 'keychains', 'coasters', 'accessories', 'mufflers']
  },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  colors: [String],
  sizes: [String],
  tags: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  material: { type: String, default: 'Soft acrylic yarn' },
  careInstructions: { type: String, default: 'Hand wash in cold water' },
  estimatedDelivery: { type: String, default: '5-7 business days' },
  customizable: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
