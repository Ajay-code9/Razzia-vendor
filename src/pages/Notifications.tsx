import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Bell, CheckCheck, Settings as SettingsIcon, ChevronLeft, ChevronRight,
  ShoppingBag, IndianRupee, Radio, Star, PackageCheck, Ticket, Wallet,
  Zap, ShieldCheck, BellRing, AlertTriangle, UserPlus, Undo2, VideoOff,
  CheckCircle, Percent, XCircle, Award, X, MoreVertical, Archive, Trash2,
  Eye, EyeOff, Mail, BellOff, Smartphone, Volume2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import type { Notification, NotifCategory } from '../utils/notificationsData';
import { loadNotifications, saveNotifications, getCategoryCounts } from '../utils/notificationsData';

// ── Icon Resolver ──────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  'shopping-bag': ShoppingBag, 'indian-rupee': IndianRupee, 'radio': Radio,
  'star': Star, 'package-check': PackageCheck, 'ticket': Ticket, 'wallet': Wallet,
  'zap': Zap, 'shield-check': ShieldCheck, 'bell-ring': BellRing,
  'alert-triangle': AlertTriangle, 'user-plus': UserPlus, 'undo-2': Undo2,
  'video-off': VideoOff, 'check-circle': CheckCircle, 'percent': Percent,
  'x-circle': XCircle, 'award': Award,
};

