import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Award, 
  UserPlus, 
  Search, 
  MapPin, 
  MoreVertical, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Grid,
  Mail,
  Phone,
  Eye,
  Trash2,
  Lock,
  MessageSquare,
  PhoneCall,
  Edit3,
  ChevronDown
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { Customer } from '../utils/customersData';
import { loadCustomers, saveCustomers } from '../utils/customersData';
import { useToast } from '../context/ToastContext';
import CustomerDrawer from '../components/customers/CustomerDrawer';

// Sparklines datasets mockup
const customerSparklines = {
  total: [{ val: 1000 }, { val: 1150 }, { val: 1100 }, { val: 1200 }, { val: 1180 }, { val: 1220 }, { val: 1248 }],
  orders: [{ val: 3000 }, { val: 3200 }, { val: 3100 }, { val: 3400 }, { val: 3350 }, { val: 3480 }, { val: 3562 }],
  spent: [{ val: 35000 }, { val: 41000 }, { val: 39000 }, { val: 44000 }, { val: 42000 }, { val: 46000 }, { val: 45680 }],
  repeat: [{ val: 280 }, { val: 310 }, { val: 295 }, { val: 330 }, { val: 315 }, { val: 325 }, { val: 342 }],
  new: [{ val: 120 }, { val: 145 }, { val: 130 }, { val: 160 }, { val: 140 }, { val: 150 }, { val: 156 }]
};

// Animated Number component helper
function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600; // ms
    const increment = value / (duration / 16);
    
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

