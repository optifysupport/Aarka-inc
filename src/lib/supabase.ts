import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { DEFAULT_SHOP_PRODUCTS } from '../data/products';

const STORAGE_KEY_ADMIN_AUTH = 'aarka_admin_auth_session';

// Cryptographic hash and obfuscated secret for admin authentication
const PASS_HASH = 'ca51532dd6890d6843d49e914a31d630e645996c4b066f68d307ca3e5a261fc3';
const PASS_B64 = 'YWRtaW5AYWFya2E5OTk5';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Convert DB snake_case row to TypeScript Product
export function mapDbRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name || 'Untitled Product',
    category: row.category || 'General',
    price: Number(row.price) || 0,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    rating: Number(row.rating) || 5,
    image: row.image || '',
    onSale: Boolean(row.on_sale),
    isNew: Boolean(row.is_new),
    discountPercentage: row.discount_percentage != null ? Number(row.discount_percentage) : undefined,
    specs: typeof row.specs === 'object' && row.specs !== null ? row.specs : undefined,
    description: row.description || '',
    isOffer: Boolean(row.is_offer),
    isBestSeller: Boolean(row.is_best_seller),
    inStock: row.in_stock !== false,
    created_at: row.created_at,
  };
}

// Convert TypeScript Product to DB snake_case row
export function mapProductToDbRow(product: Product): any {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice ?? null,
    rating: product.rating || 5,
    image: product.image,
    on_sale: Boolean(product.onSale),
    is_new: Boolean(product.isNew),
    discount_percentage: product.discountPercentage ?? null,
    specs: product.specs || {},
    description: product.description || '',
    is_offer: Boolean(product.isOffer),
    is_best_seller: Boolean(product.isBestSeller),
    in_stock: product.inStock !== false,
  };
}

// Fetch all products: Database products come first, merged with default fallback catalog
export async function loadAllProducts(): Promise<Product[]> {
  const defaultCatalog: Product[] = [...DEFAULT_SHOP_PRODUCTS];

  if (!supabase) {
    return defaultCatalog;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const dbProducts = data.map(mapDbRowToProduct);
      const dbIds = new Set(dbProducts.map((p) => p.id));
      
      // Database products come first, followed by default catalog items not in DB
      return [
        ...dbProducts,
        ...defaultCatalog.filter((p) => !dbIds.has(p.id)),
      ];
    }
  } catch (err) {
    console.warn('Supabase fetch issue (using default catalog):', err);
  }

  return defaultCatalog;
}

// Save or update product in Supabase database
export async function saveProductItem(product: Product): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: true,
      error: 'Saved in memory. Add Supabase credentials in .env to persist across database.',
    };
  }

  try {
    const dbRow = mapProductToDbRow(product);
    const { error } = await supabase.from('products').upsert(dbRow);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save product.' };
  }
}

// Delete product from Supabase database
export async function deleteProductItem(productId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product.' };
  }
}

// Upload Product Image to Supabase Storage bucket 'product-images'
export async function uploadProductImage(file: File): Promise<{ url: string; error?: string }> {
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          return { url: publicUrlData.publicUrl };
        }
      }
    } catch (err: any) {
      console.warn('Supabase storage exception, falling back to data URL:', err);
    }
  }

  // Fallback to data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ url: e.target?.result as string });
    reader.onerror = () => resolve({ url: '', error: 'Failed to read file' });
    reader.readAsDataURL(file);
  });
}

// Admin Authentication & Session
export function checkAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  const session = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    if (parsed.isLoggedIn && parsed.timestamp) {
      const isExpired = Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000;
      return !isExpired;
    }
  } catch {
    return false;
  }
  return false;
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const trimmed = (password || '').trim();
  if (!trimmed) return false;

  let isValid = false;

  // 1. Direct obfuscated validation
  try {
    if (typeof window !== 'undefined' && window.atob) {
      if (trimmed === window.atob(PASS_B64)) {
        isValid = true;
      }
    }
  } catch {}

  // 2. Cryptographic SHA-256 validation via WebCrypto
  if (!isValid && typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(trimmed);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      if (hashHex === PASS_HASH) {
        isValid = true;
      }
    } catch (err) {
      console.warn('WebCrypto auth fallback:', err);
    }
  }

  if (isValid) {
    const session = {
      isLoggedIn: true,
      timestamp: Date.now(),
      role: 'admin',
      authHash: PASS_HASH,
    };
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(session));
    return true;
  }

  return false;
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  }
}
