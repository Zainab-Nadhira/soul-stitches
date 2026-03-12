const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, default: () => 'SS-' + uuidv4().slice(0, 8).toUpperCase() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    color: String,
    size: String
  }],
  pricing: {
    subtotal: Number,
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: Number
  },
  paymentMethod: { type: String, enum: ['upi', 'card', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  trackingNumber: String,
  notes: String,
  estimatedDelivery: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
