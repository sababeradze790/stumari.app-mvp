import React from 'react';
import { motion } from 'motion/react';
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
    textLight: string;
    bgDark: string;
    borderDark: string;
    textDark: string;
  }[] = [
    { 
      id: 'hungry', 
      icon: (dark) => <Utensils className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${dark ? 'text-emerald-400' : 'text-[#1E3B2B]'}`} />, 
      labelEn: "I'm hungry", 
      labelKa: "მშია", 
      labelRu: "Голоден",
      bgLight: "bg-[#EAF3ED]",
      borderLight: "border-[#C9DEC2]",
      textLight: "text-[#1E3B2B]",
      bgDark: "bg-[#18231C]",
      borderDark: "border-emerald-600/35",
      textDark: "text-[#A7D0B7]"
    },
    { 
      id: 'coffee', 
      icon: (dark) => <Coffee className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${dark ? 'text-amber-400' : 'text-[#613D1C]'}`} />, 
      labelEn: "Coffee fix", 
      labelKa: "ყავა", 
      labelRu: "Кофе",
      bgLight: "bg-[#FAF1E4]",
      borderLight: "border-[#E8D4BA]",
      textLight: "text-[#613D1C]",
      bgDark: "bg-[#251E14]",
      borderDark: "border-amber-600/35",
      textDark: "text-[#E6CBA3]"
    },
    { 
      id: 'authentic', 
      icon: (dark) => <KhinkaliSketch className="w-4 h-4 sm:w-5 sm:h-5" isDark={dark} />, 
      labelEn: "Khinkali", 
      labelKa: "ხინკალი", 
      labelRu: "Хинкали",
      bgLight: "bg-[#FFF9EC]",
      borderLight: "border-[#F5DEAB]",
      textLight: "text-[#6B4F0B]",
      bgDark: "bg-[#252010]",
      borderDark: "border-[#FFC757]/35",
      textDark: "text-[#F5D88C]"
    },
    { 
      id: 'romantic', 
      icon: (dark) => <WineGlassSketch className="w-4 h-4 sm:w-5 sm:h-5" isDark={dark} />, 
      labelEn: "Wine bars", 
      labelKa: "ღვინო", 
      labelRu: "Вино",
      bgLight: "bg-[#FAEBF0]",
      borderLight: "border-[#EAC4D1]",
      textLight: "text-[#611A2E]",
      bgDark: "bg-[#26131A]",
      borderDark: "border-rose-600/35",
      textDark: "text-[#E6AAB9]"
    },
    { 
      id: 'explore', 
      icon: (dark) => <BinocularsSketch className="w-4 h-4 sm:w-5 sm:h-5" isDark={dark} />, 
      labelEn: "Secrets", 
      labelKa: "საიდუმლო", 
      labelRu: "Секреты",
      bgLight: "bg-[#EFF4F6]",
      borderLight: "border-[#CAD9DF]",
      textLight: "text-[#28414D]",
      bgDark: "bg-[#142027]",
      borderDark: "border-[#748C96]/35",
      textDark: "text-[#A1BDC9]"
    },
  ];

  const handleMoodClick = (moodId: GemMood) => {
    triggerHaptic();
    onSelectMood(moodId);
  };

  return (
    <div className="w-full space-y-2 select-none">
      {/* Header with clean typography */}
      <div className="flex items-center justify-between px-0.5">
        <span className={`text-[11px] font-sans font-semibold tracking-wider uppercase ${
          isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
        }`}>
          {language === 'ka' ? 'რისი განწყობა გაქვთ?' : language === 'ru' ? 'Какое настроение?' : 'WHAT ARE YOU IN THE MOOD FOR?'}
        </span>

        <button
          onClick={onViewAllGems}
          className={`text-xs font-medium hover:underline flex items-center gap-0.5 transition-colors cursor-pointer ${
            isDark ? 'text-[#F7F5F0] hover:text-white' : 'text-[#1C1B1A] hover:text-[#F55A51]'
          }`}
        >
          <span>{language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'View all'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Tactile Mood Filter Cards */}
      <div className="grid grid-cols-5 gap-2 pt-0.5 pb-1">
        {moods.map((m) => {
          const isSelected = activeMood === m.id;
          const label = language === 'ka' ? m.labelKa : language === 'ru' ? m.labelRu : m.labelEn;

          return (
            <motion.button
              key={m.id}
              onClick={() => handleMoodClick(m.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              className={`relative py-2 px-1 rounded-xl flex flex-col items-center justify-between transition-all duration-200 text-center cursor-pointer group h-[64px] sm:h-[68px] border select-none ${
                isSelected
                  ? isDark
                    ? `${m.bgDark} ${m.borderDark} ${m.textDark} ring-2 ring-[#F55A51] shadow-warm-md`
                    : `${m.bgLight} ${m.borderLight} ${m.textLight} ring-2 ring-[#F55A51] shadow-warm-md font-bold`
                  : isDark
                    ? `${m.bgDark} ${m.borderDark} ${m.textDark} opacity-90 hover:opacity-100 shadow-warm-sm`
                    : `${m.bgLight} ${m.borderLight} ${m.textLight} opacity-95 hover:opacity-100 shadow-warm-sm`
              }`}
            >
              {/* Sticker Icon */}
              <div className="flex-1 flex items-center justify-center shrink-0">
                {m.icon(isDark)}
              </div>

              {/* Sticker Label */}
              <span className={`text-[10px] sm:text-[11px] font-semibold leading-tight line-clamp-1 truncate w-full px-0.5 tracking-tight ${
                isDark ? m.textDark : m.textLight
              }`}>
                {label}
              </span>

              {/* Active Indicator Dot */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F55A51] border-2 border-white dark:border-[#141312] flex items-center justify-center shadow-xs" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
