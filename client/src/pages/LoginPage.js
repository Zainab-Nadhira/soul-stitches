import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 💕');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blush-50 to-lavender-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🧶</span>
          <h1 className="font-display text-3xl text-gray-700 mt-3">Welcome back!</h1>
          <p className="font-script text-blush-400 text-xl">We missed you 💕</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field" placeholder="Your password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base disabled:opacity-60">
              {loading ? '⏳ Logging in...' : 'Login 💕'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have an account? <Link to="/register" className="text-blush-500 hover:text-blush-600 font-medium">Sign up here</Link>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
