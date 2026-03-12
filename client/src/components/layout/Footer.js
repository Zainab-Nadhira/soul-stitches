import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cream-100 border-t border-blush-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🧶</span>
              <span className="font-script text-2xl text-blush-500">Soul Stitches</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Every stitch is made with love and care. Handcrafted crochet products that bring warmth and joy to your life. 💕
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-blush-100 hover:bg-blush-200 rounded-full flex items-center justify-center text-sm transition-colors">📸</a>
              <a href="#" className="w-9 h-9 bg-blush-100 hover:bg-blush-200 rounded-full flex items-center justify-center text-sm transition-colors">📌</a>
              <a href="#" className="w-9 h-9 bg-blush-100 hover:bg-blush-200 rounded-full flex items-center justify-center text-sm transition-colors">💬</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg text-gray-700 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {['All Products', 'Sweaters', 'Bags', 'Plushies', 'Keychains', 'Flowers & Bouquets', 'Scarves & Mufflers'].map(item => (
                <li key={item}>
                  <Link to={`/shop/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-blush-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-lg text-gray-700 mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {['Track Order', 'Returns & Exchanges', 'Shipping Info', 'Size Guide', 'Care Instructions', 'FAQs'].map(item => (
                <li key={item}>
                  <Link to="/track-order" className="hover:text-blush-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-gray-700 mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <span>📧</span>
                <span>contact@soulstitches.in</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🕐</span>
                <span>Mon–Sat: 10AM – 7PM IST</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📍</span>
                <span>India 🇮🇳</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Get cute updates 💌</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 text-sm border border-blush-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-200 bg-white"
                />
                <button className="bg-blush-200 hover:bg-blush-300 text-blush-600 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blush-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2024 Soul Stitches. All rights reserved. Made with 💕 in India</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
