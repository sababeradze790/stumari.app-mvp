import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  Compass, 
  ExternalLink, 
  Heart, 
  Star, 
  Lightbulb, 
  Utensils, 
  Coffee, 
  Navigation,
  Check,
  ChevronRight,
  MessageCircle,
  Share
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StumariGem, GemExperience, GemMood } from '../../types';
import { MOOD_DEFINITIONS, EXPERIENCE_CATEGORIES } from '../../data/stumariGemsData';
import { MobileBottomSheet } from './MobileBottomSheet';

interface StumariGemsSectionProps {
  hostName?: string;
  hostAvatar?: string;
  propertyGems?: StumariGem[];
}

export const StumariGemsSection: React.FC<StumariGemsSectionProps> = ({ 
  hostName = 'Saba', 
  hostAvatar,
  propertyGems 
}) => {
  const { 
    theme, 
    language, 
    gems, 
    activeMood, 
    setActiveMood, 
    activeExperience, 
    setActiveExperience 
  } = useApp();
  const isDark = theme === 'dark';

  const [selectedGem, setSelectedGem] = useState<StumariGem | null>(null);

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const allGems = propertyGems && propertyGems.length > 0 ? propertyGems : gems;

  // Filter by Experience and Mood
  const filteredGems = allGems.filter(gem => {
    const matchExperience = activeExperience === 'all' || gem.experience === activeExperience;
    const matchMood = activeMood === 'all' || gem.moods.includes(activeMood as GemMood);
    return matchExperience && matchMood;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <div className={`p-5 rounded-[28px] border transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent backdrop-blur-md border-white/10 ring-1 ring-white/5' 
          : 'bg-gradient-to-br from-[#F4F7EB]/80 via-[#EDF3EF]/60 to-white border-stone-200/90 shadow-xs'
      }`}>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E4E98E] animate-pulse" />
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-[#E4E98E]' : 'text-amber-700'
            }`}>
              {language === 'ka' ? 'ადგილობრივი რეკომენდაციები' : language === 'ru' ? 'Местные секреты' : "Host's Local Secrets"}
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'ka' ? 'Stumari Gems — თბილისის საიდუმლო ადგილები' : language === 'ru' ? 'Stumari Gems — любимые места местных' : 'Stumari Gems — Places We’d Recommend to a Friend'}
          </h2>

          <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            {language === 'ka'
              ? 'არანაირი ტურისტული კლიშეები. დააჭირეთ ბარათს სრული რჩევების სანახავად.'
              : language === 'ru'
              ? 'Нажмите на карточку, чтобы открыть секреты и советы от хозяина.'
              : 'Tap any spot to open Saba’s personal tips, what to order, and exact directions.'}
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-9xl">
          🇬🇪
        </div>
      </div>

      {/* 1. "WHAT ARE YOU IN THE MOOD FOR?" INTERACTIVE FILTER BAR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#E4E98E]' : 'text-amber-600'}`} />
            <span className={`text-xs font-mono uppercase font-black tracking-wider ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
              {language === 'ka' ? 'რისი განწყობა გაქვთ ახლა?' : language === 'ru' ? 'Какое у вас настроение?' : 'What are you in the mood for?'}
            </span>
          </div>
          {activeMood !== 'all' && (
            <button
              onClick={() => setActiveMood('all')}
              className={`text-xs font-bold hover:underline ${isDark ? 'text-[#E4E98E]' : 'text-stone-950'}`}
            >
              Reset ({activeMood})
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
          {MOOD_DEFINITIONS.map((m) => {
            const isSelected = activeMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  triggerHaptic();
                  setActiveMood(isSelected ? 'all' : m.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-2xs ${
                  isSelected
                    ? isDark 
                      ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E] font-black shadow-sm' 
                      : 'bg-stone-950 text-white border-stone-950 font-black shadow-sm'
                    : isDark 
                      ? 'bg-stone-900/90 border-stone-700/80 text-stone-200 hover:border-stone-500' 
                      : 'bg-white border-stone-300 text-stone-900 hover:bg-stone-100 hover:border-stone-400'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXPERIENCE CATEGORIES HORIZONTAL PILL RAIL */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        <button
          onClick={() => {
            triggerHaptic();
            setActiveExperience('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 border ${
            activeExperience === 'all'
              ? isDark ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E] shadow-xs' : 'bg-stone-950 text-white border-stone-950 shadow-xs'
              : isDark ? 'bg-stone-900/80 border-stone-800 text-stone-300 hover:text-white' : 'bg-white border-stone-300 text-stone-800 hover:text-stone-950 hover:bg-stone-100'
          }`}
        >
          {language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'All'} ({allGems.length})
        </button>

        {EXPERIENCE_CATEGORIES.map((cat) => {
          const isSelected = activeExperience === cat.id;
          const count = allGems.filter(g => g.experience === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic();
                setActiveExperience(isSelected ? 'all' : cat.id as GemExperience);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? isDark ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E] font-black shadow-xs' : 'bg-stone-950 text-white border-stone-950 font-black shadow-xs'
                  : isDark ? 'bg-stone-900/80 border-stone-800 text-stone-300 hover:text-white' : 'bg-white border-stone-300 text-stone-800 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                isSelected 
                  ? isDark ? 'bg-[#0C1510]/20 text-[#0C1510]' : 'bg-white/20 text-white'
                  : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-800'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. COMPACT GEMS BENTO GRID (FAST, SCANNABLE, TAP FOR DETAILS) */}
      {filteredGems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredGems.map((gem) => {
            const isHostRec = gem.type === 'host' || gem.isHostFavorite;

            return (
              <div
                key={gem.id}
                onClick={() => {
                  triggerHaptic();
                  setSelectedGem(gem);
                }}
                className={`rounded-[24px] border overflow-hidden transition-all duration-300 hover:translate-y-[-4px] active:scale-[0.98] cursor-pointer group flex flex-col justify-between ${
                  isDark 
                    ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md border-white/10 hover:border-[#E4E98E]/50 shadow-md hover:shadow-2xl hover:shadow-black/60 ring-1 ring-white/5 text-stone-100' 
                    : 'bg-white border-stone-300/80 hover:border-stone-500 text-stone-900 shadow-sm hover:shadow-xl hover:shadow-stone-300/60'
                }`}
              >
                <div>
                  {/* Photo with Overlay Badges */}
                  <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img
                      src={gem.image}
                      alt={gem.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {isHostRec ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#E4E98E] text-[#0C1510] shadow-sm flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 fill-[#0C1510]" />
                            <span>{hostName}'s Secret</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-black/80 text-stone-100 border border-white/15 backdrop-blur-md flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-[#E4E98E]" />
                            <span>Stumari Gem</span>
                          </span>
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-black/80 text-amber-300 border border-white/10 backdrop-blur-md">
                        {gem.priceLevel}
                      </span>
                    </div>

                    {/* Distance Pill Bottom Right */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-xs text-white font-bold border border-white/15">
                      <MapPin className="w-3 h-3 text-[#E4E98E]" />
                      <span>{gem.distance}</span>
                    </div>
                  </div>

                  {/* Compact Card Title & Teaser */}
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-serif text-base sm:text-lg font-bold leading-tight transition-colors truncate ${
                        isDark ? 'text-white group-hover:text-[#E4E98E]' : 'text-stone-950 group-hover:text-emerald-700'
                      }`}>
                        {gem.title}
                      </h3>
                      <ChevronRight className={`w-4 h-4 transition-all shrink-0 mt-0.5 group-hover:translate-x-1 ${
                        isDark ? 'text-stone-400 group-hover:text-[#E4E98E]' : 'text-stone-500 group-hover:text-stone-950'
                      }`} />
                    </div>
                    <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {gem.subtitle}
                    </p>
                  </div>
                </div>

                {/* Compact Card Footer Affordance */}
                <div className={`px-4 py-2.5 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-white/10 bg-white/[0.03] backdrop-blur-xs' : 'border-stone-200 bg-stone-50/90'
                }`}>
                  <span className={`font-bold truncate max-w-[180px] ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>
                    {gem.bestTime ? `Best: ${gem.bestTime}` : gem.subCategory || 'Local Spot'}
                  </span>
                  <span className={`font-black flex items-center gap-1 shrink-0 ${isDark ? 'text-[#E4E98E]' : 'text-stone-950'}`}>
                    <span>{language === 'ka' ? 'დეტალები' : language === 'ru' ? 'Секреты' : 'Details'}</span>
                    <span className="text-sm font-bold">↗</span>
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className={`p-8 rounded-[28px] border text-center space-y-3 ${
          isDark ? 'bg-[#0E1317] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600'
        }`}>
          <div className="w-12 h-12 rounded-full bg-stone-800/50 flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <h4 className="font-serif font-bold text-base text-white">No places match this mood</h4>
          <p className="text-xs max-w-sm mx-auto">
            Try switching to another mood filter or reset to browse all {allGems.length} curated local recommendations.
          </p>
          <button
            onClick={() => { setActiveMood('all'); setActiveExperience('all'); }}
            className="px-5 py-2 rounded-full text-xs font-bold bg-[#E4E98E] text-[#0C1510] active:scale-95"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* GEM DETAIL MOBILE BOTTOM SHEET (FULL INFO OPENS ON TAP)          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {selectedGem && (
        <MobileBottomSheet
          isOpen={!!selectedGem}
          onClose={() => setSelectedGem(null)}
          title={selectedGem.title}
          subtitle={`${selectedGem.subCategory || 'Curated Secret'} · ${selectedGem.distance}`}
          icon={selectedGem.type === 'host' ? <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> : <Sparkles className="w-4 h-4 text-[#E4E98E]" />}
          stickyBottomAction={
            <div className="flex items-center gap-2">
              <a
                href={selectedGem.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] shadow-md active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>{language === 'ka' ? 'მარშრუტი რუკაზე' : language === 'ru' ? 'Открыть в картах' : 'Get Directions'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${selectedGem.title} in Tbilisi: ${selectedGem.mapsUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-3 px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isDark ? 'border-stone-800 bg-stone-800 text-stone-200 hover:bg-stone-750' : 'border-stone-200 bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
                title="Share recommendation"
              >
                <Share className="w-4 h-4" />
              </a>
            </div>
          }
        >
          <div className="space-y-4">
            
            {/* Gem Photo Banner */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-md">
              <img
                src={selectedGem.image}
                alt={selectedGem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4E98E] text-[#0C1510]">
                    {selectedGem.priceLevel}
                  </span>
                  <span className="text-xs font-mono font-bold text-white/95 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    📍 {selectedGem.distance} · 🕐 {selectedGem.bestTime}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">{selectedGem.title}</h2>
                <p className="text-xs sm:text-sm text-stone-200 font-medium mt-0.5">{selectedGem.subtitle}</p>
              </div>
            </div>

            {/* Saba's Host Quote */}
            {selectedGem.hostQuote && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3.5 shadow-xs ${
                isDark ? 'bg-amber-950/30 border-amber-500/30 text-amber-100' : 'bg-amber-50 border-amber-300 text-stone-950'
              }`}>
                <span className="text-2xl shrink-0 mt-0.5">💬</span>
                <div className="space-y-1 min-w-0">
                  <span className="text-xs font-mono uppercase font-black tracking-wider block text-amber-600 dark:text-amber-400">
                    {hostName} says:
                  </span>
                  <p className="italic text-sm sm:text-base font-semibold leading-relaxed">"{selectedGem.hostQuote}"</p>
                </div>
              </div>
            )}

            {/* Why We Recommend It */}
            <div className={`p-4 rounded-2xl border space-y-2 shadow-xs ${
              isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200'
            }`}>
              <span className={`text-xs font-mono uppercase tracking-wider font-black block ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
                {language === 'ka' ? 'რატომ გვიყვარს ეს ადგილი' : language === 'ru' ? 'Почему мы рекомендуем' : 'Why We Recommend It'}
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                {selectedGem.whyWeRecommend}
              </p>
            </div>

            {/* What to Try / Highlights */}
            {selectedGem.whatToTry && selectedGem.whatToTry.length > 0 && (
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${
                isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <span className={`text-xs font-mono uppercase tracking-wider font-black block ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
                  {language === 'ka' ? 'რა უნდა გასინჯოთ / ჰაილაითები:' : language === 'ru' ? 'Что попробовать:' : 'What to Try / Highlights:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedGem.whatToTry.map((item, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        isDark ? 'bg-stone-800 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-950 shadow-2xs'
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Local Insider Tip */}
            {selectedGem.localTip && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm shadow-xs ${
                isDark ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-stone-950'
              }`}>
                <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <strong className="text-emerald-700 dark:text-emerald-400 block text-xs font-black uppercase font-mono tracking-wider">
                    {language === 'ka' ? 'ადგილობრივი რჩევა:' : language === 'ru' ? 'Секрет от местных:' : 'Local Tip:'}
                  </strong>
                  <p className={`mt-1 text-xs sm:text-sm leading-relaxed font-semibold ${isDark ? 'text-emerald-100' : 'text-emerald-950'}`}>
                    {selectedGem.localTip}
                  </p>
                </div>
              </div>
            )}

            {/* Host Assistance on WhatsApp */}
            <div className="pt-1 text-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi ${hostName}, I have a question about visiting ${selectedGem.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-stone-300 hover:text-[#E4E98E]' : 'text-stone-800 hover:text-stone-950'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Have a question about this place? Ask {hostName}</span>
              </a>
            </div>

          </div>
        </MobileBottomSheet>
      )}

    </div>
  );
};
