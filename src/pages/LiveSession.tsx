import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wifi, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share2, 
  Settings as SettingsIcon, 
  Eye, 
  ThumbsUp, 
  Heart, 
  Send, 
  Pin,
  Shield,
  MessageCircle,
  X,
  Play,
  Maximize2,
  Package
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { ChatMessage, LiveStreamSession } from '../utils/liveStreamStore';
import { loadSession, defaultChatMessages } from '../utils/liveStreamStore';
import type { Product } from '../utils/productsData';
import { useToast } from '../context/ToastContext';
import FloatingReactions from '../components/live/FloatingReactions';
import type { Reaction } from '../components/live/FloatingReactions';
import Modal from '../components/common/Modal';

// Mock Sparkline Graph Datasets
const sparklineData = [
  { val: 12 }, { val: 24 }, { val: 18 }, { val: 32 }, { val: 28 }, { val: 40 }, { val: 38 }
];

export default function LiveSessionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Load session configurations
  const [session, setSession] = useState<LiveStreamSession>(() => loadSession());
  
  // Device toggle toggles
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isEndingLive, setIsEndingLive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live Timer metrics
  const [elapsedSeconds, setElapsedSeconds] = useState(1122); // starts at 18 mins 42 secs
  
  // Chats list
  const [chats, setChats] = useState<ChatMessage[]>(defaultChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [slowMode, setSlowMode] = useState(false);
  const [isChatMuted, setIsChatMuted] = useState(false);

  // Showcase Products list
  const [pinnedProductId, setPinnedProductId] = useState<string | null>(session.pinnedProductId);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  // Reactions floating emitter state
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [likeCount, setLikeCount] = useState(2435);

  // Moderation state
  const [chatMode, setChatMode] = useState<'All' | 'Followers Only'>('Followers Only');
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  // Timer counter ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs > 0 ? hrs.toString().padStart(2, '0') : null,
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  // Auto-scroll chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  // Floating Reactions Spawner
  const spawnReaction = (emoji: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const left = Math.floor(Math.random() * 40) + 50; // spawn on the right half (50% to 90%)
    
    // Custom colors
    const colors = ['#FE060D', '#F59E0B', '#3B82F6', '#10B981', '#EC4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setReactions(prev => [...prev, { id, emoji, left, color }]);
    setLikeCount(prev => prev + 1);

    // Auto-clean reaction elements
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2200);
  };

  // Add message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (isChatMuted) {
      showToast('Chat is currently muted by Host.', 'warning');
      return;
    }

    const newChat: ChatMessage = {
      id: Math.random().toString(),
      username: 'Ajay Store',
      message: chatInput.trim(),
      role: 'host',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      avatarLetter: 'AS'
    };

    setChats(prev => [...prev, newChat]);
    setChatInput('');

    // If slow mode, add a delay warning
    if (slowMode) {
      showToast('Slow mode is active. (3s delay)', 'info');
    }
  };

  // Showcase layout details
  const pinnedProduct = useMemo(() => {
    return session.products.find(p => p.id === pinnedProductId) || null;
  }, [session, pinnedProductId]);

  const handlePinProduct = (id: string) => {
    setPinnedProductId(id);
    const prod = session.products.find(p => p.id === id);
    if (prod) {
      showToast(`Pinned product "${prod.name}" to screen.`, 'success');
      
      // Auto post chat pinned system message
      const systemMessage: ChatMessage = {
        id: Math.random().toString(),
        username: 'Ajay Store',
        message: `Pinned Product: ${prod.name} (Get it now at ₹${prod.price}!) 🛍️`,
        role: 'host',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        avatarLetter: 'AS'
      };
      setChats(prev => [...prev, systemMessage]);
    }
  };

  const handleUnpinProduct = () => {
    setPinnedProductId(null);
    showToast('Unpinned product.', 'info');
  };

  const handleEndLiveConfirm = () => {
    setIsEndingLive(false);
    showToast('Live stream has ended successfully.', 'success');
    navigate('/live/setup');
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error(err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">
      
      {/* Title Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[20px] font-black text-slate-800 tracking-tight leading-tight">
              {session.title}
            </h1>
            <button className="p-1 text-slate-400 hover:text-slate-650 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-4 text-[12px] font-bold text-slate-400 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              <Wifi className="w-3.5 h-3.5" />
              Connection: Excellent
            </span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-650">HD</span>
            <span className="text-slate-400">Quality: {session.quality}</span>
          </div>
        </div>

        {/* Toolbar switches */}
        <div className="flex items-center gap-3 self-start xl:self-auto flex-wrap">
          {/* Mic */}
          <button 
            onClick={() => {
              setIsMicOn(!isMicOn);
              showToast(isMicOn ? 'Microphone muted.' : 'Microphone unmuted.', 'info');
            }}
            className={`w-11 h-11 border rounded-xl flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
              isMicOn ? 'bg-white border-slate-100 text-slate-650 hover:bg-slate-50' : 'bg-rose-50 border-rose-100 text-rose-500'
            }`}
          >
            {isMicOn ? <Mic className="w-4.5 h-4.5" /> : <MicOff className="w-4.5 h-4.5" />}
          </button>

          {/* Cam */}
          <button 
            onClick={() => {
              setIsCamOn(!isCamOn);
              showToast(isCamOn ? 'Camera turned OFF.' : 'Camera turned ON.', 'info');
            }}
            className={`w-11 h-11 border rounded-xl flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
              isCamOn ? 'bg-white border-slate-100 text-slate-650 hover:bg-slate-50' : 'bg-rose-50 border-rose-100 text-rose-500'
            }`}
          >
            {isCamOn ? <Video className="w-4.5 h-4.5" /> : <VideoOff className="w-4.5 h-4.5" />}
          </button>

          {/* Share */}
          <button 
            onClick={() => showToast('Session link copied to clipboard.', 'success')}
            className="w-11 h-11 border border-slate-100 bg-white hover:bg-slate-50 text-slate-655 rounded-xl flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>

          {/* Settings */}
          <button 
            onClick={() => showToast('Settings panels opened.', 'info')}
            className="w-11 h-11 border border-slate-100 bg-white hover:bg-slate-50 text-slate-655 rounded-xl flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-4.5 h-4.5" />
          </button>

          {/* End Live */}
          <button 
            onClick={() => setIsEndingLive(true)}
            className="h-11 px-5 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer"
          >
            End Live
          </button>
        </div>
      </div>

      {/* Sub Header counts */}
      <div className="flex items-center gap-4 text-[12px] font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 flex-wrap">
        <span className="flex items-center gap-1 bg-brand text-white px-2 py-0.5 rounded font-extrabold select-none">
          LIVE
        </span>
        <span className="text-slate-800 font-extrabold">{formatTimer(elapsedSeconds)}</span>
        <div className="w-px h-3 bg-slate-200" />
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          1,248 Viewers
        </span>
        <div className="w-px h-3 bg-slate-200" />
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
          {likeCount.toLocaleString('en-IN')} Likes
        </span>
      </div>

      {/* Grid body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Video + Pinned showcase (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          
          {/* Main Video player simulator */}
          <div 
            ref={videoRef}
            className="relative aspect-[16/9] bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group"
          >
            
            {/* Animated video canvas feed simulation */}
            {isCamOn ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#334155] opacity-90 flex items-center justify-center">
                {/* Decorative floating waveforms */}
                <div className="absolute inset-0 bg-radial-gradient from-brand/5 to-transparent opacity-60" />
                
                {/* Simulated webcam silhouette */}
                <div className="flex flex-col items-center justify-center text-white/10 select-none">
                  <Video className="w-24 h-24 stroke-1 stroke-white/10" />
                  <span className="text-[12px] font-black tracking-widest mt-2 uppercase text-white/5">Razzia Broadcaster Feed</span>
                </div>

                {/* Left Live Tag Overlay inside video */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand text-white text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md select-none">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shrink-0" />
                  LIVE
                </div>

                {/* Right overlays inside video */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/45 backdrop-blur-md text-white rounded-lg hover:bg-black/60 transition-colors shadow cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Overlay Host Description details bottom-left */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-left rounded-xl flex items-end justify-between">
                  <div>
                    <span className="text-white text-[14px] font-black tracking-tight flex items-center gap-1 leading-none mb-1">
                      Ajay Store
                      <span className="w-3.5 h-3.5 bg-brand text-white rounded-full flex items-center justify-center text-[7px] font-black border border-white">✓</span>
                    </span>
                    <p className="text-slate-350 text-[12px] font-medium leading-relaxed max-w-[480px] line-clamp-2">
                      Welcome everyone! Grab the best deals today only. Get 10% discount on Pinned items! 🔥
                    </p>
                  </div>

                  {/* Likes counter indicator */}
                  <div className="flex flex-col items-center shrink-0">
                    <button 
                      onClick={() => spawnReaction('❤️')}
                      className="w-11 h-11 bg-brand text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Heart className="w-5 h-5 fill-white" />
                    </button>
                    <span className="text-[10px] text-white/80 font-bold mt-1.5">{likeCount.toLocaleString('en-IN')} Likes</span>
                  </div>
                </div>

                {/* Floating Hearts Emitter */}
                <FloatingReactions reactions={reactions} />

              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 select-none">
                <VideoOff className="w-12 h-12 mb-2 stroke-1" />
                <span className="text-[13px] font-bold">Camera feed disabled</span>
              </div>
            )}

          </div>

          {/* Showcasing (Pinned Product) Section */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                Showcasing (Pinned Product)
              </h3>
              <button 
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-1.5 border border-slate-100 hover:bg-slate-50 text-[12px] font-bold text-slate-600 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Manage Products
              </button>
            </div>

            {/* Pinned detailed card preview */}
            {pinnedProduct ? (
              <div className="flex flex-col sm:flex-row gap-5 border border-brand/20 bg-[#FFF0F0]/5 p-5 rounded-2xl relative overflow-hidden animate-slide-in">
                <div className="absolute top-0 left-0 bg-brand text-white text-[9px] font-extrabold px-3 py-1 rounded-br-lg flex items-center gap-1 uppercase tracking-wider select-none">
                  <Pin className="w-3 h-3 fill-white" /> Pinned
                </div>
                
                {/* Image */}
                <div className="w-full sm:w-[130px] aspect-square rounded-xl border border-slate-100 bg-white flex items-center justify-center shrink-0">
                  <Package className="w-12 h-12 text-slate-350" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <h4 className="text-[16px] font-black text-slate-850 tracking-tight leading-tight mt-3 sm:mt-0">{pinnedProduct.name}</h4>
                    <span className="text-[12px] text-slate-400 block font-semibold">SKU: {pinnedProduct.sku} | Category: {pinnedProduct.category}</span>
                    <p className="text-[12.5px] text-slate-500 leading-normal line-clamp-2 pt-1">{pinnedProduct.shortDescription}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-3 flex-wrap border-t border-slate-50/50 pt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-extrabold text-brand">₹{pinnedProduct.price}</span>
                      {pinnedProduct.discountPrice && (
                        <>
                          <span className="text-[14px] text-slate-400 line-through">₹{pinnedProduct.discountPrice}</span>
                          <span className="bg-brand-light text-brand text-[10px] font-extrabold px-1.5 py-0.5 rounded">48% OFF</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[11.5px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {pinnedProduct.stock} in stock
                      </span>
                      <button 
                        onClick={handleUnpinProduct}
                        className="px-4 h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[12px] rounded-lg transition-colors cursor-pointer"
                      >
                        Unpin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl text-[13px] font-medium text-slate-400 bg-slate-50/20">
                No product is currently pinned. Click pin on any product card below.
              </div>
            )}

            {/* Selected products slider row */}
            <div className="pt-2">
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Showcase Carousel</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {session.products.map(prod => {
                  const isPinned = prod.id === pinnedProductId;
                  return (
                    <div 
                      key={prod.id} 
                      className={`border rounded-xl p-3.5 bg-white text-left flex flex-col justify-between gap-3 shadow-xs relative transition-all duration-200 ${
                        isPinned ? 'border-brand/35 bg-[#FFF0F0]/10 shadow-sm shadow-brand/2' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-[12px] font-bold text-slate-800 truncate">{prod.name}</h5>
                          <span className="text-[11px] font-extrabold text-slate-850">₹{prod.price}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-1.5 pt-2 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-bold">{prod.stock} left</span>
                        <button
                          onClick={() => isPinned ? handleUnpinProduct() : handlePinProduct(prod.id)}
                          className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${
                            isPinned ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-brand-light text-brand hover:bg-brand hover:text-white'
                          }`}
                        >
                          {isPinned ? 'Unpin' : 'Pin'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Chat & Moderation Panel (1/3 width) */}
        <div className="w-full lg:col-span-1 flex flex-col gap-6 shrink-0">
          
          {/* Live Chat Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 bg-slate-50/20">
              <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                Live Chat
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsChatMuted(!isChatMuted)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    isChatMuted ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-100 border-slate-200 text-slate-655 hover:bg-slate-200'
                  }`}
                >
                  {isChatMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            </div>

            {/* Pinned system text banner */}
            <div className="bg-[#FFF0F0] border-b border-red-50/50 px-4 py-2.5 flex items-start gap-2.5 text-[12px]">
              <Pin className="w-4 h-4 text-brand fill-brand shrink-0 mt-0.5" />
              <div className="text-left leading-normal font-semibold text-slate-700">
                <span className="font-extrabold text-brand">Host Pinned:</span> Use code <span className="font-extrabold text-brand bg-white px-1.5 py-0.5 rounded border border-brand/10">RAZZIA10</span> to grab extra 10% discount during stream checkout! 🚀
              </div>
            </div>

            {/* Messages box list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {chats.map(chat => {
                const isHost = chat.role === 'host';
                return (
                  <div key={chat.id} className="flex items-start gap-2.5 text-[12.5px] animate-slide-in">
                    {/* User profile letters */}
                    <div className={`w-[28px] h-[28px] rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] ${
                      isHost ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {chat.avatarLetter}
                    </div>

                    {/* Chat Text details */}
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold ${isHost ? 'text-brand' : 'text-slate-800'}`}>{chat.username}</span>
                        {isHost && (
                          <span className="bg-brand text-white text-[8px] font-extrabold px-1 rounded uppercase tracking-wider">
                            Host
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-semibold">{chat.timestamp}</span>
                      </div>
                      <p className="text-slate-655 font-medium leading-relaxed mt-0.5 break-words">
                        {chat.message}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Chat inputs submission box */}
            <form onSubmit={handleSendChat} className="border-t border-slate-50 p-4 space-y-2 bg-slate-50/20">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatMuted}
                  placeholder={isChatMuted ? 'Chat has been muted by Host' : 'Type a message...'}
                  className="flex-1 h-10 px-3.5 text-[13px] border border-slate-150 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white bg-white transition-all disabled:opacity-50"
                />
                
                {/* Emoji pop selector clickers */}
                <button 
                  type="button" 
                  onClick={() => spawnReaction('❤️')}
                  className="p-2 border border-slate-100 rounded-xl bg-white text-rose-500 hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <Heart className="w-4.5 h-4.5 fill-rose-500" />
                </button>

                <button 
                  type="submit" 
                  disabled={isChatMuted || !chatInput.trim()}
                  className="w-10 h-10 bg-brand text-white hover:bg-brand-hover rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 fill-white" />
                </button>
              </div>

              {/* Slow mode switcher */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1 pt-1">
                <span className="flex items-center gap-1 select-none">
                  {slowMode ? 'Slow Mode Active (3s)' : 'Slow Mode Inactive'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={slowMode}
                    onChange={(e) => setSlowMode(e.target.checked)}
                    className="sr-only peer cursor-pointer" 
                  />
                  <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand" />
                </label>
              </div>
            </form>
          </div>

          {/* Moderation settings widget */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Shield className="w-4 h-4 text-slate-450" />
              Live Moderation
            </h3>

            <div className="space-y-3.5 text-[12.5px] font-semibold text-slate-505 text-left">
              {/* Followers Chat Mode select */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Chat Mode</span>
                <button 
                  onClick={() => {
                    const next = chatMode === 'All' ? 'Followers Only' : 'All';
                    setChatMode(next);
                    showToast(`Chat restricted to: ${next}`, 'info');
                  }}
                  className="text-brand hover:underline cursor-pointer"
                >
                  {chatMode} &gt;
                </button>
              </div>

              {/* Blocked words count */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Blocked Words</span>
                <span className="text-slate-800">12 Words &gt;</span>
              </div>

              {/* Muted Users list */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Muted Users</span>
                <span className="text-slate-850">3 Users &gt;</span>
              </div>

              {/* Action trigger button */}
              <button 
                onClick={() => setIsModerationModalOpen(true)}
                className="w-full h-10 border border-brand/20 hover:bg-[#FFF0F0]/10 text-brand font-extrabold text-[12.5px] rounded-xl transition-colors cursor-pointer flex items-center justify-center bg-white"
              >
                View All Moderation Settings
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Live Analytics Row using Recharts AreaCharts */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 border-b border-slate-50 pb-2">
          Live Analytics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Total Viewers */}
          <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/20 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate leading-none">Total Viewers</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black text-slate-805 leading-none">1,248</span>
              <span className="text-[9px] font-extrabold text-emerald-600 leading-none bg-emerald-50 px-1 rounded-sm">+18.4%</span>
            </div>
            <div className="w-full h-[32px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={1.5} fillOpacity={0.06} fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Peak Viewers */}
          <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/20 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate leading-none">Peak Viewers</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black text-slate-805 leading-none">1,580</span>
              <span className="text-[9px] font-extrabold text-emerald-600 leading-none bg-emerald-50 px-1 rounded-sm">+22.7%</span>
            </div>
            <div className="w-full h-[32px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={1.5} fillOpacity={0.06} fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3: Total Likes */}
          <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/20 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate leading-none">Total Likes</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black text-slate-805 leading-none">2,435</span>
              <span className="text-[9px] font-extrabold text-emerald-600 leading-none bg-emerald-50 px-1 rounded-sm">+20.1%</span>
            </div>
            <div className="w-full h-[32px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={1.5} fillOpacity={0.06} fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 4: Product Clicks */}
          <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/20 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate leading-none">Product Clicks</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black text-slate-850 leading-none">842</span>
              <span className="text-[9px] font-extrabold text-emerald-600 leading-none bg-emerald-50 px-1 rounded-sm">+16.3%</span>
            </div>
            <div className="w-full h-[32px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={0.06} fill="#3B82F6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 5: Orders */}
          <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/20 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate leading-none">Orders</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black text-slate-850 leading-none">156</span>
              <span className="text-[9px] font-extrabold text-emerald-600 leading-none bg-emerald-50 px-1 rounded-sm">+15.6%</span>
            </div>
            <div className="w-full h-[32px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={1.5} fillOpacity={0.06} fill="#8B5CF6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 6: Revenue */}
          <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/20 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate leading-none">Revenue</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-black text-slate-850 leading-none">₹45,680</span>
              <span className="text-[9px] font-extrabold text-emerald-600 leading-none bg-emerald-50 px-1 rounded-sm">+20.8%</span>
            </div>
            <div className="w-full h-[32px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#FE060D" strokeWidth={1.5} fillOpacity={0.06} fill="#FE060D" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* End Live Broadcast Confirmation Modal */}
      <Modal
        isOpen={isEndingLive}
        onClose={() => setIsEndingLive(false)}
        title="End Live Stream"
        footerButtons={
          <>
            <button 
              onClick={() => setIsEndingLive(false)}
              className="h-10 px-4 border border-slate-100 hover:bg-slate-50 text-[13px] font-bold text-slate-655 rounded-xl transition-colors cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button 
              onClick={handleEndLiveConfirm}
              className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
            >
              End Session
            </button>
          </>
        }
      >
        <p className="text-[13px] text-slate-600 leading-relaxed">
          Are you sure you want to end your live stream? This will stop broadcasting to all viewers and compile your final live analytics dashboard record.
        </p>
      </Modal>

      {/* Moderation Details Modal */}
      <Modal
        isOpen={isModerationModalOpen}
        onClose={() => setIsModerationModalOpen(false)}
        title="Moderation Center"
        footerButtons={
          <button 
            onClick={() => setIsModerationModalOpen(false)}
            className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        }
      >
        <div className="space-y-4 max-w-[480px] text-left text-[13px]">
          <div>
            <h4 className="font-extrabold text-slate-800 mb-1.5">Muted Users list</h4>
            <ul className="space-y-1.5 bg-slate-50 p-3.5 border border-slate-100 rounded-xl">
              <li className="flex justify-between font-semibold text-slate-700">
                <span>user_9912 (Spam links)</span>
                <span className="text-slate-400">Muted 10m ago</span>
              </li>
              <li className="flex justify-between font-semibold text-slate-700">
                <span>alex_shopper (Flooding chat)</span>
                <span className="text-slate-400">Muted 20m ago</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-800 mb-1.5">Blocked Keywords list</h4>
            <div className="flex flex-wrap gap-1.5 bg-slate-50 p-3.5 border border-slate-100 rounded-xl">
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-655">fake</span>
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-655">scam</span>
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-655">cheap</span>
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-655">promo</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Setup Products Pinner selector modal */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        title="Manage Showcase Products"
        footerButtons={
          <button 
            onClick={() => setIsAddProductModalOpen(false)}
            className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        }
      >
        <div className="space-y-3 max-w-[480px] text-left text-[13px]">
          <p className="text-slate-400">Current products in live showcase. Unpinning or pinning items updates overlays instantly.</p>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {session.products.map(prod => {
              const isPinned = prod.id === pinnedProductId;
              return (
                <div key={prod.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">{prod.name}</span>
                    <span className="text-[11px] text-slate-400">Price: ₹{prod.price}</span>
                  </div>
                  <button 
                    onClick={() => isPinned ? handleUnpinProduct() : handlePinProduct(prod.id)}
                    className={`px-3 h-8 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      isPinned ? 'bg-slate-900 text-white hover:bg-slate-850' : 'bg-brand-light text-brand hover:bg-brand hover:text-white'
                    }`}
                  >
                    {isPinned ? 'Unpinned' : 'Pin Product'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

    </div>
  );
}
