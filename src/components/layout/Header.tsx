import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[76px] px-4 md:px-8 bg-white border-b border-slate-100">
      
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
        <div className="relative hidden sm:block w-full max-w-[380px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full h-11 pl-10 pr-20 text-[13.5px] bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-lg select-none">
              Ctrl + /
            </span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Mobile Search Button (shows up on small screens instead of full input) */}
        <button className="p-2 text-slate-500 rounded-lg hover:bg-slate-50 sm:hidden">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 bg-slate-50 border border-slate-100 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px] text-slate-600" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white leading-none border border-white">
            5
          </span>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-8 bg-slate-100" />

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group select-none">
          {/* Avatar */}
          <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden border border-slate-150 bg-brand-light flex items-center justify-center shrink-0">
            <span className="text-[11.5px] font-extrabold text-brand tracking-tight">AS</span>
            <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* User Details */}
          <div className="hidden md:block text-left">
            <h4 className="text-[13.5px] font-bold text-slate-800 leading-tight group-hover:text-brand transition-colors">
              Ajay Store
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              Vendor
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
        </div>

      </div>

    </header>
  );
}
