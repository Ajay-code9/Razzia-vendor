import React from 'react';
import { Menu, Search } from 'lucide-react';
import HeaderNotifications from './HeaderNotifications';
import HeaderProfile from './HeaderProfile';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[64px] px-4 md:px-6 bg-white border-b border-slate-100">
      
      {/* Left: Hamburger and Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Button */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 rounded-lg hover:bg-slate-50 md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar (hidden on mobile, visible on tablet/desktop) */}
        <div className="relative hidden sm:block w-full max-w-[340px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full h-9.5 pl-9 pr-20 text-[13px] bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-lg select-none">
              Ctrl + /
            </span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4 md:gap-5">
        
        {/* Mobile Search Button (shows up on small screens instead of full input) */}
        <button className="p-2 text-slate-500 rounded-lg hover:bg-slate-50 sm:hidden">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <HeaderNotifications />

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-slate-100" />

        {/* User Profile */}
        <HeaderProfile />

      </div>

    </header>
  );
}
