import { Product, Review } from '../types';

// Import local product images from assets
import b1 from '../../assets/prod-images/b1.png';
import b2 from '../../assets/prod-images/b2.png';
import b3 from '../../assets/prod-images/b3.png';
import f1 from '../../assets/prod-images/f1.png';
import f2 from '../../assets/prod-images/f2.png';
import f3 from '../../assets/prod-images/f3.png';
import f4 from '../../assets/prod-images/f4.png';
import f5 from '../../assets/prod-images/f5.png';
import f6 from '../../assets/prod-images/f6.png';
import f7 from '../../assets/prod-images/f7.png';
import g1 from '../../assets/prod-images/g1.png';
import m1 from '../../assets/prod-images/m1.png';
import m2 from '../../assets/prod-images/m2.png';
import r1 from '../../assets/prod-images/r1.png';
import r2 from '../../assets/prod-images/r2.png';
import r3 from '../../assets/prod-images/r3.png';
import r4 from '../../assets/prod-images/r4.png';
import r5 from '../../assets/prod-images/r5.png';
import r6 from '../../assets/prod-images/r6.png';
import s1 from '../../assets/prod-images/s1.png';
import s2 from '../../assets/prod-images/s2.png';
import s3 from '../../assets/prod-images/s3.png';
import s4 from '../../assets/prod-images/s4.png';
import s5 from '../../assets/prod-images/s5.png';

// 1. Default Fallback Offers (2 items)
export const DEFAULT_OFFER_PRODUCTS: Product[] = [
  {
    id: 'default-offer-1',
    name: 'Hanging Pendant light',
    category: 'Lighting',
    price: 140.0,
    originalPrice: 150.0,
    rating: 5,
    image: b1,
    onSale: true,
    isNew: true,
    isOffer: true,
    isBestSeller: true,
    inStock: true,
    discountPercentage: 7,
    description: 'Premium hanging pendant light for modern architectural interiors.',
    specs: {
      'Power': '40W LED',
      'Material': 'Brushed Aluminum & Glass',
      'Color Temperature': '3000K Warm White',
      'Voltage': '220-240V AC'
    }
  },
  {
    id: 'default-offer-2',
    name: 'Circular Pendant Lights',
    category: 'Lighting',
    price: 110.0,
    originalPrice: 120.0,
    rating: 4,
    image: b2,
    onSale: true,
    isOffer: true,
    isBestSeller: false,
    inStock: true,
    discountPercentage: 8,
    description: 'Sleek circular ring pendant light designed for offices and homes.',
    specs: {
      'Power': '32W LED',
      'Diameter': '450mm',
      'Dimmable': 'Yes (Triac / 0-10V)',
      'Voltage': '220-240V AC'
    }
  }
];

