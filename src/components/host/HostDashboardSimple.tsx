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
import { PropertyTemplatesManager } from './PropertyTemplatesManager';
import { PrintFlyer } from '../print/PrintFlyer';
import { PhysicalStandModal } from '../common/PhysicalStandModal';
import { auth } from '../../firebase';
import { safeCopyToClipboard } from '../../utils/clipboard';

interface HostDashboardSimpleProps {
  isFullList?: boolean;
  activeTab?: 'overview' | 'analytics' | 'properties' | 'templates' | 'reviews' | 'requests';
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
    openAddPropertyModal,
    signOutHost,
    feedbacks,
    requests,
    updateRequestStatus,
    todayArrivals,
    markArrivalCheckedIn,
    templates
  } = useApp();

  const isDarkMode = theme === 'dark';
  const [currentTab, setCurrentTab] = useState<'overview' | 'analytics' | 'properties' | 'templates' | 'reviews' | 'requests'>(
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

  const currentUid = auth.currentUser?.uid || firebaseUser?.uid;
  const hostVisibleProperties = properties.filter(p => {
    if (currentUid) {
      return p.ownerId === currentUid && !p.isDemo;
    }
    return true;
  });

  const hostPropertyIds = React.useMemo(
    () => new Set(hostVisibleProperties.map(p => p.id)),
    [hostVisibleProperties]
  );

  const hostFeedbacks = React.useMemo(
    () => feedbacks.filter(f => hostPropertyIds.has(f.propertyId)),
    [feedbacks, hostPropertyIds]
  );

  const hostRequests = React.useMemo(
    () => requests.filter(r => hostPropertyIds.has(r.propertyId)),
    [requests, hostPropertyIds]
  );

  const pendingHostRequests = React.useMemo(
    () => hostRequests.filter(r => r.status !== 'resolved'),
    [hostRequests]
  );

  const resolvedHostRequestsCount = React.useMemo(
    () => hostRequests.filter(r => r.status === 'resolved').length,
    [hostRequests]
  );

  const computedResolutionRate = React.useMemo(
    () =>
      hostRequests.length > 0
        ? Math.round((resolvedHostRequestsCount / hostRequests.length) * 100)
        : null,
    [hostRequests.length, resolvedHostRequestsCount]
  );

  const totalGuideViews = React.useMemo(
    () => hostVisibleProperties.reduce((sum, p) => sum + (p.viewsCount || 0), 0),
    [hostVisibleProperties]
  );

  const computedAvgRating = React.useMemo(() => {
    if (hostFeedbacks.length === 0) return null;
    const totalScore = hostFeedbacks.reduce((sum, f) => {
      const score =
        f.sentiment === 'amazing'
          ? 5
          : f.sentiment === 'good'
          ? 4.2
          : f.sentiment === 'could_be_better'
          ? 3
          : 2;
      return sum + score;
    }, 0);
    return (totalScore / hostFeedbacks.length).toFixed(2);
  }, [hostFeedbacks]);

  const normalizePropertyCity = (rawCity?: string): string => {
    const trimmed = (rawCity || '').trim();
    if (!trimmed) return 'Other';
    const lower = trimmed.toLowerCase();
    if (
      lower.includes('kazbegi') ||
      lower.includes('stepantsminda') ||
      lower.includes('ყაზბეგი') ||
      lower.includes('სტეფანწმინდა') ||
      lower.includes('казбеги') ||
      lower.includes('степанцминда')
    ) {
      return 'Kazbegi';
    }
    if (lower.includes('tbilisi') || lower.includes('თბილისი') || lower.includes('тбилиси')) {
      return 'Tbilisi';
    }
    if (lower.includes('batumi') || lower.includes('ბათუმი') || lower.includes('батуми')) {
      return 'Batumi';
    }
    if (lower.includes('kutaisi') || lower.includes('ქუთაისი') || lower.includes('кутаиси')) {
      return 'Kutaisi';
    }
    if (lower.includes('gudauri') || lower.includes('გუდაური') || lower.includes('гудаури')) {
      return 'Gudauri';
    }
    if (lower.includes('bakuriani') || lower.includes('ბაკურიანი') || lower.includes('бакуриани')) {
      return 'Bakuriani';
    }
    if (lower.includes('sighnaghi') || lower.includes('სიღნაღი') || lower.includes('сигнахи')) {
      return 'Sighnaghi';
    }
    if (lower.includes('mestia') || lower.includes('მესტია') || lower.includes('местиа')) {
      return 'Mestia';
    }
    if (lower.includes('borjomi') || lower.includes('ბორჯომი') || lower.includes('боржоми')) {
      return 'Borjomi';
    }
    if (lower.includes('telavi') || lower.includes('თელავი') || lower.includes('телави')) {
      return 'Telavi';
    }
    return trimmed;
  };

  const availableCities = Array.from(
    new Set(
      hostVisibleProperties
        .map(p => normalizePropertyCity(p.city))
        .filter(Boolean)
    )
  );

  const cityFilterOptions = ['all', ...availableCities];
  const activeCityFilter =
    selectedCityFilter === 'all' ||
    availableCities.some(city => city.toLowerCase() === selectedCityFilter.toLowerCase())
      ? selectedCityFilter
      : 'all';

  const hostDisplayName = (() => {
    const rawName = (
      firebaseUser?.displayName ||
      auth.currentUser?.displayName ||
      (currentUser?.id && currentUser.id !== 'host-user-1' ? currentUser.name : '') ||
      ''
    ).trim();
    if (!rawName || rawName.toLowerCase() === 'host') return '';
    return rawName.split(/\s+/)[0];
  })();

  const now = new Date();
  const localeCode = language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US';
  const shortFormattedDate = new Intl.DateTimeFormat(localeCode, {
    month: language === 'en' ? 'short' : 'long',
    day: 'numeric'
  }).format(now);
  const todayPillLabel =
    language === 'ka'
      ? `დღეს, ${shortFormattedDate}`
      : language === 'ru'
      ? `Сегодня, ${shortFormattedDate}`
      : `Today, ${shortFormattedDate}`;
  const fullFormattedDate = new Intl.DateTimeFormat(localeCode, {
    month: language === 'en' ? 'short' : 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(now);

  const localizedProperties = hostVisibleProperties.map(p => getLocalizedProperty(p));
  const primaryProperty = localizedProperties[activePropertyIndex] || localizedProperties[0];

  const filteredProperties = hostVisibleProperties.filter(p => {
    const normalizedCity = normalizePropertyCity(p.city);
    if (activeCityFilter !== 'all' && normalizedCity.toLowerCase() !== activeCityFilter.toLowerCase()) {
      return false;
    }
    if (propertySearchQuery.trim()) {
      const q = propertySearchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q) || normalizedCity.toLowerCase().includes(q);
      const matchAddress = p.address?.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchAddress) return false;
    }
    return true;
  });

  const handleCopy = async (p: Property) => {
    const url = `${window.location.origin}/#/g/${p.slug}`;
    const ok = await safeCopyToClipboard(url);
    if (ok) {
      setCopiedSlug(p.slug);
      showToast(t.common.copied);
      setTimeout(() => setCopiedSlug(null), 2000);
    } else {
      showToast(language === 'ka' ? 'ბმულის კოპირება ვერ მოხერხდა' : 'Could not copy link automatically');
    }
  };

  const handleCopyText = async (text: string, label: string) => {
    if (!text) return;
    const ok = await safeCopyToClipboard(text);
    if (ok) {
      setCopiedItem(label);
      showToast(`${label} ${t.common.copied}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } else {
      showToast(language === 'ka' ? 'კოპირება ვერ მოხერხდა' : 'Could not copy automatically');
    }
  };

  const publishedCount = hostVisibleProperties.filter(p => p.status === 'published').length;

  return (
    <div className={`max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 font-sans rounded-[24px] sm:rounded-[28px] my-2 sm:my-6 border relative overflow-hidden transition-colors duration-300 pb-28 md:pb-10 tracking-tight ${
      isDarkMode 
        ? 'bg-[#1F1E1C] text-[#F7F5F0] border-[#2B2926] shadow-[0_16px_40px_rgba(0,0,0,0.3)]' 
        : 'bg-white text-[#1C1B1A] border-[#EBE6DF] shadow-[0_14px_36px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* Top Welcome Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b transition-colors ${
        isDarkMode ? 'border-[#2B2926]' : 'border-[#EBE6DF]'
      }`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-serif font-bold tracking-tight leading-tight break-words ${
              isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
            }`}>
              {hostDisplayName
                ? (language === 'ka' ? `კარგი დღე, ${hostDisplayName} 👋` : language === 'ru' ? `Добрый день, ${hostDisplayName} 👋` : `Good day, ${hostDisplayName} 👋`)
                : (language === 'ka' ? 'კარგი დღე 👋' : language === 'ru' ? 'Добрый день 👋' : 'Good day 👋')}
            </h1>
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold font-mono tracking-tight border shadow-xs shrink-0 ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300' 
                : 'bg-zinc-100 border-zinc-200 text-zinc-700'
            }`}>
              {currentUser.plan} • {hostVisibleProperties.length} {language === 'ka' ? 'ობიექტი' : language === 'ru' ? 'объектов' : 'properties'}
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
          {/* Active Guides Status Pill */}
          <div className={`hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-medium border items-center gap-1.5 shadow-xs ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{publishedCount} of {hostVisibleProperties.length} active</span>
          </div>

          {/* Today Date Pill */}
          <div className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 shadow-xs ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
          }`}>
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{todayPillLabel}</span>
          </div>

          <button
            onClick={() => openAddPropertyModal()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#B85D3B] hover:bg-[#A35132] text-white font-bold text-xs shadow-md shadow-[#B85D3B]/25 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            <span>{t.nav.addProperty.replace(/^\+\s*/, '')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white opacity-80 shrink-0" />
          </button>
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
        ) : (currentTab === 'requests' || currentTab === 'reviews') ? (
          <motion.div
            key="tab-inbox"
            initial={{ opacity: 0, y: 12, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.994 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Unified Inbox Sub-Navigation (Guest Requests vs. Stay Reviews) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-serif font-bold text-lg sm:text-xl tracking-tight">
                  {language === 'ka' ? 'სტუმრების შემოსული შეტყობინებები' : language === 'ru' ? 'Входящие от гостей' : 'Guest Inbox & Feedback'}
                </h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka'
                    ? 'მართეთ სტუმრების მიმდინარე მოთხოვნები და შთაბეჭდილებები ერთ სივრცეში.'
                    : language === 'ru'
                    ? 'Управляйте запросами гостей и отзывами о проживании в одном месте.'
                    : 'Manage live in-stay guest assistance requests and post-stay review feedback in one place.'}
                </p>
              </div>

              <div className={`inline-flex flex-wrap items-center p-1 rounded-xl border self-start sm:self-auto max-w-full ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  onClick={() => {
                    setCurrentTab('requests');
                    setCurrentRoute('/app/requests');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentTab === 'requests'
                      ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700' : 'bg-white text-zinc-900 shadow-xs'
                      : isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {language === 'ka' ? 'მოთხოვნები' : language === 'ru' ? 'Запросы' : 'Guest Requests'} ({pendingHostRequests.length})
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('reviews');
                    setCurrentRoute('/app/reviews');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentTab === 'reviews'
                      ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700' : 'bg-white text-zinc-900 shadow-xs'
                      : isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'ka' ? 'შეფასებები' : language === 'ru' ? 'Отзывы' : 'Stay Reviews'} ({hostFeedbacks.length})
                  </span>
                </button>
              </div>
            </div>

            {currentTab === 'requests' ? <GuestRequestsInbox /> : <ReviewEngineInbox />}
          </motion.div>
        ) : currentTab === 'templates' ? (
          <motion.div
            key="tab-templates"
            initial={{ opacity: 0, y: 12, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.994 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Properties vs Templates Sub-Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-serif font-bold text-lg sm:text-xl tracking-tight">
                  {language === 'ka' ? 'ობიექტები და შაბლონები' : language === 'ru' ? 'Объекты и шаблоны' : 'Properties & Reusable Templates'}
                </h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka'
                    ? 'გამოიყენეთ მზა შაბლონები სახლის წესებისა და ტექნიკის ინსტრუქციების სწრაფად გადასატანად.'
                    : 'Standardize house rules, check-in schedules, and visual appliance guides across your portfolio.'}
                </p>
              </div>

              <div className={`inline-flex flex-wrap items-center p-1 rounded-xl border self-start sm:self-auto max-w-full ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  onClick={() => {
                    setCurrentTab('properties');
                    setCurrentRoute('/app/properties');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'ka' ? 'ყველა ობიექტი' : 'All Properties'} ({hostVisibleProperties.length})</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('templates');
                    setCurrentRoute('/app/templates');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDarkMode ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700' : 'bg-white text-zinc-900 shadow-xs'
                  }`}
                >
                  <Grid2x2 className="w-3.5 h-3.5 text-[#F55A51] shrink-0" />
                  <span>{language === 'ka' ? 'შაბლონები' : 'Templates'} ({templates.length})</span>
                </button>
              </div>
            </div>

            <PropertyTemplatesManager />
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

      {/* SECTION 1: COMMAND CENTER OVERVIEW */}
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
          <div className="flex items-center justify-center gap-2.5 flex-wrap pt-1">
            <button
              onClick={() => openAddPropertyModal()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#B85D3B] hover:bg-[#A35132] text-white inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ka' ? 'პირველი ობიექტის დამატება' : language === 'ru' ? 'Добавить жильё' : 'Create First Property'}</span>
            </button>
            <button
              onClick={() => setCurrentRoute('/demo')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-750'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'ka' ? 'დემო გიდების ნახვა' : language === 'ru' ? 'Смотреть демо-гиды' : 'Explore Demo Guides'}</span>
            </button>
          </div>
        </div>
      )}

      {currentTab === 'overview' && primaryProperty && (
        <div className="space-y-4 sm:space-y-5">

          {/* Guide Setup Checklist & Readiness Banner */}
          {(() => {
            const checklist = [
              { label: language === 'ka' ? 'Wi-Fi წვდომა' : language === 'ru' ? 'Wi-Fi доступ' : 'Wi-Fi Access', done: !!primaryProperty.wifiPassword, icon: Wifi },
              { label: language === 'ka' ? 'კარის კოდი' : language === 'ru' ? 'Код двери' : 'Door Code', done: !!primaryProperty.doorKeypadCode || !!primaryProperty.lockboxCode, icon: KeyRound },
              { label: language === 'ka' ? 'ტექნიკის გიდი' : language === 'ru' ? 'Инструкции' : 'Visual How-Tos', done: (primaryProperty.appliances || []).length >= 2, icon: Zap },
              { label: language === 'ka' ? 'სახლის წესები' : language === 'ru' ? 'Правила дома' : 'House Rules', done: (primaryProperty.houseRules || []).length >= 2, icon: Shield },
              { label: language === 'ka' ? 'მთავარი ფოტო' : language === 'ru' ? 'Обложка' : 'Cover Photo', done: !!primaryProperty.coverImage, icon: Building2 },
              { label: language === 'ka' ? 'რჩეული ადგილები' : language === 'ru' ? 'Рекомендации' : 'Local Gems', done: (primaryProperty.gemIds || []).length > 0 || (primaryProperty.recommendations || []).length > 0, icon: Compass }
            ];
            const completed = checklist.filter(c => c.done).length;
            const pct = Math.round((completed / checklist.length) * 100);

            return (
              <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#201F1D] to-[#181716] border-[#3B3833] text-[#F7F5F0]' 
                  : 'bg-gradient-to-r from-[#FAF8F5] to-[#F5F2EB] border-[#E5DFD5] text-[#1C1B1A]'
              }`}>
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-sm sm:text-base leading-snug">
                      {language === 'ka' ? 'გიდის მზაობის შემოწმება' : language === 'ru' ? 'Проверка готовности гида' : 'Guide Health & Setup Checklist'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                      pct === 100 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                    }`}>
                      {pct}% Ready · {completed}/{checklist.length} Essentials
                    </span>
                  </div>

                  {/* Checklist items */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-3 gap-y-1.5 sm:gap-3 sm:flex-wrap text-xs">
                    {checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 min-w-0">
                        {item.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span className={`text-[11px] truncate ${item.done ? (isDarkMode ? 'text-zinc-300' : 'text-stone-700') : (isDarkMode ? 'text-amber-400 font-medium' : 'text-amber-800 font-medium')}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => openAddPropertyModal()}
                    className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{language === 'ka' ? 'ოსტატის ჩართვა' : language === 'ru' ? 'Мастер настройки' : 'Guided Setup Wizard'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToPropertyHub(primaryProperty.id, 'guide')}
                    className={`flex-1 sm:flex-initial justify-center px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'border-zinc-700 bg-zinc-800/80 text-zinc-100 hover:bg-zinc-800'
                        : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'ka' ? 'რედაქტირება' : language === 'ru' ? 'Редактировать' : 'Edit Guide'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 1. TOP 5 KPI SUMMARY CARDS (GROUNDED IN REAL SCOPED STATE)     */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* KPI 1: Active Properties */}
            <div 
              onClick={() => {
                setCurrentTab('properties');
                setCurrentRoute('/app/properties');
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-0 ${
                isDarkMode 
                  ? 'bg-[#181920] border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm' 
                  : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[11px] font-semibold truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'აქტიური ობიექტი' : language === 'ru' ? 'Активные объекты' : 'Active Properties'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  {publishedCount}
                </span>
                <span className={`text-[10px] font-mono font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  / {hostVisibleProperties.length} {language === 'ka' ? 'სულ' : language === 'ru' ? 'всего' : 'Total'}
                </span>
              </div>
            </div>

            {/* KPI 2: Views (30 Days) — Summed from hostVisibleProperties */}
            <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group min-w-0 ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-300 shadow-xs'
            }`} onClick={() => {
              setCurrentTab('analytics');
              setCurrentRoute('/app/analytics');
            }}>
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[11px] font-semibold truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'გიდის ნახვები' : language === 'ru' ? 'Просмотры гида' : 'Guide Views'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 group-hover:text-[#F55A51] transition-colors ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  {totalGuideViews.toLocaleString()}
                </span>
                <span className={`text-[10px] font-mono font-medium ${
                  totalGuideViews > 0
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {totalGuideViews > 0
                    ? (language === 'ka' ? 'აქტიური' : language === 'ru' ? 'Активно' : 'Total')
                    : (language === 'ka' ? 'ახალი' : language === 'ru' ? 'Нет просмотров' : 'No views yet')}
                </span>
              </div>
            </div>

            {/* KPI 3: Average Rating — Computed from actual hostFeedbacks */}
            <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-0 ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-300 shadow-xs'
            }`} onClick={() => {
              setCurrentTab('reviews');
              setCurrentRoute('/app/reviews');
            }}>
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[11px] font-semibold truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'საშუალო რეიტინგი' : language === 'ru' ? 'Средний рейтинг' : 'Avg Rating'}
                </span>
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums flex items-center gap-1 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  {computedAvgRating ? `★ ${computedAvgRating}` : '—'}
                </span>
                <span className={`text-[10px] font-mono truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {hostFeedbacks.length > 0
                    ? `(${hostFeedbacks.length} ${language === 'ka' ? 'შეფასება' : language === 'ru' ? 'отз.' : 'reviews'})`
                    : (language === 'ka' ? 'შეფასება არ არის' : language === 'ru' ? 'Нет отзывов' : 'No reviews yet')}
                </span>
              </div>
            </div>

            {/* KPI 4: Guests Today */}
            <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all min-w-0 ${
              isDarkMode 
                ? 'bg-[#181920] border-zinc-800 text-zinc-100 shadow-sm' 
                : 'bg-white border-zinc-200/90 text-zinc-900 shadow-xs'
            }`}>
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[11px] font-semibold truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'სტუმრები დღეს' : language === 'ru' ? 'Гости сегодня' : 'Guests Today'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                  {todayArrivals.reduce((sum, a) => sum + (a.guestCount || 2), 0)}
                </span>
                <span className={`text-[10px] font-mono font-medium truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {todayArrivals.length} {language === 'ka' ? 'ჩამოსვლა' : language === 'ru' ? 'заездов' : 'arrivals'}
                </span>
              </div>
            </div>

            {/* KPI 5: Request Resolution Rate — Computed from actual hostRequests */}
            <div
              onClick={() => {
                setCurrentTab('requests');
                setCurrentRoute('/app/requests');
              }}
              className={`col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-0 ${
                isDarkMode 
                  ? 'bg-[#181920] border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-sm' 
                  : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[11px] font-semibold truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {language === 'ka' ? 'მოთხოვნების სტატუსი' : language === 'ru' ? 'Запросы гостей' : 'Request Resolution'}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                <span className={`font-serif text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
                  computedResolutionRate !== null
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
                }`}>
                  {computedResolutionRate !== null ? `${computedResolutionRate}%` : '—'}
                </span>
                <span className={`text-[10px] font-mono truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {hostRequests.length > 0
                    ? `${resolvedHostRequestsCount}/${hostRequests.length} ${language === 'ka' ? 'დასრულდა' : language === 'ru' ? 'решено' : 'resolved'}`
                    : (language === 'ka' ? 'მოთხოვნა არ არის' : language === 'ru' ? 'Нет запросов' : 'No requests yet')}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 2. NEEDS ATTENTION STRIP (DYNAMICALLY GROUNDED IN REAL DATA)    */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {(() => {
            const attentionRequests = pendingHostRequests.slice(0, 2);
            const recentFeedback = hostFeedbacks[0];
            const totalAttentionCount = pendingHostRequests.length + (recentFeedback ? 1 : 0);

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    {pendingHostRequests.length > 0 ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                    <span>
                      {pendingHostRequests.length > 0
                        ? (language === 'ka'
                            ? `ყურადღებას მოითხოვს (${pendingHostRequests.length})`
                            : language === 'ru'
                            ? `Требует внимания (${pendingHostRequests.length})`
                            : `Needs Attention (${pendingHostRequests.length})`)
                        : (language === 'ka'
                            ? 'სტუმრების აქტივობა'
                            : language === 'ru'
                            ? 'Активность гостей'
                            : 'Guest Activity & Alerts')}
                    </span>
                  </span>
                </div>

                {totalAttentionCount === 0 ? (
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-xs ${
                    isDarkMode ? 'bg-zinc-900/80 border-zinc-800 text-zinc-200' : 'bg-zinc-50/80 border-zinc-200 text-zinc-800'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs block">
                          {language === 'ka'
                            ? 'ყველა მოთხოვნა შესრულებულია'
                            : language === 'ru'
                            ? 'Нет активных запросов от гостей'
                            : 'All caught up — no pending guest requests'}
                        </span>
                        <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {language === 'ka'
                            ? 'სტუმრების ახალი მოთხოვნები და შეფასებები აქ გამოჩნდება.'
                            : language === 'ru'
                            ? 'Новые запросы на поздний выезд и отзывы появятся здесь.'
                            : 'New guest requests for late check-out, extra towels, or reviews will appear here.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTab('requests');
                          setCurrentRoute('/app/requests');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border-zinc-700'
                            : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        {language === 'ka' ? 'შემოსული' : language === 'ru' ? 'Входящие' : 'Open Inbox'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {attentionRequests.map((req) => {
                      const propMatch = hostVisibleProperties.find(p => p.id === req.propertyId);
                      const propLabel = propMatch ? propMatch.title : (req.propertyName || 'Property');
                      return (
                        <div
                          key={req.id}
                          className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm min-w-0 ${
                            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-xs truncate">
                                  {req.title || req.category}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium shrink-0 border max-w-[140px] truncate ${
                                  isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                }`}>
                                  {propLabel}
                                </span>
                              </div>
                              <p className={`text-[11px] line-clamp-1 mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                {req.guestName ? `${req.guestName}: ` : ''}{req.description || req.createdAt}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentTab('requests');
                              setCurrentRoute('/app/requests');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors border self-end sm:self-center ${
                              isDarkMode 
                                ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-100 border-zinc-700' 
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200'
                            }`}
                          >
                            {language === 'ka' ? 'მოგვარება' : language === 'ru' ? 'Открыть' : 'Resolve'}
                          </button>
                        </div>
                      );
                    })}

                    {attentionRequests.length < 2 && recentFeedback && (() => {
                      const propMatch = hostVisibleProperties.find(p => p.id === recentFeedback.propertyId);
                      const propLabel = propMatch ? propMatch.title : 'Property';
                      const isPositive = recentFeedback.sentiment === 'amazing' || recentFeedback.sentiment === 'good';
                      return (
                        <div
                          key={recentFeedback.id}
                          className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm min-w-0 ${
                            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                              isPositive
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                              <Star className={`w-4 h-4 ${isPositive ? 'fill-emerald-400' : ''}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-xs truncate">
                                  {isPositive
                                    ? (language === 'ka' ? 'ახალი დადებითი შეფასება' : language === 'ru' ? 'Новый отзыв гостя' : 'Latest Guest Review')
                                    : (language === 'ka' ? 'სტუმრის შენიშვნა' : language === 'ru' ? 'Замечание гостя' : 'Private Guest Feedback')}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium shrink-0 border max-w-[140px] truncate ${
                                  isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                }`}>
                                  {propLabel}
                                </span>
                              </div>
                              <p className={`text-[11px] line-clamp-1 mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                {recentFeedback.guestName ? `${recentFeedback.guestName}: ` : ''}
                                {recentFeedback.comment || recentFeedback.sentiment}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentTab('reviews');
                              setCurrentRoute('/app/reviews');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors border self-end sm:self-center ${
                              isDarkMode 
                                ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-100 border-zinc-700' 
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200'
                            }`}
                          >
                            {language === 'ka' ? 'ნახვა' : language === 'ru' ? 'Смотреть' : 'View'}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 3. TODAY'S ARRIVALS SECTION                                     */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                <h3 className="font-serif font-bold text-sm sm:text-base tracking-tight">
                  {language === 'ka' ? 'დღევანდელი ჩამოსვლები' : language === 'ru' ? 'Сегодняшние заезды' : "Today's Arrivals"}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                  isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                }`}>
                  {todayArrivals.length} {language === 'ka' ? 'სტუმარი' : language === 'ru' ? 'гостей' : 'guests'}
                </span>
              </div>
              <span className={`text-xs font-mono ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {fullFormattedDate}
              </span>
            </div>

            {todayArrivals.length === 0 ? (
              <div className={`p-5 rounded-xl border border-dashed flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-300' : 'bg-zinc-50/80 border-zinc-200 text-zinc-700'
              }`}>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-semibold">
                    {language === 'ka'
                      ? 'დღეს დაგეგმილი ჩამოსვლები არ არის'
                      : language === 'ru'
                      ? 'На сегодня заездов не запланировано'
                      : 'No guest arrivals scheduled for today'}
                  </p>
                  <p className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {language === 'ka'
                      ? 'გაუზიარეთ სტუმარს ციფრული გზამკვლევის ბმული ჩამოსვლამდე ან დაბეჭდეთ QR სადგამი.'
                      : language === 'ru'
                      ? 'Отправьте гостю ссылку на путеводитель перед заездом или распечатайте QR-стойку.'
                      : 'Share your property check-in guide link ahead of arrival or print a bedside QR stand.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(primaryProperty)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
                        : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>{language === 'ka' ? 'ბმულის კოპირება' : language === 'ru' ? 'Скопировать ссылку' : 'Copy Guide Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModalProperty(primaryProperty);
                      setShowPrintModal(true);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 shrink-0" />
                    <span>{language === 'ka' ? 'QR ფლაერი' : language === 'ru' ? 'QR-флаер' : 'QR Stand Flyer'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {todayArrivals.map((arrival) => (
                  <div
                    key={arrival.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between shadow-xs min-w-0 ${
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
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        }`}>
                          {arrival.status === 'checked_in' 
                            ? (language === 'ka' ? 'დარეგისტრირდა' : language === 'ru' ? 'Заехал' : 'Checked In') 
                            : (language === 'ka' ? 'მოლოდინში' : language === 'ru' ? 'Ожидание' : 'Pending')}
                        </span>
                      </div>

                      <div className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 text-[11px] font-mono ${
                        isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'
                      }`}>
                        <div>
                          <span className="text-[9px] uppercase opacity-60 block">{language === 'ka' ? 'დრო' : language === 'ru' ? 'Время' : 'Time'}</span>
                          <strong>{arrival.checkInTime || arrival.time}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase opacity-60 block">{language === 'ka' ? 'სტუმრები' : language === 'ru' ? 'Гости' : 'Guests'}</span>
                          <span>{arrival.guestCount || 2} {language === 'ka' ? 'ადამიანი' : language === 'ru' ? 'чел.' : 'guests'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase opacity-60 block">PIN Code</span>
                          <strong className={isDarkMode ? 'text-zinc-200' : 'text-zinc-900'}>{arrival.doorKeypadCode}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 flex items-center gap-1.5">
                      {arrival.status !== 'checked_in' ? (
                        <button
                          onClick={() => markArrivalCheckedIn(arrival.id)}
                          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm ${
                            isDarkMode
                              ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
                              : 'bg-zinc-900 text-white hover:bg-zinc-800'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{language === 'ka' ? 'დარეგისტრირება' : language === 'ru' ? 'Отметить заезд' : 'Check In'}</span>
                        </button>
                      ) : (
                        <span className="flex-1 py-2 text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>{language === 'ka' ? 'დარეგისტრირებულია' : language === 'ru' ? 'Заселён' : 'Checked In'}</span>
                        </span>
                      )}

                      {arrival.phone && (
                        <a
                          href={`https://wa.me/${arrival.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2 rounded-lg border transition-colors shadow-xs ${
                            isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:text-zinc-950'
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
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 4. PHYSICAL TOUCHPOINT: BIRCH & ACRYLIC STAND PROMO CARD        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className={`p-4 sm:p-5 rounded-xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all shadow-sm min-w-0 ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800' 
              : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Radio className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-sm sm:text-base break-words leading-snug tracking-tight">
                    {language === 'ka' ? 'ხის & აკრილის QR/NFC მაგიდის სადგამი' : language === 'ru' ? 'Настольная QR/NFC стойка из берёзы и акрила' : 'Laser-Engraved Birch & Acrylic QR/NFC Table Stand'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase bg-zinc-800 border border-zinc-700 text-zinc-300 shrink-0">
                    Physical Touchpoint
                  </span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed break-words ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {language === 'ka'
                    ? 'განათავსეთ საწოლის ტუმბოზე ან შემოსასვლელში: მყისიერი NFC შეხება & კამერით სკანირება.'
                    : language === 'ru'
                    ? 'Разместите на тумбочке или у входа: мгновенное касание NFC и сканирование QR-кода.'
                    : 'Place on bedside nightstands or entryway: 1-tap NFC chip and high-contrast camera QR scan.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
              <button
                onClick={() => {
                  setSelectedModalProperty(primaryProperty);
                  setShowPhysicalStandModal(true);
                }}
                className={`flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all ${
                  isDarkMode
                    ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <Radio className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'ka' ? 'სადგამის ნახვა & 3D' : language === 'ru' ? '3D предпросмотр' : 'View & Customize Stand'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedModalProperty(primaryProperty);
                  setShowPrintModal(true);
                }}
                className={`flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white' : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'ka' ? 'ფლაერის ბეჭდვა' : language === 'ru' ? 'Печать флаера' : 'Print Stand Flyer'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: YOUR PROPERTIES (With Portfolio/Templates Toggle, 3-Way Mobile Mode Switcher & City Filter) */}
      {(currentTab === 'overview' || currentTab === 'properties') && (
        <div className="space-y-3.5 pt-2">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className={`text-xs font-mono uppercase font-bold tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                {t.hostDashboard.yourProperties} ({hostVisibleProperties.length})
              </h2>

              {/* Portfolio vs Reusable Templates Sub-Switcher when in Properties tab */}
              {currentTab === 'properties' && (
                <div className={`inline-flex items-center p-0.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                }`}>
                  <button
                    onClick={() => {
                      setCurrentTab('properties');
                      setCurrentRoute('/app/properties');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDarkMode ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60' : 'bg-white text-zinc-900 shadow-xs'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-[#F55A51]" />
                    <span>{language === 'ka' ? 'ობიექტები' : 'Properties'} ({hostVisibleProperties.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('templates');
                      setCurrentRoute('/app/templates');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Grid2x2 className="w-3 h-3" />
                    <span>{language === 'ka' ? 'შაბლონები' : 'Templates'} ({templates.length})</span>
                  </button>
                </div>
              )}
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

              {currentTab === 'overview' && (
                <button
                  onClick={() => {
                    setCurrentTab('properties');
                    setCurrentRoute('/app/properties');
                  }}
                  className={`text-xs font-semibold hidden sm:flex items-center gap-1 transition-colors cursor-pointer ${
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
              {cityFilterOptions.map((city) => {
                const isSelected = activeCityFilter.toLowerCase() === city.toLowerCase();
                const allCitiesLabel =
                  language === 'ka' ? 'ყველა ქალაქი' : language === 'ru' ? 'Все города' : 'All Cities';
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCityFilter(city)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer shadow-xs ${
                      isSelected
                        ? isDarkMode ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'bg-zinc-900 text-white font-semibold'
                        : isDarkMode ? 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    }`}
                  >
                    {city === 'all' ? allCitiesLabel : city}
                  </button>
                );
              })}
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
                  {propertySearchQuery || activeCityFilter !== 'all' 
                    ? (language === 'ka' ? 'ობიექტები ვერ მოიძებნა' : language === 'ru' ? 'Жильё не найдено' : 'No matching properties found')
                    : (language === 'ka' ? 'ობიექტები არ არის' : language === 'ru' ? 'Нет добавленных объектов' : 'No properties yet')}
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  {propertySearchQuery || activeCityFilter !== 'all'
                    ? (language === 'ka' 
                        ? `ვერ მოიძებნა ობიექტები ფილტრით "${propertySearchQuery || activeCityFilter}". სცადეთ ფილტრის გასუფთავება.` 
                        : language === 'ru'
                        ? `Не найдено объектов по фильтру "${propertySearchQuery || activeCityFilter}". Попробуйте сбросить фильтры.`
                        : `We couldn't find any properties matching "${propertySearchQuery || activeCityFilter}". Try adjusting your filters.`)
                    : (language === 'ka'
                        ? 'შექმენით თქვენი პირველი ციფრული მეგზური Wi-Fi-ით, კარის კოდით და რეკომენდაციებით.'
                        : language === 'ru'
                        ? 'Создайте свой первый цифровой гид с Wi-Fi, кодом двери и рекомендациями.'
                        : 'Create your first digital guest guide to welcome guests with 1-tap Wi-Fi, door codes, and curated local gems.')}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                {propertySearchQuery || activeCityFilter !== 'all' ? (
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
                  <>
                    <button
                      onClick={() => openAddPropertyModal()}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#B85D3B] hover:bg-[#A35132] text-white cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'ka' ? 'პირველი ობიექტის დამატება' : language === 'ru' ? 'Добавить жильё' : 'Create First Property'}</span>
                    </button>
                    <button
                      onClick={() => setCurrentRoute('/demo')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer flex items-center gap-1.5 transition-colors ${
                        isDarkMode
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-750'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{language === 'ka' ? 'დემო გიდების ნახვა' : language === 'ru' ? 'Смотреть демо-гиды' : 'Explore Demo Guides'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* VIEW MODE 1: RESPONSIVE BENTO CARDS (Clean vertical stack on phone, 2-3 col grid on tablet/desktop) */}
              {mobileView === 'cards' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredProperties.map((p, index) => {
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.07 }}
                      whileHover={{ y: -3 }}
                      onClick={() => {
                        setActivePropertyIndex(index);
                        navigateToPropertyHub(p.id, 'overview');
                      }}
                      className={`w-full min-w-0 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3.5 sm:space-y-4 relative overflow-hidden cursor-pointer border transition-all ${
                        isDarkMode
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700'
                          : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className={`font-serif text-base sm:text-lg font-bold tracking-tight leading-snug break-words line-clamp-2 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>
                              {p.title}
                            </h3>
                            <div className={`flex items-center flex-wrap gap-1.5 text-xs mt-1 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                              <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                              <span className="truncate">{p.city}</span>
                              <span>·</span>
                              <span className="capitalize shrink-0">{p.type}</span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono flex items-center gap-1 shrink-0 border ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : isDarkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                            <span>{p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}</span>
                          </span>
                        </div>

                        {/* Quick Essentials Chips */}
                        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 mt-3">
                          <div className={`p-2.5 rounded-lg flex items-center gap-2 border shadow-xs min-w-0 ${
                            isDarkMode ? 'bg-zinc-950/70 text-zinc-200 border-zinc-800' : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                          }`}>
                            <Wifi className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[8px] uppercase font-mono block opacity-60">Wi-Fi</span>
                              <span className="font-semibold text-[11px] truncate block">{p.wifiNetwork || '—'}</span>
                            </div>
                          </div>

                          <div className={`p-2.5 rounded-lg flex items-center gap-2 border shadow-xs min-w-0 ${
                            isDarkMode ? 'bg-zinc-950/70 text-zinc-200 border-zinc-800' : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                          }`}>
                            <KeyRound className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[8px] uppercase font-mono block opacity-60">{t.hostDashboard.keypadCode}</span>
                              <span className="font-mono font-semibold text-[11px] truncate block">{p.doorKeypadCode || '—'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t ${
                        isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPropertyHub(p.id, 'guide');
                            }}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 active:scale-95 shadow-sm transition-colors cursor-pointer ${
                              isDarkMode
                                ? 'bg-zinc-100 hover:bg-white text-zinc-950'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                            }`}
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
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title="Quick Wi-Fi & Keypad Modal"
                          >
                            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalProperty(p);
                              setShowPhysicalStandModal(true);
                            }}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title="Physical QR & NFC Stand"
                          >
                            <Radio className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalProperty(p);
                              setShowPrintModal(true);
                            }}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
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
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                              isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            }`}
                            title={t.common.copy}
                          >
                            {copiedSlug === p.slug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPropertyHub(p.id, 'overview');
                            }}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
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
            </div>
          )}

          {/* VIEW MODE 2: COMPACT PHOTO GRID (1-col on small phone, 2-col on sm+, 3-col on md+) */}
          {mobileView === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateToPropertyHub(p.id, 'overview')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between shadow-sm min-w-0 ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 shadow-xs hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className={`h-28 rounded-lg overflow-hidden mb-2.5 relative flex items-center justify-center ${
                      isDarkMode ? 'bg-zinc-800/60' : 'bg-zinc-100'
                    }`}>
                      {(p.coverImage || p.photos?.[0]?.url) ? (
                        <img src={p.coverImage || p.photos?.[0]?.url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-zinc-500 opacity-50" />
                      )}
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-semibold border ${
                        p.status === 'published' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-zinc-900/90 text-zinc-300 border-zinc-700'
                      }`}>
                        {p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm truncate leading-snug tracking-tight">
                      {p.title}
                    </h4>
                    <span className={`text-xs truncate block mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{p.city}</span>
                  </div>

                  <div className={`pt-2.5 mt-2.5 border-t flex items-center justify-between gap-2 ${
                    isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPropertyHub(p.id, 'guide');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors ${
                        isDarkMode
                          ? 'bg-zinc-100 hover:bg-white text-zinc-950'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
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
                        className={`p-1.5 rounded-md transition-colors ${
                          isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                        title="Wi-Fi"
                      >
                        <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowPhysicalStandModal(true);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                        title="Laser QR & NFC Stand"
                      >
                        <Radio className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowPrintModal(true);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                        title="Print Stand Flyer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToGuestGuide(p.slug);
                        }}
                        className={`p-1.5 rounded-md font-semibold flex items-center gap-0.5 transition-colors ${
                          isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-zinc-950'
                        }`}
                        title="Open Live Guide"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 3: COMPACT LIST VIEW */}
          {mobileView === 'list' && (
            <div className="space-y-2.5">
              {filteredProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateToPropertyHub(p.id, 'overview')}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm cursor-pointer ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 shadow-xs hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border flex items-center justify-center ${
                      isDarkMode ? 'border-zinc-800 bg-zinc-800/60' : 'border-zinc-200 bg-zinc-100'
                    }`}>
                      {(p.coverImage || p.photos?.[0]?.url) ? (
                        <img src={p.coverImage || p.photos?.[0]?.url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-4 h-4 text-zinc-500 opacity-60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-serif font-bold text-xs sm:text-sm truncate block tracking-tight">{p.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold shrink-0 border ${
                          p.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : isDarkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}>
                          {p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}
                        </span>
                      </div>
                      <span className={`text-[10px] truncate block mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {p.city} · Wi-Fi: <strong className={`font-mono ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>{p.wifiNetwork || '—'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 ${
                    isDarkMode ? 'border-zinc-800/80' : 'border-zinc-100'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowAccessModal(true);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                        }`}
                        title="Wi-Fi Credentials"
                      >
                        <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowPhysicalStandModal(true);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                        }`}
                        title="Laser QR & NFC Stand"
                      >
                        <Radio className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalProperty(p);
                          setShowPrintModal(true);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                        }`}
                        title="Print Flyer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(p);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                        }`}
                        title={t.common.copy}
                      >
                        {copiedSlug === p.slug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPropertyHub(p.id, 'guide');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs active:scale-95 shadow-sm transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'bg-zinc-100 hover:bg-white text-zinc-950'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
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
          <Sparkles className="w-4 h-4 text-[#B85D3B] shrink-0" />
          <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{t.hostDashboard.wantAnotherGuide}</span>
        </div>
        <button
          onClick={() => openAddPropertyModal()}
          className={`w-full sm:w-auto justify-center px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer transition-colors ${
            isDarkMode
              ? 'bg-zinc-100 hover:bg-white text-zinc-950'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
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
              <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                    isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}>
                    <Wifi className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-serif font-bold text-sm leading-tight truncate ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.title}</h3>
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
                  <span className={`font-semibold text-sm block mt-0.5 break-all ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.wifiNetwork}</span>
                  
                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <div className="min-w-0 pr-2">
                      <span className={`text-[9px] font-mono uppercase block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Password</span>
                      <span className={`font-mono font-semibold text-sm tracking-wide break-all ${isDarkMode ? 'text-zinc-100' : 'text-zinc-950'}`}>{selectedModalProperty.wifiPassword}</span>
                    </div>
                    <Copy className={`w-3.5 h-3.5 shrink-0 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
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
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-zinc-100 hover:bg-white text-zinc-950'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  }`}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
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
                <div className="flex items-center gap-2 min-w-0">
                  <Printer className="w-5 h-5 text-zinc-200 shrink-0" />
                  <span className="font-serif font-bold text-sm sm:text-lg text-zinc-100 truncate">
                    Printable Guest Stand · {selectedModalProperty.title}
                  </span>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
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
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t py-1.5 px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-sm ${
        isDarkMode ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-zinc-200'
      }`}>
        <button
          onClick={() => {
            setCurrentTab('overview');
            setCurrentRoute('/app');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'overview'
              ? isDarkMode ? 'text-zinc-100 font-semibold' : 'text-zinc-950 font-semibold'
              : isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[10px] leading-tight">{language === 'ka' ? 'ცენტრი' : language === 'ru' ? 'Центр' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('properties');
            setCurrentRoute('/app/properties');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'properties' || currentTab === 'templates'
              ? isDarkMode ? 'text-zinc-100 font-semibold' : 'text-zinc-950 font-semibold'
              : isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] leading-tight">{language === 'ka' ? 'ობიექტები' : language === 'ru' ? 'Объекты' : 'Properties'}</span>
        </button>

        <button
          onClick={() => openAddPropertyModal()}
          className="w-11 h-11 rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white flex items-center justify-center -mt-4 shadow-md active:scale-95 cursor-pointer transition-colors shrink-0"
          title="Add Property"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            setCurrentTab('requests');
            setCurrentRoute('/app/requests');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'requests' || currentTab === 'reviews'
              ? isDarkMode ? 'text-zinc-100 font-semibold' : 'text-zinc-950 font-semibold'
              : isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span className="text-[10px] leading-tight">{language === 'ka' ? 'შემოსული' : language === 'ru' ? 'Входящие' : 'Inbox'}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('analytics');
            setCurrentRoute('/app/analytics');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'analytics'
              ? isDarkMode ? 'text-zinc-100 font-semibold' : 'text-zinc-950 font-semibold'
              : isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] leading-tight">{language === 'ka' ? 'ანალიტიკა' : language === 'ru' ? 'Аналитика' : 'Analytics'}</span>
        </button>
      </div>

    </div>
  );
};
