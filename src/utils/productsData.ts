export interface Product {
  id: string;
  name: string;
  subtext: string;
  sku: string;
  category: string;
  subCategory?: string;
  brand?: string;
  tags?: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockAlert: number;
  unit: string;
  shortDescription: string;
  fullDescription: string;
  status: 'Active' | 'Inactive' | 'Draft';
  createdDate: string;
  createdTime: string;
  images: string[]; // local preview URLs
  iconName: 'headphones' | 'watch' | 'bag' | 'glasses' | 'activity';
}

export const initialProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Wireless Headphones',
    subtext: 'Premium Sound Quality',
    sku: 'WH-BT-01',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'Razzia',
    tags: 'new, audio, bestseller',
    price: 1299,
    discountPrice: 1199,
    costPrice: 800,
    stock: 45,
    lowStockAlert: 10,
    unit: 'Pcs',
    shortDescription: 'Wireless Bluetooth headphones with high fidelity audio and 40 hour battery life.',
    fullDescription: 'Enjoy premium acoustic definition with Razzia wireless headphones. Designed with memory foam cushioned earmuffs, active noise-isolation filters, and high-response dynamic drivers. Compiles bluetooth v5.3 for latency-free streaming.',
    status: 'Active',
    createdDate: '20 May, 2024',
    createdTime: '10:30 AM',
    images: [],
    iconName: 'headphones'
  },
  {
    id: 'PROD-002',
    name: 'Smart Watch',
    subtext: 'Fitness & Health Tracking',
    sku: 'SW-01',
    category: 'Electronics',
    subCategory: 'Wearables',
    brand: 'Razzia Fit',
    tags: 'fitness, smart, watch',
    price: 2499,
    discountPrice: 2299,
    costPrice: 1500,
    stock: 32,
    lowStockAlert: 5,
    unit: 'Pcs',
    shortDescription: 'Multi-sport tracker smart watch with heart rate and blood oxygen monitoring.',
    fullDescription: 'Stay on top of your daily fitness statistics with our high-definition curved glass smart watch. Supports 120+ workout profiles, real-time stress index monitoring, sleeping cycles recording, and phone sync calling alerts.',
    status: 'Active',
    createdDate: '19 May, 2024',
    createdTime: '09:15 AM',
    images: [],
    iconName: 'watch'
  },
  {
    id: 'PROD-003',
    name: 'Trendy Handbag',
    subtext: 'Stylish & Premium Quality',
    sku: 'HB-02',
    category: 'Fashion',
    subCategory: 'Bags',
    brand: 'Luxo',
    tags: 'woman, luxury, fashion',
    price: 1099,
    costPrice: 600,
    stock: 0,
    lowStockAlert: 5,
    unit: 'Pcs',
    shortDescription: 'Premium leather handbag with adjustable sling straps and zip pockets.',
    fullDescription: 'Enhance your style statement with Luxo leather handbags. Features custom brass buckles, multiple internal document dividers, quick-access keyrings, and robust water-repellent internal lining.',
    status: 'Inactive',
    createdDate: '18 May, 2024',
    createdTime: '04:20 PM',
    images: [],
    iconName: 'bag'
  },
  {
    id: 'PROD-004',
    name: 'Sunglasses',
    subtext: 'UV Protected',
    sku: 'SG-01',
    category: 'Fashion',
    subCategory: 'Eyewear',
    brand: 'Shade',
    tags: 'summer, sunglasses, uv',
    price: 599,
    discountPrice: 499,
    costPrice: 300,
    stock: 80,
    lowStockAlert: 15,
    unit: 'Pcs',
    shortDescription: 'Polarized sports sunglasses with complete UV400 radiation protection.',
    fullDescription: 'Protect your eyesight under broad daylight using our polarized wrap-around sunglasses. Lightweight carbon-fibre frame, scratch-resistant glass layering, and customizable nose bridge grips.',
    status: 'Active',
    createdDate: '17 May, 2024',
    createdTime: '11:45 AM',
    images: [],
    iconName: 'glasses'
  },
  {
    id: 'PROD-005',
    name: 'Running Shoes',
    subtext: 'Comfort & Performance',
    sku: 'RS-01',
    category: 'Footwear',
    subCategory: 'Sports',
    brand: 'RunX',
    tags: 'running, athletic, shoes',
    price: 1999,
    discountPrice: 1799,
    costPrice: 1200,
    stock: 5,
    lowStockAlert: 8,
    unit: 'Pairs',
    shortDescription: 'Breathable mesh running shoes with shock-absorbing foam soles.',
    fullDescription: 'Designed for marathon enthusiasts and daily runners. Breathable honeycomb fabric mesh, dynamic impact-reduction midsoles, anti-slip grid rubber traction, and reinforced heel cups.',
    status: 'Active',
    createdDate: '16 May, 2024',
    createdTime: '02:10 PM',
    images: [],
    iconName: 'activity'
  },
  {
    id: 'PROD-006',
    name: 'Wireless Earbuds',
    subtext: 'Noise Cancellation',
    sku: 'WE-01',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'Razzia',
    tags: 'new, sound, music',
    price: 1499,
    costPrice: 900,
    stock: 0,
    lowStockAlert: 10,
    unit: 'Pcs',
    shortDescription: 'Compact true-wireless earbuds with dual microphone and active noise cancelling.',
    fullDescription: 'True wireless stereo earbuds supporting active noise cancellation up to 28dB. IPX5 sweat-proof shell, high-sensitivity touch controls, and auto-pairing smart sensors.',
    status: 'Inactive',
    createdDate: '15 May, 2024',
    createdTime: '01:05 PM',
    images: [],
    iconName: 'headphones'
  }
];

// Helper to load products from localStorage or use initial values
export const loadProducts = (): Product[] => {
  const data = localStorage.getItem('razzia_products');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing products data from localStorage', e);
    }
  }
  return initialProducts;
};

// Helper to save products list to localStorage
export const saveProducts = (products: Product[]): void => {
  localStorage.setItem('razzia_products', JSON.stringify(products));
};
