import React, { useState } from 'react';
import { 
  KeyRound, 
  Wifi, 
  Zap, 
  BookOpen, 
  CheckSquare, 
  Check, 
  Copy, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Star, 
  MessageCircle, 
  Phone, 
  ExternalLink, 
  AlertCircle, 
  ShieldAlert, 
  Coffee, 
  Tv, 
  Thermometer, 
  Shirt, 
  Flame, 
  Utensils, 
  ArrowLeft, 
  Square, 
  Heart, 
  Sparkles, 
  Car, 
  Bus, 
  Compass, 
  Trash2,
  Sun,
  Moon,
  CreditCard,
  Navigation,
  ShoppingBag
} from 'lucide-react';
import { Property, ApplianceGuide, GemMood } from '../../types';
import { useApp } from '../../context/AppContext';
import { LanguageSelector, ThemeAndLanguageControls } from '../common/LanguageSelector';
import { OfflineGuestMap } from './OfflineGuestMap';
import { ReviewEngineModal } from './ReviewEngineModal';
import { StumariGemsSection } from './StumariGemsSection';
import { MobileBottomDock, GuestTab } from './MobileBottomDock';
import { ArrivalBoardingPass } from './ArrivalBoardingPass';
import { MoodsCarousel } from './MoodsCarousel';
import { MobileBottomSheet } from './MobileBottomSheet';
import { AddToHomeScreenModal } from './AddToHomeScreenModal';
import { 
  CheckinArtSketch, 
  AppliancesArtSketch, 
  HouseRulesArtSketch, 
  DepartureArtSketch, 
  GroceryMarketSketch,
  PhoneReceiverSketch, 
  TaxiSedanSketch, 
  RecyclingBinsSketch, 
  TbilisiPanoramaSketch 
} from './GuestGuideIllustrations';

interface GuestGuideSimpleProps {
  propertyOverride?: Property;
  isEmbed?: boolean;
}

type DrawerType = 
  | null 
  | 'checkin' 
  | 'wifi' 
  | 'appliances' 
  | 'selected_appliance'
  | 'rules' 
  | 'transport' 
  | 'checkout' 
  | 'contact'
  | 'stickers';

