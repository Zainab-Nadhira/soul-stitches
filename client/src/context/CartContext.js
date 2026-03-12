import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ss_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, color = '', size = '') => {
    setCart(prev => {
      const key = `${product._id}-${color}-${size}`;
      const existing = prev.find(i => `${i._id}-${i.selectedColor}-${i.selectedSize}` === key);
      if (existing) {
        return prev.map(i => `${i._id}-${i.selectedColor}-${i.selectedSize}` === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (id, color, size) => {
    setCart(prev => prev.filter(i => !(i._id === id && i.selectedColor === color && i.selectedSize === size)));
  };

  const updateQuantity = (id, color, size, quantity) => {
    if (quantity < 1) return removeFromCart(id, color, size);
    setCart(prev => prev.map(i => i._id === id && i.selectedColor === color && i.selectedSize === size ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
