import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  Download, 
  Search, 
  ChevronDown, 
  Eye, 
  ShoppingCart, 
  Users, 
  Target, 
  Gift, 
  ArrowUpRight, 
  Info,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import type { Product } from '../utils/productsData';
import { loadProducts } from '../utils/productsData';

// TypeScript interfaces
interface KPICardProps {
  title: string;
  metric: string;
  metricPrefix?: string;
  metricSuffix?: string;
  description: string;
  trend: string;
  isPositive: boolean;
  sparklineData: { val: number }[];
  color: string;
  icon: React.ReactNode;
}

// KPI sparkline mockup datasets
const kpiSparklines = {
  revenue: [{ val: 32 }, { val: 40 }, { val: 35 }, { val: 45 }, { val: 42 }, { val: 48 }, { val: 45.68 }],
  orders: [{ val: 120 }, { val: 140 }, { val: 130 }, { val: 160 }, { val: 145 }, { val: 150 }, { val: 156 }],
  customers: [{ val: 980 }, { val: 1100 }, { val: 1050 }, { val: 1200 }, { val: 1150 }, { val: 1220 }, { val: 1248 }],
  views: [{ val: 10500 }, { val: 11200 }, { val: 11800 }, { val: 12100 }, { val: 11900 }, { val: 12300 }, { val: 12540 }],
  conversion: [{ val: 2.1 }, { val: 2.3 }, { val: 2.2 }, { val: 2.5 }, { val: 2.38 }, { val: 2.41 }, { val: 2.45 }],
  aov: [{ val: 280 }, { val: 290 }, { val: 285 }, { val: 295 }, { val: 288 }, { val: 291 }, { val: 293 }]
};

// Main Sales Chart Weekly/Monthly/Yearly dataset mockup
const chartDataWeekly = [
  { day: 'May 16', 'This Week': 21000, 'Last Week': 15000 },
  { day: 'May 17', 'This Week': 30000, 'Last Week': 20000 },
  { day: 'May 18', 'This Week': 22000, 'Last Week': 19000 },
  { day: 'May 19', 'This Week': 31000, 'Last Week': 25000 },
  { day: 'May 20', 'This Week': 38000, 'Last Week': 29000 },
  { day: 'May 21', 'This Week': 34000, 'Last Week': 27050 },
  { day: 'May 22', 'This Week': 45680, 'Last Week': 33000 }
];

const chartDataMonthly = [
  { day: 'Week 1', 'This Week': 120000, 'Last Week': 110000 },
  { day: 'Week 2', 'This Week': 145000, 'Last Week': 130000 },
  { day: 'Week 3', 'This Week': 158000, 'Last Week': 142000 },
  { day: 'Week 4', 'This Week': 195000, 'Last Week': 175000 }
];

// Donut category details
const initialPieData = [
  { name: 'Electronics', value: 18450, color: '#3B82F6', percentage: '40.4%' },
  { name: 'Fashion', value: 12320, color: '#10B981', percentage: '27.0%' },
  { name: 'Accessories', value: 7850, color: '#F59E0B', percentage: '17.2%' },
  { name: 'Home & Kitchen', value: 4560, color: '#FE060D', percentage: '10.0%' },
  { name: 'Others', value: 2500, color: '#8B5CF6', percentage: '5.4%' }
];

// Country map locations mockup
const mapLocations = [
  { name: 'India', value: '65.4%', count: 816, x: 700, y: 220, color: '#FE060D' },
  { name: 'USA', value: '12.8%', count: 160, x: 260, y: 160, color: '#3B82F6' },
  { name: 'UK', value: '6.2%', count: 77, x: 480, y: 130, color: '#8B5CF6' },
  { name: 'Canada', value: '4.1%', count: 51, x: 240, y: 110, color: '#F59E0B' },
  { name: 'Others', value: '11.5%', count: 144, x: 800, y: 310, color: '#64748B' }
];

// Interactive counter animation helper
function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const increment = value / (duration / 16); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        clearInterval(timer);
        setCurrent(value);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{current.toLocaleString('en-IN')}</span>;
}