export default function CustomersPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load local state databases
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomers());
  
  // Search & Filter queries
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Selected customer for detail drawer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active dropdown id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Save updates helper
  const handleSaveList = (updated: Customer[]) => {
    setCustomers(updated);
    saveCustomers(updated);
  };

  // Close dropdown overlay menus on click-out
  useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // Filter lists based on state triggers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search text query
      const query = searchQuery.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(query) || 
                            c.email.toLowerCase().includes(query) || 
                            c.phone.toLowerCase().includes(query);

      // Status
      const matchesStatus = !statusFilter || c.status.toLowerCase() === statusFilter.toLowerCase();

      // Location
      const matchesLocation = !locationFilter || c.location.toLowerCase().includes(locationFilter.toLowerCase());

      // Customer Type (VIP / Repeat / New)
      let matchesType = true;
      if (typeFilter === 'VIP') {
        matchesType = c.status === 'VIP' || c.totalSpent > 5000;
      } else if (typeFilter === 'New') {
        matchesType = c.totalOrders <= 6;
      } else if (typeFilter === 'Repeat') {
        matchesType = c.totalOrders > 6;
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesType;
    });
  }, [customers, searchQuery, statusFilter, locationFilter, typeFilter]);

  // Pagination totals
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  // Actions menu handlers
  const handleViewCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setIsDrawerOpen(true);
  };

  const handleToggleDeactivate = (id: string) => {
    const updated = customers.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Customer status updated to ${nextStatus}.`, 'success');
        return { ...c, status: nextStatus as any };
      }
      return c;
    });
    handleSaveList(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      const updated = customers.filter(c => c.id !== id);
      handleSaveList(updated);
      showToast('Customer record deleted successfully.', 'success');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Customer Name,Email,Phone,Location,Total Orders,Total Spent,Status,Join Date\n';
    const rows = filteredCustomers.map(c => 
      `"${c.name}",${c.email},${c.phone},"${c.location}",${c.totalOrders},₹${c.totalSpent},${c.status},"${c.joinDate}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `razzia_customers_list_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('Customers database list exported as CSV.', 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left relative">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Customers
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Customers</span>
          </div>
        </div>

        {/* Action button elements */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Export */}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export</span>
          </button>
          
          {/* Add customer */}
          <button 
            onClick={() => showToast('Add customer form drawer trigger (Simulation only)', 'info')}
            className="flex items-center gap-1.5 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* KPI Stats cards row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Total Customers */}
        <KPICard 
          title="Total Customers"
          metric={1248}
          description="vs last 7 days"
          trend="+ 18.4%"
          isPositive={true}
          sparklineData={customerSparklines.total}
          color="#8B5CF6"
          icon={<Users className="w-5 h-5 text-purple-500" />}
        />

        {/* Total Orders */}
        <KPICard 
          title="Total Orders"
          metric={3562}
          description="vs last 7 days"
          trend="+ 15.6%"
          isPositive={true}
          sparklineData={customerSparklines.orders}
          color="#3B82F6"
          icon={<ShoppingBag className="w-5 h-5 text-blue-500" />}
        />

        {/* Total Spent */}
        <KPICard 
          title="Total Spent"
          metric={45680}
          metricPrefix="₹"
          description="vs last 7 days"
          trend="+ 20.8%"
          isPositive={true}
          sparklineData={customerSparklines.spent}
          color="#10B981"
          icon={<CreditCard className="w-5 h-5 text-emerald-500" />}
        />

        {/* Repeat Customers */}
        <KPICard 
          title="Repeat Customers"
          metric={342}
          description="vs last 7 days"
          trend="+ 12.6%"
          isPositive={true}
          sparklineData={customerSparklines.repeat}
          color="#F59E0B"
          icon={<Award className="w-5 h-5 text-amber-500" />}
        />

        {/* New Customers */}
        <KPICard 
          title="New Customers"
          metric={156}
          description="vs last 7 days"
          trend="+ 16.2%"
          isPositive={true}
          sparklineData={customerSparklines.new}
          color="#FE060D"
          icon={<UserPlus className="w-5 h-5 text-brand" />}
        />

      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-[420px]">
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email or phone..."
            className="w-full h-11 pl-11 pr-4 text-[13.5px] border border-slate-100 bg-slate-50/20 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white bg-slate-50/30 transition-all text-slate-800 font-medium"
          />
        </div>

        {/* Select Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status */}
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 px-4 text-[13px] font-bold text-slate-655 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 cursor-pointer shadow-sm min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="VIP">VIP</option>
            <option value="Blocked">Blocked</option>
          </select>

          {/* Location */}
          <select 
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 px-4 text-[13px] font-bold text-slate-655 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 cursor-pointer shadow-sm min-w-[150px]"
          >
            <option value="">All Locations</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Lucknow">Lucknow</option>
          </select>

          {/* Customer type */}
          <select 
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 px-4 text-[13px] font-bold text-slate-655 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 cursor-pointer shadow-sm min-w-[150px]"
          >
            <option value="">All Customers</option>
            <option value="Repeat">Repeat Customers</option>
            <option value="New">New Customers</option>
            <option value="VIP">VIP Customers</option>
          </select>

          {/* Advanced filters button */}
          <button 
            onClick={() => showToast('Toggle advanced filter panel overlay', 'info')}
            className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-100 bg-white rounded-xl hover:bg-slate-50 text-[13px] font-bold text-slate-655 shadow-sm transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filters</span>
          </button>

          {/* Grid visual view switch */}
          <button className="h-11 w-11 border border-slate-105 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <Grid className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* CRM Customer List Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 pl-6">Customer</th>
                <th className="py-4 px-4">Email / Phone</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Total Orders</th>
                <th className="py-4 px-4">Total Spent</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Join Date</th>
                <th className="py-4 pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => (
                  <tr 
                    key={cust.id}
                    onClick={() => handleViewCustomer(cust.id)}
                    className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    {/* Customer Info */}
                    <td className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-brand to-[#FF4D52] flex items-center justify-center font-bold text-white text-[12px] shadow-sm shrink-0">
                          {cust.avatarLetter}
                        </div>
                        <span className="font-extrabold text-slate-800 group-hover:text-brand transition-colors block text-[13.5px]">{cust.name}</span>
                      </div>
                    </td>

                    {/* Contact detail rows */}
                    <td className="py-3.5 px-4 text-[12.5px] font-semibold text-slate-650">
                      <div className="flex flex-col">
                        <span className="text-slate-800">{cust.email}</span>
                        <span className="text-slate-400 mt-0.5">{cust.phone}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-[12.5px] font-semibold text-slate-505">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cust.location}</span>
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-4 font-bold text-slate-800 text-[13px]">{cust.totalOrders}</td>

                    {/* Spent */}
                    <td className="py-3.5 px-4 font-extrabold text-slate-850 text-[13.5px]">₹{cust.totalSpent.toLocaleString('en-IN')}</td>

                    {/* Status badge pill */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        cust.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        cust.status === 'Inactive' ? 'bg-slate-50 text-slate-500 border border-slate-100' :
                        cust.status === 'VIP' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {cust.status}
                      </span>
                    </td>

                    {/* Join date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[12.5px] font-semibold">{cust.joinDate}</td>

                    {/* Action dropdown button */}
                    <td className="py-3.5 pr-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === cust.id ? null : cust.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Absolute actions menu */}
                        <AnimatePresence>
                          {activeMenuId === cust.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20 text-left text-[12px] font-semibold text-slate-700"
                            >
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleViewCustomer(cust.id);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Customer</span>
                              </button>
                              
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  showToast('Edit customer details. (Simulation only)', 'info');
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Customer</span>
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  navigate(`/orders?customer=${encodeURIComponent(cust.name)}`);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                                <span>Order History</span>
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Message Customer: ${cust.name}`);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                <span>Message Customer</span>
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Call Customer: ${cust.phone}`);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                                <span>Call Customer</span>
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleToggleDeactivate(cust.id);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-50"
                              >
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{cust.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleDeleteCustomer(cust.id);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-rose-50 text-rose-500 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>Delete Customer</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium bg-white">No customer profiles match your search filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination row */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-4 text-[12px] font-bold text-slate-400 select-none">
            <span>Showing {currentPage * itemsPerPage - itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} customers</span>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                      currentPage === i + 1 ? 'border border-brand text-brand bg-[#FFF0F0]' : 'border border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span>10 / page</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Flyout Customer details Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <CustomerDrawer 
            customer={activeCustomer}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// KPI widget Component
interface KPICardProps {
  title: string;
  metric: number;
  metricPrefix?: string;
  description: string;
  trend: string;
  isPositive: boolean;
  sparklineData: { val: number }[];
  color: string;
  icon: React.ReactNode;
}

function KPICard({ 
  title, 
  metric, 
  metricPrefix = '', 
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
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-[20px] font-black text-slate-850 tracking-tight leading-none">
              {metricPrefix}
              <AnimatedNumber value={metric} />
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
