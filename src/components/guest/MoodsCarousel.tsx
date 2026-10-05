import React from 'react';
import { ChevronRight, Utensils, Coffee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GemMood } from '../../types';
import { KhinkaliSketch, WineGlassSketch, BinocularsSketch } from './GuestGuideIllustrations';

interface MoodsCarouselProps {
  onSelectMood: (mood: GemMood) => void;
  onViewAllGems: () => void;
}

export const MoodsCarousel: React.FC<MoodsCarouselProps> = ({
  onSelectMood,
  onViewAllGems
}) => {
  const { theme, language, activeMood } = useApp();
  const isDark = theme === 'dark';

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const moods: { 
    id: GemMood; 
    icon: (isDark: boolean) => React.ReactNode; 
    labelEn: string; 
    labelKa: string; 
    labelRu: string;
    bgLight: string;
    borderLight: string;
    bgDark: string;
    borderDark: string;
    textDark: string;
  }[] = [
    { 
      id: 'hungry', 
      icon: (dark) => <Utensils className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${dark ? 'text-emerald-400' : 'text-[#0C1510]'}`} />, 
      labelEn: "I'm hungry", 
      labelKa: "მშია", 
      labelRu: "Голоден",
      bgLight: "bg-[#A8D5BA]",
      borderLight: "border-[#8EC7A3]",
      bgDark: "bg-[#0E2417]",
      borderDark: "border-emerald-500/35",
      textDark: "text-emerald-200"
    },
    { 
      id: 'coffee', 
      icon: (dark) => <Coffee className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${dark ? 'text-amber-400' : 'text-[#0C1510]'}`} />, 
      labelEn: "Coffee fix", 
      labelKa: "ყავა", 
      labelRu: "Кофе",
      bgLight: "bg-[#E5C6A0]",
      borderLight: "border-[#D6AF80]",
      bgDark: "bg-[#24170D]",
      borderDark: "border-amber-500/35",
      textDark: "text-amber-200"
    },
    { 
      id: 'authentic', 
      icon: (dark) => <KhinkaliSketch className="w-4 h-4 sm:w-5 sm:h-5" isDark={dark} />, 
      labelEn: "Khinkali", 
      labelKa: "ხინკალი", 
      labelRu: "Хинкали",
      bgLight: "bg-[#E4E98E]",
      borderLight: "border-[#CCD36B]",
      bgDark: "bg-[#1E220D]",
      borderDark: "border-lime-500/35",
      textDark: "text-lime-200"
    },
    { 
      id: 'romantic', 
      icon: (dark) => <WineGlassSketch className="w-4 h-4 sm:w-5 sm:h-5" isDark={dark} />, 
      labelEn: "Wine bars", 
      labelKa: "ღვინო", 
      labelRu: "Вино",
      bgLight: "bg-[#E8BDC8]",
      borderLight: "border-[#D9A2AF]",
      bgDark: "bg-[#280F18]",
      borderDark: "border-rose-500/35",
      textDark: "text-rose-200"
    },
    { 
      id: 'explore', 
      icon: (dark) => <BinocularsSketch className="w-4 h-4 sm:w-5 sm:h-5" isDark={dark} />, 
      labelEn: "Secrets", 
      labelKa: "საიდუმლო", 
      labelRu: "Секреты",
      bgLight: "bg-[#94B5D3]",
      borderLight: "border-[#7CA6CC]",
      bgDark: "bg-[#0E1E2E]",
      borderDark: "border-sky-500/35",
      textDark: "text-sky-200"
    },
  ];

  const handleMoodClick = (moodId: GemMood) => {
    triggerHaptic();
    onSelectMood(moodId);
  };

  return (
    <div className="w-full space-y-1.5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-mono uppercase font-black tracking-wider text-stone-900 dark:text-stone-300">
          {language === 'ka' ? 'რისი განწყობა გაქვთ?' : language === 'ru' ? 'Какое настроение?' : 'WHAT ARE YOU IN THE MOOD FOR?'}
        </span>

        <button
          onClick={onViewAllGems}
          className="text-[11px] font-black text-stone-950 dark:text-[#E4E98E] hover:underline flex items-center gap-0.5"
        >
          <span>{language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'View all'}</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* 5 Vertical Pastel Mood Cards (Smaller & Sleeker) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {moods.map(m => {
          const isSelected = activeMood === m.id;
          const label = language === 'ka' ? m.labelKa : language === 'ru' ? m.labelRu : m.labelEn;
          return (
            <button
              key={m.id}
              onClick={() => handleMoodClick(m.id)}
              className={`py-1 px-1 rounded-xl flex flex-col items-center justify-between transition-all duration-300 hover:translate-y-[-2px] active:scale-95 border h-[60px] sm:h-[64px] text-center cursor-pointer group shadow-2xs ${
                isSelected
                  ? isDark 
                    ? 'ring-2 ring-[#E4E98E] bg-[#1E2510] border-[#E4E98E] shadow-md' 
                    : 'ring-2 ring-stone-950 bg-white border-stone-950 shadow-md'
                  : isDark 
                    ? `${m.bgDark} ${m.borderDark} text-stone-100 hover:border-white/40 shadow-2xs hover:shadow-xs` 
                    : `${m.bgLight} ${m.borderLight} text-[#0C1510] shadow-2xs hover:shadow-xs`
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                {m.icon(isDark)}
              </div>
              <span className={`text-[9.5px] sm:text-[10px] font-black leading-tight line-clamp-1 truncate w-full px-0.5 tracking-tight ${
                isDark ? (isSelected ? 'text-[#E4E98E]' : m.textDark) : 'text-[#0C1510]'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
