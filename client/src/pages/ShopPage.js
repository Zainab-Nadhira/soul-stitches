import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Loading';

const CATEGORIES = ['sweaters', 'scarves', 'bags', 'flowers', 'bouquets', 'plushies', 'keychains', 'coasters', 'accessories', 'mufflers'];

const ShopPage = () => {
  const { category: paramCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: paramCategory || searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    page: 1
  });

  useEffect(() => {
    if (paramCategory) setFilters(f => ({ ...f, category: paramCategory, page: 1 }));
  }, [paramCategory]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);
      if (filters.sort !== 'newest') params.set('sort', filters.sort);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      params.set('page', filters.page);
      params.set('limit', 12);
      if (searchParams.get('featured') === 'true') params.set('featured', 'true');
      if (searchParams.get('trending') === 'true') params.set('trending', 'true');

      const res = await axios.get(`/api/products?${params}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gray-700 capitalize">
          {filters.category ? `${filters.category} 🧶` : filters.search ? `Results for "${filters.search}"` : 'All Products ✨'}
        </h1>
        <p className="text-gray-400 mt-1">{total} products found</p>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          placeholder="Search crochet products..."
          className="input-field flex-1 max-w-md"
        />
        <button onClick={() => setFilterOpen(!filterOpen)} className="btn-secondary flex items-center gap-2">
          🎛️ Filters
        </button>
      </div>

      {/* Filters panel */}
      {filterOpen && (
        <div className="card p-6 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
            <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}
              className="input-field text-sm">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Sort By</label>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="input-field text-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Min Price (₹)</label>
            <input type="number" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)}
              placeholder="0" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Max Price (₹)</label>
            <input type="number" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)}
              placeholder="5000" className="input-field text-sm" />
          </div>
        </div>
      )}

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => updateFilter('category', '')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!filters.category ? 'bg-blush-300 text-white' : 'bg-cream-100 text-gray-600 hover:bg-blush-100'}`}>
          All
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => updateFilter('category', cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filters.category === cat ? 'bg-blush-300 text-white' : 'bg-cream-100 text-gray-600 hover:bg-blush-100'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🧶</div>
          <h3 className="font-display text-2xl text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${filters.page === i + 1 ? 'bg-blush-300 text-white shadow-soft' : 'bg-cream-100 text-gray-600 hover:bg-blush-100'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
