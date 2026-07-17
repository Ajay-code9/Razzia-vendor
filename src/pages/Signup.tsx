import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [storeCategory, setStoreCategory] = useState('fashion');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Required';
    if (!email.trim()) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Required';
    }
    if (!password) {
      newErrors.password = 'Required';
    } else if (password.length < 8) {
      newErrors.password = 'Min 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!businessName.trim()) newErrors.businessName = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (!agreeTerms) {
      setErrors({ agreeTerms: 'You must agree to continue' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    }, 1500);
  };

  // ── Step 1 progressive gradient ──────────────────────────────────────
  // 4 fields, each 25%. Right-side color smoothly deepens toward #FE060D
  const step1Completion = useMemo(() => {
    let pct = 0;
    if (fullName.trim()) pct += 25;
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) pct += 25;
    if (phone.trim()) pct += 25;
    if (password.length >= 8) pct += 25;
    return pct;
  }, [fullName, email, phone, password]);

  const step1BtnGradient = useMemo(() => {
    const t = step1Completion / 100;
    const r = Math.round(255 + (254 - 255) * t);
    const g = Math.round(236 - 230 * t);
    const b = Math.round(236 - 223 * t);
    return `linear-gradient(to right, #FE060D, rgb(${r}, ${g}, ${b}))`;
  }, [step1Completion]);

  const step1BtnShadow = useMemo(() => {
    const alpha = 0.12 + (step1Completion / 100) * 0.16;
    const spread = 20 + (step1Completion / 100) * 12;
    return `0 8px ${spread}px rgba(254, 6, 13, ${alpha.toFixed(2)})`;
  }, [step1Completion]);

  // ── Step 2 progressive gradient ──────────────────────────────────────
  // 2 conditions: businessName filled + agreeTerms checked → each 50%
  const step2Completion = useMemo(() => {
    let pct = 0;
    if (businessName.trim()) pct += 50;
    if (agreeTerms) pct += 50;
    return pct;
  }, [businessName, agreeTerms]);

  const step2BtnGradient = useMemo(() => {
    const t = step2Completion / 100;
    const r = Math.round(255 + (254 - 255) * t);
    const g = Math.round(236 - 230 * t);
    const b = Math.round(236 - 223 * t);
    return `linear-gradient(to right, #FE060D, rgb(${r}, ${g}, ${b}))`;
  }, [step2Completion]);

  const step2BtnShadow = useMemo(() => {
    const alpha = 0.12 + (step2Completion / 100) * 0.16;
    const spread = 20 + (step2Completion / 100) * 12;
    return `0 8px ${spread}px rgba(254, 6, 13, ${alpha.toFixed(2)})`;
  }, [step2Completion]);

  return (
    <div className="min-h-screen w-full bg-[#FCFDFE] text-slate-800 flex flex-col lg:flex-row font-sans overflow-hidden relative select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-brand/8 to-orange-50/20 rounded-full blur-[100px] opacity-75" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 60, 0],
            y: [0, -40, 0]
          }}
          transition={{ repeat: Infinity, duration: 26, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[15%] w-[700px] h-[700px] bg-gradient-to-tr from-brand/6 to-rose-50/20 rounded-full blur-[110px] opacity-60" 
        />
      </div>

      {/* Left Column — Desktop Only: "Launch Your Store in Minutes" */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between relative pt-10 px-12 xl:px-16 pb-8 overflow-hidden z-10">

        {/* Rich layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/30 to-white pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-[400px] h-[400px] bg-gradient-to-br from-brand/8 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-[350px] h-[350px] bg-gradient-to-tl from-brand/6 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(254,6,13,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(254,6,13,0.02)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img src="/logo.svg" alt="Razzia" className="h-8.5 w-auto object-contain" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-3">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/8 border border-brand/15 mb-4">
              <span className="text-[13px]">🚀</span>
              <span className="text-[11px] font-black text-brand tracking-wider uppercase">Go Live in Under 2 Minutes</span>
            </div>
            <h1 className="text-[34px] xl:text-[41px] font-black tracking-tight leading-[1.08] text-slate-900 mb-3">
              Launch Your Store.<br />
              <span className="bg-gradient-to-r from-brand via-red-500 to-orange-400 bg-clip-text text-transparent">Start Earning Today.</span>
            </h1>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[290px]">
              Three simple steps. One powerful platform. Your store goes live in minutes.
            </p>
          </motion.div>

          {/* 3-Step Journey Cards */}
          <div className="space-y-2.5 mb-5">
            {[
              {
                num: '01', icon: '👤', title: 'Create Account',
                desc: 'Secure your login & merchant profile',
                accent: 'from-brand/10 to-rose-50', active: true,
              },
              {
                num: '02', icon: '🏪', title: 'Build Your Store',
                desc: 'Pick a name, category & upload products',
                accent: 'from-orange-50 to-amber-50', active: false,
              },
              {
                num: '03', icon: '💰', title: 'Start Selling',
                desc: 'Go live and earn from day one',
                accent: 'from-emerald-50 to-green-50', active: false,
                badge: '$240 avg. first day',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + idx * 0.1 }}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border transition-all ${
                  item.active
                    ? 'bg-white border-brand/20 shadow-[0_8px_25px_rgba(254,6,13,0.06)]'
                    : 'bg-white/50 border-slate-100/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-[20px] shrink-0 border border-white shadow-sm`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9.5px] font-black text-brand/60 tracking-widest">STEP {item.num}</span>
                    {item.active && (
                      <span className="text-[8.5px] font-black bg-brand text-white px-1.5 py-0.5 rounded-full tracking-wide">START HERE</span>
                    )}
                  </div>
                  <div className="text-[13px] font-black text-slate-900 leading-tight">{item.title}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">{item.desc}</div>
                </div>
                {item.badge ? (
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-xl text-center shrink-0 leading-tight">
                    {item.badge}
                  </div>
                ) : item.active ? (
                  <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(254,6,13,0.25)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-2.5 mb-4"
          >
            {[
              { value: '12K+', label: 'Active Stores', color: 'text-slate-900' },
              { value: '$2.1M', label: 'Daily GMV', color: 'text-brand' },
              { value: '4.9★', label: 'Seller Rating', color: 'text-slate-900' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 border border-slate-100 rounded-2xl p-3 text-center">
                <div className={`text-[17px] font-black ${stat.color} leading-tight`}>{stat.value}</div>
                <div className="text-[9.5px] font-bold text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Verified Seller floating card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{ opacity: { delay: 0.55, duration: 0.4 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 } }}
            className="bg-gradient-to-r from-brand/8 via-rose-50/60 to-white border border-brand/15 rounded-2xl p-3.5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-[16px] font-black shrink-0 shadow-[0_6px_16px_rgba(254,6,13,0.28)]">✓</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-black text-slate-900 leading-tight">Become a Verified Seller</div>
              <div className="text-[10.5px] text-slate-500 font-semibold">Unlock priority placement & trust badge</div>
            </div>
            <div className="text-brand font-black text-[18px] shrink-0 opacity-60">→</div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] font-semibold text-slate-400 tracking-wide">
          &copy; 2026 RAZZIA MARKETPLACE INC. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Column (Multi-Step Form) */}
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
          transition={{ duration: 0.5 }}
          className="w-full max-w-[460px] bg-white/80 border border-slate-100 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Stepper Progress bar at top of card */}
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden absolute top-0 inset-x-0">
            <motion.div 
              animate={{ width: `${(step / 2) * 100}%` }}
              transition={{ type: "spring", stiffness: 80 }}
              className="h-full bg-brand" 
            />
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600"
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>
                </div>
                <h2 className="text-[23px] font-black text-slate-900">Registration Complete!</h2>
                <p className="text-[13px] text-slate-500 max-w-xs mx-auto">
                  Your merchant store account has been successfully configured. Redirecting you to login...
                </p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Step 1 of 2</span>
                    <span className="text-[11.5px] font-semibold text-slate-400">Credentials</span>
                  </div>
                  <h2 className="text-[23px] font-black text-slate-900 tracking-tight">Create Merchant Account</h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="relative group text-left">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold ${focusedField === 'fullName' || fullName ? 'top-2 text-[10px] text-brand uppercase' : 'top-3.5 text-[13px] text-slate-450'}`}>Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-1.5 pt-5 text-[13px] text-slate-900 outline-none transition-all ${focusedField === 'fullName' ? 'border-brand/40 bg-white ring-4 ring-brand/4' : errors.fullName ? 'border-brand/50' : 'border-slate-150'}`}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative group text-left">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold ${focusedField === 'email' || email ? 'top-2 text-[10px] text-brand uppercase' : 'top-3.5 text-[13px] text-slate-450'}`}>Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-1.5 pt-5 text-[13px] text-slate-900 outline-none transition-all ${focusedField === 'email' ? 'border-brand/40 bg-white ring-4 ring-brand/4' : errors.email ? 'border-brand/50' : 'border-slate-150'}`}
                    />
                  </div>

                  {/* Phone & Password Row */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="relative group text-left">
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold ${focusedField === 'phone' || phone ? 'top-2 text-[10px] text-brand uppercase' : 'top-3.5 text-[13px] text-slate-450'}`}>Phone</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-1.5 pt-5 text-[13px] text-slate-900 outline-none transition-all ${focusedField === 'phone' ? 'border-brand/40 bg-white ring-4 ring-brand/4' : errors.phone ? 'border-brand/50' : 'border-slate-150'}`}
                      />
                    </div>
                    <div className="relative group text-left">
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold ${focusedField === 'password' || password ? 'top-2 text-[10px] text-brand uppercase' : 'top-3.5 text-[13px] text-slate-450'}`}>Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-1.5 pt-5 text-[13px] text-slate-900 outline-none transition-all ${focusedField === 'password' ? 'border-brand/40 bg-white ring-4 ring-brand/4' : errors.password ? 'border-brand/50' : 'border-slate-150'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 1 Progressive CTA */}
                <motion.button 
                  onClick={handleNext}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    background: step1BtnGradient,
                    boxShadow: step1BtnShadow,
                    transition: 'background 400ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className="w-full h-11.5 text-white font-bold rounded-2xl text-[13.5px] flex items-center justify-center gap-2 mt-4"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Step 2 of 2</span>
                    <span className="text-[11.5px] font-semibold text-slate-400">Business Details</span>
                  </div>
                  <h2 className="text-[23px] font-black text-slate-900 tracking-tight">Configure Store</h2>
                </div>

                <div className="space-y-4">
                  {/* Business Name */}
                  <div className="relative group text-left">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold ${focusedField === 'businessName' || businessName ? 'top-2 text-[10px] text-brand uppercase' : 'top-3.5 text-[13px] text-slate-450'}`}>Business Name</label>
                    <input 
                      type="text" 
                      value={businessName}
                      onFocus={() => setFocusedField('businessName')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`w-full bg-slate-50/50 hover:bg-slate-50/80 border rounded-2xl px-4 pb-1.5 pt-5 text-[13px] text-slate-900 outline-none transition-all ${focusedField === 'businessName' ? 'border-brand/40 bg-white ring-4 ring-brand/4' : errors.businessName ? 'border-brand/50' : 'border-slate-150'}`}
                    />
                  </div>

                  {/* Store Category Select Grid */}
                  <div className="text-left">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block">Store Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'fashion', label: '👕 Fashion' },
                        { id: 'electronics', label: '⚡ Tech' },
                        { id: 'beauty', label: '💄 Beauty' }
                      ].map((cat) => (
                        <div 
                          key={cat.id}
                          onClick={() => setStoreCategory(cat.id)}
                          className={`py-2 px-2.5 rounded-xl border text-[12px] font-bold text-center cursor-pointer transition-all duration-250 select-none
                            ${storeCategory === cat.id 
                              ? 'bg-brand/10 border-brand text-brand' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}
                        >
                          {cat.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2.5 pt-1 text-left">
                    <input 
                      type="checkbox" 
                      checked={agreeTerms} 
                      onChange={(e) => setAgreeTerms(e.target.checked)} 
                      className="w-3.5 h-3.5 mt-0.5 rounded border-slate-200 text-brand focus:ring-0" 
                    />
                    <span className="text-[11.5px] font-semibold text-slate-500">
                      I accept Razzia's <Link to="#" className="text-brand hover:underline">Terms of Service</Link> & <Link to="#" className="text-brand hover:underline">Privacy Policy</Link>
                    </span>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-[11px] font-bold text-brand text-left">{errors.agreeTerms}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={handlePrev}
                    className="w-24 h-11.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 text-slate-650"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  {/* Step 2 Progressive CTA */}
                  <motion.button 
                    onClick={handleSignupSubmit}
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      background: isLoading ? '#FE060D' : step2BtnGradient,
                      boxShadow: step2BtnShadow,
                      transition: 'background 400ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="flex-1 h-11.5 text-white font-bold rounded-2xl text-[13.5px] flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Launch Store <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Direct link switch back */}
          {!isSuccess && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-[13px] font-semibold text-slate-500">
                Already have an account? <Link to="/login" className="text-brand font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          )}

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
