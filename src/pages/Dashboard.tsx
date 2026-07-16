import React from 'react';
import { Calendar, ChevronDown, ShoppingBag, ShoppingCart, Users, Eye } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import OrderStatusChart from '../components/dashboard/OrderStatusChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopProducts from '../components/dashboard/TopProducts';
import LiveStreamCard from '../components/dashboard/LiveStreamCard';
import QuickActions from '../components/dashboard/QuickActions';
import PromoBanner from '../components/dashboard/PromoBanner';

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      
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
        <button className="flex items-center gap-2.5 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto">
          <Calendar className="w-4.5 h-4.5 text-slate-400" />
          <span>May 16 - May 22, 2024</span>
          <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Stats, Charts, Lists & Promo */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row gap-4">
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
            <button className="bg-white border border-slate-100 px-5 h-[88px] sm:h-auto rounded-2xl shadow-sm flex items-center justify-center shrink-0 hover:border-emerald-200 transition-colors group">
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

    </div>
  );
}
