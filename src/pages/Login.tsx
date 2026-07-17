import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    document.documentElement.classList.add('auth-layout');
    return () => {
      document.documentElement.classList.remove('auth-layout');
    };
  }, []);

  // Progressive fill: each valid field = 50%
  const completion = useMemo(() => {
    const isEmailValid = email.length > 0 && /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length > 0;
    let pct = 0;
    if (isEmailValid) pct += 50;
    if (isPasswordValid) pct += 50;
    return pct;
  }, [email, password]);

  // Smooth gradient: right-side color interpolates from #FFECEC → #FE060D
  // No hard split line — single continuous gradient surface at all times
  const btnGradient = useMemo(() => {
    const t = completion / 100; // 0 → 1
    const r = Math.round(255 + (254 - 255) * t); // 255 → 254
    const g = Math.round(236 - 230 * t);          // 236 → 6
    const b = Math.round(236 - 223 * t);          // 236 → 13
    return `linear-gradient(to right, #FE060D, rgb(${r}, ${g}, ${b}))`;
  }, [completion]);

  // Shadow deepens as confidence grows
  const btnShadow = useMemo(() => {
    const alpha = 0.12 + (completion / 100) * 0.16;
    const spread = 20 + (completion / 100) * 12;
    return `0 8px ${spread}px rgba(254, 6, 13, ${alpha.toFixed(2)})`;
  }, [completion]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFDFE] text-slate-800 flex flex-col lg:flex-row font-sans overflow-hidden relative select-none">
      
      {/* Light Premium Radial Glows & Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, -20, 0]
          }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="absolute -top-[15%] -right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-brand/8 to-orange-100/30 rounded-full blur-[100px] opacity-75" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-brand/6 to-rose-100/20 rounded-full blur-[110px] opacity-60" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(254,6,13,0.015),transparent_75%)]" />
      </div>

      {/* Left Section — Desktop Only: "The Future of Local Commerce" */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between relative pt-10 px-12 xl:px-16 pb-8 overflow-hidden z-10">

        {/* Rich layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/40 to-white pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[420px] h-[420px] bg-gradient-to-bl from-brand/10 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-[380px] h-[380px] bg-gradient-to-tr from-brand/7 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(254,6,13,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(254,6,13,0.022)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center"
        >
          <img src="/logo.svg" alt="Razzia" className="h-8.5 w-auto object-contain" />
        </motion.div>

        {/* Hero Composition */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-4">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/8 border border-brand/15 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[11px] font-black text-brand tracking-wider uppercase">The Future of Commerce</span>
            </div>
            <h1 className="text-[36px] xl:text-[44px] font-black tracking-tight leading-[1.08] text-slate-900 mb-3">
              Sell Smarter.<br />
              <span className="bg-gradient-to-r from-brand via-red-500 to-orange-400 bg-clip-text text-transparent">Grow Faster.</span>
            </h1>
            <p className="text-[13.5px] text-slate-500 font-medium leading-relaxed max-w-[300px]">
              Join 12,000+ merchants powering local stores with live video commerce and real-time settlements.
            </p>
          </motion.div>

          {/* Floating Widget Composition */}
          <div className="relative h-[290px] xl:h-[320px]">

            {/* ── Main Product Showcase Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{ opacity: { duration: 0.5 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0 } }}
              className="absolute left-0 top-2 w-[195px] xl:w-[210px] bg-white border border-slate-100/80 rounded-2xl p-4 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-sm"
            >
              <div className="w-full h-[88px] bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(254,6,13,0.08),transparent_60%)]" />
                <span className="text-[44px] relative z-10">👜</span>
              </div>
              <div className="text-[12.5px] font-black text-slate-900 leading-tight">Leather Tote Bag</div>
              <div className="text-[10.5px] text-slate-400 font-semibold mb-2.5">Premium Collection</div>
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-black text-brand">$240</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">In Stock</span>
              </div>
            </motion.div>

            {/* ── Revenue Analytics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, 7, 0] }}
              transition={{ opacity: { duration: 0.5, delay: 0.15 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 } }}
              className="absolute right-0 top-0 w-[175px] xl:w-[190px] bg-white border border-slate-100/80 rounded-2xl p-3.5 shadow-[0_15px_40px_rgba(15,23,42,0.06)]"
            >
              <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Monthly Revenue</div>
              <div className="text-[24px] font-black text-slate-900 leading-tight">$48.2K</div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[11px] font-black text-emerald-500">↑ 24.8%</span>
                <span className="text-[10px] text-slate-400 font-semibold">vs last mo.</span>
              </div>
              {/* Sparkline SVG */}
              <svg viewBox="0 0 100 32" className="w-full h-8" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FE060D" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#FE060D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points="0,28 12,24 24,26 36,16 50,19 62,11 78,7 90,5 100,2"
                  fill="none" stroke="#FE060D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                <polygon
                  points="0,28 12,24 24,26 36,16 50,19 62,11 78,7 90,5 100,2 100,32 0,32"
                  fill="url(#spark-fill)"
                />
              </svg>
            </motion.div>

            {/* ── Live Order Notification Toast */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: [0, 1, 1, 0], x: [24, 0, 0, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, delay: 1.2, times: [0, 0.18, 0.82, 1], ease: "easeOut" }}
              className="absolute right-0 top-[152px] xl:top-[165px] w-[190px] bg-white border border-slate-100 rounded-xl p-3 shadow-[0_12px_30px_rgba(15,23,42,0.07)] flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/15 flex items-center justify-center shrink-0 text-[15px]">🛍️</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-black text-slate-900">New Order!</div>
                <div className="text-[10px] text-slate-400 font-bold">Sarah K. · $89.00</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0" />
            </motion.div>

            {/* ── Orders badge floating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: [1, 1.04, 1] }}
              transition={{ opacity: { delay: 0.3 }, scale: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
              className="absolute left-[205px] xl:left-[220px] top-[95px] bg-brand text-white px-3 py-1.5 rounded-xl text-[11px] font-black shadow-[0_8px_20px_rgba(254,6,13,0.28)] whitespace-nowrap"
            >
              +142 orders today 🔥
            </motion.div>

            {/* ── Live Deliveries Strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/70 border border-slate-100 rounded-2xl px-4 py-3 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-black text-slate-600">🛵  Live Deliveries</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span className="text-[10px] font-bold text-brand">3 Active</span>
                </div>
              </div>
              <div className="relative h-7 overflow-hidden">
                <div className="absolute inset-x-0 bottom-2.5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                {/* Scooter 1 */}
                <motion.div
                  animate={{ x: ['-15%', '115%'] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                  className="absolute bottom-0.5 flex items-center gap-1 z-10"
                >
                  <motion.div
                    animate={{ scale: [0.4, 1.6], opacity: [0.5, 0], x: [-4, -12] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-1.5 h-1.5 bg-brand/25 rounded-full"
                  />
                  <svg viewBox="0 0 24 24" width="22" height="22" className="fill-brand">
                    <path d="M19 15h-1.35a3 3 0 0 0-5.3 0H9.65a3 3 0 0 0-5.3 0H3v-2h2.2l1.6-4.8A2 2 0 0 1 8.7 7H13v2H8.7l-1 3h7.68c.5 0 .95-.3 1.14-.76l1.2-2.8a2 2 0 0 1 1.83-1.21L21 9v2h-1.45l-1.3 3H19zm-12 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                  <div className="w-3 h-3 bg-amber-400 border border-amber-500 rounded -ml-2.5 mb-2.5 flex items-center justify-center">
                    <span className="text-[6px] font-black text-amber-900">R</span>
                  </div>
                </motion.div>
                {/* Scooter 2 */}
                <motion.div
                  animate={{ x: ['25%', '130%'] }}
                  transition={{ repeat: Infinity, duration: 6.5, ease: "linear", delay: 2.5 }}
                  className="absolute bottom-0.5 flex items-center gap-1 z-10 opacity-50"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" className="fill-slate-400">
                    <path d="M19 15h-1.35a3 3 0 0 0-5.3 0H9.65a3 3 0 0 0-5.3 0H3v-2h2.2l1.6-4.8A2 2 0 0 1 8.7 7H13v2H8.7l-1 3h7.68c.5 0 .95-.3 1.14-.76l1.2-2.8a2 2 0 0 1 1.83-1.21L21 9v2h-1.45l-1.3 3H19zm-12 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] font-semibold text-slate-400 tracking-wide">
          &copy; 2026 RAZZIA MARKETPLACE INC. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Section (52%): Premium Light Glass Card */}
      <div className="w-full lg:w-[54%] flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 min-h-screen">
        
        {/* Mobile top logo */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8 lg:hidden select-none"
        >
          <img 
            src="/logo.svg" 
            alt="Razzia" 
            className="h-14 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(254,6,13,0.18))' }}
          />
        </motion.div>

        {/* Minimal Light Glass Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] bg-white/80 border border-slate-100 rounded-3xl p-7 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl relative overflow-hidden"
        >
          <div className="mb-8 text-left">
            <h2 className="text-[26px] font-black text-slate-900 tracking-tight flex items-center gap-2 mb-1.5">
              Welcome back <span className="text-[22px] animate-waving-hand">👋</span>
            </h2>
            <p className="text-[13px] font-semibold text-slate-500">
              Sign in to manage your marketplace store.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Input 1: Email Address */}
            <div className="relative group text-left">
              <label 
                className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold
                  ${focusedField === 'email' || email 
                    ? 'top-2.5 text-[10.5px] text-brand tracking-wide uppercase' 
                    : 'top-4 text-[13.5px] text-slate-450'}`}
              >
                Email Address
              </label>
              <input 
                type="email"
                value={email}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-2 pt-6 text-[13.5px] text-slate-900 placeholder-transparent outline-none transition-all duration-300
                  ${focusedField === 'email' 
                    ? 'border-brand/40 bg-white ring-4 ring-brand/4' 
                    : errors.email 
                      ? 'border-brand/50 bg-brand/5' 
                      : 'border-slate-150'}`}
              />
              <div className="absolute right-4 top-4 text-slate-400">
                <Mail className="w-[16px] h-[16px]" />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11.5px] font-bold text-brand mt-1.5 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Input 2: Password */}
            <div className="relative group text-left">
              <label 
                className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold
                  ${focusedField === 'password' || password 
                    ? 'top-2.5 text-[10.5px] text-brand tracking-wide uppercase' 
                    : 'top-4 text-[13.5px] text-slate-450'}`}
              >
                Password
              </label>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-2 pt-6 text-[13.5px] text-slate-900 placeholder-transparent outline-none transition-all duration-300
                  ${focusedField === 'password' 
                    ? 'border-brand/40 bg-white ring-4 ring-brand/4' 
                    : errors.password 
                      ? 'border-brand/50 bg-brand/5' 
                      : 'border-slate-150'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
              </button>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11.5px] font-bold text-brand mt-1.5 ml-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember & Forgot options */}
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-200 text-brand focus:ring-0" />
                <span className="text-[12px] font-bold text-slate-400 select-none">Remember</span>
              </label>
              <Link to="/forgot-password" className="text-[12px] font-bold text-brand hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Progressive Gradient CTA Button */}
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              style={{
                background: isLoading ? '#FE060D' : btnGradient,
                boxShadow: btnShadow,
                transition: 'background 400ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="w-full h-12 text-white font-bold rounded-2xl text-[14px] flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center py-5">
            <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
            <span className="relative bg-white px-3 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            <button className="h-10.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-bold text-slate-650 transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="h-10.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-bold text-slate-650 transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M16.365 7.143c.913-1.12 1.53-2.723 1.363-4.326-1.385.056-3.084.93-4.032 2.05-.758.88-1.493 2.518-1.296 4.09 1.542.12 3.048-.696 3.965-1.814zm4.496 11.23c-1.026 1.488-2.092 2.973-3.702 3.003-1.57.027-2.08-.946-3.876-.946-1.795 0-2.35.918-3.875.975-1.576.055-2.825-1.616-3.854-3.107-2.107-3.04-3.72-8.583-1.57-12.35 1.066-1.865 2.946-3.054 4.974-3.08 1.52-.028 2.955 1.042 3.876 1.042.92 0 2.66-1.293 4.49-1.106 1.94.195 3.393 1.037 4.364 2.474-3.66 2.228-3.067 7.4.453 8.784-.875 2.18-2.22 4.316-4.28 7.315z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Footer switch page */}
          <div className="mt-6 text-center">
            <p className="text-[13px] font-semibold text-slate-500">
              Don't have an account? <Link to="/signup" className="text-brand font-bold hover:underline">Create Account</Link>
            </p>
          </div>

        </motion.div>

        {/* Premium Scooter Delivery Animation (Mobile Only) */}
        <div className="w-full max-w-[420px] mt-8 lg:hidden relative h-12 overflow-hidden flex items-center shrink-0">
          <div className="absolute inset-x-0 bottom-3 h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <motion.div 
            animate={{ x: [0, -60] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute inset-x-0 h-1.5 bottom-3.5 flex gap-12 opacity-30"
            style={{ width: '200%' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="w-8 h-[1px] bg-brand/35 shrink-0" />
            ))}
          </motion.div>
          <motion.div 
            animate={{ 
              x: ['-20%', '120%'],
              y: [0, -2, 0, -2, 0] 
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
            className="absolute bottom-1.5 flex items-center gap-1.5 z-10"
          >
            {/* Scooter Exhaust Smoke */}
            <div className="absolute left-[-8px] bottom-1 flex gap-1 items-end pointer-events-none">
              <motion.span 
                animate={{ scale: [0.5, 1.8], opacity: [0.6, 0], x: [-5, -15] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-1.5 h-1.5 bg-brand/20 rounded-full shrink-0" 
              />
            </div>
            <svg viewBox="0 0 24 24" width="28" height="28" className="text-brand fill-brand shrink-0">
              <path d="M19 15h-1.35a3 3 0 0 0-5.3 0H9.65a3 3 0 0 0-5.3 0H3v-2h2.2l1.6-4.8A2 2 0 0 1 8.7 7H13v2H8.7l-1 3h7.68c.5 0 .95-.3 1.14-.76l1.2-2.8a2 2 0 0 1 1.83-1.21L21 9v2h-1.45l-1.3 3H19zm-12 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
            <div className="w-3.5 h-3.5 bg-amber-400 border border-amber-500 rounded shadow-xs -ml-3 mb-3 flex items-center justify-center shrink-0">
              <span className="text-[7px] text-amber-900 font-bold">R</span>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
