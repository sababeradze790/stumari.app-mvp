import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Smartphone, 
  MapPin, 
  Check, 
  Copy, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Shield,
  Clock,
  ArrowUpRight,
  Wifi,
  KeyRound,
  LayoutGrid,
  List,
  QrCode,
  Sliders,
  Grid2x2,
  CheckCircle2,
  Zap,
  Star,
  LogOut,
  User as UserIcon,
  MessageSquareHeart,
  Printer,
  Search,
  X,
  Compass,
  Users,
  Bell,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  Wrench,
  CheckCheck,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, RequestStatus } from '../../types';
import { HostAnalytics } from './HostAnalytics';
import { ReviewEngineInbox } from './ReviewEngineInbox';
import { GuestRequestsInbox } from './GuestRequestsInbox';
import { PrintFlyer } from '../print/PrintFlyer';
import { PhysicalStandModal } from '../common/PhysicalStandModal';

interface HostDashboardSimpleProps {
  isFullList?: boolean;
  activeTab?: 'overview' | 'analytics' | 'properties' | 'reviews' | 'requests';
}

export const HostDashboardSimple: React.FC<HostDashboardSimpleProps> = ({ 
  isFullList = false,
  activeTab: propActiveTab
}) => {
  const { 
    properties, 
    currentUser, 
    setCurrentRoute, 
    navigateToPropertyHub, 
    navigateToGuestGuide,
    showToast,
    theme,
    t,
    language,
    getLocalizedProperty,
    firebaseUser,
    openAuthModal,
    signOutHost,
    feedbacks,
    requests,
    updateRequestStatus,
    todayArrivals,
    markArrivalCheckedIn
  } = useApp();

  const isDarkMode = theme === 'dark';
  const [currentTab, setCurrentTab] = useState<'overview' | 'analytics' | 'properties' | 'reviews' | 'requests'>(
    propActiveTab || (isFullList ? 'properties' : 'overview')
  );
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPhysicalStandModal, setShowPhysicalStandModal] = useState(false);
  const [selectedModalProperty, setSelectedModalProperty] = useState<Property | null>(null);

  React.useEffect(() => {
    if (propActiveTab) {
      setCurrentTab(propActiveTab);
    } else if (isFullList) {
      setCurrentTab('properties');
    }
  }, [propActiveTab, isFullList]);

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'cards' | 'grid' | 'list'>('cards');
  const [activePropertyIndex, setActivePropertyIndex] = useState<number>(0);

  const localizedProperties = properties.map(p => getLocalizedProperty(p));
  const primaryProperty = localizedProperties[activePropertyIndex] || localizedProperties[0];

  const filteredProperties = properties.filter(p => {
    if (selectedCityFilter !== 'all' && p.city.toLowerCase() !== selectedCityFilter.toLowerCase()) {
      return false;
    }
    if (propertySearchQuery.trim()) {
      const q = propertySearchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchAddress = p.address?.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchAddress) return false;
    }
    return true;
  });

  const handleCopy = (p: Property) => {
    const url = `${window.location.origin}/#/g/${p.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(p.slug);
    showToast(t.common.copied);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    showToast(`${label} ${t.common.copied}`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const publishedCount = properties.filter(p => p.status === 'published').length;

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans rounded-[28px] my-3 sm:my-6 border relative overflow-hidden transition-colors duration-300 pb-20 md:pb-10 tracking-tight ${
      isDarkMode 
        ? 'bg-[#1F1E1C] text-[#F7F5F0] border-[#2B2926] shadow-[0_16px_40px_rgba(0,0,0,0.3)]' 
        : 'bg-white text-[#1C1B1A] border-[#EBE6DF] shadow-[0_14px_36px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* Top Welcome Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b transition-colors ${
        isDarkMode ? 'border-[#2B2926]' : 'border-[#EBE6DF]'
      }`}>
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-serif font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
            }`}>
              {language === 'ka' ? 'კარგი დღე, Saba 👋' : language === 'ru' ? 'Добрый день, Saba 👋' : 'Good day, Saba 👋'}
            </h1>
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold font-mono tracking-tight border shadow-xs ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300' 
                : 'bg-zinc-100 border-zinc-200 text-zinc-700'
            }`}>
              {currentUser.plan} • {properties.length} {language === 'ka' ? 'ობიექტი' : language === 'ru' ? 'объектов' : 'properties'}
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 font-normal ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {language === 'ka' 
              ? 'აქ არის დღეს თქვენი ობიექტების სტატუსი.' 
              : language === 'ru' 
              ? 'Вот статус ваших объектов на сегодня.' 
              : "Here is today's status of your properties."}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
          {/* Today Date Pill */}
          <div className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 shadow-xs ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
          }`}>
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ka' ? 'დღეს, 8 ოქტომბერი' : language === 'ru' ? 'Сегодня, 8 октября' : 'Today, Oct 8'}</span>
          </div>

          <button
            onClick={() => setCurrentRoute('/onboarding')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#F55A51] hover:bg-[#e04a41] text-white font-bold text-xs shadow-md shadow-[#F55A51]/25 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t.nav.addProperty}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white opacity-80" />
          </button>
        </div>
      </div>

      {/* Primary Host Dashboard Tab Navigation Bar (Overview | Properties | Analytics | Reviews | Requests) */}
      <div className="flex items-center justify-between border-b pb-3.5 pt-1 border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar transition-colors gap-3">
        <div className={`inline-flex items-center p-1 rounded-xl border transition-all ${
          isDarkMode 
            ? 'bg-[#141312] border-[#2B2926] shadow-2xs' 
            : 'bg-[#F3EFE9] border-[#EBE6DF] shadow-2xs'
        }`}>
          {[
            { 
              id: 'overview', 
              label: language === 'ka' ? 'მიმოხილვა' : language === 'ru' ? 'Обзор' : 'Overview', 
              icon: Building2 
            },
            { 
              id: 'properties', 
              label: language === 'ka' ? `ობიექტები (${properties.length})` : language === 'ru' ? `Объекты (${properties.length})` : `Properties (${properties.length})`, 
              icon: Layers 
            },
            { 
              id: 'analytics', 
              label: language === 'ka' ? 'ანალიტიკა' : language === 'ru' ? 'Аналитика' : 'Analytics', 
              icon: TrendingUp,
              badge: 'Live'
            },
            { 
              id: 'reviews', 
              label: language === 'ka' ? `შეფასებები (${feedbacks.length})` : language === 'ru' ? `Отзывы (${feedbacks.length})` : `Reviews (${feedbacks.length})`, 
              icon: MessageSquareHeart,
              badge: feedbacks.filter(f => f.status !== 'resolved' && (f.sentiment === 'could_be_better' || f.sentiment === 'problem')).length > 0 ? '1 Alert' : undefined
            },
            { 
              id: 'requests', 
              label: language === 'ka' ? `მოთხოვნები (${requests.filter(r => r.status !== 'resolved').length})` : language === 'ru' ? `Запросы (${requests.filter(r => r.status !== 'resolved').length})` : `Requests (${requests.filter(r => r.status !== 'resolved').length})`, 
              icon: Bell,
              badge: requests.filter(r => r.status === 'new').length > 0 ? `${requests.filter(r => r.status === 'new').length} New` : undefined
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id as any);
                  if (tab.id === 'analytics') {
                    setCurrentRoute('/app/analytics');
                  } else if (tab.id === 'properties') {
                    setCurrentRoute('/app/properties');
                  } else if (tab.id === 'reviews') {
                    setCurrentRoute('/app/reviews');
                  } else if (tab.id === 'requests') {
                    setCurrentRoute('/app/requests');
                  } else {
                    setCurrentRoute('/app');
                  }
                }}
                whileTap={{ scale: 0.96 }}
                className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? isDarkMode 
                      ? 'text-[#F7F5F0]' 
                      : 'text-[#1C1B1A]'
                    : isDarkMode
                      ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]'
                      : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHostTabPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className={`absolute inset-0 rounded-xl shadow-xs ${
                      isDarkMode 
                        ? 'bg-[#272522] border border-[#3B3833]' 
                        : 'bg-white border border-[#EBE6DF] shadow-xs'
                    }`}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F55A51]" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                      isActive 
                        ? isDarkMode ? 'bg-[#141312] text-[#F7F5F0] border border-[#3B3833]' : 'bg-[#FAF8F5] text-[#1C1B1A] border border-[#DDD8CF]'
                        : isDarkMode ? 'bg-[#FFC757]/15 text-[#FFC757] border border-[#FFC757]/25' : 'bg-[#FFF9ED] text-[#996F00] border border-[#FFC757]/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Right contextual info pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-medium shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{publishedCount} of {properties.length} active</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT (With AnimatePresence smooth switching)              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {currentTab === 'analytics' ? (
          <motion.div
            key="tab-analytics"
            initial={{ opacity: 0, y: 12, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.994 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <HostAnalytics 
              onNavigateToProperty={(propId) => navigateToPropertyHub(propId, 'overview')}
            />
          </motion.div>
        ) : currentTab === 'reviews' ? (
          <motion.div
            key="tab-reviews"
            initial={{ opacity: 0, y: 12, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.994 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <ReviewEngineInbox />
          </motion.div>
        ) : currentTab === 'requests' ? (
          <motion.div
            key="tab-requests"
            initial={{ opacity: 0, y: 12, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.994 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <GuestRequestsInbox />
          </motion.div>
        ) : (
          <motion.div
            key="tab-overview-props"
            initial={{ opacity: 0, y: 12, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.994 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >

      {/* SECTION 1: ASYMMETRIC BENTO METRICS & HERO STATUS */}
      {currentTab === 'overview' && !primaryProperty && (
        <div className={`p-8 sm:p-12 rounded-xl border text-center space-y-4 shadow-sm ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-100">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'ka' ? 'კეთილი იყოს თქვენი მობრძანება Stumari-ში' : language === 'ru' ? 'Добро пожаловать в Stumari' : 'Welcome to Stumari'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              {language === 'ka' 
                ? 'შექმენით თქვენი პირველი ციფრული მეგზური. სტუმრები მყისიერად მიიღებენ Wi-Fi-ს, კარის კოდს და რეკომენდაციებს.' 
                : language === 'ru'
                ? 'Создайте свой первый цифровой гид для гостей. Wi-Fi в 1 клик, код двери и рекомендации.'
                : 'Create your first digital guest guide to welcome guests seamlessly with 1-tap Wi-Fi, door codes, and curated gems.'}
            </p>
          </div>
          <button
            onClick={() => setCurrentRoute('/onboarding')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ka' ? 'პირველი ობიექტის დამატება' : language === 'ru' ? 'Добавить жильё' : 'Create First Property'}</span>
          </button>
        </div>
      )}

      {currentTab === 'overview' && primaryProperty && (
        <div className="space-y-4 sm:space-y-5">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 1. TOP 5 KPI SUMMARY CARDS                                      */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* KPI 1: Active Properties */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'აქტიური ობიექტი' : language === 'ru' ? 'Активные объекты' : 'Active Properties'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  {properties.length}
                </span>
                <span className={`text-[10px] font-mono font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {properties.length} {language === 'ka' ? 'სულ' : 'Total'}
                </span>
              </div>
            </div>

            {/* KPI 2: Views (30 Days) */}
            <div className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-300 shadow-xs'
            }`} onClick={() => setCurrentTab('analytics')}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'ნახვები (30 დღე)' : language === 'ru' ? 'Просмотры (30 дн)' : 'Views (30 Days)'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 group-hover:text-[#F55A51] transition-colors ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  12,436
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center">
                  +18.4%
                </span>
              </div>
            </div>

            {/* KPI 3: Average Rating */}
            <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-300 shadow-xs'
            }`} onClick={() => setCurrentTab('reviews')}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'საშუალო რეიტინგი' : language === 'ru' ? 'Средний рейтинг' : 'Avg Rating'}
                </span>
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums flex items-center gap-1 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  ★ 4.88
                </span>
                <span className={`text-[10px] font-mono ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  (98 {language === 'ka' ? 'შეფასება' : 'reviews'})
                </span>
              </div>
            </div>

            {/* KPI 4: Guests Today */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'სტუმრები დღეს' : language === 'ru' ? 'Гости сегодня' : 'Guests Today'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  8
                </span>
                <span className={`text-[10px] font-mono font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {todayArrivals.length} {language === 'ka' ? 'ჩამოსვლა' : 'arrivals'}
                </span>
              </div>
            </div>

            {/* KPI 5: Response Speed */}
            <div className={`col-span-2 sm:col-span-1 p-4 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'პასუხის სისწრაფე' : language === 'ru' ? 'Скорость ответа' : 'Response Speed'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
                  94%
                </span>
                <span className={`text-[10px] font-mono ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  &lt; 15 {language === 'ka' ? 'წთ' : 'min'}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 2. NEEDS ATTENTION STRIP                                         */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ka' ? 'ყურადღებას მოითხოვს (2)' : language === 'ru' ? 'Требует внимания (2)' : 'Needs Attention (2)'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {/* Alert 1: Wi-Fi issue */}
              <div className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs truncate">
                        {language === 'ka' ? 'Wi-Fi Router შეფერხება' : 'Wi-Fi Router Drop'}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium shrink-0 border ${
                        isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}>
                        Old Tbilisi
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {language === 'ka' 
                        ? 'სტუმარი Anna Müller: Router restart needed, drop during call' 
                        : 'Guest Anna Müller: Router restart needed, drop during call'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('requests')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors border ${
                    isDarkMode 
                      ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-100 border-zinc-700' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200'
                  }`}
                >
                  {language === 'ka' ? 'მოგვარება' : 'Resolve'}
                </button>
              </div>

              {/* Alert 2: 5.0 Review */}
              <div className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs truncate">
                        {language === 'ka' ? 'ახალი 5.0★ შეფასება' : 'New 5.0★ Review'}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium shrink-0 border ${
                        isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}>
                        Sololaki
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Elena Petrova: "ძალიან კომფორტული და სუფთა ბინა!"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('reviews')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors border ${
                    isDarkMode 
                      ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-100 border-zinc-700' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200'
                  }`}
                >
                  {language === 'ka' ? 'ნახვა' : 'View'}
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 3. TODAY'S ARRIVALS SECTION                                     */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <h3 className="font-serif font-bold text-sm sm:text-base tracking-tight">
                  {language === 'ka' ? 'დღევანდელი ჩამოსვლები' : language === 'ru' ? 'Сегодняшние заезды' : "Today's Arrivals"}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300">
                  {todayArrivals.length} {language === 'ka' ? 'სტუმარი' : 'guests'}
                </span>
              </div>
              <span className={`text-xs font-mono ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {language === 'ka' ? '8 ოქტომბერი, 2026' : 'Oct 8, 2026'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {todayArrivals.map((arrival) => (
                <div
                  key={arrival.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between shadow-xs ${
                    isDarkMode ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-xs sm:text-sm block truncate">{arrival.guestName}</span>
                        <span className={`text-[11px] block truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {arrival.propertyName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md shrink-0 border ${
                        arrival.status === 'checked_in'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {arrival.status === 'checked_in' 
                          ? (language === 'ka' ? 'დარეგისტრირდა' : 'Checked In') 
                          : (language === 'ka' ? 'მოლოდინში' : 'Pending')}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                      <div>
                        <span className="text-[9px] uppercase opacity-60 block">{language === 'ka' ? 'დრო' : 'Time'}</span>
                        <strong>{arrival.checkInTime || arrival.time}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase opacity-60 block">{language === 'ka' ? 'სტუმრები' : 'Guests'}</span>
                        <span>{arrival.guestCount || 2} {language === 'ka' ? 'ადამიანი' : 'guests'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase opacity-60 block">PIN Code</span>
                        <strong className="text-zinc-200">{arrival.doorKeypadCode}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center gap-1.5">
                    {arrival.status !== 'checked_in' ? (
                      <button
                        onClick={() => markArrivalCheckedIn(arrival.id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>{language === 'ka' ? 'დარეგისტრირება' : 'Check In'}</span>
                      </button>
                    ) : (
                      <span className="flex-1 py-1.5 text-center text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{language === 'ka' ? 'დარეგისტრირებულია' : 'Checked In'}</span>
                      </span>
                    )}

                    {arrival.phone && (
                      <a
                        href={`https://wa.me/${arrival.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-1.5 rounded-lg border text-zinc-300 hover:text-white transition-colors shadow-xs ${
                          isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-300'
                        }`}
                        title="WhatsApp Guest"
                      >
                        <MessageSquareHeart className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 4. PHYSICAL TOUCHPOINT: BIRCH & ACRYLIC STAND PROMO CARD        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-sm ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800' 
              : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Radio className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm sm:text-base truncate tracking-tight">
                    {language === 'ka' ? 'ხის & აკრილის QR/NFC მაგიდის სადგამი' : 'Laser-Engraved Birch & Acrylic QR/NFC Table Stand'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase bg-zinc-800 border border-zinc-700 text-zinc-300">
                    Physical Touchpoint
                  </span>
                </div>
                <p className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {language === 'ka'
                    ? 'განათავსეთ საწოლის ტუმბოზე ან შემოსასვლელში: მყისიერი NFC შეხება & კამერით სკანირება.'
                    : 'Place on bedside nightstands or entryway: 1-tap NFC chip and high-contrast camera QR scan.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => {
                  setSelectedModalProperty(primaryProperty);
                  setShowPhysicalStandModal(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{language === 'ka' ? 'სადგამის ნახვა & 3D' : 'View & Customize Stand'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedModalProperty(primaryProperty);
                  setShowPrintModal(true);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 shadow-xs ${
                  isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white' : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'ka' ? 'ფლაერის ბეჭდვა' : 'Print Stand Flyer'}</span>
              </button>
            </div>
          </div>
          
          {/* PHONE ASYMMETRIC BENTO GRID */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4">
            
            {/* 1. WIDE HERO GUIDE BANNER */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`col-span-2 md:col-span-8 p-4 sm:p-6 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-400">
                    {t.hostDashboard.card.published} Stumari Guide
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium ${
                    isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}>
                    {primaryProperty.city}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleCopy(primaryProperty)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/80 cursor-pointer shadow-xs"
                  >
                    {copiedSlug === primaryProperty.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSlug === primaryProperty.slug ? t.common.copied : t.common.share}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigateToGuestGuide(primaryProperty.slug)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
                  >
                    <span>{t.guestGuide.liveView}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </motion.button>
                </div>
              </div>

              <div className="relative z-10">
                <h2 className="text-base sm:text-xl font-serif font-bold tracking-tight truncate">
                  {primaryProperty.title}
                </h2>
                <div className="flex items-center gap-3 text-xs mt-1 text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4.98 {t.marketing.stats.ratingLabel}</span>
                  </span>
                  <span>·</span>
                  <span>{t.propertyHub.overview.wifiCard}: <strong className="font-mono text-zinc-300">{primaryProperty.wifiNetwork}</strong></span>
                </div>
              </div>
            </motion.div>

            {/* 2. PAIRED MICRO-BENTO CARD: Active Guides */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`col-span-1 md:col-span-4 rounded-xl p-4 sm:p-5 shadow-sm border flex flex-col justify-between h-[120px] sm:h-auto min-h-[120px] cursor-pointer ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-serif text-3xl sm:text-4xl font-bold leading-none tracking-tight">
                  {String(properties.length).padStart(2, '0')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <Building2 className="w-4 h-4 stroke-[1.8]" />
                </div>
              </div>
              <div>
                <span className="font-semibold text-xs tracking-tight block leading-tight text-zinc-200">
                  {t.hostDashboard.metrics.activeGuides}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                  {publishedCount} {t.hostDashboard.card.published.toLowerCase()}
                </span>
              </div>
            </motion.div>

            {/* 3. PAIRED MICRO-BENTO CARD: Guest Views */}
            <motion.div 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => {
                setCurrentTab('analytics');
                setCurrentRoute('/app/analytics');
              }}
              className={`col-span-1 md:col-span-4 rounded-xl p-4 sm:p-5 shadow-sm border flex flex-col justify-between h-[120px] sm:h-auto min-h-[120px] cursor-pointer group ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
              }`}
              title="Click to view full analytics & guest engagement charts"
            >
              <div className="flex items-start justify-between">
                <span className="font-serif text-3xl sm:text-4xl font-bold leading-none tracking-tight">
                  {primaryProperty.viewsCount || 1420}
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:text-zinc-100 transition-colors">
                  <TrendingUp className="w-4 h-4 stroke-[1.8]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs tracking-tight block leading-tight text-zinc-200">
                    {t.hostDashboard.metrics.totalViews}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                    {t.hostDashboard.metrics.thisMonth}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 group-hover:bg-zinc-700 transition-colors">
                  Analytics ↗
                </span>
              </div>
            </motion.div>

            {/* 4. PAIRED QUICK-TOOL MICRO-CARD: 1-Tap Wi-Fi */}
            <motion.div 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => handleCopyText(primaryProperty.wifiPassword, 'Wi-Fi Password')}
              className={`col-span-1 md:col-span-4 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-mono uppercase font-semibold text-emerald-400">
                  {copiedItem === 'Wi-Fi Password' ? t.common.copied : t.hostDashboard.tapToCopy}
                </span>
              </div>
              <div className="mt-2">
                <span className={`text-[10px] uppercase font-mono tracking-wider block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.hostDashboard.wifiPassword}</span>
                <span className={`text-xs sm:text-sm font-semibold font-mono truncate block ${
                  isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
                }`}>
                  {primaryProperty.wifiPassword}
                </span>
              </div>
            </motion.div>

            {/* 5. PAIRED QUICK-TOOL MICRO-CARD: Door Keypad */}
            <motion.div 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => handleCopyText(primaryProperty.doorKeypadCode, 'Keypad Code')}
              className={`col-span-1 md:col-span-4 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-mono uppercase font-semibold text-amber-400">
                  {copiedItem === 'Keypad Code' ? t.common.copied : t.hostDashboard.tapToCopy}
                </span>
              </div>
              <div className="mt-2">
                <span className={`text-[10px] uppercase font-mono tracking-wider block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.hostDashboard.frontDoorCode}</span>
                <span className={`text-xs sm:text-sm font-semibold font-mono tracking-wider truncate block ${
                  isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
                }`}>
                  {primaryProperty.doorKeypadCode}
                </span>
              </div>
            </motion.div>

            {/* 6. PAIRED QUICK-TOOL MICRO-CARD: Review Engine Interceptor */}
            <motion.div 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setCurrentTab('reviews');
              }}
              className={`col-span-1 md:col-span-4 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <span className="text-[9px] font-mono uppercase font-semibold text-emerald-400">
                  100% Rating
                </span>
              </div>
              <div className="mt-2">
                <span className={`text-[10px] uppercase font-mono tracking-wider block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Guest Review Firewall</span>
                <span className={`text-xs sm:text-sm font-semibold truncate block ${
                  isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
                }`}>
                  {feedbacks.length} Feedback Records ↗
                </span>
              </div>
            </motion.div>

            {/* 7. WIDE PRINT FLYER ACTION BANNER */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setSelectedModalProperty(primaryProperty);
                setShowPrintModal(true);
              }}
              className={`col-span-2 md:col-span-12 p-4 sm:p-5 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className={`font-semibold text-xs sm:text-sm block truncate ${
                    isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
                  }`}>
                    Print Bedside Stand & Table-Talker Flyer
                  </span>
                  <span className={`text-[11px] block truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Pre-formatted for 5x7 bedside frames and acrylic stands with instant camera QR scan
                  </span>
                </div>
              </div>
              <button className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs shrink-0 shadow-sm transition-colors">
                Print Stand Flyer ↗
              </button>
            </motion.div>

          </div>

        </div>
      )}

      {/* SECTION 2: YOUR PROPERTIES (With 3-Way Mobile Mode Switcher & City Filter) */}
      {(currentTab === 'overview' || currentTab === 'properties') && (
        <div className="space-y-3.5 pt-2">
          
          {/* Header & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className={`text-xs font-mono uppercase font-bold tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                {t.hostDashboard.yourProperties} ({properties.length})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* 3-Way Mobile View Mode Switcher (Cards Swipe | 2-Col Grid | Compact List) */}
              <div className={`flex items-center p-0.5 rounded-xl border shadow-xs ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  onClick={() => setMobileView('cards')}
                  className={`p-1.5 rounded-lg transition-all ${
                    mobileView === 'cards' 
                      ? isDarkMode ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60' : 'bg-white text-zinc-900 shadow-xs' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Bento swipe flow"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobileView('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    mobileView === 'grid' 
                      ? isDarkMode ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60' : 'bg-white text-zinc-900 shadow-xs' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="2-Column micro-grid"
                >
                  <Grid2x2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobileView('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    mobileView === 'list' 
                      ? isDarkMode ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60' : 'bg-white text-zinc-900 shadow-xs' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {!isFullList && properties.length > 2 && (
                <button
                  onClick={() => setCurrentRoute('/app/properties')}
                  className={`text-xs font-semibold hidden sm:flex items-center gap-1 transition-colors ${
                    isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-800 hover:text-zinc-950'
                  }`}
                >
                  <span>{t.hostDashboard.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search & City Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search properties by title, city, or address..."
                value={propertySearchQuery}
                onChange={(e) => setPropertySearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border focus:outline-none transition-colors shadow-xs ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400'
                }`}
              />
              {propertySearchQuery && (
                <button
                  onClick={() => setPropertySearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {['all', 'Tbilisi', 'Batumi', 'Kazbegi'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCityFilter(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer shadow-xs ${
                    selectedCityFilter === city
                      ? isDarkMode ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'bg-zinc-900 text-white font-semibold'
                      : isDarkMode ? 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {city === 'all' ? 'All Cities' : city}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State when no properties found */}
          {filteredProperties.length === 0 ? (
            <div className={`p-8 sm:p-12 rounded-xl border text-center space-y-3.5 my-3 shadow-sm ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg tracking-tight">
                  {propertySearchQuery || selectedCityFilter !== 'all' 
                    ? (language === 'ka' ? 'ობიექტები ვერ მოიძებნა' : language === 'ru' ? 'Жильё не найдено' : 'No matching properties found')
                    : (language === 'ka' ? 'ობიექტები არ არის' : language === 'ru' ? 'Нет добавленных объектов' : 'No properties yet')}
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  {propertySearchQuery || selectedCityFilter !== 'all'
                    ? (language === 'ka' 
                        ? `ვერ მოიძებნა ობიექტები ფილტრით "${propertySearchQuery || selectedCityFilter}". სცადეთ ფილტრის გასუფთავება.` 
                        : language === 'ru'
                        ? `Не найдено объектов по фильтру "${propertySearchQuery || selectedCityFilter}". Попробуйте сбросить фильтры.`
                        : `We couldn't find any properties matching "${propertySearchQuery || selectedCityFilter}". Try adjusting your filters.`)
                    : (language === 'ka'
                        ? 'შექმენით თქვენი პირველი ციფრული მეგზური Wi-Fi-ით, კარის კოდით და რეკომენდაციებით.'
                        : language === 'ru'
                        ? 'Создайте свой первый цифровой гид с Wi-Fi, кодом двери и рекомендациями.'
                        : 'Create your first digital guest guide to welcome guests with 1-tap Wi-Fi, door codes, and curated local gems.')}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                {propertySearchQuery || selectedCityFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setPropertySearchQuery('');
                      setSelectedCityFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 cursor-pointer hover:bg-white shadow-sm"
                  >
                    {language === 'ka' ? 'ფილტრის გასუფთავება' : language === 'ru' ? 'Сбросить фильтры' : 'Reset Filters'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentRoute('/onboarding')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 cursor-pointer hover:bg-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ka' ? 'პირველი ობიექტის დამატება' : language === 'ru' ? 'Добавить жильё' : 'Create First Property'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* VIEW MODE 1: BENTO PEEK SWIPE CAROUSEL (Horizontal with Dots) */}
              {mobileView === 'cards' && (
            <div className="space-y-2">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-3 px-3 md:mx-0 md:px-0 pb-2">
                {filteredProperties.map((p, index) => {
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.07 }}
                      whileHover={{ y: -3 }}
                      onClick={() => setActivePropertyIndex(index)}
                      className={`w-[82vw] max-w-[320px] md:w-auto shrink-0 snap-center rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3.5 sm:space-y-4 relative overflow-hidden cursor-pointer border transition-all ${
                        isDarkMode
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700'
                          : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className={`font-serif text-base sm:text-lg font-bold tracking-tight leading-tight truncate ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                              {p.title}
                            </h3>
                            <div className={`flex items-center gap-1.5 text-xs mt-0.5 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                              <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                              <span className="truncate">{p.city}</span>
                              <span>·</span>
                              <span className="capitalize shrink-0">{p.type}</span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono flex items-center gap-1 shrink-0 border ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                            <span>{p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}</span>
                          </span>
                        </div>

                        {/* Quick Essentials Chips */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className={`p-2 rounded-lg flex items-center gap-2 border shadow-xs ${
                            isDarkMode ? 'bg-zinc-950/70 text-zinc-200 border-zinc-800' : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                          }`}>
                            <Wifi className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase font-mono block opacity-60">Wi-Fi</span>
                              <span className="font-semibold text-[11px] truncate block">{p.wifiNetwork}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-lg flex items-center gap-2 border shadow-xs ${
                            isDarkMode ? 'bg-zinc-950/70 text-zinc-200 border-zinc-800' : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                          }`}>
                            <KeyRound className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase font-mono block opacity-60">{t.hostDashboard.keypadCode}</span>
                              <span className="font-mono font-semibold text-[11px] truncate block">{p.doorKeypadCode}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`pt-2.5 flex items-center justify-between gap-2 border-t ${
                        isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPropertyHub(p.id, 'guide');
                            }}
                            className="px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 active:scale-95 bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{t.common.edit}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToGuestGuide(p.slug);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 active:scale-95 border transition-colors cursor-pointer ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{t.hostDashboard.live}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-70" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalProperty(p);
                              setShowAccessModal(true);
                            }}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title="Quick Wi-Fi & Keypad Modal"
                          >
                            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalProperty(p);
                              setShowPhysicalStandModal(true);
                            }}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title="Physical QR & NFC Stand"
                          >
                            <Radio className="w-3.5 h-3.5 text-zinc-200" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalProperty(p);
                              setShowPrintModal(true);
                            }}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title="Print Table Stand Flyer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(p);
                            }}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title={t.common.copy}
                          >
                            {copiedSlug === p.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPropertyHub(p.id, 'overview');
                            }}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title={t.hostDashboard.propertyHub}
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Swipe Indicators */}
              <div className="flex md:hidden items-center justify-between text-[11px] text-zinc-400 font-mono px-1">
                <div className="flex items-center gap-1">
                  {filteredProperties.map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-1 rounded-full transition-all ${
                        activePropertyIndex === i ? 'w-4 bg-zinc-200' : 'w-1.5 bg-zinc-700'
                      }`} 
                    />
                  ))}
                </div>
                <span>{t.hostDashboard.swipeCards} →</span>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: 2-COLUMN MICRO-CARDS GRID (Side-by-Side on Phone!) */}
          {mobileView === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {filteredProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateToPropertyHub(p.id, 'overview')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between shadow-sm ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 shadow-xs hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="h-20 sm:h-28 rounded-lg overflow-hidden mb-2 relative">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold border ${
                        p.status === 'published' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-zinc-900/90 text-zinc-300 border-zinc-700'
                      }`}>
                        {p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-xs sm:text-sm truncate leading-snug tracking-tight">
                      {p.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 truncate block mt-0.5">{p.city}</span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPropertyHub(p.id, 'guide');
                      }}
                      className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-zinc-100 hover:bg-white text-zinc-950 shadow-xs cursor-pointer transition-colors"
                    >
                      {t.common.edit}
                    </button>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowAccessModal(true);
                        }}
                        className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
                        title="Wi-Fi"
                      >
                        <Wifi className="w-3 h-3 text-emerald-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowPhysicalStandModal(true);
                        }}
                        className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
                        title="Laser QR & NFC Stand"
                      >
                        <Radio className="w-3 h-3 text-zinc-300" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowPrintModal(true);
                        }}
                        className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
                        title="Print Stand Flyer"
                      >
                        <Printer className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToGuestGuide(p.slug);
                        }}
                        className="text-[10px] text-zinc-300 font-semibold flex items-center gap-0.5 hover:text-white transition-colors"
                      >
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-70" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 3: COMPACT LIST VIEW */}
          {mobileView === 'list' && (
            <div className="space-y-2">
              {filteredProperties.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 shadow-sm ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs sm:text-sm truncate block tracking-tight">{p.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold shrink-0 border ${
                          p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}
                        </span>
                      </div>
                      <span className={`text-[10px] truncate block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {p.city} · Wi-Fi: <strong className="font-mono text-zinc-300">{p.wifiNetwork}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedModalProperty(p);
                        setShowAccessModal(true);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      }`}
                      title="Wi-Fi Credentials"
                    >
                      <Wifi className="w-3 h-3 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModalProperty(p);
                        setShowPhysicalStandModal(true);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      }`}
                      title="Laser QR & NFC Stand"
                    >
                      <Radio className="w-3 h-3 text-zinc-200" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModalProperty(p);
                        setShowPrintModal(true);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      }`}
                      title="Print Flyer"
                    >
                      <Printer className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleCopy(p)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      }`}
                      title={t.common.copy}
                    >
                      {copiedSlug === p.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => navigateToPropertyHub(p.id, 'guide')}
                      className="px-2.5 py-1 rounded-lg font-semibold text-xs bg-zinc-100 hover:bg-white text-zinc-950 active:scale-95 shadow-sm transition-colors cursor-pointer"
                    >
                      {t.common.edit}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </>
          )}

        </div>
      )}

      {/* QUICK ACTIONS BENTO FOOTER */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-sm ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-300" />
          <span className="text-xs font-medium text-zinc-200">{t.hostDashboard.wantAnotherGuide}</span>
        </div>
        <button
          onClick={() => setCurrentRoute('/onboarding')}
          className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.hostDashboard.addProperty}</span>
        </button>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access Modal (Wi-Fi & Keypad 1-tap view) */}
      <AnimatePresence>
        {showAccessModal && selectedModalProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccessModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`relative w-full max-w-sm rounded-xl p-5 sm:p-6 border shadow-sm z-10 space-y-4 tracking-tight ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className={`font-serif font-bold text-sm leading-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.title}</h3>
                    <span className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Host Quick Access Card</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAccessModal(false)} 
                  className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div 
                  onClick={() => handleCopyText(selectedModalProperty.wifiPassword, 'Wi-Fi Password')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-colors shadow-xs ${
                    isDarkMode ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Network (SSID)</span>
                    <span className="text-[9px] font-mono text-emerald-500 font-semibold">Tap to copy</span>
                  </div>
                  <span className={`font-semibold text-sm block mt-0.5 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.wifiNetwork}</span>
                  
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <div>
                      <span className={`text-[9px] font-mono uppercase block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Password</span>
                      <span className={`font-mono font-semibold text-sm tracking-wide ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.wifiPassword}</span>
                    </div>
                    <Copy className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => handleCopyText(selectedModalProperty.doorKeypadCode, 'Keypad Code')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-colors shadow-xs ${
                    isDarkMode ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Door Keypad Code</span>
                    <span className="text-[9px] font-mono text-amber-500 font-semibold">Tap to copy</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`font-mono font-bold text-xl tracking-wider ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.doorKeypadCode}</span>
                    <Copy className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => {
                    setShowAccessModal(false);
                    setSelectedModalProperty(selectedModalProperty);
                    setShowPrintModal(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Stand Flyer</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable Bedside Stand & Flyer Modal */}
      <AnimatePresence>
        {showPrintModal && selectedModalProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrintModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-4 sm:p-6 my-auto shadow-sm z-10 max-h-[92vh] overflow-y-auto no-scrollbar tracking-tight"
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-zinc-200" />
                  <span className="font-serif font-bold text-base sm:text-lg text-zinc-100">
                    Printable Guest Stand & Table-Talker · {selectedModalProperty.title}
                  </span>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PrintFlyer property={selectedModalProperty} onBack={() => setShowPrintModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Laser-Engraved Birch & Acrylic Physical Stand Modal */}
      {showPhysicalStandModal && (
        <PhysicalStandModal 
          property={selectedModalProperty || properties[0]} 
          isOpen={showPhysicalStandModal} 
          onClose={() => setShowPhysicalStandModal(false)} 
        />
      )}

      {/* Responsive Host Mobile Bottom Dock (Floating on phone for instant switching) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 py-1.5 px-3 flex items-center justify-around shadow-sm">
        <button
          onClick={() => {
            setCurrentTab('overview');
            setCurrentRoute('/app');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'overview' ? 'text-zinc-100 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[9px]">Overview</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('properties');
            setCurrentRoute('/app/properties');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'properties' ? 'text-zinc-100 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[9px]">Properties</span>
        </button>

        <button
          onClick={() => setCurrentRoute('/onboarding')}
          className="w-10 h-10 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center -mt-5 shadow-sm active:scale-95 border border-zinc-800 cursor-pointer transition-colors"
          title="Add Property"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            setCurrentTab('analytics');
            setCurrentRoute('/app/analytics');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'analytics' ? 'text-zinc-100 font-semibold' : 'text-zinc-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[9px]">Analytics</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('reviews');
            setCurrentRoute('/app/reviews');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'reviews' ? 'text-zinc-100 font-semibold' : 'text-zinc-400'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span className="text-[9px]">Reviews</span>
        </button>
      </div>

    </div>
  );
};