// 2. Default Fallback Best Sellers (6 items)
export const DEFAULT_BEST_SELLER_PRODUCTS: Product[] = [
  {
    id: 'default-bestseller-1',
    name: 'Hanging Pendant light',
    category: 'Lighting',
    price: 140.0,
    originalPrice: 150.0,
    rating: 5,
    image: b1,
    onSale: true,
    isNew: true,
    isOffer: true,
    isBestSeller: true,
    inStock: true,
    discountPercentage: 7,
    description: 'Premium hanging pendant light for modern architectural interiors.',
    specs: {
      'Power': '40W LED',
      'Material': 'Brushed Aluminum & Glass',
      'Color Temperature': '3000K Warm White',
      'Voltage': '220-240V AC'
    }
  },
  {
    id: 'default-bestseller-2',
    name: '35W Ceiling LED Light',
    category: 'Lighting',
    price: 110.0,
    originalPrice: 120.0,
    rating: 4,
    image: b3,
    onSale: true,
    isOffer: false,
    isBestSeller: true,
    inStock: true,
    discountPercentage: 8,
    description: 'High efficiency recessed ceiling downlight with high CRI.',
    specs: {
      'Power': '35W',
      'Luminous Flux': '3500 lm',
      'Beam Angle': '60°',
      'CRI': '>90'
    }
  },
  {
    id: 'default-bestseller-3',
    name: 'Ceiling fan with light, remote control',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f1,
    isNew: true,
    isOffer: false,
    isBestSeller: true,
    inStock: true,
    description: 'Silent BLDC ceiling fan with integrated LED light and wireless remote.',
    specs: {
      'Motor': 'Energy Saving BLDC Motor 28W',
      'Sweep': '1200mm (48 Inch)',
      'Speed': '380 RPM',
      'Control': 'RF Remote + App'
    }
  },
  {
    id: 'default-bestseller-4',
    name: 'Ceiling fan classic',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f2,
    isNew: true,
    isOffer: false,
    isBestSeller: true,
    inStock: true,
    description: 'Reliable copper-wound ceiling fan with aerodynamically contoured blades.',
    specs: {
      'Motor': '100% Copper Wound',
      'Sweep': '1200mm',
      'Air Delivery': '230 CMM',
      'Warranty': '2 Years'
    }
  },
  {
    id: 'default-bestseller-5',
    name: 'Line Monitoring relay',
    category: 'Relay Modules',
    price: 45.0,
    rating: 5,
    image: r1,
    isNew: true,
    isOffer: false,
    isBestSeller: true,
    inStock: true,
    description: '3-phase voltage and phase sequence monitoring protection relay.',
    specs: {
      'Channels': '4 Independent Isolated Channels',
      'Trigger Voltage': '24V DC / 10A Output',
      'Mounting': 'Standard 35mm DIN Rail',
      'Isolation': 'Optocoupler 2500V'
    }
  },
  {
    id: 'default-bestseller-6',
    name: 'Proximity & Photoelectric sensor',
    category: 'Sensors',
    price: 129.0,
    rating: 4,
    image: s1,
    isOffer: false,
    isBestSeller: true,
    inStock: true,
    description: 'Inductive and optical object detection sensor for industrial automation.',
    specs: {
      'Sensing Distance': '15mm (Inductive) / 2m (Optical)',
      'Output': 'NPN/PNP NO+NC configurable',
      'Response Time': '< 1 ms',
      'Protection': 'IP68 Waterproof'
    }
  }
];

