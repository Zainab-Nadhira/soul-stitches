import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios.get(`/api/orders/${orderId}`).then(res => setOrder(res.data.order)).catch(console.error);
    }
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="text-7xl mb-6 animate-bounce-soft">🎉</div>
      <h1 className="font-display text-4xl text-gray-700 mb-3">Order Placed!</h1>
      <p className="font-script text-2xl text-blush-400 mb-8">Thank you for shopping with Soul Stitches! 💕</p>
      <div className="card p-6 mb-8 text-left">
        <div className="text-center mb-6 pb-4 border-b border-cream-200">
          <span className="text-sm text-gray-400">Your Order ID</span>
          <p className="font-bold text-2xl text-blush-500 mt-1">#{orderId}</p>
        </div>
        {order ? (
          <>
            <div className="space-y-2 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-200 pt-3 flex justify-between font-bold text-lg">
              <span>Total Paid</span>
              <span className="text-blush-500">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 py-4">Loading order details...</div>
        )}
        <div className="mt-5 bg-gradient-to-r from-blush-50 to-lavender-50 rounded-2xl p-4 space-y-2 text-sm text-gray-500">
          <p>📧 Order confirmation email has been sent to you</p>
          <p>🚚 Estimated delivery: 5-7 business days</p>
          <p>💳 Payment: {order?.paymentMethod?.toUpperCase() || 'Processing...'}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/shop" className="btn-primary px-8 py-3 text-base">Continue Shopping ✨</Link>
        <Link to="/track-order" className="btn-secondary px-8 py-3 text-base">Track Order 📦</Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
