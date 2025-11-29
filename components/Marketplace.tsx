
import React, { useState, useMemo, useEffect } from 'react';
import { AppProduct } from '../types';
import { AppCard } from './AppCard';
import { Search, ChevronLeft, ChevronRight } from './Icons';
import { ProductDetailModal } from './ProductDetailModal';

interface MarketplaceProps {
  products: AppProduct[];
  onAddToCart: (product: AppProduct) => void;
  featured?: boolean;
  onSave?: (product: AppProduct) => void;
  savedIds?: string[];
}

const ITEMS_PER_PAGE = 12;

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  products, 
  onAddToCart, 
  featured = false,
  onSave,
  savedIds = []
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<AppProduct | null>(null);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const allCategories = products.map(p => p.category);
    return Array.from(new Set(allCategories)).sort();
  }, [products]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, sortBy]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchText.toLowerCase()) || 
        p.description.toLowerCase().includes(searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => {
          const getAvg = (p: AppProduct) => p.reviews?.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
          return getAvg(b) - getAvg(a);
        });
        break;
      case 'newest':
      default:
        // Default order (assuming input array is somewhat chronological or ranked)
        break;
    }
    return result;
  }, [products, searchText, selectedCategory, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = featured 
    ? filteredAndSortedProducts // Featured usually limits itself via props (e.g. products.slice(0,3))
    : filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      {!featured && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search apps, tags..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
             {/* Category Filter */}
             <div className="relative w-full md:w-auto">
               <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full md:w-48 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-10 transition-colors ${
                    selectedCategory 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-medium' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                  }`}
               >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
               </select>
               <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${selectedCategory ? 'text-indigo-500' : 'text-slate-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="m6 9 6 6 6-6"/>
                 </svg>
               </div>
             </div>

             {/* Sort Dropdown */}
             <div className="relative w-full md:w-auto">
               <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full md:w-48 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-10 transition-colors ${
                    sortBy !== 'newest'
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                  }`}
               >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
               </select>
               <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${sortBy !== 'newest' ? 'text-indigo-500' : 'text-slate-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="m6 9 6 6 6-6"/>
                 </svg>
               </div>
             </div>
          </div>
        </div>
      )}

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
             <Search className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">No apps found matching your criteria.</p>
          <button 
            onClick={() => { setSearchText(''); setSelectedCategory(''); setSortBy('newest'); }}
            className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map(product => (
              <AppCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                onSave={onSave}
                isSaved={savedIds.includes(product.id)}
                onClick={setSelectedProduct}
              />
            ))}
          </div>

          {!featured && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedProducts.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredAndSortedProducts.length}</span> results
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          onSave={onSave}
          isSaved={savedIds.includes(selectedProduct.id)}
        />
      )}
    </div>
  );
};
    