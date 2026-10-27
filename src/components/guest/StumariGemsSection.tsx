import React, { useState, useMemo } from 'react';
import { StumariGem, GemMood, GemExperience, Property } from '../../types';
import {
  Sparkles,
  MapPin,
  Clock,
  Footprints,
  ExternalLink,
  Heart,
  Compass,
  Utensils,
  Wine,
  Leaf,
  Quote,
  Navigation,
  Copy,
  Check,
  MessageCircle,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { MoodsCarousel } from './MoodsCarousel';
import { useApp } from '../../context/AppContext';
import { safeCopyToClipboard } from '../../utils/clipboard';

export interface StumariGemsSectionProps {
  property?: Property;
  gems?: StumariGem[];
  hostName?: string;
  hostAvatar?: string;
  hostNote?: string;
  language?: 'en' | 'ka' | 'ru';
  favoriteIds?: string[];
  onToggleFavorite?: (id: string, title?: string) => void;
  hostWhatsApp?: string;
  isAccessUnlocked?: boolean;
  onOpenRequestModal?: () => void;
}

const EXPERIENCE_META: Record<
  GemExperience | 'all',
  {
    label: { en: string; ka: string; ru: string };
    icon: React.FC<{ className?: string }>;
  }
> = {
  all: {
    label: { en: 'All Categories', ka: 'ყველა კატეგორია', ru: 'Все категории' },
    icon: Compass,
  },
  eat: {
    label: { en: 'Eat & Supra', ka: 'სამზარეულო', ru: 'Кухня и супра' },
    icon: Utensils,
  },
  drink: {
    label: { en: 'Coffee & Wine', ka: 'ყავა და ღვინო', ru: 'Кофе и вино' },
    icon: Wine,
  },
  explore: {
    label: { en: 'Walks & Sights', ka: 'სასეირნო', ru: 'Прогулки и виды' },
    icon: Compass,
  },
  escape: {
    label: { en: 'Parks & Views', ka: 'ბაღები და ხედები', ru: 'Парки и панорамы' },
    icon: Leaf,
  },
  experience: {
    label: { en: 'Culture & Baths', ka: 'კულტურა', ru: 'Культура и бани' },
    icon: Sparkles,
  },
  local_life: {
    label: { en: 'Markets & Craft', ka: 'ბაზრობა და ხელნაკეთი', ru: 'Рынки и ремёсла' },
    icon: ShoppingBag,
  },
};

export const StumariGemsSection: React.FC<StumariGemsSectionProps> = ({
  property: propProperty,
  gems: propGems,
  hostName: propHostName,
  hostAvatar: propHostAvatar,
  hostNote,
  language: propLanguage,
  favoriteIds: propFavoriteIds,
  onToggleFavorite: propOnToggleFavorite,
  hostWhatsApp: propHostWhatsApp,
  isAccessUnlocked: propIsAccessUnlocked,
  onOpenRequestModal,
}) => {
  const {
    currentProperty,
    gems: ctxGems,
    language: ctxLanguage,
    guestFavorites,
    toggleGuestFavorite,
    isPropertyAccessUnlocked,
  } = useApp();

  const resolvedProperty = propProperty || currentProperty;
  const language = propLanguage || ctxLanguage;
  const hostName = propHostName || resolvedProperty.hostName;
  const hostAvatar = propHostAvatar || resolvedProperty.hostAvatar;
  const favoriteIds = propFavoriteIds ?? guestFavorites;
  const onToggleFavorite = propOnToggleFavorite ?? toggleGuestFavorite;
  const isAccessUnlocked =
    propIsAccessUnlocked !== undefined
      ? propIsAccessUnlocked
      : isPropertyAccessUnlocked(resolvedProperty);
  const hostWhatsApp =
    propHostWhatsApp !== undefined
      ? propHostWhatsApp
      : isAccessUnlocked
      ? resolvedProperty.hostWhatsApp
      : '';

  const gems = useMemo(() => {
    if (propGems) return propGems;
    const customList = resolvedProperty.customGems || [];
    const selectedIds = resolvedProperty.gemIds;
    const baseList =
      selectedIds && selectedIds.length > 0
        ? ctxGems.filter(g => selectedIds.includes(g.id))
        : ctxGems;
    const merged = [...customList];
    baseList.forEach(g => {
      if (!merged.some(m => m.id === g.id)) merged.push(g);
    });
    return merged;
  }, [propGems, resolvedProperty, ctxGems]);

  const [activeMood, setActiveMood] = useState<GemMood | 'all'>('all');
  const [activeExperience, setActiveExperience] = useState<GemExperience | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedGem, setSelectedGem] = useState<StumariGem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cleanHostWhatsApp = hostWhatsApp ? hostWhatsApp.replace(/[^0-9]/g, '') : '';
  const canDirectWhatsApp = Boolean(isAccessUnlocked && cleanHostWhatsApp);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = { all: gems.length };
    gems.forEach(gem => {
      gem.moods?.forEach(m => {
        counts[m] = (counts[m] || 0) + 1;
      });
    });
    return counts;
  }, [gems]);

  const filteredGems = useMemo(() => {
    return gems.filter(gem => {
      if (onlyFavorites && !favoriteIds.includes(gem.id)) return false;
      if (activeMood !== 'all' && !gem.moods?.includes(activeMood)) return false;
      if (activeExperience !== 'all' && gem.experience !== activeExperience) return false;
      return true;
    });
  }, [gems, activeMood, activeExperience, onlyFavorites, favoriteIds]);

  const hasActiveFilters =
    activeMood !== 'all' || activeExperience !== 'all' || onlyFavorites;

  const resetAllFilters = () => {
    setActiveMood('all');
    setActiveExperience('all');
    setOnlyFavorites(false);
  };

  const handleCopyAddress = async (gem: StumariGem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const ok = await safeCopyToClipboard(`${gem.title}, ${gem.address}`);
    if (ok) {
      setCopiedId(gem.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getNavigationUrl = (gem: StumariGem) => {
    if (gem.mapsUrl) return gem.mapsUrl;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${gem.title} ${gem.address}`
    )}`;
  };

  if (!gems || gems.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-center space-y-2">
        <Sparkles className="w-7 h-7 text-[#F55A51] mx-auto" />
        <h3 className="font-serif text-lg font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
          {language === 'ka'
            ? 'მასპინძლის რჩეული ადგილები მალე დაემატება'
            : language === 'ru'
            ? 'Рекомендации хозяина скоро появятся'
            : 'Host recommendations coming soon'}
        </h3>
        <p className="text-xs text-[#7A756D] dark:text-[#A39E93] max-w-md mx-auto">
          {language === 'ka'
            ? 'თქვენი მასპინძელი ამზადებს საყვარელი კაფეებისა და ადგილების სიას.'
            : language === 'ru'
            ? 'Хозяин готовит персональную подборку любимых мест поблизости.'
            : `${hostName} hasn't published neighborhood gems for this stay yet.`}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* Tier 4: Open Editorial Masthead on Canvas (No heavy outer box) */}
      <div className="pt-1 pb-4 border-b border-[#EBE6DF] dark:border-[#2B2926] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F55A51]/10 border border-[#F55A51]/20 text-[#F55A51] text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ka'
              ? 'სტუმარი გზამკვლევი'
              : language === 'ru'
              ? 'Гид от хозяина'
              : 'Curated by Your Host'}
          </div>

          {favoriteIds.length > 0 && (
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                onlyFavorites
                  ? 'bg-[#F55A51] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1F1E1C] text-[#1C1B1A] dark:text-[#F7F5F0] border border-[#EBE6DF] dark:border-[#2B2926]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : 'text-[#F55A51]'}`}
              />
              {language === 'ka'
                ? `შენახული (${favoriteIds.length})`
                : language === 'ru'
                ? `Избранное (${favoriteIds.length})`
                : `Saved (${favoriteIds.length})`}
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1C1B1A] dark:text-[#F7F5F0]">
              {language === 'ka'
                ? 'უბნის რჩეული ადგილები'
                : language === 'ru'
                ? 'Любимые места рядом'
                : `${hostName}’s Local Gems`}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5852] dark:text-[#A39E93] leading-relaxed max-w-2xl">
              {hostNote ||
                (language === 'ka'
                  ? `${hostName}-ის მიერ პირადად შერჩეული ადგილები — ტურისტული ხაფანგების გარეშე.`
                  : language === 'ru'
                  ? `Лично проверенные места от ${hostName} — без туристических ловушек.`
                  : `Handpicked places around your stay with personal ordering notes from ${hostName}.`)}
            </p>
          </div>

          {/* Host Byline Pill */}
          <div className="inline-flex items-center gap-2.5 self-start sm:self-auto px-3 py-1.5 rounded-full bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] shrink-0">
            {hostAvatar ? (
              <img
                src={hostAvatar}
                alt={hostName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#F55A51] text-white font-serif font-bold text-xs flex items-center justify-center">
                {hostName.charAt(0)}
              </div>
            )}
            <span className="text-xs text-[#7A756D] dark:text-[#A39E93]">
              {language === 'ka'
                ? 'ავტორი: '
                : language === 'ru'
                ? 'Автор: '
                : 'By '}
              <strong className="font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">{hostName}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Mood Filter Carousel */}
      <MoodsCarousel
        selectedMood={activeMood}
        onSelectMood={setActiveMood}
        language={language}
        gemCounts={moodCounts}
      />

      {/* Category Filter Row */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(Object.keys(EXPERIENCE_META) as Array<GemExperience | 'all'>).map(cat => {
            const meta = EXPERIENCE_META[cat];
            const Icon = meta.icon;
            const isActive = activeExperience === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveExperience(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border min-h-[40px] cursor-pointer ${
                  isActive
                    ? 'bg-[#F55A51] text-white border-[#F55A51] shadow-sm'
                    : 'bg-white dark:bg-[#1F1E1C] border-[#EBE6DF] dark:border-[#2B2926] text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-[#F7F5F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {meta.label[language]}
              </button>
            );
          })}
        </div>

        {/* Active Filter Summary Bar to prevent confusing intersection dead-ends */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs">
            <span className="text-[#7A756D] dark:text-[#A39E93] font-medium">
              {language === 'ka'
                ? `ნაჩვენებია ${filteredGems.length} / ${gems.length} ადგილი`
                : language === 'ru'
                ? `Показано ${filteredGems.length} из ${gems.length} мест`
                : `Showing ${filteredGems.length} of ${gems.length} places`}
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 font-bold text-[#F55A51] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {language === 'ka'
                ? 'ფილტრების გასუფთავება'
                : language === 'ru'
                ? 'Сбросить фильтры'
                : 'Clear filters'}
            </button>
          </div>
        )}
      </div>

      {/* Tier 2: Editorial Magazine Gems Grid (1 column on mobile, 2 columns on tablet/desktop) */}
      {filteredGems.length === 0 ? (
        <div className="p-8 rounded-3xl border border-dashed border-[#EBE6DF] dark:border-[#2B2926] bg-white/60 dark:bg-[#1F1E1C]/50 text-center space-y-3">
          <p className="text-sm font-medium text-[#7A756D] dark:text-[#A39E93]">
            {language === 'ka'
              ? 'არჩეული ფილტრებით ადგილები ვერ მოიძებნა.'
              : language === 'ru'
              ? 'По выбранным фильтрам мест не найдено.'
              : 'No places match both of your current filters.'}
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F55A51] text-white text-xs font-bold shadow-sm hover:bg-[#E04840] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {language === 'ka'
              ? 'ყველა ადგილის ნახვა'
              : language === 'ru'
              ? 'Показать все места'
              : 'Show All Places'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGems.map(gem => {
            const isFav = favoriteIds.includes(gem.id);
            const expMeta = EXPERIENCE_META[gem.experience] || EXPERIENCE_META.eat;

            return (
              <article
                key={gem.id}
                onClick={() => setSelectedGem(gem)}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-[#EBE6DF] dark:border-[#2B2926] bg-white dark:bg-[#1F1E1C] hover:border-[#F55A51]/50 transition-all shadow-[0_10px_32px_-14px_rgba(28,27,26,0.08)] dark:shadow-none flex flex-col justify-between"
              >
                <div>
                  {/* Editorial Photo Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141312]">
                    <img
                      src={gem.image}
                      alt={gem.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                          {expMeta.label[language]}
                        </span>
                        {gem.distance && (
                          <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                            <Footprints className="w-3 h-3 text-[#FFC757]" />
                            {gem.distance}
                          </span>
                        )}
                        {gem.priceLevel && (
                          <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[#FFC757] text-[11px] font-bold">
                            {gem.priceLevel}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onToggleFavorite(gem.id, gem.title);
                        }}
                        aria-label={isFav ? 'Remove from saved' : 'Save place'}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                          isFav
                            ? 'bg-[#F55A51] text-white shadow-md'
                            : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      {gem.subCategory && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFC757] block mb-0.5">
                          {gem.subCategory}
                        </span>
                      )}
                      <h3 className="text-xl font-serif font-bold leading-snug">{gem.title}</h3>
                      <p className="text-xs text-white/85 line-clamp-1 mt-0.5">{gem.subtitle}</p>
                    </div>
                  </div>

                  {/* Card Body: Unboxed Editorial Pull-Quote + What to Try */}
                  <div className="p-5 pb-3.5 space-y-3">
                    <blockquote className="border-l-2 border-[#F55A51] pl-3.5 py-0.5 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F55A51] block">
                        {language === 'ka'
                          ? `${hostName}-ის რჩევა`
                          : language === 'ru'
                          ? `Совет от ${hostName}`
                          : `${hostName}’s Note`}
                      </span>
                      <p className="text-xs sm:text-sm italic text-[#1C1B1A] dark:text-[#F7F5F0] leading-relaxed line-clamp-2">
                        “{gem.hostQuote || gem.localTip || gem.whyWeRecommend}”
                      </p>
                    </blockquote>

                    {gem.whatToTry && gem.whatToTry.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] mr-0.5">
                          {language === 'ka' ? 'გასინჯეთ:' : language === 'ru' ? 'Попробуйте:' : 'Try:'}
                        </span>
                        {gem.whatToTry.slice(0, 3).map((dish, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#141312] text-[11px] font-semibold text-[#5C5852] dark:text-[#A39E93]"
                          >
                            {dish}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Footer Bar */}
                <div className="px-5 py-3.5 border-t border-[#EBE6DF]/70 dark:border-[#2B2926]/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A756D] dark:text-[#A39E93] min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#F55A51] shrink-0" />
                    <span className="truncate">{gem.address}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={getNavigationUrl(gem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold hover:opacity-90 transition-opacity min-h-[36px]"
                    >
                      <Navigation className="w-3 h-3 text-[#F55A51]" />
                      {language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Map'}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detailed Gem Sheet / Dialog */}
      <MobileBottomSheet
        isOpen={!!selectedGem}
        onClose={() => setSelectedGem(null)}
        title={selectedGem ? selectedGem.title : ''}
      >
        {selectedGem && (
          <div className="space-y-5 pb-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#141312]">
              <img
                src={selectedGem.image}
                alt={selectedGem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                <div>
                  {selectedGem.subCategory && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFC757] block">
                      {selectedGem.subCategory}
                    </span>
                  )}
                  <p className="text-xs text-white/90 font-medium mt-0.5">{selectedGem.subtitle}</p>
                </div>
                {selectedGem.distance && (
                  <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-xs font-bold flex items-center gap-1 shrink-0">
                    <Footprints className="w-3.5 h-3.5 text-[#FFC757]" />
                    {selectedGem.distance}
                  </span>
                )}
              </div>
            </div>

            {/* Why We Recommend & Host Insider Tip */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F55A51]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#F55A51]">
                  {language === 'ka'
                    ? `${hostName}-ის რჩევა`
                    : language === 'ru'
                    ? `Совет от ${hostName}`
                    : `${hostName}'s Insider Tip`}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#1C1B1A] dark:text-[#F7F5F0]">
                {selectedGem.whyWeRecommend}
              </p>
              {selectedGem.localTip && (
                <p className="text-xs italic text-[#5C5852] dark:text-[#A39E93] pt-1">
                  “{selectedGem.localTip}”
                </p>
              )}
            </div>

            {/* What to Try / Best Time */}
            {((selectedGem.whatToTry && selectedGem.whatToTry.length > 0) ||
              selectedGem.bestTime) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedGem.whatToTry && selectedGem.whatToTry.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A756D] dark:text-[#A39E93] block mb-1.5">
                      {language === 'ka'
                        ? 'რა გავსინჯოთ'
                        : language === 'ru'
                        ? 'Что попробовать'
                        : 'What to Try'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGem.whatToTry.map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-semibold text-[#1C1B1A] dark:text-[#F7F5F0]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGem.bestTime && (
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A756D] dark:text-[#A39E93] block mb-1">
                      {language === 'ka'
                        ? 'საუკეთესო დრო'
                        : language === 'ru'
                        ? 'Лучшее время'
                        : 'Best Time to Visit'}
                    </span>
                    <p className="text-xs font-semibold text-[#1C1B1A] dark:text-[#F7F5F0] leading-relaxed flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#F55A51] shrink-0" />
                      {selectedGem.bestTime}
                    </p>
                    {selectedGem.timeNeeded && (
                      <p className="text-[11px] text-[#7A756D] dark:text-[#A39E93] mt-1">
                        {selectedGem.timeNeeded}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Address + Copy */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin className="w-4 h-4 text-[#F55A51] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                    {language === 'ka' ? 'მისამართი' : language === 'ru' ? 'Адрес' : 'Address'}
                  </span>
                  <p className="text-xs font-semibold text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                    {selectedGem.address}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={e => handleCopyAddress(selectedGem, e)}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copiedId === selectedGem.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                    {language === 'ka' ? 'დაკოპირდა' : language === 'ru' ? 'Скопировано' : 'Copied'}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                    {language === 'ka' ? 'კოპირება' : language === 'ru' ? 'Копировать' : 'Copy'}
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={getNavigationUrl(selectedGem)}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 sm:col-span-1 py-3.5 px-4 rounded-2xl bg-[#F55A51] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#E04840] transition-colors min-h-[46px]"
              >
                <Navigation className="w-4 h-4" />
                {language === 'ka'
                  ? 'Google Maps-ში გახსნა'
                  : language === 'ru'
                  ? 'Открыть в Google Maps'
                  : 'Open in Google Maps'}
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>

              <div className="col-span-2 sm:col-span-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(selectedGem.id, selectedGem.title)}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all min-h-[46px] cursor-pointer ${
                    favoriteIds.includes(selectedGem.id)
                      ? 'bg-[#F55A51]/10 border-[#F55A51]/30 text-[#F55A51]'
                      : 'bg-white dark:bg-[#1F1E1C] border-[#EBE6DF] dark:border-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoriteIds.includes(selectedGem.id) ? 'fill-current text-[#F55A51]' : ''
                    }`}
                  />
                  {favoriteIds.includes(selectedGem.id)
                    ? language === 'ka'
                      ? 'შენახულია'
                      : language === 'ru'
                      ? 'Сохранено'
                      : 'Saved'
                    : language === 'ka'
                    ? 'შენახვა'
                    : language === 'ru'
                    ? 'Сохранить'
                    : 'Save Spot'}
                </button>
              </div>
            </div>

            {/* Ask Host About This Place — Properly wired to real host WhatsApp (when unlocked) or Request Modal */}
            {(canDirectWhatsApp || onOpenRequestModal) && (
              <div className="pt-2 border-t border-[#EBE6DF] dark:border-[#2B2926]">
                {canDirectWhatsApp ? (
                  <a
                    href={`https://wa.me/${cleanHostWhatsApp}?text=${encodeURIComponent(
                      `Hi ${hostName}! Quick question about your recommendation "${selectedGem.title}"...`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1F1E1C] hover:bg-[#F4F1EA] dark:hover:bg-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0] text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#EBE6DF] dark:border-[#2B2926]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    {language === 'ka'
                      ? `ჰკითხეთ ${hostName}-ს ამ ადგილის შესახებ`
                      : language === 'ru'
                      ? `Спросить ${hostName} об этом месте`
                      : `Have a question about this place? Ask ${hostName}`}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGem(null);
                      onOpenRequestModal?.();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1F1E1C] hover:bg-[#F4F1EA] dark:hover:bg-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0] text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#EBE6DF] dark:border-[#2B2926] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F55A51]" />
                    {language === 'ka'
                      ? `ჰკითხეთ ${hostName}-ს ამ ადგილის შესახებ`
                      : language === 'ru'
                      ? `Спросить ${hostName} об этом месте`
                      : `Have a question about this place? Ask ${hostName}`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </MobileBottomSheet>
    </section>
  );
};
