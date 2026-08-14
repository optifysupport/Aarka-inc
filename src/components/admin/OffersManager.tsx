import React from 'react';
import { Product } from '../../types';
import { Plus, Trash2, Edit, Info } from 'lucide-react';

interface OffersManagerProps {
  products: Product[]; // only Supabase / user products
  onToggleOffer: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onOpenAddOffer: () => void;
}

export const OffersManager: React.FC<OffersManagerProps> = ({
  products,
  onToggleOffer,
  onEditProduct,
  onOpenAddOffer,
}) => {
  // Only user/database offers (excluding default fallbacks)
  const dbOffers = products.filter((p) => p.isOffer && !p.id.startsWith('default-'));

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider">
          Active Offers ({dbOffers.length}/2 Slots)
        </h3>

        {dbOffers.length < 2 && (
          <button
            type="button"
            onClick={onOpenAddOffer}
            className="px-4 py-2 bg-[#ab2f00] hover:bg-[#d63d00] text-white text-xs font-extrabold rounded-xl uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Offer Product</span>
          </button>
        )}
      </div>

      {/* 2 Offer Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slot 1 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e5beb3]/60 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#ab2f00]">
                Offer Slot #1
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  dbOffers[0]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {dbOffers[0] ? 'Custom Product' : 'Default Fallback Active'}
              </span>
            </div>

            {dbOffers[0] ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#ffe2da] rounded-2xl p-2 shrink-0 flex items-center justify-center border border-[#e5beb3]/50">
                  <img
                    src={dbOffers[0].image}
                    alt={dbOffers[0].name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#ab2f00] uppercase block">
                    {dbOffers[0].category}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#271813] line-clamp-1">
                    {dbOffers[0].name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-base text-[#ab2f00]">
                      ₹{dbOffers[0].price.toFixed(2)}
                    </span>
                    {dbOffers[0].originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{dbOffers[0].originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#fff8f6] rounded-2xl border border-dashed border-[#e5beb3] text-center text-gray-500">
                <Info className="w-5 h-5 text-[#ab2f00] mx-auto mb-1 opacity-70" />
                <p className="text-xs font-bold text-gray-700">Slot 1 is using Default Fallback</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Adding a custom offer will replace the default product.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#e5beb3]/40 flex items-center justify-end gap-2">
            {dbOffers[0] ? (
              <>
                <button
                  type="button"
                  onClick={() => onEditProduct(dbOffers[0])}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleOffer(dbOffers[0])}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Offer</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenAddOffer}
                className="px-4 py-2 bg-[#ab2f00] text-white rounded-xl text-xs font-bold hover:bg-[#d63d00] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Product to Slot 1</span>
              </button>
            )}
          </div>
        </div>

        {/* Slot 2 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e5beb3]/60 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#ab2f00]">
                Offer Slot #2
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  dbOffers[1]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {dbOffers[1] ? 'Custom Product' : 'Default Fallback Active'}
              </span>
            </div>

            {dbOffers[1] ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#ffe2da] rounded-2xl p-2 shrink-0 flex items-center justify-center border border-[#e5beb3]/50">
                  <img
                    src={dbOffers[1].image}
                    alt={dbOffers[1].name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#ab2f00] uppercase block">
                    {dbOffers[1].category}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#271813] line-clamp-1">
                    {dbOffers[1].name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-base text-[#ab2f00]">
                      ₹{dbOffers[1].price.toFixed(2)}
                    </span>
                    {dbOffers[1].originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{dbOffers[1].originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#fff8f6] rounded-2xl border border-dashed border-[#e5beb3] text-center text-gray-500">
                <Info className="w-5 h-5 text-[#ab2f00] mx-auto mb-1 opacity-70" />
                <p className="text-xs font-bold text-gray-700">Slot 2 is using Default Fallback</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Adding a custom offer will replace the default product.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#e5beb3]/40 flex items-center justify-end gap-2">
            {dbOffers[1] ? (
              <>
                <button
                  type="button"
                  onClick={() => onEditProduct(dbOffers[1])}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleOffer(dbOffers[1])}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Offer</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenAddOffer}
                className="px-4 py-2 bg-[#ab2f00] text-white rounded-xl text-xs font-bold hover:bg-[#d63d00] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Product to Slot 2</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
