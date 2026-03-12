import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Puducherry','Chandigarh'];

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const shipping = cartTotal >= 999 ? 0 : 79;
  const total = cartTotal + shipping;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Cart is empty!');
    setSubmitting(true);
    try {
      const orderData = {
        userId: user?._id,
        customerInfo: { name: form.fullName, email: form.email, phone: form.phone },
        shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || '',
          price: item.price,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize
        })),
        pricing: { subtotal: cartTotal, shipping, discount: 0, total },
        paymentMethod,
      };
      const res = await axios.post('/api/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${res.data.order.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-display text-2xl text-gray-600 mb-4">Your cart is empty</h2>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-gray-700 mb-8">Checkout 💳</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="card p-6">
              <h2 className="font-display text-xl text-gray-700 mb-5">👤 Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} required className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="font-display text-xl text-gray-700 mb-5">📍 Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} required className="input-field h-20 resize-none" placeholder="House no., Street, Area" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} required className="input-field" placeholder="400001" maxLength={6} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">State *</label>
                  <select name="state" value={form.state} onChange={handleChange} required className="input-field">
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="font-display text-xl text-gray-700 mb-5">💳 Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'upi', icon: '📱', label: 'UPI', desc: 'Pay via UPI (Google Pay, PhonePe, Paytm)' },
                  { id: 'card', icon: '💳', label: 'Credit / Debit Card', desc: 'All major cards accepted' },
                  { id: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                ].map(method => (
                  <label key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-blush-300 bg-blush-50' : 'border-gray-200 hover:border-blush-200'}`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)} className="text-blush-400 w-4 h-4" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-700">{method.label}</p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl text-gray-700 mb-5">📋 Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={item.images?.[0] || 'https://i.pinimg.com/736x/ef/a5/ac/efa5ac0177d84c50a6a9afc932dc6df1.jpg'} alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700 flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-200 pt-3 space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? <span className="text-green-500 font-medium">FREE</span> : <span>₹{shipping}</span>}
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-cream-200 pt-2">
                  <span>Total</span>
                  <span className="text-blush-500">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? '⏳ Placing Order...' : '🎉 Place Order'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">🔒 Your information is safe & secure</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
