import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight, ShieldCheck, MessageSquare, Flame, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Live simulator stats
  const [viewerCount, setViewerCount] = useState(1284);
  const [revenue, setRevenue] = useState(54250);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    document.documentElement.classList.add('auth-layout');
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
      setRevenue(prev => prev + Math.floor(Math.random() * 20));
      setHearts(prev => [...prev, { id: Math.random(), left: Math.floor(Math.random() * 60) + 20 }]);
    }, 2500);
    return () => {
      document.documentElement.classList.remove('auth-layout');
      clearInterval(interval);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const capsLock = e.getModifierState && e.getModifierState('CapsLock');
    setIsCapsLock(capsLock);
  };

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!emailValid) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Validation failed. Please check the fields.', 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast('Sign-in successful. Welcome back.', 'success');
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div 
      onKeyUp={handleKeyPress}
      className="h-screen w-full bg-[#FCFBFA] text-slate-850 flex flex-col lg:flex-row font-sans overflow-hidden relative select-none"
    >
      {/* Tactile Noise Overlay & Ambient Brand Spotlights */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        {/* Animated Ambient Light Blobs */}
        <motion.div 
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(254,6,13,0.05)_0%,transparent_70%)] rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(254,6,13,0.025)_0%,transparent_70%)] rounded-full blur-[90px]" 
        />
      </div>

      {/* LEFT COLUMN: Production-Grade Live Commerce Console Preview */}
      <div className="hidden lg:flex lg:w-[50%] h-full flex-col justify-between pt-10 pb-6 px-12 xl:pt-12 xl:pb-8 xl:px-16 relative z-10 border-r border-slate-100 bg-[#FAF9F5]/40 backdrop-blur-3xl overflow-hidden">
        
        {/* Logo & Hero Header grouped to prevent overlap */}
        <div className="flex flex-col gap-6 xl:gap-8 w-full max-w-[520px]">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Razzia" className="h-9.5 w-auto object-contain" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FE060D]/5 border border-[#FE060D]/10 w-fit">
              <Sparkles className="w-4 h-4 text-[#FE060D]" />
              <span className="text-[11px] font-bold text-[#FE060D] uppercase tracking-wider">Unified Commerce Console</span>
            </div>
            <h1 className="text-[38px] xl:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
              Stream live video. <br />Sell instantly.
            </h1>
            <p className="text-[14.5px] xl:text-[15.5px] text-slate-500 leading-relaxed max-w-[480px]">
              Join thousands of brands hosting interactive livestreams, pinning product catalogues, and securing lightning-fast payments.
            </p>
          </div>
        </div>

        {/* High-Fidelity UI Component */}
        <div className="w-full max-w-[520px] my-auto pt-4">
          <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.04)] text-left select-none overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[13.5px] font-bold text-slate-850">Aura Lounge Stream</span>
              </div>
              <div className="flex items-center gap-3.5 text-[10.5px] font-bold text-slate-550">
                <span className="bg-[#FE060D]/5 border border-[#FE060D]/10 text-[#FE060D] px-2.5 py-0.5 rounded">
                  {viewerCount} Live
                </span>
                <span>42:15</span>
              </div>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-5 gap-3 relative">
              {/* Product cards */}
              <div className="col-span-3 space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Pinned Store Items</span>
                {[
                  { title: 'Aero Studio Headset', price: '₹14,999', stock: '8 left', emoji: '🎧' },
                  { title: 'Nordic Knitwear', price: '₹3,499', stock: '24 left', emoji: '🧥' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-slate-150 rounded-xl p-2.5 bg-[#FCFBFA]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[15px]">
                        {item.emoji}
                      </div>
                      <div>
                        <h4 className="text-[11.5px] font-bold text-slate-850 leading-tight truncate max-w-[110px]">{item.title}</h4>
                        <p className="text-[9.5px] text-slate-500 font-medium">{item.stock}</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-900">{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Chat log */}
              <div className="col-span-2 bg-[#FCFBFA] border border-slate-150 rounded-xl p-3 flex flex-col justify-between h-[110px] relative overflow-hidden">
                <div className="space-y-1.5 overflow-hidden">
                  <div className="flex items-center gap-1 text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                    <MessageSquare className="w-2.5 h-2.5" /> Chat Feed
                  </div>
                  <div className="text-[10px] leading-tight space-y-1.5">
                    <p className="text-slate-750 font-semibold"><span className="text-neutral-500">Ajay S.</span> Pinned item!</p>
                    <p className="text-slate-750 font-semibold"><span className="text-neutral-500">Meera K.</span> Ordered size S!</p>
                  </div>
                </div>
                
                {/* Floating Heart Reactions Container */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {hearts.map(heart => (
                    <motion.div
                      key={heart.id}
                      initial={{ y: 90, opacity: 1, scale: 0.8 }}
                      animate={{ y: -35, opacity: 0, scale: 1.2 }}
                      transition={{ duration: 2.5, ease: 'easeOut' }}
                      onAnimationComplete={() => setHearts(prev => prev.filter(h => h.id !== heart.id))}
                      style={{ left: `${heart.left}%` }}
                      className="absolute text-rose-500 text-[14px]"
                    >
                      ❤️
                    </motion.div>
                  ))}
                </div>

                <div className="text-[9px] text-emerald-650 bg-emerald-500/10 py-0.5 rounded font-bold text-center z-10">
                  +12 sales this session
                </div>
              </div>
            </div>

            {/* Bottom Revenue chart */}
            <div className="mt-4.5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Session GMV</span>
                  <span className="text-[15px] font-bold text-slate-850">₹{revenue.toLocaleString()}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +14.2%
                </span>
              </div>
              <svg viewBox="0 0 60 16" className="w-20 h-6 overflow-visible">
                <polyline
                  points="0,14 10,12 20,13 30,8 40,9 50,4 60,6"
                  fill="none" stroke="#FE060D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] tracking-wider text-slate-400 font-bold uppercase select-none border-t border-slate-100/60 pt-4">
          <span>&copy; 2026 Razzia Marketplace Inc.</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#FE060D]" />
            <span>Powering modern commerce</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Premium Clean Card Login Form */}
      <div className="flex-1 lg:w-[50%] h-full flex flex-col justify-between pt-10 pb-6 px-12 xl:pt-12 xl:pb-8 xl:px-16 relative z-10 overflow-hidden">
        
        {/* Top Header bar */}
        <div className="flex items-center justify-between lg:justify-end select-none">
          <img src="/logo.svg" alt="Razzia" className="h-7 w-auto object-contain lg:hidden" />
          <div className="flex items-center gap-4">
            <span className="text-[16px] xl:text-[17px] text-slate-500 font-medium">Need a workspace?</span>
            <Link 
              to="/signup" 
              className="text-[16px] xl:text-[17px] font-extrabold text-[#FE060D] hover:text-[#FE060D]/80 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Clean Login Form Container */}
        <div className="w-full max-w-[520px] mx-auto my-auto py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="space-y-5"
          >
            {/* Mobile-visible premium animated banner */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
              }}
              className="inline-flex lg:hidden items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE060D]/5 border border-[#FE060D]/10 text-[#FE060D] text-[10px] font-bold uppercase tracking-wider mb-1 w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FE060D] animate-ping" />
              <span>⚡ ₹5.4L+ live commerce processed today</span>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
              }}
              className="text-left"
            >
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight mb-2">
                Sign in to Razzia
              </h2>
              <p className="text-[14px] text-slate-500">
                Welcome back. Enter your credentials to manage your store console.
              </p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Input Field: Email */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="relative text-left"
              >
                <label 
                  className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold
                    ${focusedField === 'email' || email 
                      ? 'top-2.5 text-[9px] text-[#FE060D] tracking-wider uppercase' 
                      : 'top-4.5 text-[13.5px] text-slate-450'}`}
                >
                  Email Address
                </label>
                <input 
                  type="email"
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200
                    ${focusedField === 'email' 
                      ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' 
                      : errors.email 
                        ? 'border-[#FE060D]/40 bg-[#FE060D]/5' 
                        : 'border-slate-200 hover:border-slate-350'}`}
                />
                <div className="absolute right-4 top-4.5 text-slate-400">
                  <Mail className="w-[16px] h-[16px]" />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-semibold text-[#FE060D] mt-1.5 ml-1 flex items-center gap-1"
                    >
                      🚫 {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Input Field: Password */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="relative text-left"
              >
                <label 
                  className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold
                    ${focusedField === 'password' || password 
                      ? 'top-2.5 text-[9px] text-[#FE060D] tracking-wider uppercase' 
                      : 'top-4.5 text-[13.5px] text-slate-450'}`}
                >
                  Password
                </label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200
                    ${focusedField === 'password' 
                      ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' 
                      : errors.password 
                        ? 'border-[#FE060D]/40 bg-[#FE060D]/5' 
                        : 'border-slate-200 hover:border-slate-355'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4.5 text-slate-450 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                </button>
                
                <AnimatePresence>
                  {isCapsLock && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10.5px] font-bold text-amber-600 mt-1 ml-1"
                    >
                      ⚠️ Caps Lock is active
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-semibold text-[#FE060D] mt-1.5 ml-1 flex items-center gap-1"
                    >
                      🚫 {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Options */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex justify-between items-center pt-1"
              >
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 border-slate-250 rounded text-[#FE060D] focus:ring-0 focus:ring-offset-0 checked:bg-[#FE060D]" 
                  />
                  <span className="text-[13px] font-semibold text-slate-500 select-none">Remember this device</span>
                </label>
                <Link to="/forgot-password" className="text-[13px] font-bold text-[#FE060D] hover:underline">
                  Forgot password?
                </Link>
              </motion.div>

              {/* Solid Brand Red CTA button */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className="w-full h-13 bg-[#FE060D] hover:bg-[#E0050B] text-white font-bold rounded-xl text-[14px] flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 disabled:opacity-75 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Social Divider */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 }
              }}
              className="relative flex items-center justify-center py-2"
            >
              <div className="absolute inset-x-0 h-px bg-slate-100" />
              <span className="relative bg-[#FCFBFA] px-3 text-[9.5px] font-bold tracking-widest text-slate-400 uppercase">
                OR CONTINUE WITH
              </span>
            </motion.div>

            {/* Social login buttons */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 }
              }}
              className="grid grid-cols-2 gap-4"
            >
              <button className="h-11.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="h-11.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M16.365 7.143c.913-1.12 1.53-2.723 1.363-4.326-1.385.056-3.084.93-4.032 2.05-.758.88-1.493 2.518-1.296 4.09 1.542.12 3.048-.696 3.965-1.814zm4.496 11.23c-1.026 1.488-2.092 2.973-3.702 3.003-1.57.027-2.08-.946-3.876-.946-1.795 0-2.35.918-3.875.975-1.576.055-2.825-1.616-3.854-3.107-2.107-3.04-3.72-8.583-1.57-12.35 1.066-1.865 2.946-3.054 4.974-3.08 1.52-.028 2.955 1.042 3.876 1.042.92 0 2.66-1.293 4.49-1.106 1.94.195 3.393 1.037 4.364 2.474-3.66 2.228-3.067 7.4.453 8.784-.875 2.18-2.22 4.316-4.28 7.315z" />
                </svg>
                Apple
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Telemetry footer */}
        <div className="flex items-center justify-between text-[11px] tracking-wider text-slate-400 font-bold uppercase select-none border-t border-slate-100/60 pt-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure SSL Encrypted Session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active Node</span>
          </div>
        </div>

      </div>

    </div>
  );
}
