import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: FilterSelectProps) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-11 pl-4 pr-10 text-[13px] font-bold text-slate-600 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white cursor-pointer shadow-sm w-full min-w-[150px] sm:min-w-[170px] transition-all"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
