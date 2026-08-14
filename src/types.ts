export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  onSale?: boolean;
  isNew?: boolean;
  discountPercentage?: number;
  specs?: Record<string, string>;
  description?: string;
  isOffer?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: 'featured' | 'low-high' | 'high-low' | 'newest';
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date?: string;
}

export interface AdminCredentials {
  passwordHash?: string;
  isLoggedIn: boolean;
  lastLogin?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
