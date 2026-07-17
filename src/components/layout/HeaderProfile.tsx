import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, BadgeCheck, Package, ShoppingBag, BarChart3, Star, User, Store, Wallet, LifeBuoy, BellRing, Settings, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeaderProfile() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Mock Vendor Data
  const vendor = {
    name: 'Ajay Store',
    email: 'ajay.store@example.com',
    initials: 'AS',
    isVerified: true,
    status: 'Online',
    stats: {
      products: 45,
      orders: '1.2k',
      revenue: '₹2.4L',
      rating: 4.8
    }
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 cursor-pointer group select-none py-1 px-1 -mr-1 rounded-full hover:bg-slate-50 transition-colors"
      >
        {/* Avatar */}
        <div className={`relative w-[36px] h-[36px] rounded-full overflow-hidden border bg-brand-light flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'border-brand' : 'border-slate-150 group-hover:border-slate-300'}`}>
          <span className="text-[11.5px] font-extrabold text-brand tracking-tight">{vendor.initials}</span>
        </div>

        {/* User Details */}
        <div className="hidden md:block text-left">
          <h4 className={`text-[13.5px] font-bold leading-tight transition-colors ${isOpen ? 'text-brand' : 'text-slate-800 group-hover:text-brand'}`}>
            {vendor.name}
          </h4>
          <span className="text-[11px] font-semibold text-slate-400">
            Vendor
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-brand' : 'text-slate-400 group-hover:text-slate-600'}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 flex flex-col"
          >
            {/* Header Details */}
            <div className="p-5 border-b border-slate-50 bg-slate-50/30">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-brand-light border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                  <span className="text-[16px] font-black text-brand">{vendor.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-[16px] font-bold text-slate-900 truncate">{vendor.name}</h3>
                    {vendor.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 truncate mb-1.5">{vendor.email}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{vendor.status}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white border border-slate-100 rounded-lg py-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[14px] font-black text-slate-800">{vendor.stats.products}</span>
                  <span className="text-[10px] font-semibold text-slate-400">Products</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-lg py-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[14px] font-black text-slate-800">{vendor.stats.orders}</span>
                  <span className="text-[10px] font-semibold text-slate-400">Orders</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-lg py-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[14px] font-black text-emerald-600">{vendor.stats.revenue}</span>
                  <span className="text-[10px] font-semibold text-slate-400">Revenue</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-lg py-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[14px] font-black text-amber-500 flex items-center gap-0.5">
                    {vendor.stats.rating} <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Rating</span>
                </div>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto overscroll-contain">
              {/* Quick Actions */}
              <div className="p-2 border-b border-slate-50">
                <span className="block px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</span>
                
                <button onClick={() => handleNavigate('/profile')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <User className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">My Profile</span>
                </button>
                <button onClick={() => handleNavigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <Store className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Store Settings</span>
                </button>
                <button onClick={() => handleNavigate('/earnings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <Wallet className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Bank & Wallet</span>
                </button>
                <button onClick={() => handleNavigate('/analytics')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <BarChart3 className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Analytics</span>
                </button>
                <button onClick={() => handleNavigate('/help-support')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <LifeBuoy className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Help & Support</span>
                </button>
                <button onClick={() => handleNavigate('/settings?tab=notifications')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <BellRing className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Notification Preferences</span>
                </button>
              </div>

              {/* Account Actions */}
              <div className="p-2">
                <span className="block px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</span>
                
                <button onClick={() => handleNavigate('/profile')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <Settings className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Edit Profile</span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <Moon className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand transition-colors" />
                    <span className="text-[13.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Dark Theme</span>
                  </div>
                  <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                     <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </button>
                <button onClick={() => handleNavigate('/login')} className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-red-50 transition-colors text-left group">
                  <LogOut className="w-[18px] h-[18px] text-red-400 group-hover:text-red-600 transition-colors" />
                  <span className="text-[13.5px] font-bold text-red-500 group-hover:text-red-600 transition-colors">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
