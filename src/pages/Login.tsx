import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
  const [errors, setErrors] = useState<{ username?: string; password?: string; auth?: string }>({});
  const [isCapsLock, setIsCapsLock] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; password?: string; auth?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please check the required fields.', 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate standard system loading transition
    setTimeout(() => {
      const success = login(username.trim(), password);
      
      if (success) {
        setIsLoading(false);
        showToast('Login successful. Welcome to Razzia Vendor Console.', 'success');
        navigate('/dashboard');
      } else {
        setIsLoading(false);
        setErrors({ auth: 'Invalid username or password. Please verify your credentials and try again.' });
        showToast('Authentication failed.', 'error');
      }
    }, 1000);
  };

  return (
    <div 
      onKeyUp={handleKeyPress}
      className="h-screen w-full bg-[#FCFBFA] text-slate-800 flex items-center justify-center font-sans overflow-hidden relative select-none"
    >
      {/* Tactile Noise Overlay & Ambient Brand Spotlights */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        {/* Animated Ambient Light Blobs behind card */}
        <motion.div 
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] left-[30%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(254,6,13,0.045)_0%,transparent_70%)] rounded-full blur-[90px]" 
        />
        <motion.div 
          animate={{
            x: [0, -25, 25, 0],
            y: [0, 25, -25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] right-[30%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(254,6,13,0.025)_0%,transparent_70%)] rounded-full blur-[90px]" 
        />
      </div>

      {/* Card Wrapper */}
      <div className="w-full max-w-[430px] px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_24px_50px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl"
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <img src="/logo.svg" alt="Razzia" className="h-9.5 w-auto object-contain mb-5" />
            <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight mb-1.5">
              Vendor Control Center
            </h2>
            <p className="text-[13px] text-slate-400 font-semibold tracking-tight">
              Please sign in with your store credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Input Field: Username */}
            <div className="relative text-left">
              <label 
                className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold
                  ${focusedField === 'username' || username 
                    ? 'top-2.5 text-[9px] text-[#FE060D] tracking-wider uppercase' 
                    : 'top-4.5 text-[13.5px] text-slate-400'}`}
              >
                Username
              </label>
              <input 
                type="text"
                value={username}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full bg-[#FAF9F5] border rounded-xl px-4 pb-3 pt-6.5 text-[14px] text-slate-900 placeholder-transparent outline-none transition-all duration-200
                  ${focusedField === 'username' 
                    ? 'border-[#FE060D] bg-white ring-2 ring-[#FE060D]/5' 
                    : errors.username 
                      ? 'border-[#FE060D]/40 bg-[#FE060D]/5' 
                      : 'border-slate-200 hover:border-slate-350'}`}
              />
              <div className="absolute right-4 top-4.5 text-slate-400">
                <User className="w-[16px] h-[16px]" />
              </div>
              <AnimatePresence>
                {errors.username && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] font-semibold text-[#FE060D] mt-1.5 ml-1 flex items-center gap-1"
                  >
                    🚫 {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Input Field: Password */}
            <div className="relative text-left">
              <label 
                className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold
                  ${focusedField === 'password' || password 
                    ? 'top-2.5 text-[9px] text-[#FE060D] tracking-wider uppercase' 
                    : 'top-4.5 text-[13.5px] text-slate-400'}`}
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
                      : 'border-slate-200 hover:border-slate-350'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4.5 text-slate-400 hover:text-slate-700 transition-colors"
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
            </div>

            {/* Error Message Section */}
            <AnimatePresence>
              {errors.auth && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-red-50 border border-red-100 text-[#FE060D] rounded-xl text-[12.5px] font-semibold flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-[#FE060D] shrink-0 mt-0.5" />
                  <span>{errors.auth}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 border-slate-200 rounded text-[#FE060D] focus:ring-0 focus:ring-offset-0 checked:bg-[#FE060D]" 
                />
                <span className="text-[13px] font-semibold text-slate-500 select-none">Remember device</span>
              </label>
            </div>

            {/* Solid Brand Red CTA button */}
            <div>
              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                className="w-full h-12 bg-[#FE060D] hover:bg-[#E0050B] text-white font-bold rounded-xl text-[14px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 disabled:opacity-75 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
          
          {/* Telemetry footer */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] tracking-wider text-slate-400 font-bold uppercase select-none border-t border-slate-100/60 pt-4.5 mt-6">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure SSL Access Session</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
