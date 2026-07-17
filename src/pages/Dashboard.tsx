import React, { useState } from 'react';
import { Calendar, ChevronDown, ShoppingBag, ShoppingCart, Users, Eye, X, Star, Heart, Share2, Phone, MapPin, ExternalLink, Radio } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import OrderStatusChart from '../components/dashboard/OrderStatusChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopProducts from '../components/dashboard/TopProducts';
import LiveStreamCard from '../components/dashboard/LiveStreamCard';
import QuickActions from '../components/dashboard/QuickActions';
import PromoBanner from '../components/dashboard/PromoBanner';
import DateRangeSelector from '../components/common/DateRangeSelector';

export default function DashboardPage() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto relative">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-[13px] font-semibold text-slate-400 mt-1">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Date Selector */}
        <DateRangeSelector className="self-start sm:self-auto" />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Stats, Charts, Lists & Promo */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-4">
            <StatCard 
              title="Total Sales" 
              value="₹1,24,560" 
              percentage="18.4%" 
              subtext="vs last 7 days" 
              icon={<ShoppingBag className="w-5 h-5" />} 
              iconBgColor="bg-[#FFF0F0]" 
              iconColor="text-brand" 
            />
            <StatCard 
              title="Total Orders" 
              value="1,248" 
              percentage="12.6%" 
              subtext="vs last 7 days" 
              icon={<ShoppingCart className="w-5 h-5" />} 
              iconBgColor="bg-blue-50" 
              iconColor="text-blue-500" 
            />
            <StatCard 
              title="Total Customers" 
              value="856" 
              percentage="8.3%" 
              subtext="vs last 7 days" 
              icon={<Users className="w-5 h-5" />} 
              iconBgColor="bg-purple-50" 
              iconColor="text-purple-500" 
            />
            
            {/* Quick Views Icon Button Card */}
            <button 
              onClick={() => setShowPreviewModal(true)}
              title="Preview Customer Storefront"
              className="bg-white border border-slate-100 px-5 h-[88px] sm:h-auto rounded-2xl shadow-sm flex items-center justify-center shrink-0 hover:border-emerald-250 hover:bg-emerald-50/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Charts Row */}
          <div className="flex flex-col xl:flex-row gap-6">
            <SalesChart />
            <OrderStatusChart />
          </div>

          {/* Table & List Row */}
          <div className="flex flex-col xl:flex-row gap-6">
            <RecentOrders />
            <TopProducts />
          </div>

          {/* Bottom Banner */}
          <PromoBanner />

        </div>

        {/* Right Side: Streaming & Quick Actions */}
        <div className="w-full lg:w-[360px] xl:w-[380px] flex flex-col md:flex-row lg:flex-col gap-6 shrink-0">
          <LiveStreamCard />
          <QuickActions />
        </div>

      </div>

      {/* Storefront Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[480px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 z-10 flex flex-col"
            >
              {/* Header bar simulating a browser/preview view */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[11.5px] font-bold text-slate-400 ml-2">razzia.in/ajay-store</span>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Storefront Simulated Content */}
              <div className="flex-1 overflow-y-auto max-h-[500px] text-left">
                
                {/* Store Header Banner */}
                <div className="relative h-24 bg-gradient-to-r from-red-650 to-brand flex items-end px-5 pb-3">
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Profile Info Overlay */}
                  <div className="flex items-center gap-3 translate-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center shrink-0">
                      <span className="text-xl font-black text-brand">AS</span>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-[17px] font-extrabold text-white drop-shadow-sm flex items-center gap-1.5">
                        Ajay Store
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                        <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>4.9 (128 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacing for Avatar Offset */}
                <div className="h-8" />

                {/* Store stats */}
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                  <div className="grid grid-cols-3 gap-6 w-full text-center">
                    <div>
                      <div className="text-[14px] font-extrabold text-slate-800">420</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Products</div>
                    </div>
                    <div>
                      <div className="text-[14px] font-extrabold text-slate-800">12k</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Followers</div>
                    </div>
                    <div>
                      <div className="text-[14px] font-extrabold text-slate-800">98%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Active Live Stream Mock */}
                <div className="p-5 border-b border-slate-50 bg-[#FE060D]/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[12px] font-bold text-brand uppercase tracking-wider">Live streaming now</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">1.2k watching</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-video shadow-md border border-[#FE060D]/10 bg-slate-800">
                    <img 
                      src="/api/placeholder/400/225" 
                      alt="Live Stream Stream" 
                      className="w-full h-full object-cover opacity-80" 
                      onError={(e) => {
                        // Fallback image gradient
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-3.5">
                      <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded self-start flex items-center gap-1 shadow-sm">
                        <Radio className="w-3 h-3" /> LIVE
                      </span>
                      <div>
                        <h5 className="text-[13px] font-bold text-white drop-shadow-sm mb-0.5">Tech Gadgets Live Showcase</h5>
                        <p className="text-[10px] text-white/80">Exclusive live discounts & coupons inside!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Products */}
                <div className="p-5">
                  <h5 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Featured Products</h5>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Wireless Earbuds', price: '₹1,299', oldPrice: '₹2,499' },
                      { name: 'Smart Watch', price: '₹965', oldPrice: '₹1,999' }
                    ].map((p, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:border-slate-200 transition-colors">
                        <div className="h-28 bg-slate-50 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{p.name} Image</span>
                        </div>
                        <div className="p-3">
                          <h6 className="text-[12.5px] font-bold text-slate-850 truncate">{p.name}</h6>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[13.5px] font-extrabold text-slate-800">{p.price}</span>
                            <span className="text-[10.5px] font-medium text-slate-400 line-through">{p.oldPrice}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* View full page footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center">
                <a 
                  href="/store-preview" 
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-[13px] font-extrabold text-brand hover:text-red-700 transition-colors"
                >
                  <span>Open Full Storefront</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
