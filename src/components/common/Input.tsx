import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

export default function Input({ label, icon, rightElement, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-[13px] font-bold text-slate-700 block">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full h-14 bg-white border rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all shadow-sm ${
            icon ? 'pl-12' : 'pl-4'
          } ${rightElement ? 'pr-12' : 'pr-4'} ${
            error ? 'border-brand ring-4 ring-brand/5' : 'border-slate-200'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span className="text-[12px] font-semibold text-brand block mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
