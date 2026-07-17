import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export default function Button({ children, isLoading, variant = 'primary', className = '', ...props }: ButtonProps) {
  if (variant === 'outline') {
    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full h-[50px] bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors shadow-sm font-semibold text-[14px] text-slate-700 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99, y: 0 }}
      className={`w-full h-[54px] bg-brand text-white rounded-xl font-bold text-[15px] shadow-[0_8px_20px_-6px_rgba(254,6,13,0.4)] hover:bg-red-700 hover:shadow-[0_12px_25px_-8px_rgba(254,6,13,0.5)] active:translate-y-0 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none cursor-pointer ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
