import React, { useState, useEffect, useMemo } from 'react';
import {
  Wifi,
  Clock,
  MapPin,
  Copy,
  Check,
  ArrowLeft,
  Compass,
  FileText,
  Sparkles,
  Sun,
  Moon,
  VolumeX,
  Share2,
  Navigation,
  ChevronRight,
  KeyRound,
  ShieldAlert,
  Car,
  Plane,
  Trash2,
  Star,
  ExternalLink,
  Smartphone,
  HelpCircle,
  MessageCircle,
  Phone,
  BookOpen,
  Wrench,
  Lock,
  CheckCircle2,
  Home,
  QrCode,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GuestRequestModal } from './GuestRequestModal';
import { StumariGemsSection } from './StumariGemsSection';
import { VisualHowToPlayer } from '../common/VisualHowToPlayer';
import { ApplianceGuide, Property } from '../../types';
import { ArrivalBoardingPass } from './ArrivalBoardingPass';
import { MobileBottomDock, GuestTab } from './MobileBottomDock';
import { MobileBottomSheet } from './MobileBottomSheet';
import { OfflineGuestMap } from './OfflineGuestMap';
import { ReviewEngineModal } from './ReviewEngineModal';
import { NeedHelpAssistant } from './NeedHelpAssistant';
import { ShareGuideModal } from './ShareGuideModal';
import { AddToHomeScreenModal } from './AddToHomeScreenModal';
import { cacheGuidebookLocally, getCachedGuidebook } from '../../pwa';
import { safeCopyToClipboard } from '../../utils/clipboard';

export interface GuestGuideSimpleProps {
  propertyOverride?: Property;
  isEmbed?: boolean;
}

