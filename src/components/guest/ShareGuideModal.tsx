import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  QrCode, 
  Heart, 
  MapPin, 
  Sparkles,
  Wifi,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { Property, StumariGem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ShareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  favoriteGems?: StumariGem[];
}

export const ShareGuideModal: React.FC<ShareGuideModalProps> = ({
  isOpen,
  onClose,
  property,
  favoriteGems = []
}) => {
  const { theme, language, showToast } = useApp();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://stumari.ge/g/${property.slug}`;

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const getShareText = () => {
    let text = language === 'ka'
      ? `გამარჯობა! აქ არის ჩვენი ბინის გიდი (${property.title}): Wi-Fi, კარის კოდი, ტექნიკა და რჩევები.`
      : language === 'ru'
      ? `Привет! Вот гид по нашему жилью (${property.title}): Wi-Fi, код от двери, инструкции и рекомендации в Тбилиси.`
      : `Hey! Here is our guest guide for ${property.title}: Wi-Fi, keypad code, house rules, and local spots:`;

    if (favoriteGems.length > 0) {
      const names = favoriteGems.slice(0, 3).map(g => g.title).join(', ');
      const more = favoriteGems.length > 3 ? ` +${favoriteGems.length - 3}` : '';
      text += language === 'ka'
        ? ` ❤️ თან მოვნიშნე ჩვენი რჩეული ადგილები (${names}${more})!`
        : language === 'ru'
        ? ` ❤️ Я сохранил(а) избранные места (${names}${more})!`
        : ` ❤️ Includes our saved favorite spots (${names}${more})!`;
    }

    return text;
  };

  const shareText = getShareText();

  const handleCopyLink = () => {
    triggerHaptic();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast(language === 'ka' ? 'ლინკი დაკოპირდა!' : language === 'ru' ? 'Ссылка скопирована!' : 'Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    triggerHaptic();
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${property.title} — Stumari Guest Guide`,
          text: shareText,
          url: currentUrl
        });
        showToast(language === 'ka' ? 'წარმატებით გაზიარდა!' : 'Shared successfully!');
        onClose();
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          
          {/* Backdrop tap to close */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={onClose} 
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`relative z-10 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border p-5 sm:p-6 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto no-scrollbar ${
              isDark 
                ? 'bg-[#0E1317] border-stone-800 text-stone-100 shadow-black/80' 
                : 'bg-white border-stone-200 text-stone-900 shadow-xl'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Pull bar on mobile */}
            <div className="w-12 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-4 sm:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isDark ? 'bg-amber-600 text-white' : 'bg-stone-950 text-white'
                }`}>
                  <Share2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                    {language === 'ka' 
                      ? 'გაუზიარეთ თანამოგზაურებს' 
                      : language === 'ru' 
                      ? 'Поделиться с попутчиками' 
                      : 'Share Guide with Travelers'}
                  </h3>
                  <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {property.title} · {property.city}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'bg-stone-800/80 text-stone-400 hover:text-white' : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* What they get preview pill */}
            <div className={`p-3 rounded-2xl border mb-4 text-xs flex items-center justify-between gap-2 ${
              isDark ? 'bg-stone-900/60 border-stone-800/80 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-semibold">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Door Code</span>
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Wifi className="w-3.5 h-3.5 text-sky-500" />
                  <span>Wi-Fi</span>
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Map & Rules</span>
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                No app needed
              </span>
            </div>

            {/* Favorites highlight banner (if user saved any places) */}
            {favoriteGems.length > 0 && (
              <div className={`p-3.5 rounded-2xl border mb-4 space-y-2 ${
                isDark ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {language === 'ka' 
                        ? `თქვენი ${favoriteGems.length} შენახული რჩეული ადგილი` 
                        : language === 'ru' 
                        ? `Ваши ${favoriteGems.length} сохраненных мест` 
                        : `${favoriteGems.length} Saved Places by You`}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono uppercase font-bold opacity-80">
                    Included in link
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {favoriteGems.slice(0, 4).map(gem => (
                    <span 
                      key={gem.id} 
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                        isDark ? 'bg-stone-900 border-rose-500/20 text-stone-200' : 'bg-white border-rose-200 text-stone-800'
                      }`}
                    >
                      {gem.title}
                    </span>
                  ))}
                  {favoriteGems.length > 4 && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 opacity-75 self-center">
                      +{favoriteGems.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Primary Action 1: Native Web Share (AirDrop / Messages / System Sheet) */}
            {typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function' && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={handleNativeShare}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mb-3 shadow-md transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30' 
                    : 'bg-stone-950 hover:bg-stone-850 text-white shadow-stone-950/20'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>
                  {language === 'ka' 
                    ? 'სისტემური გაზიარება (AirDrop, Messages...)' 
                    : language === 'ru' 
                    ? 'Открыть меню "Поделиться" (AirDrop...)' 
                    : 'Send via AirDrop, Messages or Sheet'}
                </span>
              </motion.button>
            )}

            {/* Quick Messaging Buttons: WhatsApp & Telegram */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className={`py-3 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#0E2016] border-emerald-500/30 text-emerald-300 hover:bg-[#132c1f]' 
                    : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5]'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                <span>WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className={`py-3 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#0E1A2A] border-sky-500/30 text-sky-300 hover:bg-[#13243a]' 
                    : 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0369A1] hover:bg-[#E0F2FE]'
                }`}
              >
                <Send className="w-4 h-4 text-sky-500" />
                <span>Telegram</span>
              </motion.a>
            </div>

            {/* Copy Link Strip */}
            <div className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 mb-3 ${
              isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
            }`}>
              <div className="min-w-0 flex-1 pl-1">
                <span className="text-[10px] block font-mono uppercase font-bold text-stone-500 dark:text-stone-400">
                  Guide Link
                </span>
                <span className="text-xs font-mono font-medium block truncate select-all text-stone-900 dark:text-stone-200">
                  {currentUrl}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark 
                      ? 'bg-stone-800 hover:bg-stone-750 text-stone-200' 
                      : 'bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 shadow-2xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>

            {/* Toggle QR Code for In-Person Camera Scan */}
            <div className="pt-1 text-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  triggerHaptic();
                  setShowQr(!showQr);
                }}
                className={`text-xs font-bold inline-flex items-center gap-1.5 hover:underline cursor-pointer ${
                  isDark ? 'text-amber-400' : 'text-stone-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQr ? 'Hide In-Person QR Code' : 'Show In-Person QR Code (Scan with phone)'}</span>
              </motion.button>
            </div>

            {/* Expandable In-Person QR Code Box */}
            <AnimatePresence>
              {showQr && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.96 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`mt-3 p-4 rounded-2xl border text-center space-y-2 overflow-hidden ${
                    isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    Point any camera at this screen to open the guide instantly
                  </p>
                  <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center">
                    {/* Scalable SVG representation of QR with Stumari branding */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <QrCode className="w-full h-full text-stone-950 stroke-[1.5]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-[10px] font-black font-serif border-2 border-white shadow-xs">
                          S
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 block">
                    {property.title}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
