import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/product/ProductCard';
import ProductCard from '../components/product/ProductCard';
import { PageLoader } from '../components/ui/Loading';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, reviewRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/reviews/product/${id}`)
        ]);
        const p = prodRes.data.product;
        setProduct(p);
        setSelectedColor(p.colors?.[0] || '');
        setSelectedSize(p.sizes?.[0] || '');
        setReviews(reviewRes.data.reviews || []);
        // Fetch related
        const relRes = await axios.get(`/api/products?category=${p.category}&limit=4`);
        setRelated(relRes.data.products?.filter(r => r._id !== p._id).slice(0, 4) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success('Added to cart! 🛒');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to write a review');
    setSubmittingReview(true);
    try {
      const res = await axios.post('/api/reviews', { productId: id, ...reviewForm });
      setReviews(prev => [res.data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted! 💕');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!product) return <div className="text-center py-20"><p>Product not found</p></div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-blush-400">Home</Link> /
        <Link to="/shop" className="hover:text-blush-400">Shop</Link> /
        <Link to={`/shop/${product.category}`} className="hover:text-blush-400 capitalize">{product.category}</Link> /
        <span className="text-gray-600 truncate max-w-32">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="card overflow-hidden mb-3 aspect-square bg-cream-100">
            <img
              src={product.images?.[selectedImg] || 'https://i.pinimg.com/736x/ef/a5/ac/efa5ac0177d84c50a6a9afc932dc6df1.jpg0'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'; }}
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-blush-300 shadow-soft' : 'border-transparent opacity-70'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm text-blush-400 font-medium capitalize mb-2 block">{product.category}</span>
          <h1 className="font-display text-3xl text-gray-700 mb-3">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.ratings?.average || 0} count={product.ratings?.count} />
            <span className="text-sm text-gray-500">{product.ratings?.average || 0} out of 5</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-800">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="badge bg-green-100 text-green-600">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Color: <span className="text-blush-500">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-4 py-1.5 rounded-full text-sm border-2 transition-all ${selectedColor === c ? 'border-blush-300 bg-blush-100 text-blush-600' : 'border-gray-200 hover:border-blush-200 text-gray-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Size: <span className="text-blush-500">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-xl text-sm font-medium border-2 transition-all ${selectedSize === s ? 'border-blush-300 bg-blush-100 text-blush-600' : 'border-gray-200 hover:border-blush-200 text-gray-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-cream-200 hover:bg-blush-100 text-gray-600 font-bold transition-colors">−</button>
              <span className="w-10 text-center font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-full bg-cream-200 hover:bg-blush-100 text-gray-600 font-bold transition-colors">+</button>
              <span className="text-sm text-gray-400 ml-2">{product.stock} in stock</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              🛒 {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={() => toggleWishlist(product)}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl transition-all ${isInWishlist(product._id) ? 'border-blush-300 bg-blush-100' : 'border-gray-200 hover:border-blush-200'}`}>
              {isInWishlist(product._id) ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Meta */}
          <div className="card p-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2"><span>🎯</span><span>Material: {product.material}</span></div>
            <div className="flex items-center gap-2"><span>🚿</span><span>Care: {product.careInstructions}</span></div>
            <div className="flex items-center gap-2"><span>🚚</span><span>Delivery: {product.estimatedDelivery}</span></div>
            {product.customizable && <div className="flex items-center gap-2"><span>✏️</span><span className="text-blush-500">Customizable - Contact us for custom orders!</span></div>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <h2 className="font-display text-2xl text-gray-700 mb-6">Customer Reviews 💬</h2>
        
        {/* Review form */}
        {user && (
          <div className="card p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                      className={`text-2xl transition-transform hover:scale-125 ${s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
              </div>
              <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Review title" className="input-field" />
              <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience..." className="input-field h-24 resize-none" required />
              <button type="submit" disabled={submittingReview} className="btn-primary disabled:opacity-50">
                {submittingReview ? 'Submitting...' : 'Submit Review 💕'}
              </button>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-2">💭</div>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-blush-200 rounded-full flex items-center justify-center text-blush-600 font-bold">
                    {r.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">{r.name}</p>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
                    </div>
                  </div>
                </div>
                {r.title && <p className="font-medium text-gray-700 mb-1">{r.title}</p>}
                <p className="text-gray-500 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-gray-700 mb-6">You Might Also Like 🌸</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
