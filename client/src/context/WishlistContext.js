import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_wishlist')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ss_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.filter(i => i._id !== product._id);
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlist.some(i => i._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
