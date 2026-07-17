import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: boolean;
}

export default function Checkbox({ label, error, className = '', ...props }: CheckboxProps) {
  return (
    <div className="flex flex-col text-left">
      <label className={`flex items-start gap-3 cursor-pointer group select-none ${className}`}>
        <div className={`relative flex items-center justify-center w-5 h-5 rounded border bg-white group-hover:border-brand transition-colors shrink-0 mt-0.5 ${
          error ? 'border-brand ring-2 ring-brand/10' : 'border-slate-350'
        }`}>
          <input type="checkbox" className="peer sr-only" {...props} />
          <div className="absolute inset-0 bg-brand scale-0 peer-checked:scale-100 transition-transform rounded border border-brand flex items-center justify-center">
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white">
              <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors leading-tight">
          {label}
        </span>
      </label>
    </div>
  );
}
