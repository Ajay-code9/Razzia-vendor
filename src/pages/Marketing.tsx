import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket, Tag, Megaphone, Zap, Eye, Search, SlidersHorizontal,
  Plus, ChevronLeft, ChevronRight, MoreVertical, Edit3, Copy,
  Trash2, CheckCircle2, XCircle, Lightbulb, TrendingUp, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

// ── Mock Data ──────────────────────────────────────────────
interface Coupon {
  id: string;
  code: string;
  discount: string;
  discountSub: string;
  minOrder: number;
  validTill: string;
  usageUsed: number;
  usageMax: number;
  status: 'Active' | 'Expired';
}

const initialCoupons: Coupon[] = [
  { id: 'C1', code: 'RAZZIA10', discount: '10% OFF', discountSub: 'Up to ₹500', minOrder: 999, validTill: '31 May, 2024 11:59 PM', usageUsed: 245, usageMax: 1000, status: 'Active' },
  { id: 'C2', code: 'SAVE20', discount: '20% OFF', discountSub: 'Up to ₹1000', minOrder: 1999, validTill: '15 Jun, 2024 11:59 PM', usageUsed: 150, usageMax: 500, status: 'Active' },
  { id: 'C3', code: 'FLAT100', discount: '₹100 OFF', discountSub: 'Flat Discount', minOrder: 1499, validTill: '10 Jun, 2024 11:59 PM', usageUsed: 320, usageMax: 800, status: 'Active' },
  { id: 'C4', code: 'WELCOME50', discount: '₹50 OFF', discountSub: 'Flat Discount', minOrder: 499, validTill: '25 May, 2024 11:59 PM', usageUsed: 560, usageMax: 1500, status: 'Active' },
  { id: 'C5', code: 'RAZZIA5', discount: '5% OFF', discountSub: 'Up to ₹250', minOrder: 799, validTill: '15 May, 2024', usageUsed: 1000, usageMax: 1000, status: 'Expired' },
  { id: 'C6', code: 'DIWALI25', discount: '25% OFF', discountSub: 'Up to ₹1500', minOrder: 2499, validTill: '30 Apr, 2024', usageUsed: 800, usageMax: 800, status: 'Expired' },
];

const campaignDonut = [
  { name: 'Coupons', value: 12450, color: '#3B82F6' },
  { name: 'Banners', value: 18230, color: '#10B981' },
  { name: 'Flash Sales', value: 9850, color: '#F59E0B' },
  { name: 'Others', value: 5150, color: '#8B5CF6' },
];