export default function AnalyticsPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Loading, empty, and offline simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'This Week' | 'This Month'>('This Week');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [dateRangeText, setDateRangeText] = useState('May 16, 2024 - May 22, 2024');
  
  // Search state in orders grid
  const [orderQuery, setOrderQuery] = useState('');
  
  // Custom interactive Map hovers
  const [hoveredCountry, setHoveredCountry] = useState<typeof mapLocations[0] | null>(null);
  
  // Filter sidebar toggle
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Dropdown list states
  const [selectedCountry, setSelectedCountry] = useState('All');
  
  // Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  // Inventory items
  const products = useMemo(() => loadProducts().slice(0, 5), []);

  // Filter Categories
  const categoryChartData = useMemo(() => {
    return initialPieData;
  }, []);

  // Main Sales Chart Data selection
  const chartData = useMemo(() => {
    return timeFilter === 'This Week' ? chartDataWeekly : chartDataMonthly;
  }, [timeFilter]);

  // Orders Table mockup matching Canva rows
  const ordersList = useMemo(() => [
    { id: '#RAZ-1256', customer: 'Neha Patel', avatar: 'NP', date: 'May 22, 2024 10:30 AM', products: 'Wireless Headphones, Smart Watch', amount: 3798, status: 'Delivered', payment: 'Paid' },
    { id: '#RAZ-1255', customer: 'Rohit Sharma', avatar: 'RS', date: 'May 22, 2024 09:15 AM', products: 'Trendy Handbag', amount: 1099, status: 'Shipped', payment: 'Paid' },
    { id: '#RAZ-1254', customer: 'Priya Singh', avatar: 'PS', date: 'May 22, 2024 08:45 AM', products: 'Wireless Earbuds, Sunglasses', amount: 2098, status: 'Processing', payment: 'COD' },
    { id: '#RAZ-1253', customer: 'Karan Mehta', avatar: 'KM', date: 'May 21, 2024 04:20 PM', products: 'Sunglasses', amount: 599, status: 'Delivered', payment: 'Paid' },
    { id: '#RAZ-1252', customer: 'Anjali Shah', avatar: 'AS', date: 'May 21, 2024 01:10 PM', products: 'Smart Watch', amount: 2499, status: 'Cancelled', payment: 'Refunded' }
  ], []);

  // Filter & Search table
  const filteredOrders = useMemo(() => {
    return ordersList.filter(ord => {
      const query = orderQuery.toLowerCase();
      const matchesSearch = ord.id.toLowerCase().includes(query) || 
                            ord.customer.toLowerCase().includes(query) || 
                            ord.products.toLowerCase().includes(query);
      
      return matchesSearch;
    });
  }, [ordersList, orderQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage]);

  const handleExportCSV = () => {
    // Generate simple mock CSV template
    const headers = 'Order ID,Customer,Date,Products,Amount,Status,Payment\n';
    const rows = ordersList.map(o => `${o.id},${o.customer},${o.date},"${o.products}",₹${o.amount},${o.status},${o.payment}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `razzia_orders_report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('Orders analytics report downloaded as CSV.', 'success');
  };

  const handleChartExport = () => {
    showToast('Exporting chart visual frame... (Simulation only)', 'info');
  };

  const handleSimulatorTrigger = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Loaded active filtered records.', 'success');
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">
      
      {/* Title & Filter Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Analytics Overview
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Analytics</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker trigger */}
          <div className="relative">
            <button 
              onClick={() => showToast('Toggle Calendar selector dialog', 'info')}
              className="flex items-center gap-2.5 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-655 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <Calendar className="w-4.5 h-4.5 text-slate-400" />
              <span>{dateRangeText}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Setup Simulator filter drawer */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-655 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Simulator Filters Panel Option Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50 border border-slate-100 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left overflow-hidden shadow-inner"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">Country Filter</label>
              <select 
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  handleSimulatorTrigger();
                }}
                className="h-10 px-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 text-[13px] font-bold text-slate-650 cursor-pointer"
              >
                <option value="All">All Countries</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">Simulation Mode</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 2000);
                    showToast('Displaying loading skeletons.', 'info');
                  }}
                  className="flex-1 h-10 px-3 bg-white border border-slate-100 hover:bg-slate-50 text-[12px] font-bold text-slate-650 rounded-xl transition-colors cursor-pointer"
                >
                  Trigger skeletons
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Skeleton / KPI Metric row */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                <div className="w-16 h-3 bg-slate-100 rounded" />
              </div>
              <div className="h-6 bg-slate-150 rounded w-2/3" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Revenue */}
          <KPICard 
            title="Total Revenue"
            metric="45680"
            metricPrefix="₹"
            description="vs last 7 days"
            trend="+ 20.8%"
            isPositive={true}
            sparklineData={kpiSparklines.revenue}
            color="#FE060D"
            icon={<DollarSign className="w-5 h-5 text-brand" />}
          />

          {/* Card 2: Orders */}
          <KPICard 
            title="Total Orders"
            metric="156"
            description="vs last 7 days"
            trend="+ 15.6%"
            isPositive={true}
            sparklineData={kpiSparklines.orders}
            color="#3B82F6"
            icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
          />

          {/* Card 3: Customers */}
          <KPICard 
            title="Total Customers"
            metric="1248"
            description="vs last 7 days"
            trend="+ 18.4%"
            isPositive={true}
            sparklineData={kpiSparklines.customers}
            color="#8B5CF6"
            icon={<Users className="w-5 h-5 text-purple-500" />}
          />

          {/* Card 4: Views */}
          <KPICard 
            title="Total Views"
            metric="12540"
            description="vs last 7 days"
            trend="+ 12.3%"
            isPositive={true}
            sparklineData={kpiSparklines.views}
            color="#F59E0B"
            icon={<Eye className="w-5 h-5 text-amber-500" />}
          />

          {/* Card 5: Conversion Rate */}
          <KPICard 
            title="Conversion Rate"
            metric="2.45"
            metricSuffix="%"
            description="vs last 7 days"
            trend="+ 8.6%"
            isPositive={true}
            sparklineData={kpiSparklines.conversion}
            color="#10B981"
            icon={<Target className="w-5 h-5 text-emerald-500" />}
          />

          {/* Card 6: Average Order Value */}
          <KPICard 
            title="Avg. Order Value"
            metric="293"
            metricPrefix="₹"
            description="vs last 7 days"
            trend="+ 5.2%"
            isPositive={true}
            sparklineData={kpiSparklines.aov}
            color="#EC4899"
            icon={<Gift className="w-5 h-5 text-pink-500" />}
          />

        </div>
      )}

      {/* Section 2: Charts Row (Revenue & Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-[16px] font-black text-slate-850 tracking-tight flex items-center gap-1.5">
                Revenue Overview
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Track growth vectors and comparison metrics</p>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="h-9 px-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-brand/40 text-[12px] font-bold text-slate-655 cursor-pointer"
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>

              <button 
                onClick={handleChartExport}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg cursor-pointer transition-colors"
                title="Download Chart"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[280px] pt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey={timeFilter === 'This Week' ? 'day' : 'day'} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value) => [value ? `₹${Number(value).toLocaleString('en-IN')}` : '₹0', 'Revenue']}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, fontWeight: 700 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="This Week" 
                  stroke="#FE060D" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#FE060D', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Last Week" 
                  stroke="#94A3B8" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  dot={{ r: 3, stroke: '#94A3B8', strokeWidth: 1.5, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution Donut chart */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-[16px] font-black text-slate-850 tracking-tight">
                Sales by Category
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Filter sales ratios by categories</p>
            </div>
            
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="h-9 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-bold text-slate-655 cursor-pointer"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
            {/* Legend indicators */}
            <div className="relative w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    formatter={(val) => val ? `₹${Number(val).toLocaleString('en-IN')}` : '₹0'}
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1E293B', color: '#fff', fontSize: '11px' }}
                  />
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Core metrics overlay inside the donut center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[20px] font-black text-slate-800">₹45,680</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Sales</span>
              </div>
            </div>
          </div>

          {/* Legend items list */}
          <div className="space-y-1.5 pt-2 border-t border-slate-50 max-h-[140px] overflow-y-auto">
            {categoryChartData.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  const filterVal = activeCategoryFilter === item.name ? null : item.name;
                  setActiveCategoryFilter(filterVal);
                  showToast(filterVal ? `Filtered dashboard to: ${filterVal}` : 'Cleared category filter.', 'info');
                }}
                className={`flex items-center justify-between text-[11.5px] font-bold py-1 px-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                  activeCategoryFilter === item.name ? 'bg-[#FFF0F0] text-brand' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-800">₹{item.value.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 font-extrabold font-mono">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Row 3: Top Products, Traffic, Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Top Selling Products */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-[16px] font-black text-slate-850 tracking-tight">
              Top Selling Products
            </h3>
            <Link 
              to="/products"
              className="text-[12px] font-bold text-brand hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 space-y-4 pt-4">
            {products.map((p, idx) => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/products/edit/${p.id}`)}
                className="flex items-center justify-between gap-3 group cursor-pointer border-b border-slate-50/50 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-black text-slate-400 w-4 font-mono">{idx + 1}</span>
                  <div className="w-10 h-10 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12.5px] font-bold text-slate-800 truncate block group-hover:text-brand transition-colors">{p.name}</span>
                    <span className="text-[11px] text-slate-400 font-semibold">{idx === 0 ? '45' : idx === 1 ? '32' : idx === 2 ? '28' : idx === 3 ? '26' : '24'} sold</span>
                  </div>
                </div>
                <span className="text-[12.5px] font-extrabold text-slate-800">₹{p.price.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Traffic Sources */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-[16px] font-black text-slate-850 tracking-tight">
              Traffic Source
            </h3>
            <button 
              onClick={() => showToast('Displaying extended traffic source log', 'info')}
              className="text-[12px] font-bold text-brand hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-5 pt-5">
            {/* Direct */}
            <TrafficBar label="Direct" percentage={40.5} color="#FE060D" />
            
            {/* Live Stream */}
            <TrafficBar label="Live Stream" percentage={24.3} color="#3B82F6" />
            
            {/* Social Media */}
            <TrafficBar label="Social Media" percentage={18.6} color="#F59E0B" />
            
            {/* Search Engine */}
            <TrafficBar label="Search Engine" percentage={12.1} color="#10B981" />
            
            {/* Others */}
            <TrafficBar label="Others" percentage={4.5} color="#8B5CF6" />
          </div>
        </div>

        {/* Column 3: Customer Insights & Locations */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-5">
          {/* Customer Insights header */}
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-[16px] font-black text-slate-850 tracking-tight">
              Customer Insights
            </h3>
            <button 
              onClick={() => showToast('Displaying customer log', 'info')}
              className="text-[12px] font-bold text-brand hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Insights stats row */}
          <div className="grid grid-cols-2 gap-4 pb-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">New Customers</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[20px] font-black text-slate-800">342</span>
                <span className="text-[10px] text-emerald-600 font-extrabold flex items-center">↑ 16.2%</span>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="w-full h-8 pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{val: 10}, {val: 14}, {val: 12}, {val: 18}, {val: 15}, {val: 22}]}>
                    <Area type="monotone" dataKey="val" stroke="#10B981" fillOpacity={0.06} fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Returning</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[20px] font-black text-slate-800">906</span>
                <span className="text-[10px] text-emerald-600 font-extrabold flex items-center">↑ 12.8%</span>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="w-full h-8 pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{val: 30}, {val: 35}, {val: 32}, {val: 40}, {val: 38}, {val: 45}]}>
                    <Area type="monotone" dataKey="val" stroke="#10B981" fillOpacity={0.06} fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Locations Map section */}
          <div className="border-t border-slate-50 pt-4 text-left">
            <h4 className="text-[12.5px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Customers by Location</h4>
            
            {/* World Map vector mockup representation */}
            <div className="h-[120px] bg-slate-50 border border-slate-100 rounded-xl relative flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-200 fill-current opacity-80 pointer-events-none">
                {/* stylized continents dots grid or outline paths */}
                <path d="M150,150 Q180,100 240,120 T300,180 T260,250 T150,220 Z" /> {/* North America */}
                <path d="M220,260 Q260,320 280,380 T250,450 T200,350 T220,260 Z" /> {/* South America */}
                <path d="M450,120 Q500,80 550,120 T620,150 T560,240 T450,200 Z" /> {/* Europe */}
                <path d="M500,220 Q550,260 580,350 T530,450 T480,350 T500,220 Z" /> {/* Africa */}
                <path d="M600,120 Q700,80 850,120 T900,260 T750,320 T650,220 Z" /> {/* Asia */}
                <path d="M780,330 Q840,350 860,390 T800,420 T760,360 Z" /> {/* Australia */}
              </svg>

              {/* Map Interactive points nodes */}
              {mapLocations.map((loc) => {
                const isHovered = hoveredCountry?.name === loc.name;
                return (
                  <button
                    key={loc.name}
                    onMouseEnter={() => setHoveredCountry(loc)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => {
                      showToast(`Country selected: ${loc.name}`, 'info');
                    }}
                    className="absolute w-3.5 h-3.5 rounded-full border-2 border-white cursor-pointer shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform duration-200"
                    style={{ 
                      left: `${loc.x / 10}%`, 
                      top: `${loc.y / 5}%`, 
                      backgroundColor: loc.color 
                    }}
                    aria-label={`Show metrics for ${loc.name}`}
                  />
                );
              })}

              {/* Country tooltip bubble */}
              {hoveredCountry && (
                <div 
                  className="absolute z-10 bg-slate-900 text-white rounded-lg p-2.5 shadow-lg text-[10px] leading-tight flex flex-col pointer-events-none select-none text-left"
                  style={{
                    left: `${hoveredCountry.x / 10}%`,
                    top: `${hoveredCountry.y / 5 - 22}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className="font-extrabold text-[11px] border-b border-white/10 pb-0.5 mb-1 text-brand-light">{hoveredCountry.name}</span>
                  <span>Ratio: <strong className="text-white">{hoveredCountry.value}</strong></span>
                  <span>Customers: <strong className="text-white">{hoveredCountry.count}</strong></span>
                </div>
              )}
            </div>

            {/* Rank Location List */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
              {mapLocations.map((loc) => (
                <div key={loc.name} className="bg-slate-50/50 border border-slate-100 rounded-lg p-2 text-center text-[11px]">
                  <span className="font-extrabold text-slate-800 block truncate">{loc.name}</span>
                  <span className="font-black text-brand text-[12px] block mt-0.5">{loc.value}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Row 4: Recent Orders grid data table */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-2.5">
          <div>
            <h3 className="text-[16px] font-black text-slate-850 tracking-tight">
              Recent Orders
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Inspect latest transaction records and payments status</p>
          </div>
          
          <div className="flex items-center gap-3.5 self-start sm:self-auto flex-wrap">
            {/* Table Search query */}
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={orderQuery}
                onChange={(e) => {
                  setOrderQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search orders..."
                className="w-full h-9 pl-9 pr-3.5 text-[12px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white bg-slate-50/20 transition-all text-slate-800 font-medium"
              />
            </div>
            
            {/* Export data */}
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 h-9 border border-slate-100 hover:bg-slate-50 text-[12px] font-bold text-slate-655 rounded-xl cursor-pointer shadow-xs bg-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <Link 
              to="/orders"
              className="text-[12px] font-bold text-brand hover:underline"
            >
              View All Orders
            </Link>
          </div>
        </div>

        {/* Data list table */}
        <div className="overflow-x-auto select-none">
          <table className="w-full border-collapse text-[13px] text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((ord) => (
                  <tr 
                    key={ord.id} 
                    onClick={() => navigate(`/orders/${ord.id}`)}
                    className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-brand group-hover:underline">{ord.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 font-bold text-[9.5px] flex items-center justify-center text-slate-600">
                          {ord.avatar}
                        </div>
                        <span className="font-semibold text-slate-800">{ord.customer}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{ord.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 truncate max-w-[200px]" title={ord.products}>{ord.products}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-850">₹{ord.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        ord.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        ord.status === 'Processing' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        ord.payment === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {ord.payment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${ord.id}`);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">No recent orders matching search query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination list */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 pt-4 select-none">
            <span className="text-[12px] text-slate-400 font-bold">Showing page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// KPI widget Component
function KPICard({ 
  title, 
  metric, 
  metricPrefix = '', 
  metricSuffix = '', 
  description, 
  trend, 
  isPositive, 
  sparklineData, 
  color, 
  icon 
}: KPICardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between min-h-[145px] hover:shadow-widget transition-shadow duration-200 group relative"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-200">
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">{title}</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[20px] font-black text-slate-850 tracking-tight leading-none">
              {metricPrefix}
              <AnimatedNumber value={parseFloat(metric)} />
              {metricSuffix}
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline & trend metrics */}
      <div className="flex items-center justify-between gap-4 mt-3 border-t border-slate-50 pt-2.5">
        <div className="text-[10px] font-semibold text-slate-400 text-left">
          <span className={`font-extrabold mr-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
          <span>{description}</span>
        </div>
        {/* Sparkline box */}
        <div className="w-16 h-[24px] pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1.5} fillOpacity={0.04} fill={color} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// Traffic progress item Component
function TrafficBar({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="space-y-1.5 select-none text-left">
      <div className="flex justify-between items-baseline text-[12px] font-bold">
        <span className="text-slate-800">{label}</span>
        <span className="text-slate-500">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full" 
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
