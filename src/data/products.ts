import { Product, Review } from '../types';

// Fallback arrays (empty as products are dynamically loaded from Supabase)
export const DEFAULT_OFFER_PRODUCTS: Product[] = [];
export const DEFAULT_BEST_SELLER_PRODUCTS: Product[] = [];
export const DEFAULT_SHOP_PRODUCTS: Product[] = [];
export const INITIAL_PRODUCTS: Product[] = [];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Chief Engineer, Apex Automation',
    text: '"The performance of these components is unmatched. A game-changer for my setup."',
    rating: 5,
  },
  {
    id: 'rev-2',
    author: 'Lead Architect, CyberDyne Systems',
    text: '"Absolutely incredible build quality. The precision engineering is evident in every detail."',
    rating: 5,
  },
  {
    id: 'rev-3',
    author: 'Logistics Director, Global Logistics Corp',
    text: '"Fastest shipping I\'ve ever experienced, and the customer support was incredibly helpful."',
    rating: 5,
  },
  {
    id: 'rev-4',
    author: 'Senior Systems Admin, Matrix Tech',
    text: '"The tactile feedback on the new keyboard series is phenomenal. Worth every penny."',
    rating: 5,
  },
];

export const INDUSTRY_BRANDS = [
  'POLYCAB',
  'OMRON',
  'SIEMENS',
  'LEGRAND',
  'NEPTUNE',
  'WADPACK',
  'SIGNODE',
  'GRIFFITH FOODS',
];
