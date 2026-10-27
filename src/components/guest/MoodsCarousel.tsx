import React, { useState } from 'react';
import {
  Coffee,
  Utensils,
  Sparkles,
  Compass,
  Heart,
  DollarSign,
  Moon,
  Leaf,
  Clock,
  MapPin,
} from 'lucide-react';
import { GemMood } from '../../types';
import { useApp } from '../../context/AppContext';

interface MoodsCarouselProps {
  selectedMood?: GemMood | 'all';
  onSelectMood?: (mood: GemMood | 'all') => void;
  language?: 'en' | 'ka' | 'ru';
  gemCounts?: Record<string, number>;
}

interface MoodCardConfig {
  id: GemMood | 'all';
  label: { en: string; ka: string; ru: string };
  subtitle: { en: string; ka: string; ru: string };
  icon: React.FC<{ className?: string }>;
  accentClass: string;
}

const MOOD_CARDS: MoodCardConfig[] = [
  {
    id: 'all',
    label: { en: 'All Curated', ka: 'ყველა რჩეული', ru: 'Все места' },
    subtitle: { en: 'Every host pick', ka: 'მასპინძლის სია', ru: 'Выбор хозяина' },
    icon: Sparkles,
    accentClass: 'text-[#F55A51] bg-[#F55A51]/10',
  },
  {
    id: 'hungry',
    label: { en: "I'm Hungry", ka: 'მშია', ru: 'Хочу поесть' },
    subtitle: { en: 'Khinkali, supra & dining', ka: 'ხინკალი და სუფრა', ru: 'Хинкали и кухня' },
    icon: Utensils,
    accentClass: 'text-[#F55A51] bg-[#F55A51]/12',
  },
  {
    id: 'coffee',
    label: { en: 'Slow Coffee', ka: 'ყავის დრო', ru: 'Время кофе' },
    subtitle: { en: 'Roasteries & bakeries', ka: 'ყავა და საცხობი', ru: 'Кофейни и пекарни' },
    icon: Coffee,
    accentClass: 'text-[#C87D4B] bg-[#C87D4B]/12',
  },
  {
    id: 'authentic',
    label: { en: 'Authentic Local', ka: 'ავთენტური', ru: 'Аутентичное' },
    subtitle: { en: 'True Georgian character', ka: 'ნამდვილი ქართული', ru: 'Грузинский колорит' },
    icon: Sparkles,
    accentClass: 'text-[#8C3B4A] bg-[#8C3B4A]/12',
  },
  {
    id: 'explore',
    label: { en: 'Walk & Explore', ka: 'სასეირნო', ru: 'Прогулка' },
    subtitle: { en: 'Courtyards & viewpoints', ka: 'ეზოები და ხედები', ru: 'Дворики и виды' },
    icon: Compass,
    accentClass: 'text-[#748C96] bg-[#748C96]/15',
  },
  {
    id: 'romantic',
    label: { en: 'Date Night', ka: 'რომანტიკული', ru: 'Романтика' },
    subtitle: { en: 'Wine bars & candlelit tables', ka: 'ღვინო და განწყობა', ru: 'Винные бары и уют' },
    icon: Heart,
    accentClass: 'text-[#F55A51] bg-[#F55A51]/12',
  },
  {
    id: 'quiet',
    label: { en: 'Quiet Escape', ka: 'მშვიდი გარემო', ru: 'Тихое место' },
    subtitle: { en: 'Gardens & calm corners', ka: 'ბაღები და სიმშვიდე', ru: 'Сады и спокойствие' },
    icon: Leaf,
    accentClass: 'text-[#2E7D32] bg-[#2E7D32]/12',
  },
  {
    id: 'nightlife',
    label: { en: 'After Dark', ka: 'ღამის ცხოვრება', ru: 'Вечерний город' },
    subtitle: { en: 'Cocktails & late spots', ka: 'ბარები და მუსიკა', ru: 'Коктейли и бары' },
    icon: Moon,
    accentClass: 'text-[#748C96] bg-[#748C96]/15',
  },
  {
    id: 'cheap',
    label: { en: 'Great Value', ka: 'ბიუჯეტური', ru: 'Бюджетно' },
    subtitle: { en: 'Beloved local favorites', ka: 'გემრიელი და ხელმისაწვდომი', ru: 'Вкусно и доступно' },
    icon: DollarSign,
    accentClass: 'text-[#2E7D32] bg-[#2E7D32]/12',
  },
  {
    id: 'quick',
    label: { en: 'Have 1–2 Hours', ka: '1–2 საათში', ru: 'На 1–2 часа' },
    subtitle: { en: 'Easy stops between plans', ka: 'სწრაფი ვიზიტი', ru: 'Короткая прогулка' },
    icon: Clock,
    accentClass: 'text-[#D99B26] bg-[#FFC757]/20',
  },
  {
    id: 'nearby',
    label: { en: 'Right Nearby', ka: 'სახლთან ახლოს', ru: 'Рядом с домом' },
    subtitle: { en: 'Short walk from your door', ka: 'ფეხით სავალზე', ru: 'В пешей доступности' },
    icon: MapPin,
    accentClass: 'text-[#F55A51] bg-[#F55A51]/12',
  },
];

export const MoodsCarousel: React.FC<MoodsCarouselProps> = ({
  selectedMood: propSelectedMood,
  onSelectMood: propOnSelectMood,
  language: propLanguage,
  gemCounts,
}) => {
  const { activeMood, setActiveMood, language: ctxLanguage } = useApp();
  const resolvedMood = propSelectedMood ?? activeMood;
  const resolvedOnSelect = propOnSelectMood ?? setActiveMood;
  const lang = propLanguage ?? ctxLanguage;

  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
            {lang === 'ka'
              ? 'რა განწყობაზე ხართ დღეს?'
              : lang === 'ru'
              ? 'Какое у вас сегодня настроение?'
              : 'What are you in the mood for?'}
          </h3>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F55A51]">
            {lang === 'ka'
              ? 'განწყობის მიხედვით'
              : lang === 'ru'
              ? 'По настроению'
              : 'By Mood'}
          </span>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-1 px-1 no-scrollbar">
        {MOOD_CARDS.map(card => {
          const Icon = card.icon;
          const isSelected = resolvedMood === card.id;
          const count = gemCounts ? gemCounts[card.id] : undefined;

          if (card.id !== 'all' && typeof count === 'number' && count === 0) {
            return null;
          }

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => resolvedOnSelect(card.id)}
              className={`shrink-0 w-44 p-3 rounded-2xl text-left transition-all border flex items-center gap-3 min-h-[68px] cursor-pointer ${
                isSelected
                  ? 'bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] border-[#1C1B1A] dark:border-[#F7F5F0] shadow-md'
                  : 'bg-white dark:bg-[#1F1E1C] text-[#1C1B1A] dark:text-[#F7F5F0] border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51]/40'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#F55A51] text-white' : card.accentClass
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-bold text-xs leading-snug truncate">{card.label[lang]}</p>
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-white/15 dark:bg-black/10 text-current'
                          : 'bg-[#FAF8F5] dark:bg-[#141312] text-[#7A756D] dark:text-[#A39E93]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] mt-0.5 line-clamp-1 ${
                    isSelected
                      ? 'text-[#F7F5F0]/75 dark:text-[#1C1B1A]/75'
                      : 'text-[#7A756D] dark:text-[#A39E93]'
                  }`}
                >
                  {card.subtitle[lang]}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
