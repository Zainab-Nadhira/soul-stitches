import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); toast.error('Admin access only'); return; }
    axios.get('/api/admin/stats').then(res => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [user, isAdmin, navigate]);

  const seedProducts = async () => {
    try {
      const res = await axios.post('/api/admin/seed');
      toast.success(res.data.message);
    } catch { toast.error('Seed failed'); }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-gray-700">Admin Dashboard 🎛️</h1>
          <p className="text-gray-400">Welcome back, {user?.name}!</p>
        </div>
        <button onClick={seedProducts} className="btn-secondary text-sm">🌱 Seed Products</button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="card p-6 skeleton h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Orders', value: stats?.stats?.totalOrders || 0, icon: '📦', color: 'bg-blush-100' },
            { label: 'Total Products', value: stats?.stats?.totalProducts || 0, icon: '🧶', color: 'bg-lavender-100' },
            { label: 'Customers', value: stats?.stats?.totalUsers || 0, icon: '👥', color: 'bg-cream-200' },
            { label: 'Revenue', value: `₹${(stats?.stats?.revenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: 'bg-sage-100' },
          ].map(stat => (
            <div key={stat.label} className={`card p-5 ${stat.color}`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-display text-2xl font-bold text-gray-700">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Link to="/admin/products" className="card p-6 text-center hover:-translate-y-1 transition-transform">
          <div className="text-4xl mb-3">🧶</div>
          <h3 className="font-display text-lg text-gray-700">Manage Products</h3>
          <p className="text-sm text-gray-400 mt-1">Add, edit, delete products</p>
        </Link>
        <Link to="/admin/orders" className="card p-6 text-center hover:-translate-y-1 transition-transform">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="font-display text-lg text-gray-700">Manage Orders</h3>
          <p className="text-sm text-gray-400 mt-1">View and update order status</p>
        </Link>
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-display text-lg text-gray-700">Analytics</h3>
          <p className="text-sm text-gray-400 mt-1">View sales & insights</p>
        </div>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders?.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-gray-700">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blush-500 hover:text-blush-600">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-cream-200">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {stats.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="py-3 pr-4 font-medium text-blush-500">#{order.orderId}</td>
                    <td className="py-3 pr-4 text-gray-600">{order.customerInfo?.name}</td>
                    <td className="py-3 pr-4 font-medium">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blush-100 text-blush-500'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
