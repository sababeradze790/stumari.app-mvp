import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Share,
  Share2
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
    setActiveExperience,
    isGuestFavorite,
    toggleGuestFavorite,
    guestFavoritesCount,
    showToast
  } = useApp();
  const isDark = theme === 'dark';

  const [selectedGem, setSelectedGem] = useState<StumariGem | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const handleShareGem = async (gem: StumariGem) => {
    triggerHaptic();
    const shareTitle = `${gem.title} — Tbilisi Recommendation`;
    const shareText = language === 'ka'
      ? `გამარჯობა! ნახე ეს ადგილი თბილისში: ${gem.title} (${gem.subtitle || ''}) - ${gem.mapsUrl}`
      : language === 'ru'
      ? `Привет! Посмотри это классное место в Тбилиси: ${gem.title} - ${gem.mapsUrl}`
      : `Check out ${gem.title} in Tbilisi: ${gem.mapsUrl}`;

    if (typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function') {
      try {
        await (navigator as any).share({
          title: shareTitle,
          text: shareText,
          url: gem.mapsUrl || (typeof window !== 'undefined' ? window.location.href : ''),
        });
        showToast(language === 'ka' ? 'გაზიარდა!' : 'Shared!');
        return;
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${gem.title}: ${gem.mapsUrl}`);
      showToast(language === 'ka' ? 'ლინკი დაკოპირდა!' : 'Link copied to clipboard!');
    }
  };

  const allGems = propertyGems && propertyGems.length > 0 ? propertyGems : gems;

  // Filter by Experience, Mood, and Favorites
  const filteredGems = allGems.filter(gem => {
    if (onlyFavorites && !isGuestFavorite(gem.id)) return false;
    const matchExperience = activeExperience === 'all' || gem.experience === activeExperience;
    const matchMood = activeMood === 'all' || gem.moods.includes(activeMood as GemMood);
    return matchExperience && matchMood;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300 tracking-tight">
      
      {/* Section Header */}
      <div className={`p-4 sm:p-5 rounded-xl border transition-all relative overflow-hidden shadow-sm ${
        isDark 
          ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
          : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
      }`}>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {language === 'ka' ? 'ადგილობრივი რეკომენდაციები' : language === 'ru' ? 'Местные секреты' : "Host's Local Secrets"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'ka' ? 'Stumari Gems — თბილისის საიდუმლო ადგილები' : language === 'ru' ? 'Stumari Gems — любимые места местных' : 'Stumari Gems — Curated Neighborhood Spots'}
          </h2>

          <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {language === 'ka'
              ? 'არანაირი ტურისტული კლიშეები. დააჭირეთ ბარათს სრული რჩევების სანახავად.'
              : language === 'ru'
              ? 'Нажмите на карточку, чтобы открыть секреты и советы от хозяина.'
              : 'Tap any spot to open personal tips, recommendations, and exact directions.'}
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
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`} />
            <span className={`text-xs font-mono uppercase font-semibold tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {language === 'ka' ? 'რისი განწყობა გაქვთ ახლა?' : language === 'ru' ? 'Какое у вас настроение?' : 'What are you in the mood for?'}
            </span>
          </div>
          {activeMood !== 'all' && (
            <button
              onClick={() => setActiveMood('all')}
              className={`text-xs font-medium hover:underline ${isDark ? 'text-zinc-300' : 'text-zinc-900'}`}
            >
              Reset ({activeMood})
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
          {MOOD_DEFINITIONS.map((m) => {
            const isSelected = activeMood === m.id;
            return (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => {
                  triggerHaptic();
                  setActiveMood(isSelected ? 'all' : m.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'bg-[#F55A51] text-white border-[#F55A51] font-semibold'
                    : isDark 
                      ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F] hover:border-[#3B3833] hover:text-[#F7F5F0]' 
                      : 'bg-white border-[#EBE6DF] text-[#5C5853] hover:bg-[#FAF8F5] hover:border-[#DDD8CF] hover:text-[#1C1B1A]'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. EXPERIENCE CATEGORIES HORIZONTAL PILL RAIL */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        
        {/* Saved Favorites Filter Pill */}
        {guestFavoritesCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => {
              triggerHaptic();
              setOnlyFavorites(!onlyFavorites);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
              onlyFavorites
                ? 'bg-[#F55A51] text-white border-[#F55A51] font-semibold'
                : isDark
                ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F55A51] hover:border-[#3B3833]'
                : 'bg-[#FDF1F0] border-[#F55A51]/30 text-[#C93E36] hover:bg-[#FCE5E3]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'fill-[#F55A51] text-[#F55A51]'}`} />
            <span>{language === 'ka' ? 'რჩეულები' : language === 'ru' ? 'Избранное' : 'Favorites'}</span>
            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
              onlyFavorites ? 'bg-white/20 text-white' : isDark ? 'bg-[#272522] text-[#F7F5F0]' : 'bg-[#FCE5E3] text-[#C93E36]'
            }`}>
              {guestFavoritesCount}
            </span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={() => {
            triggerHaptic();
            setOnlyFavorites(false);
            setActiveExperience('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 border cursor-pointer shadow-2xs ${
            !onlyFavorites && activeExperience === 'all'
              ? 'bg-[#F55A51] text-white border-[#F55A51]'
              : isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F] hover:text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#5C5853] hover:text-[#1C1B1A]'
          }`}
        >
          {language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'All'} ({allGems.length})
        </motion.button>

        {EXPERIENCE_CATEGORIES.map((cat) => {
          const isSelected = !onlyFavorites && activeExperience === cat.id;
          const count = allGems.filter(g => g.experience === cat.id).length;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => {
                triggerHaptic();
                setOnlyFavorites(false);
                setActiveExperience(isSelected ? 'all' : cat.id as GemExperience);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 border cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-[#F55A51] text-white border-[#F55A51] font-semibold'
                  : isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F] hover:text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#5C5853] hover:text-[#1C1B1A]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
                isSelected 
                  ? 'bg-white/20 text-white'
                  : isDark ? 'bg-[#272522] text-[#ACA79F]' : 'bg-[#F3EFE9] text-[#5C5853]'
              }`}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 3. COMPACT GEMS BENTO GRID (FAST, SCANNABLE, TAP FOR DETAILS) */}
      {filteredGems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredGems.map((gem, index) => {
            const isHostRec = gem.type === 'host' || gem.isHostFavorite;
            const isFav = isGuestFavorite(gem.id);

            return (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.2) }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic();
                  setSelectedGem(gem);
                }}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-warm-sm hover:shadow-warm-md ${
                  isDark 
                    ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#3B3833] text-[#F7F5F0]' 
                    : 'bg-white border-[#EBE6DF] hover:border-[#DDD8CF] text-[#1C1B1A]'
                }`}
              >
                <div>
                  {/* Photo with Overlay Badges */}
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-[#272522]">
                    <img
                      src={gem.image}
                      alt={gem.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
                      <div className="flex items-center gap-1 flex-wrap">
                        {isHostRec ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider uppercase bg-black/60 text-[#F7F5F0] border border-white/20 backdrop-blur-md shadow-2xs flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 fill-[#F55A51] text-[#F55A51]" />
                            <span>{hostName}'s Secret</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider uppercase bg-black/60 text-[#F7F5F0] border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5 text-[#FFC757]" />
                            <span>Stumari Gem</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-black/60 text-[#F7F5F0] border border-white/20 backdrop-blur-md">
                          {gem.priceLevel}
                        </span>

                        {/* Interactive Heart Button on Venue Card */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic();
                            toggleGuestFavorite(gem.id, gem.title);
                          }}
                          aria-label={isFav ? "Remove from saved places" : "Save place to favorites"}
                          title={isFav ? "Saved to favorites" : "Save to favorites"}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors shadow-2xs backdrop-blur-md border cursor-pointer ${
                            isFav 
                              ? 'bg-[#F55A51] text-white border-[#F55A51]' 
                              : 'bg-black/60 hover:bg-black/80 text-[#ACA79F] border-white/20 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isFav ? 'fill-white scale-110 text-white' : ''}`} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Distance Pill Bottom Right */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs text-[#F7F5F0] font-medium border border-white/20 shadow-2xs">
                      <MapPin className="w-3 h-3 text-[#748C96]" />
                      <span>{gem.distance}</span>
                    </div>
                  </div>

                  {/* Compact Card Title & Teaser */}
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-base font-serif font-bold leading-tight transition-colors truncate ${
                        isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                      }`}>
                        {gem.title}
                      </h3>
                      
                      {isFav && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#FDF1F0] dark:bg-[#F55A51]/15 text-[#F55A51] border border-[#F55A51]/30 shrink-0 flex items-center gap-0.5">
                          <Heart className="w-2.5 h-2.5 fill-current" />
                          <span>Saved</span>
                        </span>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-2 leading-relaxed font-normal ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                      {gem.subtitle}
                    </p>
                  </div>
                </div>

                {/* Compact Card Footer Affordance */}
                <div className={`px-3.5 py-2.5 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-[#2B2926] bg-[#141312]/60' : 'border-[#EBE6DF] bg-[#FAF8F5]'
                }`}>
                  <span className={`font-medium truncate max-w-[180px] ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                    {gem.bestTime ? `Best: ${gem.bestTime}` : gem.subCategory || 'Local Spot'}
                  </span>
                  <span className={`font-semibold flex items-center gap-1 shrink-0 ${isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'}`}>
                    <span>{language === 'ka' ? 'დეტალები' : language === 'ru' ? 'Подробнее' : 'Details'}</span>
                    <span className="text-sm font-semibold text-[#F55A51]">↗</span>
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border text-center space-y-3 shadow-warm-sm ${
          isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F]' : 'bg-white border-[#EBE6DF] text-[#5C5853]'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-xl border shadow-2xs ${
            isDark ? 'bg-[#272522] border-[#3B3833] text-[#FFC757]' : 'bg-[#FFF9ED] border-[#FFC757]/30 text-[#FFC757]'
          }`}>
            {onlyFavorites ? '❤️' : '🔍'}
          </div>
          <h4 className={`font-serif font-bold text-base tracking-tight ${isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'}`}>
            {onlyFavorites 
              ? (language === 'ka' ? 'რჩეულები ჯერ არ გაქვთ' : language === 'ru' ? 'Нет сохраненных мест' : 'No saved favorite places yet')
              : (language === 'ka' ? 'ადგილები ვერ მოიძებნა' : language === 'ru' ? 'Места не найдены' : 'No places match this mood')}
          </h4>
          <p className={`text-xs max-w-sm mx-auto leading-relaxed ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
            {onlyFavorites 
              ? (language === 'ka' 
                  ? 'დააჭირეთ გულს ნებისმიერ ადგილზე შესანახად და ისინი გამოჩნდება გაზიარებისას!' 
                  : language === 'ru'
                  ? 'Нажмите на сердечко у любого места, чтобы сохранить его в избранное!'
                  : 'Tap the heart on any venue or place to save it to your trip.')
              : `Try switching to another mood filter or reset to browse all ${allGems.length} curated local recommendations.`}
          </p>
          <button
            onClick={() => { setOnlyFavorites(false); setActiveMood('all'); setActiveExperience('all'); }}
            className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-all active:scale-95 bg-[#F55A51] hover:bg-[#E04840] text-white"
          >
            {onlyFavorites 
              ? (language === 'ka' ? 'ყველა ადგილის ნახვა' : language === 'ru' ? 'Все места' : 'Browse All Places')
              : 'Reset All Filters'}
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
          icon={selectedGem.type === 'host' ? <Heart className="w-4 h-4 text-[#F55A51] fill-[#F55A51]" /> : <Sparkles className="w-4 h-4 text-[#FFC757]" />}
          stickyBottomAction={
            <div className="flex items-center gap-2">
              <a
                href={selectedGem.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer bg-[#F55A51] hover:bg-[#E04840] text-white"
              >
                <Navigation className="w-4 h-4" />
                <span>{language === 'ka' ? 'მარშრუტი რუკაზე' : language === 'ru' ? 'Открыть в картах' : 'Get Directions'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              {/* Heart / Favorite Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  toggleGuestFavorite(selectedGem.id, selectedGem.title);
                }}
                className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                  isGuestFavorite(selectedGem.id)
                    ? 'bg-[#F55A51] text-white border-[#F55A51]'
                    : isDark 
                    ? 'border-[#2B2926] bg-[#1F1E1C] text-[#ACA79F] hover:text-[#F7F5F0]' 
                    : 'border-[#EBE6DF] bg-white text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
                title={isGuestFavorite(selectedGem.id) ? "Saved to favorites" : "Save to favorites"}
              >
                <Heart className={`w-4 h-4 ${isGuestFavorite(selectedGem.id) ? 'fill-white' : ''}`} />
                <span className="hidden sm:inline">{isGuestFavorite(selectedGem.id) ? 'Saved' : 'Save'}</span>
              </button>

              {/* Native Web Share Button for this Venue */}
              <button
                type="button"
                onClick={() => handleShareGem(selectedGem)}
                className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                  isDark ? 'border-[#2B2926] bg-[#1F1E1C] text-[#ACA79F] hover:text-[#F7F5F0]' : 'border-[#EBE6DF] bg-white text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
                title="Share place with friends"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            
            {/* Gem Photo Banner */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-warm-sm border border-black/10 dark:border-white/10">
              <img
                src={selectedGem.image}
                alt={selectedGem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 border border-white/20 text-[#F7F5F0] backdrop-blur-md">
                    {selectedGem.priceLevel}
                  </span>
                  <span className="text-xs font-mono font-medium text-[#F7F5F0] bg-black/60 px-2 py-0.5 rounded-md border border-white/20 backdrop-blur-md">
                    📍 {selectedGem.distance} · 🕐 {selectedGem.bestTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">{selectedGem.title}</h2>
                <p className="text-xs sm:text-sm text-[#DADADA] font-normal mt-0.5">{selectedGem.subtitle}</p>
              </div>
            </div>

            {/* Saba's Host Quote */}
            {selectedGem.hostQuote && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3.5 shadow-warm-sm ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <span className="text-xl shrink-0 mt-0.5">💬</span>
                <div className="space-y-1 min-w-0">
                  <span className={`text-[11px] font-sans uppercase font-semibold tracking-wider block ${
                    isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
                  }`}>
                    {hostName} says:
                  </span>
                  <p className="italic text-sm font-medium leading-relaxed font-serif">"{selectedGem.hostQuote}"</p>
                </div>
              </div>
            )}

            {/* Why We Recommend It */}
            <div className={`p-4 rounded-2xl border space-y-1.5 shadow-warm-sm ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
            }`}>
              <span className={`text-[11px] font-sans uppercase tracking-wider font-semibold block ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
                {language === 'ka' ? 'რატომ გვიყვარს ეს ადგილი' : language === 'ru' ? 'Почему мы рекомендуем' : 'Why We Recommend It'}
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                {selectedGem.whyWeRecommend}
              </p>
            </div>

            {/* What to Try / Highlights */}
            {selectedGem.whatToTry && selectedGem.whatToTry.length > 0 && (
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-warm-sm ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <span className={`text-[11px] font-sans uppercase tracking-wider font-semibold block ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
                  {language === 'ka' ? 'რა უნდა გასინჯოთ / ჰაილაითები:' : language === 'ru' ? 'Что попробовать:' : 'What to Try / Highlights:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedGem.whatToTry.map((item, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isDark ? 'bg-[#272522] border-[#3B3833] text-[#F7F5F0]' : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
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
              <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm shadow-warm-sm ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <Lightbulb className="w-4 h-4 text-[#FFC757] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <strong className={`block text-[11px] font-semibold uppercase font-sans tracking-wider ${
                    isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
                  }`}>
                    {language === 'ka' ? 'ადგილობრივი რჩევა:' : language === 'ru' ? 'Секрет от местных:' : 'Local Tip:'}
                  </strong>
                  <p className={`mt-0.5 text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
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
                className={`text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-[#ACA79F] hover:text-[#F7F5F0]' : 'text-[#5C5853] hover:text-[#1C1B1A]'
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
