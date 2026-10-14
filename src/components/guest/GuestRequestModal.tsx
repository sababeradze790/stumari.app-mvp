import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Thermometer, 
  KeyRound, 
  Wifi, 
  Shirt, 
  HelpCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RequestCategory } from '../../types';

interface GuestRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: RequestCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'cleaning', label: 'Towels & Linens', icon: <Shirt className="w-4 h-4" /> },
  { id: 'climate', label: 'Heating / AC', icon: <Thermometer className="w-4 h-4" /> },
  { id: 'access', label: 'Door / Access', icon: <KeyRound className="w-4 h-4" /> },
  { id: 'wifi', label: 'Wi-Fi Support', icon: <Wifi className="w-4 h-4" /> },
  { id: 'other', label: 'General Inquiry', icon: <HelpCircle className="w-4 h-4" /> }
];

export const GuestRequestModal: React.FC<GuestRequestModalProps> = ({ isOpen, onClose }) => {
  const { currentProperty, addGuestRequest, showToast, theme } = useApp();
  const isDark = theme === 'dark';

  const [category, setCategory] = useState<RequestCategory>('cleaning');
  const [guestName, setGuestName] = useState('');
  const [details, setDetails] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    addGuestRequest({
      propertyId: currentProperty.id,
      propertyName: currentProperty.title,
      guestName: guestName.trim() || 'Guest',
      category,
      title: `${CATEGORIES.find(c => c.id === category)?.label || 'Inquiry'} request`,
      description: details.trim(),
      urgency
    });

    setSubmitted(true);
    showToast('Your request has been dispatched to the host!');
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`relative w-full max-w-md rounded-2xl border p-5 sm:p-6 shadow-2xl z-10 transition-colors ${
            isDark 
              ? 'bg-[#18191E] border-stone-800 text-stone-100 shadow-stone-950/80' 
              : 'bg-white border-stone-200 text-stone-900 shadow-xl'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-colors ${
              isDark 
                ? 'border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800' 
                : 'border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Request Received</h3>
              <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                Host {currentProperty.hostName} and the property team have been notified. We will attend to your request promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#748C96] block mb-1">
                  Direct Host Service
                </span>
                <h3 className="font-serif text-xl font-bold tracking-tight">How can we assist you?</h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  Need extra amenities, luggage assistance, or quick help? Let host {currentProperty.hostName} know.
                </p>
              </div>

              {/* Category selection */}
              <div>
                <label className="text-xs font-semibold block mb-2">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all text-left border ${
                        category === cat.id
                          ? 'bg-[#F55A51] border-[#F55A51] text-white shadow-xs'
                          : isDark
                            ? 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cat.icon}
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest name */}
              <div>
                <label className="text-xs font-semibold block mb-1">Your Name (optional)</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Maria"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-hidden transition-colors ${
                    isDark 
                      ? 'bg-stone-900 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-[#F55A51]' 
                      : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-[#F55A51]'
                  }`}
                />
              </div>

              {/* Details */}
              <div>
                <label className="text-xs font-semibold block mb-1">Details</label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Could we please request two extra bath towels and fresh pillowcases?"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-hidden transition-colors resize-none ${
                    isDark 
                      ? 'bg-stone-900 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-[#F55A51]' 
                      : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-[#F55A51]'
                  }`}
                />
              </div>

              {/* Urgency */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold">Priority</span>
                <div className="flex items-center gap-1.5">
                  {(['low', 'medium', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`px-2.5 py-1 text-[11px] rounded-md font-medium capitalize border transition-all ${
                        urgency === lvl
                          ? lvl === 'high' 
                            ? 'bg-[#F55A51] border-[#F55A51] text-white' 
                            : 'bg-[#748C96] border-[#748C96] text-white'
                          : isDark
                            ? 'bg-stone-900 border-stone-800 text-stone-400'
                            : 'bg-stone-100 border-stone-200 text-stone-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-lg font-bold text-xs bg-[#F55A51] hover:bg-[#e04a41] text-white shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request to Host</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
