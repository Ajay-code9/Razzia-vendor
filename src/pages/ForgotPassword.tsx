import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, Radio, Package, BarChart2, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Mock API request
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      
      // Auto-hide toast and navigate to login
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 3000);
    }, 1200);
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col lg:flex-row font-sans overflow-hidden relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 24 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 mx-auto z-50 w-full max-w-md px-4"
          >
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl shadow-xl p-4 flex gap-3 items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-[13px] font-bold text-slate-900">Success</p>
                <p className="text-[12px] font-medium text-slate-600">Password reset link has been sent successfully.</p>
              </div>
              <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Section (48%) */}
      <div className="hidden lg:flex w-[48%] flex-col relative pt-10 px-12 xl:px-16 pb-6 bg-white border-r border-slate-50 overflow-hidden">
        {/* Animated Mesh Gradients in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl opacity-60" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] bg-red-50/50 rounded-full blur-3xl opacity-70" 
          />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Header/Logo */}
          <div className="flex items-center gap-2 select-none">
            <img src="/logo.svg" alt="Razzia" className="h-8.5 w-auto object-contain" />
          </div>

          {/* Heading */}
          <div className="max-w-md my-3 text-left">
            <h1 className="text-[36px] xl:text-[44px] font-black tracking-tight text-slate-900 leading-[1.1] mb-3">
              Sell. Stream. <span className="text-brand">Grow.</span>
            </h1>
            <p className="text-[14.5px] text-slate-500 font-medium leading-relaxed">
              The all-in-one platform for vendors to sell live, manage orders and grow business.
            </p>
          </div>

          {/* Dashboard Illustration Mock with Interactive Elements */}
          <div className="relative flex-1 min-h-[200px] max-h-[300px] w-full mb-4 flex items-center justify-center">
            
            {/* Main Mockup Frame */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-[360px] bg-white rounded-xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden relative z-10 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)] transition-shadow duration-300"
            >
              {/* Header */}
              <div className="h-9 border-b border-slate-50 flex items-center px-3 gap-2 bg-slate-50/50">
                <div className="w-4.5 h-4.5 bg-brand rounded flex items-center justify-center shrink-0">
                  <span className="text-[8px] font-black text-white leading-none">R</span>
                </div>
                <div className="h-1.5 w-16 bg-slate-200 rounded-full" />
                <div className="ml-auto flex gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-slate-200" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                </div>
              </div>
              {/* Content */}
              <div className="p-4 text-left">
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  {['Total Sales', 'Total Orders', 'Live'].map((t, i) => (
                    <div key={i} className="p-2 border border-slate-50 rounded-lg bg-white shadow-xs">
                      <div className="h-1.5 w-10 bg-slate-100 rounded-full mb-2" />
                      <div className="h-3 w-14 bg-slate-800 rounded-full mb-1" />
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="h-1.5 w-8 bg-emerald-100/50 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  {/* Chart Mock with Line Draw Animation */}
                  <div className="flex-1 border border-slate-50 rounded-lg p-2.5 bg-white shadow-xs">
                    <div className="h-1.5 w-16 bg-slate-200 rounded-full mb-3" />
                    <div className="h-14 w-full relative">
                      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          d="M0,35 Q10,25 20,30 T40,15 T60,20 T80,5 T100,10" 
                          fill="none" 
                          stroke="#FE060D" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        <motion.path 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                          d="M0,35 Q10,25 20,30 T40,15 T60,20 T80,5 T100,10 L100,40 L0,40 Z" 
                          fill="url(#grad-forgot-opt)" 
                        />
                        <defs>
                          <linearGradient id="grad-forgot-opt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FE060D" />
                            <stop offset="100%" stopColor="#FE060D" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Red R-Shopping Bag */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [-6, -2, -6] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -bottom-2 -left-6 w-20 h-24 bg-brand rounded-xl shadow-[0_15px_30px_rgba(254,6,13,0.25)] flex flex-col items-center justify-center z-20 cursor-default"
              style={{ borderRadius: '12px 12px 2px 2px' }}
            >
              <div className="absolute -top-3 w-7 h-7 border-4 border-brand-light rounded-full border-b-0" />
              <div className="text-white font-black text-2xl tracking-tighter select-none">R</div>
            </motion.div>

            {/* Floating Yellow Boxes */}
            <motion.div 
              animate={{ y: [0, 8, 0], rotate: [4, 8, 4] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-3 bottom-6 flex flex-col gap-1 z-20"
            >
              <div className="w-12 h-9 bg-amber-200 rounded shadow-md border border-amber-300 flex items-center justify-center translate-x-2">
                 <div className="text-amber-800/40 font-bold text-[10px]">R</div>
              </div>
              <div className="flex gap-1">
                <div className="w-12 h-9 bg-amber-300 rounded shadow-md border border-amber-400 flex items-center justify-center">
                   <div className="text-amber-800/40 font-bold text-[10px]">R</div>
                </div>
                <div className="w-12 h-9 bg-amber-200 rounded shadow-md border border-amber-300 flex items-center justify-center">
                   <div className="text-amber-800/40 font-bold text-[10px]">R</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-xs cursor-default"
            >
              <div className="relative w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mb-2 text-brand">
                <span className="absolute inset-0 rounded-full border border-brand/35 animate-ping opacity-75" />
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-[11.5px] font-bold text-slate-800 mb-0.5">Live Commerce</h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-tight">Go live & sell instantly.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-xs cursor-default"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mb-2 text-brand">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-[11.5px] font-bold text-slate-800 mb-0.5">Orders</h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-tight">Easy returns & delivery.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-xs cursor-default"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mb-2 text-brand">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="text-[11.5px] font-bold text-slate-800 mb-0.5">Analytics</h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-tight">Track store performance.</p>
            </motion.div>
          </div>
          
          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-left">
             <p className="text-[11px] font-semibold text-slate-400">
               &copy; 2026 Razzia. All rights reserved.
             </p>
          </div>
        </div>
      </div>

      {/* Right Section (52%) */}
      <div className="w-full lg:w-[52%] flex flex-col items-center justify-center p-6 sm:p-12 bg-[#F8FAFC]/50 relative overflow-hidden">
         
         <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-slate-100 p-8 sm:p-12 relative z-10"
         >
           
           <div className="flex flex-col items-center text-center mb-8">
             {/* Circular lock icon container */}
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 text-brand">
               <KeyRound className="w-8 h-8" />
             </div>
             
             <h2 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">
               Forgot Password?
             </h2>
             <p className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-[340px]">
               No worries! Enter your email address and we'll send you a password reset link.
             </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
             <Input 
               label="Email Address"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Enter your email address"
               icon={<Mail className="w-[18px] h-[18px]" />}
               error={error}
               className="h-13 text-[14px]"
             />

             <Button type="submit" isLoading={isLoading} className="h-13 text-[15px] mt-2">
               Send Reset Link
             </Button>
           </form>

           {/* Divider */}
           <div className="relative flex items-center justify-center py-5">
             <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
             <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               OR
             </span>
           </div>

           {/* Google Social Login */}
           <Button variant="outline" className="h-12 gap-2 text-[13.5px]">
             <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             Continue with Google
           </Button>

           {/* Return to login link */}
           <div className="text-center pt-5 mt-2">
             <p className="text-[14px] font-medium text-slate-500">
               Remember your password? <Link to="/login" className="text-brand font-bold hover:underline">Sign In</Link>
             </p>
           </div>

         </motion.div>

         {/* Animated Wave Pattern */}
         <div className="absolute bottom-0 right-0 pointer-events-none opacity-[0.03] text-brand">
           <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" />
           </svg>
         </div>

      </div>

    </div>
  );
}
