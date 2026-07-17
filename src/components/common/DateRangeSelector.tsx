import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangeSelectorProps {
  onChange?: (range: DateRange) => void;
  className?: string;
}

const presetRanges = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: 1 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'This Month', days: 'this-month' },
  { label: 'Last Month', days: 'last-month' },
];

export default function DateRangeSelector({ onChange, className = '' }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default to May 16 - May 22, 2024 to match mock data
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: new Date(2024, 4, 16),
    endDate: new Date(2024, 4, 22),
    label: 'Last 7 Days'
  });

  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1)); // May 2024

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const end = new Date(2024, 4, 22); // Fixed end point to keep mock data relevant
    let start = new Date(end);

    if (preset.days === 'this-month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (preset.days === 'last-month') {
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      end.setDate(0); // Last day of last month
    } else {
      start.setDate(end.getDate() - (preset.days as number));
    }

    const range = { startDate: start, endDate: end, label: preset.label };
    setSelectedRange(range);
    if (onChange) onChange(range);
    setIsOpen(false);
  };

  // Simple calendar logic
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Simple toggle range logic
    if (!selectedRange.startDate || selectedRange.startDate.getTime() === selectedRange.endDate.getTime()) {
      const newRange = { startDate: clickedDate, endDate: clickedDate, label: 'Custom' };
      setSelectedRange(newRange);
    } else if (clickedDate < selectedRange.startDate) {
      const newRange = { startDate: clickedDate, endDate: selectedRange.endDate, label: 'Custom' };
      setSelectedRange(newRange);
    } else {
      const newRange = { startDate: selectedRange.startDate, endDate: clickedDate, label: 'Custom' };
      setSelectedRange(newRange);
      if (onChange) onChange(newRange);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* Selector Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-650 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
      >
        <Calendar className="w-4.5 h-4.5 text-slate-400" />
        <span>
          {formatDate(selectedRange.startDate)} - {formatDate(selectedRange.endDate)}
        </span>
        <ChevronDown className="w-4.5 h-4.5 text-slate-400 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {/* Date Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 z-40 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 flex gap-4 w-[480px] text-left"
          >
            
            {/* Presets Sidebar */}
            <div className="w-[140px] border-r border-slate-50 pr-4 flex flex-col gap-1 shrink-0 justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2.5">Presets</span>
              {presetRanges.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={`w-full text-left px-2.5 py-2 text-[12.5px] font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedRange.label === preset.label 
                      ? 'bg-red-50 text-brand' 
                      : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-black text-slate-800">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="p-1 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="p-1 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} className="text-[10.5px] font-extrabold text-slate-400 uppercase">{d}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  
                  const isSelected = selectedRange.startDate && date.getTime() >= selectedRange.startDate.getTime() && selectedRange.endDate && date.getTime() <= selectedRange.endDate.getTime();
                  const isStart = selectedRange.startDate && date.getTime() === selectedRange.startDate.getTime();
                  const isEnd = selectedRange.endDate && date.getTime() === selectedRange.endDate.getTime();

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`h-7 w-7 text-[12px] font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected 
                          ? isStart || isEnd 
                            ? 'bg-brand text-white' 
                            : 'bg-red-50 text-brand'
                          : 'text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
