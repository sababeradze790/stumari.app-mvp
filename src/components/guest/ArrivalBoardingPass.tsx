import React, { useState } from 'react';
import { 
  KeyRound, 
  Wifi, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  ChevronRight, 
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';

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
    navigator.clipboard.writeText(property.wifiPassword);
    setWifiCopied(true);
    setTimeout(() => setWifiCopied(false), 2000);
    showToast(language === 'ka' ? 'Wi-Fi პაროლი დაკოპირდა!' : language === 'ru' ? 'Пароль от Wi-Fi скопирован!' : 'Wi-Fi password copied!');
  };

  return (
    <div className="w-full select-none">
      {/* Boarding Pass Container */}
      <div className={`rounded-[28px] border shadow-xl relative overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-b from-[#182026]/85 via-[#11171B]/85 to-[#0C1013]/90 backdrop-blur-md border-white/10 text-stone-100 shadow-black/60 ring-1 ring-white/5' 
          : 'bg-white/95 backdrop-blur-md border-stone-200/90 text-stone-900 shadow-stone-900/10'
      }`}>
        
        {/* Top Header Strip: Property & Live Status */}
        <div className={`px-4 pt-3.5 pb-3 flex items-center justify-between border-b ${
          isDark ? 'border-white/10 bg-white/[0.02]' : 'border-stone-100 bg-stone-50/90'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider truncate ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              {language === 'ka' ? 'ბინაში შესვლა მზადაა' : language === 'ru' ? 'Заезд готов' : 'Ready For Check-In'}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 shrink-0 text-[11px] font-medium ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}>
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{property.checkInTime}</span>
          </div>
        </div>

        {/* Access Codes Bento: Door Key + Wi-Fi */}
        <div className="p-4 grid grid-cols-2 gap-2.5">
          
          {/* Card 1: Keypad Door Code */}
          <div 
            onClick={copyDoorCode}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.97] flex flex-col justify-between ${
              isDark 
                ? 'bg-white/[0.04] backdrop-blur-md border-white/10 hover:border-emerald-400/40 hover:bg-white/[0.07] shadow-inner' 
                : 'bg-white border-stone-200 hover:border-emerald-500 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-emerald-50 text-emerald-700'
              }`}>
                <KeyRound className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full transition-colors ${
                doorCopied 
                  ? 'bg-emerald-600 text-white' 
                  : isDark ? 'bg-white/10 text-stone-300 group-hover:text-white' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
              }`}>
                {doorCopied ? (language === 'ka' ? '✓ კოდი' : '✓ Copied') : (language === 'ka' ? 'დაკოპირება' : 'Copy')}
              </span>
            </div>

            <div>
              <span className={`text-[10px] font-medium block mb-0.5 ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {language === 'ka' ? 'კარის კოდი' : language === 'ru' ? 'Код от двери' : 'Keypad Code'}
              </span>
              <div className={`font-mono text-xl font-black tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                {property.doorKeypadCode}
              </div>
            </div>
          </div>

          {/* Card 2: Wi-Fi Password */}
          <div 
            onClick={copyWifi}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.97] flex flex-col justify-between ${
              isDark 
                ? 'bg-white/[0.04] backdrop-blur-md border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] shadow-inner' 
                : 'bg-white border-stone-200 hover:border-amber-500 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#E4E98E]/15 text-[#E4E98E] ring-1 ring-[#E4E98E]/20' : 'bg-amber-100 text-amber-800'
              }`}>
                <Wifi className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full transition-colors ${
                wifiCopied 
                  ? isDark ? 'bg-[#E4E98E] text-stone-950' : 'bg-stone-900 text-white' 
                  : isDark ? 'bg-white/10 text-stone-300 group-hover:text-white' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
              }`}>
                {wifiCopied ? (language === 'ka' ? '✓ პაროლი' : '✓ Copied') : (language === 'ka' ? 'დაკოპირება' : 'Copy')}
              </span>
            </div>

            <div>
              <span className={`text-[10px] font-medium block mb-0.5 truncate ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {property.wifiNetwork}
              </span>
              <div className={`font-mono text-base font-bold truncate ${
                isDark ? 'text-stone-100' : 'text-stone-900'
              }`}>
                {property.wifiPassword}
              </div>
            </div>
          </div>

        </div>

        {/* Dotted Tear Line Indicator (Inspired by Boarding Pass Ticket) */}
        <div className="relative flex items-center px-2 py-1">
          <div className={`w-3.5 h-3.5 rounded-full -ml-3.5 border ${
            isDark ? 'bg-[#0A0E11] border-white/10' : 'bg-stone-100 border-stone-200'
          }`} />
          <div className="flex-1 border-t-2 border-dashed border-stone-300 dark:border-white/10 mx-2" />
          <div className={`w-3.5 h-3.5 rounded-full -mr-3.5 border ${
            isDark ? 'bg-[#0A0E11] border-white/10' : 'bg-stone-100 border-stone-200'
          }`} />
        </div>

        {/* Lower Strip: Address & Directions Link */}
        <div className={`p-3.5 pt-2 flex items-center justify-between gap-2 border-t ${
          isDark ? 'border-white/10' : 'border-stone-100'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
            }`}>
              <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-[#E4E98E]' : 'text-amber-600'}`} />
            </div>
            <div className="min-w-0">
              <span className={`text-xs font-semibold block truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
                {property.address}
              </span>
              <span className={`text-[10px] block truncate ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {property.city}, {property.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                isDark 
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-200' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
              }`}
            >
              <span>{language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Maps'}</span>
              <ExternalLink className={`w-3 h-3 ${isDark ? 'text-[#E4E98E]' : 'text-amber-600'}`} />
            </a>

            <button
              onClick={onOpenCheckinInstructions}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs ${
                isDark 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>{language === 'ka' ? 'ინსტრუქცია' : language === 'ru' ? 'Инструкция' : 'Steps'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
