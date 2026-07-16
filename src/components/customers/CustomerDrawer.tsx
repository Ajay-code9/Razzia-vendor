import { X, Mail, Phone, MapPin, Calendar, CreditCard, ShoppingBag, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Customer } from '../../utils/customersData';

interface CustomerDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerDrawer({ customer, isOpen, onClose }: CustomerDrawerProps) {
  if (!isOpen || !customer) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs" 
      />

      {/* Slide-over Drawer Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-100 shadow-2xl flex flex-col justify-between font-sans text-slate-800 text-left"
      >
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="text-[16px] font-black text-slate-850">Customer Profile</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              customer.status === 'Inactive' ? 'bg-slate-50 text-slate-500 border border-slate-100' :
              customer.status === 'VIP' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
              'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {customer.status}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable details wrapper */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Hero Card Profile */}
          <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-brand to-[#FF4D52] flex items-center justify-center font-bold text-white text-[18px] shadow-md shadow-brand/10 shrink-0">
              {customer.avatarLetter}
            </div>
            <div className="leading-tight text-left min-w-0">
              <h3 className="text-[18px] font-black text-slate-850 truncate">{customer.name}</h3>
              <span className="text-[11.5px] text-slate-450 font-semibold block mt-0.5">ID: {customer.id}</span>
              <span className="text-[11px] text-slate-400 font-bold block mt-0.5">Join Date: {customer.joinDate}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/20 text-left">
              <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Total Spent
              </span>
              <span className="text-[18px] font-black text-slate-850 block mt-1.5 leading-none">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/20 text-left">
              <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                Total Orders
              </span>
              <span className="text-[18px] font-black text-slate-850 block mt-1.5 leading-none">
                {customer.totalOrders}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5">
            <h4 className="text-[12.5px] font-bold text-slate-450 uppercase tracking-wider">Contact Details</h4>
            <div className="space-y-2.5 text-[13px] text-slate-655 font-medium">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{customer.address}</span>
              </div>
            </div>
          </div>

          {/* Favorite Categories */}
          <div className="space-y-3">
            <h4 className="text-[12.5px] font-bold text-slate-450 uppercase tracking-wider">Favorite Categories</h4>
            <div className="flex flex-wrap gap-2">
              {customer.favoriteCategories.map((cat, i) => (
                <span 
                  key={i} 
                  className="bg-slate-50 border border-slate-150 text-slate-600 text-[11.5px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="space-y-3">
            <h4 className="text-[12.5px] font-bold text-slate-450 uppercase tracking-wider">Recent Purchases</h4>
            <div className="space-y-2.5">
              {customer.recentPurchases.map((pur) => (
                <div key={pur.id} className="flex justify-between items-center p-3 border border-slate-100/50 rounded-xl bg-slate-50/20 text-[12.5px] font-bold">
                  <div className="text-left min-w-0">
                    <span className="text-slate-800 block truncate leading-none">{pur.productName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">TXN: {pur.id} | Date: {pur.date}</span>
                  </div>
                  <span className="text-slate-850 shrink-0">₹{pur.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities timeline */}
          <div className="space-y-3">
            <h4 className="text-[12.5px] font-bold text-slate-450 uppercase tracking-wider">Recent Activity</h4>
            <div className="relative border-l border-slate-100 pl-4 ml-1 space-y-4 text-[12.5px] font-bold">
              {customer.activities.map((act) => (
                <div key={act.id} className="relative text-left">
                  {/* timeline dot */}
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-white bg-slate-400 shadow-sm" />
                  <span className="text-slate-700 block leading-none">{act.action}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer footer action actions buttons */}
        <div className="p-5 border-t border-slate-50 bg-slate-50/50 grid grid-cols-2 gap-3.5 shrink-0">
          <button 
            onClick={() => alert(`Messaging customer ${customer.name}...`)}
            className="h-10 border border-slate-150 hover:bg-slate-100 text-slate-700 font-bold text-[12.5px] rounded-xl transition-all cursor-pointer bg-white"
          >
            Message Customer
          </button>
          <button 
            onClick={() => alert(`Calling customer ${customer.name}...`)}
            className="h-10 bg-brand hover:bg-brand-hover text-white font-extrabold text-[12.5px] rounded-xl transition-all cursor-pointer shadow-sm shadow-brand/10"
          >
            Call Customer
          </button>
        </div>

      </motion.div>
    </>
  );
}