export const GuestGuideSimple: React.FC<GuestGuideSimpleProps> = ({ 
  propertyOverride, 
  isEmbed = false 
}) => {
  const { currentProperty, showToast, setCurrentRoute, theme, toggleTheme, t, language, getLocalizedProperty, setActiveMood } = useApp();
  const rawProperty = propertyOverride || currentProperty;
  const property = getLocalizedProperty(rawProperty);
  const isDark = theme === 'dark';

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<GuestTab>('stay');
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceGuide | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [exploreViewMode, setExploreViewMode] = useState<'map' | 'list'>('map');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [gemFavorites, setGemFavorites] = useState<Record<string, boolean>>({});

  // Quick copy states
  const [wifiCopied, setWifiCopied] = useState(false);
  const [doorCopied, setDoorCopied] = useState(false);

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const handleCopy = (text: string, type: 'wifi' | 'door') => {
    triggerHaptic();
    navigator.clipboard.writeText(text);
    if (type === 'wifi') {
      setWifiCopied(true);
      setTimeout(() => setWifiCopied(false), 2000);
      showToast(t.guestGuide.cards.passwordCopied);
    } else {
      setDoorCopied(true);
      setTimeout(() => setDoorCopied(false), 2000);
      showToast(t.guestGuide.cards.codeCopied);
    }
  };

  const toggleCheck = (idx: number) => {
    triggerHaptic();
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    setGemFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getApplianceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'thermometer': return <Thermometer className="w-5 h-5 text-blue-500" />;
      case 'coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'shirt': return <Shirt className="w-5 h-5 text-teal-500" />;
      case 'tv': return <Tv className="w-5 h-5 text-purple-500" />;
      case 'flame': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'utensils': return <Utensils className="w-5 h-5 text-stone-500" />;
      default: return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleMoodSelect = (mood: GemMood) => {
    setActiveMood(mood);
    setActiveTab('gems');
  };

  // Nearby Gems as in the reference
  const nearbyGems = [
    {
      id: 'gem-sameba',
      title: 'Sameba Cathedral',
      time: '12 min walk',
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'gem-fabrika',
      title: 'Fabrika Tbilisi',
      time: '8 min drive',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'gem-mtatsminda',
      title: 'Mtatsminda Park',
      time: '15 min drive',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#080B0E] text-stone-100' : 'bg-stone-100/70 text-stone-900'} flex flex-col items-center justify-start font-sans transition-colors duration-200`}>
      
      {/* PRESENTATION CONTAINER: Clean modern web app canvas (full width on mobile, max-w-xl on desktop) */}
      <div className={`w-full max-w-xl min-h-screen flex flex-col relative transition-all duration-300 sm:border-x sm:shadow-2xl ${
        isDark ? 'bg-[#0B0F13] sm:border-stone-800 text-stone-100' : 'bg-[#FAF8F5] sm:border-stone-200 text-stone-900'
      }`}>
        
        {/* NATIVE APP TOP HEADER BAR */}
        <header className={`px-4 py-3 flex items-center justify-between border-b backdrop-blur-xl sticky top-0 z-30 transition-colors ${
          isDark ? 'bg-[#0B0F13]/92 border-stone-800/80 text-white' : 'bg-[#FAF8F5]/92 border-stone-200/80 text-stone-900'
        }`}>
          {/* Property Identity & Superhost badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            {!isEmbed && (
              <button
                onClick={() => setCurrentRoute('/app')}
                className={`p-1.5 -ml-1.5 rounded-full transition-colors shrink-0 flex items-center justify-center ${
                  isDark ? 'text-stone-400 hover:text-white hover:bg-white/10' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
                title={t.guestGuide.backToHost}
                aria-label={t.guestGuide.backToHost}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <img
              src={property.hostAvatar}
              alt={property.hostName}
              className="w-9 h-9 rounded-full object-cover border border-stone-300 dark:border-stone-700 shrink-0 shadow-2xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm font-bold truncate">
                  {property.title}
                </span>
              </div>
              <span className={`text-[11px] font-medium block truncate mt-0.5 ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {property.city} · {property.hostName} (Host)
              </span>
            </div>
          </div>

          {/* Top Actions: Theme Toggle & Compact Language Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                isDark 
                  ? 'bg-stone-900 border-stone-700 text-stone-200 hover:text-white' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-2xs'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#E4E98E]" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>
            <LanguageSelector variant="compact" />
          </div>
        </header>

        {/* SCROLLABLE MOBILE CONTENT AREA */}
        <div className="flex-1 w-full pb-28">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: STAY (Apartment Manual, Fast Pass, Appliances, Rules)  */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'stay' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              
              {/* 1. HERO VISUAL COVER WITH WELCOME QUOTE & WEATHER */}
              <div className="relative h-52 sm:h-56 rounded-[30px] overflow-hidden shadow-md border border-stone-200/80 dark:border-white/10 group">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                
                {/* Weather Pill (Top Right) */}
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm">
                  <span>🌤️</span>
                  <span className="font-semibold text-[11px]">22°C</span>
                </div>

                {/* Cover Text Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 w-fit mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                      {language === 'ka' ? 'დადასტურებული ბინა' : language === 'ru' ? 'Проверенное жильё' : 'STUMARI VERIFIED'}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    {language === 'ka' ? 'კეთილი იყოს თქვენი მობრძანება!' : 'Welcome to Old Tbilisi!'}
                  </h1>
                  <p className="text-xs text-stone-200 line-clamp-2 mt-1 font-normal leading-relaxed max-w-sm">
                    {language === 'ka' 
                      ? 'თავი ისე იგრძენით, როგორც საკუთარ სახლში. ყველაფერი მზადაა კომფორტული დასვენებისთვის.' 
                      : 'Make yourself at home. Everything you need for a comfortable and memorable stay.'}
                  </p>
                </div>
              </div>

              {/* 2. FAST PASS: ACCESS CODES BENTO & ADDRESS */}
              <ArrivalBoardingPass 
                property={property}
                onOpenCheckinInstructions={() => {
                  triggerHaptic();
                  setActiveDrawer('checkin');
                }}
                onOpenWifiModal={() => {
                  triggerHaptic();
                  setActiveDrawer('wifi');
                }}
              />

              {/* 3. "WHAT ARE YOU IN THE MOOD FOR?" (5 Pastel Cards) */}
              <div className="pt-1">
                <MoodsCarousel 
                  onSelectMood={handleMoodSelect}
                  onViewAllGems={() => setActiveTab('gems')}
                />
              </div>

              {/* 4. "YOUR STAY GUIDE" (2x2 Illustrated Bento Cards) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-mono uppercase font-black tracking-wider ${
                    isDark ? 'text-stone-300' : 'text-stone-900'
                  }`}>
                    {language === 'ka' ? 'თქვენი გზამკვლევი' : language === 'ru' ? 'Ваш гид' : 'YOUR STAY GUIDE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Check-in Instructions */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('checkin');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] active:scale-[0.97] h-[132px] group shadow-xs hover:shadow-xl ${
                      isDark 
                        ? 'bg-[#0D1812] border-emerald-500/25 hover:border-emerald-500/50 text-stone-100 shadow-md hover:shadow-emerald-500/20' 
                        : 'bg-[#EBF7EF] border-[#B9E6C6] hover:border-[#8FD4A3] text-stone-950 hover:shadow-emerald-500/10'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-emerald-950/50 text-emerald-400' : 'bg-emerald-200/90 text-emerald-900'
                      }`}>
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block truncate leading-snug ${
                          isDark ? 'text-stone-100' : 'text-stone-950'
                        }`}>
                          {t.guestGuide.cards.checkinTitle}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-bold leading-tight ${
                          isDark ? 'text-stone-300' : 'text-stone-800'
                        }`}>
                          Step-by-step guide for a smooth arrival
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-90 group-hover:scale-105 transition-transform duration-300">
                      <CheckinArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Appliances & How Things Work */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('appliances');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] active:scale-[0.97] h-[132px] group shadow-xs hover:shadow-xl ${
                      isDark 
                        ? 'bg-[#0E1724] border-sky-500/25 hover:border-sky-500/50 text-stone-100 shadow-md hover:shadow-sky-500/20' 
                        : 'bg-[#EDF5FF] border-[#BFDCFC] hover:border-[#96C7FB] text-stone-950 hover:shadow-sky-500/10'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-sky-950/50 text-sky-400' : 'bg-sky-200/90 text-sky-900'
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block truncate leading-snug ${
                          isDark ? 'text-stone-100' : 'text-stone-950'
                        }`}>
                          {t.guestGuide.cards.howThingsWork}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-bold leading-tight ${
                          isDark ? 'text-stone-300' : 'text-stone-800'
                        }`}>
                          {property.appliances.length} appliances guided
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-90 group-hover:scale-105 transition-transform duration-300">
                      <AppliancesArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-sky-700 dark:text-sky-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* House Rules & Quiet Hours */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('rules');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] active:scale-[0.97] h-[132px] group shadow-xs hover:shadow-xl ${
                      isDark 
                        ? 'bg-[#18140E] border-amber-500/25 hover:border-amber-500/50 text-stone-100 shadow-md hover:shadow-amber-500/20' 
                        : 'bg-[#FDF6E7] border-[#F2DBAC] hover:border-[#E8C883] text-stone-950 hover:shadow-amber-500/10'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-amber-950/50 text-amber-400' : 'bg-amber-200/90 text-amber-900'
                      }`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block truncate leading-snug ${
                          isDark ? 'text-stone-100' : 'text-stone-950'
                        }`}>
                          {t.guestGuide.cards.houseRules}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-bold leading-tight ${
                          isDark ? 'text-stone-300' : 'text-stone-800'
                        }`}>
                          {property.quietHours}
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-90 group-hover:scale-105 transition-transform duration-300">
                      <HouseRulesArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-amber-700 dark:text-amber-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Departure Checklist */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('checkout');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] active:scale-[0.97] h-[132px] group shadow-xs hover:shadow-xl ${
                      isDark 
                        ? 'bg-[#191124] border-purple-500/25 hover:border-purple-500/50 text-stone-100 shadow-md hover:shadow-purple-500/20' 
                        : 'bg-[#F6EDFD] border-[#DFC5FA] hover:border-[#CA9FF6] text-stone-950 hover:shadow-purple-500/10'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-purple-950/50 text-purple-400' : 'bg-purple-200/90 text-purple-900'
                      }`}>
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block truncate leading-snug ${
                          isDark ? 'text-stone-100' : 'text-stone-950'
                        }`}>
                          {t.guestGuide.cards.checkoutChecklist}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-bold leading-tight ${
                          isDark ? 'text-stone-300' : 'text-stone-800'
                        }`}>
                          {property.checkOutTime}
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-90 group-hover:scale-105 transition-transform duration-300">
                      <DepartureArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-purple-700 dark:text-purple-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>

              {/* 5. "USEFUL STICKERS" (Emergency, Taxi, Trash) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-mono uppercase font-black tracking-wider ${
                    isDark ? 'text-stone-300' : 'text-stone-900'
                  }`}>
                    {language === 'ka' ? 'სასარგებლო ბარათები' : 'USEFUL STICKERS'}
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('stickers');
                    }}
                    className={`text-xs font-black hover:underline flex items-center gap-0.5 ${
                      isDark ? 'text-[#E4E98E]' : 'text-stone-950'
                    }`}
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {/* Sticker 1: 24/7 Groceries & Local Market (Replaced panic Emergency card) */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      const query = encodeURIComponent(`supermarket 24/7 near ${property.address}, ${property.city}`);
                      window.open(`https://maps.google.com/?q=${query}`, '_blank');
                    }}
                    className={`p-2 sm:p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 hover:translate-y-[-2px] active:scale-95 group shadow-xs h-[88px] ${
                      isDark 
                        ? 'bg-[#1C180E] border-amber-500/30 text-amber-200' 
                        : 'bg-[#FFF9EB] border-[#FCE2A6] text-[#92400E]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-2xs">
                      <ShoppingBag className="w-3 h-3 stroke-[2.4]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black leading-tight truncate w-full px-0.5">
                      {language === 'ka' ? 'მარკეტი 24/7' : language === 'ru' ? 'Маркет 24/7' : '24/7 Market'}
                    </span>
                    <div className="opacity-90 group-hover:scale-105 transition-transform">
                      <GroceryMarketSketch className="w-11 h-7" isDark={isDark} />
                    </div>
                  </button>

                  {/* Sticker 2: Taxi & Transfers */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('list');
                      setActiveTab('explore');
                    }}
                    className={`p-2 sm:p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 hover:translate-y-[-2px] active:scale-95 group shadow-xs h-[88px] ${
                      isDark 
                        ? 'bg-[#0E2016] border-emerald-500/30 text-emerald-200' 
                        : 'bg-[#ECF8F1] border-[#BEE9CB] text-[#064E3B]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Car className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black leading-tight truncate w-full px-0.5">
                      {language === 'ka' ? 'ტაქსი' : language === 'ru' ? 'Такси' : 'Taxi & Bolt'}
                    </span>
                    <div className="opacity-90 group-hover:scale-105 transition-transform">
                      <TaxiSedanSketch className="w-12 h-7" isDark={isDark} />
                    </div>
                  </button>

                  {/* Sticker 3: Trash & Recycling */}
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('rules');
                    }}
                    className={`p-2 sm:p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 hover:translate-y-[-2px] active:scale-95 group shadow-xs h-[88px] ${
                      isDark 
                        ? 'bg-[#1B1226] border-purple-500/30 text-purple-200' 
                        : 'bg-[#F3EAFD] border-[#DCC3F9] text-[#4C1D95]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Trash2 className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black leading-tight truncate w-full px-0.5">
                      {language === 'ka' ? 'ნაგავი' : language === 'ru' ? 'Мусор' : 'Trash & Bins'}
                    </span>
                    <div className="opacity-90 group-hover:scale-105 transition-transform">
                      <RecyclingBinsSketch className="w-12 h-7" isDark={isDark} />
                    </div>
                  </button>
                </div>
              </div>

              {/* 7. "HOW IS YOUR STAY GOING?" REVIEW BANNER */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 shadow-xs ${
                isDark 
                  ? 'bg-gradient-to-r from-[#1E1911] via-[#16120D] to-[#1E1911] border-amber-500/30 text-stone-100 shadow-md' 
                  : 'bg-gradient-to-r from-[#FFFBEB] via-[#FEF9C3]/50 to-[#FFFBEB] border-amber-300 text-stone-900 shadow-xs'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-xs font-black block truncate ${
                      isDark ? 'text-stone-100' : 'text-stone-950'
                    }`}>
                      How is your stay going?
                    </span>
                    <span className={`text-[11px] block truncate font-semibold ${
                      isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}>
                      Leave private feedback for your host
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic();
                    setIsReviewModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E5EDA8] hover:bg-[#d8e293] text-stone-950 font-black text-xs shrink-0 shadow-xs active:scale-95 transition-all border border-stone-900/10"
                >
                  Review
                </button>
              </div>

              {/* 8. "NEARBY GEMS" CAROUSEL */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-mono uppercase font-black tracking-wider ${
                    isDark ? 'text-stone-300' : 'text-stone-900'
                  }`}>
                    NEARBY GEMS
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveTab('gems');
                    }}
                    className={`text-xs font-black hover:underline flex items-center gap-0.5 ${
                      isDark ? 'text-[#E4E98E]' : 'text-stone-950'
                    }`}
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                  {nearbyGems.map(gem => (
                    <div
                      key={gem.id}
                      onClick={() => {
                        triggerHaptic();
                        setActiveTab('gems');
                      }}
                      className={`rounded-2xl border overflow-hidden shrink-0 w-44 transition-all duration-300 hover:translate-y-[-3px] cursor-pointer group shadow-xs ${
                        isDark 
                          ? 'bg-[#10171D] border-stone-800 text-stone-100 shadow-md' 
                          : 'bg-white border-stone-300 text-stone-950 shadow-sm hover:border-stone-400'
                      }`}
                    >
                      <div className="relative h-28 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                        <img 
                          src={gem.image} 
                          alt={gem.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate pr-1 ${
                            isDark ? 'text-stone-100' : 'text-stone-950'
                          }`}>
                            {gem.title}
                          </span>
                          <button
                            onClick={(e) => toggleFavorite(gem.id, e)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-0.5"
                            aria-label="Save to favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${gemFavorites[gem.id] ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                        <span className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${
                          isDark ? 'text-stone-300' : 'text-stone-700'
                        }`}>
                          <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>{gem.time}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. "NEED HELP?" (3 Action Cards) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-mono uppercase font-black tracking-wider ${
                    isDark ? 'text-stone-300' : 'text-stone-900'
                  }`}>
                    NEED HELP?
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <a
                    href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am staying at ${property.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs ${
                      isDark 
                        ? 'bg-[#0E1F16] border-emerald-500/25 text-emerald-200' 
                        : 'bg-[#EAF6EE] border-[#BEE9CB] text-[#064E3B]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black">Chat with Host &gt;</span>
                  </a>

                  <a
                    href={`tel:${property.hostPhone}`}
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs ${
                      isDark 
                        ? 'bg-[#0F1A2A] border-sky-500/25 text-sky-200' 
                        : 'bg-[#EBF3FE] border-[#B8D7FC] text-[#0369A1]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black">Call Host &gt;</span>
                  </a>

                  <a
                    href={`tel:${property.emergencyServicesNumber || '112'}`}
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs ${
                      isDark 
                        ? 'bg-[#251010] border-red-500/25 text-red-200' 
                        : 'bg-[#FDECEC] border-[#FBC4C4] text-[#7F1D1D]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                      SOS
                    </div>
                    <span className="text-[11px] font-black">Emergency &gt;</span>
                  </a>
                </div>
              </div>

              {/* 10. "EXPLORE TBILISI LIKE A LOCAL" ILLUSTRATED BANNER */}
              <div className={`p-5 rounded-[26px] border relative overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1C1610] via-[#14100C] to-[#0D0B08] border-amber-500/30 text-stone-100' 
                  : 'bg-gradient-to-br from-[#FAF5EC] via-[#F4EDE0] to-[#EFE4D2] border-[#E2D4BF] text-stone-900'
              }`}>
                {/* Background Panoramic Engraving of Tbilisi */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <TbilisiPanoramaSketch isDark={isDark} />
                </div>

                <div className="relative z-10 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5 text-[#B45309] dark:text-[#E4E98E] font-bold text-xs">
                    <span>✨</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider">Curated by Stumari</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                    Explore Tbilisi Like a Local
                  </h3>
                </div>

                <div className="relative z-10 flex justify-end">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveTab('gems');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E5EDA8] hover:bg-[#d8e293] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <span>Discover Gems &gt;</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: GEMS (Curated Local Secrets & Tbilisi Library)           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'gems' && (
            <div className="p-4 pb-4 animate-in fade-in duration-200">
              <StumariGemsSection 
                hostName={property.hostName} 
                hostAvatar={property.hostAvatar} 
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: EXPLORE (Interactive Offline Map & Getting Around)        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'explore' && (
            <div className="flex flex-col h-[740px] animate-in fade-in duration-200">
              {/* Segmented Switcher: Map vs Transit info */}
              <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 transition-colors ${
                isDark ? 'border-stone-800 bg-[#0B0F13]' : 'border-stone-200 bg-white'
              }`}>
                <div>
                  <span className="text-xs sm:text-sm font-bold font-serif block text-stone-950 dark:text-stone-100">
                    {exploreViewMode === 'map' 
                      ? (language === 'ka' ? 'თბილისის ინტერაქტიული რუკა' : language === 'ru' ? 'Интерактивная карта' : 'Interactive Tbilisi Map')
                      : (language === 'ka' ? 'ტრანსპორტი და გადაადგილება' : language === 'ru' ? 'Транспорт и такси' : 'Transit, Taxis & Etiquette')}
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {exploreViewMode === 'map' ? 'Offline-ready · Walk times' : 'Local transport guides & tips'}
                  </span>
                </div>

                <div className={`p-1 rounded-2xl border flex items-center text-xs font-bold ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-300'
                }`}>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('map');
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
                      exploreViewMode === 'map'
                        ? isDark ? 'bg-[#E4E98E] text-[#0C1510] shadow-xs' : 'bg-stone-950 text-white shadow-xs'
                        : isDark ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    {language === 'ka' ? '🗺️ რუკა' : language === 'ru' ? '🗺️ Карта' : '🗺️ Map'}
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('list');
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
                      exploreViewMode === 'list'
                        ? isDark ? 'bg-[#E4E98E] text-[#0C1510] shadow-xs' : 'bg-stone-950 text-white shadow-xs'
                        : isDark ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    {language === 'ka' ? '🚕 ტრანსპორტი' : language === 'ru' ? '🚕 Транспорт' : '🚕 Transit'}
                  </button>
                </div>
              </div>

              {exploreViewMode === 'map' ? (
                <div className="flex-1 w-full h-full relative">
                  <OfflineGuestMap 
                    property={property} 
                    onClose={() => setActiveTab('stay')} 
                  />
                </div>
              ) : (
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  
                  {/* Taxi / Bolt */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all duration-300 hover:translate-y-[-3px] ${
                    isDark 
                      ? 'bg-emerald-950/25 backdrop-blur-md border-emerald-500/30 text-stone-100 ring-1 ring-emerald-500/10 shadow-md' 
                      : 'bg-[#F0FDF4] border-emerald-300 text-stone-900 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-200 text-emerald-800'
                        }`}>
                          <Car className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <span className="text-sm sm:text-base font-bold block text-stone-950 dark:text-stone-100">{t.propertyHub.forms.taxiBolt}</span>
                          <span className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>Bolt App · Recommended Taxi</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                        ~5-7 GEL
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                      {property.taxiInfo}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <a
                        href="https://bolt.eu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
                      >
                        <span>{language === 'ka' ? 'Bolt ტაქსის გამოძახება' : language === 'ru' ? 'Вызвать Bolt' : 'Open Bolt App'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <span className={`text-[11px] font-semibold ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        Destination pre-sets
                      </span>
                    </div>
                  </div>

                  {/* Public Transit / Metro */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all duration-300 hover:translate-y-[-3px] ${
                    isDark 
                      ? 'bg-sky-950/25 backdrop-blur-md border-sky-500/30 text-stone-100 ring-1 ring-sky-500/10 shadow-md' 
                      : 'bg-[#F0F9FF] border-sky-300 text-stone-900 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-200 text-sky-800'
                        }`}>
                          <Bus className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <span className="text-sm sm:text-base font-bold block text-stone-950 dark:text-stone-100">{t.propertyHub.forms.transitMetro}</span>
                          <span className={`text-xs font-semibold ${isDark ? 'text-sky-400' : 'text-sky-800'}`}>{t.guestGuide.cards.transport}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-800 dark:text-sky-300">
                        1.00 GEL
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                      {property.transitInfo}
                    </p>
                    <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      isDark ? 'bg-sky-950/40 border-sky-800/40 text-sky-200' : 'bg-white border-sky-200 text-sky-950'
                    }`}>
                      <CreditCard className="w-4 h-4 text-sky-500 shrink-0" />
                      <span><strong>Tip:</strong> Tap your physical Visa / Mastercard directly at turnstiles (1.00 GEL / 90 min free transfer).</span>
                    </div>
                  </div>

                  {/* Airport Transit */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all duration-300 hover:translate-y-[-3px] ${
                    isDark 
                      ? 'bg-amber-950/25 backdrop-blur-md border-amber-500/30 text-stone-100 ring-1 ring-amber-500/10 shadow-md' 
                      : 'bg-[#FFFBEB] border-amber-300 text-stone-900 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-200 text-amber-800'
                        }`}>
                          <Compass className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <span className="text-sm sm:text-base font-bold block text-stone-950 dark:text-stone-100">{t.propertyHub.forms.airportTransit}</span>
                          <span className={`text-xs font-semibold ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>TBS Shota Rustaveli Airport (~17 km)</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        ~25-30 GEL
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                      {property.airportTransit}
                    </p>
                  </div>

                  {/* Local City Etiquette & Culture Quick Cheat Sheet */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-[#14191C] border-stone-800 text-stone-100' : 'bg-white border-stone-300 text-stone-900 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E4E98E]" />
                      <h4 className="font-serif font-bold text-sm sm:text-base">
                        {language === 'ka' ? 'თბილისური რჩევები და ეტიკეტი' : language === 'ru' ? 'Советы и этикет в Тбилиси' : 'Tbilisi Etiquette & Local Notes'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <span className="font-bold block text-stone-950 dark:text-white mb-0.5">💧 Tap Water</span>
                        <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          Tbilisi tap water comes from mountain reservoirs and is 100% clean and delicious to drink.
                        </p>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <span className="font-bold block text-stone-950 dark:text-white mb-0.5">💳 Cards Everywhere</span>
                        <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          Apple Pay and contactless cards work almost everywhere. Cash is only needed for small church stalls or flea markets.
                        </p>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <span className="font-bold block text-stone-950 dark:text-white mb-0.5">🗣️ Georgian Words</span>
                        <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          <strong>Gamarjoba</strong> (Hello) · <strong>Madloba</strong> (Thank you) · <strong>Gaumarjos</strong> (Cheers!)
                        </p>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <span className="font-bold block text-stone-950 dark:text-white mb-0.5">🥟 Khinkali Rule</span>
                        <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          Never use a fork! Grab the crown by hand, bite the side, sip the broth first, then eat. Leave the tail on the plate.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 4: REVIEW (Direct Feedback Engine)                          */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'feedback' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              
              <div className={`p-6 rounded-[28px] border text-center space-y-4 ${
                isDark 
                  ? 'bg-gradient-to-b from-amber-950/25 via-[#12161A] to-[#0A0E11] border-amber-500/30 ring-1 ring-amber-500/10 shadow-xl' 
                  : 'bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7]/40 to-white border-amber-300 shadow-md'
              }`}>
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner ring-1 ring-amber-500/30">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400 animate-bounce" />
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-950 dark:text-white">
                    {language === 'ka' ? 'როგორ ჩაიარა თქვენმა დასვენებამ?' : language === 'ru' ? 'Как прошло ваше пребывание?' : 'How was your stay?'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1.5 max-w-sm mx-auto font-medium leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    {language === 'ka' 
                      ? 'თქვენი შეფასება გვეხმარება გავხდეთ უკეთესი, ხოლო საუკეთესო შთაბეჭდილებები გაუზიაროთ მსოფლიოს.'
                      : language === 'ru'
                      ? 'Ваш отзыв помогает сделать жилье идеальным для следующих гостей.'
                      : 'Your private feedback helps your host improve immediately, while 5-star stays help future travelers.'}
                  </p>
                </div>

                {/* Interactive 5-Star Selector Right on Page */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        triggerHaptic();
                        setIsReviewModalOpen(true);
                      }}
                      className="p-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 hover:scale-115 active:scale-95 transition-all shadow-2xs group"
                      title={`Rate ${star} Stars`}
                    >
                      <Star className="w-7 h-7 fill-amber-400 text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    </button>
                  ))}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setIsReviewModalOpen(true);
                  }}
                  className="w-full py-4 rounded-2xl bg-[#E4E98E] hover:bg-[#d8dd80] text-stone-950 font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95"
                >
                  {language === 'ka' ? 'შეფასების დატოვება ⭐⭐⭐⭐⭐' : language === 'ru' ? 'Оставить отзыв ⭐⭐⭐⭐⭐' : 'Start Stay Feedback ⭐⭐⭐⭐⭐'}
                </button>
              </div>

              {/* Host Promise Note & Direct Fast WhatsApp */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
                isDark ? 'bg-[#14191C] border-stone-800 ring-1 ring-white/5' : 'bg-white border-stone-300'
              }`}>
                <div className="flex items-center gap-3">
                  <img 
                    src={property.hostAvatar} 
                    alt={property.hostName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0 shadow-xs" 
                  />
                  <div className="text-xs">
                    <span className="font-bold text-sm block text-stone-950 dark:text-stone-100">{property.hostName}'s Promise</span>
                    <span className={`block text-xs mt-0.5 font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      "Any issue during your stay? Text me on WhatsApp so I can solve it within minutes!"
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am currently staying at ${property.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 active:scale-95 transition-all shadow-xs"
                  title="Direct WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 stroke-[2.2]" />
                </a>
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 5: HOST & HELP (Saba Superhost, WhatsApp, Emergency 112)   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'host' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              
              {/* Host Card */}
              <div className={`p-6 rounded-[28px] border text-center space-y-3.5 shadow-md ${
                isDark 
                  ? 'bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.01] backdrop-blur-md border-white/10 ring-1 ring-white/5' 
                  : 'bg-gradient-to-b from-[#F4F7EB] via-[#EDF3EF]/60 to-white border-stone-300'
              }`}>
                <div className="relative inline-block mx-auto">
                  <img
                    src={property.hostAvatar}
                    alt={property.hostName}
                    className="w-22 h-22 rounded-full object-cover border-3 border-[#E4E98E] shadow-lg"
                  />
                  <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md ring-2 ring-white dark:ring-stone-900">
                    ✓
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-950 dark:text-white">
                    {property.hostName}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                      ★ {property.hostRole || 'Superhost'} · 5.0 (120+ stays)
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm mt-2 max-w-sm mx-auto font-medium leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    {property.welcomeGreeting || 'Always happy to help make your Tbilisi stay unforgettable. I usually reply within 5 minutes.'}
                  </p>
                </div>

                {/* Direct Host Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am staying at ${property.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 stroke-[2.2]" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${property.hostPhone}`}
                    className={`py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                      isDark ? 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-700' : 'bg-stone-950 hover:bg-stone-850 text-white'
                    }`}
                  >
                    <Phone className="w-4 h-4 stroke-[2.2]" />
                    <span>{language === 'ka' ? 'დარეკვა' : language === 'ru' ? 'Позвонить' : 'Call Host'}</span>
                  </a>
                </div>
              </div>

              {/* Property Address & Map Shortcut Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                isDark ? 'bg-[#14191C] border-stone-800 text-stone-100' : 'bg-white border-stone-300 text-stone-900 shadow-xs'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-mono uppercase font-black tracking-wider text-stone-950 dark:text-stone-100">
                      Apartment Address
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${property.address}, ${property.city}`, 'door')}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                  {property.address}, {property.city}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Open in Google Maps for Taxi / Couriers</span>
                </a>
              </div>

              {/* Emergency Services 112 Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                isDark ? 'bg-red-950/30 backdrop-blur-md border-red-500/30 text-red-100 ring-1 ring-red-500/10' : 'bg-red-50 border-red-300 text-stone-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-red-700 dark:text-red-400">
                      {t.guestGuide.cards.emergency112}
                    </span>
                  </div>
                  <span className="font-mono font-black text-base text-red-600 dark:text-red-400">112</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-red-200' : 'text-red-950'}`}>
                  Police, Ambulance, and Fire Rescue in Georgia (English & Russian operators available 24/7).
                </p>
                <a
                  href={`tel:${property.emergencyServicesNumber || '112'}`}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 stroke-[2.2]" />
                  <span>{t.guestGuide.cards.emergencyCall}</span>
                </a>
              </div>

            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NATIVE BOTTOM NAVIGATION DOCK                                   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <MobileBottomDock 
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          unreadFeedbackBadge={true}
        />

      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* NATIVE MOBILE BOTTOM SHEETS FOR MODAL INTERACTIONS              */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* 1. Check-In & Arrival Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'checkin'}
        onClose={() => setActiveDrawer(null)}
        title={t.guestGuide.cards.checkinTitle}
        subtitle={`${property.checkInMethod === 'keypad' ? 'Digital Keypad' : 'Lockbox'} · ${property.checkInTime}`}
        icon={<KeyRound className="w-5 h-5 text-emerald-400" />}
        stickyBottomAction={
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>{t.guestGuide.cards.viewOnMaps}</span>
          </a>
        }
      >
        <div className="space-y-4">
          {/* Code Banner */}
          <div className={`p-5 rounded-2xl border text-center space-y-2 shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800 ring-1 ring-emerald-500/20' : 'bg-emerald-50/70 border-emerald-300'
          }`}>
            <span className={`text-xs uppercase font-mono font-black tracking-wider block ${isDark ? 'text-[#E4E98E]' : 'text-emerald-900'}`}>
              {t.guestGuide.cards.doorCodeTitle}
            </span>
            <div className={`font-mono text-4xl sm:text-5xl font-black tracking-widest my-1 select-all ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {property.doorKeypadCode}
            </div>
            <button
              onClick={() => handleCopy(property.doorKeypadCode, 'door')}
              className="px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              {doorCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{doorCopied ? t.common.copied : t.common.copy}</span>
            </button>
          </div>

          <div>
            <h4 className={`font-black text-xs uppercase font-mono mb-1.5 ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              {t.guestGuide.cards.directionsTitle}
            </h4>
            <p className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed font-medium shadow-2xs ${
              isDark ? 'bg-[#14191C] border-stone-800 text-stone-100' : 'bg-white border-stone-300 text-stone-950'
            }`}>
              {property.arrivalDirections}
            </p>
          </div>

          <div>
            <h4 className={`font-black text-xs uppercase font-mono mb-1.5 ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              {t.guestGuide.cards.parkingTitle}
            </h4>
            <p className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed font-medium shadow-2xs ${
              isDark ? 'bg-[#14191C] border-stone-800 text-stone-100' : 'bg-white border-stone-300 text-stone-950'
            }`}>
              {property.parkingInstructions}
            </p>
          </div>
        </div>
      </MobileBottomSheet>

      {/* 2. Wi-Fi Modal Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'wifi'}
        onClose={() => setActiveDrawer(null)}
        title={t.guestGuide.cards.wifiTitle}
        subtitle={property.wifiNetwork}
        icon={<Wifi className="w-5 h-5 text-emerald-400" />}
      >
        <div className="space-y-4 text-center">
          <div className={`p-6 rounded-2xl border space-y-3 shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-300'
          }`}>
            <span className={`text-xs uppercase font-mono font-black tracking-wider block ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
              {t.propertyHub.forms.networkName}
            </span>
            <div className={`text-2xl font-black font-mono select-all ${isDark ? 'text-white' : 'text-stone-950'}`}>
              {property.wifiNetwork}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className={`text-xs uppercase font-mono font-black tracking-wider block ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
                {t.guestGuide.cards.wifiPassword}
              </span>
              <div className={`text-3xl sm:text-4xl font-mono font-black tracking-widest my-2 select-all ${isDark ? 'text-[#E4E98E]' : 'text-stone-950'}`}>
                {property.wifiPassword}
              </div>
            </div>

            <button
              onClick={() => handleCopy(property.wifiPassword, 'wifi')}
              className="w-full mt-3 py-3.5 rounded-xl bg-[#E4E98E] hover:bg-[#d8dd80] text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              {wifiCopied ? <Check className="w-4 h-4 stroke-[2.2]" /> : <Copy className="w-4 h-4 stroke-[2.2]" />}
              <span>{wifiCopied ? t.guestGuide.cards.passwordCopied : t.guestGuide.cards.copyPassword}</span>
            </button>
          </div>
        </div>
      </MobileBottomSheet>

      {/* 3. Full Appliances List Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'appliances'}
        onClose={() => setActiveDrawer(null)}
        title={t.guestGuide.cards.howThingsWork}
        subtitle={`${property.appliances.length} items with step-by-step instructions`}
        icon={<Zap className="w-5 h-5 text-sky-400" />}
      >
        <div className="space-y-3.5">
          {property.appliances.map(app => (
            <div 
              key={app.id}
              className={`p-4 rounded-2xl border space-y-3 transition-all shadow-xs ${
                isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5 font-bold text-base text-stone-950 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                  {getApplianceIcon(app.icon)}
                </div>
                <span className="font-serif font-bold text-base">{app.title}</span>
              </div>
              
              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                {app.instructions}
              </p>

              {app.troubleshooting && (
                <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                  isDark ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span><strong>Troubleshooting:</strong> {app.troubleshooting}</span>
                </div>
              )}

              {/* Direct Host WhatsApp Assistance */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  {language === 'ka' ? 'მაინც გაუგებარია?' : language === 'ru' ? 'Остались вопросы?' : 'Still confused?'}
                </span>
                <a
                  href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I have a question about the ${app.title} at ${property.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black text-emerald-700 dark:text-[#E4E98E] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask {property.hostName} on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </MobileBottomSheet>

      {/* 4. Single Selected Appliance Sheet */}
      {selectedAppliance && (
        <MobileBottomSheet
          isOpen={activeDrawer === 'selected_appliance'}
          onClose={() => {
            setActiveDrawer(null);
            setSelectedAppliance(null);
          }}
          title={selectedAppliance.title}
          subtitle="How to use & troubleshooting"
          icon={getApplianceIcon(selectedAppliance.icon)}
          stickyBottomAction={
            <a
              href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I have a quick question about ${selectedAppliance.title} in the apartment.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.2]" />
              <span>Ask {property.hostName} on WhatsApp</span>
            </a>
          }
        >
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border space-y-2 shadow-xs ${
              isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
            }`}>
              <h4 className={`font-black text-xs font-mono uppercase ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>Instructions</h4>
              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                {selectedAppliance.instructions}
              </p>
            </div>

            {selectedAppliance.troubleshooting && (
              <div className={`p-4 rounded-2xl border space-y-2 shadow-xs ${
                isDark ? 'bg-amber-950/30 border-amber-800/50 text-amber-100' : 'bg-amber-50 border-amber-300 text-stone-950'
              }`}>
                <h4 className="font-black text-xs font-mono uppercase flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Troubleshooting</span>
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed font-semibold ${isDark ? 'text-amber-100' : 'text-stone-950'}`}>
                  {selectedAppliance.troubleshooting}
                </p>
              </div>
            )}
          </div>
        </MobileBottomSheet>
      )}

      {/* 5. House Rules Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'rules'}
        onClose={() => setActiveDrawer(null)}
        title={t.guestGuide.cards.houseRules}
        subtitle="Quiet hours, garbage schedule & house norms"
        icon={<BookOpen className="w-5 h-5 text-amber-400" />}
      >
        <div className="space-y-3.5">
          <div className={`p-4 rounded-2xl border shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
          }`}>
            <span className={`font-black block text-xs font-mono uppercase mb-1.5 ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              {t.guestGuide.cards.quietHoursLabel}
            </span>
            <p className={`font-black text-lg ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>{property.quietHours}</p>
          </div>

          <div className={`p-4 rounded-2xl border shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
          }`}>
            <span className={`font-black block text-xs font-mono uppercase mb-1.5 ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              {t.guestGuide.cards.trashScheduleLabel}
            </span>
            <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{property.trashSchedule}</p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
          }`}>
            <span className={`font-black block text-xs font-mono uppercase ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              General House Norms
            </span>
            <ul className="space-y-2.5">
              {property.houseRules.map((rule, idx) => (
                <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                  <span className="text-[#E4E98E] font-black text-base leading-none">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MobileBottomSheet>

      {/* 6. Checkout Checklist Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'checkout'}
        onClose={() => setActiveDrawer(null)}
        title={t.guestGuide.cards.checkoutChecklist}
        subtitle={`Check-out time: ${property.checkOutTime}`}
        icon={<CheckSquare className="w-5 h-5 text-purple-400" />}
        stickyBottomAction={
          <button
            onClick={() => {
              triggerHaptic();
              setActiveDrawer(null);
              setIsReviewModalOpen(true);
            }}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Star className="w-4 h-4 fill-stone-950" />
            <span>{language === 'ka' ? 'შეაფასეთ თქვენი დასვენება ⭐⭐⭐⭐⭐' : language === 'ru' ? 'Оставить отзыв ⭐⭐⭐⭐⭐' : 'Leave Stay Review ⭐⭐⭐⭐⭐'}</span>
          </button>
        }
      >
        <div className="space-y-3.5">
          <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
            Please complete these quick steps before turning the door latch.
          </p>
          
          <div className="space-y-2.5">
            {property.departureChecklist.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  checkedItems[idx]
                    ? isDark ? 'bg-emerald-950/40 text-stone-400 line-through border-emerald-800/60' : 'bg-emerald-50 text-stone-500 line-through border-emerald-300'
                    : isDark ? 'bg-[#14191C] text-stone-100 border-stone-800 hover:border-stone-600' : 'bg-white text-stone-950 border-stone-300 shadow-2xs hover:border-stone-400'
                }`}
              >
                {checkedItems[idx] ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs sm:text-sm font-bold">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </MobileBottomSheet>

      {/* 7. Useful Stickers & Local Essentials Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'stickers'}
        onClose={() => setActiveDrawer(null)}
        title={language === 'ka' ? 'სასარგებლო ბარათები & სერვისები' : 'Useful Stickers & Essentials'}
        subtitle="24/7 Markets, Taxi Bolt, Trash, and neighborhood tips"
        icon={<ShoppingBag className="w-5 h-5 text-amber-500" />}
      >
        <div className="space-y-3.5">
          {/* 1. 24/7 Groceries & Supermarket */}
          <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${
            isDark ? 'bg-amber-950/25 border-amber-500/30 text-amber-100' : 'bg-amber-50/70 border-amber-300 text-stone-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  24/7 Groceries & Markets
                </span>
              </div>
              <span className="font-mono font-bold text-xs bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">Spar & Nikora</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              Convenience stores, fresh water, Georgian wine, and snacks are available 24/7 within a 2-minute walk.
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent('supermarket 24/7 near ' + property.address + ', ' + property.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Find Nearest 24/7 Supermarkets</span>
            </a>
          </div>

          {/* 2. Taxi & Transfers */}
          <div className={`p-4 rounded-2xl border space-y-2 shadow-xs ${
            isDark ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-stone-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Taxi & Transfers
                </span>
              </div>
              <span className="font-mono font-bold text-xs bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">Bolt App</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {property.taxiInfo}
            </p>
            <a
              href="https://bolt.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Bolt Taxi</span>
            </a>
          </div>

          {/* Trash & Recycling */}
          <div className={`p-4 rounded-2xl border space-y-1.5 shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
          }`}>
            <span className={`text-xs font-mono uppercase font-black tracking-wider block ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              Trash & Bin Location
            </span>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
              {property.trashSchedule}
            </p>
          </div>

          {/* Tap Water */}
          <div className={`p-4 rounded-2xl border space-y-1.5 shadow-xs ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-300'
          }`}>
            <span className={`text-xs font-mono uppercase font-black tracking-wider block ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
              💧 Tap Water Safety
            </span>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
              Tbilisi tap water is mountain spring water, crystal clear, tested daily, and completely safe to drink.
            </p>
          </div>

          {/* Discreet Emergency 112 Safety Link */}
          <div className="pt-2 pb-1 text-center">
            <a
              href={`tel:${property.emergencyServicesNumber || '112'}`}
              className={`text-xs font-medium inline-flex items-center justify-center gap-1.5 ${
                isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Need emergency services? Call 112 (24/7 in English & Russian)</span>
            </a>
          </div>
        </div>
      </MobileBottomSheet>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* GLOBAL MODALS: STAY FEEDBACK & INSTALL PWA PROMPT                */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {/* Private Stay Feedback Review Engine */}
      <ReviewEngineModal
        property={property}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Install to Phone Home Screen Modal */}
      <AddToHomeScreenModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

    </div>
  );
};
