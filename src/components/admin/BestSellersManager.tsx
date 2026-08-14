import React, { useState } from 'react';
import { Product } from '../../types';
import { Star, Search, Package } from 'lucide-react';

interface BestSellersManagerProps {
  products: Product[];
  onToggleBestSeller: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export const BestSellersManager: React.FC<BestSellersManagerProps> = ({
  products,
  onToggleBestSeller,
  onEditProduct,
}) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'ALL' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products to toggle Best Seller status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5beb3] rounded-xl text-xs font-medium focus:border-[#ab2f00] outline-none"
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-[#e5beb3] rounded-xl text-xs font-bold text-[#271813] focus:border-[#ab2f00] outline-none cursor-pointer"
        >
          <option value="ALL">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c} ({products.filter((p) => p.category === c).length})
            </option>
          ))}
        </select>
      </div>

      {/* Grid with Instant Toggles */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-[#e5beb3]/60 shadow-xs">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="font-bold text-sm text-gray-700">No products available</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Add products to your catalog to assign them as Best Sellers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                prod.isBestSeller
                  ? 'border-[#ab2f00] shadow-md ring-1 ring-[#ab2f00]/30'
                  : 'border-[#e5beb3]/50 shadow-xs hover:border-[#ab2f00]/40'
              }`}
            >
              <div>
                <div className="aspect-square bg-[#fff8f6] rounded-xl p-3 mb-3 flex items-center justify-center relative border border-[#e5beb3]/40">
                  {prod.isBestSeller && (
                    <span className="absolute top-2 left-2 bg-[#ab2f00] text-white px-2 py-0.5 rounded-md font-bold text-[9px] uppercase shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Best Seller</span>
                    </span>
                  )}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>

                <span className="text-[10px] font-bold text-[#ab2f00] uppercase block">
                  {prod.category}
                </span>
                <h5 className="font-extrabold text-xs sm:text-sm text-[#271813] line-clamp-1 mt-0.5">
                  {prod.name}
                </h5>
                <p className="font-extrabold text-xs sm:text-sm text-[#ab2f00] mt-1">
                  ₹{prod.price.toFixed(2)}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e5beb3]/40 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onEditProduct(prod)}
                  className="text-[11px] font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onToggleBestSeller(prod)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    prod.isBestSeller
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-[#ab2f00] text-white hover:bg-[#d63d00] shadow-sm'
                  }`}
                >
                  {prod.isBestSeller ? (
                    <span>Remove</span>
                  ) : (
                    <>
                      <Star className="w-3 h-3" />
                      <span>Set Best Seller</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
