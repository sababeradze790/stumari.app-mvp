import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-Up Sheet on Mobile / Centered Dialog on Tablet & Desktop */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%', opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className={`relative z-10 w-full max-w-xl mx-auto rounded-t-2xl sm:rounded-2xl border-t sm:border shadow-warm-lg flex flex-col overflow-hidden tracking-tight ${maxHeight} ${
              isDark
                ? 'bg-[#141312] border-[#2B2926] text-[#F7F5F0]'
                : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
            }`}
          >
            {/* Mobile Drag Handle */}
            <div
              onClick={onClose}
              className="w-full pt-3 pb-1 flex items-center justify-center cursor-pointer shrink-0 sm:hidden"
            >
              <div
                className={`w-10 h-1 rounded-full transition-colors ${
                  isDark ? 'bg-[#3B3833] hover:bg-[#544F48]' : 'bg-[#DDD8CF] hover:bg-[#C4BDAF]'
                }`}
              />
            </div>

            {/* Sheet Header */}
            <div
              className={`px-5 py-4 border-b flex items-center justify-between shrink-0 gap-3 ${
                isDark ? 'border-[#2B2926] bg-[#1F1E1C]' : 'border-[#EBE6DF] bg-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {icon && (
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                      isDark
                        ? 'bg-[#272522] border-[#3B3833] text-[#F7F5F0]'
                        : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
                    }`}
                  >
                    {icon}
                  </div>
                )}
                <div className="min-w-0">
                  <h3
                    className={`font-serif font-bold text-base sm:text-lg leading-tight truncate tracking-tight ${
                      isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                    }`}
                  >
                    {title}
                  </h3>
                  {subtitle && (
                    <p
                      className={`text-xs truncate mt-0.5 font-medium tracking-tight ${
                        isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                      }`}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-[#272522] border-[#3B3833] text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#322F2B]'
                    : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#5C5853] hover:bg-[#F3EFE9] hover:text-[#1C1B1A]'
                }`}
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Sheet Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed flex-1 overscroll-contain">
              {children}
            </div>

            {/* Sticky Bottom Action (if provided) */}
            {stickyBottomAction && (
              <div
                className={`p-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] sm:pb-4 border-t shrink-0 ${
                  isDark ? 'border-[#2B2926] bg-[#1F1E1C]' : 'border-[#EBE6DF] bg-white'
                }`}
              >
                {stickyBottomAction}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
