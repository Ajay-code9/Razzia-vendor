import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, Camera, ExternalLink, ShieldCheck, HelpCircle as HelpIcon,
  Eye, EyeOff, Globe, Clock, DollarSign, Palette, Bell, Mail, Smartphone, Lock, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

const settingsTabs = ['Store Information', 'Business Details', 'Bank Details', 'Preferences', 'Notification Settings', 'Password'];

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Store Information');

  // Store Information state
  const [storeName, setStoreName] = useState('Ajay Store');
  const [storeSlug, setStoreSlug] = useState('ajay-store');
  const [storeEmail, setStoreEmail] = useState('ajaystore@example.com');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeDesc, setStoreDesc] = useState('Welcome to Ajay Store! We bring you the best products with top quality and amazing deals. Shop now and enjoy a seamless shopping experience.');
  const [storeIsLive, setStoreIsLive] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  // Preferences state
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [currency, setCurrency] = useState('INR (₹)');
  const [theme, setTheme] = useState('Light');

  // Notifications state
  const [notifs, setNotifs] = useState({
    emailOrders: true, emailPromotions: false, emailSecurity: true,
    pushOrders: true, pushPromotions: true, pushSecurity: true,
    smsOrders: false, smsPromotions: false, smsSecurity: true
  });

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Store status modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    showToast('Settings saved successfully!', 'success');
  };

  const handleToggleStoreLive = () => {
    if (storeIsLive) setIsStatusModalOpen(true);
    else { setStoreIsLive(true); showToast('Store is now Live!', 'success'); }
  };

  const handleConfirmOffline = () => {
    setStoreIsLive(false);
    setIsStatusModalOpen(false);
    showToast('Store is now offline.', 'info');
  };

  const handleChangePassword = () => {
    if (!currentPw) { showToast('Enter your current password.', 'error'); return; }
    if (newPw.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
    if (newPw !== confirmPw) { showToast('Passwords do not match.', 'error'); return; }
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    showToast('Password updated successfully!', 'success');
  };

  const pwStrength = (() => {
    if (newPw.length === 0) return { label: '', color: '', pct: 0 };
    if (newPw.length < 6) return { label: 'Weak', color: 'bg-rose-400', pct: 25 };
    if (newPw.length < 10) return { label: 'Fair', color: 'bg-amber-400', pct: 50 };
    if (/[A-Z]/.test(newPw) && /[0-9]/.test(newPw)) return { label: 'Strong', color: 'bg-emerald-400', pct: 100 };
    return { label: 'Good', color: 'bg-blue-400', pct: 75 };
  })();

  const toggleNotif = (key: string) => setNotifs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">Settings</h1>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
          <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
          <span>&gt;</span><span className="text-slate-500">Settings</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-100 overflow-x-auto">
        {settingsTabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-[13px] font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${activeTab === t ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Store Information Tab ── */}
          {activeTab === 'Store Information' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6 text-left">
              <div className="flex justify-between items-start">
                <div><h3 className="text-[16px] font-bold text-slate-800">Store Information</h3><p className="text-[11.5px] text-slate-400 font-medium mt-0.5">Update your store information and details.</p></div>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 h-10 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl transition-all cursor-pointer shadow-sm shadow-brand/10">
                  <Save className="w-4 h-4" />Save Changes
                </button>
              </div>

              {/* Logo + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6">
                <div>
                  <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Store Logo</label>
                  <div className="w-[180px] h-[140px] border border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50/50 relative overflow-hidden group cursor-pointer" onClick={() => logoRef.current?.click()}>
                    {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      : <span className="text-brand font-black text-[24px] italic select-none">~Razzia</span>}
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Camera className="w-4 h-4 text-slate-500" /></div>
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setLogoPreview)} />
                  <p className="text-[10px] text-slate-400 mt-1.5">JPG, PNG or WEBP · Max size 2MB</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Store Name</label>
                    <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-bold text-slate-800" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Store Slug</label>
                    <input type="text" value={storeSlug} onChange={e => setStoreSlug(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium text-slate-655" /></div>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input type="email" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium text-slate-655" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" value={storePhone} onChange={e => setStorePhone(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium text-slate-655" /></div>
              </div>

              {/* Banner */}
              <div>
                <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Store Banner</label>
                <div className="w-full h-[160px] border border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-gradient-to-r from-brand to-[#FF4D52] relative overflow-hidden cursor-pointer group" onClick={() => bannerRef.current?.click()}>
                  {bannerPreview ? <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                    : <span className="text-white font-black text-[28px] tracking-wider select-none">MEGA SALE — 50% OFF</span>}
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Camera className="w-4 h-4 text-slate-500" /></div>
                </div>
                <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setBannerPreview)} />
                <p className="text-[10px] text-slate-400 mt-1.5">JPG, PNG or WEBP · Recommended size 1200×400px · Max size 5MB</p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Store Description</label>
                <textarea value={storeDesc} onChange={e => setStoreDesc(e.target.value.slice(0, 500))} rows={4} className="w-full px-3.5 py-3 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13px] font-medium text-slate-655 resize-y" />
                <p className="text-[10px] text-slate-400 text-right">{storeDesc.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* ── Business Details Tab ── */}
          {activeTab === 'Business Details' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5 text-left">
              <div className="flex justify-between items-start"><h3 className="text-[16px] font-bold text-slate-800">Business Details</h3>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 h-10 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl cursor-pointer shadow-sm shadow-brand/10"><Save className="w-4 h-4" />Save</button></div>
              {[{ label: 'Legal Business Name', val: 'Ajay Enterprises Pvt. Ltd.' }, { label: 'GSTIN', val: '27AAACA1234B1ZP' }, { label: 'PAN', val: 'AAACA1234B' }, { label: 'Business Address', val: '405, Sea Breeze Apartments, Bandra West, Mumbai 400050' }].map((f, i) => (
                <div key={i} className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">{f.label}</label>
                  <input type="text" defaultValue={f.val} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium text-slate-655" /></div>
              ))}
            </div>
          )}

          {/* ── Bank Details Tab ── */}
          {activeTab === 'Bank Details' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5 text-left">
              <div className="flex justify-between items-start"><h3 className="text-[16px] font-bold text-slate-800">Bank Account Details</h3>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 h-10 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl cursor-pointer shadow-sm shadow-brand/10"><Save className="w-4 h-4" />Save</button></div>
              {[{ label: 'Bank Name', val: 'HDFC Bank' }, { label: 'Account Number', val: '5020 XXXX 4567' }, { label: 'IFSC Code', val: 'HDFC0005020' }, { label: 'Account Holder Name', val: 'Ajay Kumar' }, { label: 'Branch', val: 'Bandra West, Mumbai' }].map((f, i) => (
                <div key={i} className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">{f.label}</label>
                  <input type="text" defaultValue={f.val} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium text-slate-655" /></div>
              ))}
            </div>
          )}

          {/* ── Preferences Tab ── */}
          {activeTab === 'Preferences' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5 text-left">
              <div className="flex justify-between items-start"><h3 className="text-[16px] font-bold text-slate-800">Preferences</h3>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 h-10 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl cursor-pointer shadow-sm shadow-brand/10"><Save className="w-4 h-4" />Save</button></div>
              {[
                { label: 'Language', icon: <Globe className="w-4 h-4 text-slate-400" />, val: language, set: setLanguage, opts: ['English', 'Hindi', 'Tamil', 'Telugu'] },
                { label: 'Timezone', icon: <Clock className="w-4 h-4 text-slate-400" />, val: timezone, set: setTimezone, opts: ['Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)'] },
                { label: 'Currency', icon: <DollarSign className="w-4 h-4 text-slate-400" />, val: currency, set: setCurrency, opts: ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'] },
                { label: 'Theme', icon: <Palette className="w-4 h-4 text-slate-400" />, val: theme, set: setTheme, opts: ['Light', 'Dark', 'System'] },
              ].map((f, i) => (
                <div key={i} className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">{f.icon}{f.label}</label>
                  <select value={f.val} onChange={e => f.set(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-bold text-slate-655 cursor-pointer bg-white">
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select></div>
              ))}
            </div>
          )}

          {/* ── Notification Settings Tab ── */}
          {activeTab === 'Notification Settings' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6 text-left">
              <div className="flex justify-between items-start"><h3 className="text-[16px] font-bold text-slate-800">Notification Settings</h3>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 h-10 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl cursor-pointer shadow-sm shadow-brand/10"><Save className="w-4 h-4" />Save</button></div>
              {[
                { title: 'Email Notifications', icon: <Mail className="w-4.5 h-4.5 text-blue-500" />, items: [{ k: 'emailOrders', l: 'Order Updates' }, { k: 'emailPromotions', l: 'Marketing & Promotions' }, { k: 'emailSecurity', l: 'Security Alerts' }] },
                { title: 'Push Notifications', icon: <Bell className="w-4.5 h-4.5 text-amber-500" />, items: [{ k: 'pushOrders', l: 'Order Updates' }, { k: 'pushPromotions', l: 'Promotional Alerts' }, { k: 'pushSecurity', l: 'Security Alerts' }] },
                { title: 'SMS Notifications', icon: <Smartphone className="w-4.5 h-4.5 text-emerald-500" />, items: [{ k: 'smsOrders', l: 'Order Updates' }, { k: 'smsPromotions', l: 'Marketing' }, { k: 'smsSecurity', l: 'Security' }] },
              ].map((sec, si) => (
                <div key={si} className="space-y-3 border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                  <h4 className="text-[13px] font-extrabold text-slate-700 flex items-center gap-2">{sec.icon}{sec.title}</h4>
                  {sec.items.map(item => (
                    <div key={item.k} className="flex items-center justify-between py-1">
                      <span className="text-[12.5px] font-semibold text-slate-655">{item.l}</span>
                      <button onClick={() => toggleNotif(item.k)} className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${notifs[item.k as keyof typeof notifs] ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${notifs[item.k as keyof typeof notifs] ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── Password Tab ── */}
          {activeTab === 'Password' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5 text-left max-w-[500px]">
              <h3 className="text-[16px] font-bold text-slate-800">Change Password</h3>
              <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <div className="relative"><input type={showCurrentPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full h-11 px-3.5 pr-10 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium" />
                  <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-3 text-slate-400 cursor-pointer">{showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <div className="relative"><input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full h-11 px-3.5 pr-10 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium" />
                  <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-3 text-slate-400 cursor-pointer">{showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                {newPw.length > 0 && <div className="mt-1.5"><div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pwStrength.color} transition-all`} style={{ width: `${pwStrength.pct}%` }} /></div>
                  <span className={`text-[10px] font-bold mt-1 block ${pwStrength.pct >= 75 ? 'text-emerald-500' : pwStrength.pct >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{pwStrength.label}</span></div>}
              </div>
              <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-medium" /></div>
              <button onClick={handleChangePassword} className="h-11 px-6 bg-brand hover:bg-brand-hover text-white font-bold text-[13px] rounded-xl cursor-pointer shadow-sm shadow-brand/10 mt-2"><Lock className="w-4 h-4 inline mr-1.5" />Update Password</button>
            </div>
          )}

        </div>

        {/* Right Sidebar Cards */}
        <div className="space-y-6">
          {/* Store Preview */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-4">
            <div className="flex justify-between items-start">
              <div><h3 className="text-[14px] font-bold text-slate-800">Store Preview</h3><p className="text-[11px] text-slate-400 font-medium mt-0.5">See how your store appears to customers.</p></div>
              <button onClick={() => showToast('Opening store preview…', 'info')} className="flex items-center gap-1 text-[11.5px] font-bold text-slate-500 hover:text-brand cursor-pointer"><span>View Store</span><ExternalLink className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-black text-[16px] shrink-0 shadow-sm">R</div>
              <div><span className="font-extrabold text-slate-800 text-[14px] block">{storeName}</span><span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-100 ml-1">Active</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Total Products</span><span className="text-[16px] font-black text-slate-800">156</span></div>
              <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Total Orders</span><span className="text-[16px] font-black text-slate-800">3,562</span></div>
              <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Total Rating</span><span className="text-[16px] font-black text-slate-800">⭐ 4.8</span></div>
            </div>
          </div>

          {/* Store Status */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Store Status</h3>
            <p className="text-[11.5px] text-slate-400 font-medium">Manage your store availability.</p>
            <div className="flex items-center gap-3">
              <button onClick={handleToggleStoreLive} className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${storeIsLive ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${storeIsLive ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
              <div><span className="text-[13px] font-bold text-slate-800 block">{storeIsLive ? 'Store is Live' : 'Store is Offline'}</span>
                <span className="text-[11px] text-slate-400 font-medium">{storeIsLive ? 'Your store is visible to all customers.' : 'Your store is hidden from customers.'}</span></div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <div className="flex items-center gap-2"><h3 className="text-[14px] font-bold text-slate-800">Store Verification</h3>
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-100">Verified</span></div>
            <div className="flex items-start gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-slate-505 font-medium leading-relaxed">Your store is verified. Keep your information up to date to maintain verification.</p></div>
          </div>

          {/* Need Help */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Need Help?</h3>
            <p className="text-[12px] text-slate-400 font-medium">If you need any help with store settings, contact our support team.</p>
            <Link to="/help-support" className="inline-flex items-center gap-1.5 px-4 h-9 border border-brand/20 bg-[#FFF5F5] hover:bg-[#FFE5E5] text-brand font-bold text-[12px] rounded-xl transition-colors cursor-pointer">
              <HelpIcon className="w-4 h-4" />Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Store Offline Confirmation Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Take Store Offline?"
        footerButtons={<><button onClick={() => setIsStatusModalOpen(false)} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={handleConfirmOffline} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer">Go Offline</button></>}>
        <p className="text-[13px] text-slate-600 leading-relaxed">Your store will be hidden from all customers. Active orders will still be processed. You can bring your store back online at any time.</p>
      </Modal>
    </div>
  );
}
