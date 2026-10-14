import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ShoppingBag,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Eye
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
import { ShareGuideModal } from './ShareGuideModal';
import { GuestRequestModal } from './GuestRequestModal';
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
  const { 
    currentProperty, 
    showToast, 
    setCurrentRoute, 
    theme, 
    toggleTheme, 
    t, 
    language, 
    getLocalizedProperty, 
    setActiveMood,
    gems,
    guestFavorites,
    toggleGuestFavorite,
    isGuestFavorite
  } = useApp();
  const rawProperty = propertyOverride || currentProperty;
  const property = getLocalizedProperty(rawProperty);
  const isDark = theme === 'dark';

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<GuestTab>('stay');
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceGuide | null>(null);
  const [isPlayingAppVideo, setIsPlayingAppVideo] = useState(true);
  const [isMutedAppVideo, setIsMutedAppVideo] = useState(true);
  const appVideoRef = useRef<HTMLVideoElement>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [exploreViewMode, setExploreViewMode] = useState<'map' | 'list'>('map');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Saved favorite places from AppContext
  const favoriteGemsList = React.useMemo(() => {
    return gems.filter(g => isGuestFavorite(g.id));
  }, [gems, guestFavorites, isGuestFavorite]);

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

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    toggleGuestFavorite(id);
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

  if (!property) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${
        isDark ? 'bg-[#080B0D] text-stone-100' : 'bg-[#FBFBF9] text-stone-900'
      }`}>
        <div className="max-w-md w-full p-8 rounded-[32px] border space-y-4 bg-stone-500/5 border-stone-500/20 shadow-xl">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-amber-600 text-white font-black text-2xl font-serif shadow-sm">
            S
          </div>
          <h2 className="font-serif text-2xl font-bold">
            {language === 'ka' ? 'მეგზური ვერ მოიძებნა' : language === 'ru' ? 'Гид не найден' : 'Guide Not Found'}
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            {language === 'ka' 
              ? 'მოცემული აპარტამენტის მეგზური არ არსებობს ან ჯერ არ არის გამოქვეყნებული.' 
              : language === 'ru'
              ? 'Запрошенный цифровой гид не найден или ещё не был опубликован хозяином.'
              : 'The requested digital guest guide could not be found or has not been published yet.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentRoute('/')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-sm"
            >
              {language === 'ka' ? 'მთავარზე დაბრუნება' : language === 'ru' ? 'На главную' : 'Return Home'}
            </button>
            <button
              onClick={() => setCurrentRoute('/demo')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold border border-stone-500/30 text-inherit hover:bg-stone-500/10 transition-colors cursor-pointer"
            >
              {language === 'ka' ? 'დემო მეგზური' : language === 'ru' ? 'Смотреть демо' : 'View Demo Guide'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#141312] text-[#F7F5F0]' : 'bg-[#FAF8F5] text-[#1C1B1A]'} flex flex-col items-center justify-start font-sans tracking-tight transition-colors duration-200`}>
      
      {/* PRESENTATION CONTAINER: Clean modern web app canvas (full width on mobile, max-w-xl on desktop) */}
      <div className={`w-full max-w-xl min-h-screen flex flex-col relative transition-all duration-300 sm:border-x sm:shadow-xs ${
        isDark ? 'bg-[#141312] sm:border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FAF8F5] sm:border-[#EBE6DF] text-[#1C1B1A]'
      }`}>
        
        {/* NATIVE APP TOP HEADER BAR */}
        <header className={`px-4 py-3 flex items-center justify-between border-b backdrop-blur-xl sticky top-0 z-30 transition-colors ${
          isDark ? 'bg-[#141312]/92 border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FAF8F5]/92 border-[#EBE6DF] text-[#1C1B1A] shadow-2xs'
        }`}>
          {/* Property Identity & Superhost badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            {!isEmbed && (
              <button
                onClick={() => setCurrentRoute('/app')}
                className={`p-1.5 -ml-1.5 rounded-lg transition-colors shrink-0 flex items-center justify-center ${
                  isDark ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#EAE4DC]'
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
              className="w-9 h-9 rounded-full object-cover border border-[#EBE6DF] dark:border-[#2B2926] shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className={`text-sm font-serif font-bold truncate tracking-tight ${isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'}`}>
                  {property.title}
                </span>
              </div>
              <span className={`text-[11px] font-sans font-medium block truncate mt-0.5 tracking-tight ${
                isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
              }`}>
                {property.city} · {property.hostName} (Host)
              </span>
            </div>
          </div>

          {/* Top Actions: Theme Toggle, Quick Share & Compact Language Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                triggerHaptic();
                setIsShareModalOpen(true);
              }}
              aria-label="Share guide"
              title="Share guide with travelers"
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                isDark 
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' 
                  : 'bg-white border-[#EBE6DF] text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#FAF8F5]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                isDark 
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#FFC757] hover:bg-[#272522]' 
                  : 'bg-white border-[#EBE6DF] text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#FAF8F5]'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FFC757]" /> : <Moon className="w-4 h-4 text-[#5C5853]" />}
            </button>
            <LanguageSelector variant="compact" />
          </div>
        </header>

        {/* SCROLLABLE MOBILE CONTENT AREA */}
        <div className="flex-1 w-full pb-28">
          <AnimatePresence mode="wait">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 1: STAY (Apartment Manual, Fast Pass, Appliances, Rules)  */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'stay' && (
              <motion.div
                key="tab-stay"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 space-y-4"
              >
              
              {/* 1. HERO VISUAL COVER WITH WELCOME QUOTE & WEATHER */}
              <motion.div 
                whileHover={{ scale: 1.004 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative h-52 sm:h-56 rounded-2xl overflow-hidden shadow-warm-md border border-[#EBE6DF] dark:border-[#2B2926] group"
              >
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/92 via-[#141312]/40 to-transparent" />
                
                {/* Weather Pill (Top Right) */}
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 text-[#F7F5F0] text-xs font-medium flex items-center gap-1.5 shadow-2xs">
                  <span>🌤️</span>
                  <span className="font-semibold text-[11px] tracking-tight">22°C</span>
                </div>

                {/* Cover Text Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 w-fit mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F55A51] animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#F7F5F0] font-semibold">
                      {language === 'ka' ? 'დადასტურებული ბინა' : language === 'ru' ? 'Проверенное жильё' : 'STUMARI VERIFIED'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F5F0] tracking-tight leading-tight">
                    {language === 'ka' ? 'კეთილი იყოს თქვენი მობრძანება!' : 'Welcome to Old Tbilisi!'}
                  </h1>
                  <p className="text-xs text-[#ACA79F] line-clamp-2 mt-1 font-normal leading-relaxed max-w-sm tracking-tight">
                    {language === 'ka' 
                      ? 'თავი ისე იგრძენით, როგორც საკუთარ სახლში. ყველაფერი მზადაა კომფორტული დასვენებისთვის.' 
                      : 'Make yourself at home. Everything you need for a comfortable and memorable stay.'}
                  </p>
                </div>
              </motion.div>

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
                  <span className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${
                    isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
                  }`}>
                    {language === 'ka' ? 'თქვენი გზამკვლევი' : language === 'ru' ? 'Ваш гид' : 'YOUR STAY GUIDE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Check-in Instructions */}
                  <motion.button
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('checkin');
                    }}
                    className={`p-4 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all h-[140px] group shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#F55A51]/60 hover:bg-[#272522] text-[#F7F5F0]' 
                        : 'bg-white hover:bg-[#FDF1F0]/40 border-[#EBE6DF] hover:border-[#F55A51]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                        isDark ? 'bg-[#F55A51]/15 border-[#F55A51]/30 text-[#F55A51]' : 'bg-[#FDF1F0] border-[#F55A51]/25 text-[#F55A51]'
                      }`}>
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-serif font-bold block truncate leading-snug tracking-tight ${
                          isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                        }`}>
                          {t.guestGuide.cards.checkinTitle}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-medium leading-tight tracking-tight ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}>
                          Step-by-step arrival
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-75 group-hover:scale-105 transition-transform duration-300">
                      <CheckinArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-3 right-3 w-3.5 h-3.5 text-[#ACA79F] group-hover:text-[#F55A51] group-hover:translate-x-0.5 transition-all" />
                  </motion.button>

                  {/* Appliances & How Things Work */}
                  <motion.button
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('appliances');
                    }}
                    className={`p-4 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all h-[140px] group shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#748C96]/60 hover:bg-[#272522] text-[#F7F5F0]' 
                        : 'bg-white hover:bg-[#F0F4F6]/50 border-[#EBE6DF] hover:border-[#748C96]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                        isDark ? 'bg-[#748C96]/15 border-[#748C96]/30 text-[#9CB1BB]' : 'bg-[#F0F4F6] border-[#748C96]/25 text-[#4D6169]'
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-serif font-bold block truncate leading-snug tracking-tight ${
                          isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                        }`}>
                          {t.guestGuide.cards.howThingsWork}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-medium leading-tight tracking-tight ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}>
                          {property.appliances.length} appliances guided
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-75 group-hover:scale-105 transition-transform duration-300">
                      <AppliancesArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-3 right-3 w-3.5 h-3.5 text-[#ACA79F] group-hover:text-[#748C96] group-hover:translate-x-0.5 transition-all" />
                  </motion.button>

                  {/* House Rules & Quiet Hours */}
                  <motion.button
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('rules');
                    }}
                    className={`p-4 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all h-[140px] group shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#FFC757]/60 hover:bg-[#272522] text-[#F7F5F0]' 
                        : 'bg-white hover:bg-[#FFF9ED]/50 border-[#EBE6DF] hover:border-[#FFC757]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                        isDark ? 'bg-[#FFC757]/15 border-[#FFC757]/30 text-[#FFC757]' : 'bg-[#FFF9ED] border-[#FFC757]/30 text-[#996F00]'
                      }`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-serif font-bold block truncate leading-snug tracking-tight ${
                          isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                        }`}>
                          {t.guestGuide.cards.houseRules}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-medium leading-tight tracking-tight ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}>
                          {property.quietHours}
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-75 group-hover:scale-105 transition-transform duration-300">
                      <HouseRulesArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-3 right-3 w-3.5 h-3.5 text-[#ACA79F] group-hover:text-[#FFC757] group-hover:translate-x-0.5 transition-all" />
                  </motion.button>

                  {/* Departure Checklist */}
                  <motion.button
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('checkout');
                    }}
                    className={`p-4 rounded-2xl border text-left flex justify-between relative overflow-hidden transition-all h-[140px] group shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#F55A51]/60 hover:bg-[#272522] text-[#F7F5F0]' 
                        : 'bg-white hover:bg-[#FDF1F0]/40 border-[#EBE6DF] hover:border-[#F55A51]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full z-10 min-w-0 pr-1 flex-1">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                        isDark ? 'bg-[#F55A51]/15 border-[#F55A51]/30 text-[#F55A51]' : 'bg-[#FDF1F0] border-[#F55A51]/25 text-[#F55A51]'
                      }`}>
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs sm:text-sm font-serif font-bold block truncate leading-snug tracking-tight ${
                          isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                        }`}>
                          {t.guestGuide.cards.checkoutChecklist}
                        </span>
                        <span className={`text-[11px] block line-clamp-2 mt-0.5 font-medium leading-tight tracking-tight ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}>
                          {property.checkOutTime}
                        </span>
                      </div>
                    </div>
                    {/* Illustration */}
                    <div className="shrink-0 -mr-2 -mt-1 opacity-75 group-hover:scale-105 transition-transform duration-300">
                      <DepartureArtSketch className="w-20 h-20" isDark={isDark} />
                    </div>
                    <ChevronRight className="absolute bottom-3 right-3 w-3.5 h-3.5 text-[#ACA79F] group-hover:text-[#F55A51] group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                </div>
              </div>

              {/* 5. "USEFUL STICKERS" (Emergency, Taxi, Trash) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${
                    isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
                  }`}>
                    {language === 'ka' ? 'სასარგებლო ბარათები' : language === 'ru' ? 'Полезные стикеры' : 'USEFUL STICKERS'}
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('stickers');
                    }}
                    className={`text-xs font-medium hover:underline flex items-center gap-0.5 transition-colors cursor-pointer ${
                      isDark ? 'text-[#F7F5F0] hover:text-white' : 'text-[#1C1B1A] hover:text-[#F55A51]'
                    }`}
                  >
                    <span>{language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'View all'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Sticker 1: 24/7 Groceries & Local Market */}
                  <motion.a
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    href={`https://maps.google.com/?q=${encodeURIComponent(`supermarket 24/7 near ${property.address}, ${property.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHaptic()}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all group shadow-warm-sm hover:shadow-warm-md h-[92px] cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#FFC757]/40 text-[#F7F5F0] hover:bg-[#272522]' 
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] hover:border-[#FFC757]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#FFF9ED] dark:bg-[#FFC757]/15 border border-[#FFC757]/30 text-[#996F00] dark:text-[#FFC757] flex items-center justify-center shrink-0 shadow-2xs">
                      <ShoppingBag className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold leading-tight truncate w-full px-0.5 tracking-tight">
                      {language === 'ka' ? 'მარკეტი 24/7' : language === 'ru' ? 'Маркет 24/7' : '24/7 Market'}
                    </span>
                    <div className="opacity-75 group-hover:scale-105 transition-transform">
                      <GroceryMarketSketch className="w-11 h-7" isDark={isDark} />
                    </div>
                  </motion.a>

                  {/* Sticker 2: Taxi & Transfers */}
                  <motion.button
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('list');
                      setActiveTab('explore');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all group shadow-warm-sm hover:shadow-warm-md h-[92px] cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#748C96]/40 text-[#F7F5F0] hover:bg-[#272522]' 
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] hover:border-[#748C96]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#F0F4F6] dark:bg-[#748C96]/15 border border-[#748C96]/25 text-[#4D6169] dark:text-[#9CB1BB] flex items-center justify-center shrink-0 shadow-2xs">
                      <Car className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold leading-tight truncate w-full px-0.5 tracking-tight">
                      {language === 'ka' ? 'ტაქსი' : language === 'ru' ? 'Такси' : 'Taxi & Bolt'}
                    </span>
                    <div className="opacity-75 group-hover:scale-105 transition-transform">
                      <TaxiSedanSketch className="w-12 h-7" isDark={isDark} />
                    </div>
                  </motion.button>

                  {/* Sticker 3: Trash & Recycling */}
                  <motion.button
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('rules');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all group shadow-warm-sm hover:shadow-warm-md h-[92px] cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#3B3833] text-[#F7F5F0] hover:bg-[#272522]' 
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] hover:border-[#DDD8CF] text-[#1C1B1A]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#F3EFE9] dark:bg-[#272522] border border-[#DDD8CF] dark:border-[#3B3833] text-[#5C5853] dark:text-[#ACA79F] flex items-center justify-center shrink-0 shadow-2xs">
                      <Trash2 className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold leading-tight truncate w-full px-0.5 tracking-tight">
                      {language === 'ka' ? 'ნაგავი' : language === 'ru' ? 'Мусор' : 'Trash & Bins'}
                    </span>
                    <div className="opacity-75 group-hover:scale-105 transition-transform">
                      <RecyclingBinsSketch className="w-12 h-7" isDark={isDark} />
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* 7. "HOW IS YOUR STAY GOING?" REVIEW BANNER */}
              <motion.div 
                whileHover={{ scale: 1.006, y: -2 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all shadow-warm-sm hover:shadow-warm-md ${
                isDark 
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                  : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF9ED] dark:bg-[#FFC757]/15 border border-[#FFC757]/30 text-[#FFC757] flex items-center justify-center shrink-0 shadow-2xs">
                    <Star className="w-4 h-4 fill-[#FFC757] text-[#FFC757]" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-xs font-serif font-bold block truncate tracking-tight ${
                      isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                    }`}>
                      {language === 'ka' ? 'როგორ მიმდინარეობს დასვენება?' : language === 'ru' ? 'Как проходит ваш отдых?' : 'How is your stay going?'}
                    </span>
                    <span className={`text-[11px] block truncate font-medium tracking-tight ${
                      isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                    }`}>
                      {language === 'ka' ? 'დაუტოვეთ პირადი შეფასება მასპინძელს' : language === 'ru' ? 'Оставьте отзыв для хозяина' : 'Leave private feedback for your host'}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    triggerHaptic();
                    setIsReviewModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl font-semibold text-xs shrink-0 shadow-xs cursor-pointer transition-all bg-[#F55A51] hover:bg-[#E04840] text-white"
                >
                  {language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Отзыв' : 'Review'}
                </motion.button>
              </motion.div>

              {/* 8. "NEARBY GEMS" CAROUSEL */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${
                    isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
                  }`}>
                    {language === 'ka' ? 'ახლომდებარე ადგილები' : language === 'ru' ? 'Места поблизости' : 'NEARBY GEMS'}
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveTab('gems');
                    }}
                    className={`text-xs font-medium hover:underline flex items-center gap-0.5 transition-colors cursor-pointer ${
                      isDark ? 'text-[#F7F5F0] hover:text-white' : 'text-[#1C1B1A] hover:text-[#F55A51]'
                    }`}
                  >
                    <span>{language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'View all'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1.5">
                  {nearbyGems.map(gem => (
                    <motion.div
                      key={gem.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={() => {
                        triggerHaptic();
                        setActiveTab('gems');
                      }}
                      className={`rounded-2xl border overflow-hidden shrink-0 w-44 transition-all duration-300 cursor-pointer group shadow-warm-sm hover:shadow-warm-md ${
                        isDark 
                          ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0] hover:border-[#3B3833]' 
                          : 'bg-white border-[#EBE6DF] text-[#1C1B1A] hover:border-[#DDD8CF]'
                      }`}
                    >
                      <div className="relative h-28 w-full overflow-hidden bg-[#272522]">
                        <img 
                          src={gem.image} 
                          alt={gem.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold truncate pr-1 tracking-tight ${
                            isDark ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                          }`}>
                            {gem.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic();
                              toggleGuestFavorite(gem.id, gem.title);
                            }}
                            className={`p-1.5 rounded-lg transition-all active:scale-75 cursor-pointer ${
                              isGuestFavorite(gem.id)
                                ? 'text-[#F55A51]'
                                : 'text-[#ACA79F] hover:text-[#F55A51]'
                            }`}
                            aria-label="Save to favorites"
                            title={isGuestFavorite(gem.id) ? "Saved to favorites" : "Save to favorites"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isGuestFavorite(gem.id) ? 'fill-[#F55A51] text-[#F55A51]' : ''}`} />
                          </button>
                        </div>
                        <span className={`text-[11px] font-medium flex items-center gap-1 mt-1 tracking-tight ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}>
                          <MapPin className="w-3 h-3 text-[#748C96]" />
                          <span>{gem.time}</span>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 9. "NEED HELP?" (3 Action Cards) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${
                    isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'
                  }`}>
                    {language === 'ka' ? 'დახმარება' : language === 'ru' ? 'Помощь' : 'NEED HELP?'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <motion.a
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am staying at ${property.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#3B3833] text-[#F7F5F0] hover:bg-[#272522]' 
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] hover:border-[#DDD8CF] text-[#1C1B1A]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium tracking-tight">
                      {language === 'ka' ? 'ჩატი' : language === 'ru' ? 'Чат' : 'Chat'}
                    </span>
                  </motion.a>

                  <motion.a
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    href={`tel:${property.hostPhone}`}
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#3B3833] text-[#F7F5F0] hover:bg-[#272522]' 
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] hover:border-[#DDD8CF] text-[#1C1B1A]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#748C96]/15 border border-[#748C96]/30 text-[#748C96] dark:text-[#98B1BC] flex items-center justify-center shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium tracking-tight">
                      {language === 'ka' ? 'ზარი' : language === 'ru' ? 'Звонок' : 'Call'}
                    </span>
                  </motion.a>

                  <motion.a
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    href={`tel:${property.emergencyServicesNumber || '112'}`}
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-warm-sm hover:shadow-warm-md cursor-pointer ${
                      isDark 
                        ? 'bg-[#1F1E1C] border-[#2B2926] hover:border-[#3B3833] text-[#F7F5F0] hover:bg-[#272522]' 
                        : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] hover:border-[#DDD8CF] text-[#1C1B1A]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 dark:text-red-400 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                      SOS
                    </div>
                    <span className="text-[11px] font-medium tracking-tight">112 SOS</span>
                  </motion.a>
                </div>
              </div>

              {/* 10. "EXPLORE TBILISI LIKE A LOCAL" BANNER */}
              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col justify-between transition-all shadow-warm-md ${
                isDark 
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                  : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                {/* Background Panoramic Sketch */}
                <div className="absolute inset-0 pointer-events-none opacity-15">
                  <TbilisiPanoramaSketch isDark={isDark} />
                </div>

                <div className="relative z-10 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5 text-[#ACA79F] font-medium text-xs">
                    <span>✨</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider">Curated by Stumari</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'აღმოაჩინეთ თბილისი როგორც ადგილობრივმა' : language === 'ru' ? 'Исследуйте Тбилиси как местный житель' : 'Explore Tbilisi Like a Local'}
                  </h3>
                </div>

                <div className="relative z-10 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      triggerHaptic();
                      setActiveTab('gems');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <span>{language === 'ka' ? 'ადგილების ნახვა' : language === 'ru' ? 'Смотреть места' : 'Discover Gems'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: GEMS (Curated Local Secrets & Tbilisi Library)           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'gems' && (
            <motion.div 
              key="tab-gems"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 pb-4"
            >
              <StumariGemsSection 
                hostName={property.hostName} 
                hostAvatar={property.hostAvatar} 
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: EXPLORE (Interactive Offline Map & Getting Around)        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'explore' && (
            <motion.div 
              key="tab-explore"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-[740px]"
            >
              {/* Segmented Switcher: Map vs Transit info */}
              <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 transition-colors ${
                isDark ? 'border-[#2B2926] bg-[#141312]' : 'border-[#EBE6DF] bg-[#FAF8F5]'
              }`}>
                <div>
                  <span className="text-xs sm:text-sm font-semibold block tracking-tight">
                    {exploreViewMode === 'map' 
                      ? (language === 'ka' ? 'თბილისის ინტერაქტიული რუკა' : language === 'ru' ? 'Интерактивная карта' : 'Interactive Tbilisi Map')
                      : (language === 'ka' ? 'ტრანსპორტი და გადაადგილება' : language === 'ru' ? 'Транспорт и такси' : 'Transit, Taxis & Etiquette')}
                  </span>
                  <span className={`text-[11px] font-medium tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
                    {exploreViewMode === 'map' ? 'Offline-ready · Walk times' : 'Local transport guides & tips'}
                  </span>
                </div>

                <div className={`p-1 rounded-xl border flex items-center text-xs font-medium relative shadow-2xs ${
                  isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-[#F3EFE9] border-[#EBE6DF]'
                }`}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('map');
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-semibold relative z-10 cursor-pointer ${
                      exploreViewMode === 'map'
                        ? 'text-white'
                        : isDark ? 'text-[#ACA79F] hover:text-[#F7F5F0]' : 'text-[#5C5853] hover:text-[#1C1B1A]'
                    }`}
                  >
                    {exploreViewMode === 'map' && (
                      <motion.div
                        layoutId="activeExploreSegment"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        className="absolute inset-0 rounded-lg shadow-xs bg-[#F55A51]"
                      />
                    )}
                    <span className="relative z-10">{language === 'ka' ? '🗺️ რუკა' : language === 'ru' ? '🗺️ Карта' : '🗺️ Map'}</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('list');
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-semibold relative z-10 cursor-pointer ${
                      exploreViewMode === 'list'
                        ? 'text-white'
                        : isDark ? 'text-[#ACA79F] hover:text-[#F7F5F0]' : 'text-[#5C5853] hover:text-[#1C1B1A]'
                    }`}
                  >
                    {exploreViewMode === 'list' && (
                      <motion.div
                        layoutId="activeExploreSegment"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        className="absolute inset-0 rounded-lg shadow-xs bg-[#F55A51]"
                      />
                    )}
                    <span className="relative z-10">{language === 'ka' ? '🚕 ტრანსპორტი' : language === 'ru' ? '🚕 Транспорт' : '🚕 Transit'}</span>
                  </motion.button>
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
                <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
                  
                  {/* Taxi / Bolt */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all shadow-warm-sm hover:shadow-warm-md ${
                    isDark 
                      ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                      : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                          isDark ? 'bg-[#748C96]/15 border-[#748C96]/30 text-[#98B1BC]' : 'bg-[#F0F4F6] border-[#748C96]/25 text-[#47606B]'
                        }`}>
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold block tracking-tight">{t.propertyHub.forms.taxiBolt}</span>
                          <span className={`text-xs font-medium tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>Bolt App · Recommended Taxi</span>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-lg border ${
                        isDark ? 'bg-[#272522] text-[#F7F5F0] border-[#3B3833]' : 'bg-[#F3EFE9] text-[#1C1B1A] border-[#EBE6DF]'
                      }`}>
                        ~5-7 GEL
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed font-normal tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                      {property.taxiInfo}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <a
                        href="https://bolt.eu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 bg-[#F55A51] hover:bg-[#E04840] text-white cursor-pointer"
                      >
                        <span>{language === 'ka' ? 'Bolt ტაქსის გამოძახება' : language === 'ru' ? 'Вызвать Bolt' : 'Open Bolt App'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className={`text-[11px] font-normal tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#8A857D]'}`}>
                        Destination pre-sets
                      </span>
                    </div>
                  </div>

                  {/* Public Transit / Metro */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all shadow-warm-sm hover:shadow-warm-md ${
                    isDark 
                      ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                      : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                          isDark ? 'bg-[#748C96]/15 border-[#748C96]/30 text-[#98B1BC]' : 'bg-[#F0F4F6] border-[#748C96]/25 text-[#47606B]'
                        }`}>
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold block tracking-tight">{t.propertyHub.forms.transitMetro}</span>
                          <span className={`text-xs font-medium tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>{t.guestGuide.cards.transport}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-lg border ${
                        isDark ? 'bg-[#272522] text-[#F7F5F0] border-[#3B3833]' : 'bg-[#F3EFE9] text-[#1C1B1A] border-[#EBE6DF]'
                      }`}>
                        1.00 GEL
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed font-normal tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                      {property.transitInfo}
                    </p>
                    <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      isDark ? 'bg-[#272522] border-[#3B3833] text-[#F7F5F0]' : 'bg-[#F3EFE9] border-[#EBE6DF] text-[#1C1B1A]'
                    }`}>
                      <CreditCard className="w-4 h-4 text-[#748C96] shrink-0" />
                      <span><strong>Tip:</strong> Tap your physical Visa / Mastercard directly at turnstiles (1.00 GEL / 90 min free transfer).</span>
                    </div>
                  </div>

                  {/* Airport Transit */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all shadow-warm-sm hover:shadow-warm-md ${
                    isDark 
                      ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                      : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                          isDark ? 'bg-[#FFC757]/15 border-[#FFC757]/30 text-[#FFC757]' : 'bg-[#FFF9ED] border-[#FFC757]/30 text-[#996F00]'
                        }`}>
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold block tracking-tight">{t.propertyHub.forms.airportTransit}</span>
                          <span className={`text-xs font-medium tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>TBS Shota Rustaveli Airport (~17 km)</span>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-lg border ${
                        isDark ? 'bg-[#272522] text-[#F7F5F0] border-[#3B3833]' : 'bg-[#F3EFE9] text-[#1C1B1A] border-[#EBE6DF]'
                      }`}>
                        ~25-30 GEL
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed font-normal tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                      {property.airportTransit}
                    </p>
                  </div>

                  {/* Local City Etiquette */}
                  <div className={`p-4 rounded-2xl border space-y-3 shadow-warm-sm ${
                    isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FFC757]" />
                      <h4 className="font-serif font-bold text-sm sm:text-base tracking-tight">
                        {language === 'ka' ? 'თბილისური რჩევები და ეტიკეტი' : language === 'ru' ? 'Советы и этикет в Тбилиси' : 'Tbilisi Etiquette & Local Notes'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-[#272522] border-[#3B3833]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                      }`}>
                        <span className="font-semibold block mb-0.5 tracking-tight">💧 Tap Water</span>
                        <p className={`leading-relaxed ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                          Tbilisi tap water comes from mountain reservoirs and is 100% clean and delicious to drink.
                        </p>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-[#272522] border-[#3B3833]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                      }`}>
                        <span className="font-semibold block mb-0.5 tracking-tight">💳 Cards Everywhere</span>
                        <p className={`leading-relaxed ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                          Apple Pay and contactless cards work almost everywhere. Cash is only needed for small church stalls or flea markets.
                        </p>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-[#272522] border-[#3B3833]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                      }`}>
                        <span className="font-semibold block mb-0.5 tracking-tight">🗣️ Georgian Words</span>
                        <p className={`leading-relaxed ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                          <strong>Gamarjoba</strong> (Hello) · <strong>Madloba</strong> (Thank you) · <strong>Gaumarjos</strong> (Cheers!)
                        </p>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-[#272522] border-[#3B3833]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                      }`}>
                        <span className="font-semibold block mb-0.5 tracking-tight">🥟 Khinkali Rule</span>
                        <p className={`leading-relaxed ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                          Never use a fork! Grab the crown by hand, bite the side, sip the broth first, then eat. Leave the tail on the plate.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 4: REVIEW (Direct Feedback Engine)                          */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'feedback' && (
            <motion.div
              key="tab-feedback"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 space-y-4"
            >
              
              <div className={`p-6 rounded-2xl border text-center space-y-4 shadow-warm-md ${
                isDark 
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                  : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <div className="w-14 h-14 rounded-2xl bg-[#FFF9ED] dark:bg-[#FFC757]/15 border border-[#FFC757]/30 text-[#FFC757] flex items-center justify-center mx-auto shadow-2xs">
                  <Star className="w-7 h-7 fill-[#FFC757] text-[#FFC757]" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'როგორ ჩაიარა თქვენმა დასვენებამ?' : language === 'ru' ? 'Как прошло ваше пребывание?' : 'How was your stay?'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1.5 max-w-sm mx-auto font-normal leading-relaxed tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
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
                      className="p-2 rounded-xl bg-[#FFF9ED] dark:bg-[#FFC757]/10 border border-[#FFC757]/30 text-[#FFC757] hover:scale-110 active:scale-95 transition-all shadow-2xs cursor-pointer"
                      title={`Rate ${star} Stars`}
                    >
                      <Star className="w-6 h-6 fill-[#FFC757] text-[#FFC757]" />
                    </button>
                  ))}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setIsReviewModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  {language === 'ka' ? 'შეფასების დატოვება ⭐⭐⭐⭐⭐' : language === 'ru' ? 'Оставить отзыв ⭐⭐⭐⭐⭐' : 'Start Stay Feedback ⭐⭐⭐⭐⭐'}
                </button>
              </div>

              {/* Host Promise Note & Direct Fast WhatsApp */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-warm-sm ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <div className="flex items-center gap-3">
                  <img 
                    src={property.hostAvatar} 
                    alt={property.hostName} 
                    className="w-11 h-11 rounded-full object-cover border border-[#EBE6DF] dark:border-[#2B2926] shrink-0 shadow-xs" 
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-sm block tracking-tight">{property.hostName}'s Promise</span>
                    <span className={`block text-xs mt-0.5 font-normal tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                      "Any issue during your stay? Text me on WhatsApp so I can solve it within minutes!"
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am currently staying at ${property.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 active:scale-95 transition-all shadow-xs"
                  title="Direct WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 5: HOST & HELP (Saba Superhost, WhatsApp, Emergency 112)   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'host' && (
            <motion.div
              key="tab-host"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 space-y-4"
            >
              
              {/* Host Card */}
              <div className={`p-6 rounded-2xl border text-center space-y-4 shadow-warm-md ${
                isDark 
                  ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
                  : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <div className="relative inline-block mx-auto">
                  <img
                    src={property.hostAvatar}
                    alt={property.hostName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#EBE6DF] dark:border-[#2B2926] shadow-warm-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs ring-2 ring-white dark:ring-[#141312]">
                    ✓
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold tracking-tight">
                    {property.hostName}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#FFF9ED] dark:bg-[#FFC757]/15 text-[#996F00] dark:text-[#FFC757] border border-[#FFC757]/30">
                      ★ {property.hostRole || 'Superhost'} · 5.0 (120+ stays)
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm mt-2 max-w-sm mx-auto font-normal leading-relaxed tracking-tight ${isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
                    {property.welcomeGreeting || 'Always happy to help make your Tbilisi stay unforgettable. I usually reply within 5 minutes.'}
                  </p>
                </div>

                {/* Direct Host Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am staying at ${property.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${property.hostPhone}`}
                    className={`py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all border cursor-pointer ${
                      isDark ? 'bg-[#272522] hover:bg-[#322F2B] text-[#F7F5F0] border-[#3B3833]' : 'bg-[#FAF8F5] hover:bg-[#EAE4DC] text-[#1C1B1A] border-[#EBE6DF]'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>{language === 'ka' ? 'დარეკვა' : language === 'ru' ? 'Позвонить' : 'Call Host'}</span>
                  </a>
                </div>

                {/* Direct Request to Host Team */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setIsRequestModalOpen(true);
                  }}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FFC757]" />
                  <span>{language === 'ka' ? 'მოთხოვნის გაგზავნა (პირსახოცები, დახმარება)' : 'Send Request to Host (Linens, Luggage, Help)'}</span>
                </button>
              </div>

              {/* Property Address & Map Shortcut Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-warm-sm ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F55A51]" />
                    <span className="text-xs font-mono uppercase font-semibold tracking-wider text-[#ACA79F]">
                      Apartment Address
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${property.address}, ${property.city}`, 'door')}
                    className="text-xs font-medium text-[#748C96] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'ka' ? 'კოპირება' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold tracking-tight">
                  {property.address}, {property.city}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer ${
                    isDark ? 'bg-[#272522] border-[#3B3833] text-[#F7F5F0] hover:bg-[#322F2B]' : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A] hover:bg-[#EAE4DC]'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-[#748C96]" />
                  <span>Open in Google Maps for Taxi / Couriers</span>
                </a>
              </div>

              {/* Emergency Services 112 Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-warm-sm ${
                isDark ? 'bg-[#281518] border-red-900/40 text-red-100' : 'bg-red-50/70 border-red-200 text-stone-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-400">
                      {t.guestGuide.cards.emergency112}
                    </span>
                  </div>
                  <span className="font-mono font-black text-base text-red-600 dark:text-red-400">112</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-red-200/90' : 'text-stone-700'}`}>
                  Police, Ambulance, and Fire Rescue in Georgia (English & Russian operators available 24/7).
                </p>
                <a
                  href={`tel:${property.emergencyServicesNumber || '112'}`}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 stroke-[2.2]" />
                  <span>{t.guestGuide.cards.emergencyCall}</span>
                </a>
              </div>

            </motion.div>
          )}

          </AnimatePresence>
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
            className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{t.guestGuide.cards.viewOnMaps}</span>
          </a>
        }
      >
        <div className="space-y-4 tracking-tight">
          {/* Code Banner */}
          <div className={`p-5 rounded-xl border text-center space-y-2 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <span className={`text-xs uppercase font-mono font-semibold tracking-wider block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t.guestGuide.cards.doorCodeTitle}
            </span>
            <div className={`font-mono text-4xl sm:text-5xl font-bold tracking-widest my-1 select-all ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {property.doorKeypadCode}
            </div>
            <button
              onClick={() => handleCopy(property.doorKeypadCode, 'door')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                isDark ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'
              }`}
            >
              {doorCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{doorCopied ? t.common.copied : t.common.copy}</span>
            </button>
          </div>

          <div>
            <h4 className={`font-semibold text-xs uppercase font-mono mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t.guestGuide.cards.directionsTitle}
            </h4>
            <p className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed font-normal shadow-sm ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'
            }`}>
              {property.arrivalDirections}
            </p>
          </div>

          <div>
            <h4 className={`font-semibold text-xs uppercase font-mono mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t.guestGuide.cards.parkingTitle}
            </h4>
            <p className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed font-normal shadow-sm ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'
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
        <div className="space-y-4 text-center tracking-tight">
          <div className={`p-6 rounded-xl border space-y-3 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <span className={`text-xs uppercase font-mono font-semibold tracking-wider block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t.propertyHub.forms.networkName}
            </span>
            <div className={`text-2xl font-bold font-mono select-all ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {property.wifiNetwork}
            </div>

            <div className="pt-3 border-t border-zinc-800">
              <span className={`text-xs uppercase font-mono font-semibold tracking-wider block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t.guestGuide.cards.wifiPassword}
              </span>
              <div className={`text-3xl sm:text-4xl font-mono font-bold tracking-widest my-2 select-all ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {property.wifiPassword}
              </div>
            </div>

            <button
              onClick={() => handleCopy(property.wifiPassword, 'wifi')}
              className={`w-full mt-3 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer ${
                isDark ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100'
              }`}
            >
              {wifiCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
        <div className="space-y-3 tracking-tight">
          {property.appliances.map(app => (
            <div 
              key={app.id}
              onClick={() => {
                triggerHaptic();
                setSelectedAppliance(app);
                setActiveDrawer('selected_appliance');
              }}
              className={`p-4 rounded-2xl border space-y-2.5 transition-all shadow-xs cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-100' 
                  : 'bg-white border-stone-200 hover:border-stone-300 text-stone-900'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 font-semibold text-base">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-stone-200 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                    {getApplianceIcon(app.icon)}
                  </div>
                  <span className="font-semibold text-base">{app.title}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-[#F55A51]/15 text-[#F55A51] border border-[#F55A51]/30 flex items-center gap-1 shrink-0 group-hover:bg-[#F55A51] group-hover:text-white transition-colors">
                  <Play className="w-3 h-3 fill-current" />
                  <span>{language === 'ka' ? 'ვიდეო გიდი' : '10s Guide'}</span>
                </span>
              </div>
              
              <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                {app.instructions}
              </p>

              {app.troubleshooting && (
                <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                  isDark ? 'bg-zinc-850/60 border-zinc-800 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-800'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span><strong>Troubleshooting:</strong> {app.troubleshooting}</span>
                </div>
              )}

              {/* Direct Host WhatsApp Assistance */}
              <div className="pt-2 border-t border-stone-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className={`font-normal ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                  {language === 'ka' ? 'დააწკაპუნეთ ვიდეო ინსტრუქციის სანახავად' : 'Tap to open video & guide'}
                </span>
                <span className="font-semibold text-[#F55A51] group-hover:underline flex items-center gap-1">
                  <span>Open Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </MobileBottomSheet>

      {/* 4. Single Selected Appliance Interactive Modal / Drawer with 10-Sec Video */}
      {selectedAppliance && (() => {
        const mediaSource = selectedAppliance.mediaUrl || (selectedAppliance.id === 'app-1' || selectedAppliance.id === 'app-ob-1' ? '/tbilisi-twilight.mp4' : undefined);
        const isVideoMedia = selectedAppliance.mediaType === 'video' || (!selectedAppliance.mediaType && mediaSource?.endsWith('.mp4'));

        return (
          <MobileBottomSheet
            isOpen={activeDrawer === 'selected_appliance'}
            onClose={() => {
              setActiveDrawer(null);
              setSelectedAppliance(null);
            }}
            title={selectedAppliance.title}
            subtitle={language === 'ka' ? 'ვიდეო ინსტრუქცია და მოხმარების წესები' : 'Video instruction & step-by-step guide'}
            icon={getApplianceIcon(selectedAppliance.icon)}
            stickyBottomAction={
              <a
                href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I have a quick question about ${selectedAppliance.title} in ${property.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask {property.hostName} on WhatsApp</span>
              </a>
            }
          >
            <div className="space-y-4 tracking-tight">
              {/* Clean Auto-Looping 10-Second Video Player with Play/Pause & Audio controls */}
              {mediaSource ? (
                <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10 bg-black relative shadow-lg">
                  {isVideoMedia ? (
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                      <video
                        ref={appVideoRef}
                        src={mediaSource}
                        autoPlay
                        loop
                        muted={isMutedAppVideo}
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Video Player Floating Controls */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white border border-white/20">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>10s Visual Guide</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (appVideoRef.current) {
                                if (appVideoRef.current.paused) {
                                  appVideoRef.current.play();
                                  setIsPlayingAppVideo(true);
                                } else {
                                  appVideoRef.current.pause();
                                  setIsPlayingAppVideo(false);
                                }
                              }
                            }}
                            className="p-2 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                            title={isPlayingAppVideo ? "Pause" : "Play"}
                          >
                            {isPlayingAppVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (appVideoRef.current) {
                                appVideoRef.current.muted = !isMutedAppVideo;
                                setIsMutedAppVideo(!isMutedAppVideo);
                              }
                            }}
                            className="p-2 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                            title={isMutedAppVideo ? "Unmute" : "Mute"}
                          >
                            {isMutedAppVideo ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full bg-stone-900 flex items-center justify-center">
                      <img
                        src={mediaSource}
                        alt={selectedAppliance.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-mono border border-white/20">
                        Photo Guide
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl p-4 bg-stone-100 dark:bg-zinc-850 border border-stone-200 dark:border-zinc-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-zinc-300">
                    <Video className="w-4 h-4 text-[#F55A51]" />
                    <span>{language === 'ka' ? 'ტექსტური ინსტრუქცია' : 'Text Instructions'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">Verified Guide</span>
                </div>
              )}

              {/* Operating Instructions */}
              <div className={`p-4 rounded-2xl border space-y-2 shadow-xs ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
              }`}>
                <h4 className={`font-bold text-xs font-mono uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                  {language === 'ka' ? 'მოხმარების წესები' : 'Operating Instructions'}
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                  {selectedAppliance.instructions}
                </p>
              </div>

              {/* Troubleshooting */}
              {selectedAppliance.troubleshooting && (
                <div className={`p-4 rounded-2xl border space-y-2 shadow-xs ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-amber-50/70 border-amber-200 text-stone-900'
                }`}>
                  <h4 className="font-bold text-xs font-mono uppercase flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{language === 'ka' ? 'ხარვეზის აღმოფხვრა' : 'Troubleshooting'}</span>
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                    {selectedAppliance.troubleshooting}
                  </p>
                </div>
              )}
            </div>
          </MobileBottomSheet>
        );
      })()}

      {/* 5. House Rules Sheet */}
      <MobileBottomSheet
        isOpen={activeDrawer === 'rules'}
        onClose={() => setActiveDrawer(null)}
        title={t.guestGuide.cards.houseRules}
        subtitle="Quiet hours, garbage schedule & house norms"
        icon={<BookOpen className="w-5 h-5 text-amber-400" />}
      >
        <div className="space-y-3 tracking-tight">
          <div className={`p-4 rounded-xl border shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <span className={`font-semibold block text-xs font-mono uppercase mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t.guestGuide.cards.quietHoursLabel}
            </span>
            <p className={`font-bold text-lg ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{property.quietHours}</p>
          </div>

          <div className={`p-4 rounded-xl border shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <span className={`font-semibold block text-xs font-mono uppercase mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t.guestGuide.cards.trashScheduleLabel}
            </span>
            <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{property.trashSchedule}</p>
          </div>

          <div className={`p-4 rounded-xl border space-y-2.5 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <span className={`font-semibold block text-xs font-mono uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              General House Norms
            </span>
            <ul className="space-y-2">
              {property.houseRules.map((rule, idx) => (
                <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm font-normal ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  <span className="text-zinc-400 font-bold text-base leading-none">•</span>
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
        icon={<CheckSquare className="w-5 h-5 text-zinc-300" />}
        stickyBottomAction={
          <button
            onClick={() => {
              triggerHaptic();
              setActiveDrawer(null);
              setIsReviewModalOpen(true);
            }}
            className="w-full py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{language === 'ka' ? 'შეაფასეთ თქვენი დასვენება ⭐⭐⭐⭐⭐' : language === 'ru' ? 'Оставить отзыв ⭐⭐⭐⭐⭐' : 'Leave Stay Review ⭐⭐⭐⭐⭐'}</span>
          </button>
        }
      >
        <div className="space-y-3.5 tracking-tight">
          <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Please complete these quick steps before turning the door latch.
          </p>
          
          <div className="space-y-2">
            {property.departureChecklist.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer shadow-sm ${
                  checkedItems[idx]
                    ? isDark ? 'bg-zinc-900/60 text-zinc-500 line-through border-zinc-800' : 'bg-zinc-100 text-zinc-400 line-through border-zinc-200'
                    : isDark ? 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:border-zinc-700' : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {checkedItems[idx] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                )}
                <span className="text-xs sm:text-sm font-medium">{item}</span>
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
        icon={<ShoppingBag className="w-5 h-5 text-zinc-300" />}
      >
        <div className="space-y-3 tracking-tight">
          {/* 1. 24/7 Groceries & Supermarket */}
          <div className={`p-4 rounded-xl border space-y-2 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                <span className="font-semibold text-xs uppercase tracking-wider text-zinc-300">
                  24/7 Groceries & Markets
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">Spar & Nikora</span>
            </div>
            <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Convenience stores, fresh water, Georgian wine, and snacks are available 24/7 within a 2-minute walk.
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent('supermarket 24/7 near ' + property.address + ', ' + property.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all border border-zinc-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Find Nearest 24/7 Supermarkets</span>
            </a>
          </div>

          {/* 2. Taxi & Transfers */}
          <div className={`p-4 rounded-xl border space-y-2 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-xs uppercase tracking-wider text-zinc-300">
                  Taxi & Transfers
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">Bolt App</span>
            </div>
            <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {property.taxiInfo}
            </p>
            <a
              href="https://bolt.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm border border-zinc-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Bolt Taxi</span>
            </a>
          </div>

          {/* Trash & Recycling */}
          <div className={`p-4 rounded-xl border space-y-1.5 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <span className={`text-xs font-mono uppercase font-semibold tracking-wider block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Trash & Bin Location
            </span>
            <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {property.trashSchedule}
            </p>
          </div>

          {/* Tap Water */}
          <div className={`p-4 rounded-xl border space-y-1.5 shadow-sm ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <span className={`text-xs font-mono uppercase font-semibold tracking-wider block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              💧 Tap Water Safety
            </span>
            <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Tbilisi tap water is mountain spring water, crystal clear, tested daily, and completely safe to drink.
            </p>
          </div>

          {/* Discreet Emergency 112 Safety Link */}
          <div className="pt-2 pb-1 text-center">
            <a
              href={`tel:${property.emergencyServicesNumber || '112'}`}
              className={`text-xs font-normal inline-flex items-center justify-center gap-1.5 ${
                isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
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

      {/* Rich Fallback Share Guide Modal (System Share / WhatsApp / Telegram / QR Code / Copy Link) */}
      <ShareGuideModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        property={property}
        favoriteGems={favoriteGemsList}
      />

      {/* Direct Guest Request Modal */}
      <GuestRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

    </div>
  );
};
