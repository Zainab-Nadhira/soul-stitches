import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-600',
  confirmed: 'bg-blue-100 text-blue-600',
  processing: 'bg-purple-100 text-purple-600',
  shipped: 'bg-orange-100 text-orange-600',
  delivered: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-500'
};

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      toast.success('Status updated! 💕');
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-gray-700 mb-8">Manage Orders 📦</h1>
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card overflow-hidden">
              <div className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-blush-500">#{order.orderId}</p>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{order.customerInfo?.name}</p>
                    <p className="text-sm text-gray-400">{order.customerInfo?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
                  <select
                    value={order.orderStatus}
                    onChange={e => { e.stopPropagation(); updateStatus(order._id, e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100'}`}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="text-gray-700 bg-white capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <span className="text-gray-400 text-sm">{expandedOrder === order._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="border-t border-cream-200 p-5 bg-cream-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm bg-white p-2.5 rounded-xl">
                            <span className="text-gray-600">{item.name} × {item.quantity}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Shipping Details</h4>
                      <div className="text-sm text-gray-500 bg-white p-3 rounded-xl space-y-1">
                        <p>📞 {order.customerInfo?.phone}</p>
                        <p>📍 {order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="mt-2">💳 Payment: {order.paymentMethod?.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
