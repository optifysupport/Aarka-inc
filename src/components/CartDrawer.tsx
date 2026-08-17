import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = 0;
  const grandTotal = subtotal;

  const handleStartCheckout = () => {
    setShowCustomerForm(true);
    setFormError('');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!customerMobile.trim() || customerMobile.trim().length < 10) {
      setFormError('Please enter a valid mobile number.');
      return;
    }

    setIsCheckingOut(true);

    // Format WhatsApp message with customer details & order details
    let message = `Hello, I would like to place an order:\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName.trim()}\n`;
    message += `Mobile: ${customerMobile.trim()}\n\n`;
    message += `*Order Details:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n   Quantity: ${item.quantity}\n   Price: ₹${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });
    message += `*Total Amount:* ₹${grandTotal.toFixed(2)}`;

    const whatsappPhone = '919066558877';
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp link in new tab
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      setShowCustomerForm(false);
      setCustomerName('');
      setCustomerMobile('');
      onClearCart();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      ></div>

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-[#e5beb3]/40">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 bg-[#fff8f6] border-b border-[#e5beb3]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ab2f00]" />
              <h2 className="font-extrabold text-base sm:text-lg text-[#271813] uppercase tracking-wide">
                Your Shopping Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:text-[#271813] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar">
            {checkoutComplete ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900">Order Placed Successfully!</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Thank you for shopping with Aarka Inc. Your order details have been generated for WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setCheckoutComplete(false);
                    setShowCustomerForm(false);
                    onClose();
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#ab2f00] text-white font-bold rounded-lg text-xs uppercase cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : showCustomerForm ? (
              <form onSubmit={handleConfirmOrder} className="space-y-4 py-2">
                <div className="bg-[#fff8f6] p-4 rounded-xl border border-[#e5beb3]/40">
                  <h3 className="font-extrabold text-sm text-[#271813] mb-1 uppercase tracking-wider">
                    Customer Information
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Please provide your contact details to send your order directly via WhatsApp.
                  </p>

                  {formError && (
                    <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#e5beb3] rounded-xl text-xs sm:text-sm text-[#271813] focus:border-[#ab2f00] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#e5beb3] rounded-xl text-xs sm:text-sm text-[#271813] focus:border-[#ab2f00] outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-[#fff1ed]/60 p-3 rounded-xl border border-[#e5beb3]/30 text-xs text-gray-700 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Total Items:</span>
                    <span className="font-bold text-[#271813]">{cartItems.reduce((a, b) => a + b.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#ab2f00] pt-1 border-t border-[#e5beb3]/40">
                    <span>Total Amount:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors uppercase text-xs tracking-wider shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <span>Redirecting to WhatsApp...</span>
                    ) : (
                      <span>Send Order via WhatsApp • ₹{grandTotal.toFixed(2)}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(false)}
                    className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-xs cursor-pointer text-center"
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            ) : cartItems.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
                <p className="text-base font-semibold text-gray-600">Your cart is currently empty</p>
                <p className="text-xs text-gray-400">Add products to your cart to checkout.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-[#fff1ed]/60 rounded-xl border border-[#e5beb3]/30 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg bg-white p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-[#271813] truncate uppercase">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-bold text-[#ab2f00] mt-0.5">
                      ₹{item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 rounded bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 sm:gap-2 shrink-0">
                    <span className="font-extrabold text-xs sm:text-sm text-[#271813]">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {!checkoutComplete && !showCustomerForm && cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#fff8f6] border-t border-[#e5beb3]/40 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#271813] pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#ab2f00]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleStartCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-[#ab2f00] text-white font-bold rounded-xl hover:bg-[#d63d00] transition-colors uppercase text-xs tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>Proceed to Checkout • ₹{grandTotal.toFixed(2)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