const tabs: { label: string; value: string }[] = [
  { label: 'All Notifications', value: 'all' },
  { label: 'Orders', value: 'Orders' },
  { label: 'Payments', value: 'Payments' },
  { label: 'Live Alerts', value: 'Live Alerts' },
  { label: 'System', value: 'System' },
];

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Quick settings state
  const [quickSettings, setQuickSettings] = useState({
    email: true, push: true, sms: false, sound: true
  });

  // Notification settings modal state
  const [settingsForm, setSettingsForm] = useState({
    orderNotifs: true, paymentNotifs: true, liveNotifs: true, systemNotifs: true,
    soundEnabled: true, browserNotifs: false, emailFrequency: 'Instant'
  });

  const itemsPerPage = 10;

  useEffect(() => { setNotifications(loadNotifications()); }, []);
  useEffect(() => { if (notifications.length) saveNotifications(notifications); }, [notifications]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close context menus on outside click
  useEffect(() => {
    const close = () => setActiveMenuId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  // Filtered notifications
  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (n.isArchived) return false;
      const matchTab = activeTab === 'all' || n.category === activeTab;
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [notifications, activeTab, debouncedSearch]);

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const paginated = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filtered.slice(s, s + itemsPerPage);
  }, [filtered, currentPage]);

  const counts = useMemo(() => getCategoryCounts(notifications), [notifications]);

  const selectedNotif = useMemo(() => notifications.find(n => n.id === selectedId) || null, [notifications, selectedId]);

  // Handlers
  const handleMarkRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const handleMarkUnread = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) { setSelectedId(null); setIsDrawerOpen(false); }
    showToast('Notification deleted.', 'success');
  }, [selectedId, showToast]);

  const handleArchive = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isArchived: true } : n));
    if (selectedId === id) { setSelectedId(null); setIsDrawerOpen(false); }
    showToast('Notification archived.', 'success');
  }, [selectedId, showToast]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const openDrawer = (notif: Notification) => {
    setSelectedId(notif.id);
    setIsDrawerOpen(true);
    if (!notif.isRead) handleMarkRead(notif.id);
  };

  // Text highlight helper
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-brand/15 text-brand font-bold rounded px-0.5">{part}</mark>
        : part
    );
  };

  const recentUnread = useMemo(() => notifications.filter(n => !n.isRead && !n.isArchived).slice(0, 5), [notifications]);

  const dotColorMap: Record<string, string> = {
    'Orders': 'bg-brand', 'Payments': 'bg-emerald-500', 'Live Alerts': 'bg-purple-500',
    'System': 'bg-orange-500'
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">Notifications</h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span><span className="text-slate-500">Notifications</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button onClick={handleMarkAllRead} className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <CheckCheck className="w-4 h-4 text-slate-400" /><span>Mark all as read</span>
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <SettingsIcon className="w-4 h-4 text-slate-400" /><span>Notification Settings</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-100">
        {tabs.map(t => (
          <button key={t.value} onClick={() => { setActiveTab(t.value); setCurrentPage(1); }}
            className={`px-5 py-3 text-[13px] font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${activeTab === t.value ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid: Main + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Notification List */}
          <div className="divide-y divide-slate-50">
            {paginated.length > 0 ? paginated.map(n => {
              const IconComp = iconMap[n.icon] || Bell;
              return (
                <motion.div key={n.id}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                  onClick={() => openDrawer(n)}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors group ${!n.isRead ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.iconBg} border border-slate-100/50`}>
                    <IconComp className={`w-[18px] h-[18px] ${n.iconColor}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-[13.5px] block leading-snug ${!n.isRead ? 'font-extrabold text-slate-800' : 'font-semibold text-slate-700'}`}>
                      {highlightText(n.title, debouncedSearch)}
                    </span>
                    <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                      {highlightText(n.description, debouncedSearch)}
                    </span>
                  </div>
                  {/* Right: Time + Status */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11.5px] text-slate-400 font-semibold whitespace-nowrap">{n.time}</span>
                    {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-brand shrink-0" />}
                    {/* Context menu */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setActiveMenuId(activeMenuId === n.id ? null : n.id)}
                        className="p-1 text-slate-300 hover:text-slate-500 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === n.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-20 text-left text-[11.5px] font-semibold text-slate-700">
                            <button onClick={() => { setActiveMenuId(null); openDrawer(n); }} className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><Eye className="w-3.5 h-3.5 text-slate-400" />View Details</button>
                            {n.isRead
                              ? <button onClick={() => { setActiveMenuId(null); handleMarkUnread(n.id); showToast('Marked as unread.', 'info'); }} className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><EyeOff className="w-3.5 h-3.5 text-slate-400" />Mark as Unread</button>
                              : <button onClick={() => { setActiveMenuId(null); handleMarkRead(n.id); showToast('Marked as read.', 'success'); }} className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><Eye className="w-3.5 h-3.5 text-slate-400" />Mark as Read</button>
                            }
                            <button onClick={() => { setActiveMenuId(null); handleArchive(n.id); }} className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><Archive className="w-3.5 h-3.5 text-slate-400" />Archive</button>
                            <button onClick={() => { setActiveMenuId(null); handleDelete(n.id); }} className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-500 flex items-center gap-2 cursor-pointer border-t border-slate-50"><Trash2 className="w-3.5 h-3.5 text-rose-400" />Delete</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="py-16 text-center">
                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-[13px] text-slate-400 font-medium">No notifications found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 text-[12px] font-bold text-slate-400 select-none">
              <span>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} notifications</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center cursor-pointer bg-white"><ChevronLeft className="w-4 h-4" /></button>
                {(() => {
                  const pages: (number | string)[] = [];
                  for (let i = 1; i <= totalPages; i++) {
                    if (i <= 3 || i === totalPages || Math.abs(i - currentPage) <= 1) pages.push(i);
                    else if (pages[pages.length - 1] !== '...') pages.push('...');
                  }
                  return pages.map((p, idx) =>
                    p === '...' ? <span key={`e${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400">…</span> :
                    <button key={p} onClick={() => setCurrentPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-[12px] font-bold cursor-pointer ${currentPage === p ? 'border border-brand text-brand bg-[#FFF0F0]' : 'border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>{p}</button>
                  );
                })()}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center cursor-pointer bg-white"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Notification Summary */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14px] font-bold text-slate-800">Notification Summary</h3>
              <button onClick={() => showToast('Viewing all notifications...', 'info')} className="text-[11.5px] font-bold text-brand hover:underline cursor-pointer">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Unread', val: counts.unread, icon: <Bell className="w-5 h-5 text-brand" />, bg: 'bg-[#FFF5F5]' },
                { label: 'Orders', val: counts.orders, icon: <Mail className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
                { label: 'Payments', val: counts.payments, icon: <IndianRupee className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
                { label: 'Live Alerts', val: counts.liveAlerts, icon: <Radio className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50/50 border border-slate-100/50 p-3.5 rounded-xl text-center space-y-1">
                  <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mx-auto`}>{s.icon}</div>
                  <span className="text-[20px] font-black text-slate-800 block">{s.val}</span>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Unread Notifications */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[14px] font-bold text-slate-800">Recent Unread Notifications</h3>
              <button onClick={() => { setActiveTab('all'); setCurrentPage(1); }} className="text-[11.5px] font-bold text-brand hover:underline cursor-pointer">View All</button>
            </div>
            {recentUnread.length > 0 ? recentUnread.map(n => (
              <button key={n.id} onClick={() => openDrawer(n)} className="w-full flex items-center gap-2.5 py-1.5 hover:bg-slate-50 rounded-lg px-1 transition-colors cursor-pointer text-left">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dotColorMap[n.category] || 'bg-slate-400'}`} />
                <span className="text-[12px] font-semibold text-slate-700 flex-1 truncate">{n.title}</span>
                <span className="text-[10.5px] text-slate-400 font-medium shrink-0 whitespace-nowrap">{n.time}</span>
              </button>
            )) : <p className="text-[11.5px] text-slate-400 font-medium py-2">All caught up! No unread notifications.</p>}
          </div>

          {/* Quick Settings */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Quick Settings</h3>
            {[
              { key: 'email', icon: <Mail className="w-4.5 h-4.5 text-blue-500" />, bg: 'bg-blue-50', title: 'Email Notifications' },
              { key: 'push', icon: <Bell className="w-4.5 h-4.5 text-amber-500" />, bg: 'bg-amber-50', title: 'Push Notifications' },
              { key: 'sms', icon: <Smartphone className="w-4.5 h-4.5 text-emerald-500" />, bg: 'bg-emerald-50', title: 'SMS Notifications' },
              { key: 'sound', icon: <Volume2 className="w-4.5 h-4.5 text-purple-500" />, bg: 'bg-purple-50', title: 'Sound Alerts' },
            ].map(s => (
              <button key={s.key} onClick={() => {
                setQuickSettings(prev => ({ ...prev, [s.key]: !prev[s.key as keyof typeof prev] }));
                showToast(`${s.title} ${quickSettings[s.key as keyof typeof quickSettings] ? 'disabled' : 'enabled'}.`, 'info');
              }} className="w-full flex items-center gap-3 py-2 hover:bg-slate-50 rounded-lg px-1 transition-colors cursor-pointer text-left">
                <div className={`w-9 h-9 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12.5px] font-bold text-slate-700 block">{s.title}</span>
                  <span className={`text-[10.5px] font-semibold ${quickSettings[s.key as keyof typeof quickSettings] ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {quickSettings[s.key as keyof typeof quickSettings] ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notification Details Drawer ── */}
      <AnimatePresence>
        {isDrawerOpen && selectedNotif && (
          <>
            <div onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[440px] bg-white border-l border-slate-100 shadow-2xl flex flex-col font-sans text-left">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 shrink-0">
                <span className="text-[15px] font-black text-slate-800">Notification Details</span>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Icon + Title */}
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full ${selectedNotif.iconBg} flex items-center justify-center shrink-0 border border-slate-100/50`}>
                    {(() => { const IC = iconMap[selectedNotif.icon] || Bell; return <IC className={`w-5 h-5 ${selectedNotif.iconColor}`} />; })()}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-slate-800 leading-snug">{selectedNotif.title}</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium mt-0.5">{selectedNotif.time}</p>
                  </div>
                </div>
                {/* Full Message */}
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{selectedNotif.fullMessage || selectedNotif.description}</p>
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/50 border border-slate-100/50 p-4 rounded-xl">
                  <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Category</span><span className="text-[12.5px] font-bold text-slate-700 mt-0.5 block">{selectedNotif.category}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Priority</span>
                    <span className={`text-[12.5px] font-bold mt-0.5 block ${selectedNotif.priority === 'Urgent' ? 'text-brand' : selectedNotif.priority === 'High' ? 'text-amber-600' : 'text-slate-700'}`}>{selectedNotif.priority}</span></div>
                  {selectedNotif.relatedOrder && <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Related Order</span><span className="text-[12.5px] font-bold text-brand mt-0.5 block">#{selectedNotif.relatedOrder}</span></div>}
                  {selectedNotif.customer && <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer</span><span className="text-[12.5px] font-bold text-slate-700 mt-0.5 block">{selectedNotif.customer}</span></div>}
                </div>
              </div>
              {/* Footer Actions */}
              <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-50 shrink-0">
                {selectedNotif.isRead
                  ? <button onClick={() => { handleMarkUnread(selectedNotif.id); showToast('Marked as unread.', 'info'); }} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><EyeOff className="w-3.5 h-3.5 text-slate-400" />Mark Unread</button>
                  : <button onClick={() => { handleMarkRead(selectedNotif.id); showToast('Marked as read.', 'success'); }} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><Eye className="w-3.5 h-3.5 text-slate-400" />Mark Read</button>
                }
                <button onClick={() => handleArchive(selectedNotif.id)} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><Archive className="w-3.5 h-3.5 text-slate-400" />Archive</button>
                <button onClick={() => handleDelete(selectedNotif.id)} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-rose-500 hover:bg-rose-50 cursor-pointer ml-auto"><Trash2 className="w-3.5 h-3.5 text-rose-400" />Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Notification Settings Modal ── */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Notification Settings"
        footerButtons={<><button onClick={() => setIsSettingsOpen(false)} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={() => { setIsSettingsOpen(false); showToast('Notification settings saved!', 'success'); }} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer">Save Settings</button></>}>
        <div className="space-y-5 text-left text-[13px]">
          <div>
            <h4 className="text-[12px] font-extrabold text-slate-600 uppercase tracking-wider mb-3">Notification Categories</h4>
            {[
              { key: 'orderNotifs', label: 'Order Notifications' },
              { key: 'paymentNotifs', label: 'Payment Notifications' },
              { key: 'liveNotifs', label: 'Live Stream Alerts' },
              { key: 'systemNotifs', label: 'System Notifications' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <span className="text-[12.5px] font-semibold text-slate-655">{item.label}</span>
                <button onClick={() => setSettingsForm(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${settingsForm[item.key as keyof typeof settingsForm] ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${settingsForm[item.key as keyof typeof settingsForm] ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <hr className="border-slate-50" />
          <div className="space-y-3">
            {[
              { key: 'soundEnabled', label: 'Sound Alerts' },
              { key: 'browserNotifs', label: 'Browser Notifications' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <span className="text-[12.5px] font-semibold text-slate-655">{item.label}</span>
                <button onClick={() => setSettingsForm(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${settingsForm[item.key as keyof typeof settingsForm] ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${settingsForm[item.key as keyof typeof settingsForm] ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <hr className="border-slate-50" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Email Frequency</label>
            <select value={settingsForm.emailFrequency} onChange={e => setSettingsForm(prev => ({ ...prev, emailFrequency: e.target.value }))}
              className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-bold text-slate-655 cursor-pointer bg-white">
              <option>Instant</option><option>Hourly Digest</option><option>Daily Digest</option><option>Weekly Digest</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
