import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Radio, Play } from 'lucide-react';

export default function LiveStreamCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm w-full md:w-[360px] lg:w-[380px] shrink-0 hover:shadow-widget transition-shadow duration-200"
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
          Live Streaming
        </h3>
        <Link 
          to="/live-streaming"
          className="text-[13px] font-extrabold text-brand hover:text-brand-hover transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Preview Card Body */}
      <div className="relative overflow-hidden rounded-xl aspect-[16/10] bg-gradient-to-tr from-rose-500 via-orange-400 to-indigo-600 border border-slate-100/50 shadow-inner flex items-center justify-center group">
        
        {/* Abstract Host Drawing / Webcam Mock */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          
          {/* Audio Wave Visuals */}
          <div className="absolute bottom-4 right-4 flex items-end gap-0.5 h-6">
            <span className="w-[3px] bg-white/70 rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
            <span className="w-[3px] bg-white/70 rounded-full animate-bounce h-5" style={{ animationDelay: '0.3s' }} />
            <span className="w-[3px] bg-white/70 rounded-full animate-bounce h-3" style={{ animationDelay: '0.5s' }} />
            <span className="w-[3px] bg-white/70 rounded-full animate-bounce h-6" style={{ animationDelay: '0.2s' }} />
            <span className="w-[3px] bg-white/70 rounded-full animate-bounce h-4" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Central Play Button Overlay on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-300 shadow-md">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Center illustration (Host Headset Silhouette for premium feel) */}
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-white/20 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
          <circle cx="50" cy="40" r="16" stroke="currentColor" strokeWidth="3" />
          <path d="M26 78C26 65.85 36.745 56 50 56C63.255 56 74 65.85 74 78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 40C30 29.5 38.5 21 49 21C59.5 21 68 29.5 68 40" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="28" cy="40" r="4" fill="currentColor" />
          <circle cx="72" cy="40" r="4" fill="currentColor" />
        </svg>

        {/* Left Live Tag Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm select-none">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shrink-0" />
          LIVE 00:18:42
        </div>

        {/* Right Viewer Tag Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm select-none">
          <Eye className="w-3.5 h-3.5" />
          1.2K
        </div>

      </div>

      {/* Stream Description */}
      <div className="mt-3.5 text-left">
        <h4 className="text-[14px] font-bold text-slate-800 tracking-tight">
          Tech Gadgets Live
        </h4>
        <p className="text-[12px] text-slate-400 mt-0.5 leading-normal font-semibold">
          Showcasing new arrivals and best deals
        </p>
      </div>

      {/* Action Button */}
      <Link 
        to="/live-streaming"
        className="w-full mt-4 h-11 bg-brand-light hover:bg-brand text-brand hover:text-white font-extrabold text-[13.5px] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm shadow-brand/5 border border-brand/5 cursor-pointer"
      >
        <Radio className="w-4 h-4" />
        <span>Go to Live Studio</span>
      </Link>

    </motion.div>
  );
}
