import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Loading';

const CATEGORIES = [
  { name: 'Sweaters', icon: '🧥', slug: 'sweaters', bg: 'bg-pink-50' },
  { name: 'Bags', icon: '👜', slug: 'bags', bg: 'bg-purple-50' },
  { name: 'Plushies', icon: '🧸', slug: 'plushies', bg: 'bg-yellow-50' },
  { name: 'Keychains', icon: '🗝️', slug: 'keychains', bg: 'bg-green-50' },
  { name: 'Flowers', icon: '🌸', slug: 'flowers', bg: 'bg-red-50' },
  { name: 'Scarves', icon: '🧣', slug: 'scarves', bg: 'bg-blue-50' },
  { name: 'Bouquets', icon: '💐', slug: 'bouquets', bg: 'bg-orange-50' },
  { name: 'Coasters', icon: '☕', slug: 'coasters', bg: 'bg-teal-50' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', city: 'Mumbai', text: 'Absolutely in love with my crochet sweater! The quality is amazing and it arrived beautifully packed. Will definitely order again! 💕', rating: 5 },
  { name: 'Ananya K.', city: 'Bangalore', text: 'The plushie I ordered as a gift was SO cute! My friend loved it. Perfect packaging and super quick delivery.', rating: 5 },
  { name: 'Rhea M.', city: 'Delhi', text: 'The crochet bag is stunning! I get so many compliments whenever I carry it. Worth every rupee!', rating: 5 },
  { name: 'Divya P.', city: 'Chennai', text: 'Got the flower bouquet and it\'s just gorgeous! Never wilts and looks so aesthetic in my room. Love Soul Stitches!', rating: 5 },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          axios.get('/api/products?featured=true&limit=8'),
          axios.get('/api/products?trending=true&limit=4')
        ]);
        setFeatured(featRes.data.products || []);
        setTrending(trendRes.data.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-cream-100 to-lavender-50 min-h-[85vh] flex items-center">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl animate-float opacity-30">🧶</div>
        <div className="absolute top-32 right-20 text-4xl animate-float opacity-30" style={{animationDelay:'1s'}}>🌸</div>
        <div className="absolute bottom-20 left-32 text-5xl animate-float opacity-20" style={{animationDelay:'2s'}}>💐</div>
        <div className="absolute bottom-32 right-10 text-4xl animate-float opacity-30" style={{animationDelay:'0.5s'}}>🧸</div>
        <div className="absolute top-1/2 left-1/4 text-3xl animate-float opacity-20" style={{animationDelay:'1.5s'}}>🌷</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="inline-block bg-blush-100 text-blush-500 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                🧶 Handmade with Love in India
              </span>
              <h1 className="font-display text-5xl md:text-7xl text-gray-700 leading-tight mb-4">
                Crochet Magic<br />
                <span className="font-script text-blush-400">stitched for you</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                Every piece is handcrafted with premium yarn and endless love. From cozy sweaters to adorable plushies — discover your new favorite handmade treasure. 💕
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
                  Shop Now ✨
                </Link>
                
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-blush-500">500+</div>
                  <div className="text-xs text-gray-400">Happy Customers</div>
                </div>
                <div className="h-8 w-px bg-blush-200" />
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-blush-500">100%</div>
                  <div className="text-xs text-gray-400">Handmade</div>
                </div>
                <div className="h-8 w-px bg-blush-200" />
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-blush-500">4.9★</div>
                  <div className="text-xs text-gray-400">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero product grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { img: 'https://i.pinimg.com/1200x/dd/4c/42/dd4c42658738278b04e8a5b46774465b.jpg', label: 'Sweaters' },
                { img: 'https://i.pinimg.com/736x/9b/b5/ee/9bb5ee52189f4dcc9fd8b99b186648f8.jpg', label: 'Bags' },
                { img: 'https://i.pinimg.com/736x/f9/d3/dc/f9d3dc63d7769912f7f0f76a6ac1cb6e.jpg', label: 'Plushies' },
                { img: 'https://i.pinimg.com/736x/ef/a5/ac/efa5ac0177d84c50a6a9afc932dc6df1.jpg', label: 'Bouquets' },
              ].map((item, i) => (
                <div key={i} className={`card overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300 ${i === 0 ? 'row-span-1' : ''}`}
                  onClick={() => navigate(`/shop/${item.label.toLowerCase()}`)}>
                  <img src={item.img} alt={item.label} className="w-full aspect-square object-cover" />
                  <div className="p-3 text-center">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find your perfect handmade treasure</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} to={`/shop/${cat.slug}`}
                className={`${cat.bg} rounded-3xl p-4 text-center hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group`}>
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{cat.icon}</div>
                <span className="text-xs font-medium text-gray-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl text-gray-700">Featured Picks 🌟</h2>
              <p className="font-script text-blush-400 text-lg mt-1">Handpicked just for you</p>
            </div>
            <Link to="/shop?featured=true" className="btn-secondary text-sm hidden sm:flex items-center gap-1">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />) :
              featured.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* Trending Banner */}
      <section className="py-16 bg-gradient-to-r from-blush-100 via-lavender-100 to-blush-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl text-gray-700">🔥 Trending Now</h2>
              <p className="font-script text-blush-400 text-lg mt-1">Everyone's obsessed with these</p>
            </div>
            <Link to="/shop?trending=true" className="btn-primary text-sm hidden sm:flex">View All →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />) :
              trending.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title">Why Soul Stitches? 💕</h2>
          <p className="section-subtitle">Because you deserve the best handmade quality</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🧶', title: '100% Handmade', desc: 'Each piece is carefully crafted by hand with premium quality yarn' },
              { icon: '💌', title: 'Made with Love', desc: 'We pour our heart into every single stitch we make for you' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Delivered to your doorstep within 5-7 business days across India' },
              { icon: '✨', title: 'Customizable', desc: 'Many items can be customized in your preferred colors and sizes' },
            ].map(item => (
              <div key={item.title} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg text-gray-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title">Happy Customers 💬</h2>
          <p className="section-subtitle">Real love from real people</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blush-200 rounded-full flex items-center justify-center text-blush-600 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-blush-200 to-lavender-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4 animate-float">🧶</div>
          <h2 className="font-display text-4xl text-white mb-4">Start Your Crochet Collection</h2>
          <p className="text-white/80 text-lg mb-8">Browse hundreds of handmade crochet items, each made with love just for you 💕</p>
          <Link to="/shop" className="bg-white text-blush-500 font-bold px-10 py-4 rounded-full text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block">
            Shop Now ✨
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
