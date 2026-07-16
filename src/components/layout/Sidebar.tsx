import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  Package, 
  Radio, 
  BarChart3, 
  Users, 
  CircleDollarSign, 
  Send, 
  Bell,
  Settings, 
  HelpCircle, 
  LogOut,
  X,
  UserCircle
} from 'lucide-react';
import { loadNotifications, getUnreadCount } from '../../utils/notificationsData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const unreadCount = useMemo(() => getUnreadCount(loadNotifications()), []);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Orders', path: '/orders', icon: ClipboardList, badge: 12 },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Live Streaming', path: '/live/setup', icon: Radio },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Earnings', path: '/earnings', icon: CircleDollarSign },
    { name: 'Marketing', path: '/marketing', icon: Send },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount || undefined },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Vendor Profile', path: '/profile', icon: UserCircle },
    { name: 'Help & Support', path: '/help-support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 md:border-b-0">
          <div className="flex items-center gap-2 select-none">
            <img src="/logo.svg" alt="Razzia" className="h-10 w-auto object-contain" />
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 rounded-lg hover:bg-slate-50 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3.5 py-2.5 text-[13.5px] font-semibold rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-light text-brand shadow-xs' 
                      : 'text-slate-500 hover:text-brand hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-white text-[10px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={() => alert('Logging out...')}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 text-[13.5px] font-semibold text-slate-500 hover:text-brand hover:bg-slate-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
