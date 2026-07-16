export interface CustomerActivity {
  id: string;
  action: string;
  timestamp: string;
}

export interface CustomerPurchase {
  id: string;
  productName: string;
  amount: number;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'VIP' | 'Blocked';
  joinDate: string;
  avatarLetter: string;
  // Detail drawer extensions
  address: string;
  favoriteCategories: string[];
  recentPurchases: CustomerPurchase[];
  activities: CustomerActivity[];
}

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Neha Patel',
    email: 'neha.patel@email.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    totalOrders: 12,
    totalSpent: 5650,
    status: 'Active',
    joinDate: '22 May, 2024',
    avatarLetter: 'NP',
    address: '405, Sea Breeze Apartments, Bandra West, Mumbai, Maharashtra - 400050',
    favoriteCategories: ['Electronics', 'Beauty'],
    recentPurchases: [
      { id: 'TXN-901', productName: 'Wireless Headphones', amount: 1299, date: '22 May, 2024' },
      { id: 'TXN-902', productName: 'Smart Watch', amount: 2499, date: '15 May, 2024' }
    ],
    activities: [
      { id: 'ACT-001', action: 'Placed Order #RAZ-1256', timestamp: '22 May, 2024 10:30 AM' },
      { id: 'ACT-002', action: 'Subscribed to Live Commerce Channel', timestamp: '12 May, 2024 04:00 PM' }
    ]
  },
  {
    id: 'CUST-002',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@email.com',
    phone: '+91 91234 56789',
    location: 'Delhi, India',
    totalOrders: 8,
    totalSpent: 4230,
    status: 'Active',
    joinDate: '20 May, 2024',
    avatarLetter: 'RS',
    address: 'B-12, Green Park Extension, New Delhi, Delhi - 110016',
    favoriteCategories: ['Fashion', 'Footwear'],
    recentPurchases: [
      { id: 'TXN-903', productName: 'Trendy Handbag', amount: 1099, date: '20 May, 2024' }
    ],
    activities: [
      { id: 'ACT-003', action: 'Placed Order #RAZ-1255', timestamp: '20 May, 2024 09:15 AM' },
      { id: 'ACT-004', action: 'Logged in from Delhi, India', timestamp: '20 May, 2024 08:30 AM' }
    ]
  },
  {
    id: 'CUST-003',
    name: 'Priya Singh',
    email: 'priya.singh@email.com',
    phone: '+91 99887 66554',
    location: 'Bangalore, India',
    totalOrders: 15,
    totalSpent: 6780,
    status: 'Active',
    joinDate: '18 May, 2024',
    avatarLetter: 'PS',
    address: '102, Laurel Heights, Indiranagar, Bangalore, Karnataka - 560038',
    favoriteCategories: ['Electronics', 'Fashion'],
    recentPurchases: [
      { id: 'TXN-904', productName: 'Wireless Earbuds', amount: 1499, date: '18 May, 2024' },
      { id: 'TXN-905', productName: 'Sunglasses', amount: 599, date: '12 May, 2024' }
    ],
    activities: [
      { id: 'ACT-005', action: 'Placed Order #RAZ-1254', timestamp: '18 May, 2024 08:45 AM' },
      { id: 'ACT-006', action: 'Added Sunglasses to wishlist', timestamp: '10 May, 2024 02:15 PM' }
    ]
  },
  {
    id: 'CUST-004',
    name: 'Aman Verma',
    email: 'aman.verma@email.com',
    phone: '+91 88776 55443',
    location: 'Pune, India',
    totalOrders: 6,
    totalSpent: 2890,
    status: 'Inactive',
    joinDate: '15 May, 2024',
    avatarLetter: 'AV',
    address: '702, Skyline Towers, Koregaon Park, Pune, Maharashtra - 411001',
    favoriteCategories: ['Electronics', 'Grocery'],
    recentPurchases: [
      { id: 'TXN-906', productName: 'Wireless Headphones', amount: 1299, date: '10 May, 2024' }
    ],
    activities: [
      { id: 'ACT-007', action: 'Payment failed for Order #RAZ-1209', timestamp: '15 May, 2024 11:30 AM' },
      { id: 'ACT-008', action: 'Viewed active stream', timestamp: '14 May, 2024 03:00 PM' }
    ]
  },
  {
    id: 'CUST-005',
    name: 'Karan Mehta',
    email: 'karan.mehta@email.com',
    phone: '+91 77665 44332',
    location: 'Ahmedabad, India',
    totalOrders: 10,
    totalSpent: 4560,
    status: 'Active',
    joinDate: '10 May, 2024',
    avatarLetter: 'KM',
    address: 'Block A-4, Spring Fields, Satellite, Ahmedabad, Gujarat - 380015',
    favoriteCategories: ['Electronics', 'Beauty'],
    recentPurchases: [
      { id: 'TXN-907', productName: 'Sunglasses', amount: 599, date: '10 May, 2024' }
    ],
    activities: [
      { id: 'ACT-009', action: 'Placed Order #RAZ-1253', timestamp: '10 May, 2024 04:20 PM' }
    ]
  },
  {
    id: 'CUST-006',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@email.com',
    phone: '+91 66554 33221',
    location: 'Chennai, India',
    totalOrders: 7,
    totalSpent: 3210,
    status: 'Active',
    joinDate: '08 May, 2024',
    avatarLetter: 'SK',
    address: 'New No 45, Gandhi Nagar Road, Adyar, Chennai, Tamil Nadu - 600020',
    favoriteCategories: ['Fashion'],
    recentPurchases: [
      { id: 'TXN-908', productName: 'Trendy Handbag', amount: 1099, date: '08 May, 2024' }
    ],
    activities: [
      { id: 'ACT-010', action: 'Logged in from Chennai, India', timestamp: '08 May, 2024 01:10 PM' }
    ]
  },
  {
    id: 'CUST-007',
    name: 'Vivek Joshi',
    email: 'vivek.joshi@email.com',
    phone: '+91 55443 22110',
    location: 'Kolkata, India',
    totalOrders: 5,
    totalSpent: 1980,
    status: 'Inactive',
    joinDate: '05 May, 2024',
    avatarLetter: 'VJ',
    address: '88, Salt Lake City, Sector-3, Kolkata, West Bengal - 700098',
    favoriteCategories: ['Electronics'],
    recentPurchases: [
      { id: 'TXN-909', productName: 'Wireless Earbuds', amount: 1499, date: '01 May, 2024' }
    ],
    activities: [
      { id: 'ACT-011', action: 'Cancelled Order #RAZ-1252', timestamp: '05 May, 2024 01:10 PM' }
    ]
  },
  {
    id: 'CUST-008',
    name: 'Pooja Yadav',
    email: 'pooja.yadav@email.com',
    phone: '+91 44332 11009',
    location: 'Lucknow, India',
    totalOrders: 9,
    totalSpent: 3890,
    status: 'Active',
    joinDate: '02 May, 2024',
    avatarLetter: 'PY',
    address: 'Sector E, Aliganj, Lucknow, Uttar Pradesh - 226024',
    favoriteCategories: ['Fashion', 'Beauty'],
    recentPurchases: [
      { id: 'TXN-910', productName: 'Trendy Handbag', amount: 1099, date: '02 May, 2024' }
    ],
    activities: [
      { id: 'ACT-012', action: 'Placed Order #RAZ-1249', timestamp: '02 May, 2024 02:00 PM' }
    ]
  }
];

export const loadCustomers = (): Customer[] => {
  const data = localStorage.getItem('razzia_customers');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  return mockCustomers;
};

export const saveCustomers = (custs: Customer[]): void => {
  localStorage.setItem('razzia_customers', JSON.stringify(custs));
};
