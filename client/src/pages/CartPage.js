import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-6xl mb-6 animate-float">🛒</div>
        <h2 className="font-display text-3xl text-gray-600 mb-3">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Fill it with handmade crochet love! 💕</p>
        <Link to="/shop" className="btn-primary text-base px-8 py-3">Start Shopping ✨</Link>
      </div>
    );
  }

  const shipping = cartTotal >= 999 ? 0 : 79;
  const total = cartTotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-gray-700 mb-8">Shopping Cart 🛒 <span className="text-base font-body text-gray-400 font-normal">({cart.length} items)</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, i) => (
            <div key={`${item._id}-${i}`} className="card p-4 flex gap-4">
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-2xl flex-shrink-0"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150'; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item._id}`}>
                  <h3 className="font-semibold text-gray-700 text-sm mb-1 hover:text-blush-500 transition-colors line-clamp-2">{item.name}</h3>
                </Link>
                <div className="flex gap-2 text-xs text-gray-400 mb-3">
                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-cream-200 hover:bg-blush-100 text-gray-600 font-bold text-sm transition-colors">−</button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-cream-200 hover:bg-blush-100 text-gray-600 font-bold text-sm transition-colors">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              </div>
              <button onClick={() => { removeFromCart(item._id, item.selectedColor, item.selectedSize); toast('Removed from cart'); }}
                className="self-start w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-400 flex items-center justify-center text-sm transition-colors flex-shrink-0">✕</button>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-2">
            <button onClick={() => { clearCart(); toast('Cart cleared'); }} className="text-sm text-red-400 hover:text-red-500 transition-colors">
              Clear Cart
            </button>
            <Link to="/shop" className="text-sm text-blush-500 hover:text-blush-600 transition-colors">← Continue Shopping</Link>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl text-gray-700 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                {shipping === 0 ? <span className="text-green-500">FREE</span> : <span>₹{shipping}</span>}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 bg-cream-100 rounded-xl p-2">
                  🎁 Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for FREE shipping!
                </p>
              )}
            </div>
            <div className="border-t border-cream-200 pt-3 mb-5">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blush-500">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary py-3.5 text-base">
              Proceed to Checkout →
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <span>🔒</span><span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
