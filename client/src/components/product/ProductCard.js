import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-xs ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
    {count !== undefined && <span className="text-xs text-gray-400">({count})</span>}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! 💕', { icon: wishlisted ? '💔' : '❤️' });
  };

  return (
    <Link to={`/product/${product._id}`} className="group card overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
      {/* Image */}
      <div className="relative overflow-hidden bg-cream-100 aspect-square">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'; }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isTrending && (
            <span className="badge bg-amber-100 text-amber-600">🔥 Trending</span>
          )}
          {discount > 0 && (
            <span className="badge bg-green-100 text-green-600">{discount}% OFF</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-red-100 text-red-500">Out of Stock</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-card transition-all duration-200 ${wishlisted ? 'bg-blush-300 text-white scale-110' : 'bg-white/80 hover:bg-white text-gray-400 hover:text-blush-400'}`}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blush-400 font-medium capitalize mb-1">{product.category}</span>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 line-clamp-2 group-hover:text-blush-500 transition-colors font-body">
          {product.name}
        </h3>
        
        <StarRating rating={product.ratings?.average || 0} count={product.ratings?.count} />
        
        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="text-lg font-bold text-gray-800">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-auto w-full py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blush-100 hover:bg-blush-200 text-blush-600 hover:shadow-soft active:scale-95'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
export { StarRating };
