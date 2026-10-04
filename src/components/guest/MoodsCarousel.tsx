import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GemMood } from '../../types';

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

  const moods: { id: GemMood; emoji: string; labelEn: string; labelKa: string; labelRu: string }[] = [
    { id: 'hungry', emoji: '🍽️', labelEn: "I'm hungry", labelKa: "მშია", labelRu: "Голоден" },
    { id: 'coffee', emoji: '☕', labelEn: "Coffee fix", labelKa: "ყავა მინდა", labelRu: "Хочу кофе" },
    { id: 'authentic', emoji: '🥟', labelEn: "Best khinkali", labelKa: "ხინკალი", labelRu: "Хинкали" },
    { id: 'nearby', emoji: '📍', labelEn: "Nearby spots", labelKa: "ახლოს", labelRu: "Рядом" },
    { id: 'quiet', emoji: '🌿', labelEn: "Quiet & hidden", labelKa: "მყუდრო", labelRu: "Уютные места" },
    { id: 'romantic', emoji: '❤️', labelEn: "Romantic", labelKa: "რომანტიკული", labelRu: "Романтика" },
    { id: 'explore', emoji: '🏛️', labelEn: "Old courtyards", labelKa: "ძველი ეზოები", labelRu: "Дворики" },
    { id: 'cheap', emoji: '💰', labelEn: "Cheap & good", labelKa: "ბიუჯეტური", labelRu: "Бюджетно" },
    { id: 'nightlife', emoji: '🌙', labelEn: "Nightlife", labelKa: "ღამის ქალაქი", labelRu: "Ночная жизнь" },
  ];

  const handleMoodClick = (moodId: GemMood) => {
    triggerHaptic();
    onSelectMood(moodId);
  };

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E4E98E]" />
          <span className={`text-[11px] font-mono uppercase font-bold tracking-wider ${
            isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
            {language === 'ka' ? 'რისი განწყობა გაქვთ?' : language === 'ru' ? 'Какое настроение?' : 'What are you in the mood for?'}
          </span>
        </div>

        <button
          onClick={onViewAllGems}
          className="text-[11px] font-bold text-[#E4E98E] hover:underline flex items-center gap-0.5"
        >
          <span>{language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'View all'}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Horizontal Touch Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {moods.map(m => {
          const isSelected = activeMood === m.id;
          const label = language === 'ka' ? m.labelKa : language === 'ru' ? m.labelRu : m.labelEn;
          return (
            <button
              key={m.id}
              onClick={() => handleMoodClick(m.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all duration-200 active:scale-90 border shadow-xs ${
                isSelected
                  ? isDark 
                    ? 'bg-[#E4E98E] text-[#0A100D] border-[#E4E98E] font-bold shadow-md shadow-[#E4E98E]/15' 
                    : 'bg-stone-900 text-white border-stone-900 font-bold shadow-md'
                  : isDark 
                    ? 'bg-white/[0.05] backdrop-blur-md border-white/10 text-stone-300 hover:border-white/20 hover:bg-white/[0.08]' 
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <span className="text-sm">{m.emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
