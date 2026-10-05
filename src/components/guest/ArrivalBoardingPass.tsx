import React, { useState } from 'react';
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
      
      {/* 1. Live Check-in Status Banner */}
      <div className={`px-4 py-3 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
        isDark 
          ? 'bg-[#10171D] border-stone-800 text-stone-100 shadow-sm' 
          : 'bg-white border-stone-200/90 text-stone-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className={`text-xs font-bold tracking-tight ${
            isDark ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            {language === 'ka' ? 'ბინა მზადაა შემოსასვლელად' : language === 'ru' ? 'Готово к заселению' : 'Ready for Check-in'}
          </span>
        </div>

        <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
          isDark ? 'text-stone-300' : 'text-stone-800'
        }`}>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{property.checkInTime}</span>
        </div>
      </div>

      {/* 2. Access Codes Bento Grid: Front Door Code + Wi-Fi in Signature Reference Colors */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Card 1: Front Door Code (Buttercup Lime #E4E98E - Reference Bento) */}
        <div 
          onClick={copyDoorCode}
          className="p-4 rounded-[22px] sm:rounded-[24px] bg-[#E4E98E] text-[#0C1510] shadow-md border border-[#0C1510]/10 relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl cursor-pointer group active:scale-[0.97] flex flex-col justify-between h-[142px]"
        >
          {/* Background Architectural Watermark */}
          <div className="absolute -right-3 -bottom-3 pointer-events-none text-[#0C1510]/15 opacity-80">
            <TbilisiBalconySketch className="w-28 h-28" isDark={false} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 rounded-full border border-[#0C1510]/20 bg-[#0C1510]/10 text-[#0C1510] flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4 stroke-[2]" />
              </div>
              {doorCopied ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0C1510] text-[#E4E98E] flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{language === 'ka' ? 'დაკოპირდა' : 'Copied'}</span>
                </span>
              ) : (
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-[#0C1510]/60">
                  {language === 'ka' ? 'კოდი' : 'KEYPAD'}
                </span>
              )}
            </div>

            <span className="text-[11px] font-bold text-[#0C1510]/80 block tracking-tight">
              {language === 'ka' ? 'კარის კოდი' : language === 'ru' ? 'Код двери' : 'Front Door Code'}
            </span>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#0C1510] tracking-wide leading-none">
                {property.doorKeypadCode}
              </span>
              <Copy className="w-3.5 h-3.5 text-[#0C1510]/60 group-hover:text-[#0C1510] transition-colors" />
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1 text-[10px] font-semibold text-[#0C1510]/70">
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span>{language === 'ka' ? 'დააჭირეთ კოპირებისთვის' : 'Tap to copy code'}</span>
          </div>
        </div>

        {/* Card 2: Wi-Fi Network (Powder Blue #94B5D3 - Reference Bento) */}
        <div 
          onClick={copyWifi}
          className="p-4 rounded-[22px] sm:rounded-[24px] bg-[#94B5D3] text-[#0C1510] shadow-md border border-[#0C1510]/10 relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl cursor-pointer group active:scale-[0.97] flex flex-col justify-between h-[142px]"
        >
          {/* Background Architectural Watermark */}
          <div className="absolute -right-2 -bottom-2 pointer-events-none text-[#0C1510]/15 opacity-80">
            <TbilisiTowerSketch className="w-28 h-28" isDark={false} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 rounded-full border border-[#0C1510]/20 bg-[#0C1510]/10 text-[#0C1510] flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4 stroke-[2]" />
              </div>
              {wifiCopied ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0C1510] text-[#94B5D3] flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{language === 'ka' ? 'დაკოპირდა' : 'Copied'}</span>
                </span>
              ) : (
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-[#0C1510]/60">
                  {language === 'ka' ? 'ვაიფაი' : 'WI-FI'}
                </span>
              )}
            </div>

            <span className="text-[11px] font-bold text-[#0C1510]/80 block truncate tracking-tight">
              {language === 'ka' ? 'Wi-Fi ქსელი' : language === 'ru' ? 'Сеть Wi-Fi' : 'Wi-Fi Network'}
            </span>

            <div className="flex items-center gap-1 mt-0.5 min-w-0">
              <span className="font-mono text-sm sm:text-base font-black text-[#0C1510] tracking-tight leading-none truncate">
                {property.wifiNetwork || 'OldTbilisi_5G'}
              </span>
              <Copy className="w-3.5 h-3.5 shrink-0 text-[#0C1510]/60 group-hover:text-[#0C1510] transition-colors" />
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1 text-[10px] font-mono font-bold text-[#0C1510]/80 truncate">
            <span>Pass: {property.wifiPassword}</span>
          </div>
        </div>

      </div>

      {/* 3. Address Bar Card with Maps & Steps */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2.5 transition-all duration-300 ${
        isDark 
          ? 'bg-[#10171D] border-stone-800 text-stone-100 shadow-sm' 
          : 'bg-white border-stone-200/90 text-stone-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isDark ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-100 text-[#C26723]'
          }`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs sm:text-sm font-bold block truncate ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
              {property.address || '14 Lado Asatiani St.'}
            </span>
            <span className={`text-xs block truncate font-semibold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              {property.city}, {property.country}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
              isDark 
                ? 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-700' 
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
            }`}
          >
            <span>{language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Maps'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => {
              triggerHaptic();
              onOpenCheckinInstructions();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs bg-[#E5EDA8] hover:bg-[#d8e293] text-stone-950"
          >
            <span>{language === 'ka' ? 'ინსტრუქცია' : language === 'ru' ? 'Шаги' : 'Steps'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
