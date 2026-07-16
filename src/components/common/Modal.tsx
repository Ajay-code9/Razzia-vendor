import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerButtons?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerButtons,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[500px] bg-white border border-slate-100 rounded-2xl shadow-xl z-10 flex flex-col max-h-[85vh] font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-[14px] text-slate-600 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footerButtons && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-50 bg-slate-50/20">
            {footerButtons}
          </div>
        )}

      </div>
    </div>
  );
}
