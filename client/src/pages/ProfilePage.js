import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-600',
  confirmed: 'bg-blue-100 text-blue-600',
  processing: 'bg-purple-100 text-purple-600',
  shipped: 'bg-orange-100 text-orange-600',
  delivered: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-500'
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({ name: user.name || '', phone: user.phone || '' });
    axios.get('/api/orders/my-orders').then(res => setOrders(res.data.orders || [])).catch(console.error);
  }, [user, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/auth/profile', form);
      toast.success('Profile updated! 💕');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="card p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-blush-200 rounded-full flex items-center justify-center text-2xl font-bold text-blush-600">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl text-gray-700">{user.name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="ml-auto text-sm text-red-400 hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-red-50">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: 'profile', label: '👤 Profile' }, { id: 'orders', label: '📦 My Orders' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blush-300 text-white shadow-soft' : 'bg-cream-100 text-gray-600 hover:bg-blush-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card p-6">
          <h2 className="font-display text-xl text-gray-700 mb-5">Edit Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input value={user.email} disabled className="input-field opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91..." />
            </div>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes 💕'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-gray-500">No orders yet. Start shopping!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs text-gray-400">Order ID</span>
                      <p className="font-bold text-blush-500">#{order.orderId}</p>
                    </div>
                    <span className={`badge px-3 py-1 rounded-full text-xs ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm border-t border-cream-200 pt-2">
                    <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="font-bold text-gray-700">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
