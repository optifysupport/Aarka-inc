import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { LimitedTimeOffers } from './components/LimitedTimeOffers';
import { BrandsMarquee } from './components/BrandsMarquee';
import { BestSellers } from './components/BestSellers';
import { AboutUs } from './components/AboutUs';
import { CustomerReviews } from './components/CustomerReviews';
import { ShopView } from './components/ShopView';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import {
  loadAllProducts,
  saveProductItem,
  deleteProductItem,
  checkAdminSession,
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'admin'>('home');
  // Starts empty and fetches live catalog directly from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialShopCategory, setInitialShopCategory] = useState<string | undefined>();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Admin authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Load products directly from Supabase database
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const loaded = await loadAllProducts();
        setProducts(loaded || []);
      } catch (err) {
        console.error('Error loading products from Supabase:', err);
      }
    };
    fetchCatalog();

    // Check if admin is currently authenticated
    setIsAdminLoggedIn(checkAdminSession());

    // Listen for #admin hash in URL
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        if (checkAdminSession()) {
          setActiveTab('admin');
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenAdmin = () => {
    if (checkAdminSession()) {
      setIsAdminLoggedIn(true);
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLoginModal(false);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('home');
    window.location.hash = '';
  };

  // Product CRUD operations directly with Supabase
  const handleSaveProduct = async (product: Product) => {
    await saveProductItem(product);
    const updated = await loadAllProducts();
    setProducts(updated || []);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProductItem(productId);
    const updated = await loadAllProducts();
    setProducts(updated || []);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCategorySelect = (category: string) => {
    setInitialShopCategory(category);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-['Sora',sans-serif] bg-[#fff8f6] text-[#271813] relative selection:bg-[#d63d00] selection:text-white">
      {/* Background Radial Dots Pattern */}
      <div className="fixed inset-0 hero-pattern z-[-1] pointer-events-none"></div>

      {/* Global Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full">
        {activeTab === 'admin' && isAdminLoggedIn ? (
          <AdminPanel
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onCloseAdmin={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleAdminLogout}
          />
        ) : activeTab === 'shop' ? (
          <ShopView
            products={products}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onQuickView={(p) => setQuickViewProduct(p)}
            initialCategory={initialShopCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          <>
            {/* Hero Section with Vibrant Animated Shop Now Button */}
            <HeroSection
              onShopNow={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Horizontal Category Nav */}
            <CategoryNav onSelectCategory={handleCategorySelect} />

            {/* Limited Time Offers (Strictly Max 2 Cards) */}
            <LimitedTimeOffers
              products={products}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onQuickView={(p) => setQuickViewProduct(p)}
            />

            {/* Industry Leaders Marquee */}
            <BrandsMarquee />

            {/* Best Sellers (Any Number of Cards) */}
            <BestSellers
              products={products}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onQuickView={(p) => setQuickViewProduct(p)}
            />

            {/* About Us */}
            <AboutUs />

            {/* Customer Reviews Ticker */}
            <CustomerReviews />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Admin Login Modal */}
      {showAdminLoginModal && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onCancel={() => setShowAdminLoginModal(false)}
        />
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
