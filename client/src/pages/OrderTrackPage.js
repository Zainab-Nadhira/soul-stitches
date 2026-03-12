import React, { useState } from 'react';
import axios from 'axios';

const OrderTrackPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
  const STATUS_ICONS = { placed: '📝', confirmed: '✅', processing: '🔧', shipped: '🚚', delivered: '🏠' };

  const trackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/orders/${orderId.trim().toUpperCase()}`);
      setOrder(res.data.order);
    } catch {
      setError('Order not found. Please check the order ID and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl text-gray-700 mb-2 text-center">Track Your Order 📦</h1>
      <p className="text-center text-gray-400 mb-8">Enter your order ID to see the latest status</p>

      <form onSubmit={trackOrder} className="card p-6 mb-6">
        <div className="flex gap-3">
          <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. SS-AB12CD34"
            className="input-field flex-1" required />
          <button type="submit" disabled={loading} className="btn-primary px-6 flex-shrink-0">
            {loading ? '⏳' : '🔍 Track'}
          </button>
        </div>
      </form>

      {error && <div className="card p-4 text-center text-red-400 mb-4">{error}</div>}

      {order && (
        <div className="card p-6 animate-fade-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="font-bold text-blush-500">#{order.orderId}</p>
            </div>
            <span className={`badge px-4 py-2 rounded-full text-sm ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' : order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-500' : 'bg-blush-100 text-blush-500'}`}>
              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
            </span>
          </div>

          {/* Progress steps */}
          {order.orderStatus !== 'cancelled' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${i <= currentStep ? 'bg-blush-200' : 'bg-gray-100'}`}>
                      {STATUS_ICONS[step]}
                    </div>
                    <span className={`text-xs mt-1 capitalize ${i <= currentStep ? 'text-blush-500 font-medium' : 'text-gray-400'}`}>{step}</span>
                  </div>
                ))}
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full">
                <div className="absolute h-2 bg-blush-300 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between bg-cream-50 p-3 rounded-xl">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-cream-200">
              <span>Total</span>
              <span className="text-blush-500">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 bg-cream-50 p-3 rounded-xl">
            <p>📍 {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackPage;
