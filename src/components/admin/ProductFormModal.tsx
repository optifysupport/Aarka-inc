import React, { useState } from 'react';
import { Product } from '../../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  Star,
  ShoppingBag,
  Percent,
  Tag,
  FileText,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { uploadProductImage } from '../../lib/supabase';

interface ProductFormModalProps {
  product: Product | null;
  existingOffersCount: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  existingCategories: string[];
  defaultIsOffer?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  existingOffersCount,
  isOpen,
  onClose,
  onSave,
  existingCategories,
  defaultIsOffer = false,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'Lighting');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : '');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice != null ? String(product.originalPrice) : '');
  const [rating, setRating] = useState(product?.rating || 5);
  const [image, setImage] = useState(product?.image || '');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [description, setDescription] = useState(product?.description || '');

  // Placement 3-option state: 'offers' | 'bestseller' | 'shop'
  const initialPlacement: 'offers' | 'bestseller' | 'shop' = product?.isOffer
    ? 'offers'
    : product?.isBestSeller
    ? 'bestseller'
    : defaultIsOffer
    ? 'offers'
    : 'shop';

  const [placement, setPlacement] = useState<'offers' | 'bestseller' | 'shop'>(initialPlacement);

  const [onSale, setOnSale] = useState(Boolean(product?.onSale));
  const [isNew, setIsNew] = useState(Boolean(product?.isNew));
  const [discountPercentage, setDiscountPercentage] = useState(
    product?.discountPercentage != null ? String(product.discountPercentage) : ''
  );
  const [inStock, setInStock] = useState(product?.inStock !== false);

  // Specifications key-value pairs
  const [specsList, setSpecsList] = useState<Array<{ key: string; value: string }>>(() => {
    if (product?.specs && typeof product.specs === 'object') {
      return Object.entries(product.specs).map(([key, value]) => ({ key, value }));
    }
    return [
      { key: 'Voltage', value: '220-240V' },
      { key: 'Warranty', value: '1 Year' },
    ];
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Auto calculate discount percentage when price or originalPrice changes
  const autoCalculateDiscount = (sellingStr: string, originalStr: string) => {
    const sp = parseFloat(sellingStr);
    const op = parseFloat(originalStr);
    if (!isNaN(sp) && !isNaN(op) && op > sp && op > 0) {
      const calculatedPct = Math.round(((op - sp) / op) * 100);
      setDiscountPercentage(String(calculatedPct));
      setOnSale(true);
    } else if (!isNaN(sp) && !isNaN(op) && op <= sp) {
      setDiscountPercentage('');
      setOnSale(false);
    }
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    autoCalculateDiscount(val, originalPrice);
  };

  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    autoCalculateDiscount(price, val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage('');
    try {
      const result = await uploadProductImage(file);
      if (result.url) {
        setImage(result.url);
      } else if (result.error) {
        setErrorMessage(`Image upload warning: ${result.error}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSpec = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', text: string) => {
    const updated = [...specsList];
    updated[index][field] = text;
    setSpecsList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }

    const finalPrice = parseFloat(price);
    if (isNaN(finalPrice) || finalPrice < 0) {
      setErrorMessage('Please enter a valid price in ₹.');
      return;
    }

    if (!image.trim()) {
      setErrorMessage('Please upload a product image or provide an image URL.');
      return;
    }

    const isOfferSelected = placement === 'offers';
    const isBestSellerSelected = placement === 'bestseller';

    // Check Offers limit constraint (Max 2 cards)
    const isAddingNewOffer = isOfferSelected && (!product || !product.isOffer);
    if (isAddingNewOffer && existingOffersCount >= 2) {
      setErrorMessage('Offers section limit reached (Maximum 2 offers). Please remove an existing offer first.');
      return;
    }

    const finalCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : category;

    // Convert specs array back to Record
    const finalSpecs: Record<string, string> = {};
    specsList.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        finalSpecs[key.trim()] = value.trim();
      }
    });

    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const parsedDiscount = discountPercentage ? parseFloat(discountPercentage) : undefined;

    const updatedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      price: finalPrice,
      originalPrice: parsedOriginalPrice,
      rating,
      image: image.trim(),
      description: description.trim(),
      isOffer: isOfferSelected,
      isBestSeller: isBestSellerSelected,
      onSale: onSale || Boolean(parsedDiscount),
      isNew,
      discountPercentage: parsedDiscount,
      specs: Object.keys(finalSpecs).length > 0 ? finalSpecs : undefined,
      inStock,
      created_at: product?.created_at || new Date().toISOString(),
    };

    setSaving(true);
    try {
      await onSave(updatedProduct);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const allCategories = Array.from(
    new Set([
      'Lighting',
      'Fans',
      'Relay Modules',
      'Generators',
      'Sensors',
      'Meters',
      'Motors',
      'Switches',
      'Wires & Cables',
      'Appliances',
      ...existingCategories,
    ])
  );

  const calculatedSavings =
    price && originalPrice && parseFloat(originalPrice) > parseFloat(price)
      ? (parseFloat(originalPrice) - parseFloat(price)).toFixed(2)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Backdrop listener */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#fffdfc] rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#e5beb3]/60 max-h-[92vh] flex flex-col font-['Sora',sans-serif]">
        {/* Top Header Bar */}
        <div className="px-6 py-5 bg-white border-b border-[#e5beb3]/50 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ab2f00] to-[#f14706] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#271813] tracking-tight">
                {isEditing ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <p className="text-xs text-gray-500">
                Configure pricing, upload media, set specifications & select section placement
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#fff8f6] text-gray-500 hover:text-[#ab2f00] hover:bg-[#ffece6] flex items-center justify-center border border-[#e5beb3]/60 shadow-xs transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body with Clean Formatted Sections */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-center gap-3 text-xs font-semibold text-red-700 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: General Product Information */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5beb3]/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e5beb3]/40">
              <FileText className="w-4 h-4 text-[#ab2f00]" />
              <h4 className="font-extrabold text-xs text-[#271813] uppercase tracking-wider">
                1. General Information
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Product Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1200mm Silent BLDC Ceiling Fan with LED"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-xs sm:text-sm text-[#271813] font-semibold focus:border-[#ab2f00] focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                {!isCustomCat ? (
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCat(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-xs sm:text-sm text-[#271813] font-bold focus:border-[#ab2f00] focus:bg-white outline-none cursor-pointer transition-all"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-xs font-bold text-[#271813] focus:border-[#ab2f00] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCat(false)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Stars Selector */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Customer Rating (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-1.5 bg-[#fff8f6] p-1.5 px-3 rounded-xl border border-[#e5beb3]">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    title={`${starVal} Stars`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        starVal <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-gray-700 ml-1.5">{rating}.0</span>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Auto Discount */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5beb3]/60 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5beb3]/40">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#ab2f00]" />
                <h4 className="font-extrabold text-xs text-[#271813] uppercase tracking-wider">
                  2. Pricing & Auto-Calculated Discount
                </h4>
              </div>

              {discountPercentage && (
                <div className="self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{discountPercentage}% Discount Applied</span>
                  {calculatedSavings && <span className="font-normal">(Save ₹{calculatedSavings})</span>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="45.00"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-sm text-[#271813] font-black focus:border-[#ab2f00] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Original Price / MRP (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="60.00"
                    value={originalPrice}
                    onChange={(e) => handleOriginalPriceChange(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-sm text-[#271813] font-semibold focus:border-[#ab2f00] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Discount % */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Discount (%) <span className="text-gray-400 font-normal">(Auto calculated)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={discountPercentage}
                    onChange={(e) => {
                      setDiscountPercentage(e.target.value);
                      if (e.target.value && Number(e.target.value) > 0) {
                        setOnSale(true);
                      }
                    }}
                    className="w-full px-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-sm text-[#271813] font-black text-emerald-700 focus:border-[#ab2f00] focus:bg-white outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-emerald-600 text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Image */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5beb3]/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5beb3]/40">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#ab2f00]" />
                <h4 className="font-extrabold text-xs text-[#271813] uppercase tracking-wider">
                  3. Product Image <span className="text-red-500">*</span>
                </h4>
              </div>

              <div className="flex gap-1 bg-[#fff8f6] p-1 rounded-xl border border-[#e5beb3]">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                    imageTab === 'upload'
                      ? 'bg-[#ab2f00] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                    imageTab === 'url'
                      ? 'bg-[#ab2f00] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              {/* Image Preview Box */}
              <div className="w-full aspect-square bg-[#fff8f6] border-2 border-dashed border-[#e5beb3] rounded-3xl flex items-center justify-center p-3 relative overflow-hidden shadow-inner">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                    <span className="text-[10px] font-bold">No preview</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Uploading...</span>
                  </div>
                )}
              </div>

              {/* Upload Input / URL Box */}
              <div className="sm:col-span-3">
                {imageTab === 'upload' ? (
                  <div className="border border-[#e5beb3] rounded-3xl p-6 bg-[#fff8f6] text-center hover:border-[#ab2f00]/40 transition-colors">
                    <input
                      type="file"
                      id="product-file-upload-modal"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-file-upload-modal"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#271813] hover:bg-black text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Image File</span>
                    </label>
                    <p className="text-[11px] text-gray-500 mt-2.5 font-medium">
                      Direct upload to Supabase Storage bucket (<code className="text-gray-700">product-images</code>).
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">
                      Direct Image Web Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-domain.com/images/product.png"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-xs text-[#271813] font-mono focus:border-[#ab2f00] focus:bg-white outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Section Placement (3 Options: Offers, Best Seller, Shop) */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5beb3]/60 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e5beb3]/40">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#ab2f00]" />
                <h4 className="font-extrabold text-xs text-[#271813] uppercase tracking-wider">
                  4. Section Placement (Choose 1 of 3 Options)
                </h4>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Every product is automatically present in the Shop catalog. Select whether to feature it in Offers or Best Sellers.
              </p>
            </div>

            {/* 3 Placement Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Option 1: Offers */}
              <div
                onClick={() => {
                  if (placement !== 'offers' && !product?.isOffer && existingOffersCount >= 2) {
                    setErrorMessage('Offers limit reached (Maximum 2 offers active). Please remove an offer first.');
                    return;
                  }
                  setErrorMessage('');
                  setPlacement('offers');
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  placement === 'offers'
                    ? 'bg-orange-50/90 border-[#ab2f00] shadow-md ring-2 ring-[#ab2f00]/20'
                    : 'bg-[#fff8f6] border-[#e5beb3] hover:border-[#ab2f00]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#ab2f00] text-white flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        placement === 'offers'
                          ? 'border-[#ab2f00] bg-[#ab2f00]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {placement === 'offers' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-[#271813] uppercase tracking-tight">
                    1. Offers
                  </h5>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Homepage limited time deals banner (Max 2 cards).
                  </p>
                </div>
                <span className="text-[10px] font-black text-[#ab2f00] uppercase mt-3 block pt-2 border-t border-[#e5beb3]/50">
                  Slots: {existingOffersCount}/2
                </span>
              </div>

              {/* Option 2: Best Seller */}
              <div
                onClick={() => {
                  setErrorMessage('');
                  setPlacement('bestseller');
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  placement === 'bestseller'
                    ? 'bg-amber-50/90 border-amber-600 shadow-md ring-2 ring-amber-600/20'
                    : 'bg-[#fff8f6] border-[#e5beb3] hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                      <Star className="w-4 h-4" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        placement === 'bestseller'
                          ? 'border-amber-600 bg-amber-600'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {placement === 'bestseller' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-[#271813] uppercase tracking-tight">
                    2. Best Seller
                  </h5>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Homepage trending best sellers grid (Any number of cards).
                  </p>
                </div>
                <span className="text-[10px] font-black text-amber-700 uppercase mt-3 block pt-2 border-t border-[#e5beb3]/50">
                  Featured Trending
                </span>
              </div>

              {/* Option 3: Shop */}
              <div
                onClick={() => {
                  setErrorMessage('');
                  setPlacement('shop');
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  placement === 'shop'
                    ? 'bg-stone-50 border-stone-800 shadow-md ring-2 ring-stone-800/20'
                    : 'bg-[#fff8f6] border-[#e5beb3] hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-stone-800 text-white flex items-center justify-center shadow-sm">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        placement === 'shop'
                          ? 'border-stone-800 bg-stone-800'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {placement === 'shop' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-[#271813] uppercase tracking-tight">
                    3. Shop
                  </h5>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Standard catalog & store placement without homepage feature.
                  </p>
                </div>
                <span className="text-[10px] font-black text-stone-700 uppercase mt-3 block pt-2 border-t border-[#e5beb3]/50">
                  Standard Item
                </span>
              </div>
            </div>

            {/* Store Badges Row */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#e5beb3]/40">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ab2f00] focus:ring-[#ab2f00]"
                />
                <span>On Sale Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ab2f00] focus:ring-[#ab2f00]"
                />
                <span>New Arrival Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ab2f00] focus:ring-[#ab2f00]"
                />
                <span>In Stock & Ready to Ship</span>
              </label>
            </div>
          </div>

          {/* Section 5: Description & Specs */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5beb3]/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e5beb3]/40">
              <ShieldCheck className="w-4 h-4 text-[#ab2f00]" />
              <h4 className="font-extrabold text-xs text-[#271813] uppercase tracking-wider">
                5. Product Description & Specifications
              </h4>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Product Description
              </label>
              <textarea
                rows={2}
                placeholder="Detailed description of features, durability and use cases..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-2xl text-xs text-[#271813] font-medium focus:border-[#ab2f00] focus:bg-white outline-none resize-none transition-all"
              />
            </div>

            {/* Technical Specifications */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Technical Specifications (Key & Value)
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#ab2f00] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Specification Row</span>
                </button>
              </div>

              <div className="space-y-2">
                {specsList.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g. Motor / Voltage / Diameter"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="w-1/3 px-3.5 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-xs font-bold focus:border-[#ab2f00] focus:bg-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 100% Copper Wound 28W BLDC"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-xs focus:border-[#ab2f00] focus:bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Fixed Action Footer */}
          <div className="pt-4 border-t border-[#e5beb3]/50 flex items-center justify-end gap-3 sticky bottom-0 bg-[#fffdfc] pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[#e5beb3] hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-8 py-3 bg-[#ab2f00] hover:bg-[#d63d00] text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Product Changes' : 'Create Product in Supabase'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
