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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
            aria-hidden="true"
          />

          {/* Slide-Up Sheet Container */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className={`relative z-10 w-full max-w-lg mx-auto rounded-t-2xl border-t shadow-xl flex flex-col overflow-hidden tracking-tight ${maxHeight} ${
              isDark 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {/* Drag Handle */}
            <div 
              onClick={onClose}
              className="w-full pt-3 pb-1 flex items-center justify-center cursor-pointer shrink-0"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-700/60 hover:bg-zinc-600 transition-colors" />
            </div>

            {/* Sheet Header */}
            <div className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 gap-3 ${
              isDark ? 'border-zinc-800 bg-zinc-900/80' : 'border-zinc-200 bg-zinc-50'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                {icon && (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                    isDark ? 'bg-zinc-800 border-zinc-700/80 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                  }`}>
                    {icon}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg leading-tight truncate tracking-tight text-zinc-100 dark:text-zinc-100">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-medium tracking-tight">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer border ${
                  isDark 
                    ? 'bg-zinc-850 border-zinc-750 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Sheet Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1 overscroll-contain">
              {children}
            </div>

            {/* Sticky Bottom Action (if provided) */}
            {stickyBottomAction && (
              <div className={`p-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] border-t shrink-0 ${
                isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'
              }`}>
                {stickyBottomAction}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
