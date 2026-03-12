import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match!');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Welcome to Soul Stitches! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blush-50 to-lavender-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🌸</span>
          <h1 className="font-display text-3xl text-gray-700 mt-3">Create Account</h1>
          <p className="font-script text-blush-400 text-xl">Join the crochet family! 💕</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="input-field" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field" placeholder="Min. 6 characters" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className="input-field" placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base disabled:opacity-60">
              {loading ? '⏳ Creating...' : 'Create Account 🌸'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account? <Link to="/login" className="text-blush-500 hover:text-blush-600 font-medium">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
