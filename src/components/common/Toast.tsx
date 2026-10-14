import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          aria-label="Notifications"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3 rounded-2xl bg-stone-950/95 backdrop-blur-xl text-stone-50 shadow-2xl border border-stone-800/90 overflow-hidden"
        >
          {/* Subtle Shimmer Highlight */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
          </div>

          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.05 }}
            className="shrink-0 relative z-10"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Info className="w-5 h-5 text-amber-400" />
            )}
          </motion.div>
          <span className="text-sm font-semibold text-stone-100 relative z-10 tracking-tight">
            {toast.message}
          </span>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
