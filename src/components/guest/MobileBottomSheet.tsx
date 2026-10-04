import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  stickyBottomAction?: React.ReactNode;
  maxHeight?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  stickyBottomAction,
  maxHeight = 'max-h-[88vh]'
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        aria-hidden="true"
      />

      {/* Slide-Up Sheet Container */}
      <div 
        className={`relative z-10 w-full max-w-lg mx-auto rounded-t-[32px] border-t shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300 ${maxHeight} ${
          isDark 
            ? 'bg-[#0E1317] border-stone-800 text-stone-100' 
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* iOS Drag Handle */}
        <div 
          onClick={onClose}
          className="w-full pt-3 pb-1 flex items-center justify-center cursor-pointer shrink-0"
        >
          <div className="w-12 h-1.5 rounded-full bg-stone-500/40 hover:bg-stone-500/70 transition-colors" />
        </div>

        {/* Sheet Header */}
        <div className={`px-5 py-3 border-b flex items-center justify-between shrink-0 gap-3 ${
          isDark ? 'border-stone-800/80 bg-[#12171B]' : 'border-stone-100 bg-stone-50'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-stone-200 text-stone-900'
              }`}>
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-stone-400 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1 overscroll-contain">
          {children}
        </div>

        {/* Sticky Bottom Action (if provided) */}
        {stickyBottomAction && (
          <div className={`p-4 border-t shrink-0 ${
            isDark ? 'border-stone-800/80 bg-[#0E1317]' : 'border-stone-100 bg-white'
          }`}>
            {stickyBottomAction}
          </div>
        )}

        {/* iOS Home Indicator Bar Spacer */}
        <div className="w-32 h-1 bg-stone-500/20 rounded-full mx-auto my-1.5 shrink-0" />
      </div>
    </div>
  );
};
