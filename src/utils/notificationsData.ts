// ── Notification Types & Mock Data ──────────────────────────
export type NotifCategory = 'Orders' | 'Payments' | 'Live Alerts' | 'System';
export type NotifPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: NotifCategory;
  priority: NotifPriority;
  isRead: boolean;
  isArchived: boolean;
  icon: string;           // emoji or lucide name
  iconBg: string;         // tailwind bg class
  iconColor: string;      // tailwind text class
  relatedOrder?: string;
  customer?: string;
  fullMessage?: string;
}

const initialNotifications: Notification[] = [
  { id: 'N1', title: 'New Order Received', description: 'You have received a new order #RAZ-1256 from Neha Patel.', time: '2 min ago', category: 'Orders', priority: 'High', isRead: false, isArchived: false, icon: 'shopping-bag', iconBg: 'bg-[#FFF5F5]', iconColor: 'text-brand', relatedOrder: 'RAZ-1256', customer: 'Neha Patel', fullMessage: 'A new order #RAZ-1256 has been placed by Neha Patel. The order contains 3 items totaling ₹3,798. Please review and confirm the order within 24 hours.' },
  { id: 'N2', title: 'Payment Received', description: 'Payment of ₹3,798 received for order #RAZ-1256.', time: '15 min ago', category: 'Payments', priority: 'Medium', isRead: false, isArchived: false, icon: 'indian-rupee', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', relatedOrder: 'RAZ-1256', customer: 'Neha Patel', fullMessage: 'Payment of ₹3,798 has been successfully received for order #RAZ-1256. The payment was made via UPI. Funds will be settled to your bank account within 24 hours.' },
  { id: 'N3', title: 'Live Stream Started', description: 'Your live stream "Summer Collection 2024" is now live.', time: '1 hour ago', category: 'Live Alerts', priority: 'Medium', isRead: false, isArchived: false, icon: 'radio', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', fullMessage: 'Your live stream "Summer Collection 2024" has started broadcasting. Current viewers: 45. Products showcased: 12. Make sure to engage with your audience through the chat.' },
  { id: 'N4', title: 'New Review Received', description: 'You have received a 5-star review for "Wireless Headphones".', time: '2 hours ago', category: 'Orders', priority: 'Low', isRead: false, isArchived: false, icon: 'star', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', customer: 'Rahul Sharma', fullMessage: 'Rahul Sharma has left a 5-star review for "Wireless Headphones": "Amazing sound quality and battery life. Best headphones I\'ve used. Highly recommended!" This is your 156th review with an average rating of 4.8 stars.' },
  { id: 'N5', title: 'Order Delivered', description: 'Order #RAZ-1254 has been delivered successfully.', time: '3 hours ago', category: 'Orders', priority: 'Low', isRead: true, isArchived: false, icon: 'package-check', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', relatedOrder: 'RAZ-1254', customer: 'Priya Singh', fullMessage: 'Order #RAZ-1254 has been delivered to Priya Singh at 2:30 PM. Delivery was completed within the expected timeframe. The customer has been notified.' },
  { id: 'N6', title: 'Coupon Used', description: 'Coupon SAVE20 has been used in order #RAZ-1253.', time: '5 hours ago', category: 'Payments', priority: 'Low', isRead: true, isArchived: false, icon: 'ticket', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', relatedOrder: 'RAZ-1253', fullMessage: 'Coupon code SAVE20 (20% OFF, up to ₹1,000) has been applied to order #RAZ-1253. Discount amount: ₹450. This coupon has been used 151 out of 500 times.' },
  { id: 'N7', title: 'Payout Initiated', description: 'Payout of ₹10,000 has been initiated to your bank account.', time: 'Yesterday, 11:30 AM', category: 'Payments', priority: 'High', isRead: true, isArchived: false, icon: 'wallet', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', fullMessage: 'A payout of ₹10,000 has been initiated to your HDFC Bank account ending in 4567. Expected settlement: Within 24 hours. Transaction ID: TXN-789456.' },
  { id: 'N8', title: 'Flash Sale Created', description: 'Your flash sale "Weekend Mega Sale" is scheduled for 25 May.', time: 'Yesterday, 09:15 AM', category: 'Orders', priority: 'Medium', isRead: true, isArchived: false, icon: 'zap', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', fullMessage: 'Flash sale "Weekend Mega Sale" has been created successfully. Start: 25 May 2024, 10:00 AM. End: 26 May 2024, 11:59 PM. Products: 25. Max discount: 40%.' },
  { id: 'N9', title: 'Security Alert', description: 'New login detected from Chrome on Windows.', time: '20 May, 2024', category: 'System', priority: 'Urgent', isRead: true, isArchived: false, icon: 'shield-check', iconBg: 'bg-teal-50', iconColor: 'text-teal-500', fullMessage: 'A new login to your account was detected. Browser: Chrome 125.0 on Windows 11. Location: Mumbai, India. IP: 103.xx.xx.45. Time: 20 May 2024, 3:45 PM. If this wasn\'t you, change your password immediately.' },
  { id: 'N10', title: 'System Update', description: 'We have updated our system policy. Please review the changes.', time: '19 May, 2024', category: 'System', priority: 'Low', isRead: true, isArchived: false, icon: 'bell-ring', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', fullMessage: 'Razzia has updated its Terms of Service and Privacy Policy effective 19 May 2024. Key changes include updated data handling procedures and seller commission structure. Please review the changes in your Settings page.' },
  // Extra notifications for pagination
  { id: 'N11', title: 'Low Stock Alert', description: 'Product "Bluetooth Speaker" is running low on stock (5 left).', time: '18 May, 2024', category: 'System', priority: 'High', isRead: true, isArchived: false, icon: 'alert-triangle', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', fullMessage: 'Your product "Bluetooth Speaker" has only 5 units remaining in stock. Consider restocking soon to avoid missed sales.' },
  { id: 'N12', title: 'New Follower', description: 'Amit Verma started following your store.', time: '18 May, 2024', category: 'Orders', priority: 'Low', isRead: true, isArchived: false, icon: 'user-plus', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', customer: 'Amit Verma', fullMessage: 'Amit Verma has started following your store. You now have 1,245 followers. Followers receive notifications about your new products and live streams.' },
  { id: 'N13', title: 'Refund Processed', description: 'Refund of ₹1,299 processed for order #RAZ-1248.', time: '17 May, 2024', category: 'Payments', priority: 'Medium', isRead: true, isArchived: false, icon: 'undo-2', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', relatedOrder: 'RAZ-1248', fullMessage: 'A refund of ₹1,299 has been processed for order #RAZ-1248. Reason: Product damaged during delivery. The refund will reflect in the customer\'s account within 5-7 business days.' },
  { id: 'N14', title: 'Live Stream Ended', description: 'Your live stream "Summer Collection 2024" has ended. 2,450 views.', time: '16 May, 2024', category: 'Live Alerts', priority: 'Low', isRead: true, isArchived: false, icon: 'video-off', iconBg: 'bg-purple-50', iconColor: 'text-purple-400', fullMessage: 'Your live stream "Summer Collection 2024" has ended. Total views: 2,450. Peak viewers: 185. Orders during stream: 23. Revenue generated: ₹34,560.' },
  { id: 'N15', title: 'Product Approved', description: 'Your product "Smart Watch Pro" has been approved and is now live.', time: '15 May, 2024', category: 'System', priority: 'Medium', isRead: true, isArchived: false, icon: 'check-circle', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', fullMessage: 'Your product "Smart Watch Pro" has passed quality review and is now live on Razzia. It may take up to 2 hours to appear in search results.' },
  { id: 'N16', title: 'Commission Update', description: 'Your commission rate has been updated to 8% for Electronics.', time: '14 May, 2024', category: 'Payments', priority: 'Medium', isRead: true, isArchived: false, icon: 'percent', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', fullMessage: 'Your commission rate for the Electronics category has been updated from 10% to 8%, effective immediately. This change applies to all new orders.' },
  { id: 'N17', title: 'Order Cancelled', description: 'Order #RAZ-1240 has been cancelled by the customer.', time: '13 May, 2024', category: 'Orders', priority: 'High', isRead: true, isArchived: false, icon: 'x-circle', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', relatedOrder: 'RAZ-1240', customer: 'Deepak Kumar', fullMessage: 'Order #RAZ-1240 placed by Deepak Kumar has been cancelled. Reason: Changed mind. No refund required as payment was not yet processed.' },
  { id: 'N18', title: 'Store Badge Earned', description: 'Congratulations! You\'ve earned the "Top Seller" badge.', time: '12 May, 2024', category: 'System', priority: 'Low', isRead: true, isArchived: false, icon: 'award', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', fullMessage: 'You\'ve earned the "Top Seller" badge for consistently maintaining high ratings and order volumes. This badge will be displayed on your store profile.' },
];

const STORAGE_KEY = 'razzia_notifications';

export function loadNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [...initialNotifications];
}

export function saveNotifications(data: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUnreadCount(data: Notification[]): number {
  return data.filter(n => !n.isRead && !n.isArchived).length;
}

export function getCategoryCounts(data: Notification[]) {
  const active = data.filter(n => !n.isArchived);
  return {
    unread: active.filter(n => !n.isRead).length,
    orders: active.filter(n => n.category === 'Orders').length,
    payments: active.filter(n => n.category === 'Payments').length,
    liveAlerts: active.filter(n => n.category === 'Live Alerts').length,
    system: active.filter(n => n.category === 'System').length,
  };
}