// ── Component ──────────────────────────────────────────────
export default function MarketingPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [activeTab, setActiveTab] = useState('Coupons');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create coupon form state
  const [formCode, setFormCode] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formMinOrder, setFormMinOrder] = useState('');

  const itemsPerPage = 6;
  const tabs = ['Coupons', 'Promo Codes', 'Banner Campaigns', 'Flash Sales'];

  useEffect(() => {
    const close = () => setActiveMenuId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = c.code.toLowerCase().includes(q) || c.discount.toLowerCase().includes(q);
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filtered.slice(s, s + itemsPerPage);
  }, [filtered, currentPage]);

  const handleCreateCoupon = () => {
    if (!formCode.trim()) { showToast('Coupon code is required.', 'error'); return; }
    const newC: Coupon = {
      id: `C${Date.now()}`, code: formCode.toUpperCase(), discount: formDiscount || '10% OFF',
      discountSub: 'Custom', minOrder: parseInt(formMinOrder) || 499,
      validTill: '30 Jun, 2024 11:59 PM', usageUsed: 0, usageMax: 500, status: 'Active'
    };
    setCoupons(prev => [newC, ...prev]);
    setIsCreateOpen(false);
    setFormCode(''); setFormDiscount(''); setFormMinOrder('');
    showToast(`Coupon ${newC.code} created successfully!`, 'success');
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Delete this coupon?')) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      showToast('Coupon deleted.', 'success');
    }
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const next = c.status === 'Active' ? 'Expired' : 'Active';
        showToast(`Coupon ${c.code} set to ${next}.`, 'success');
        return { ...c, status: next as Coupon['status'] };
      }
      return c;
    }));
  };

  const handleDuplicate = (coupon: Coupon) => {
    const dup: Coupon = { ...coupon, id: `C${Date.now()}`, code: `${coupon.code}_COPY`, usageUsed: 0, status: 'Active' };
    setCoupons(prev => [dup, ...prev]);
    showToast(`Coupon duplicated as ${dup.code}.`, 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">Marketing</h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span><span className="text-slate-500">Marketing</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button onClick={() => showToast('Campaign creation coming soon.', 'info')} className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <Megaphone className="w-4 h-4 text-slate-400" /><span>Create Campaign</span>
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer">
            <Plus className="w-4.5 h-4.5" /><span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Coupons', val: '12', trend: '+ 20%', icon: <Ticket className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
          { title: 'Active Coupons', val: '6', trend: '+ 25%', icon: <Tag className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50' },
          { title: 'Total Campaigns', val: '8', trend: '+ 18%', icon: <Megaphone className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
          { title: 'Flash Sales', val: '3', trend: '+ 15%', icon: <Zap className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50' },
          { title: 'Total Reach', val: '45,680', trend: '+ 30%', icon: <Eye className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
        ].map((kpi, i) => (
          <motion.div key={i} whileHover={{ scale: 1.01, y: -2 }} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left hover:shadow-widget transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg} border border-slate-100 shrink-0`}>{kpi.icon}</div>
              <div className="text-right flex-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{kpi.title}</span>
                <span className="text-[22px] font-black text-slate-850 tracking-tight leading-none mt-0.5 block">{kpi.val}</span>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 mt-3 border-t border-slate-50 pt-2">
              <span className="text-emerald-500 font-extrabold mr-1">{kpi.trend}</span>vs last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-100">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-3 text-[13px] font-bold transition-colors cursor-pointer border-b-2 ${activeTab === t ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid Main + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table Area */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-50">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">{activeTab}</h3>
              <p className="text-[11.5px] text-slate-400 font-medium mt-0.5">Create and manage discount coupons for your customers.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="h-9 px-3 bg-white border border-slate-100 rounded-lg text-[12px] font-bold text-slate-655 cursor-pointer shadow-sm min-w-[120px]">
                <option value="">All Status</option><option value="Active">Active</option><option value="Expired">Expired</option>
              </select>
              <button onClick={() => showToast('Advanced filters panel', 'info')} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 bg-white rounded-lg hover:bg-slate-50 text-[12px] font-bold text-slate-655 cursor-pointer shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-5">Coupon Code</th><th className="py-3 px-4">Discount</th><th className="py-3 px-4">Min. Order</th>
                  <th className="py-3 px-4">Valid Till</th><th className="py-3 px-4">Usage</th><th className="py-3 px-4">Status</th><th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map(c => {
                  const pct = Math.min((c.usageUsed / c.usageMax) * 100, 100);
                  const barColor = c.status === 'Active' ? (pct > 80 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-rose-400';
                  const isExpired = c.status === 'Expired';
                  return (
                    <tr key={c.id} className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-5">
                        <span className={`text-[12px] font-black px-2 py-0.5 rounded border ${isExpired ? 'text-slate-400 border-slate-100 bg-slate-50' : 'text-brand border-brand/20 bg-[#FFF5F5]'}`}>{c.code}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[12.5px]"><span className="font-extrabold text-slate-800 block">{c.discount}</span><span className="text-[10px] text-slate-400 font-semibold">{c.discountSub}</span></td>
                      <td className="py-3.5 px-4 text-[12.5px] font-bold text-slate-655">₹{c.minOrder.toLocaleString('en-IN')}<br/><span className="text-[10px] text-slate-400">Min. Order</span></td>
                      <td className="py-3.5 px-4 text-[12px] font-semibold text-slate-505">
                        {isExpired ? <span className="text-rose-500">Expired on<br/><strong>{c.validTill}</strong></span> : <span>📅 {c.validTill}</span>}
                      </td>
                      <td className="py-3.5 px-4 min-w-[110px]">
                        <span className="text-[12px] font-bold text-slate-700 block">{c.usageUsed} / {c.usageMax}</span>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden"><div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} /></div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>{c.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => showToast(`Edit ${c.code}`, 'info')} className="p-1 text-slate-400 hover:text-slate-655 rounded hover:bg-slate-100 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                          <div className="relative">
                            <button onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)} className="p-1 text-slate-400 hover:text-slate-655 rounded hover:bg-slate-100 cursor-pointer"><MoreVertical className="w-3.5 h-3.5" /></button>
                            <AnimatePresence>
                              {activeMenuId === c.id && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                  className="absolute right-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-20 text-left text-[11.5px] font-semibold text-slate-700">
                                  <button onClick={() => { setActiveMenuId(null); handleDuplicate(c); }} className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><Copy className="w-3.5 h-3.5 text-slate-400" />Duplicate</button>
                                  <button onClick={() => { setActiveMenuId(null); handleToggleStatus(c.id); }} className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                                    {c.status === 'Active' ? <><XCircle className="w-3.5 h-3.5 text-slate-400" />Deactivate</> : <><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />Activate</>}
                                  </button>
                                  <button onClick={() => { setActiveMenuId(null); handleDeleteCoupon(c.id); }} className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-500 flex items-center gap-2 cursor-pointer border-t border-slate-50"><Trash2 className="w-3.5 h-3.5 text-rose-400" />Delete</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-400 font-medium">No coupons found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 text-[12px] font-bold text-slate-400 select-none">
            <span>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} coupons</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center cursor-pointer bg-white"><ChevronLeft className="w-4 h-4" /></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] font-bold cursor-pointer ${currentPage === i + 1 ? 'border border-brand text-brand bg-[#FFF0F0]' : 'border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center cursor-pointer bg-white"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Performing Coupon */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">🏆 Top Performing Coupon</h3>
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-center space-y-2">
              <span className="text-brand font-black text-[14px] bg-[#FFF5F5] border border-brand/20 px-3 py-1 rounded inline-block">RAZZIA10</span>
              <p className="text-[12px] text-slate-500 font-semibold">10% OFF up to ₹500</p>
              <div className="grid grid-cols-3 gap-2 text-center mt-2">
                <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Usage</span><span className="text-[15px] font-black text-slate-800">245</span></div>
                <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Orders</span><span className="text-[15px] font-black text-slate-800">182</span></div>
                <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Revenue</span><span className="text-[15px] font-black text-slate-800">₹24,560</span></div>
              </div>
            </div>
            <button onClick={() => showToast('Opening coupon analytics...', 'info')} className="w-full h-9 border border-slate-150 hover:bg-slate-50 text-slate-655 font-bold text-[12px] rounded-xl transition-colors cursor-pointer bg-white">View Details</button>
          </div>

          {/* Campaign Overview Donut */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Campaign Overview</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-[120px] h-[120px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={campaignDonut} cx="50%" cy="50%" innerRadius={35} outerRadius={52} paddingAngle={3} dataKey="value">
                    {campaignDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[9px] text-slate-400 font-bold">Total Reach</span><span className="text-[14px] font-black text-slate-800">45,680</span></div>
              </div>
              <div className="space-y-2 text-[11.5px] font-bold text-slate-655">
                {campaignDonut.map((d, i) => (
                  <div key={i} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} /><span>{d.name}</span><span className="text-slate-800 ml-auto font-mono">{d.value.toLocaleString('en-IN')}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Quick Tips</h3>
            <div className="space-y-2.5 text-[12px] font-semibold text-slate-505">
              <div className="flex items-start gap-2"><span className="text-brand mt-0.5">🔥</span><span>Create limited time coupons to boost sales</span></div>
              <div className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">⚡</span><span>Promote flash sales on banners</span></div>
              <div className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">📊</span><span>Track performance and optimize regularly</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Coupon"
        footerButtons={<><button onClick={() => setIsCreateOpen(false)} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={handleCreateCoupon} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer">Create Coupon</button></>}>
        <div className="space-y-4 text-left text-[13px]">
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Coupon Code</label>
            <input type="text" value={formCode} onChange={e => setFormCode(e.target.value)} placeholder="e.g. SUMMER25" className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 font-bold uppercase" /></div>
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Discount</label>
            <input type="text" value={formDiscount} onChange={e => setFormDiscount(e.target.value)} placeholder="e.g. 10% OFF" className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5" /></div>
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Minimum Order (₹)</label>
            <input type="number" value={formMinOrder} onChange={e => setFormMinOrder(e.target.value)} placeholder="499" className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5" /></div>
        </div>
      </Modal>
    </div>
  );
}
