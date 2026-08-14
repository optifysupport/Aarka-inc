import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ShoppingBag, X, SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  initialCategory?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  onAddToCart,
  onQuickView,
  initialCategory,
  searchQuery = '',
  setSearchQuery,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [appliedPriceRange, setAppliedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'newest'>('featured');

  // Mobile Filter Modal State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>(selectedCategories);
  const [tempMinPrice, setTempMinPrice] = useState<string>(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPrice);

  // Dynamically extract categories from all current products
  const categories = useMemo(() => {
    const baseCategories = ['Lighting', 'Fans', 'Relay Modules', 'Generators', 'Sensors', 'Meters'];
    const productCategories = products.map((p) => p.category).filter(Boolean);
    const combined = Array.from(new Set([...baseCategories, ...productCategories]));
    return combined;
  }, [products]);

  const handleOpenMobileFilter = () => {
    setTempSelectedCategories(selectedCategories);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setIsMobileFilterOpen(true);
  };

  const handleApplyMobileFilters = () => {
    setSelectedCategories(tempSelectedCategories);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    const min = parseFloat(tempMinPrice) || 0;
    const max = parseFloat(tempMaxPrice) || Infinity;
    if (tempMinPrice !== '' || tempMaxPrice !== '') {
      setAppliedPriceRange({ min, max });
    } else {
      setAppliedPriceRange(null);
    }
    setIsMobileFilterOpen(false);
  };

  const handleResetMobileFilters = () => {
    setTempSelectedCategories([]);
    setTempMinPrice('');
    setTempMaxPrice('');
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const removeCategory = (cat: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== cat));
  };

  const handleApplyPrice = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    if (minPrice !== '' || maxPrice !== '') {
      setAppliedPriceRange({ min, max });
    } else {
      setAppliedPriceRange(null);
    }
  };

  const activeFilterCount = selectedCategories.length + (appliedPriceRange ? 1 : 0);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (p.name || '').toLowerCase().includes(q);
          const matchCat = (p.category || '').toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Category Filter
        if (selectedCategories.length > 0) {
          if (!selectedCategories.includes(p.category)) return false;
        }

        // Price Filter
        if (appliedPriceRange) {
          if (p.price < appliedPriceRange.min || p.price > appliedPriceRange.max) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price - b.price;
        if (sortBy === 'high-low') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // featured default
      });
  }, [products, searchQuery, selectedCategories, appliedPriceRange, sortBy]);

  return (
    <div className="pt-[110px] pb-20 px-4 md:px-16 max-w-[1440px] mx-auto min-h-screen">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#271813] mb-2 tracking-tight">
              Shop Electrical Gear
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Explore our full inventory of {products.length} products: modern lighting, high-speed fans, relay modules, generators, meters, and industrial sensors.
            </p>
          </div>
          <div className="text-xs font-bold text-[#ab2f00] bg-[#ab2f00]/10 px-3.5 py-1.5 rounded-full border border-[#ab2f00]/30 self-start md:self-auto">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="glass-panel p-6 rounded-2xl sticky top-[110px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#271813] uppercase tracking-wider">
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setAppliedPriceRange(null);
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="text-[11px] font-bold text-[#ab2f00] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Checkboxes */}
            <div className="mb-6">
              <h4 className="font-semibold text-xs text-gray-700 mb-3 uppercase tracking-wider">
                Categories ({categories.length})
              </h4>
              <ul className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                {categories.map((cat) => {
                  const checked = selectedCategories.includes(cat);
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <li key={cat}>
                      <label className="flex items-center justify-between gap-3 cursor-pointer group select-none">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(cat)}
                            className="w-4 h-4 rounded border-[#e5beb3] text-[#ab2f00] focus:ring-[#ab2f00] cursor-pointer"
                          />
                          <span
                            className={`text-sm transition-colors ${
                              checked
                                ? 'font-bold text-[#ab2f00]'
                                : 'text-gray-700 group-hover:text-[#ab2f00]'
                            }`}
                          >
                            {cat}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-semibold">
                          ({count})
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-full h-px bg-[#e5beb3]/40 my-6"></div>

            {/* Price Range Filter */}
            <div>
              <h4 className="font-semibold text-xs text-gray-700 mb-3 uppercase tracking-wider">
                Price Range (₹)
              </h4>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#e5beb3] rounded-lg text-sm text-[#271813] focus:border-[#ab2f00] outline-none"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#e5beb3] rounded-lg text-sm text-[#271813] focus:border-[#ab2f00] outline-none"
                />
              </div>
              <button
                onClick={handleApplyPrice}
                className="w-full py-2 bg-[#ab2f00]/10 text-[#ab2f00] border border-[#ab2f00]/30 rounded-lg text-xs font-bold hover:bg-[#ab2f00] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Apply Price Filter
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Mobile Filter & Sort Bar (lg:hidden) */}
          <div className="lg:hidden flex items-center justify-between gap-3 mb-4 bg-white/80 p-3 rounded-xl border border-[#e5beb3]/40 shadow-sm">
            <button
              onClick={handleOpenMobileFilter}
              className="flex items-center gap-2 px-4 py-2 bg-[#ab2f00] text-white rounded-lg text-xs font-bold shadow-sm hover:bg-[#d63d00] transition-colors cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#ab2f00] font-extrabold text-[10px] flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-lg bg-white border border-[#e5beb3] text-[#271813] flex items-center justify-center shadow-sm" title="Sort options">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#ab2f00]" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#e5beb3] rounded-lg py-1.5 px-2.5 text-xs font-semibold text-[#271813] focus:border-[#ab2f00] outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills (Mobile view below row) */}
          {activeFilterCount > 0 && (
            <div className="lg:hidden flex flex-wrap items-center gap-2 mb-4">
              {selectedCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center gap-1.5 bg-[#ab2f00]/10 text-[#ab2f00] px-2.5 py-1 rounded-full border border-[#ab2f00]/30 text-xs font-semibold"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => removeCategory(cat)}
                    className="hover:text-[#d63d00] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {appliedPriceRange && (
                <div className="flex items-center gap-1.5 bg-[#ab2f00]/10 text-[#ab2f00] px-2.5 py-1 rounded-full border border-[#ab2f00]/30 text-xs font-semibold">
                  <span>
                    ₹{appliedPriceRange.min} - ₹{appliedPriceRange.max === Infinity ? 'Max' : appliedPriceRange.max}
                  </span>
                  <button
                    onClick={() => setAppliedPriceRange(null)}
                    className="hover:text-[#d63d00] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Desktop Filter Pills & Sort Bar (hidden on lg:hidden) */}
          <div className="hidden lg:flex flex-wrap justify-between items-center mb-6 gap-4 bg-white/60 p-4 rounded-xl border border-[#e5beb3]/30 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategories.length === 0 && !appliedPriceRange && (
                <span className="text-xs text-gray-500 italic">Showing All Products</span>
              )}
              {selectedCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center gap-1.5 bg-[#ab2f00]/10 text-[#ab2f00] px-3 py-1 rounded-full border border-[#ab2f00]/30 text-xs font-semibold"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => removeCategory(cat)}
                    className="hover:text-[#d63d00] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {appliedPriceRange && (
                <div className="flex items-center gap-1.5 bg-[#ab2f00]/10 text-[#ab2f00] px-3 py-1 rounded-full border border-[#ab2f00]/30 text-xs font-semibold">
                  <span>
                    ₹{appliedPriceRange.min} - ₹{appliedPriceRange.max === Infinity ? 'Max' : appliedPriceRange.max}
                  </span>
                  <button
                    onClick={() => setAppliedPriceRange(null)}
                    className="hover:text-[#d63d00] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#e5beb3] rounded-lg py-1.5 px-3 text-xs font-semibold text-[#271813] focus:border-[#ab2f00] outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid Products */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e5beb3]/40 shadow-sm my-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No products match your criteria</h3>
              <p className="text-sm text-gray-500 mt-1">
                Try clearing your filters or changing search keywords to discover more items.
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setAppliedPriceRange(null);
                  if (setSearchQuery) setSearchQuery('');
                }}
                className="mt-4 px-6 py-2.5 bg-[#ab2f00] text-white font-bold rounded-xl text-xs uppercase cursor-pointer hover:bg-[#d63d00] shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((prod) => {
                return (
                  <div
                    key={prod.id}
                    onClick={() => onQuickView(prod)}
                    className="glass-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col relative group cursor-pointer border border-[#e5beb3]/40 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
                      {prod.isNew && (
                        <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-[#ab2f00] text-white font-bold text-[9px] sm:text-[10px] rounded shadow-sm uppercase">
                          NEW
                        </span>
                      )}
                      {prod.discountPercentage && (
                        <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-[#a23e1f] text-white font-bold text-[9px] sm:text-[10px] rounded shadow-sm uppercase">
                          {prod.discountPercentage}% OFF
                        </span>
                      )}
                      {prod.isOffer && (
                        <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-[#f14706] text-white font-bold text-[9px] sm:text-[10px] rounded shadow-sm uppercase">
                          OFFER
                        </span>
                      )}
                    </div>

                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/40 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[9px] font-semibold uppercase z-10">
                      {prod.category}
                    </span>

                    {/* Image Area */}
                    <div className="aspect-square bg-[#fff1ed] relative overflow-hidden flex items-center justify-center p-3 sm:p-6">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent"></div>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="object-contain w-full h-full mix-blend-multiply drop-shadow-md group-hover:scale-108 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-0.5 sm:gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`material-symbols-outlined text-[8px] sm:text-[10px] ${
                                i < prod.rating ? 'text-[#ab2f00] fill-1' : 'text-gray-300'
                              }`}
                            >
                              star
                            </span>
                          ))}
                        </div>

                        <h3 className="font-extrabold text-xs sm:text-base text-[#271813] mb-1 leading-tight line-clamp-1 group-hover:text-[#ab2f00] transition-colors">
                          {prod.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#e5beb3]/30 mt-auto">
                        <div>
                          <span className="font-extrabold text-sm sm:text-lg text-[#ab2f00]">
                            ₹{prod.price.toFixed(2)}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through block">
                              ₹{prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(prod);
                          }}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ab2f00] text-white flex items-center justify-center hover:bg-[#d63d00] hover:scale-105 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[16px] sm:text-[20px]">
                            add_shopping_cart
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop Click Listener */}
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col border border-[#e5beb3]/40">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#e5beb3]/40 bg-[#fff8f6]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#ab2f00]" />
                <h3 className="font-extrabold text-base sm:text-lg text-[#271813]">Filter Options</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-gray-500 hover:text-[#ab2f00] flex items-center justify-center border border-[#e5beb3]/40 shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Category Section */}
              <div>
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat) => {
                    const checked = tempSelectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          if (checked) {
                            setTempSelectedCategories(tempSelectedCategories.filter((c) => c !== cat));
                          } else {
                            setTempSelectedCategories([...tempSelectedCategories, cat]);
                          }
                        }}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                          checked
                            ? 'bg-[#ab2f00] text-white border-[#ab2f00] shadow-sm'
                            : 'bg-[#fff8f6] text-gray-700 border-[#e5beb3]/60 hover:border-[#ab2f00]'
                        }`}
                      >
                        <span>{cat}</span>
                        {checked && <X className="w-3.5 h-3.5 ml-1 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full h-px bg-[#e5beb3]/40" />

              {/* Price Range Section */}
              <div>
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-3">
                  Price Range (₹)
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-sm text-[#271813] focus:border-[#ab2f00] outline-none"
                    />
                  </div>
                  <span className="text-gray-400 font-bold mt-4">-</span>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-sm text-[#271813] focus:border-[#ab2f00] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Apply Button */}
            <div className="p-4 border-t border-[#e5beb3]/40 bg-[#fff8f6] flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetMobileFilters}
                className="px-4 py-3 border border-[#e5beb3] text-gray-600 rounded-xl font-bold text-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleApplyMobileFilters}
                className="flex-1 py-3 bg-[#ab2f00] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#d63d00] transition-colors cursor-pointer shadow-md text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
