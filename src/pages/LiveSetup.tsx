import { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Upload, 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  Radio, 
  Play, 
  FileCheck, 
  CheckCircle2, 
  Eye,
  Package
} from 'lucide-react';
import type { Product } from '../utils/productsData';
import { loadProducts } from '../utils/productsData';
import type { LiveStreamSession } from '../utils/liveStreamStore';
import { loadSession, saveSession } from '../utils/liveStreamStore';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

export default function LiveSetupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Load initial session state or defaults
  const [session, setSession] = useState<LiveStreamSession>(() => loadSession());
  
  // Local Form state
  const [title, setTitle] = useState(session.title);
  const [category, setCategory] = useState(session.category);
  const [description, setDescription] = useState(session.description);
  const [thumbnail, setThumbnail] = useState(session.thumbnail);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(session.products);
  const [quality, setQuality] = useState(session.quality);
  const [privacy, setPrivacy] = useState(session.privacy);
  const [allowChat, setAllowChat] = useState(session.allowChat);
  const [isScheduled, setIsScheduled] = useState(session.isScheduled);
  const [scheduledDate, setScheduledDate] = useState(session.scheduledDate);
  const [scheduledTime, setScheduledTime] = useState(session.scheduledTime);

  // Selector Modal state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  
  // Form validations errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const allInventoryProducts = useMemo(() => loadProducts(), []);

  // Thumbnail upload handler (Base64)
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Thumbnail size exceeds 5MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setThumbnail(evt.target.result as string);
        showToast('Thumbnail uploaded successfully.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnail('');
    showToast('Thumbnail removed.', 'info');
  };

  // Showcase Products Add / Remove
  const removeProductFromShowcase = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from showcase list.', 'info');
  };

  const toggleModalProductSelection = (prod: Product) => {
    const isSelected = selectedProducts.some(p => p.id === prod.id);
    if (isSelected) {
      setSelectedProducts(prev => prev.filter(p => p.id !== prod.id));
    } else {
      if (selectedProducts.length >= 6) {
        showToast('You can select a maximum of 6 products to showcase.', 'warning');
        return;
      }
      setSelectedProducts(prev => [...prev, prod]);
    }
  };

  // Category values list
  const categoryOptions = ['Electronics', 'Fashion', 'Footwear', 'Grocery', 'Beauty'];

  // Modal product filter queries
  const modalFilteredProducts = useMemo(() => {
    return allInventoryProducts.filter(p => {
      const q = modalSearchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });
  }, [allInventoryProducts, modalSearchQuery]);

  // Validate form properties
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Stream title is required.';
    if (!category) newErrors.category = 'Please select a stream category.';
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least 1 product must be selected to showcase.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit session properties and Go Live
  const handleGoLive = () => {
    if (!validateForm()) {
      showToast('Please correct validation errors on the form.', 'error');
      return;
    }

    const updatedSession: LiveStreamSession = {
      title: title.trim(),
      category,
      description: description.trim(),
      thumbnail,
      products: selectedProducts,
      pinnedProductId: selectedProducts[0]?.id || null, // Default to first product
      quality,
      privacy,
      allowChat,
      isScheduled,
      scheduledDate,
      scheduledTime,
    };

    saveSession(updatedSession);
    showToast('Stream initialized! Redirecting to Live Studio...', 'success');
    navigate('/live/session');
  };

  const handleSaveDraft = () => {
    const updatedSession: LiveStreamSession = {
      title: title.trim(),
      category,
      description: description.trim(),
      thumbnail,
      products: selectedProducts,
      pinnedProductId: selectedProducts[0]?.id || null,
      quality,
      privacy,
      allowChat,
      isScheduled,
      scheduledDate,
      scheduledTime,
    };
    saveSession(updatedSession);
    showToast('Stream settings saved as draft.', 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">
      
      {/* File picker for thumbnail */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleThumbnailUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Go Live Setup
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Live Streaming</span>
            <span>&gt;</span>
            <span className="text-slate-500">Go Live Setup</span>
          </div>
        </div>

        {/* Action button triggers */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Save Draft */}
          <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-slate-400" />
            <span>Save as Draft</span>
          </button>

          {/* Go Live Now */}
          <button 
            onClick={handleGoLive}
            className="flex items-center gap-2 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer"
          >
            <Radio className="w-4.5 h-4.5" />
            <span>Go Live Now</span>
          </button>
        </div>
      </div>

      {/* Layout Columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Form controls (2/3 width) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Basic Information */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Stream Title */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[12px] font-bold text-slate-600">
                    Stream Title <span className="text-brand">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{title.length}/100</span>
                </div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) {
                      setTitle(e.target.value);
                      if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                    }
                  }}
                  placeholder="Enter stream title"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.title ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                  }`}
                />
                {errors.title && <span className="text-[11px] font-bold text-rose-500">{errors.title}</span>}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  Category <span className="text-brand">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                  }}
                  className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="text-[11px] font-bold text-rose-500">{errors.category}</span>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[12px] font-bold text-slate-600">Stream Description</label>
                  <span className="text-[11px] text-slate-400">{description.length}/500</span>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setDescription(e.target.value);
                    }
                  }}
                  placeholder="Enter stream details..."
                  rows={3}
                  className="p-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all resize-none"
                />
              </div>

            </div>
          </div>

          {/* Stream Thumbnail upload row */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Stream Thumbnail
            </h3>

            <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center">
              {/* Image box preview */}
              <div className="w-full md:w-[260px] aspect-[16/9] border border-slate-150 rounded-xl bg-slate-50 overflow-hidden relative group shrink-0 flex items-center justify-center">
                {thumbnail ? (
                  <>
                    <img src={thumbnail} alt="stream preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white/95 text-[11px] font-bold text-slate-700 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        Replace
                      </button>
                      <button 
                        onClick={removeThumbnail}
                        className="px-3 py-1.5 bg-rose-500/90 text-[11px] font-bold text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <Upload className="w-7 h-7 stroke-1 text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-slate-600 block">No Thumbnail Loaded</span>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-[11px] font-bold text-brand hover:underline cursor-pointer"
                    >
                      Browse Images
                    </button>
                  </div>
                )}
              </div>

              {/* Tips block (light red) */}
              <div className="flex-1 bg-[#FFF0F0] border border-red-50 p-5 rounded-2xl space-y-2">
                <h4 className="text-[12px] font-black text-brand uppercase tracking-wider">Thumbnail Tips</h4>
                <ul className="space-y-1.5 text-[12.5px] font-bold text-slate-650">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Use high quality image (1280x720px)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>16:9 ratio recommended</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Max file size 5MB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Use bright and attractive colors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Selected Products Showcase */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
                Select Products to Showcase
              </h3>
              <span className="text-[12px] font-bold text-slate-400">
                {selectedProducts.length} Products Selected
              </span>
            </div>

            {/* List grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {selectedProducts.map(prod => (
                <div key={prod.id} className="relative border border-slate-100 rounded-xl p-3.5 bg-slate-50/20 text-center flex flex-col items-center justify-between min-h-[140px] group">
                  <button
                    onClick={() => removeProductFromShowcase(prod.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm cursor-pointer z-10"
                    aria-label="Remove product"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="w-12 h-12 rounded-lg border border-slate-100 bg-white flex items-center justify-center shrink-0 mb-2">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="min-w-0 w-full">
                    <h4 className="text-[12px] font-bold text-slate-800 truncate">{prod.name}</h4>
                    <span className="text-[11px] font-extrabold text-slate-850 block mt-0.5">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}

              {/* Add Product clicker */}
              <button
                onClick={() => {
                  setModalSearchQuery('');
                  setIsAddProductModalOpen(true);
                }}
                className="border-2 border-dashed border-slate-200 hover:border-brand/40 rounded-xl flex flex-col items-center justify-center min-h-[140px] text-slate-400 hover:text-brand transition-all cursor-pointer bg-white"
              >
                <Plus className="w-5 h-5 mb-1.5" />
                <span className="text-[12px] font-bold">Add Product</span>
              </button>
            </div>
            {errors.products && <span className="text-[11px] font-bold text-rose-500 block mt-1">{errors.products}</span>}
          </div>

          {/* Stream Settings */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Stream Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Quality & Chat */}
              <div className="space-y-4">
                {/* Quality selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-600">Stream Quality</label>
                  <select 
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="1080p (Recommended)">1080p (Recommended)</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                  </select>
                </div>

                {/* Allow Chat Toggle */}
                <div className="flex items-center justify-between p-3 border border-slate-50 rounded-xl bg-slate-50/20">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-850">Allow Live Chat</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Let viewers post live comments</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={allowChat}
                      onChange={(e) => setAllowChat(e.target.checked)}
                      className="sr-only peer cursor-pointer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" />
                  </label>
                </div>
              </div>

              {/* Stream Type (Public/Private) */}
              <div className="space-y-3.5">
                <label className="text-[12px] font-bold text-slate-600 block">Stream Visibility</label>
                <div className="space-y-3 bg-slate-50/20 p-4 border border-slate-50 rounded-xl">
                  {/* Public */}
                  <label className="flex items-start gap-3.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="privacy"
                      value="Public"
                      checked={privacy === 'Public'}
                      onChange={() => setPrivacy('Public')}
                      className="w-4 h-4 mt-0.5 text-brand focus:ring-brand cursor-pointer accent-brand"
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-850 group-hover:text-brand transition-colors">Public</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Anyone can discover and join the stream</span>
                    </div>
                  </label>

                  {/* Private */}
                  <label className="flex items-start gap-3.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="privacy"
                      value="Private"
                      checked={privacy === 'Private'}
                      onChange={() => setPrivacy('Private')}
                      className="w-4 h-4 mt-0.5 text-brand focus:ring-brand cursor-pointer accent-brand"
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-850 group-hover:text-brand transition-colors">Private</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Only people with the stream link can join</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Schedule stream scheduler */}
              <div className="md:col-span-2 space-y-4 border-t border-slate-50 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-850">Schedule Stream for Later</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Define scheduled release date/time details</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="sr-only peer cursor-pointer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" />
                  </label>
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-down">
                    {/* Date Picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Scheduled Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                        <input 
                          type="date" 
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    {/* Time Picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Scheduled Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                        <input 
                          type="time" 
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Preview details column (1/3 width) */}
        <div className="w-full lg:w-[360px] xl:w-[380px] flex flex-col gap-6 shrink-0">
          
          {/* Stream Preview Panel */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Stream Preview
            </h3>
            
            <p className="text-[11px] text-slate-400 mt-1 block">
              This is how your stream will appear to viewers.
            </p>

            {/* Video mock card overlay */}
            <div className="relative aspect-[16/9] border border-slate-150 rounded-xl bg-slate-900 overflow-hidden shadow-inner flex items-center justify-center">
              {thumbnail ? (
                <img src={thumbnail} alt="preview" className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="text-center p-4 select-none flex flex-col items-center justify-center text-slate-550">
                  <Play className="w-10 h-10 stroke-1 stroke-slate-500 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Video Capture Mock</span>
                </div>
              )}
              {/* Overlay elements */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-brand text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm select-none">
                LIVE
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm select-none">
                <Eye className="w-3 h-3 shrink-0" />
                1.2K
              </div>
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-gradient-to-t from-black/80 to-transparent flex flex-col text-left">
                <span className="text-white text-[12px] font-black tracking-tight leading-snug line-clamp-2">
                  {title || 'Go Live Stream Session'}
                </span>
                <span className="text-[9.5px] text-brand font-bold uppercase tracking-wider mt-0.5">
                  {category || 'No Category'}
                </span>
              </div>
            </div>

            {/* User profile widget */}
            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full border border-slate-150 bg-brand-light flex items-center justify-center font-bold text-[11px] text-brand shrink-0">
                  AS
                </div>
                <div className="text-left leading-tight">
                  <h4 className="text-[13px] font-bold text-slate-800">Ajay Store</h4>
                  <span className="text-[11px] text-slate-400">Vendor</span>
                </div>
              </div>
              <span className="border border-brand text-brand font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider leading-none shadow-xs shadow-brand/2 bg-brand-light">
                LIVE SOON
              </span>
            </div>

            {/* Metadata icons bar */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-4 text-center text-slate-500 font-semibold text-[11px]">
              <div className="flex flex-col items-center">
                <Calendar className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-400">Date</span>
                <span className="text-slate-800 block truncate w-full">22 May, 2024</span>
              </div>
              <div className="flex flex-col items-center">
                <Package className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-400">Category</span>
                <span className="text-slate-800 block truncate w-full">{category || 'Select'}</span>
              </div>
              <div className="flex flex-col items-center">
                <Radio className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-400">Visibility</span>
                <span className="text-slate-800 block truncate w-full">{privacy}</span>
              </div>
            </div>

          </div>

          {/* Stream Summary Details */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Stream Summary
            </h3>
            
            <div className="space-y-2 text-[12.5px] font-medium text-slate-500">
              <div className="flex justify-between items-baseline gap-2">
                <span>Title</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">{title || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Category</span>
                <span className="font-bold text-slate-800">{category || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Products</span>
                <span className="font-bold text-slate-800">{selectedProducts.length} Showcase items</span>
              </div>
              <div className="flex justify-between">
                <span>Stream Type</span>
                <span className="font-bold text-slate-800">{privacy}</span>
              </div>
              <div className="flex justify-between">
                <span>Stream Quality</span>
                <span className="font-bold text-slate-800">{quality}</span>
              </div>
              <div className="flex justify-between">
                <span>Chat</span>
                <span className="font-bold text-slate-800">{allowChat ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          {/* Checklist card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3.5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Before You Go Live
            </h3>
            
            <ul className="space-y-2.5 text-[12.5px] font-semibold text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
                <span>Ensure good internet connection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
                <span>Check camera and microphone</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
                <span>Test your stream before going live</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
                <span>Have your products ready</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Showcase Product Selection Modal */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        title="Add Products to Showcase"
        footerButtons={
          <button 
            onClick={() => setIsAddProductModalOpen(false)}
            className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4 max-w-[480px]">
          {/* Modal Search query */}
          <input 
            type="text"
            value={modalSearchQuery}
            onChange={(e) => setModalSearchQuery(e.target.value)}
            placeholder="Search by name, SKU or category..."
            className="w-full h-10 px-3.5 text-[13px] border border-slate-100 bg-slate-50/50 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all"
          />

          <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1 text-left">
            {modalFilteredProducts.length > 0 ? (
              modalFilteredProducts.map((prod) => {
                const isSelected = selectedProducts.some(p => p.id === prod.id);
                return (
                  <div 
                    key={prod.id} 
                    onClick={() => toggleModalProductSelection(prod)}
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
                      isSelected ? 'border-brand/35 bg-[#FFF0F0]/10' : 'border-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by click
                        className="w-4 h-4 rounded text-brand focus:ring-brand cursor-pointer accent-brand"
                      />
                      <div className="text-[13px]">
                        <span className="font-bold text-slate-850 block">{prod.name}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">SKU: {prod.sku} | Price: ₹{prod.price}</span>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-extrabold text-slate-850">₹{prod.price}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-[12px] font-medium text-slate-400 py-6">No products match your search.</p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
