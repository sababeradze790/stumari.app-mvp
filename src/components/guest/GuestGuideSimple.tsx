import React, { useState } from 'react';
import { 
  Wifi, 
  KeyRound, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Bus, 
  CheckSquare, 
  Phone, 
  MessageCircle, 
  X, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  Car,
  AlertCircle,
  Coffee,
  Tv,
  Thermometer,
  Shirt,
  Flame,
  Utensils,
  Zap,
  ArrowLeft,
  Square,
  Globe,
  Sun,
  Moon,
  Home,
  Star,
  Heart,
  Download,
  Share,
  Sliders,
  ChevronRight,
  Maximize2,
  Smartphone
} from 'lucide-react';
import { Property, ApplianceGuide, Recommendation, GemMood } from '../../types';
import { useApp } from '../../context/AppContext';
import { LanguageSelector, ThemeAndLanguageControls } from '../common/LanguageSelector';
import { OfflineGuestMap } from './OfflineGuestMap';
import { ReviewEngineModal } from './ReviewEngineModal';
import { StumariGemsSection } from './StumariGemsSection';
import { StayMomentsTimeline } from './StayMomentsTimeline';
import { MobileBottomDock, GuestTab } from './MobileBottomDock';
import { ArrivalBoardingPass } from './ArrivalBoardingPass';
import { MoodsCarousel } from './MoodsCarousel';
import { MobileBottomSheet } from './MobileBottomSheet';
import { AddToHomeScreenModal } from './AddToHomeScreenModal';

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
  | 'contact';

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
  
  // Desktop phone mockup preview toggle (Phone Chassis vs Edge-to-Edge)
  const [previewChassis, setPreviewChassis] = useState<boolean>(true);

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

  return (
    <div className={`w-full ${isDark ? 'bg-[#06080A] text-stone-100' : 'bg-stone-100 text-stone-900'} ${isEmbed ? 'min-h-full' : 'min-h-screen py-0 sm:py-6'} flex flex-col items-center justify-center font-sans transition-colors duration-200`}>
      
      {/* Top Desktop Utility Control (only on wide screens when not embedded) */}
      {!isEmbed && (
        <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3">
          <button
            onClick={() => setCurrentRoute('/app')}
            className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E4E98E]" />
            <span>{t.guestGuide.backToHost}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewChassis(!previewChassis)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all flex items-center gap-1.5 ${
                previewChassis 
                  ? isDark ? 'bg-stone-800 text-[#E4E98E] border-stone-700' : 'bg-stone-200 text-stone-900 border-stone-300'
                  : isDark ? 'bg-transparent text-stone-400 border-stone-800' : 'bg-transparent text-stone-500 border-stone-200'
              }`}
              title="Toggle iPhone phone frame simulation"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{previewChassis ? 'iPhone Frame' : 'Full Mobile'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SMARTPHONE DEVICE WRAPPER */}
      <div className={`w-full max-w-md ${
        previewChassis && !isEmbed
          ? 'sm:rounded-[48px] sm:border-[8px] sm:border-stone-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] sm:ring-1 sm:ring-white/10'
          : 'sm:rounded-[32px] sm:border'
      } ${
        isDark ? 'bg-[#0A0E11] border-stone-800 text-stone-100' : 'bg-stone-50 border-stone-200 text-stone-900'
      } min-h-screen sm:min-h-[844px] flex flex-col relative overflow-hidden transition-all duration-300`}>
        
        {/* iOS DYNAMIC ISLAND & SIMULATED STATUS BAR (Active on desktop frame or subtle on mobile) */}
        <div className={`w-full px-7 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold tracking-tight select-none z-30 shrink-0 ${
          isDark ? 'text-white' : 'text-stone-900'
        }`}>
          {/* Time */}
          <span className="font-semibold tracking-normal text-xs">9:41</span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Stumari
            </span>
          </div>

          {/* Signal, Wi-Fi & Battery */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="w-5 h-2.5 rounded-[4px] border border-current p-[1px] flex items-center">
              <div className="w-full h-full bg-current rounded-[2px]" />
            </div>
          </div>
        </div>

        {/* NATIVE APP TOP HEADER BAR */}
        <header className={`px-4 py-2.5 flex items-center justify-between border-b backdrop-blur-xl sticky top-0 z-20 transition-colors ${
          isDark ? 'bg-[#0E1317]/85 border-stone-800/80 text-white' : 'bg-white/85 border-stone-200/80 text-stone-900'
        }`}>
          {/* Property Identity & Superhost badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={property.hostAvatar}
              alt={property.hostName}
              className="w-8 h-8 rounded-full object-cover border border-stone-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold truncate">
                  {property.title}
                </span>
              </div>
              <span className={`text-[10px] font-medium block truncate mt-0.5 ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {property.city} · {property.hostName} ({property.hostRole || 'Host'})
              </span>
            </div>
          </div>

          {/* Top Actions: Theme & Lang Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ThemeAndLanguageControls />
          </div>
        </header>

        {/* SCROLLABLE MOBILE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-28">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: STAY (Apartment Manual, Fast Pass, Appliances, Rules)  */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'stay' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              
              {/* HERO VISUAL COVER WITH WELCOME QUOTE */}
              <div className="relative h-44 rounded-[28px] overflow-hidden shadow-lg border border-stone-800">
                <img
                  src={property.coverImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono text-[#E4E98E] font-bold uppercase tracking-wider block mb-0.5">
                    {language === 'ka' ? 'კეთილი იყოს თქვენი მობრძანება' : language === 'ru' ? 'Добро пожаловать' : 'Welcome to your stay'}
                  </span>
                  <h1 className="font-serif text-xl font-bold text-white tracking-tight leading-tight">
                    {property.welcomeTitle || property.title}
                  </h1>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                    {property.welcomeGreeting || property.subtitle}
                  </p>
                </div>
              </div>

              {/* 1. FAST PASS: BOARDING PASS STYLE ACCESS (DOOR CODE & WI-FI) */}
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

              {/* 2. "WHAT ARE YOU IN THE MOOD FOR?" TOUCH RAIL */}
              <div className="pt-1">
                <MoodsCarousel 
                  onSelectMood={handleMoodSelect}
                  onViewAllGems={() => setActiveTab('gems')}
                />
              </div>

              {/* 3. QUICK STAY ACTIONS GRID */}
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* Check-in Instructions */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setActiveDrawer('checkin');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.97] h-[104px] group ${
                    isDark 
                      ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md border-white/10 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/5 ring-1 ring-white/5' 
                      : 'bg-white border-stone-200 hover:border-emerald-500 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block truncate">
                      {t.guestGuide.cards.checkinTitle}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {property.arrivalDirections ? property.arrivalDirections.slice(0, 28) + '...' : 'Directions & lockbox'}
                    </span>
                  </div>
                </button>

                {/* Appliances & How Things Work */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setActiveDrawer('appliances');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.97] h-[104px] group ${
                    isDark 
                      ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md border-white/10 hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/5 ring-1 ring-white/5' 
                      : 'bg-white border-stone-200 hover:border-sky-500 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center ring-1 ring-sky-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block truncate">
                      {t.guestGuide.cards.howThingsWork}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {property.appliances.length} {t.guestGuide.cards.appliancesCount}
                    </span>
                  </div>
                </button>

                {/* House Rules & Quiet Hours */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setActiveDrawer('rules');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.97] h-[104px] group ${
                    isDark 
                      ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md border-white/10 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 ring-1 ring-white/5' 
                      : 'bg-white border-stone-200 hover:border-amber-500 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block truncate">
                      {t.guestGuide.cards.houseRules}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {property.quietHours}
                    </span>
                  </div>
                </button>

                {/* Checkout & Departure */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setActiveDrawer('checkout');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.97] h-[104px] group ${
                    isDark 
                      ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md border-white/10 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/5 ring-1 ring-white/5' 
                      : 'bg-white border-stone-200 hover:border-purple-500 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center ring-1 ring-purple-500/20">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block truncate">
                      {t.guestGuide.cards.checkoutChecklist}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {property.checkOutTime}
                    </span>
                  </div>
                </button>

              </div>

              {/* 4. APPLIANCES PREVIEW CAROUSEL */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-mono uppercase font-bold tracking-wider text-stone-400">
                    {language === 'ka' ? 'ტექნიკა და მოწყობილობები' : language === 'ru' ? 'Техника в квартире' : 'Apartment Appliances'}
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setActiveDrawer('appliances');
                    }}
                    className="text-[11px] font-bold text-[#E4E98E] hover:underline"
                  >
                    {language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'View all'} ({property.appliances.length})
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                  {property.appliances.map(app => (
                    <button
                      key={app.id}
                      onClick={() => {
                        triggerHaptic();
                        setSelectedAppliance(app);
                        setActiveDrawer('selected_appliance');
                      }}
                      className={`px-3.5 py-3 rounded-2xl border text-left shrink-0 w-36 transition-all active:scale-95 flex flex-col justify-between h-24 ${
                        isDark 
                          ? 'bg-white/[0.04] backdrop-blur-md border-white/10 text-stone-200 hover:border-white/20 hover:bg-white/[0.07] ring-1 ring-white/5' 
                          : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 shadow-xs'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {getApplianceIcon(app.icon)}
                      </div>
                      <div>
                        <span className="text-xs font-bold block truncate">
                          {app.title}
                        </span>
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                          {app.instructions.slice(0, 24)}...
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. GUEST FEEDBACK CTA STRIP */}
              <div 
                onClick={() => {
                  triggerHaptic();
                  setIsReviewModalOpen(true);
                }}
                className={`p-4 rounded-[24px] border cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between ${
                  isDark 
                    ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-md border-amber-500/25 hover:border-amber-400/40 text-stone-100 shadow-sm ring-1 ring-amber-500/10' 
                    : 'bg-amber-50/80 border-amber-200 text-stone-900 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">
                      {language === 'ka' ? 'როგორ ჩაიარა თქვენმა დასვენებამ?' : language === 'ru' ? 'Как проходит ваш отдых?' : 'How is your stay going?'}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate">
                      {language === 'ka' ? 'გაგვიზიარეთ პირადი აზრი' : language === 'ru' ? 'Поделитесь мнением с хозяином' : 'Leave private feedback for your host'}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shrink-0 shadow-sm">
                  {language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Отзыв' : 'Review'}
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
            <div className="flex flex-col h-[700px] animate-in fade-in duration-200">
              {/* Segmented Switcher: Map vs Transit info */}
              <div className="px-4 py-2 border-b flex items-center justify-between shrink-0">
                <span className="text-xs font-bold font-serif">
                  {exploreViewMode === 'map' 
                    ? (language === 'ka' ? 'თბილისის ინტერაქტიული რუკა' : language === 'ru' ? 'Интерактивная карта' : 'Interactive Map')
                    : (language === 'ka' ? 'ტრანსპორტი და გადაადგილება' : language === 'ru' ? 'Транспорт и такси' : 'Transit & Taxis')}
                </span>

                <div className={`p-0.5 rounded-xl border flex items-center text-xs font-bold ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
                }`}>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('map');
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      exploreViewMode === 'map'
                        ? isDark ? 'bg-[#E4E98E] text-stone-950 shadow-xs' : 'bg-stone-900 text-white shadow-xs'
                        : isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Map'}
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setExploreViewMode('list');
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      exploreViewMode === 'list'
                        ? isDark ? 'bg-[#E4E98E] text-stone-950 shadow-xs' : 'bg-stone-900 text-white shadow-xs'
                        : isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {language === 'ka' ? 'ტრანსპორტი' : language === 'ru' ? 'Транспорт' : 'Transit'}
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
                <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
                  
                  {/* Taxi / Bolt */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{t.propertyHub.forms.taxiBolt}</span>
                        <span className="text-[10px] text-stone-400">Bolt app</span>
                      </div>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {property.taxiInfo}
                    </p>
                    <a
                      href="https://bolt.eu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline pt-1"
                    >
                      <span>{language === 'ka' ? 'Bolt ტაქსის გამოძახება' : language === 'ru' ? 'Вызвать Bolt' : 'Open Bolt taxi'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Public Transit / Metro */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{t.propertyHub.forms.transitMetro}</span>
                        <span className="text-[10px] text-stone-400">{t.guestGuide.cards.transport}</span>
                      </div>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {property.transitInfo}
                    </p>
                  </div>

                  {/* Airport Transit */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{t.propertyHub.forms.airportTransit}</span>
                        <span className="text-[10px] text-stone-400">TBS Airport</span>
                      </div>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {property.airportTransit}
                    </p>
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
              
              <div className={`p-6 rounded-[28px] border text-center space-y-3 ${
                isDark ? 'bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] backdrop-blur-md border-white/10 ring-1 ring-white/5 shadow-xl' : 'bg-white border-stone-200 shadow-sm'
              }`}>
                <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto shadow-inner ring-1 ring-amber-500/20">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold">
                    {language === 'ka' ? 'როგორ ჩაიარა თქვენმა დასვენებამ?' : language === 'ru' ? 'Как прошло ваше пребывание?' : 'How was your stay?'}
                  </h2>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                    {language === 'ka' 
                      ? 'თქვენი შეფასება გვეხმარება გავხდეთ უკეთესი, ხოლო საუკეთესო შთაბეჭდილებები გაუზიაროთ მსოფლიოს.'
                      : language === 'ru'
                      ? 'Ваш отзыв помогает сделать жилье идеальным для следующих гостей.'
                      : 'Your private feedback helps your host improve immediately, while 5-star stays help future travelers.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic();
                    setIsReviewModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#E4E98E] hover:bg-[#d8dd80] text-stone-950 font-bold text-xs shadow-lg transition-all active:scale-95"
                >
                  {language === 'ka' ? 'შეფასების დატოვება ⭐⭐⭐⭐⭐' : language === 'ru' ? 'Оставить отзыв ⭐⭐⭐⭐⭐' : 'Start Stay Feedback ⭐⭐⭐⭐⭐'}
                </button>
              </div>

              {/* Host Promise Note */}
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-white/[0.03] backdrop-blur-md border-white/10 ring-1 ring-white/5' : 'bg-stone-50 border-stone-200'
              }`}>
                <img 
                  src={property.hostAvatar} 
                  alt={property.hostName} 
                  className="w-10 h-10 rounded-full object-cover border border-stone-700 shrink-0" 
                />
                <div className="text-xs">
                  <span className="font-bold block">{property.hostName}'s Promise</span>
                  <span className="text-stone-400 block text-[11px]">
                    "Any problem during your stay? Message me on WhatsApp right away so I can solve it within minutes!"
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 5: HOST & HELP (Saba Superhost, WhatsApp, Emergency 112)   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'host' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              
              {/* Host Card */}
              <div className={`p-5 rounded-[28px] border text-center space-y-3 ${
                isDark ? 'bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] backdrop-blur-md border-white/10 ring-1 ring-white/5 shadow-xl' : 'bg-white border-stone-200 shadow-sm'
              }`}>
                <img
                  src={property.hostAvatar}
                  alt={property.hostName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E4E98E] mx-auto shadow-md"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold">
                    {property.hostName}
                  </h3>
                  <span className="text-xs text-[#E4E98E] font-semibold block">
                    {property.hostRole || 'Superhost'} · Stumari Host
                  </span>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                    {property.welcomeGreeting || 'Always happy to help make your Tbilisi stay unforgettable.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I am staying at ${property.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${property.hostPhone}`}
                    className={`py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
                      isDark ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10' : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>{language === 'ka' ? 'დარეკვა' : language === 'ru' ? 'Позвонить' : 'Call Host'}</span>
                  </a>
                </div>
              </div>

              {/* Emergency Services 112 Card */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-red-950/20 backdrop-blur-md border-red-500/20 text-red-200 ring-1 ring-red-500/10' : 'bg-red-50 border-red-200 text-red-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      {t.guestGuide.cards.emergency112}
                    </span>
                  </div>
                  <span className="font-mono font-black text-sm text-red-400">112</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-red-300' : 'text-red-900'}`}>
                  Police, Ambulance, and Fire Rescue in Georgia (English & Russian operators available 24/7).
                </p>
                <a
                  href={`tel:${property.emergencyServicesNumber || '112'}`}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.guestGuide.cards.emergencyCall}</span>
                </a>
              </div>

            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NATIVE FLOATING BOTTOM NAVIGATION DOCK (Thumb Zone)             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <MobileBottomDock 
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          unreadFeedbackBadge={true}
        />

        {/* iOS Home Indicator Bar Simulation */}
        <div className="w-32 h-1 bg-stone-500/30 rounded-full mx-auto mb-2 shrink-0 z-50 pointer-events-none" />

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
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>{t.guestGuide.cards.viewOnMaps}</span>
          </a>
        }
      >
        <div className="space-y-3.5">
          {/* Code Banner */}
          <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">
              {t.guestGuide.cards.doorCodeTitle}
            </span>
            <div className="font-mono text-3xl font-black text-emerald-400 tracking-wider">
              {property.doorKeypadCode}
            </div>
            <button
              onClick={() => handleCopy(property.doorKeypadCode, 'door')}
              className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold inline-flex items-center gap-1 mt-1 active:scale-95"
            >
              {doorCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{doorCopied ? t.common.copied : t.common.copy}</span>
            </button>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase font-mono text-stone-400 mb-1">
              {t.guestGuide.cards.directionsTitle}
            </h4>
            <p className={`p-3.5 rounded-2xl border leading-relaxed ${
              isDark ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              {property.arrivalDirections}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase font-mono text-stone-400 mb-1">
              {t.guestGuide.cards.parkingTitle}
            </h4>
            <p className={`p-3.5 rounded-2xl border leading-relaxed ${
              isDark ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-700'
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
          <div className={`p-6 rounded-2xl border space-y-2 ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className="text-[10px] text-stone-400 uppercase font-mono block">
              {t.propertyHub.forms.networkName}
            </span>
            <div className="text-lg font-bold font-mono text-white">
              {property.wifiNetwork}
            </div>

            <div className="pt-3">
              <span className="text-[10px] text-stone-400 uppercase font-mono block">
                {t.guestGuide.cards.wifiPassword}
              </span>
              <div className="text-2xl font-mono font-black text-[#E4E98E] tracking-wider my-1">
                {property.wifiPassword}
              </div>
            </div>

            <button
              onClick={() => handleCopy(property.wifiPassword, 'wifi')}
              className="w-full mt-3 py-3 rounded-xl bg-[#E4E98E] hover:bg-[#d8dd80] text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
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
        <div className="space-y-3">
          {property.appliances.map(app => (
            <div 
              key={app.id}
              className={`p-4 rounded-2xl border space-y-2 transition-all ${
                isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-2.5 font-bold text-sm">
                <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center shrink-0">
                  {getApplianceIcon(app.icon)}
                </div>
                <span>{app.title}</span>
              </div>
              
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {app.instructions}
              </p>

              {app.troubleshooting && (
                <div className={`pt-2 border-t text-[11px] flex items-start gap-1.5 ${
                  isDark ? 'border-stone-800 text-amber-400/90' : 'border-stone-200 text-amber-700'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Tip: {app.troubleshooting}</span>
                </div>
              )}

              {/* Direct Host WhatsApp Assistance */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">
                  {language === 'ka' ? 'მაინც გაუგებარია?' : language === 'ru' ? 'Остались вопросы?' : 'Still confused?'}
                </span>
                <a
                  href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${property.hostName}, I have a question about the ${app.title} at ${property.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#E4E98E] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Ask {property.hostName}</span>
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
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask {property.hostName} on WhatsApp</span>
            </a>
          }
        >
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <h4 className="font-bold text-xs font-mono uppercase text-stone-400">Instructions</h4>
              <p className="text-xs leading-relaxed text-stone-200">
                {selectedAppliance.instructions}
              </p>
            </div>

            {selectedAppliance.troubleshooting && (
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <h4 className="font-bold text-xs font-mono uppercase flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Troubleshooting</span>
                </h4>
                <p className="text-xs leading-relaxed">
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
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className="font-bold block text-xs font-mono uppercase text-stone-400 mb-1">
              {t.guestGuide.cards.quietHoursLabel}
            </span>
            <p className="font-semibold text-sm">{property.quietHours}</p>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className="font-bold block text-xs font-mono uppercase text-stone-400 mb-1">
              {t.guestGuide.cards.trashScheduleLabel}
            </span>
            <p className="text-xs text-stone-300 leading-relaxed">{property.trashSchedule}</p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className="font-bold block text-xs font-mono uppercase text-stone-400">
              General House Norms
            </span>
            <ul className="space-y-2">
              {property.houseRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-200">
                  <span className="text-[#E4E98E] font-bold">•</span>
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
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Star className="w-4 h-4 fill-stone-950" />
            <span>{language === 'ka' ? 'შეაფასეთ თქვენი დასვენება' : language === 'ru' ? 'Оставить отзыв' : 'Leave Stay Review'}</span>
          </button>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-stone-400 leading-relaxed">
            Please complete these quick steps before turning the door latch.
          </p>
          
          <div className="space-y-2">
            {property.departureChecklist.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  checkedItems[idx]
                    ? isDark ? 'bg-emerald-950/30 text-stone-400 line-through border-emerald-800/40' : 'bg-emerald-50 text-stone-400 line-through border-emerald-200'
                    : isDark ? 'bg-stone-900 text-stone-200 border-stone-800' : 'bg-stone-50 text-stone-800 border-stone-200'
                }`}
              >
                {checkedItems[idx] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium">{item}</span>
              </button>
            ))}
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
