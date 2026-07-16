import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  subtext: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  percentage,
  subtext,
  icon,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex-1 min-w-[240px] bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-widget transition-shadow duration-200 cursor-default"
    >
      {/* Icon Circle */}
      <div 
        className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${iconBgColor} ${iconColor}`}
      >
        {icon}
      </div>

      {/* Stats Text */}
      <div className="flex-1 min-w-0">
        <span className="text-[13px] font-bold text-slate-400 block tracking-tight truncate">
          {title}
        </span>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className="text-[24px] font-black text-slate-800 tracking-tight leading-none">
            {value}
          </span>
          <span className="flex items-center text-[11px] font-bold text-[#10B981] leading-none shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            {percentage}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block font-medium">
          {subtext}
        </span>
      </div>
    </motion.div>
  );
}
