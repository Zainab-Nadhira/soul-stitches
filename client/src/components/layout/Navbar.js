import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const categories = [
    { label: 'Sweaters', path: '/shop/sweaters' },
    { label: 'Bags', path: '/shop/bags' },
    { label: 'Plushies', path: '/shop/plushies' },
    { label: 'Keychains', path: '/shop/keychains' },
    { label: 'Flowers', path: '/shop/flowers' },
    { label: 'Scarves', path: '/shop/scarves' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white/90 backdrop-blur-sm'}`}>
      {/* Top bar */}
      <div className="bg-blush-200 text-blush-600 text-center text-xs py-1.5 font-medium">
        🧶 Free shipping on orders above ₹999 | Handmade with love in India 💕
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:animate-bounce-soft">🧶</span>
            <div>
              <span className="font-script text-2xl text-blush-500 leading-none block">Soul Stitches</span>
              <span className="text-xs text-gray-400 font-body hidden sm:block">Handmade with love</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blush-500 transition-colors rounded-xl hover:bg-blush-50">Home</Link>
            <Link to="/shop" className="nav-link px-3 py-2 text-sm font-medium text-gray-600 hover:text-blush-500 transition-colors rounded-xl hover:bg-blush-50">All Products</Link>
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blush-500 transition-colors rounded-xl hover:bg-blush-50">
                Categories ▾
              </button>
              <div className="absolute top-full left-0 bg-white rounded-2xl shadow-hover py-2 min-w-48 hidden group-hover:block border border-blush-100 mt-1">
                {categories.map(c => (
                  <Link key={c.path} to={c.path} className="block px-4 py-2 text-sm text-gray-600 hover:bg-blush-50 hover:text-blush-500 transition-colors">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="border border-blush-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blush-200 w-44"
                />
                <button type="submit" className="text-blush-400 hover:text-blush-500">🔍</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-blush-50 rounded-full transition-colors text-gray-500 hover:text-blush-500 text-lg">🔍</button>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-blush-50 rounded-full transition-colors">
              <span className="text-lg">🤍</span>
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-blush-300 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-blush-50 rounded-full transition-colors">
              <span className="text-lg">🛒</span>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-blush-400 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blush-100 hover:bg-blush-200 text-blush-600 rounded-full text-sm font-medium transition-colors">
                  👤 {user.name.split(' ')[0]}
                </button>
                <div className="absolute top-full right-0 bg-white rounded-2xl shadow-hover py-2 min-w-44 hidden group-hover:block border border-blush-100 mt-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blush-50">My Profile</Link>
                  <Link to="/profile#orders" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blush-50">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blush-50">Wishlist</Link>
                  {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">Admin Dashboard</Link>}
                  <hr className="my-1 border-blush-100" />
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:flex items-center gap-1">
                Login
              </Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-blush-50 rounded-full transition-colors text-xl">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-blush-100 px-4 py-4 space-y-2">
          <Link to="/" className="block py-2 text-gray-600 hover:text-blush-500 font-medium">Home</Link>
          <Link to="/shop" className="block py-2 text-gray-600 hover:text-blush-500 font-medium">All Products</Link>
          {categories.map(c => (
            <Link key={c.path} to={c.path} className="block py-2 pl-4 text-sm text-gray-500 hover:text-blush-500">{c.label}</Link>
          ))}
          {!user && <Link to="/login" className="block btn-primary text-center mt-3">Login / Register</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
