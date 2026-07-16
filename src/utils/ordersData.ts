export interface ProductItem {
  name: string;
  sku: string;
  color: string;
  price: number;
  qty: number;
  iconName: 'headphones' | 'watch' | 'bag' | 'glasses' | 'activity';
  isFree?: boolean;
}

export interface TimelineEvent {
  title: string;
  date: string;
  time: string;
  description?: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
  };
  products: ProductItem[];
  amount: number;
  paymentType: 'Online' | 'COD';
  paymentMethod: 'UPI' | 'VISA' | 'COD' | 'Mastercard';
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  time: string;
  shippingMethod: string;
  expectedDelivery: string;
  transactionId?: string;
  shippingAddress: string;
  billingAddress: string;
  customerNote?: string;
  timeline: TimelineEvent[];
}

export const mockOrders: Order[] = [
  {
    id: '#RAZ12345',
    customer: {
      name: 'Rohit Sharma',
      email: 'rohitsharma@gmail.com',
      phone: '+91 98765 43210',
      isVerified: true
    },
    products: [
      { name: 'Wireless Headphones', sku: 'WH-BT-01', color: 'Black', price: 1299, qty: 1, iconName: 'headphones' },
      { name: 'Smart Watch', sku: 'SW-01', color: 'Black', price: 0, qty: 1, iconName: 'watch', isFree: true }
    ],
    amount: 1299,
    paymentType: 'Online',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    date: '22 May, 2024',
    time: '10:30 AM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '26 May, 2024',
    transactionId: 'UPI123456789012',
    shippingAddress: 'Rohit Sharma, 123, Green Park Society, Andheri West, Mumbai, Maharashtra - 400058, India',
    billingAddress: 'Rohit Sharma, 123, Green Park Society, Andheri West, Mumbai, Maharashtra - 400058, India',
    customerNote: 'Please deliver after 6 PM. Call before delivery.',
    timeline: [
      { title: 'Order Placed', date: '22 May, 2024', time: '10:30 AM', status: 'completed' },
      { title: 'Payment Confirmed', date: '22 May, 2024', time: '10:31 AM', status: 'completed' },
      { title: 'Processing', date: '22 May, 2024', time: '11:15 AM', description: 'Your order is being processed', status: 'active' },
      { title: 'Shipped', date: 'Pending', time: '', status: 'upcoming' },
      { title: 'Delivered', date: 'Pending', time: '', status: 'upcoming' }
    ]
  },
  {
    id: '#RAZ12344',
    customer: {
      name: 'Neha Patel',
      email: 'nehapatel@gmail.com',
      phone: '+91 91234 56789',
      isVerified: true
    },
    products: [
      { name: 'Trendy Handbag', sku: 'TH-BG-02', color: 'Red', price: 899, qty: 1, iconName: 'bag' }
    ],
    amount: 899,
    paymentType: 'Online',
    paymentMethod: 'VISA',
    paymentStatus: 'Paid',
    orderStatus: 'Confirmed',
    date: '22 May, 2024',
    time: '09:15 AM',
    shippingMethod: 'Express Shipping',
    expectedDelivery: '24 May, 2024',
    transactionId: 'TXN9876543210',
    shippingAddress: 'Neha Patel, 45, Sun Rise Apartments, Satellite, Ahmedabad, Gujarat - 380015, India',
    billingAddress: 'Neha Patel, 45, Sun Rise Apartments, Satellite, Ahmedabad, Gujarat - 380015, India',
    customerNote: 'Leave at security gate if not available.',
    timeline: [
      { title: 'Order Placed', date: '22 May, 2024', time: '09:15 AM', status: 'completed' },
      { title: 'Payment Confirmed', date: '22 May, 2024', time: '09:18 AM', status: 'completed' },
      { title: 'Processing', date: '22 May, 2024', time: '10:00 AM', description: 'Your order is packaged and confirmed', status: 'completed' },
      { title: 'Shipped', date: 'Pending', time: '', status: 'active' },
      { title: 'Delivered', date: 'Pending', time: '', status: 'upcoming' }
    ]
  },
  {
    id: '#RAZ12343',
    customer: {
      name: 'Aman Verma',
      email: 'amanverma@gmail.com',
      phone: '+91 99887 66554',
      isVerified: false
    },
    products: [
      { name: 'Sunglasses', sku: 'SG-UV-05', color: 'Black', price: 743, qty: 1, iconName: 'glasses' },
      { name: 'Trendy Handbag', sku: 'TH-BG-02', color: 'Red', price: 756, qty: 1, iconName: 'bag' },
      { name: 'Running Shoes', sku: 'RS-SP-09', color: 'Blue', price: 0, qty: 1, iconName: 'activity', isFree: true }
    ],
    amount: 1499,
    paymentType: 'COD',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Shipped',
    date: '21 May, 2024',
    time: '07:45 PM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '25 May, 2024',
    shippingAddress: 'Aman Verma, H-402, Green Valley, Sector 56, Gurgaon, Haryana - 122011, India',
    billingAddress: 'Aman Verma, H-402, Green Valley, Sector 56, Gurgaon, Haryana - 122011, India',
    customerNote: 'Please call before coming.',
    timeline: [
      { title: 'Order Placed', date: '21 May, 2024', time: '07:45 PM', status: 'completed' },
      { title: 'Processing', date: '21 May, 2024', time: '09:00 PM', status: 'completed' },
      { title: 'Shipped', date: '22 May, 2024', time: '08:30 AM', description: 'In transit via BlueDart AWB: 982138291', status: 'completed' },
      { title: 'Delivered', date: 'Pending', time: '', status: 'active' }
    ]
  },
  {
    id: '#RAZ12342',
    customer: {
      name: 'Priya Singh',
      email: 'priyasingh@gmail.com',
      phone: '+91 87654 32109',
      isVerified: true
    },
    products: [
      { name: 'Running Shoes', sku: 'RS-SP-09', color: 'Blue', price: 659, qty: 1, iconName: 'activity' }
    ],
    amount: 659,
    paymentType: 'Online',
    paymentMethod: 'Mastercard',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '21 May, 2024',
    time: '05:30 PM',
    shippingMethod: 'Express Shipping',
    expectedDelivery: '23 May, 2024',
    transactionId: 'TXN5432109876',
    shippingAddress: 'Priya Singh, B-12, Royal Enclave, Indiranagar, Bengaluru, Karnataka - 560038, India',
    billingAddress: 'Priya Singh, B-12, Royal Enclave, Indiranagar, Bengaluru, Karnataka - 560038, India',
    timeline: [
      { title: 'Order Placed', date: '21 May, 2024', time: '05:30 PM', status: 'completed' },
      { title: 'Payment Confirmed', date: '21 May, 2024', time: '05:32 PM', status: 'completed' },
      { title: 'Processing', date: '21 May, 2024', time: '06:00 PM', status: 'completed' },
      { title: 'Shipped', date: '22 May, 2024', time: '09:00 AM', status: 'completed' },
      { title: 'Delivered', date: '23 May, 2024', time: '02:15 PM', description: 'Delivered to recipient and signed', status: 'completed' }
    ]
  },
  {
    id: '#RAZ12341',
    customer: {
      name: 'Karan Mehta',
      email: 'karanmehta@gmail.com',
      phone: '+91 76543 21098',
      isVerified: true
    },
    products: [
      { name: 'Wireless Headphones', sku: 'WH-BT-01', color: 'Black', price: 1009, qty: 1, iconName: 'headphones' }
    ],
    amount: 1009,
    paymentType: 'Online',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '20 May, 2024',
    time: '11:20 AM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '24 May, 2024',
    transactionId: 'UPI987654321098',
    shippingAddress: 'Karan Mehta, Flat 501, Heights Tower, Lokhandwala, Andheri West, Mumbai, Maharashtra - 400053, India',
    billingAddress: 'Karan Mehta, Flat 501, Heights Tower, Lokhandwala, Andheri West, Mumbai, Maharashtra - 400053, India',
    timeline: [
      { title: 'Order Placed', date: '20 May, 2024', time: '11:20 AM', status: 'completed' },
      { title: 'Payment Confirmed', date: '20 May, 2024', time: '11:22 AM', status: 'completed' },
      { title: 'Processing', date: '20 May, 2024', time: '02:00 PM', status: 'completed' },
      { title: 'Shipped', date: '21 May, 2024', time: '10:00 AM', status: 'completed' },
      { title: 'Delivered', date: '23 May, 2024', time: '04:10 PM', status: 'completed' }
    ]
  },
  {
    id: '#RAZ12340',
    customer: {
      name: 'Sneha Iyer',
      email: 'sneha.iyer@gmail.com',
      phone: '+91 88991 23456',
      isVerified: false
    },
    products: [
      { name: 'Sunglasses', sku: 'SG-UV-05', color: 'Black', price: 599, qty: 1, iconName: 'glasses' }
    ],
    amount: 599,
    paymentType: 'Online',
    paymentMethod: 'VISA',
    paymentStatus: 'Paid',
    orderStatus: 'Cancelled',
    date: '20 May, 2024',
    time: '09:10 AM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '24 May, 2024',
    transactionId: 'TXN1122334455',
    shippingAddress: 'Sneha Iyer, C-93, Block 3, Janakpuri, New Delhi - 110058, India',
    billingAddress: 'Sneha Iyer, C-93, Block 3, Janakpuri, New Delhi - 110058, India',
    customerNote: 'Customer requested cancellation before package dispatch.',
    timeline: [
      { title: 'Order Placed', date: '20 May, 2024', time: '09:10 AM', status: 'completed' },
      { title: 'Payment Confirmed', date: '20 May, 2024', time: '09:12 AM', status: 'completed' },
      { title: 'Cancelled', date: '20 May, 2024', time: '10:30 AM', description: 'Order cancelled. Refund initiated.', status: 'completed' }
    ]
  },
  {
    id: '#RAZ12339',
    customer: {
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@gmail.com',
      phone: '+91 95432 10987',
      isVerified: true
    },
    products: [
      { name: 'Smart Watch', sku: 'SW-01', color: 'Black', price: 950, qty: 1, iconName: 'watch' }
    ],
    amount: 950,
    paymentType: 'COD',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Packed',
    date: '19 May, 2024',
    time: '03:15 PM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '23 May, 2024',
    shippingAddress: 'Vikram Malhotra, 88, Park Avenue Road, Alwarpet, Chennai, Tamil Nadu - 600018, India',
    billingAddress: 'Vikram Malhotra, 88, Park Avenue Road, Alwarpet, Chennai, Tamil Nadu - 600018, India',
    timeline: [
      { title: 'Order Placed', date: '19 May, 2024', time: '03:15 PM', status: 'completed' },
      { title: 'Processing', date: '19 May, 2024', time: '05:30 PM', status: 'completed' },
      { title: 'Packed', date: '20 May, 2024', time: '11:00 AM', description: 'Order packed at warehouse and ready for pickup', status: 'active' },
      { title: 'Shipped', date: 'Pending', time: '', status: 'upcoming' }
    ]
  },
  {
    id: '#RAZ12338',
    customer: {
      name: 'Rohan Gupta',
      email: 'rohan.gupta@gmail.com',
      phone: '+91 98822 33445',
      isVerified: true
    },
    products: [
      { name: 'Wireless Headphones', sku: 'WH-BT-01', color: 'Black', price: 1299, qty: 1, iconName: 'headphones' }
    ],
    amount: 1299,
    paymentType: 'Online',
    paymentMethod: 'VISA',
    paymentStatus: 'Paid',
    orderStatus: 'Packed',
    date: '19 May, 2024',
    time: '01:40 PM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '23 May, 2024',
    transactionId: 'TXN99887766',
    shippingAddress: 'Rohan Gupta, Flat 104, Sunrise Residency, Sector 15, Vashi, Navi Mumbai, Maharashtra - 400703, India',
    billingAddress: 'Rohan Gupta, Flat 104, Sunrise Residency, Sector 15, Vashi, Navi Mumbai, Maharashtra - 400703, India',
    timeline: [
      { title: 'Order Placed', date: '19 May, 2024', time: '01:40 PM', status: 'completed' },
      { title: 'Payment Confirmed', date: '19 May, 2024', time: '01:45 PM', status: 'completed' },
      { title: 'Processing', date: '19 May, 2024', time: '04:00 PM', status: 'completed' },
      { title: 'Packed', date: '20 May, 2024', time: '09:30 AM', description: 'Items verified and packed', status: 'active' }
    ]
  },
  {
    id: '#RAZ12337',
    customer: {
      name: 'Aditi Rao',
      email: 'aditi.rao@gmail.com',
      phone: '+91 97722 88112',
      isVerified: false
    },
    products: [
      { name: 'Trendy Handbag', sku: 'TH-BG-02', color: 'Red', price: 899, qty: 1, iconName: 'bag' }
    ],
    amount: 899,
    paymentType: 'Online',
    paymentMethod: 'Mastercard',
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    date: '18 May, 2024',
    time: '11:10 AM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '22 May, 2024',
    transactionId: 'TXN55667788',
    shippingAddress: 'Aditi Rao, 12, Lake View Road, Jubilee Hills, Hyderabad, Telangana - 500033, India',
    billingAddress: 'Aditi Rao, 12, Lake View Road, Jubilee Hills, Hyderabad, Telangana - 500033, India',
    timeline: [
      { title: 'Order Placed', date: '18 May, 2024', time: '11:10 AM', status: 'completed' },
      { title: 'Payment Confirmed', date: '18 May, 2024', time: '11:15 AM', status: 'active' }
    ]
  },
  {
    id: '#RAZ12336',
    customer: {
      name: 'Rahul Joshi',
      email: 'rahul.joshi@gmail.com',
      phone: '+91 85566 77889',
      isVerified: true
    },
    products: [
      { name: 'Running Shoes', sku: 'RS-SP-09', color: 'Blue', price: 659, qty: 1, iconName: 'activity' }
    ],
    amount: 659,
    paymentType: 'COD',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Confirmed',
    date: '18 May, 2024',
    time: '10:05 AM',
    shippingMethod: 'Standard Delivery',
    expectedDelivery: '22 May, 2024',
    shippingAddress: 'Rahul Joshi, Plot 22, Kothrud, Pune, Maharashtra - 411038, India',
    billingAddress: 'Rahul Joshi, Plot 22, Kothrud, Pune, Maharashtra - 411038, India',
    timeline: [
      { title: 'Order Placed', date: '18 May, 2024', time: '10:05 AM', status: 'completed' },
      { title: 'Confirmed', date: '18 May, 2024', time: '12:00 PM', description: 'Order accepted by vendor', status: 'active' }
    ]
  }
];
