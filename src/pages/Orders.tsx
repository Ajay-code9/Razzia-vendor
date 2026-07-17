import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  SlidersHorizontal, 
  Download, 
  Plus, 
  Eye, 
  MoreVertical,
  Headphones,
  Watch,
  ShoppingBag,
  Glasses,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockOrders } from '../utils/ordersData';
import type { Order, ProductItem } from '../utils/ordersData';
import Badge from '../components/common/Badge';
import FilterSelect from '../components/common/FilterSelect';
import DateRangeSelector from '../components/common/DateRangeSelector';

// Product Icon Renderer
const ProductThumb = ({ type }: { type: ProductItem['iconName'] }) => {
  const getIcon = () => {
    switch (type) {
      case 'headphones':
        return <Headphones className="w-4 h-4 text-indigo-600" />;
      case 'watch':
        return <Watch className="w-4 h-4 text-emerald-600" />;
      case 'bag':
        return <ShoppingBag className="w-4 h-4 text-rose-600" />;
      case 'glasses':
        return <Glasses className="w-4 h-4 text-amber-600" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-sky-600" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'headphones': return 'bg-indigo-50 border-indigo-100';
      case 'watch': return 'bg-emerald-50 border-emerald-100';
      case 'bag': return 'bg-rose-50 border-rose-100';
      case 'glasses': return 'bg-amber-50 border-amber-100';
      case 'activity': return 'bg-sky-50 border-sky-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getBg()}`}>
      {getIcon()}
    </div>
  );
};

// Payment Method Logo Renderer
const PaymentLogo = ({ method }: { method: Order['paymentMethod'] }) => {
  switch (method) {
    case 'UPI':
      return (
        <span className="text-[12px] font-black italic tracking-wide text-emerald-600 font-serif leading-none select-none">
          UPI
        </span>
      );
    case 'VISA':
      return (
        <span className="text-[12px] font-black italic tracking-wider text-blue-800 font-sans leading-none select-none">
          VISA
        </span>
      );
    case 'Mastercard':
      return (
        <div className="flex items-center -space-x-1.5 select-none shrink-0">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 opacity-90" />
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 opacity-90" />
        </div>
      );
    case 'COD':
    default:
      return (
        <span className="text-[11px] font-bold text-slate-500 tracking-tight leading-none select-none">
          COD
        </span>
      );
  }
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const itemsPerPage = 6;

  // Tabs layout details matching Canva
  const tabs = [
    { name: 'All Orders', count: 1248, status: 'all', countBg: 'bg-red-50 text-[#FE060D]' },
    { name: 'Pending', count: 320, status: 'Pending', countBg: 'bg-amber-50 text-amber-600' },
    { name: 'Confirmed', count: 420, status: 'Confirmed', countBg: 'bg-purple-50 text-purple-600' },
    { name: 'Packed', count: 210, status: 'Packed', countBg: 'bg-pink-50 text-pink-600' },
    { name: 'Shipped', count: 320, status: 'Shipped', countBg: 'bg-blue-50 text-blue-600' },
    { name: 'Delivered', count: 188, status: 'Delivered', countBg: 'bg-emerald-50 text-emerald-600' },
    { name: 'Cancelled', count: 90, status: 'Cancelled', countBg: 'bg-slate-50 text-slate-500' },
  ];

  // Filters Options
  const paymentOptions = [
    { label: 'All Payment Methods', value: '' },
    { label: 'UPI', value: 'UPI' },
    { label: 'VISA', value: 'VISA' },
    { label: 'Mastercard', value: 'Mastercard' },
    { label: 'COD (Cash on Delivery)', value: 'COD' },
  ];

  const countryOptions = [
    { label: 'All Countries', value: '' },
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
  ];

  // Filtered Orders Memo
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      // Tab filter
      if (activeTab !== 'all' && order.orderStatus !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesName = order.customer.name.toLowerCase().includes(query);
        const matchesEmail = order.customer.email.toLowerCase().includes(query);
        const matchesProducts = order.products.some(p => p.name.toLowerCase().includes(query));
        if (!matchesId && !matchesName && !matchesEmail && !matchesProducts) {
          return false;
        }
      }
      // Payment filter
      if (paymentFilter && order.paymentMethod !== paymentFilter) {
        return false;
      }
      // Country filter (mock address check)
      if (countryFilter) {
        const addressLower = order.shippingAddress.toLowerCase();
        if (!addressLower.includes(countryFilter.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, searchQuery, paymentFilter, countryFilter]);

  // Pagination totals
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, id]);
    } else {
      setSelectedOrders(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">
      
      {/* Title & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Orders
          </h1>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Orders</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Export */}
          <button className="flex items-center gap-2.5 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4.5 h-4.5 text-slate-400" />
            <span>Export</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          
          {/* Add Order */}
          <button 
            onClick={() => alert('Creating a new order...')}
            className="flex items-center gap-1.5 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Order</span>
          </button>
        </div>
      </div>

      {/* Tabs Row (Scrollable filters) */}
      <div className="flex items-center gap-2 border-b border-slate-100 overflow-x-auto pb-px scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.status;
          return (
            <button
              key={tab.status}
              onClick={() => {
                setActiveTab(tab.status);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-3.5 text-[14px] font-bold border-b-2 transition-all shrink-0 whitespace-nowrap ${
                isActive 
                  ? 'border-brand text-brand' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-normal ${tab.countBg}`}>
                {tab.count.toLocaleString('en-IN')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters Controls */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[280px] max-w-[420px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID, Customer or Product..." 
            className="w-full h-11 pl-10 pr-4 text-[13.5px] bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        {/* Right: Date Picker, Selects & filter trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <DateRangeSelector />

          {/* Payment Method */}
          <FilterSelect 
            value={paymentFilter} 
            onChange={(val) => {
              setPaymentFilter(val);
              setCurrentPage(1);
            }} 
            options={paymentOptions} 
          />

          {/* Country */}
          <FilterSelect 
            value={countryFilter} 
            onChange={(val) => {
              setCountryFilter(val);
              setCurrentPage(1);
            }} 
            options={countryOptions} 
          />

          {/* Filters slider icon button */}
          <button className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-100 bg-white rounded-xl hover:bg-slate-50 text-[13px] font-bold text-slate-600 shadow-sm transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filters</span>
          </button>
        </div>

      </div>

      {/* Orders Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 pl-6 w-12">
                  <input 
                    type="checkbox"
                    checked={paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-200 text-brand focus:ring-brand cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Products
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-4 pr-6 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const isChecked = selectedOrders.includes(order.id);
                  const itemsCount = order.products.reduce((acc, p) => acc + p.qty, 0);
                  
                  // Product representations arrays (Canva layout)
                  const displayProducts = order.products.slice(0, 2);
                  const extraProductsCount = order.products.length - displayProducts.length;

                  return (
                    <tr 
                      key={order.id} 
                      className={`group hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-slate-50/30' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-6">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(order.id, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-200 text-brand focus:ring-brand cursor-pointer"
                        />
                      </td>

                      {/* Order ID */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-extrabold text-slate-800">
                            {order.id}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>

                      {/* Customer Info Card */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* Face Avatar */}
                          <div className="w-[34px] h-[34px] rounded-full bg-slate-100 border border-slate-100 overflow-hidden shrink-0">
                            <svg viewBox="0 0 32 32" className="w-full h-full text-slate-400" fill="currentColor">
                              <path d="M16 8a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 10c-6.13 0-11 3.87-11 8a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1c0-4.13-4.87-8-11-8z" />
                            </svg>
                          </div>
                          {/* Details */}
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-800 leading-snug">
                              {order.customer.name}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 leading-none">
                              {order.customer.email}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 leading-none">
                              {order.customer.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Products visual row */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          {displayProducts.map((p, i) => (
                            <ProductThumb key={i} type={p.iconName} />
                          ))}
                          {extraProductsCount > 0 && (
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-[11px] font-bold text-slate-400 select-none">
                              +{extraProductsCount}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Amount column */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-extrabold text-slate-800">
                            ₹{order.amount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {order.paymentType}
                          </span>
                        </div>
                      </td>

                      {/* Payment method and status */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="h-4 flex items-center">
                            <PaymentLogo method={order.paymentMethod} />
                          </div>
                          <span className={`text-[11px] font-extrabold ${
                            order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Order status badge */}
                      <td className="py-4 px-4">
                        <Badge status={order.orderStatus} />
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-700 leading-snug">
                            {order.date}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 mt-0.5 leading-none">
                            {order.time}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link 
                            to={`/orders/${order.id.replace('#', '')}`}
                            className="p-1.5 text-slate-400 hover:text-brand hover:bg-brand-light rounded-lg transition-colors inline-flex items-center justify-center"
                            aria-label="View Details"
                          >
                            <Eye className="w-[15px] h-[15px]" />
                          </Link>
                          <button 
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-[15px] h-[15px]" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[14px] font-medium text-slate-400">
                    No orders match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-50 bg-slate-50/20">
            {/* Show count */}
            <span className="text-[13px] font-medium text-slate-400">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString('en-IN')} orders
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Pages numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-light text-brand border border-brand/10' 
                        : 'border border-transparent text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next */}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
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
