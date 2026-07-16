import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, ShoppingBag } from 'lucide-react';

export default function PromoBanner() {
  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative overflow-hidden bg-gradient-to-r from-[#FFF2F2] to-white border border-brand/5 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm shadow-brand/2 font-sans hover:shadow-widget transition-shadow duration-200"
    >
      
      {/* Background visual shapes (to enhance aesthetics) */}
      <div className="absolute top-0 right-0 w-[300px] h-full bg-radial-gradient from-brand/5 to-transparent pointer-events-none opacity-50" />

      {/* Left content block */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left z-10">
        {/* Red Icon Bag */}
        <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center shrink-0 shadow-md shadow-brand/20">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>

        {/* Messaging */}
        <div className="space-y-1 max-w-[520px]">
          <h3 className="text-[17px] font-extrabold text-slate-800 tracking-tight leading-snug">
            Go Live & Boost Your Sales!
          </h3>
          <p className="text-[13px] font-bold text-slate-500 leading-normal">
            Engage with more customers in real-time and increase your conversions.
          </p>
        </div>
      </div>

      {/* Right block: Action Button and Tripod Graphic */}
      <div className="flex items-center gap-6 z-10 shrink-0">
        
        {/* Button */}
        <Link 
          to="/live-streaming"
          className="h-11 px-5 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13.5px] rounded-xl flex items-center gap-2 transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer"
        >
          <Radio className="w-4 h-4" />
          <span>Start Live Stream</span>
        </Link>

        {/* Decorative Inline SVG Tripod Camera & Charts */}
        <div className="hidden lg:flex items-center shrink-0 select-none">
          <svg width="110" height="75" viewBox="0 0 110 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-300">
            {/* Transparent Pink Bar Charts */}
            <rect x="75" y="35" width="8" height="30" rx="2" fill="#FE060D" fillOpacity="0.08" />
            <rect x="87" y="20" width="8" height="45" rx="2" fill="#FE060D" fillOpacity="0.12" />
            <rect x="99" y="10" width="8" height="55" rx="2" fill="#FE060D" fillOpacity="0.16" />
            
            {/* Tripod Stand */}
            <path d="M42 52L30 72" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 52L54 72" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 52V72" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="42" cy="52" r="2.5" fill="#475569" />
            
            {/* Camera Body */}
            <rect x="29" y="32" width="26" height="17" rx="3.5" fill="#1E293B" />
            <circle cx="42" cy="40.5" r="4.5" fill="#475569" />
            
            {/* Lens */}
            <rect x="55" y="37" width="4" height="7" rx="1" fill="#475569" />
            
            {/* Top flash mount */}
            <rect x="39" y="28" width="6" height="4" rx="1" fill="#475569" />
          </svg>
        </div>

      </div>

    </motion.div>
  );
}
