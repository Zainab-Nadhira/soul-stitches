import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-gray-700 mb-2">My Wishlist 💕</h1>
      <p className="text-gray-400 mb-8">{wishlist.length} saved items</p>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-float">🤍</div>
          <h2 className="font-display text-2xl text-gray-600 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8">Save items you love by clicking the heart icon 💕</p>
          <Link to="/shop" className="btn-primary text-base px-8 py-3">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
