import React from 'react';
import { Product } from '../types';
import { DEFAULT_OFFER_PRODUCTS } from '../data/products';

interface LimitedTimeOffersProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const LimitedTimeOffers: React.FC<LimitedTimeOffersProps> = ({
  products,
  onAddToCart,
  onQuickView,
}) => {
  // 1. Get explicit custom offers from Supabase (Database products come first)
  const customOffers = products.filter((p) => p.isOffer && !p.id.startsWith('default-'));

  // 2. If fewer than 2 offers are in database, fill remaining slots with default fallbacks
  const customOfferIds = new Set(customOffers.map((p) => p.id));
  const fallbackOffers = DEFAULT_OFFER_PRODUCTS.filter((p) => !customOfferIds.has(p.id));

  // Exactly 2 cards always displayed (New products replace old defaults)
  const displayOffers = [...customOffers, ...fallbackOffers].slice(0, 2);

  return (
    <section id="offers" className="py-16 bg-[#fff8f6]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div
            className="text-white px-6 py-1 font-semibold text-xs uppercase mb-3 shadow-sm"
            style={{ backgroundColor: '#f14706', borderRadius: '40px 0px' }}
          >
            Exclusive Deals (Limited 2 Offers)
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#271813] uppercase tracking-tight">
            LIMITED TIME OFFERS
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md">
            Special handpicked seasonal deals with high performance and guaranteed quality.
          </p>
        </div>

        {/* 2 Offset Overlapping Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 max-w-5xl mx-auto">
          {displayOffers.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onQuickView(prod)}
              className="w-full flex flex-col sm:flex-row items-center relative my-2 cursor-pointer group"
            >
              {/* Product Image Frame */}
              <div className="w-full sm:w-3/5 aspect-square bg-[#ffe2da] rounded-2xl relative overflow-hidden p-4 lg:p-6 shadow-md border border-[#e5beb3]/40 flex items-center justify-center">
                <div className="absolute top-3 left-3 bg-[#f14706] text-white px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase z-10 shadow-sm">
                  {prod.discountPercentage ? `${prod.discountPercentage}% OFF` : 'Special Offer'}
                </div>
                {prod.category && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-semibold uppercase">
                    {prod.category}
                  </div>
                )}
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
                />
              </div>

              {/* Overlapping Info Card */}
              <div className="w-[92%] sm:w-1/2 bg-white p-5 lg:p-7 rounded-2xl shadow-xl -mt-6 sm:mt-0 sm:-ml-16 z-20 border border-[#e5beb3]/50 flex flex-col justify-between group-hover:border-[#f14706]/40 transition-colors">
                <div>
                  <div className="flex gap-0.5 sm:gap-1 mb-1.5">
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
                  <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-[#271813] uppercase mb-1 line-clamp-1 group-hover:text-[#ab2f00] transition-colors">
                    {prod.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-extrabold text-base lg:text-xl text-[#ab2f00]">
                      ₹{prod.price.toFixed(2)}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-gray-400 line-through text-xs lg:text-sm">
                        ₹{prod.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(prod);
                  }}
                  className="w-full py-2.5 border-2 border-[#f14706] text-[#271813] font-bold rounded-full hover:bg-[#f14706] hover:text-white transition-colors text-xs lg:text-sm cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
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
