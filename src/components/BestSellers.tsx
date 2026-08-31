import React from 'react';
import { Product } from '../types';
import { Sparkles } from 'lucide-react';

interface BestSellersProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  onAddToCart,
  onQuickView,
}) => {
  // Only display products marked as Best Seller from live database
  const displayBestSellers = products.filter((p) => p.isBestSeller);

  if (displayBestSellers.length === 0) {
    return null;
  }

  return (
    <section id="best-sellers" className="py-16 bg-[#fff8f6]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        {/* Header with Trending Now badge and horizontal rule lines */}
        <div className="flex flex-col items-center mb-12 relative text-center">
          <div
            className="text-white px-6 py-1 font-semibold text-xs uppercase mb-3 shadow-sm inline-flex items-center gap-1.5"
            style={{ backgroundColor: '#f14706', borderRadius: '40px 0px' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trending Now ({displayBestSellers.length} Items)</span>
          </div>
          <div className="w-full flex items-center gap-2 sm:gap-4">
            <div className="flex-1 h-[2px] bg-[#f14706]/80"></div>
            <h2 className="font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#271813] uppercase tracking-tight px-1 sm:px-2 whitespace-nowrap">
              BEST SELLERS
            </h2>
            <div className="flex-1 h-[2px] bg-[#f14706]/80"></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg">
            Top industrial modules, modern lighting, energy-efficient fans, and precision sensors trusted by technicians.
          </p>
        </div>

        {/* Product Grid - Supports any number of cards (Database items first + defaults) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayBestSellers.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onQuickView(prod)}
              className="bg-white rounded-2xl overflow-hidden border border-[#e5beb3]/40 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1"
            >
              {/* Product Image Box */}
              <div className="aspect-square bg-[#f9f5f4] p-4 sm:p-6 relative flex items-center justify-center overflow-hidden">
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  {prod.onSale && (
                    <span className="bg-[#f14706] text-white px-2 py-0.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase shadow-sm">
                      On Sale
                    </span>
                  )}
                  {prod.isNew && (
                    <span className="bg-[#ab2f00] text-white px-2 py-0.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase shadow-sm">
                      New
                    </span>
                  )}
                </div>

                <span className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[9px] font-semibold uppercase">
                  {prod.category}
                </span>

                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex gap-0.5 sm:gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-[10px] sm:text-xs ${
                          i < prod.rating ? 'text-[#f14706] fill-1' : 'text-gray-300'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-[#271813] uppercase line-clamp-1 group-hover:text-[#ab2f00] transition-colors">
                    {prod.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="font-extrabold text-sm sm:text-base text-[#ab2f00]">
                      ₹{prod.price.toFixed(2)}
                    </p>
                    {prod.originalPrice && (
                      <p className="text-[11px] sm:text-xs text-gray-400 line-through">
                        ₹{prod.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(prod);
                  }}
                  className="w-full py-2 border border-[#f14706] text-[#f14706] font-bold rounded-full hover:bg-[#f14706] hover:text-white transition-colors text-xs cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 mt-1"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
