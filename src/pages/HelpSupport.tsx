import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ClipboardList, Package, Radio, CreditCard, Settings, Megaphone, Shield, HelpCircle,
  ChevronRight, BookOpen, MessageCircle, Mail, Phone, Ticket, Globe, Users, PlayCircle, Activity,
  ArrowRight, X, ThumbsUp, ThumbsDown, Share2, Copy, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

// ── Mock Data ──────────────────────────────────────────────
interface HelpCategory {
  id: string; title: string; description: string; articlesCount: number; color: string;
  icon: React.ReactNode;
}

interface Article {
  id: string; title: string; category: string; content: string; relatedIds: string[];
}

const helpCategories: HelpCategory[] = [
  { id: 'orders', title: 'Orders & Deliveries', description: 'Manage orders, delivery, returns and refunds.', articlesCount: 12, color: '#FE060D', icon: <ClipboardList className="w-6 h-6" /> },
  { id: 'products', title: 'Products & Inventory', description: 'Add, update and manage your products and stock.', articlesCount: 15, color: '#10B981', icon: <Package className="w-6 h-6" /> },
  { id: 'live', title: 'Live Streaming', description: 'Go live, stream settings and best practices.', articlesCount: 10, color: '#8B5CF6', icon: <Radio className="w-6 h-6" /> },
  { id: 'payments', title: 'Payments & Earnings', description: 'Payouts, transactions and earnings related help.', articlesCount: 14, color: '#3B82F6', icon: <CreditCard className="w-6 h-6" /> },
  { id: 'settings', title: 'Store & Settings', description: 'Manage store profile, settings and preferences.', articlesCount: 13, color: '#F59E0B', icon: <Settings className="w-6 h-6" /> },
  { id: 'marketing', title: 'Marketing & Promotions', description: 'Coupons, campaigns and promotions guide.', articlesCount: 9, color: '#EC4899', icon: <Megaphone className="w-6 h-6" /> },
  { id: 'security', title: 'Account & Security', description: 'Account security, KYC and verification.', articlesCount: 8, color: '#14B8A6', icon: <Shield className="w-6 h-6" /> },
  { id: 'general', title: 'General', description: 'General information and frequently asked questions.', articlesCount: 20, color: '#F97316', icon: <HelpCircle className="w-6 h-6" /> },
];

const mockArticles: Article[] = [
  { id: 'A1', title: 'How to start a live stream and reach more customers?', category: 'live', content: 'To start a live stream on Razzia, navigate to the Live Streaming section from your vendor dashboard sidebar. Click "Go Live Setup" to configure your stream title, category, and showcase products. Once configured, click "Go Live" to begin broadcasting. Tips: Use a stable internet connection, good lighting, and engage with your audience through the chat feature to maximize reach and conversions.', relatedIds: ['A2', 'A4'] },
  { id: 'A2', title: 'How to add a new product to your store?', category: 'products', content: 'Go to the Products section and click "Add Product". Fill in the product information including name, description, category, pricing, and stock quantity. Upload high-quality images (up to 5) and set the product status to Active. Click "Publish Product" to make it visible in your store. Pro tip: Write detailed descriptions with keywords to improve discoverability.', relatedIds: ['A1', 'A3'] },
  { id: 'A3', title: 'How does the payout process work?', category: 'payments', content: 'Razzia processes payouts every 7 days for completed orders. Your earnings accumulate in your wallet, and you can request a withdrawal at any time (minimum ₹500). Withdrawals are processed within 24 hours to your registered bank account. You can track all transactions in the Earnings & Wallet section of your dashboard.', relatedIds: ['A4'] },
  { id: 'A4', title: 'How to create and manage coupons?', category: 'marketing', content: 'Navigate to the Marketing section and click "Create Coupon". Set the coupon code, discount type (percentage or flat), minimum order value, usage limits, and validity period. You can manage existing coupons from the Coupons tab — edit, duplicate, activate/deactivate, or delete them. Track performance metrics like usage count and revenue generated.', relatedIds: ['A1'] },
  { id: 'A5', title: 'What are the terms for returns and refunds?', category: 'orders', content: 'Razzia offers a 7-day return policy for most products. Customers can initiate returns from their order history. As a vendor, you will be notified of return requests and can approve or dispute them within 48 hours. Refunds are processed within 3-5 business days after the returned item is received and inspected.', relatedIds: ['A3'] },
];