export const GuestGuideSimple: React.FC<GuestGuideSimpleProps> = ({
  propertyOverride,
  isEmbed = false,
}) => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    properties,
    currentProperty,
    activeGuestSlug,
    fetchGuestProperty,
    unlockGuestPropertyAccess,
    isPropertyAccessUnlocked,
    getLocalizedProperty,
    gems,
    feedbacks,
    guestFavorites,
    toggleGuestFavorite,
    navigateTo,
    firebaseUser,
    showToast,
  } = useApp();

  const isDark = theme === 'dark';

  const cleanActiveSlug = useMemo(
    () => (activeGuestSlug ? decodeURIComponent(activeGuestSlug.split('?')[0]).trim() : ''),
    [activeGuestSlug]
  );

  // Resolve matching property from override, in-memory properties, or offline local cache
  const matchedProperty = useMemo(() => {
    if (propertyOverride) return propertyOverride;
    if (cleanActiveSlug) {
      const match = properties.find(
        p => p.slug === cleanActiveSlug || p.id === cleanActiveSlug
      );
      if (match) {
        const isOwner = Boolean(firebaseUser && match.ownerId === firebaseUser.uid);
        if (match.status === 'published' || isOwner || isEmbed) {
          return match;
        }
        return null;
      }
      const cached = getCachedGuidebook(cleanActiveSlug);
      if (cached) return cached;
      return null;
    }
    return currentProperty;
  }, [propertyOverride, cleanActiveSlug, properties, currentProperty, firebaseUser, isEmbed]);

  const [isFetchingProperty, setIsFetchingProperty] = useState<boolean>(() => {
    if (propertyOverride) return false;
    if (!cleanActiveSlug) return false;
    return !properties.some(p => p.slug === cleanActiveSlug || p.id === cleanActiveSlug);
  });

  const lastFetchedRequestKeyRef = React.useRef<string>('');

  // Fetch guest property once per active slug / token / auth user (prevents any repeated fetch loops)
  useEffect(() => {
    let cancelled = false;
    if (!propertyOverride && cleanActiveSlug) {
      const requestKey = `${cleanActiveSlug}|${activeGuestSlug}|${firebaseUser?.uid || 'anon'}`;
      if (lastFetchedRequestKeyRef.current === requestKey) {
        return;
      }
      lastFetchedRequestKeyRef.current = requestKey;

      const alreadyInState = properties.some(
        p => p.slug === cleanActiveSlug || p.id === cleanActiveSlug
      );
      if (!alreadyInState) {
        setIsFetchingProperty(true);
      }
      fetchGuestProperty(activeGuestSlug).finally(() => {
        if (!cancelled) {
          setIsFetchingProperty(false);
        }
      });
    } else {
      lastFetchedRequestKeyRef.current = '';
      setIsFetchingProperty(false);
    }
    return () => {
      cancelled = true;
    };
  }, [propertyOverride, cleanActiveSlug, activeGuestSlug, firebaseUser?.uid, fetchGuestProperty]);

  const property = useMemo(
    () => (matchedProperty ? getLocalizedProperty(matchedProperty) : null),
    [matchedProperty, getLocalizedProperty]
  );

  const [activeTab, setActiveTab] = useState<GuestTab>('stay');
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedDoorCode, setCopiedDoorCode] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewStars, setSelectedReviewStars] = useState<number | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<
    'wifi' | 'checkin' | 'rules' | 'checkout' | null
  >(null);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceGuide | null>(null);
  const [expandedStayNote, setExpandedStayNote] = useState<'parking' | 'trash' | null>(null);

  // Manual capability-token unlock state
  const [manualAccessKey, setManualAccessKey] = useState('');
  const [isUnlockingKey, setIsUnlockingKey] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Departure Checklist persisted in sessionStorage per property
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  useEffect(() => {
    if (!property?.id) return;
    try {
      const saved = sessionStorage.getItem(`stumari_checklist_${property.id}`);
      setCheckedItems(saved ? JSON.parse(saved) : {});
    } catch {
      setCheckedItems({});
    }
  }, [property?.id]);

  // Track whether guest has submitted review in this session
  const [hasSubmittedReview, setHasSubmittedReview] = useState<boolean>(false);
  useEffect(() => {
    if (!property?.id) return;
    try {
      setHasSubmittedReview(
        sessionStorage.getItem(`stumari_review_submitted_${property.id}`) === '1'
      );
    } catch {
      setHasSubmittedReview(false);
    }
  }, [property?.id]);

  // Cache sanitized public property data locally for offline viewing only when property identity/version changes
  useEffect(() => {
    if (property && property.slug && !isEmbed) {
      try {
        cacheGuidebookLocally(property);
      } catch {
        // Ignore storage errors
      }
    }
  }, [property?.id, property?.slug, property?.updatedAt, isEmbed]);

  const handleManualUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !manualAccessKey.trim()) return;
    setIsUnlockingKey(true);
    setUnlockError(null);

    const ok = await unlockGuestPropertyAccess(
      property.slug || property.id,
      manualAccessKey.trim()
    );
    setIsUnlockingKey(false);
    if (ok) {
      setManualAccessKey('');
      setUnlockError(null);
    } else {
      setUnlockError(
        language === 'ka'
          ? 'წვდომის კოდი არასწორია. გთხოვთ გადაამოწმოთ მასპინძელთან.'
          : language === 'ru'
          ? 'Неверный код доступа. Пожалуйста, проверьте ссылку от хозяина.'
          : 'Invalid access key. Please check the check-in link provided by your host.'
      );
    }
  };

  const toggleCheckItem = (idx: number) => {
    setCheckedItems(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      if (property?.id) {
        try {
          sessionStorage.setItem(`stumari_checklist_${property.id}`, JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
      }
      return next;
    });
  };

  // Scroll to top when changing tabs
  const handleSelectTab = (tab: GuestTab) => {
    setActiveTab(tab);
    if (!isEmbed && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Curated Gems for this property
  const propertyGems = useMemo(() => {
    if (!property) return [];
    const customList = property.customGems || [];
    const selectedIds = property.gemIds;
    const baseList =
      selectedIds && selectedIds.length > 0
        ? gems.filter(g => selectedIds.includes(g.id))
        : gems;
    const merged = [...customList];
    baseList.forEach(g => {
      if (!merged.some(m => m.id === g.id)) merged.push(g);
    });
    return merged;
  }, [property, gems]);

  const favoriteGemsList = useMemo(
    () => propertyGems.filter(g => guestFavorites.includes(g.id)),
    [propertyGems, guestFavorites]
  );

  // Positive feedback notes for this property to display in the Digital Guestbook
  const propertyGuestbookFeedbacks = useMemo(() => {
    if (!property) return [];
    return feedbacks.filter(
      f =>
        f.propertyId === property.id &&
        (f.sentiment === 'amazing' || f.sentiment === 'good') &&
        (Boolean(f.comment && f.comment.trim()) ||
          Boolean(f.categories && f.categories.length > 0))
    );
  }, [property, feedbacks]);

  if (isFetchingProperty && !property) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#141312] text-[#1C1B1A] dark:text-[#F7F5F0] flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] rounded-3xl p-8 text-center space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#F55A51]/15 text-[#F55A51] flex items-center justify-center mx-auto animate-pulse">
              <Home className="w-5 h-5" />
            </div>
            <p className="text-sm font-serif font-bold">
              {language === 'ka'
                ? 'იტვირთება სტუმრის გზამკვლევი...'
                : language === 'ru'
                ? 'Загрузка путеводителя...'
                : 'Loading Guest Guide...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#141312] text-[#1C1B1A] dark:text-[#F7F5F0] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <h1 className="text-2xl font-serif font-bold">
              {language === 'ka'
                ? 'გზამკვლევი ვერ მოიძებნა'
                : language === 'ru'
                ? 'Путеводитель не найден'
                : 'Guidebook Not Found'}
            </h1>
            <p className="text-sm text-[#7A756D] dark:text-[#A39E93]">
              {language === 'ka' ? (
                <>
                  საცხოვრებლის გზამკვლევი მისამართით{' '}
                  <span className="font-mono">{cleanActiveSlug}</span> ვერ მოიძებნა ან ჯერ არ არის გამოქვეყნებული.
                </>
              ) : language === 'ru' ? (
                <>
                  Путеводитель по адресу{' '}
                  <span className="font-mono">{cleanActiveSlug}</span> не найден или ещё не опубликован.
                </>
              ) : (
                <>
                  We couldn't find a published property guide matching{' '}
                  <span className="font-mono">{cleanActiveSlug}</span>.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F55A51] text-white font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'ka'
                ? 'მთავარ გვერდზე დაბრუნება'
                : language === 'ru'
                ? 'На главную'
                : 'Return Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOfficialDemo = Boolean(
    property.isDemo ||
      property.id === 'prop-1' ||
      property.slug === 'old-tbilisi-apartment'
  );
  const isAccessUnlocked = isPropertyAccessUnlocked(property);
  const hostWhatsApp = isAccessUnlocked ? property.hostWhatsApp || '' : '';
  const cleanHostWhatsApp = hostWhatsApp.replace(/[^0-9]/g, '');
  const canUseDirectWhatsApp = Boolean(isAccessUnlocked && cleanHostWhatsApp);
  const emergencyPhone =
    property.emergencyServicesNumber ||
    (isAccessUnlocked ? property.emergencyContact : '') ||
    '112';

  const copyWifi = async () => {
    if (!property.wifiPassword) return;
    const ok = await safeCopyToClipboard(property.wifiPassword);
    if (ok) {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
      showToast(
        language === 'ka'
          ? 'Wi-Fi პაროლი დაკოპირდა!'
          : language === 'ru'
          ? 'Пароль Wi-Fi скопирован!'
          : 'Wi-Fi password copied!'
      );
    } else {
      showToast(
        language === 'ka'
          ? 'ავტომატური კოპირება ვერ მოხერხდა — გთხოვთ მონიშნოთ ტექსტი'
          : language === 'ru'
          ? 'Не удалось скопировать автоматически — выделите текст вручную'
          : 'Could not copy automatically — please select the text manually'
      );
    }
  };

  const copyAddress = async () => {
    if (!isAccessUnlocked || !property.address) return;
    const ok = await safeCopyToClipboard(property.address);
    if (ok) {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      showToast(
        language === 'ka'
          ? 'მისამართი დაკოპირდა!'
          : language === 'ru'
          ? 'Адрес скопирован!'
          : 'Address copied!'
      );
    } else {
      showToast(
        language === 'ka'
          ? 'ავტომატური კოპირება ვერ მოხერხდა'
          : language === 'ru'
          ? 'Не удалось скопировать автоматически'
          : 'Could not copy address automatically'
      );
    }
  };

  const welcomeMessage = property.welcomeGreeting || property.tagline;
  const arrivalDirections = property.arrivalDirections;
  const houseRulesList = property.houseRules || [];
  const departureList = property.departureChecklist || [];
  const trashNotes = property.trashSchedule;
  const parkingNotes = isAccessUnlocked ? property.parkingInstructions : '';
  const taxiNotes = property.taxiInfo;
  const transitNotes = property.transitInfo;
  const airportNotes = property.airportTransit;

  const cityNormalized = (property.city || '').toLowerCase();
  const isTbilisiProperty =
    cityNormalized.includes('tbilisi') ||
    cityNormalized.includes('თბილის') ||
    cityNormalized.includes('тбилиси');

  // Check if there is an access/entry step-by-step guide in property.appliances
  const entryVisualGuide = property.appliances?.find(
    a => a.category === 'access' || a.icon === 'KeyRound'
  );

  const navItems: {
    id: GuestTab;
    label: { en: string; ka: string; ru: string };
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'stay', label: { en: 'Stay', ka: 'სახლი', ru: 'Жильё' }, icon: Home },
    { id: 'gems', label: { en: 'Gems', ka: 'რჩეული', ru: 'Места' }, icon: Sparkles },
    { id: 'explore', label: { en: 'Explore', ka: 'გარემო', ru: 'Район' }, icon: Compass },
    { id: 'feedback', label: { en: 'Review', ka: 'შეფასება', ru: 'Отзыв' }, icon: Star },
    { id: 'host', label: { en: 'Host', ka: 'მასპინძელი', ru: 'Хозяин' }, icon: MessageCircle },
  ];

  const mapsDestination =
    isAccessUnlocked && property.address
      ? property.latitude && property.longitude
        ? `${property.latitude},${property.longitude}`
        : encodeURIComponent(property.address)
      : encodeURIComponent(`${property.city || 'Tbilisi'}, ${property.country || 'Georgia'}`);

  const airbnbReviewUrl = property.publicReviewLinks?.airbnb;
  const bookingReviewUrl = property.publicReviewLinks?.booking;
  const googleReviewUrl = property.publicReviewLinks?.google;

  return (
    <div className={isDark ? 'dark' : ''}>
      <div
        className={`${
          isEmbed ? 'min-h-full' : 'min-h-screen'
        } bg-[#FAF8F5] dark:bg-[#141312] text-[#1C1B1A] dark:text-[#F7F5F0] font-sans pb-28 lg:pb-16 selection:bg-[#F55A51]/20 transition-colors duration-300`}
      >
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-[#141312]/90 backdrop-blur-xl border-b border-[#EBE6DF] dark:border-[#2B2926]">
          <div className="max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
            {/* Brand & Host Dashboard Back Link */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {firebaseUser && !isEmbed && (
                <button
                  type="button"
                  onClick={() => navigateTo('/app')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-white transition-colors py-1.5 px-2 sm:px-2.5 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {language === 'ka'
                      ? 'მასპინძლის პანელი'
                      : language === 'ru'
                      ? 'Панель хозяина'
                      : 'Host Studio'}
                  </span>
                </button>
              )}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#F55A51] text-white font-serif font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                  S
                </div>
                <div className="min-w-0">
                  <span className="font-serif font-bold text-sm tracking-tight block leading-none text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                    Stumari
                  </span>
                  <span className="text-[10px] text-[#7A756D] dark:text-[#A39E93] font-medium block truncate mt-0.5">
                    {property.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Visible on lg+ viewports when not embedded in phone frame) */}
            {!isEmbed && (
              <nav
                aria-label="Guest guide sections"
                className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]"
              >
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] shadow-sm'
                          : 'text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-[#F7F5F0]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#F55A51]' : ''}`} />
                      {item.label[language]}
                      {item.id === 'gems' && guestFavorites.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#F55A51] text-white text-[10px]">
                          {guestFavorites.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Right Controls: Save to Phone, Share, Theme Toggle, Language */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsInstallModalOpen(true)}
                className="hidden min-[380px]:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] items-center justify-center text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
                title={
                  language === 'ka'
                    ? 'ტელეფონში შენახვა'
                    : language === 'ru'
                    ? 'Сохранить на телефон'
                    : 'Save Guide to Phone'
                }
              >
                <Smartphone className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-center text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
                title={
                  language === 'ka'
                    ? 'გზამკვლევის გაზიარება'
                    : language === 'ru'
                    ? 'Поделиться гидом'
                    : 'Share Guide'
                }
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-center text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-[#FFC757]" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Language Switcher */}
              <div className="flex items-center p-0.5 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]">
                {(['en', 'ka', 'ru'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase transition-all cursor-pointer ${
                      language === lang
                        ? 'bg-[#F55A51] text-white shadow-sm'
                        : 'text-[#7A756D] dark:text-[#A39E93] hover:text-[#1C1B1A] dark:hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Responsive Container */}
        <main
          className={`${
            isEmbed ? 'max-w-xl' : 'max-w-xl md:max-w-3xl lg:max-w-5xl'
          } mx-auto px-4 sm:px-6 pt-5 space-y-6`}
        >
          {/* =========================================================
              TAB 1: STAY — Welcome, Arrival Pass, Manual, Help
             ========================================================= */}
          {activeTab === 'stay' && (
            <div className="space-y-6">
              {/* Section A: Welcome & Property Identity */}
              <div className="relative rounded-3xl overflow-hidden bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] shadow-[0_14px_40px_-16px_rgba(28,27,26,0.14)]">
                {property.coverImage ? (
                  <div className="relative h-64 sm:h-72 lg:h-80 w-full">
                    <img
                      src={property.coverImage}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/45 to-black/15" />
                  </div>
                ) : (
                  <div className="h-44 sm:h-52 w-full bg-gradient-to-br from-[#1F1E1C] via-[#141312] to-[#2B2926]" />
                )}

                {/* Location Pill */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-white text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#F55A51]" />
                    <span>
                      {property.city || 'Tbilisi'}, {property.country || 'Georgia'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsInstallModalOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white text-xs font-semibold hidden sm:inline-flex items-center gap-1.5 hover:bg-black/75 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#FFC757]" />
                    {language === 'ka'
                      ? 'შენახვა ტელეფონში'
                      : language === 'ru'
                      ? 'Сохранить гид'
                      : 'Save to Phone'}
                  </button>
                </div>

                {/* Title & Host Identity */}
                <div className="p-6 sm:p-7 -mt-20 relative z-10 text-white space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFC757] block mb-1">
                      {property.welcomeTitle ||
                        (language === 'ka'
                          ? 'კეთილი იყოს თქვენი მობრძანება'
                          : language === 'ru'
                          ? 'Добро пожаловать'
                          : 'Welcome to Your Stay')}
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight leading-tight">
                      {property.title}
                    </h1>
                    {property.subtitle && (
                      <p className="text-xs sm:text-sm text-white/80 mt-1">{property.subtitle}</p>
                    )}
                  </div>

                  {/* Host Note & Attribution */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      {property.hostAvatar ? (
                        <img
                          src={property.hostAvatar}
                          alt={property.hostName}
                          className="w-11 h-11 rounded-full object-cover border border-white/30 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#F55A51] text-white font-serif font-bold text-base flex items-center justify-center shrink-0">
                          {property.hostName.charAt(0)}
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">
                          {language === 'ka'
                            ? `მასპინძელი: ${property.hostName}`
                            : language === 'ru'
                            ? `Ваш хозяин: ${property.hostName}`
                            : `Hosted by ${property.hostName}`}
                        </p>
                        {welcomeMessage && (
                          <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                            “{welcomeMessage}”
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('host')}
                      className="px-3.5 py-2 rounded-xl bg-white text-[#1C1B1A] text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#F55A51]" />
                      {language === 'ka'
                        ? 'კონტაქტი'
                        : language === 'ru'
                        ? 'Связаться'
                        : 'Contact Host'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop 2-Column Layout for Section B (Arrival Pass) & Section C (Apartment Manual) */}
              <div
                className={`grid grid-cols-1 ${
                  isEmbed ? '' : 'lg:grid-cols-12'
                } gap-6 items-start`}
              >
                {/* Section B: Arrival Boarding Pass (Left 7 columns on Desktop) */}
                <div className={`${isEmbed ? '' : 'lg:col-span-7'} space-y-4`}>
                  <ArrivalBoardingPass
                    property={property}
                    language={language}
                    onOpenCheckinInstructions={() => setActiveSheet('checkin')}
                    onOpenWifiModal={() => setActiveSheet('wifi')}
                  />

                  {/* Visual Check-In Walkthrough inline preview when unlocked and configured */}
                  {isAccessUnlocked && entryVisualGuide && (
                    <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F55A51] block">
                            {language === 'ka'
                              ? 'ვიზუალური ინსტრუქცია'
                              : language === 'ru'
                              ? 'Пошаговое заселение'
                              : 'Step-by-Step Arrival'}
                          </span>
                          <h2 className="font-serif font-bold text-base text-[#1C1B1A] dark:text-[#F7F5F0]">
                            {entryVisualGuide.title ||
                              entryVisualGuide.name ||
                              (language === 'ka'
                                ? 'როგორ შევიდეთ ბინაში'
                                : language === 'ru'
                                ? 'Как попасть в квартиру'
                                : 'How to Enter the Property')}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveSheet('checkin')}
                          className="text-xs font-bold text-[#F55A51] hover:underline cursor-pointer"
                        >
                          {language === 'ka'
                            ? 'სრულად'
                            : language === 'ru'
                            ? 'Подробнее'
                            : 'Full view'}
                        </button>
                      </div>
                      <VisualHowToPlayer
                        guide={entryVisualGuide}
                        language={language}
                        isDark={isDark}
                        compact
                      />
                    </div>
                  )}
                </div>

                {/* Section C: Apartment Manual (Right 5 columns on Desktop) */}
                <div className={`${isEmbed ? '' : 'lg:col-span-5'} space-y-5`}>
                  {/* Tier 3: House Rules, Check-Out & Progressive Disclosure for Parking/Trash */}
                  <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-5 space-y-4 shadow-[0_8px_28px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C96] block">
                          {language === 'ka'
                            ? 'სახლის გზამკვლევი'
                            : language === 'ru'
                            ? 'Правила и удобства'
                            : 'Apartment Manual'}
                        </span>
                        <h2 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                          {language === 'ka'
                            ? 'წესები და გასვლა'
                            : language === 'ru'
                            ? 'Правила дома и выезд'
                            : 'House Rules & Departure'}
                        </h2>
                      </div>
                    </div>

                    {/* Focused 2-Tile Manual Pair (No duplicate Check-In tile competing with ArrivalBoardingPass) */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveSheet('rules')}
                        className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51]/40 transition-all text-left flex flex-col justify-between min-h-[100px] cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#7A756D] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0]">
                            {language === 'ka'
                              ? 'სახლის წესები'
                              : language === 'ru'
                              ? 'Правила дома'
                              : 'House Rules'}
                          </p>
                          <p className="text-[11px] text-[#7A756D] dark:text-[#A39E93] mt-0.5">
                            {houseRulesList.length > 0
                              ? language === 'ka'
                                ? `${houseRulesList.length} წესი`
                                : language === 'ru'
                                ? `Правил: ${houseRulesList.length}`
                                : `${houseRulesList.length} guidelines`
                              : language === 'ka'
                              ? 'სიჩუმის საათები'
                              : language === 'ru'
                              ? 'Тихие часы и правила'
                              : 'Quiet hours & policies'}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveSheet('checkout')}
                        className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51]/40 transition-all text-left flex flex-col justify-between min-h-[100px] cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-[#748C96]/15 text-[#748C96] flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#7A756D] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0]">
                            {language === 'ka'
                              ? 'გასვლის სია'
                              : language === 'ru'
                              ? 'Выезд из дома'
                              : 'Check-Out Guide'}
                          </p>
                          <p className="text-[11px] text-[#7A756D] dark:text-[#A39E93] mt-0.5">
                            {property.checkOutTime
                              ? language === 'ka'
                                ? `${property.checkOutTime}-მდე`
                                : language === 'ru'
                                ? `До ${property.checkOutTime}`
                                : `By ${property.checkOutTime}`
                              : language === 'ka'
                              ? 'გასვლის ჩექლისტი'
                              : language === 'ru'
                              ? 'Чек-лист выезда'
                              : 'Departure checklist'}
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Progressive Disclosure Accordions for Parking & Trash */}
                    {(trashNotes || parkingNotes) && (
                      <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] divide-y divide-[#EBE6DF] dark:divide-[#2B2926] overflow-hidden">
                        {parkingNotes && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedStayNote(
                                  expandedStayNote === 'parking' ? null : 'parking'
                                )
                              }
                              aria-expanded={expandedStayNote === 'parking'}
                              className="w-full px-4 py-3 text-left flex items-center justify-between gap-2.5 hover:bg-white/60 dark:hover:bg-[#1F1E1C]/50 transition-colors min-h-[46px] cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                                <Car className="w-4 h-4 text-[#748C96] shrink-0" />
                                <span>
                                  {language === 'ka'
                                    ? 'პარკირების წესი'
                                    : language === 'ru'
                                    ? 'Парковка у дома'
                                    : 'Parking Instructions'}
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-[#7A756D] transition-transform duration-200 ${
                                  expandedStayNote === 'parking'
                                    ? 'rotate-180 text-[#F55A51]'
                                    : ''
                                }`}
                              />
                            </button>
                            {expandedStayNote === 'parking' && (
                              <div className="px-4 pb-3.5 pt-1 text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed bg-white/50 dark:bg-[#1F1E1C]/30">
                                {parkingNotes}
                              </div>
                            )}
                          </div>
                        )}

                        {trashNotes && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedStayNote(expandedStayNote === 'trash' ? null : 'trash')
                              }
                              aria-expanded={expandedStayNote === 'trash'}
                              className="w-full px-4 py-3 text-left flex items-center justify-between gap-2.5 hover:bg-white/60 dark:hover:bg-[#1F1E1C]/50 transition-colors min-h-[46px] cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                                <Trash2 className="w-4 h-4 text-[#748C96] shrink-0" />
                                <span>
                                  {language === 'ka'
                                    ? 'ნაგვის გატანა'
                                    : language === 'ru'
                                    ? 'Вынос мусора'
                                    : 'Trash & Recycling'}
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-[#7A756D] transition-transform duration-200 ${
                                  expandedStayNote === 'trash' ? 'rotate-180 text-[#F55A51]' : ''
                                }`}
                              />
                            </button>
                            {expandedStayNote === 'trash' && (
                              <div className="px-4 pb-3.5 pt-1 text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed bg-white/50 dark:bg-[#1F1E1C]/30">
                                {trashNotes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tier 3: How Things Work — Divided List (No nested box-in-box clutter) */}
                  {property.appliances && property.appliances.length > 0 && (
                    <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-5 space-y-3.5 shadow-[0_8px_28px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F55A51] block">
                            {language === 'ka'
                              ? 'ტექნიკის ინსტრუქცია'
                              : language === 'ru'
                              ? 'Бытовая техника'
                              : 'How Things Work'}
                          </span>
                          <h3 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                            {language === 'ka'
                              ? 'სახლის მოწყობილობები'
                              : language === 'ru'
                              ? 'Техника в доме'
                              : 'Appliance Guides'}
                          </h3>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-[#7A756D] dark:text-[#A39E93]">
                          {property.appliances.length}
                        </span>
                      </div>

                      <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] divide-y divide-[#EBE6DF] dark:divide-[#2B2926] overflow-hidden">
                        {property.appliances.map(app => {
                          const appTitle = app.title || app.name || 'Appliance';
                          const stepCount =
                            app.steps?.length || app.stepsText?.length || 0;
                          const thumbUrl =
                            app.mediaType === 'photo' && app.mediaUrl
                              ? app.mediaUrl
                              : app.mediaPoster;

                          return (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedAppliance(app)}
                              className="w-full p-3.5 hover:bg-white dark:hover:bg-[#1F1E1C] transition-colors flex items-center justify-between gap-3 text-left group cursor-pointer"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                {thumbUrl ? (
                                  <img
                                    src={thumbUrl}
                                    alt={appTitle}
                                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#EBE6DF] dark:border-[#2B2926] mt-0.5"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center shrink-0 mt-0.5">
                                    <Wrench className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-sm text-[#1C1B1A] dark:text-[#F7F5F0]">
                                      {appTitle}
                                    </p>
                                    {stepCount > 0 && (
                                      <span className="px-2 py-0.5 rounded-full bg-[#F55A51]/10 text-[#F55A51] text-[10px] font-bold shrink-0">
                                        {stepCount}{' '}
                                        {language === 'ka'
                                          ? 'ნაბიჯი'
                                          : language === 'ru'
                                          ? 'шага'
                                          : 'steps'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[#5C5852] dark:text-[#A39E93] line-clamp-2 mt-0.5 leading-relaxed">
                                    {app.instructions}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#7A756D] group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section D: First Interesting Recommendation Spotlight & Stay Support */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tier 2: Featured First Local Gem Spotlight on Stay Tab */}
                {propertyGems.length > 0 && (
                  <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_-14px_rgba(28,27,26,0.07)] dark:shadow-none">
                    <div>
                      <div className="p-5 pb-3 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#F55A51]">
                            <Sparkles className="w-3.5 h-3.5" />
                            {language === 'ka'
                              ? 'მასპინძლის რჩეული'
                              : language === 'ru'
                              ? 'Рекомендация хозяина'
                              : `${property.hostName}’s Top Pick Nearby`}
                          </span>
                          <span className="text-[11px] font-semibold text-[#7A756D] dark:text-[#A39E93]">
                            {language === 'ka'
                              ? `${propertyGems.length} ადგილი`
                              : language === 'ru'
                              ? `${propertyGems.length} мест`
                              : `${propertyGems.length} curated spots`}
                          </span>
                        </div>
                      </div>

                      {/* Featured First Gem Card Preview */}
                      <div
                        onClick={() => handleSelectTab('gems')}
                        className="px-5 pb-4 flex items-start gap-3.5 cursor-pointer group"
                      >
                        {propertyGems[0].image && (
                          <img
                            src={propertyGems[0].image}
                            alt={propertyGems[0].title}
                            loading="lazy"
                            className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#EBE6DF] dark:border-[#2B2926] group-hover:scale-105 transition-transform"
                          />
                        )}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {propertyGems[0].subCategory && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99B26] dark:text-[#FFC757]">
                                {propertyGems[0].subCategory}
                              </span>
                            )}
                            {propertyGems[0].distance && (
                              <span className="text-[11px] text-[#7A756D] dark:text-[#A39E93]">
                                · {propertyGems[0].distance}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1B1A] dark:text-[#F7F5F0] group-hover:text-[#F55A51] transition-colors truncate">
                            {propertyGems[0].title}
                          </h3>
                          <p className="text-xs italic text-[#5C5852] dark:text-[#A39E93] line-clamp-2 border-l-2 border-[#F55A51] pl-2.5">
                            “{propertyGems[0].hostQuote || propertyGems[0].localTip || propertyGems[0].whyWeRecommend}”
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSelectTab('gems')}
                        className="w-full py-3 px-4 rounded-2xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
                      >
                        <span>
                          {language === 'ka'
                            ? `ყველა ${propertyGems.length} რჩეული ადგილის ნახვა`
                            : language === 'ru'
                            ? `Смотреть все ${propertyGems.length} рекомендаций`
                            : `Explore All ${propertyGems.length} Local Gems`}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#F55A51]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Concierge & Stay Requests Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex flex-col justify-between gap-4 shadow-[0_10px_30px_-14px_rgba(28,27,26,0.07)] dark:shadow-none">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#748C96]">
                      <HelpCircle className="w-3.5 h-3.5 text-[#F55A51]" />
                      {language === 'ka'
                        ? 'სტუმრის მხარდაჭერა'
                        : language === 'ru'
                        ? 'Поддержка гостей'
                        : 'Stay Support & Requests'}
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? 'გჭირდებათ დამატებითი პირსახოცი ან გვიანი გასვლა?'
                        : language === 'ru'
                        ? 'Нужен поздний выезд или свежие полотенца?'
                        : 'Need Late Check-Out or Fresh Towels?'}
                    </h3>
                    <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                      {language === 'ka'
                        ? `გაუგზავნეთ სწრაფი მოთხოვნა ${property.hostName}-ს ან იხილეთ სწრაფი პასუხები.`
                        : language === 'ru'
                        ? `Отправьте быстрый запрос ${property.hostName} или откройте ответы по дому.`
                        : `Send a stay request to ${property.hostName} or browse organized quick answers.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsRequestModalOpen(true)}
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#F55A51] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E04840] transition-colors cursor-pointer min-h-[44px]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'ka'
                        ? 'მოთხოვნის გაგზავნა'
                        : language === 'ru'
                        ? 'Оставить запрос'
                        : 'Request Something'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('host')}
                      className="py-3 px-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] hover:border-[#F55A51]/40 transition-colors cursor-pointer min-h-[44px]"
                    >
                      {language === 'ka' ? 'დახმარება' : language === 'ru' ? 'Помощь' : 'Host & FAQ'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: GEMS — Host-Curated Local Places & Mood Discovery
             ========================================================= */}
          {activeTab === 'gems' && (
            <div className="space-y-6">
              <StumariGemsSection
                property={property}
                gems={propertyGems}
                hostName={property.hostName}
                hostAvatar={property.hostAvatar}
                language={language}
                favoriteIds={guestFavorites}
                onToggleFavorite={toggleGuestFavorite}
                hostWhatsApp={hostWhatsApp}
                isAccessUnlocked={isAccessUnlocked}
                onOpenRequestModal={() => setIsRequestModalOpen(true)}
              />
            </div>
          )}

          {/* =========================================================
              TAB 3: EXPLORE — Neighborhood Directory, Map & Transit
             ========================================================= */}
          {activeTab === 'explore' && (
            <div className="space-y-5">
              {/* Tier 4: Open Editorial Masthead on Canvas (Eliminates double-stacked header boxes) */}
              <div className="pt-1 pb-4 border-b border-[#EBE6DF] dark:border-[#2B2926] space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F55A51]/10 border border-[#F55A51]/20 text-[#F55A51] text-[11px] font-bold uppercase tracking-widest">
                  <Compass className="w-3.5 h-3.5" />
                  {language === 'ka'
                    ? 'უბნის გზამკვლევი'
                    : language === 'ru'
                    ? 'Путеводитель по району'
                    : 'Neighborhood & Getting Around'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1C1B1A] dark:text-[#F7F5F0]">
                  {language === 'ka'
                    ? `აღმოაჩინეთ ${property.city || 'უბანი'}`
                    : language === 'ru'
                    ? `Исследуйте ${property.city || 'район'}`
                    : `Explore Around ${property.title}`}
                </h1>
                <p className="text-xs sm:text-sm text-[#5C5852] dark:text-[#A39E93] max-w-2xl leading-relaxed">
                  {language === 'ka'
                    ? 'ყველა რეკომენდებული ადგილი, მარშრუტი და ტრანსპორტის ინფორმაცია ერთ სივრცეში.'
                    : language === 'ru'
                    ? 'Все рекомендованные места, маршруты и советы по транспорту рядом с домом.'
                    : 'Browse recommended neighborhood spots, get directions back to your stay, and check local transit notes.'}
                </p>
              </div>

              {/* Unified Neighborhood Map & Directory */}
              <OfflineGuestMap
                property={property}
                language={language}
                favoriteIds={guestFavorites}
                onToggleFavorite={toggleGuestFavorite}
                propertyGems={propertyGems}
              />

              {/* Tier 3: Property-Aware Transit & Local Notes (Divided list instead of nested boxes) */}
              {(taxiNotes || transitNotes || airportNotes || isTbilisiProperty) && (
                <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-5 sm:p-6 space-y-4 shadow-[0_8px_28px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C96] block">
                      {language === 'ka'
                        ? 'გადაადგილება'
                        : language === 'ru'
                        ? 'Транспорт'
                        : 'Getting Around'}
                    </span>
                    <h2 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? 'ტრანსპორტი და სასარგებლო რჩევები'
                        : language === 'ru'
                        ? 'Транспорт и полезные советы'
                        : 'Transit & Local Tips'}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] divide-y divide-[#EBE6DF] dark:divide-[#2B2926] overflow-hidden">
                    {(taxiNotes || isTbilisiProperty) && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center shrink-0 mt-0.5">
                          <Car className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] block">
                            {language === 'ka'
                              ? 'ტაქსის აპლიკაციები'
                              : language === 'ru'
                              ? 'Приложения такси'
                              : 'Ride Apps & Taxis'}
                          </span>
                          <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                            {taxiNotes ||
                              (language === 'ka'
                                ? 'გამოიყენეთ Bolt-ის აპლიკაცია ქალაქში კომფორტული და ფიქსირებული ტარიფით გადაადგილებისთვის.'
                                : language === 'ru'
                                ? 'Используйте приложение Bolt для поездок по городу с фиксированной ценой.'
                                : 'Use the Bolt app rather than street-hailing for reliable pickups and transparent card pricing.')}
                          </p>
                        </div>
                      </div>
                    )}

                    {(transitNotes || isTbilisiProperty) && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#748C96]/15 text-[#748C96] flex items-center justify-center shrink-0 mt-0.5">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] block">
                            {language === 'ka'
                              ? 'საზოგადოებრივი ტრანსპორტი'
                              : language === 'ru'
                              ? 'Общественный транспорт'
                              : 'Metro & Bus Transit'}
                          </span>
                          <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                            {transitNotes ||
                              (language === 'ka'
                                ? 'მეტროსა და ავტობუსებში გადახდა შესაძლებელია ნებისმიერი უკონტაქტო საბანკო ბარათით ან Apple/Google Pay-ით.'
                                : language === 'ru'
                                ? 'Оплата в метро и автобусах возможна любой бесконтактной картой или Apple/Google Pay.'
                                : 'Tbilisi Metro and municipal buses accept contactless Visa/Mastercard and Apple/Google Pay directly at the turnstile.')}
                          </p>
                        </div>
                      </div>
                    )}

                    {airportNotes && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center shrink-0 mt-0.5">
                          <Plane className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] block">
                            {language === 'ka'
                              ? 'აეროპორტის გზა'
                              : language === 'ru'
                              ? 'Дорога в аэропорт'
                              : 'Airport Transit'}
                          </span>
                          <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                            {airportNotes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 4: REVIEW — Unmistakable Public vs. Private Feedback
             ========================================================= */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {/* Interactive Star Rating Masthead Card */}
              <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-6 sm:p-8 text-center space-y-5 shadow-[0_10px_32px_-16px_rgba(28,27,26,0.07)] dark:shadow-none">
                <div className="w-12 h-12 rounded-2xl bg-[#FFC757]/20 text-[#D99B26] dark:text-[#FFC757] flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 fill-current" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F55A51] block">
                    {language === 'ka'
                      ? 'თქვენი შთაბეჭდილება'
                      : language === 'ru'
                      ? 'Ваши впечатления'
                      : 'Guest Feedback & Guestbook'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                    {language === 'ka'
                      ? `როგორ მოგეწონათ ${property.title}?`
                      : language === 'ru'
                      ? `Как вам проживание в ${property.title}?`
                      : `How Was Your Stay at ${property.title}?`}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                    {language === 'ka'
                      ? 'აირჩიეთ ვარსკვლავი ან ქვემოთ აირჩიეთ საჯარო ჩანაწერი სტუმრების წიგნაკში თუ პირადი შეტყობინება მასპინძლისთვის.'
                      : language === 'ru'
                      ? 'Нажмите на звезду или выберите ниже: публичная запись в гостевую книгу либо личное сообщение только для хозяина.'
                      : 'Tap a star rating below, or choose directly between signing the public guestbook and sending private feedback to your host.'}
                  </p>
                </div>

                {hasSubmittedReview && (
                  <div className="mx-auto max-w-md px-4 py-2.5 rounded-2xl bg-[#2E7D32]/10 border border-[#2E7D32]/25 flex items-center justify-center gap-2 text-xs font-semibold text-[#2E7D32] dark:text-[#81C784]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'ka'
                        ? 'მადლობა! თქვენი შეფასება ჩაწერილია ამ სესიაზე.'
                        : language === 'ru'
                        ? 'Спасибо! Ваш отзыв сохранён в этой сессии.'
                        : 'Thank you! Your feedback has been recorded in this session.'}
                    </span>
                  </div>
                )}

                {/* Interactive 1-5 Star Selector */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                  {[1, 2, 3, 4, 5].map(starValue => {
                    const isFilled = (selectedReviewStars || 0) >= starValue;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => {
                          setSelectedReviewStars(starValue);
                          setIsReviewModalOpen(true);
                        }}
                        aria-label={`Rate ${starValue} out of 5 stars`}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#FFC757] hover:scale-105 transition-all flex items-center justify-center group cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            isFilled
                              ? 'fill-[#FFC757] text-[#FFC757]'
                              : 'text-[#D5CEC4] dark:text-[#3A3733] group-hover:fill-[#FFC757] group-hover:text-[#FFC757]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unmistakable Public vs. Private Feedback Pathway Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pathway 1: PUBLIC Guestbook & Platform Review */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex flex-col justify-between gap-4 shadow-[0_8px_28px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F55A51]/10 text-[#F55A51] text-[10px] font-bold uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        {language === 'ka'
                          ? 'საჯარო · სტუმრების წიგნაკი'
                          : language === 'ru'
                          ? 'Публично · Гостевая книга'
                          : 'Public · Visible to Guests'}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? 'სტუმრების წიგნაკში ჩაწერა'
                        : language === 'ru'
                        ? 'Запись в гостевую книгу'
                        : 'Sign the Digital Guestbook'}
                    </h2>
                    <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                      {language === 'ka'
                        ? `გაუზიარეთ შთაბეჭდილებები მომავალ სტუმრებს ${property.hostName}-ის საჯარო წიგნაკში და მარტივად დააკოპირეთ ტექსტი Airbnb / Booking-ისთვის.`
                        : language === 'ru'
                        ? `Поделитесь впечатлениями с будущими гостями в гостевой книге ${property.hostName} и скопируйте текст для Airbnb / Booking.`
                        : `Share a public note for future guests in ${property.hostName}’s guestbook, with 1-tap copy to reuse on Airbnb or Booking.com.`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReviewStars(5);
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#F55A51] hover:bg-[#E04840] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[46px] cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    {language === 'ka'
                      ? 'საჯარო ჩანაწერის დატოვება'
                      : language === 'ru'
                      ? 'Оставить публичную запись'
                      : 'Sign Public Guestbook'}
                  </button>
                </div>

                {/* Pathway 2: PRIVATE Note to Host Only */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex flex-col justify-between gap-4 shadow-[0_8px_28px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#748C96]/15 text-[#748C96] text-[10px] font-bold uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5" />
                        {language === 'ka'
                          ? 'პირადი · მხოლოდ მასპინძლისთვის'
                          : language === 'ru'
                          ? 'Лично · Только для хозяина'
                          : 'Private · Host Eyes Only'}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? `პირადი შენიშვნა ${property.hostName}-ს`
                        : language === 'ru'
                        ? `Личное сообщение для ${property.hostName}`
                        : `Private Note to ${property.hostName}`}
                    </h2>
                    <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                      {language === 'ka'
                        ? `გაქვთ რჩევა ან შენიშვნა, რაც შეიძლება გავაუმჯობესოთ? ეს შეტყობინება ეგზავნება მხოლოდ ${property.hostName}-ს და არ ქვეყნდება საჯაროდ.`
                        : language === 'ru'
                        ? `Есть совет по улучшению или замечание по дому? Это сообщение увидит только ${property.hostName} — оно не публикуется.`
                        : `Have a suggestion or spotted something that needs attention? This message goes privately to ${property.hostName} and is never posted publicly.`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReviewStars(3);
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-h-[46px] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F55A51]" />
                    {language === 'ka'
                      ? 'პირადი შეტყობინების გაგზავნა'
                      : language === 'ru'
                      ? 'Отправить личное сообщение'
                      : 'Send Private Feedback'}
                  </button>
                </div>
              </div>

              {/* Direct External Platform Review Links (Only shown if configured by host) */}
              {(airbnbReviewUrl || bookingReviewUrl || googleReviewUrl) && (
                <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C96] block">
                      {language === 'ka'
                        ? 'დაჯავშნის პლატფორმები'
                        : language === 'ru'
                        ? 'Платформы бронирования'
                        : 'Booking Platforms'}
                    </span>
                    <h2 className="font-serif font-bold text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? 'დაგვიტოვეთ შეფასება პლატფორმაზე'
                        : language === 'ru'
                        ? 'Оставьте отзыв на сайте бронирования'
                        : 'Review Us Where You Booked'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {airbnbReviewUrl && (
                      <a
                        href={airbnbReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#FF5A5F] transition-all flex items-center justify-between font-bold text-xs text-[#1C1B1A] dark:text-[#F7F5F0]"
                      >
                        <span>Airbnb Review</span>
                        <ExternalLink className="w-4 h-4 text-[#FF5A5F]" />
                      </a>
                    )}
                    {bookingReviewUrl && (
                      <a
                        href={bookingReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#003580] transition-all flex items-center justify-between font-bold text-xs text-[#1C1B1A] dark:text-[#F7F5F0]"
                      >
                        <span>Booking.com Review</span>
                        <ExternalLink className="w-4 h-4 text-[#003580] dark:text-[#748C96]" />
                      </a>
                    )}
                    {googleReviewUrl && (
                      <a
                        href={googleReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51] transition-all flex items-center justify-between font-bold text-xs text-[#1C1B1A] dark:text-[#F7F5F0]"
                      >
                        <span>Google Maps Review</span>
                        <ExternalLink className="w-4 h-4 text-[#F55A51]" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tier 2: Editorial Digital Guestbook Stories (Grounded in actual feedbacks for this property) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F55A51] block">
                      {language === 'ka'
                        ? 'სტუმრების ჩანაწერები'
                        : language === 'ru'
                        ? 'Записи гостей'
                        : 'Public Guestbook'}
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? 'სტუმრების წიგნაკი'
                        : language === 'ru'
                        ? 'Гостевая книга дома'
                        : 'Notes From Previous Guests'}
                    </h2>
                  </div>
                  {propertyGuestbookFeedbacks.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#7A756D] dark:text-[#A39E93]">
                      {propertyGuestbookFeedbacks.length}
                    </span>
                  )}
                </div>

                {propertyGuestbookFeedbacks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyGuestbookFeedbacks.map(entry => {
                      const starsCount = entry.sentiment === 'amazing' ? 5 : 4;
                      return (
                        <article
                          key={entry.id}
                          className="p-5 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex flex-col justify-between gap-4 shadow-[0_8px_26px_-14px_rgba(28,27,26,0.06)] dark:shadow-none"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: starsCount }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3.5 h-3.5 fill-[#FFC757] text-[#FFC757]"
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] text-[#7A756D] dark:text-[#A39E93]">
                                {entry.createdAt}
                              </span>
                            </div>

                            <blockquote className="border-l-2 border-[#F55A51] pl-3.5 py-0.5">
                              {entry.comment ? (
                                <p className="text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] leading-relaxed italic">
                                  “{entry.comment}”
                                </p>
                              ) : (
                                <p className="text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] leading-relaxed italic">
                                  {language === 'ka'
                                    ? '“შესანიშნავი სტუმრობა და საუკეთესო მასპინძლობა!”'
                                    : language === 'ru'
                                    ? '«Прекрасное проживание и тёплое гостеприимство!»'
                                    : '“Wonderful stay and warm hospitality!”'}
                                </p>
                              )}
                            </blockquote>
                          </div>

                          <div className="pt-2.5 border-t border-[#EBE6DF]/70 dark:border-[#2B2926]/70 flex items-center justify-between text-xs">
                            <span className="font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                              {entry.guestName || 'Guest'}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-dashed border-[#EBE6DF] dark:border-[#2B2926] text-center space-y-2">
                    <p className="text-sm font-semibold text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {language === 'ka'
                        ? 'იყავით პირველი, ვინც დატოვებს ჩანაწერს სტუმრების წიგნაკში!'
                        : language === 'ru'
                        ? 'Станьте первым гостем, оставившим запись в гостевой книге!'
                        : 'Be the first guest to leave a note in the digital guestbook!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: HOST — Action-First Contact, Location, FAQ & 112
             ========================================================= */}
          {activeTab === 'host' && (
            <div className="space-y-6">
              {/* 1. Tier 1: Host Profile & Obvious Direct Contact Card */}
              <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-6 sm:p-7 space-y-5 shadow-[0_12px_34px_-16px_rgba(28,27,26,0.08)] dark:shadow-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {property.hostAvatar ? (
                      <img
                        src={property.hostAvatar}
                        alt={property.hostName}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#EBE6DF] dark:border-[#2B2926]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#F55A51] text-white font-serif font-bold text-2xl flex items-center justify-center">
                        {property.hostName.charAt(0)}
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#F55A51] block">
                        {property.hostRole ||
                          (language === 'ka'
                            ? 'თქვენი მასპინძელი'
                            : language === 'ru'
                            ? 'Ваш хозяин'
                            : 'Your Host')}
                      </span>
                      <h1 className="text-2xl font-serif font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                        {property.hostName}
                      </h1>
                      <p className="text-xs text-[#5C5852] dark:text-[#A39E93]">
                        {language === 'ka'
                          ? `მასპინძელი საცხოვრებელში: ${property.title}`
                          : language === 'ru'
                          ? `Принимает гостей в ${property.title}`
                          : `Welcoming guests to ${property.title}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Direct Contact & Assistance Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EBE6DF] dark:border-[#2B2926]">
                  {canUseDirectWhatsApp ? (
                    <a
                      href={`https://wa.me/${cleanHostWhatsApp}?text=${encodeURIComponent(
                        `Hi ${property.hostName}! I'm staying at ${property.title} and have a question...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-4 rounded-2xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity min-h-[48px]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {language === 'ka'
                        ? `მიწერეთ ${property.hostName}-ს WhatsApp-ში`
                        : language === 'ru'
                        ? `Написать ${property.hostName} в WhatsApp`
                        : `Message ${property.hostName} on WhatsApp`}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveSheet('checkin')}
                      className="py-3.5 px-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0] font-bold text-xs flex items-center justify-center gap-2 hover:border-[#F55A51]/40 transition-colors min-h-[48px] cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-[#F55A51]" />
                      {language === 'ka'
                        ? 'გახსენით პირდაპირი WhatsApp კონტაქტი'
                        : language === 'ru'
                        ? 'Разблокировать прямой WhatsApp хозяина'
                        : 'Unlock Direct Host WhatsApp'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(true)}
                    className="py-3.5 px-4 rounded-2xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-h-[48px] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F55A51]" />
                    {language === 'ka'
                      ? 'სერვისის / დროის მოთხოვნა'
                      : language === 'ru'
                      ? 'Запросить услугу / время выезда'
                      : 'Request Late Check-Out or Extras'}
                  </button>
                </div>
              </div>

              {/* 2. Tier 1: Property Address for Taxi / Delivery (Immediately Accessible) */}
              <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_26px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#748C96]">
                    <MapPin className="w-4 h-4 text-[#F55A51] shrink-0" />
                    {language === 'ka'
                      ? 'მისამართი ტაქსისა და კურიერისთვის'
                      : language === 'ru'
                      ? 'Адрес для такси и доставки'
                      : 'Address for Taxi / Delivery'}
                  </div>
                  <p className="font-serif font-bold text-base sm:text-lg text-[#1C1B1A] dark:text-[#F7F5F0] break-words">
                    {isAccessUnlocked && property.address
                      ? property.address
                      : `${property.city || 'Tbilisi'}, ${property.country || 'Georgia'}`}
                  </p>
                  {!isAccessUnlocked && (
                    <p className="text-xs text-[#7A756D] dark:text-[#A39E93]">
                      {language === 'ka'
                        ? 'ზუსტი მისამართი ჩანს წვდომის კოდის შეყვანის შემდეგ.'
                        : language === 'ru'
                        ? 'Точный адрес отображается после ввода ключа доступа.'
                        : 'Exact street address unlocks with your check-in key.'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isAccessUnlocked && property.address && (
                    <button
                      type="button"
                      onClick={copyAddress}
                      className="py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                    >
                      {copiedAddress ? (
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
                            ? 'მისამართის კოპირება'
                            : language === 'ru'
                            ? 'Скопировать адрес'
                            : 'Copy Address'}
                        </>
                      )}
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapsDestination}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold flex items-center justify-center gap-1.5 min-h-[42px]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#F55A51]" />
                    {language === 'ka'
                      ? 'რუკაზე გახსნა'
                      : language === 'ru'
                      ? 'Открыть в картах'
                      : 'Google Maps'}
                  </a>
                </div>
              </div>

              {/* 3. Tier 3: Grouped Quick Stay Answers (NeedHelpAssistant) */}
              <NeedHelpAssistant
                property={property}
                language={language}
                onOpenRequestModal={() => setIsRequestModalOpen(true)}
                onOpenUnlockModal={() => setActiveSheet('checkin')}
              />

              {/* 4. Distinct Emergency Support Banner */}
              <div className="rounded-3xl bg-[#F55A51]/[0.05] dark:bg-[#F55A51]/[0.09] border border-[#F55A51]/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F55A51]">
                    <ShieldAlert className="w-4 h-4" />
                    {language === 'ka'
                      ? 'გადაუდებელი დახმარება'
                      : language === 'ru'
                      ? 'Экстренная помощь'
                      : 'Emergency Services'}
                  </div>
                  <p className="font-serif font-bold text-base sm:text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                    {language === 'ka'
                      ? 'საქართველოს გადაუდებელი დახმარება: 112'
                      : language === 'ru'
                      ? 'Экстренная служба Грузии: 112'
                      : 'Unified Emergency Line: 112'}
                  </p>
                  <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed max-w-xl">
                    {language === 'ka'
                      ? '24/7 სასწრაფო სამედიცინო დახმარება, პოლიცია და სახანძრო სამსახური (საუბრობენ ინგლისურად).'
                      : language === 'ru'
                      ? 'Круглосуточная скорая помощь, полиция и пожарная служба.'
                      : '24/7 Police, Ambulance, and Fire response with English-speaking operators.'}
                  </p>
                </div>

                <a
                  href={`tel:${emergencyPhone}`}
                  className="py-3 px-5 rounded-2xl bg-[#F55A51] text-white text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-[#E04840] transition-colors shrink-0 min-h-[46px] shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  {language === 'ka'
                    ? `დარეკვა (${emergencyPhone})`
                    : language === 'ru'
                    ? `Позвонить (${emergencyPhone})`
                    : `Call ${emergencyPhone}`}
                </a>
              </div>
            </div>
          )}
        </main>

        {/* =========================================================
            SHARED MODALS & BOTTOM SHEETS
           ========================================================= */}

        {/* 1. Wi-Fi Sheet */}
        <MobileBottomSheet
          isOpen={activeSheet === 'wifi'}
          onClose={() => setActiveSheet(null)}
          title={
            language === 'ka'
              ? 'Wi-Fi კავშირი'
              : language === 'ru'
              ? 'Подключение к Wi-Fi'
              : 'Wi-Fi Connection'
          }
        >
          <div className="space-y-5 pb-4">
            {isAccessUnlocked ? (
              property.wifiNetwork || property.wifiPassword ? (
                <>
                  <div className="p-5 rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex flex-col items-center text-center space-y-2.5">
                    <div className="w-16 h-16 rounded-2xl bg-[#748C96]/15 text-[#748C96] flex items-center justify-center">
                      <Wifi className="w-8 h-8" />
                    </div>
                    <p className="text-xs text-[#7A756D] dark:text-[#A39E93]">
                      {language === 'ka'
                        ? 'დააკოპირეთ პაროლი და აირჩიეთ ქსელი თქვენი ტელეფონის Wi-Fi პარამეტრებში'
                        : language === 'ru'
                        ? 'Скопируйте пароль ниже и выберите сеть в настройках Wi-Fi телефона'
                        : 'Copy the password below and select the network in your device Wi-Fi settings'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                        {language === 'ka'
                          ? 'ქსელის სახელი'
                          : language === 'ru'
                          ? 'Имя сети'
                          : 'Network Name (SSID)'}
                      </span>
                      <p className="text-base font-bold text-[#1C1B1A] dark:text-[#F7F5F0] mt-0.5">
                        {property.wifiNetwork || 'Property Wi-Fi'}
                      </p>
                    </div>

                    {property.wifiPassword && (
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                            {language === 'ka'
                              ? 'პაროლი'
                              : language === 'ru'
                              ? 'Пароль'
                              : 'Password'}
                          </span>
                          <p className="text-base font-mono font-bold text-[#1C1B1A] dark:text-[#F7F5F0] truncate mt-0.5">
                            {property.wifiPassword}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={copyWifi}
                          className="px-4 py-2.5 rounded-xl bg-[#F55A51] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          {copiedWifi ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              {language === 'ka'
                                ? 'დაკოპირდა'
                                : language === 'ru'
                                ? 'Скопировано'
                                : 'Copied'}
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              {language === 'ka'
                                ? 'კოპირება'
                                : language === 'ru'
                                ? 'Копировать'
                                : 'Copy'}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-[#7A756D] dark:text-[#A39E93] text-center py-6">
                  {language === 'ka'
                    ? 'Wi-Fi-ს მონაცემები ჯერ არ არის დამატებული.'
                    : language === 'ru'
                    ? 'Данные Wi-Fi пока не добавлены.'
                    : 'Wi-Fi details have not been added for this property yet.'}
                </p>
              )
            ) : (
              <form onSubmit={handleManualUnlock} className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F55A51]">
                    <Lock className="w-4 h-4" />
                    {language === 'ka'
                      ? 'სტუმრის წვდომის კოდი'
                      : language === 'ru'
                      ? 'Защищено ключом гостя'
                      : 'Protected Guest Credentials'}
                  </div>
                  <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                    {language === 'ka'
                      ? 'Wi-Fi პაროლისა და შესვლის კოდების სანახავად შეიყვანეთ მასპინძლის მიერ გამოგზავნილი წვდომის გასაღები ან სრული QR ბმული.'
                      : language === 'ru'
                      ? 'Введите ключ доступа или полную ссылку от хозяина, чтобы открыть пароль Wi-Fi и коды дверей.'
                      : 'Enter the check-in key or paste the full check-in link shared by your host to unlock Wi-Fi and door codes.'}
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={manualAccessKey}
                    onChange={e => setManualAccessKey(e.target.value)}
                    placeholder={
                      language === 'ka'
                        ? 'ჩასვით წვდომის გასაღები ან ბმული...'
                        : language === 'ru'
                        ? 'Вставьте ключ доступа или ссылку...'
                        : 'Paste check-in key or link...'
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-mono text-[#1C1B1A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#F55A51]"
                  />
                  {unlockError && (
                    <p className="text-xs text-[#F55A51] font-medium mt-1.5">{unlockError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUnlockingKey || !manualAccessKey.trim()}
                  className="w-full py-3.5 rounded-2xl bg-[#F55A51] text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                >
                  {isUnlockingKey
                    ? language === 'ka'
                      ? 'მოწმდება...'
                      : language === 'ru'
                      ? 'Проверка...'
                      : 'Verifying...'
                    : language === 'ka'
                    ? 'გახსნა'
                    : language === 'ru'
                    ? 'Разблокировать'
                    : 'Unlock Guest Credentials'}
                </button>
              </form>
            )}
          </div>
        </MobileBottomSheet>

        {/* 2. Check-In & Access Sheet */}
        <MobileBottomSheet
          isOpen={activeSheet === 'checkin'}
          onClose={() => setActiveSheet(null)}
          title={
            language === 'ka'
              ? 'შესვლის ინსტრუქცია'
              : language === 'ru'
              ? 'Инструкция по заселению'
              : 'Check-In & Access'
          }
        >
          <div className="space-y-5 pb-4">
            {!isAccessUnlocked ? (
              <form onSubmit={handleManualUnlock} className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F55A51]">
                    <Lock className="w-4 h-4" />
                    {language === 'ka'
                      ? 'დაცული შესვლის მონაცემები'
                      : language === 'ru'
                      ? 'Защищённые данные входа'
                      : 'Unlock Check-In Credentials'}
                  </div>
                  <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                    {language === 'ka'
                      ? 'კარის კოდის, ზუსტი მისამართისა და Wi-Fi-ს გასახსნელად შეიყვანეთ თქვენი სტუმრის გასაღები.'
                      : language === 'ru'
                      ? 'Для просмотра кода двери, точного адреса и Wi-Fi введите ключ гостя из вашей ссылки заезда.'
                      : 'Enter your check-in key or paste the private link from your host to reveal door codes, exact address, and step-by-step entry instructions.'}
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={manualAccessKey}
                    onChange={e => setManualAccessKey(e.target.value)}
                    placeholder={
                      language === 'ka'
                        ? 'ჩასვით წვდომის გასაღები ან ბმული...'
                        : language === 'ru'
                        ? 'Вставьте ключ доступа или ссылку...'
                        : 'Paste check-in key or link...'
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-mono text-[#1C1B1A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#F55A51]"
                  />
                  {unlockError && (
                    <p className="text-xs text-[#F55A51] font-medium mt-1.5">{unlockError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUnlockingKey || !manualAccessKey.trim()}
                  className="w-full py-3.5 rounded-2xl bg-[#F55A51] text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                >
                  {isUnlockingKey
                    ? language === 'ka'
                      ? 'მოწმდება...'
                      : language === 'ru'
                      ? 'Проверка...'
                      : 'Verifying...'
                    : language === 'ka'
                    ? 'შესვლის კოდის გახსნა'
                    : language === 'ru'
                    ? 'Разблокировать доступ'
                    : 'Unlock Check-In Access'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {(property.doorKeypadCode || property.lockboxCode) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.doorKeypadCode && (
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                            {language === 'ka'
                              ? 'კარის კოდი'
                              : language === 'ru'
                              ? 'Код двери / домофона'
                              : 'Door Keypad Code'}
                          </span>
                          <p className="font-mono text-xl font-bold text-[#F55A51] mt-1">
                            {property.doorKeypadCode}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await safeCopyToClipboard(property.doorKeypadCode);
                            if (ok) {
                              setCopiedDoorCode('keypad');
                              setTimeout(() => setCopiedDoorCode(null), 2000);
                            } else {
                              showToast(
                                language === 'ka'
                                  ? 'კოდის კოპირება ვერ მოხერხდა'
                                  : language === 'ru'
                                  ? 'Не удалось скопировать код'
                                  : 'Could not copy code automatically'
                              );
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          {copiedDoorCode === 'keypad' ? (
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
                    )}
                    {property.lockboxCode && (
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                            {language === 'ka'
                              ? 'სეიფის (Lockbox) კოდი'
                              : language === 'ru'
                              ? 'Код сейфа (Lockbox)'
                              : 'Lockbox Code'}
                          </span>
                          <p className="font-mono text-xl font-bold text-[#F55A51] mt-1">
                            {property.lockboxCode}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await safeCopyToClipboard(property.lockboxCode);
                            if (ok) {
                              setCopiedDoorCode('lockbox');
                              setTimeout(() => setCopiedDoorCode(null), 2000);
                            } else {
                              showToast(
                                language === 'ka'
                                  ? 'კოდის კოპირება ვერ მოხერხდა'
                                  : language === 'ru'
                                  ? 'Не удалось скопировать код'
                                  : 'Could not copy code automatically'
                              );
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          {copiedDoorCode === 'lockbox' ? (
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
                    )}
                  </div>
                )}

                {arrivalDirections && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                      {language === 'ka'
                        ? 'მოსვლის ინსტრუქცია'
                        : language === 'ru'
                        ? 'Как войти'
                        : 'Arrival Instructions'}
                    </span>
                    <p className="text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] leading-relaxed whitespace-pre-line">
                      {arrivalDirections}
                    </p>
                  </div>
                )}

                {entryVisualGuide && (
                  <VisualHowToPlayer
                    guide={entryVisualGuide}
                    language={language}
                    isDark={isDark}
                  />
                )}
              </div>
            )}
          </div>
        </MobileBottomSheet>

        {/* 3. House Rules Sheet */}
        <MobileBottomSheet
          isOpen={activeSheet === 'rules'}
          onClose={() => setActiveSheet(null)}
          title={
            language === 'ka'
              ? 'სახლის წესები'
              : language === 'ru'
              ? 'Правила проживания'
              : 'House Rules'
          }
        >
          <div className="space-y-4 pb-4">
            {/* Quiet Hours Highlight */}
            {property.quietHours && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center gap-2.5">
                <VolumeX className="w-4 h-4 text-[#F55A51] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                    {language === 'ka'
                      ? 'სიჩუმის საათები'
                      : language === 'ru'
                      ? 'Тихие часы'
                      : 'Quiet Hours'}
                  </span>
                  <span className="text-xs font-bold">{property.quietHours}</span>
                </div>
              </div>
            )}

            {houseRulesList.length > 0 ? (
              <div className="space-y-2">
                {houseRulesList.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#F55A51]/10 text-[#F55A51] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A756D] dark:text-[#A39E93] text-center py-4">
                {language === 'ka'
                  ? 'გთხოვთ გაუფრთხილდეთ ბინას და პატივი სცეთ მეზობლების სიმშვიდეს.'
                  : language === 'ru'
                  ? 'Пожалуйста, бережно относитесь к квартире и уважайте покой соседей.'
                  : 'Please treat the apartment and neighbors with care.'}
              </p>
            )}
          </div>
        </MobileBottomSheet>

        {/* 4. Check-Out Checklist Sheet (Persisted in sessionStorage) */}
        <MobileBottomSheet
          isOpen={activeSheet === 'checkout'}
          onClose={() => setActiveSheet(null)}
          title={
            language === 'ka'
              ? 'გასვლის ინსტრუქცია'
              : language === 'ru'
              ? 'Чек-лист перед выездом'
              : 'Departure Checklist'
          }
        >
          <div className="space-y-4 pb-4">
            {property.checkOutTime && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A756D] dark:text-[#A39E93]">
                  {language === 'ka'
                    ? 'გასვლის დრო'
                    : language === 'ru'
                    ? 'Время выезда'
                    : 'Scheduled Check-Out'}
                </span>
                <span className="text-sm font-bold text-[#F55A51]">{property.checkOutTime}</span>
              </div>
            )}

            {departureList.length > 0 ? (
              <div className="space-y-2">
                {departureList.map((item, idx) => {
                  const done = Boolean(checkedItems[idx]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCheckItem(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 text-xs cursor-pointer ${
                        done
                          ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32] line-through'
                          : 'bg-white dark:bg-[#1F1E1C] border-[#EBE6DF] dark:border-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 ${
                          done ? 'text-[#2E7D32]' : 'text-[#7A756D]'
                        }`}
                      />
                      <span className="font-medium leading-relaxed">{item}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#7A756D] dark:text-[#A39E93] text-center py-4">
                {language === 'ka'
                  ? 'გასვლის წინ გთხოვთ გადაამოწმოთ, რომ პირადი ნივთები არ დაგრჩათ.'
                  : language === 'ru'
                  ? 'Перед выходом, пожалуйста, убедитесь, что вы не забыли личные вещи.'
                  : 'Please double-check that you have all personal belongings before locking up.'}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveSheet(null);
                setIsRequestModalOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#F55A51] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              {language === 'ka'
                ? 'გვიანი გასვლის მოთხოვნა'
                : language === 'ru'
                ? 'Запросить поздний выезд'
                : 'Need a Late Check-Out? Request Here'}
            </button>
          </div>
        </MobileBottomSheet>

        {/* 5. Appliance Detail Sheet (Uses real VisualHowToPlayer, never fabricates video/photos) */}
        <MobileBottomSheet
          isOpen={!!selectedAppliance}
          onClose={() => setSelectedAppliance(null)}
          title={
            selectedAppliance
              ? selectedAppliance.title || selectedAppliance.name || 'Appliance Guide'
              : ''
          }
        >
          {selectedAppliance && (
            <div className="space-y-4 pb-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F55A51] block">
                  {language === 'ka'
                    ? 'მოხმარების წესი'
                    : language === 'ru'
                    ? 'Инструкция'
                    : 'Instructions'}
                </span>
                <p className="text-xs sm:text-sm text-[#1C1B1A] dark:text-[#F7F5F0] leading-relaxed whitespace-pre-line">
                  {selectedAppliance.instructions}
                </p>
              </div>

              {((selectedAppliance.steps && selectedAppliance.steps.length > 0) ||
                (selectedAppliance.stepsText && selectedAppliance.stepsText.length > 0) ||
                selectedAppliance.videoUrl ||
                (selectedAppliance.mediaType === 'video' && selectedAppliance.mediaUrl)) && (
                <VisualHowToPlayer
                  key={selectedAppliance.id}
                  guide={selectedAppliance}
                  language={language}
                  isDark={isDark}
                />
              )}
            </div>
          )}
        </MobileBottomSheet>

        {/* 6. Guest Request Modal */}
        <GuestRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          language={language}
          property={property}
        />

        {/* 7. Review Engine Modal */}
        <ReviewEngineModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          property={property}
          language={language}
          initialStars={selectedReviewStars}
          onSubmitted={() => {
            setHasSubmittedReview(true);
            try {
              sessionStorage.setItem(`stumari_review_submitted_${property.id}`, '1');
            } catch {
              // Ignore storage errors
            }
          }}
        />

        {/* 8. Share Guide Modal */}
        <ShareGuideModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          property={property}
          favoriteGems={favoriteGemsList}
        />

        {/* 9. Add to Home Screen Modal */}
        <AddToHomeScreenModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Mobile & Tablet Floating Bottom Navigation Dock (Hidden on lg+ unless embedded in simulator) */}
        <div className={isEmbed ? '' : 'lg:hidden'}>
          <MobileBottomDock
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            unreadFeedbackBadge={!hasSubmittedReview && false}
          />
        </div>
      </div>
    </div>
  );
};
