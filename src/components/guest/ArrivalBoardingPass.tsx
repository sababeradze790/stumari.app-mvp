import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, 
  Wifi, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { TbilisiBalconySketch, TbilisiTowerSketch } from './GuestGuideIllustrations';

interface ArrivalBoardingPassProps {
  property: Property;
  onOpenCheckinInstructions: () => void;
  onOpenWifiModal: () => void;
}

export const ArrivalBoardingPass: React.FC<ArrivalBoardingPassProps> = ({
  property,
  onOpenCheckinInstructions,
  onOpenWifiModal
}) => {
  const { theme, language, showToast } = useApp();
  const isDark = theme === 'dark';

  const [doorCopied, setDoorCopied] = useState(false);
  const [wifiCopied, setWifiCopied] = useState(false);

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {}
  };

  const copyDoorCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    navigator.clipboard.writeText(property.doorKeypadCode);
    setDoorCopied(true);
    setTimeout(() => setDoorCopied(false), 2000);
    showToast(language === 'ka' ? 'კარის კოდი დაკოპირდა!' : language === 'ru' ? 'Код от двери скопирован!' : 'Door code copied to clipboard!');
  };

  const copyWifi = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    navigator.clipboard.writeText(property.wifiPassword || property.wifiNetwork);
    setWifiCopied(true);
    setTimeout(() => setWifiCopied(false), 2000);
    showToast(language === 'ka' ? 'Wi-Fi დაკოპირდა!' : language === 'ru' ? 'Wi-Fi скопирован!' : 'Wi-Fi copied to clipboard!');
  };

  return (
    <div className="w-full space-y-3 select-none">
      
      {/* 1. Live Check-in Status Banner (Boutique Boarding Pass Header) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`px-4 py-3 rounded-2xl border flex items-center justify-between transition-all duration-300 shadow-warm-sm ${
          isDark 
            ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
            : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-tight">
            {language === 'ka' ? 'ბინა მზადაა შემოსასვლელად' : language === 'ru' ? 'Готово к заселению' : 'Ready for Check-in'}
          </span>
        </div>

        <div className={`flex items-center gap-2 text-xs font-mono font-medium ${
          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
        }`}>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#748C96]" />
            <span>In: {property.checkInTime}</span>
          </div>
          <span className="opacity-40">·</span>
          <span>Out: {property.checkOutTime}</span>
        </div>
      </motion.div>

      {/* 2. Access Codes Bento Grid: Front Door Code + Wi-Fi */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Card 1: Front Door Code (Golden Yellow Theme) */}
        <motion.div 
          onClick={copyDoorCode}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`p-4 rounded-2xl relative overflow-hidden cursor-pointer group flex flex-col justify-between h-[148px] border shadow-warm-sm hover:shadow-warm-md transition-all duration-300 ${
            isDark 
              ? 'bg-[#1C1A14] border-[#FFC757]/30 hover:border-[#FFC757]/60 text-[#F7F5F0]' 
              : 'bg-gradient-to-b from-[#FFFDF8] to-[#FFF9EC] border-[#FFC757]/45 hover:border-[#FFC757]/80 text-[#1C1B1A]'
          }`}
        >
          {/* Background Architectural Watermark */}
          <div className="absolute -right-2 -bottom-2 pointer-events-none opacity-5 dark:opacity-10 text-[#FFC757]">
            <TbilisiBalconySketch className="w-28 h-28" isDark={isDark} />
          </div>

          <div className="relative z-10">
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                isDark 
                  ? 'bg-[#FFC757]/15 border-[#FFC757]/30 text-[#FFC757]' 
                  : 'bg-[#FFC757]/25 border-[#FFC757]/40 text-[#996F00]'
              }`}>
                <KeyRound className="w-4 h-4" />
              </div>
              <AnimatePresence mode="wait">
                {doorCopied ? (
                  <motion.span 
                    key="copied"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>{language === 'ka' ? 'კოპირებულია' : 'Copied'}</span>
                  </motion.span>
                ) : (
                  <span key="uncopied" className={`text-[10px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                    isDark ? 'text-[#FFC757] bg-[#FFC757]/10' : 'text-[#8A6300] bg-[#FFC757]/20'
                  }`}>
                    {language === 'ka' ? 'კოდი' : 'KEYPAD'}
                  </span>
                )}
              </AnimatePresence>
            </div>

            {/* Label */}
            <span className={`text-[11px] font-medium block tracking-tight ${
              isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
            }`}>
              {language === 'ka' ? 'კარის კოდი' : language === 'ru' ? 'Код двери' : 'Front Door Code'}
            </span>

            {/* Code */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight leading-none ${
                isDark ? 'text-[#FFE8A3]' : 'text-[#1C1B1A]'
              }`}>
                {property.doorKeypadCode}
              </span>
              <Copy className={`w-3.5 h-3.5 transition-colors ${
                isDark ? 'text-[#ACA79F] group-hover:text-[#FFC757]' : 'text-[#8A857D] group-hover:text-[#1C1B1A]'
              }`} />
            </div>
          </div>

          {/* Bottom helper */}
          <div className={`relative z-10 flex items-center gap-1 text-[10px] font-medium ${
            isDark ? 'text-[#FFC757]/80' : 'text-[#8A6300]'
          }`}>
            <span className="tracking-tight">{language === 'ka' ? 'დააჭირეთ დასაკოპირებლად' : 'Tap to copy code'}</span>
          </div>
        </motion.div>

        {/* Card 2: Wi-Fi Network (Slate Blue Theme) */}
        <motion.div 
          onClick={copyWifi}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`p-4 rounded-2xl relative overflow-hidden cursor-pointer group flex flex-col justify-between h-[148px] border shadow-warm-sm hover:shadow-warm-md transition-all duration-300 ${
            isDark 
              ? 'bg-[#13191D] border-[#748C96]/35 hover:border-[#748C96]/70 text-[#F7F5F0]' 
              : 'bg-gradient-to-b from-[#FAFDFE] to-[#F0F5F7] border-[#748C96]/35 hover:border-[#748C96]/70 text-[#1C1B1A]'
          }`}
        >
          {/* Background Architectural Watermark */}
          <div className="absolute -right-1 -bottom-1 pointer-events-none opacity-5 dark:opacity-10 text-[#748C96]">
            <TbilisiTowerSketch className="w-28 h-28" isDark={isDark} />
          </div>

          <div className="relative z-10">
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                isDark 
                  ? 'bg-[#748C96]/20 border-[#748C96]/35 text-[#98B1BC]' 
                  : 'bg-[#748C96]/20 border-[#748C96]/35 text-[#47606B]'
              }`}>
                <Wifi className="w-4 h-4" />
              </div>
              <AnimatePresence mode="wait">
                {wifiCopied ? (
                  <motion.span 
                    key="copied"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>{language === 'ka' ? 'კოპირებულია' : 'Copied'}</span>
                  </motion.span>
                ) : (
                  <span key="uncopied" className={`text-[10px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                    isDark ? 'text-[#98B1BC] bg-[#748C96]/15' : 'text-[#47606B] bg-[#748C96]/20'
                  }`}>
                    {language === 'ka' ? 'ვაიფაი' : 'WI-FI'}
                  </span>
                )}
              </AnimatePresence>
            </div>

            {/* Label */}
            <span className={`text-[11px] font-medium block truncate tracking-tight ${
              isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
            }`}>
              {language === 'ka' ? 'Wi-Fi ქსელი' : language === 'ru' ? 'Сеть Wi-Fi' : 'Wi-Fi Network'}
            </span>

            {/* SSID */}
            <div className="flex items-center gap-1.5 mt-1 min-w-0">
              <span className="font-mono text-sm sm:text-base font-bold tracking-tight leading-none truncate">
                {property.wifiNetwork || 'OldTbilisi_5G'}
              </span>
              <Copy className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                isDark ? 'text-[#ACA79F] group-hover:text-[#98B1BC]' : 'text-[#8A857D] group-hover:text-[#47606B]'
              }`} />
            </div>
          </div>

          {/* Password info */}
          <div className={`relative z-10 flex items-center gap-1 text-[11px] font-mono truncate font-semibold tracking-tight ${
            isDark ? 'text-[#98B1BC]' : 'text-[#47606B]'
          }`}>
            <span>Pass: {property.wifiPassword}</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Address Bar Card with Maps & Steps (Tactile Concierge Card) */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all duration-300 shadow-warm-sm hover:shadow-warm-md ${
        isDark 
          ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
          : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${
            isDark ? 'bg-[#272522] border-[#3B3833] text-[#ACA79F]' : 'bg-[#F3EFE9] border-[#EBE6DF] text-[#5C5853]'
          }`}>
            <MapPin className="w-4.5 h-4.5 text-[#F55A51]" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs sm:text-sm font-semibold block truncate tracking-tight ${isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'}`}>
              {property.address || '14 Lado Asatiani St.'}
            </span>
            <span className={`text-[11px] sm:text-xs block truncate font-medium tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
              {property.city}, {property.country}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs border cursor-pointer ${
              isDark 
                ? 'bg-[#272522] hover:bg-[#322F2B] text-[#F7F5F0] border-[#3B3833]' 
                : 'bg-[#F3EFE9] hover:bg-[#EAE4DC] text-[#1C1B1A] border-[#EBE6DF]'
            }`}
          >
            <span>{language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Maps'}</span>
            <ExternalLink className="w-3 h-3 text-[#748C96]" />
          </a>

          <button
            onClick={() => {
              triggerHaptic();
              onOpenCheckinInstructions();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-xs bg-[#F55A51] hover:bg-[#E04840] text-white cursor-pointer"
          >
            <span>{language === 'ka' ? 'ინსტრუქცია' : language === 'ru' ? 'Шаги' : 'Guide'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
