import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mail, User, Phone, Briefcase, FileText, CheckCircle2, ShieldCheck, Plus, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Custom states
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [storeCategory, setStoreCategory] = useState('fashion');
  const [taxId, setTaxId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.documentElement.classList.add('auth-layout');
    return () => {
      document.documentElement.classList.remove('auth-layout');
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const capsLock = e.getModifierState && e.getModifierState('CapsLock');
    setIsCapsLock(capsLock);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address format';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('Please fix validation errors', 'warning');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!businessName.trim()) newErrors.businessName = 'Business/Store Name is required';
    if (!agreeTerms) newErrors.agreeTerms = 'You must accept Razzia terms to proceed';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast(newErrors.agreeTerms || 'Please fill required details', 'warning');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    }
  };

  const handlePrev = () => {
    setStep(1);
    setErrors({});
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    showToast('Creating workspace portal...', 'info');

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      showToast('Onboarding completed successfully.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    }, 1500);
  };

  return (
    <div 
      onKeyUp={handleKeyPress}
      className="h-screen w-full bg-[#FCFBFA] text-slate-800 flex flex-col lg:flex-row font-sans overflow-hidden relative select-none"
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
            x: [0, -30, 20, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(254,6,13,0.05)_0%,transparent_70%)] rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(254,6,13,0.025)_0%,transparent_70%)] rounded-full blur-[90px]" 
        />
      </div>

      {/* LEFT SECTION: Catalogue / Inventory Mockup Visual */}
      <div className="hidden lg:flex lg:w-[50%] h-full flex-col justify-between pt-10 pb-6 px-12 xl:pt-12 xl:pb-8 xl:px-16 relative z-10 border-r border-slate-100 bg-[#FAF9F5]/40 backdrop-blur-3xl overflow-hidden">
        
        {/* Logo & Hero Header grouped to prevent overlap */}
        <div className="flex flex-col gap-6 xl:gap-8 w-full max-w-[520px]">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Razzia" className="h-9.5 w-auto object-contain" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FE060D]/5 border border-[#FE060D]/10 w-fit">
              <Sparkles className="w-4 h-4 text-[#FE060D]" />
              <span className="text-[11px] font-bold text-[#FE060D] uppercase tracking-wider">Catalogue Manager</span>
            </div>
            <h1 className="text-[38px] xl:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
              Manage inventories <br />effortlessly.
            </h1>
            <p className="text-[14.5px] xl:text-[15.5px] text-slate-500 leading-relaxed max-w-[480px]">
              Set prices, tag categories, and track stock indicators inside a single clean unified environment.
            </p>
          </div>
        </div>

        {/* High-Fidelity UI Component */}
        <div className="w-full max-w-[520px] my-auto pt-4">
          <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.04)] text-left select-none overflow-hidden">
            {/* Header of Mockup */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-[12.5px] font-bold text-slate-850">Live Inventory</span>
              <button className="flex items-center gap-1 bg-neutral-900 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-lg cursor-pointer">
                <Plus className="w-3 h-3" /> Add Product
              </button>
            </div>

            {/* Product table list */}
            <div className="space-y-2.5">
              {[
                { title: 'Aero Over-Ear Headphones', price: '₹14,999', category: 'Tech', sales: '₹1.8L sales', active: true, emoji: '🎧' },
                { title: 'Minimalist Oak Table', price: '₹8,499', category: 'Furniture', sales: '₹95K sales', active: true, emoji: '🪑' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border border-slate-150 rounded-xl p-2.5 bg-[#FCFBFA]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[15px]">
                      {item.emoji}
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-bold text-slate-855 leading-tight">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-slate-450 bg-slate-200/50 px-1 py-0.5 rounded">{item.category}</span>
                        <span className="text-[9px] text-slate-450 font-medium">{item.sales}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] font-bold text-slate-900 block">{item.price}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-450'}`}>
                      {item.active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
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

      {/* RIGHT SECTION: Signup Wizard */}
      <div className="flex-1 lg:w-[50%] h-full flex flex-col justify-between pt-10 pb-6 px-12 xl:pt-12 xl:pb-8 xl:px-16 relative z-10 overflow-hidden">
        
        {/* Top Header bar */}
        <div className="flex items-center justify-between lg:justify-end select-none">
          <img src="/logo.svg" alt="Razzia" className="h-7 w-auto object-contain lg:hidden" />
          <div className="flex items-center gap-4">
            <span className="text-[16px] xl:text-[17px] text-slate-500 font-medium">Already registered?</span>
            <Link 
              to="/login" 
              className="text-[16px] xl:text-[17px] font-extrabold text-[#FE060D] hover:text-[#FE060D]/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Wizard Form Wrapper */}
        <div className="w-full max-w-[520px] mx-auto my-auto py-8">
          {/* Mobile-visible premium animated banner */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="inline-flex lg:hidden items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE060D]/5 border border-[#FE060D]/10 text-[#FE060D] text-[10px] font-bold uppercase tracking-wider mb-4 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FE060D] animate-ping" />
            <span>⚡ ₹5.4L+ live commerce processed today</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-15 h-15 rounded-full border border-emerald-500/20 bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                </div>
                <h2 className="text-[23px] font-semibold text-neutral-900 tracking-tight">Onboarding Completed</h2>
                <p className="text-[13.5px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Your premium workspace setup has been configured. Redirecting to console sign-in screen...
                </p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, x: 12 },
                  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.04 } },
                  exit: { opacity: 0, x: -12 }
                }}
                className="space-y-4"
              >
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  className="text-left"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9.5px] font-bold text-[#FE060D] uppercase tracking-wider">Step 1 of 2</span>
                    <span className="text-[13px] text-slate-400 font-semibold">Security Credentials</span>
                  </div>
                  <h2 className="text-[25px] font-bold text-neutral-900 tracking-tight">Create Workspace Account</h2>
                </motion.div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="relative text-left"
                  >
                    <label className={`absolute left-4 transition-all duration-250 pointer-events-none font-bold ${focusedField === 'fullName' || fullName ? 'top-2.5 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13.5px] text-slate-450'}`}>Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'fullName' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : errors.fullName ? 'border-[#FE060D]/40 bg-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                    />
                    <div className="absolute right-4 top-4.5 text-slate-455">
                      <User className="w-[15px] h-[15px]" />
                    </div>
                    {errors.fullName && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.fullName}</p>}
                  </motion.div>

                  {/* Email */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="relative text-left"
                  >
                    <label className={`absolute left-4 transition-all duration-255 pointer-events-none font-bold ${focusedField === 'email' || email ? 'top-2.5 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13.5px] text-slate-450'}`}>Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'email' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : errors.email ? 'border-[#FE060D]/40 bg-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                    />
                    <div className="absolute right-4 top-4.5 text-slate-455">
                      <Mail className="w-[15px] h-[15px]" />
                    </div>
                    {errors.email && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.email}</p>}
                  </motion.div>

                  {/* Phone */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="relative text-left"
                  >
                    <label className={`absolute left-4 transition-all duration-255 pointer-events-none font-bold ${focusedField === 'phone' || phone ? 'top-2.5 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13.5px] text-slate-450'}`}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'phone' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : errors.phone ? 'border-[#FE060D]/40 bg-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                    />
                    <div className="absolute right-4 top-4.5 text-slate-455">
                      <Phone className="w-[15px] h-[15px]" />
                    </div>
                    {errors.phone && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.phone}</p>}
                  </motion.div>

                  {/* Password & Confirm Password Row */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="relative text-left">
                      <label className={`absolute left-4 transition-all duration-255 pointer-events-none font-bold ${focusedField === 'password' || password ? 'top-2 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13.5px] text-slate-450'}`}>Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'password' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : errors.password ? 'border-[#FE060D]/40 bg-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                      />
                      {errors.password && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.password}</p>}
                    </div>

                    <div className="relative text-left">
                      <label className={`absolute left-4 transition-all duration-255 pointer-events-none font-bold ${focusedField === 'confirmPassword' || confirmPassword ? 'top-2 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13.5px] text-slate-450'}`}>Confirm</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'confirmPassword' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : errors.confirmPassword ? 'border-[#FE060D]/40 bg-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                      />
                      {errors.confirmPassword && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.confirmPassword}</p>}
                    </div>
                  </motion.div>

                  {isCapsLock && (
                    <p className="text-[10.5px] font-semibold text-amber-600 text-left">
                      ⚠️ Caps Lock is active
                    </p>
                  )}
                </div>

                {/* Continue CTA */}
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                  <motion.button 
                    onClick={handleNext}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-13 bg-[#FE060D] hover:bg-[#E0050B] text-white font-bold rounded-xl text-[14px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 mt-2"
                  >
                    Continue Setup <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, x: 12 },
                  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.04 } },
                  exit: { opacity: 0, x: -12 }
                }}
                className="space-y-4"
              >
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  className="text-left"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9.5px] font-bold text-[#FE060D] uppercase tracking-wider">Step 2 of 2</span>
                    <span className="text-[13px] text-slate-400 font-semibold">Business Setup</span>
                  </div>
                  <h2 className="text-[25px] font-bold text-neutral-900 tracking-tight">Configure Store Info</h2>
                </motion.div>

                <div className="space-y-4">
                  {/* Business Name */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="relative text-left"
                  >
                    <label className={`absolute left-4 transition-all duration-255 pointer-events-none font-bold ${focusedField === 'businessName' || businessName ? 'top-2 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13.5px] text-slate-450'}`}>Business / Store Name</label>
                    <input 
                      type="text" 
                      value={businessName}
                      onFocus={() => setFocusedField('businessName')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'businessName' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : errors.businessName ? 'border-[#FE060D]/40 bg-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                    />
                    <div className="absolute right-4 top-4.5 text-slate-455">
                      <Briefcase className="w-[15px] h-[15px]" />
                    </div>
                    {errors.businessName && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.businessName}</p>}
                  </motion.div>

                  {/* GST / Tax ID (Optional) */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="relative text-left"
                  >
                    <label className={`absolute left-4 transition-all duration-255 pointer-events-none font-bold ${focusedField === 'taxId' || taxId ? 'top-2 text-[9px] text-[#FE060D] uppercase tracking-wider' : 'top-4.5 text-[13px] text-slate-450'}`}>GST / Tax ID (Optional)</label>
                    <input 
                      type="text" 
                      value={taxId}
                      onFocus={() => setFocusedField('taxId')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setTaxId(e.target.value)}
                      className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200 ${focusedField === 'taxId' ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' : 'border-slate-200 hover:border-slate-350'}`}
                    />
                    <div className="absolute right-4 top-4.5 text-slate-455">
                      <FileText className="w-[15px] h-[15px]" />
                    </div>
                  </motion.div>

                  {/* Store Category Selector Grid */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="text-left"
                  >
                    <label className="text-[9.5px] font-bold text-slate-400 tracking-wider uppercase mb-2 block">Store Category</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'fashion', label: '👕 Fashion' },
                        { id: 'electronics', label: '⚡ Tech' },
                        { id: 'beauty', label: '💄 Beauty' }
                      ].map((cat) => (
                        <div 
                          key={cat.id}
                          onClick={() => setStoreCategory(cat.id)}
                          className={`py-3 rounded-xl border text-[12.5px] font-semibold text-center cursor-pointer transition-all duration-200 select-none
                            ${storeCategory === cat.id 
                              ? 'bg-neutral-900 border-neutral-950 text-white' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-850'}`}
                        >
                          {cat.label}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Terms checkbox */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-start gap-2.5 pt-1 text-left"
                  >
                    <input 
                      type="checkbox" 
                      checked={agreeTerms} 
                      onChange={(e) => setAgreeTerms(e.target.checked)} 
                      className="w-4.5 h-4.5 mt-0.5 rounded border-slate-200 text-[#FE060D] focus:ring-0 checked:bg-[#FE060D]" 
                    />
                    <span className="text-[13px] text-slate-500 leading-normal">
                      I agree to Razzia's <Link to="#" className="text-[#FE060D] hover:underline font-bold">Terms of Service</Link> and <Link to="#" className="text-[#FE060D] hover:underline font-bold">Privacy Policy</Link>
                    </span>
                  </motion.div>
                  {errors.agreeTerms && <p className="text-[10.5px] text-[#FE060D] mt-1.5 ml-1 font-medium">{errors.agreeTerms}</p>}
                </div>

                {/* Back & Submit Wizard Navigation */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  className="flex gap-4 mt-4"
                >
                  <button 
                    onClick={handlePrev}
                    className="w-24 h-13 rounded-xl border border-slate-250 hover:bg-slate-50 text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 text-slate-650 cursor-pointer"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" /> Back
                  </button>
                  <motion.button 
                    onClick={handleSignupSubmit}
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 h-13 bg-[#FE060D] hover:bg-[#E0050B] text-white font-bold rounded-xl text-[14px] flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer indicators */}
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
