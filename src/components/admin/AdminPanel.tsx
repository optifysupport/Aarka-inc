import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import {
  Package,
  Sparkles,
  Star,
  Plus,
  Search,
  Trash2,
  Edit,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { OffersManager } from './OffersManager';
import { BestSellersManager } from './BestSellersManager';
import { logoutAdmin } from '../../lib/supabase';

interface AdminPanelProps {
  products: Product[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onCloseAdmin: () => void;
  onLogout: () => void;
}

type AdminTab = 'catalog' | 'offers' | 'bestsellers';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onCloseAdmin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [placementFilter, setPlacementFilter] = useState<'ALL' | 'offers' | 'bestsellers' | 'onsale'>('ALL');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [defaultIsOfferForAdd, setDefaultIsOfferForAdd] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Only display user-added Supabase products in Admin (default fallbacks stay on store frontend)
  const customProducts = useMemo(
    () => products.filter((p) => !p.id.startsWith('default-')),
    [products]
  );

  // Metrics
  const activeOffersCount = useMemo(() => customProducts.filter((p) => p.isOffer).length, [customProducts]);
  const bestSellersCount = useMemo(() => customProducts.filter((p) => p.isBestSeller).length, [customProducts]);
  const categoriesList = useMemo(() => Array.from(new Set(customProducts.map((p) => p.category))), [customProducts]);

  // Filtered Products for Catalog Table
  const filteredProducts = useMemo(() => {
    return customProducts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }

      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }

      if (placementFilter === 'offers' && !p.isOffer) return false;
      if (placementFilter === 'bestsellers' && !p.isBestSeller) return false;
      if (placementFilter === 'onsale' && !p.onSale) return false;

      return true;
    });
  }, [customProducts, searchQuery, selectedCategory, placementFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setDefaultIsOfferForAdd(false);
    setIsFormModalOpen(true);
  };

  const handleOpenAddOffer = () => {
    setEditingProduct(null);
    setDefaultIsOfferForAdd(true);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setDefaultIsOfferForAdd(false);
    setIsFormModalOpen(true);
  };

  const handleSaveProduct = async (product: Product) => {
    await onSaveProduct(product);
    showToast(`Product "${product.name}" saved to Supabase!`);
  };

  const handleDeleteProduct = async (id: string) => {
    await onDeleteProduct(id);
    setDeleteConfirmId(null);
    showToast('Product deleted from Supabase.', 'success');
  };

  const handleToggleOffer = async (prod: Product) => {
    if (!prod.isOffer && activeOffersCount >= 2) {
      showToast('Cannot add offer: Maximum 2 offers active. Remove one first.', 'error');
      return;
    }
    const updated: Product = { ...prod, isOffer: !prod.isOffer };
    await onSaveProduct(updated);
    showToast(updated.isOffer ? 'Added to homepage Offers (Max 2)' : 'Removed from Offers');
  };

  const handleToggleBestSeller = async (prod: Product) => {
    const updated: Product = { ...prod, isBestSeller: !prod.isBestSeller };
    await onSaveProduct(updated);
    showToast(updated.isBestSeller ? 'Added to Best Sellers' : 'Removed from Best Sellers');
  };

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#271813] font-['Sora',sans-serif] pt-20 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white transition-all animate-bounce ${
            toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header / Nav Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-5 sm:p-6 rounded-3xl border border-[#e5beb3]/60 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ab2f00] to-[#f14706] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl sm:text-2xl text-[#271813] tracking-tight">
                Aarka Inc. Admin Panel
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
                Live Supabase Backend
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage custom catalog, dynamic offers & trending best sellers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#ab2f00] hover:bg-[#d63d00] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Store</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              onLogout();
            }}
            className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            title="Logout of Admin Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#e5beb3]/50 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#ab2f00] flex items-center justify-center font-extrabold text-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Custom Products in Supabase
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#271813]">
              {customProducts.length} Items
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5beb3]/50 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Active Offers
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#271813]">
              {activeOffersCount} / 2 Slots
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5beb3]/50 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-[#d63d00] flex items-center justify-center font-extrabold text-lg">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Best Sellers
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#271813]">
              {bestSellersCount} Items
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Catalog, Offers, Best Sellers) */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#e5beb3]/60 pb-3">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-[#ab2f00] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-[#fff1ed] border border-[#e5beb3]/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Product Catalog ({customProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-[#ab2f00] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-[#fff1ed] border border-[#e5beb3]/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Offers Manager ({activeOffersCount}/2)</span>
        </button>

        <button
          onClick={() => setActiveTab('bestsellers')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bestsellers'
              ? 'bg-[#ab2f00] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-[#fff1ed] border border-[#e5beb3]/60'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Best Sellers ({bestSellersCount})</span>
        </button>
      </div>

      {/* TAB CONTENT: Product Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search, Category Filter, and Placement Filter Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5beb3]/60 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search custom products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-xs font-medium focus:border-[#ab2f00] outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-xs font-bold text-[#271813] focus:border-[#ab2f00] outline-none cursor-pointer"
              >
                <option value="ALL">All Categories ({customProducts.length})</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({customProducts.filter((p) => p.category === cat).length})
                  </option>
                ))}
              </select>

              <select
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value as any)}
                className="px-3 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-xs font-bold text-[#271813] focus:border-[#ab2f00] outline-none cursor-pointer"
              >
                <option value="ALL">All Placements</option>
                <option value="offers">Offers Only ({activeOffersCount}/2)</option>
                <option value="bestsellers">Best Sellers Only ({bestSellersCount})</option>
                <option value="onsale">On Sale Items</option>
              </select>
            </div>
          </div>

          {/* Product Catalog Table */}
          <div className="bg-white rounded-3xl border border-[#e5beb3]/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fff8f6] border-b border-[#e5beb3]/60 text-gray-700 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4 text-center">Offers (Max 2)</th>
                    <th className="py-3.5 px-4 text-center">Best Seller</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5beb3]/40 font-medium">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="font-bold text-sm">No custom products in Supabase yet</p>
                        <p className="text-xs mt-0.5">Click "Add Product" above to create your first product.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#fff8f6]/60 transition-colors">
                        {/* Image & Title */}
                        <td className="py-3 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#ffe2da]/60 rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-[#e5beb3]/50">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="max-h-full max-w-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div>
                              <span className="font-extrabold text-xs sm:text-sm text-[#271813] block line-clamp-1">
                                {prod.name}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                ID: {prod.id} &bull; Rating: {prod.rating}★
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#fff1ed] text-[#ab2f00] font-bold text-[10px] uppercase border border-[#ab2f00]/20">
                            {prod.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-xs sm:text-sm text-[#ab2f00]">
                            ₹{prod.price.toFixed(2)}
                          </div>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through block">
                              ₹{prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Offer Toggle (Max 2) */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleOffer(prod)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              prod.isOffer
                                ? 'bg-[#ab2f00] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={
                              prod.isOffer
                                ? 'Click to remove from homepage offers'
                                : activeOffersCount >= 2
                                ? 'Offer slots full (2/2). Remove an offer first.'
                                : 'Set as one of 2 homepage offers'
                            }
                          >
                            {prod.isOffer ? 'Active Offer' : '+ Set Offer'}
                          </button>
                        </td>

                        {/* Best Seller Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleBestSeller(prod)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              prod.isBestSeller
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {prod.isBestSeller ? 'Best Seller' : '+ Trending'}
                          </button>
                        </td>

                        {/* In Stock & Badges */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.inStock !== false
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 text-gray-600 hover:text-[#ab2f00] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(prod.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Offers Manager */}
      {activeTab === 'offers' && (
        <OffersManager
          products={customProducts}
          onToggleOffer={handleToggleOffer}
          onEditProduct={handleOpenEdit}
          onOpenAddOffer={handleOpenAddOffer}
        />
      )}

      {/* TAB CONTENT: Best Sellers Manager */}
      {activeTab === 'bestsellers' && (
        <BestSellersManager
          products={customProducts}
          onToggleBestSeller={handleToggleBestSeller}
          onEditProduct={handleOpenEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border border-[#e5beb3]/60 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">Delete Product?</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to delete this product? It will be permanently removed from Supabase.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold uppercase shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isFormModalOpen && (
        <ProductFormModal
          isOpen={isFormModalOpen}
          product={editingProduct}
          existingOffersCount={activeOffersCount}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveProduct}
          existingCategories={categoriesList}
          defaultIsOffer={defaultIsOfferForAdd}
        />
      )}
    </div>
  );
};