// 3. Complete Default Shop Catalog (All categories: Fans, Lighting, Relays, Generators, Meters, Sensors)
export const DEFAULT_SHOP_PRODUCTS: Product[] = [
  ...DEFAULT_BEST_SELLER_PRODUCTS,
  {
    id: 'default-shop-1',
    name: 'Ceiling fan with light wood finish',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f3,
    isNew: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Elegant wood-finish designer fan with center chandelier illumination.',
    specs: {
      'Finish': 'Antique Brass & Walnut',
      'Sweep': '1320mm (52 Inch)',
      'Blades': 'Handcrafted Natural Wood',
      'Lighting': 'E27 Warm Light'
    }
  },
  {
    id: 'default-shop-2',
    name: 'Pedestal fan high speed',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f4,
    isNew: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Telescopic height adjustable pedestal fan with wide-angle oscillation.',
    specs: {
      'Speed': '2100 RPM High Thrust',
      'Height Range': '110cm - 145cm',
      'Blades': 'Aerodynamic 3-Leaf Metal',
      'Safety': 'Thermal Overload Protection'
    }
  },
  {
    id: 'default-shop-3',
    name: 'Portable Desk fan',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f5,
    isNew: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Compact ultra-quiet personal USB rechargeable desk fan.',
    specs: {
      'Battery': '4000mAh Lithium Ion',
      'Runtime': '8 - 14 Hours',
      'Noise': '< 25 dB Whispering Quiet',
      'Port': 'Type-C Fast Charge'
    }
  },
  {
    id: 'default-shop-4',
    name: 'Exhaust fan - Black',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f6,
    isNew: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'High air extraction rate bathroom & kitchen ventilation fan.',
    specs: {
      'Mounting': 'Wall & Glass Mount',
      'Extraction': '350 m³/h',
      'Shutter': 'Automatic Backdraft Shutter',
      'Rating': 'IP44 Water Resistant'
    }
  },
  {
    id: 'default-shop-5',
    name: 'Exhaust fan - Orange Heavy Duty',
    category: 'Fans',
    price: 45.0,
    rating: 5,
    image: f7,
    isNew: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Industrial heavy duty metal ventilation fan for workshop and factories.',
    specs: {
      'Diameter': '300mm (12 Inch)',
      'Frame': 'Powder Coated Cast Iron',
      'Speed': '1400 RPM Continuous',
      'Motor': 'Heavy Duty Class F'
    }
  },
  {
    id: 'default-shop-6',
    name: 'Selec Line Monitoring relay',
    category: 'Relay Modules',
    price: 45.0,
    rating: 5,
    image: r2,
    isNew: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Digital phase failure, unbalance and under/over voltage relay.',
    specs: {
      'Monitoring': 'Phase Asymmetry, Under/Over V',
      'Relay Output': '2 C/O SPDT 5A',
      'Mounting': 'DIN Rail 35mm',
      'Accuracy': '±1% True RMS'
    }
  },
  {
    id: 'default-shop-7',
    name: 'Selec Advanced Static Var Generator',
    category: 'Generators',
    price: 1299.0,
    rating: 5,
    image: g1,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Dynamic reactive power compensation and harmonic filtering unit.',
    specs: {
      'Output Power': '7500 Peak Watts / 6800 Running',
      'Response Time': '< 5ms ultra-fast',
      'Target PF': '-0.99 to +0.99 continuous',
      'Noise Level': '68 dBA @ 7 meters'
    }
  },
  {
    id: 'default-shop-8',
    name: 'Digital earth fault relay',
    category: 'Relay Modules',
    price: 350.0,
    rating: 5,
    image: r3,
    onSale: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    discountPercentage: 15,
    description: 'Microcontroller based digital earth fault current monitoring relay.',
    specs: {
      'Current Range': '0.1A to 30A adjustable',
      'Trip Delay': '0.05s to 10s',
      'Display': '7-Segment LED',
      'Standards': 'IEC 60255 compliant'
    }
  },
  {
    id: 'default-shop-9',
    name: 'Smart vision sensor',
    category: 'Sensors',
    price: 159.0,
    originalPrice: 179.0,
    rating: 5,
    image: s2,
    onSale: true,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    discountPercentage: 11,
    description: 'AI-assisted optical inspection and part presence sensor.',
    specs: {
      'Resolution': '1280 x 1024 @ 60 FPS',
      'Lighting': 'Built-in Multi-Angle Ring LED',
      'Interface': 'Ethernet TCP/IP, Modbus',
      'Inspection Tools': 'Pattern, OCR, Measurement'
    }
  },
  {
    id: 'default-shop-10',
    name: 'Digital Panel meter',
    category: 'Meters',
    price: 115.0,
    rating: 4,
    image: m1,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Multifunction power, current, voltage and energy monitoring meter.',
    specs: {
      'Display': 'Backlit LCD 3-Line',
      'Accuracy Class': 'Class 0.5s',
      'Parameters': 'V, A, Hz, PF, kW, kVA, kWh',
      'Port': 'RS-485 Modbus'
    }
  },
  {
    id: 'default-shop-11',
    name: 'Hour meter',
    category: 'Meters',
    price: 115.0,
    rating: 4,
    image: m2,
    isOffer: false,
    isBestSeller: false,
    inStock: true,
    description: 'Electromechanical run-time counter for preventive maintenance.',
    specs: {
      'Capacity': '99999.99 Hours',
      'Operating Voltage': '90 - 264V AC 50/60Hz',
      'Bezel Size': '48 x 48 mm DIN',
      'Reset': 'Non-Resettable Tamperproof'
    }
  }
];

export const INITIAL_PRODUCTS = DEFAULT_SHOP_PRODUCTS;

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Chief Engineer, Apex Automation',
    text: '"The performance of these components is unmatched. A game-changer for my setup."',
    rating: 5
  },
  {
    id: 'rev-2',
    author: 'Lead Architect, CyberDyne Systems',
    text: '"Absolutely incredible build quality. The precision engineering is evident in every detail."',
    rating: 5
  },
  {
    id: 'rev-3',
    author: 'Logistics Director, Global Logistics Corp',
    text: '"Fastest shipping I\'ve ever experienced, and the customer support was incredibly helpful."',
    rating: 5
  },
  {
    id: 'rev-4',
    author: 'Senior Systems Admin, Matrix Tech',
    text: '"The tactile feedback on the new keyboard series is phenomenal. Worth every penny."',
    rating: 5
  }
];

export const INDUSTRY_BRANDS = [
  'POLYCAB',
  'OMRON',
  'SIEMENS',
  'LEGRAND',
  'NEPTUNE',
  'WADPACK',
  'SIGNODE',
  'GRIFFITH FOODS'
];