export default function HelpSupportPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleDrawerOpen, setIsArticleDrawerOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const filteredArticles = searchQuery.trim()
    ? mockArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockArticles;

  const categoryArticles = selectedCategory
    ? mockArticles.filter(a => a.category === selectedCategory)
    : [];

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleDrawerOpen(true);
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim()) { showToast('Please enter a subject.', 'error'); return; }
    if (!ticketDesc.trim()) { showToast('Please describe your issue.', 'error'); return; }
    setIsTicketModalOpen(false);
    setTicketSubject(''); setTicketPriority('Medium'); setTicketCategory(''); setTicketDesc('');
    showToast('Support ticket submitted successfully! Ticket #TKT-' + Math.floor(1000 + Math.random() * 9000), 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">Help & Support</h1>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
          <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
          <span>&gt;</span><span className="text-slate-500">Help & Support</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Search Banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10 max-w-[450px]">
              <h2 className="text-[22px] font-black tracking-tight">How can we help you?</h2>
              <p className="text-[13px] text-slate-300 mt-1.5 font-medium">Search for help articles or browse categories to find the support you need.</p>
              <div className="relative mt-5">
                <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white text-slate-800 text-[13.5px] font-medium focus:outline-none focus:ring-4 focus:ring-brand/20 border border-slate-100 shadow-sm" />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden sm:block opacity-30">
              <div className="w-28 h-28 rounded-full bg-brand/30 flex items-center justify-center"><MessageCircle className="w-14 h-14 text-white" /></div>
            </div>
          </div>

          {/* Search Results (when searching) */}
          {searchQuery.trim() && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
              <h3 className="text-[14px] font-bold text-slate-800">Search Results ({filteredArticles.length})</h3>
              {filteredArticles.length > 0 ? filteredArticles.map(a => (
                <button key={a.id} onClick={() => openArticle(a)} className="w-full flex items-center justify-between p-3 border border-slate-100/50 rounded-xl hover:bg-slate-50/50 transition-colors cursor-pointer text-left">
                  <div className="flex items-center gap-2.5"><BookOpen className="w-4 h-4 text-brand shrink-0" /><span className="text-[12.5px] font-semibold text-slate-700">{a.title}</span></div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              )) : <p className="text-[12.5px] text-slate-400 font-medium py-4 text-center">No articles found matching your search.</p>}
            </div>
          )}

          {/* Category Articles View */}
          {selectedCategory && !searchQuery.trim() && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-slate-800">{helpCategories.find(c => c.id === selectedCategory)?.title} ({categoryArticles.length})</h3>
                <button onClick={() => setSelectedCategory(null)} className="text-[11.5px] font-bold text-brand hover:underline cursor-pointer">Back to Categories</button>
              </div>
              {categoryArticles.length > 0 ? categoryArticles.map(a => (
                <button key={a.id} onClick={() => openArticle(a)} className="w-full flex items-center justify-between p-3 border border-slate-100/50 rounded-xl hover:bg-slate-50/50 transition-colors cursor-pointer text-left">
                  <div className="flex items-center gap-2.5"><BookOpen className="w-4 h-4 text-brand shrink-0" /><span className="text-[12.5px] font-semibold text-slate-700">{a.title}</span></div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              )) : <p className="text-[12.5px] text-slate-400 font-medium py-4 text-center">No articles in this category yet.</p>}
            </div>
          )}

          {/* Browse Help Categories */}
          {!searchQuery.trim() && !selectedCategory && (
            <>
              <div>
                <h3 className="text-[16px] font-bold text-slate-800 mb-4">Browse Help Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {helpCategories.map(cat => (
                    <motion.button key={cat.id} whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center hover:shadow-widget transition-shadow cursor-pointer space-y-2">
                      <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center" style={{ background: `${cat.color}15`, color: cat.color }}>{cat.icon}</div>
                      <h4 className="text-[12.5px] font-extrabold text-slate-800 leading-tight">{cat.title}</h4>
                      <p className="text-[10.5px] text-slate-400 font-medium leading-snug">{cat.description}</p>
                      <span className="text-[11px] font-bold block" style={{ color: cat.color }}>{cat.articlesCount} Articles</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Popular Articles */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
                <div className="flex justify-between items-center"><h3 className="text-[15px] font-bold text-slate-800">Popular Articles</h3>
                  <button onClick={() => showToast('Showing all articles...', 'info')} className="text-[11.5px] font-bold text-slate-500 hover:text-brand cursor-pointer flex items-center gap-1">View All Articles <ChevronRight className="w-3.5 h-3.5" /></button></div>
                {mockArticles.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2.5"><BookOpen className="w-4 h-4 text-brand shrink-0" /><span className="text-[12.5px] font-semibold text-slate-700">{a.title}</span></div>
                    <button onClick={() => openArticle(a)} className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-brand cursor-pointer whitespace-nowrap">View Article <ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-4">
            <div><h3 className="text-[14px] font-bold text-slate-800">Contact Support</h3><p className="text-[11.5px] text-slate-400 font-medium mt-0.5">We're here to help you anytime.</p></div>
            {[
              { icon: <MessageCircle className="w-5 h-5 text-brand" />, bg: 'bg-[#FFF5F5]', title: 'Live Chat', desc: 'Chat with our support team', badge: <span className="text-[10px] font-bold text-emerald-500">Online</span>, action: () => showToast('Opening live chat...', 'info') },
              { icon: <Mail className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50', title: 'Email Support', desc: 'support@razzia.com', badge: null, action: () => showToast('Opening email client...', 'info') },
              { icon: <Phone className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50', title: 'Phone Support', desc: '+91 98765 43210', badge: null, action: () => showToast('Calling support...', 'info') },
              { icon: <Ticket className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50', title: 'Raise a Ticket', desc: 'Submit your issue and get help', badge: null, action: () => setIsTicketModalOpen(true) },
            ].map((item, i) => (
              <button key={i} onClick={item.action} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>{item.icon}</div>
                <div className="flex-1 min-w-0"><span className="text-[12.5px] font-extrabold text-slate-800 block">{item.title}</span><span className="text-[11px] text-slate-400 font-medium">{item.desc}</span></div>
                {item.badge || <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />}
              </button>
            ))}
          </div>

          {/* Support Resources */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Support Resources</h3>
            {[
              { icon: <Globe className="w-4.5 h-4.5 text-blue-500" />, title: 'Help Center', desc: 'Browse our detailed guides' },
              { icon: <Users className="w-4.5 h-4.5 text-purple-500" />, title: 'Community Forum', desc: 'Ask questions and get help' },
              { icon: <PlayCircle className="w-4.5 h-4.5 text-brand" />, title: 'Video Tutorials', desc: 'Watch step-by-step videos' },
              { icon: <Activity className="w-4.5 h-4.5 text-emerald-500" />, title: 'System Status', desc: 'Check system and server status' },
            ].map((r, i) => (
              <button key={i} onClick={() => showToast(`Opening ${r.title}...`, 'info')} className="w-full flex items-center gap-3 py-2.5 hover:bg-slate-50 rounded-lg px-2 transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">{r.icon}</div>
                <div className="flex-1 min-w-0"><span className="text-[12.5px] font-bold text-slate-800 block">{r.title}</span><span className="text-[10.5px] text-slate-400 font-medium">{r.desc}</span></div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </button>
            ))}
          </div>

          {/* Need More Help */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Need more help?</h3>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">Can't find what you're looking for? Our team is here to assist you.</p>
            <button onClick={() => showToast('Connecting to support team...', 'info')} className="inline-flex items-center gap-1.5 px-4 h-9 border border-brand/20 bg-[#FFF5F5] hover:bg-[#FFE5E5] text-brand font-bold text-[12px] rounded-xl transition-colors cursor-pointer">
              Contact Our Team <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Article Drawer */}
      <AnimatePresence>
        {isArticleDrawerOpen && selectedArticle && (
          <>
            <div onClick={() => setIsArticleDrawerOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-100 shadow-2xl flex flex-col font-sans text-left">

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 shrink-0">
                <span className="text-[15px] font-black text-slate-800">Article</span>
                <button onClick={() => setIsArticleDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <h2 className="text-[18px] font-black text-slate-800 leading-snug">{selectedArticle.title}</h2>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{selectedArticle.content}</p>

                {/* Helpful */}
                <div className="border-t border-slate-50 pt-4 space-y-3">
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">Was this helpful?</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => showToast('Thanks for the feedback!', 'success')} className="flex items-center gap-1.5 h-8 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />Yes</button>
                    <button onClick={() => showToast('Sorry to hear that. We\'ll improve!', 'info')} className="flex items-center gap-1.5 h-8 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><ThumbsDown className="w-3.5 h-3.5 text-rose-400" />No</button>
                  </div>
                </div>

                {/* Related Articles */}
                {selectedArticle.relatedIds.length > 0 && (
                  <div className="border-t border-slate-50 pt-4 space-y-2">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">Related Articles</span>
                    {selectedArticle.relatedIds.map(rid => {
                      const rel = mockArticles.find(a => a.id === rid);
                      if (!rel) return null;
                      return (
                        <button key={rid} onClick={() => setSelectedArticle(rel)} className="w-full flex items-center justify-between p-2.5 border border-slate-100/50 rounded-xl hover:bg-slate-50 cursor-pointer text-left">
                          <span className="text-[12px] font-semibold text-slate-700">{rel.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-50 shrink-0">
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); }} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><Copy className="w-3.5 h-3.5 text-slate-400" />Copy Link</button>
                <button onClick={() => showToast('Sharing article...', 'info')} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><Share2 className="w-3.5 h-3.5 text-slate-400" />Share</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Raise Ticket Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Raise a Support Ticket"
        footerButtons={<><button onClick={() => setIsTicketModalOpen(false)} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={handleSubmitTicket} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer flex items-center gap-1.5"><Send className="w-4 h-4" />Submit Ticket</button></>}>
        <div className="space-y-4 text-left text-[13px]">
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Subject</label>
            <input type="text" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} placeholder="Briefly describe your issue" className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
              <select value={ticketPriority} onChange={e => setTicketPriority(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-bold text-slate-655 cursor-pointer bg-white">
                <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
            <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select value={ticketCategory} onChange={e => setTicketCategory(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-bold text-slate-655 cursor-pointer bg-white">
                <option value="">Select category</option>{helpCategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          </div>
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} rows={4} placeholder="Describe your issue in detail..." className="w-full px-3.5 py-3 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13px] font-medium resize-y" /></div>
        </div>
      </Modal>
    </div>
  );
}
