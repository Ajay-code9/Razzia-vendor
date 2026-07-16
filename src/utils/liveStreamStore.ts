import type { Product } from './productsData';
import { loadProducts } from './productsData';

export interface LiveStreamSession {
  title: string;
  category: string;
  description: string;
  thumbnail: string; // Base64 or mock URL
  products: Product[]; // Showcase items
  pinnedProductId: string | null;
  quality: string;
  privacy: 'Public' | 'Private';
  allowChat: boolean;
  isScheduled: boolean;
  scheduledDate: string;
  scheduledTime: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  role: 'host' | 'moderator' | 'user';
  timestamp: string;
  avatarLetter: string;
}

// Fetch default showcase products from the mock database
const getDefaultShowcaseProducts = (): Product[] => {
  const allProds = loadProducts();
  // Choose headphones, watch, handbag, earbuds matching the Canva setup
  return allProds.slice(0, 4);
};

export const defaultSession: LiveStreamSession = {
  title: 'Top Tech Deals Live 🔥 Limited Time Offers!',
  category: 'Electronics',
  description: 'Best deals on headphones, smart watches and more. Join now and grab exciting offers!',
  thumbnail: '', // Use generic template when empty
  products: getDefaultShowcaseProducts(),
  pinnedProductId: 'PROD-001', // Wireless Headphones default pin
  quality: '1080p (Recommended)',
  privacy: 'Public',
  allowChat: true,
  isScheduled: false,
  scheduledDate: '2024-05-22',
  scheduledTime: '10:15',
};

export const defaultChatMessages: ChatMessage[] = [
  { id: '1', username: 'Ajay Store', message: 'Welcome everyone! Grab the best deals today only 🔥', role: 'host', timestamp: '10:20 AM', avatarLetter: 'AS' },
  { id: '2', username: 'Neha Patel', message: 'Nice product! Is it wireless?', role: 'user', timestamp: '10:21 AM', avatarLetter: 'NP' },
  { id: '3', username: 'Rohit Sharma', message: 'Battery backup kitna hai?', role: 'user', timestamp: '10:22 AM', avatarLetter: 'RS' },
  { id: '4', username: 'Priya Singh', message: 'Looks premium! Ordering now 🔥', role: 'user', timestamp: '10:23 AM', avatarLetter: 'PS' },
];

export const loadSession = (): LiveStreamSession => {
  const data = localStorage.getItem('razzia_live_session');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Map products list to ensure live values
      if (parsed.products && parsed.products.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing live session from localStorage', e);
    }
  }
  return { ...defaultSession, products: getDefaultShowcaseProducts() };
};

export const saveSession = (session: LiveStreamSession): void => {
  localStorage.setItem('razzia_live_session', JSON.stringify(session));
};
