import React from 'react';

export const ProductSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-square bg-cream-200" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-20 rounded-full" />
      <div className="skeleton h-4 w-full rounded-full" />
      <div className="skeleton h-4 w-3/4 rounded-full" />
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton h-10 w-full rounded-2xl" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="text-5xl animate-bounce-soft mb-4">🧶</div>
      <p className="text-blush-400 font-script text-xl">Loading with love...</p>
    </div>
  </div>
);

export default ProductSkeleton;
