import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Coffee,
  Utensils,
  Wine,
  ShoppingBag,
  Compass,
  Heart,
  Home,
  Copy,
  Check,
  Footprints,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Property, StumariGem } from '../../types';
import { useApp } from '../../context/AppContext';
import { safeCopyToClipboard } from '../../utils/clipboard';

export interface OfflineGuestMapProps {
  property?: Property;
  language?: 'en' | 'ka' | 'ru';
  favoriteIds?: string[];
  onToggleFavorite?: (id: string, title?: string) => void;
  propertyGems?: StumariGem[];
}

type CategoryFilter = 'all' | 'coffee' | 'food' | 'nightlife' | 'groceries' | 'explore';

interface UnifiedPlaceItem {
  id: string;
  name: string;
  category: Exclude<CategoryFilter, 'all'>;
  description: string;
  hostTip?: string;
  address?: string;
  subCategory?: string;
  distanceLabel?: string;
  priceLevel?: string;
  whatToOrder?: string;
  bestTime?: string;
  imageUrl?: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
  source: 'gem' | 'recommendation';
}

export const OfflineGuestMap: React.FC<OfflineGuestMapProps> = ({
  property: propProperty,
  language: propLanguage,
  favoriteIds: propFavoriteIds,
  onToggleFavorite: propOnToggleFavorite,
  propertyGems = [],
}) => {
  const {
    currentProperty,
    language: ctxLanguage,
    guestFavorites,
    toggleGuestFavorite,
    isPropertyAccessUnlocked,
  } = useApp();

  const property = propProperty || currentProperty;
  const language = propLanguage || ctxLanguage;
  const favoriteIds = propFavoriteIds ?? guestFavorites;
  const onToggleFavorite = propOnToggleFavorite ?? toggleGuestFavorite;

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isAccessUnlocked = isPropertyAccessUnlocked(property);
  const canShowExactPropertyLocation = Boolean(isAccessUnlocked && property.address);

  // Unify curated StumariGems and property.recommendations without fabricating coordinates or distances
  const unifiedPlaces: UnifiedPlaceItem[] = useMemo(() => {
    const items: UnifiedPlaceItem[] = [];
    const seenIds = new Set<string>();

    propertyGems.forEach(gem => {
      seenIds.add(gem.id);
      const mappedCat: Exclude<CategoryFilter, 'all'> =
        gem.experience === 'eat'
          ? 'food'
          : gem.experience === 'drink'
          ? gem.moods?.includes('coffee')
            ? 'coffee'
            : 'nightlife'
          : gem.experience === 'local_life'
          ? 'groceries'
          : 'explore';

      items.push({
        id: gem.id,
        name: gem.title,
        category: mappedCat,
        description: gem.whyWeRecommend || gem.subtitle,
        hostTip: gem.localTip || gem.hostQuote,
        address: gem.address,
        subCategory: gem.subCategory,
        distanceLabel: gem.distance,
        priceLevel: gem.priceLevel,
        whatToOrder:
          gem.whatToTry && gem.whatToTry.length > 0 ? gem.whatToTry.join(' · ') : undefined,
        bestTime: gem.bestTime,
        imageUrl: gem.image,
        mapsUrl: gem.mapsUrl,
        source: 'gem',
      });
    });

    (property.recommendations || []).forEach(rec => {
      if (seenIds.has(rec.id)) return;
      seenIds.add(rec.id);
      const mappedCat: Exclude<CategoryFilter, 'all'> =
        rec.category === 'coffee'
          ? 'coffee'
          : rec.category === 'food'
          ? 'food'
          : rec.category === 'nightlife'
          ? 'nightlife'
          : rec.category === 'groceries'
          ? 'groceries'
          : 'explore';

      items.push({
        id: rec.id,
        name: rec.name,
        category: mappedCat,
        description: rec.description,
        hostTip: rec.hostTip,
        address: rec.address,
        distanceLabel:
          rec.distance ||
          (typeof rec.walkingTimeMinutes === 'number'
            ? `${rec.walkingTimeMinutes} min walk`
            : undefined),
        mapsUrl: rec.mapsUrl,
        latitude: typeof rec.latitude === 'number' ? rec.latitude : undefined,
        longitude: typeof rec.longitude === 'number' ? rec.longitude : undefined,
        source: 'recommendation',
      });
    });

    return items;
  }, [propertyGems, property.recommendations]);

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') return unifiedPlaces;
    return unifiedPlaces.filter(place => place.category === selectedCategory);
  }, [unifiedPlaces, selectedCategory]);

  // Only plot places that actually have real numeric coordinates
  const geocodedPlaces = useMemo(
    () =>
      filteredPlaces.filter(
        p =>
          typeof p.latitude === 'number' &&
          typeof p.longitude === 'number' &&
          !Number.isNaN(p.latitude) &&
          !Number.isNaN(p.longitude)
      ),
    [filteredPlaces]
  );

  // Project real coordinates onto a normalized 16%..84% bounding canvas if at least 2 points exist
  const mapPositions = useMemo(() => {
    const points: Array<{ id: string; lat: number; lng: number }> = geocodedPlaces.map(p => ({
      id: p.id,
      lat: p.latitude!,
      lng: p.longitude!,
    }));

    const hasPropertyCoords =
      isAccessUnlocked &&
      typeof property.latitude === 'number' &&
      typeof property.longitude === 'number';

    if (hasPropertyCoords) {
      points.push({
        id: '__property__',
        lat: property.latitude!,
        lng: property.longitude!,
      });
    }

    if (points.length < 2) return null;

    const lats = points.map(p => p.lat);
    const lngs = points.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = Math.max(maxLat - minLat, 0.004);
    const lngSpan = Math.max(maxLng - minLng, 0.004);

    const coordsMap: Record<string, { x: number; y: number }> = {};
    points.forEach(pt => {
      const normX = (pt.lng - minLng) / lngSpan;
      const normY = 1 - (pt.lat - minLat) / latSpan;
      coordsMap[pt.id] = {
        x: Math.round(16 + normX * 68),
        y: Math.round(18 + normY * 64),
      };
    });

    return coordsMap;
  }, [geocodedPlaces, isAccessUnlocked, property.latitude, property.longitude]);

  const selectedPlace =
    filteredPlaces.find(p => p.id === selectedSpotId) || filteredPlaces[0] || null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'coffee':
        return Coffee;
      case 'food':
        return Utensils;
      case 'nightlife':
        return Wine;
      case 'groceries':
        return ShoppingBag;
      default:
        return Compass;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'coffee':
        return 'bg-[#C87D4B] text-white';
      case 'food':
        return 'bg-[#F55A51] text-white';
      case 'nightlife':
        return 'bg-[#8C3B4A] text-white';
      case 'groceries':
        return 'bg-[#2E7D32] text-white';
      default:
        return 'bg-[#748C96] text-white';
    }
  };

  const getPlaceNavigationUrl = (place: UnifiedPlaceItem) => {
    if (place.mapsUrl) return place.mapsUrl;
    if (typeof place.latitude === 'number' && typeof place.longitude === 'number') {
      return `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    }
    const query = [place.name, place.address, property.city].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const handleCopyPlaceAddress = async (place: UnifiedPlaceItem) => {
    const textToCopy = place.address ? `${place.name}, ${place.address}` : place.name;
    const ok = await safeCopyToClipboard(textToCopy);
    if (ok) {
      setCopiedId(place.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories: {
    id: CategoryFilter;
    label: { en: string; ka: string; ru: string };
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'all', label: { en: 'All Places', ka: 'ყველა', ru: 'Все' }, icon: Compass },
    { id: 'coffee', label: { en: 'Coffee', ka: 'ყავა', ru: 'Кофе' }, icon: Coffee },
    { id: 'food', label: { en: 'Dining', ka: 'კვება', ru: 'Еда' }, icon: Utensils },
    { id: 'nightlife', label: { en: 'Wine & Bars', ka: 'ღვინო', ru: 'Вино и бары' }, icon: Wine },
    {
      id: 'groceries',
      label: { en: 'Markets', ka: 'მარკეტი', ru: 'Магазины' },
      icon: ShoppingBag,
    },
    { id: 'explore', label: { en: 'Sights', ka: 'ღირსშესანიშნაობა', ru: 'Места' }, icon: MapPin },
  ];

  const propertyMapsDestination = canShowExactPropertyLocation
    ? property.latitude && property.longitude
      ? `${property.latitude},${property.longitude}`
      : encodeURIComponent(property.address)
    : encodeURIComponent(`${property.city || 'Tbilisi'}, ${property.country || 'Georgia'}`);

  const [copiedHomeAddress, setCopiedHomeAddress] = useState(false);

  const handleCopyHomeAddress = async () => {
    if (!canShowExactPropertyLocation || !property.address) return;
    const ok = await safeCopyToClipboard(property.address);
    if (ok) {
      setCopiedHomeAddress(true);
      setTimeout(() => setCopiedHomeAddress(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Tier 1: Property Home Base Utility Banner (Respects Access Lock) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_10px_30px_-14px_rgba(28,27,26,0.07)] dark:shadow-none">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center shrink-0">
            {canShowExactPropertyLocation ? (
              <Home className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A756D] dark:text-[#A39E93] block">
              {language === 'ka'
                ? 'თქვენი საცხოვრებელი ბაზა'
                : language === 'ru'
                ? 'Ваша база проживания'
                : 'Your Home Base'}
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1B1A] dark:text-[#F7F5F0] break-words">
              {canShowExactPropertyLocation
                ? property.address
                : `${property.city || 'Tbilisi'}, ${property.country || 'Georgia'}`}
            </h3>
            {!canShowExactPropertyLocation && (
              <p className="text-xs text-[#7A756D] dark:text-[#A39E93] mt-0.5">
                {language === 'ka'
                  ? 'ზუსტი მისამართი დაცულია წვდომის გასაღებით'
                  : language === 'ru'
                  ? 'Точный адрес защищён ключом доступа гостя'
                  : 'Exact street address is protected until unlocked with your check-in key'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canShowExactPropertyLocation && (
            <button
              type="button"
              onClick={handleCopyHomeAddress}
              className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0] text-xs font-bold inline-flex items-center justify-center gap-1.5 hover:border-[#F55A51]/40 transition-colors min-h-[42px] cursor-pointer"
            >
              {copiedHomeAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {language === 'ka'
                    ? 'დაკოპირდა'
                    : language === 'ru'
                    ? 'Скопировано'
                    : 'Copied'}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                  {language === 'ka'
                    ? 'კოპირება'
                    : language === 'ru'
                    ? 'Копировать'
                    : 'Copy'}
                </>
              )}
            </button>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${propertyMapsDestination}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shrink-0 min-h-[42px]"
          >
            <Navigation className="w-3.5 h-3.5 text-[#F55A51]" />
            {language === 'ka'
              ? 'მარშრუტი სახლამდე'
              : language === 'ru'
              ? 'Маршрут домой'
              : 'Directions to Stay'}
          </a>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => {
          const Icon = cat.icon;
          const active = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? unifiedPlaces.length
              : unifiedPlaces.filter(p => p.category === cat.id).length;

          if (cat.id !== 'all' && count === 0) return null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all border min-h-[42px] cursor-pointer ${
                active
                  ? 'bg-[#F55A51] text-white border-[#F55A51] shadow-sm'
                  : 'bg-white dark:bg-[#1F1E1C] text-[#7A756D] dark:text-[#A39E93] border-[#EBE6DF] dark:border-[#2B2926] hover:text-[#1C1B1A] dark:hover:text-[#F7F5F0]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label[language]}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FAF8F5] dark:bg-[#141312] text-[#7A756D] dark:text-[#A39E93]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Unified Coordinate Pin Map + Active Pin Tray (Only rendered when real numeric coordinates exist on places) */}
      {mapPositions && geocodedPlaces.length >= 2 && (
        <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] overflow-hidden shadow-[0_10px_30px_-14px_rgba(28,27,26,0.07)] dark:shadow-none">
          <div className="px-5 py-3.5 border-b border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F55A51]" />
              <span className="text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                {language === 'ka'
                  ? 'კოორდინატების რუკა'
                  : language === 'ru'
                  ? 'Карта мест поблизости'
                  : 'Neighborhood Pin Map'}
              </span>
            </div>
            <span className="text-[11px] text-[#7A756D] dark:text-[#A39E93]">
              {language === 'ka'
                ? 'დააჭირეთ ქინძისთავს დეტალებისთვის'
                : language === 'ru'
                ? 'Нажмите на метку для деталей'
                : 'Tap any pin to inspect'}
            </span>
          </div>

          <div className="relative h-60 sm:h-68 w-full select-none overflow-hidden bg-[#FAF8F5] dark:bg-[#141312]">
            {/* Subtle Coordinate Grid */}
            <div
              className="absolute inset-0 opacity-25 dark:opacity-15"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #748C96 1px, transparent 1px), linear-gradient(to right, rgba(116,140,150,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(116,140,150,0.12) 1px, transparent 1px)',
                backgroundSize: '24px 24px, 48px 48px, 48px 48px',
              }}
            />

            {/* Home Pin (only when unlocked & geocoded) */}
            {mapPositions['__property__'] && (
              <div
                style={{
                  left: `${mapPositions['__property__'].x}%`,
                  top: `${mapPositions['__property__'].y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] border-2 border-[#F55A51] shadow-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-[#F55A51]" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-full bg-[#1C1B1A] text-white text-[9px] font-bold uppercase tracking-wider shadow">
                  {language === 'ka' ? 'სახლი' : language === 'ru' ? 'Дом' : 'Stay'}
                </span>
              </div>
            )}

            {/* Real Geocoded Place Pins */}
            {geocodedPlaces.map(place => {
              const pos = mapPositions[place.id];
              if (!pos) return null;
              const Icon = getCategoryIcon(place.category);
              const isSelected = selectedPlace?.id === place.id;
              const isFav = favoriteIds.includes(place.id);

              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setSelectedSpotId(place.id)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 flex flex-col items-center cursor-pointer ${
                    isSelected ? 'z-30 scale-115' : 'z-10 hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md border-2 ${
                      isSelected
                        ? 'bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] border-[#F55A51]'
                        : `${getCategoryColor(place.category)} border-white dark:border-[#141312]`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {isFav && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F55A51] text-white flex items-center justify-center">
                        <Heart className="w-2 h-2 fill-current" />
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold max-w-[115px] truncate shadow-sm ${
                      isSelected
                        ? 'bg-[#F55A51] text-white'
                        : 'bg-white/95 dark:bg-[#1F1E1C]/95 text-[#1C1B1A] dark:text-[#F7F5F0]'
                    }`}
                  >
                    {place.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Coupled Selected Pin Tray inside Map Card */}
          {selectedPlace && (
            <div className="p-4 sm:p-5 border-t border-[#EBE6DF] dark:border-[#2B2926] bg-white dark:bg-[#1F1E1C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F55A51]">
                    {selectedPlace.subCategory || selectedPlace.category}
                  </span>
                  {selectedPlace.distanceLabel && (
                    <span className="text-[11px] font-semibold text-[#7A756D] dark:text-[#A39E93] flex items-center gap-1">
                      · <Footprints className="w-3 h-3 text-[#F55A51]" />
                      {selectedPlace.distanceLabel}
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-base text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                  {selectedPlace.name}
                </h4>
                {selectedPlace.address && (
                  <p className="text-xs text-[#7A756D] dark:text-[#A39E93] truncate">
                    {selectedPlace.address}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={getPlaceNavigationUrl(selectedPlace)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#F55A51] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#E04840] transition-colors min-h-[38px]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {language === 'ka'
                    ? 'Google Maps'
                    : language === 'ru'
                    ? 'Открыть карту'
                    : 'Open in Maps'}
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tier 2 / Tier 3: Categorized Places Directory Cards (Self-contained, no nested sub-boxes) */}
      {filteredPlaces.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-center space-y-2">
          <Sparkles className="w-6 h-6 text-[#F55A51] mx-auto" />
          <p className="text-sm font-semibold text-[#1C1B1A] dark:text-[#F7F5F0]">
            {language === 'ka'
              ? 'ამ კატეგორიაში ადგილები ჯერ არ არის დამატებული'
              : language === 'ru'
              ? 'В этой категории пока нет добавленных мест'
              : 'No places added in this category yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlaces.map(place => {
            const Icon = getCategoryIcon(place.category);
            const isSelected = selectedPlace?.id === place.id;
            const isFav = favoriteIds.includes(place.id);

            return (
              <article
                key={place.id}
                onClick={() => setSelectedSpotId(place.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-white dark:bg-[#1F1E1C] border-[#F55A51]/60 shadow-[0_10px_28px_-14px_rgba(245,90,81,0.18)]'
                    : 'bg-white dark:bg-[#1F1E1C] border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51]/40 shadow-[0_6px_22px_-12px_rgba(28,27,26,0.06)] dark:shadow-none'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Row: Thumbnail / Icon + Title + Favorite */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      {place.imageUrl ? (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          loading="lazy"
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#EBE6DF] dark:border-[#2B2926]"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getCategoryColor(
                            place.category
                          )}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F55A51]">
                            {place.subCategory || place.category}
                          </span>
                          {place.distanceLabel && (
                            <span className="text-[11px] font-semibold text-[#7A756D] dark:text-[#A39E93] inline-flex items-center gap-1">
                              · <Footprints className="w-3 h-3 text-[#F55A51]" />
                              {place.distanceLabel}
                            </span>
                          )}
                          {place.priceLevel && (
                            <span className="text-[11px] font-bold text-[#D99B26] dark:text-[#FFC757]">
                              · {place.priceLevel}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#1C1B1A] dark:text-[#F7F5F0] leading-snug mt-0.5 break-words">
                          {place.name}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(place.id, place.name);
                      }}
                      aria-label={isFav ? 'Remove from saved' : 'Save place'}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
                        isFav
                          ? 'bg-[#F55A51]/10 border-[#F55A51]/30 text-[#F55A51]'
                          : 'bg-[#FAF8F5] dark:bg-[#141312] border-[#EBE6DF] dark:border-[#2B2926] text-[#7A756D]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-current text-[#F55A51]' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  {place.description && (
                    <p className="text-xs sm:text-sm text-[#5C5852] dark:text-[#A39E93] leading-relaxed line-clamp-2">
                      {place.description}
                    </p>
                  )}

                  {/* Unboxed Host Tip / What to Order (No nested box-inside-box) */}
                  {(place.hostTip || place.whatToOrder) && (
                    <div className="border-l-2 border-[#F55A51] pl-3 py-0.5 text-xs">
                      <span className="font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                        {language === 'ka'
                          ? 'მასპინძლის რჩევა: '
                          : language === 'ru'
                          ? 'Совет хозяина: '
                          : 'Host tip: '}
                      </span>
                      <span className="italic text-[#5C5852] dark:text-[#A39E93] line-clamp-2">
                        “{place.hostTip || place.whatToOrder}”
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-[#EBE6DF]/70 dark:border-[#2B2926]/70 flex flex-wrap items-center justify-between gap-2">
                  {place.address ? (
                    <span className="text-xs text-[#7A756D] dark:text-[#A39E93] flex items-center gap-1.5 min-w-0 truncate max-w-[180px] sm:max-w-[220px]">
                      <MapPin className="w-3.5 h-3.5 text-[#F55A51] shrink-0" />
                      <span className="truncate">{place.address}</span>
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    {place.address && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleCopyPlaceAddress(place);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] flex items-center gap-1.5 min-h-[36px] cursor-pointer"
                      >
                        {copiedId === place.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                            {language === 'ka'
                              ? 'დაკოპირდა'
                              : language === 'ru'
                              ? 'Скопировано'
                              : 'Copied'}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                            {language === 'ka' ? 'კოპირება' : language === 'ru' ? 'Адрес' : 'Copy'}
                          </>
                        )}
                      </button>
                    )}

                    <a
                      href={getPlaceNavigationUrl(place)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity min-h-[36px]"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#F55A51]" />
                      {language === 'ka'
                        ? 'რუკა'
                        : language === 'ru'
                        ? 'Карта'
                        : 'Directions'}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
