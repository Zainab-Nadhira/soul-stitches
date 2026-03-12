import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CATEGORIES = ['sweaters', 'scarves', 'bags', 'flowers', 'bouquets', 'plushies', 'keychains', 'coasters', 'accessories', 'mufflers'];

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '', category: 'sweaters',
  images: '', stock: '', colors: '', sizes: '', material: 'Soft acrylic yarn',
  careInstructions: 'Hand wash in cold water', estimatedDelivery: '5-7 business days',
  isFeatured: false, isTrending: false, customizable: false
};

const AdminProducts = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchProducts();
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(res.data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editId) {
        await axios.put(`/api/products/${editId}`, data);
        toast.success('Product updated! 💕');
      } else {
        await axios.post('/api/products', data);
        toast.success('Product added! 🎉');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      images: (product.images || []).join('\n'),
      colors: (product.colors || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString()
    });
    setEditId(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-gray-700">Manage Products 🧶</h1>
        <button onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null); }}
          className="btn-primary">
          {showForm ? '✕ Close' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="font-display text-xl text-gray-700 mb-5">{editId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Product Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field h-24 resize-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock *</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Image URLs (one per line)</label>
              <textarea value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} className="input-field h-20 resize-none" placeholder="https://example.com/image.jpg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Colors (comma separated)</label>
              <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input-field" placeholder="Pink, White, Beige" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Sizes (comma separated)</label>
              <input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className="input-field" placeholder="S, M, L, XL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Material</label>
              <input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Estimated Delivery</label>
              <input value={form.estimatedDelivery} onChange={e => setForm(f => ({ ...f, estimatedDelivery: e.target.value }))} className="input-field" />
            </div>
            <div className="sm:col-span-2 flex gap-6">
              {[['isFeatured', '⭐ Featured'], ['isTrending', '🔥 Trending'], ['customizable', '✏️ Customizable']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 text-blush-400 rounded" />
                  <span className="text-sm text-gray-600">{label}</span>
                </label>
              ))}
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading products...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr>
                  <th className="text-left p-4 text-gray-600 font-medium">Product</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Category</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Price</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Stock</th>
                  <th className="text-left p-4 text-gray-600 font-medium">Status</th>
                  <th className="text-right p-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover"
                          onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                        <span className="font-medium text-gray-700 max-w-40 truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-gray-500">{p.category}</td>
                    <td className="p-4 font-medium">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`badge px-2.5 py-1 ${p.stock > 5 ? 'bg-green-100 text-green-600' : p.stock > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {p.isFeatured && <span className="badge bg-blush-100 text-blush-500 text-xs">⭐</span>}
                        {p.isTrending && <span className="badge bg-orange-100 text-orange-500 text-xs">🔥</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="px-3 py-1.5 bg-blush-100 text-blush-600 rounded-xl text-xs font-medium hover:bg-blush-200 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 bg-red-50 text-red-400 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors">Delete</button>
                      </div>
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

export default AdminProducts;
