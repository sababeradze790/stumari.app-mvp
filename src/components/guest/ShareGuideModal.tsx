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
  KeyRound
} from 'lucide-react';
import { Property, StumariGem } from '../../types';
import { useApp } from '../../context/AppContext';
import { safeCopyToClipboard } from '../../utils/clipboard';

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
  const { theme, language, showToast, getGuestCheckInUrl, isPropertyAccessUnlocked } = useApp();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [includeAccessPass, setIncludeAccessPass] = useState(false);

  const canShareAccessPass = isPropertyAccessUnlocked(property);
  const shareUrl = getGuestCheckInUrl(property, canShareAccessPass && includeAccessPass);

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const getShareText = () => {
    let text =
      canShareAccessPass && includeAccessPass
        ? language === 'ka'
          ? `გამარჯობა! აქ არის ჩვენი ბინის გიდი (${property.title}): Wi-Fi, კარის კოდი, ტექნიკა და რჩევები.`
          : language === 'ru'
          ? `Привет! Вот гид по нашему жилью (${property.title}): Wi-Fi, код от двери, инструкции и рекомендации.`
          : `Here is our guest check-in guide for ${property.title} (includes Wi-Fi, access info & local spots):`
        : language === 'ka'
        ? `გამარჯობა! ნახეთ ${property.title}-ის გზამკვლევი და რჩეული ადგილები:`
        : language === 'ru'
        ? `Привет! Посмотрите путеводитель и лучшие места рядом с ${property.title}:`
        : `Check out the stay guide and local recommendations for ${property.title}:`;

    if (favoriteGems.length > 0) {
      const names = favoriteGems.slice(0, 3).map(g => g.title).join(', ');
      const more = favoriteGems.length > 3 ? ` +${favoriteGems.length - 3}` : '';
      text +=
        language === 'ka'
          ? ` · ჩვენი რჩეული ადგილები: ${names}${more}`
          : language === 'ru'
          ? ` · Сохраненные места: ${names}${more}`
          : ` · Saved spots: ${names}${more}`;
    }

    return text;
  };

  const shareText = getShareText();

  const handleCopyLink = async () => {
    triggerHaptic();
    const ok = await safeCopyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      showToast(
        language === 'ka'
          ? 'ლინკი დაკოპირდა!'
          : language === 'ru'
          ? 'Ссылка скопирована!'
          : 'Link copied to clipboard!'
      );
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast(
        language === 'ka'
          ? 'ლინკის კოპირება ვერ მოხერხდა'
          : language === 'ru'
          ? 'Не удалось скопировать ссылку'
          : 'Could not copy link automatically'
      );
    }
  };

  const handleNativeShare = async () => {
    triggerHaptic();
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${property.title} — Stumari Guest Guide`,
          text: shareText,
          url: shareUrl
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

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={`relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl border-t sm:border p-5 sm:p-6 shadow-warm-lg transition-all duration-300 max-h-[90vh] overflow-y-auto no-scrollbar ${
              isDark
                ? 'bg-[#141312] border-[#2B2926] text-[#F7F5F0]'
                : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Pull bar on mobile */}
            <div
              className={`w-10 h-1 rounded-full mx-auto mb-4 sm:hidden ${
                isDark ? 'bg-[#3B3833]' : 'bg-[#DDD8CF]'
              }`}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${
                    isDark
                      ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F55A51]'
                      : 'bg-white border-[#EBE6DF] text-[#F55A51]'
                  }`}
                >
                  <Share2 className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight tracking-tight">
                    {language === 'ka'
                      ? 'გაუზიარეთ თანამოგზაურებს'
                      : language === 'ru'
                      ? 'Поделиться с попутчиками'
                      : 'Share Guide with Travelers'}
                  </h3>
                  <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                    {[property.title, property.city].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F] hover:text-[#F7F5F0]'
                    : 'bg-white border-[#EBE6DF] text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Privacy Mode Summary + Co-Traveler Toggle */}
            <div
              className={`p-3.5 rounded-2xl border mb-4 text-xs space-y-2.5 ${
                isDark
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F]'
                  : 'bg-white border-[#EBE6DF] text-[#5C5853]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  {canShareAccessPass && includeAccessPass ? (
                    <>
                      <span className="flex items-center gap-1 font-semibold text-[#1C1B1A] dark:text-[#F7F5F0]">
                        <KeyRound className="w-3.5 h-3.5 text-[#FFC757]" />
                        <span>
                          {language === 'ka' ? 'კარის კოდი' : language === 'ru' ? 'Код доступа' : 'Access Code'}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#1C1B1A] dark:text-[#F7F5F0]">
                        <Wifi className="w-3.5 h-3.5 text-[#748C96]" />
                        <span>Wi-Fi</span>
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 font-semibold text-[#1C1B1A] dark:text-[#F7F5F0]">
                      <Sparkles className="w-3.5 h-3.5 text-[#748C96]" />
                      <span>
                        {language === 'ka'
                          ? 'უსაფრთხო საჯარო ბმული (პაროლების გარეშე)'
                          : language === 'ru'
                          ? 'Публичная ссылка (без паролей и кодов)'
                          : 'Public Guide Link (No Wi-Fi or Door Codes)'}
                      </span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#F55A51]" />
                    <span>
                      {language === 'ka' ? 'ადგილები და გზამკვლევი' : language === 'ru' ? 'Места и гид' : 'Places & Guide'}
                    </span>
                  </span>
                </div>
              </div>

              {canShareAccessPass && !property.isDemo && (
                <label
                  className={`pt-2.5 border-t flex items-center justify-between gap-2 cursor-pointer select-none ${
                    isDark ? 'border-[#2B2926] text-[#F7F5F0]' : 'border-[#EBE6DF] text-[#1C1B1A]'
                  }`}
                >
                  <span className="text-[11px] font-medium">
                    {language === 'ka'
                      ? 'ჩართეთ Wi-Fi და კარის კოდი (მხოლოდ თანამცხოვრებთათვის)'
                      : language === 'ru'
                      ? 'Включить ключ доступа (только для проживающих с вами)'
                      : 'Include private check-in key (for co-staying guests only)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={includeAccessPass}
                    onChange={(e) => setIncludeAccessPass(e.target.checked)}
                    className="rounded border-[#C4BDAF] text-[#F55A51] focus:ring-[#F55A51]"
                  />
                </label>
              )}
            </div>

            {/* Favorites highlight banner (if user saved any places) */}
            {favoriteGems.length > 0 && (
              <div
                className={`p-3.5 rounded-2xl border mb-4 space-y-1.5 ${
                  isDark
                    ? 'bg-[#1F1E1C] border-[#F55A51]/30 text-[#F7F5F0]'
                    : 'bg-[#FDF1F0]/60 border-[#F55A51]/25 text-[#1C1B1A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F55A51]">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {language === 'ka'
                        ? `თქვენი ${favoriteGems.length} შენახული ადგილი`
                        : language === 'ru'
                        ? `Ваши ${favoriteGems.length} сохраненных мест`
                        : `${favoriteGems.length} Saved Places Included`}
                    </span>
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                  {favoriteGems.slice(0, 4).map(g => g.title).join(' · ')}
                  {favoriteGems.length > 4 ? ` · +${favoriteGems.length - 4}` : ''}
                </p>
              </div>
            )}

            {/* Primary Action 1: Native Web Share */}
            {typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function' && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNativeShare}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 mb-3 shadow-xs transition-colors cursor-pointer bg-[#F55A51] hover:bg-[#E04840] text-white"
              >
                <Share2 className="w-4 h-4" />
                <span>
                  {language === 'ka'
                    ? 'სისტემური გაზიარება (AirDrop, Messages...)'
                    : language === 'ru'
                    ? 'Поделиться через устройство'
                    : 'Share via Device Sheet'}
                </span>
              </motion.button>
            )}

            {/* Quick Messaging Buttons: WhatsApp & Telegram */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0] hover:border-[#3B3833]'
                    : 'bg-white border-[#EBE6DF] text-[#1C1B1A] hover:bg-[#F3EFE9]'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0] hover:border-[#3B3833]'
                    : 'bg-white border-[#EBE6DF] text-[#1C1B1A] hover:bg-[#F3EFE9]'
                }`}
              >
                <Send className="w-4 h-4 text-[#748C96]" />
                <span>Telegram</span>
              </motion.a>
            </div>

            {/* Copy Link Strip */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 mb-3 ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
              }`}
            >
              <div className="min-w-0 flex-1 pl-0.5">
                <span className={`text-[10px] block font-semibold uppercase tracking-wider ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
                  {canShareAccessPass && includeAccessPass
                    ? language === 'ka' ? 'პირადი ჩექ-ინ ბმული' : language === 'ru' ? 'Личная ссылка заселения' : 'Private Check-In Link'
                    : language === 'ka' ? 'საჯარო გზამკვლევის ბმული' : language === 'ru' ? 'Публичная ссылка гида' : 'Public Guide Link'}
                </span>
                <span className="text-xs font-mono font-medium block truncate select-all mt-0.5">
                  {shareUrl}
                </span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-[#F55A51] hover:bg-[#E04840] text-white shadow-2xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copied
                    ? language === 'ka' ? 'კოპირებულია' : language === 'ru' ? 'Скопировано' : 'Copied'
                    : language === 'ka' ? 'კოპირება' : language === 'ru' ? 'Копировать' : 'Copy'}
                </span>
              </motion.button>
            </div>

            {/* Toggle QR Code for In-Person Camera Scan */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setShowQr(!showQr);
                }}
                className={`text-xs font-semibold inline-flex items-center gap-1.5 hover:underline cursor-pointer ${
                  isDark ? 'text-[#ACA79F] hover:text-[#F7F5F0]' : 'text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-[#748C96]" />
                <span>
                  {showQr
                    ? language === 'ka' ? 'QR კოდის დამალვა' : language === 'ru' ? 'Скрыть QR-код' : 'Hide In-Person QR Preview'
                    : language === 'ka' ? 'QR კოდის ჩვენება' : language === 'ru' ? 'Показать QR-код' : 'Show In-Person QR Preview'}
                </span>
              </button>
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
                    isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
                  }`}
                >
                  <p className={`text-[11px] font-medium ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                    {language === 'ka'
                      ? 'დაასკანერეთ კამერით გზამკვლევის გასახსნელად'
                      : language === 'ru'
                      ? 'Наведите камеру телефона для быстрого открытия'
                      : 'Scan with your phone camera or share the link above'}
                  </p>
                  <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl shadow-2xs border border-[#EBE6DF] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <QrCode className="w-full h-full text-[#1C1B1A] stroke-[1.5]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-[#F55A51] text-white flex items-center justify-center text-[10px] font-bold font-serif border-2 border-white shadow-2xs">
                          S
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono block ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
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
