import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  BookOpen, 
  Smartphone, 
  QrCode as QrIcon, 
  Settings as SettingsIcon, 
  ExternalLink, 
  ArrowLeft, 
  Check, 
  Copy, 
  Download, 
  Trash2, 
  Sparkles, 
  Layers,
  Wifi, 
  KeyRound, 
  MapPin, 
  Plus, 
  Radio, 
  Printer,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  Shield,
  Clock,
  ChevronRight,
  TrendingUp,
  Compass,
  MessageSquareHeart,
  Star,
  X,
  Eye,
  EyeOff,
  Zap,
  Phone,
  Car,
  Bell,
  CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp, PropertyTab, GuideSectionKey } from '../../context/AppContext';
import { Property, PropertyType } from '../../types';
import { PROPERTY_HUB_I18N } from '../../data/propertyHubI18n';
import { HostAnalytics } from './HostAnalytics';
import { PropertyGemsCurator } from './PropertyGemsCurator';
import { ReviewEngineInbox } from './ReviewEngineInbox';
import { GuestRequestsInbox } from './GuestRequestsInbox';
import { SmartPhotoBuilder } from './SmartPhotoBuilder';
import { VisualHowToManager } from './VisualHowToManager';
import { PropertyTemplatesManager } from './PropertyTemplatesManager';
import { GuideHealthChecker } from './GuideHealthChecker';
import { LiveGuestPreviewSimulator } from './LiveGuestPreviewSimulator';
import { AIGuideAssistantModal } from './AIGuideAssistantModal';
import { NearbyEssentialsSuggester } from './NearbyEssentialsSuggester';
import { PrintFlyer } from '../print/PrintFlyer';
import { PhysicalStandModal } from '../common/PhysicalStandModal';

import { auth } from '../../firebase';

type HubMainDestination = 'studio' | 'qr' | 'activity' | 'settings';

type StudioSectionId =
  | 'welcome'
  | 'checkin'
  | 'wifi'
  | 'appliances'
  | 'rules-checkout'
  | 'gems-essentials'
  | 'transport-contact';

export const PropertyHub: React.FC = () => {
  const { 
    properties,
    currentProperty, 
    updateProperty, 
    deleteProperty, 
    duplicateProperty,
    togglePublishProperty,
    getGuestCheckInUrl,
    rotatePropertyAccessToken,
    propertySubTab, 
    setPropertySubTab, 
    guideActiveSection, 
    setGuideActiveSection,
    navigateToGuestGuide,
    setCurrentRoute,
    showToast,
    theme,
    t,
    language,
    requests,
    feedbacks,
    firebaseUser
  } = useApp();

  const isDarkMode = theme === 'dark';
  const hubContent = PROPERTY_HUB_I18N[language] || PROPERTY_HUB_I18N.en;
  const currentUid = auth.currentUser?.uid || firebaseUser?.uid;

  const rawCurrentProperty = useMemo(() => {
    if (currentUid) {
      const owned = properties.filter(p => p.ownerId === currentUid && !p.isDemo);
      return owned.find(p => p.id === currentProperty?.id) || owned[0] || (null as unknown as Property);
    }
    return properties.find(p => p.id === currentProperty?.id) || currentProperty;
  }, [properties, currentProperty, currentUid]);

  const [prop, setProp] = useState<Property>(rawCurrentProperty);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPhysicalStandModal, setShowPhysicalStandModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAiAssistantModal, setShowAiAssistantModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showSplitPreview, setShowSplitPreview] = useState(false);

  // Sub-views inside consolidated sections
  const [gemsSubView, setGemsSubView] = useState<'gems' | 'essentials'>('gems');
  const [activitySubView, setActivitySubView] = useState<'analytics' | 'requests' | 'reviews'>('analytics');

  // Sync prop when rawCurrentProperty changes (including clearing to null when no owned property exists)
  useEffect(() => {
    setProp(rawCurrentProperty);
  }, [rawCurrentProperty]);

  // Map legacy 10 GuideSectionKey values to the 7 Guidebook Studio sections
  const resolveStudioSection = (sec: GuideSectionKey, subTab: PropertyTab): StudioSectionId => {
    if (subTab === 'gems') return 'gems-essentials';
    switch (sec) {
      case 'welcome':
        return 'welcome';
      case 'checkin':
        return 'checkin';
      case 'wifi':
        return 'wifi';
      case 'how-it-works':
        return 'appliances';
      case 'rules':
      case 'checkout':
        return 'rules-checkout';
      case 'recommendations':
        return 'gems-essentials';
      case 'transport':
      case 'contact':
      case 'emergency':
        return 'transport-contact';
      default:
        return 'welcome';
    }
  };

  const [activeStudioSection, setActiveStudioSection] = useState<StudioSectionId>(() =>
    resolveStudioSection(guideActiveSection, propertySubTab)
  );

  // Sync when external navigation updates guideActiveSection or propertySubTab
  useEffect(() => {
    if (propertySubTab === 'gems') {
      setActiveStudioSection('gems-essentials');
      setGemsSubView('gems');
    } else if (propertySubTab === 'guide' || propertySubTab === 'overview') {
      setActiveStudioSection(resolveStudioSection(guideActiveSection, propertySubTab));
      if (guideActiveSection === 'recommendations') {
        setGemsSubView('essentials');
      }
    } else if (propertySubTab === 'reviews') {
      setActivitySubView('reviews');
    } else if (propertySubTab === 'analytics') {
      setActivitySubView('analytics');
    }
  }, [guideActiveSection, propertySubTab]);

  const selectStudioSection = (sectionId: StudioSectionId) => {
    setActiveStudioSection(sectionId);
    if (propertySubTab === 'preview' || propertySubTab === 'gems' || propertySubTab === 'overview') {
      setPropertySubTab('guide');
    }
    switch (sectionId) {
      case 'welcome':
        setGuideActiveSection('welcome');
        break;
      case 'checkin':
        setGuideActiveSection('checkin');
        break;
      case 'wifi':
        setGuideActiveSection('wifi');
        break;
      case 'appliances':
        setGuideActiveSection('how-it-works');
        break;
      case 'rules-checkout':
        setGuideActiveSection('rules');
        break;
      case 'gems-essentials':
        setGuideActiveSection('recommendations');
        break;
      case 'transport-contact':
        setGuideActiveSection('transport');
        break;
    }
  };

  // Resolve active 4-destination tab from propertySubTab
  const activeDestination: HubMainDestination =
    propertySubTab === 'qr'
      ? 'qr'
      : propertySubTab === 'analytics' || propertySubTab === 'reviews'
      ? 'activity'
      : propertySubTab === 'settings'
      ? 'settings'
      : 'studio';

  // Generate QR Code data URL (encodes authorized guest check-in URL with capability token)
  useEffect(() => {
    if (!prop?.slug) return;
    const guestUrl = getGuestCheckInUrl(prop, true);
    QRCode.toDataURL(guestUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0C1510',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR:', err));
  }, [prop?.slug, prop?.accessToken, getGuestCheckInUrl]);

  const handleFieldChange = (field: keyof Property, value: any) => {
    const updated = { ...prop, [field]: value };
    setProp(updated);
    updateProperty(updated);
  };

  const handleCopyLink = () => {
    const guestUrl = getGuestCheckInUrl(prop, true);
    navigator.clipboard.writeText(guestUrl);
    setCopiedLink(true);
    showToast(t.common.copied);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPublicOnlyLink = () => {
    const publicUrl = getGuestCheckInUrl(prop, false);
    navigator.clipboard.writeText(publicUrl);
    showToast(
      language === 'ka'
        ? 'საჯარო გიდის ბმული დაკოპირდა (პაროლების გარეშე)'
        : 'Public guide link copied (Wi-Fi & door codes hidden)'
    );
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `stumari-qr-${prop.slug}.png`;
    a.click();
    showToast(t.common.download);
  };

  if (!prop) {
    return (
      <div className={`max-w-xl mx-auto my-12 p-8 rounded-[32px] border text-center space-y-4 ${
        isDarkMode ? 'bg-[#0C1013] text-stone-100 border-stone-800' : 'bg-white text-stone-900 border-stone-200 shadow-xl'
      }`}>
        <h3 className="font-serif text-xl font-bold">
          {language === 'ka' ? 'ობიექტი ვერ მოიძებნა' : language === 'ru' ? 'Объект не найден' : 'Property Not Found'}
        </h3>
        <p className="text-xs text-stone-400">
          {language === 'ka' ? 'არჩეული ობიექტი არ არსებობს ან წაშლილია.' : language === 'ru' ? 'Выбранный объект не существует или был удалён.' : 'The requested property does not exist or has been removed.'}
        </p>
        <button
          onClick={() => setCurrentRoute('/app')}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors"
        >
          {language === 'ka' ? 'დაბრუნება პანელზე' : language === 'ru' ? 'Вернуться в панель' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  // Property-scoped counts for Activity badge
  const propertyRequestsCount = requests.filter(r => r.propertyId === prop.id && r.status !== 'resolved').length;
  const propertyFeedbacksCount = feedbacks.filter(f => f.propertyId === prop.id).length;

  // 7 Organized Guidebook Studio Sections with readiness indicators
  const studioSections: {
    id: StudioSectionId;
    number: string;
    label: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    isComplete: boolean;
    meta?: string;
  }[] = [
    {
      id: 'welcome',
      number: '01',
      label: language === 'ka' ? 'მისალმება და ფოტო გალერეა' : language === 'ru' ? 'Приветствие и фотогалерея' : 'Welcome & Photo Gallery',
      subtitle: language === 'ka' ? 'მისასალმებელი ტექსტი და ოთახების ფოტოები' : 'Headline greeting, host note & room photos',
      icon: Building2,
      isComplete: Boolean(prop.welcomeGreeting && prop.coverImage),
      meta: `${(prop.photos || []).length + (prop.coverImage ? 1 : 0)} photos`
    },
    {
      id: 'checkin',
      number: '02',
      label: language === 'ka' ? 'ჩამოსვლა, შესვლა და პარკინგი' : language === 'ru' ? 'Прибытие, заселение и парковка' : 'Arrival, Check-in & Parking',
      subtitle: language === 'ka' ? 'კარის კოდი, სეიფი, მარშრუტი და პარკინგი' : 'Door PIN, lockbox, directions & parking',
      icon: KeyRound,
      isComplete: Boolean(prop.checkInTime && (prop.doorKeypadCode || prop.lockboxCode) && prop.arrivalDirections),
      meta: prop.doorKeypadCode || prop.checkInTime
    },
    {
      id: 'wifi',
      number: '03',
      label: language === 'ka' ? 'Wi-Fi და ინტერნეტი' : language === 'ru' ? 'Wi-Fi и интернет' : 'Wi-Fi',
      subtitle: language === 'ka' ? 'ქსელის სახელი და პაროლი 1-დაჭერით კოპირებით' : '1-tap network SSID & password for guests',
      icon: Wifi,
      isComplete: Boolean(prop.wifiNetwork && prop.wifiPassword),
      meta: prop.wifiNetwork || 'Not set'
    },
    {
      id: 'appliances',
      number: '04',
      label: language === 'ka' ? 'ტექნიკა და ვიდეო ინსტრუქციები' : language === 'ru' ? 'Техника и видеоинструкции' : 'Appliances & Video How-Tos',
      subtitle: language === 'ka' ? 'ვიზუალური გზამკვლევი ტექნიკისთვის' : 'Step-by-step photos, 20s videos & presets',
      icon: Zap,
      isComplete: (prop.appliances || []).length > 0,
      meta: `${(prop.appliances || []).length} guides`
    },
    {
      id: 'rules-checkout',
      number: '05',
      label: language === 'ka' ? 'სახლის წესები და გასვლა' : language === 'ru' ? 'Правила дома и выезд' : 'House Rules & Checkout',
      subtitle: language === 'ka' ? 'სიჩუმის საათები, წესები და გასვლის სია' : 'Quiet hours, house rules & departure checklist',
      icon: Shield,
      isComplete: (prop.houseRules || []).length > 0 && Boolean(prop.checkOutTime),
      meta: `${(prop.houseRules || []).length} rules`
    },
    {
      id: 'gems-essentials',
      number: '06',
      label: language === 'ka' ? 'ადგილობრივი რჩევები და ადგილები' : language === 'ru' ? 'Локальные места и рекомендации' : 'Local Gems & Essentials',
      subtitle: language === 'ka' ? 'რესტორნები, კაფეები და აუცილებელი ობიექტები' : 'Curated neighborhood spots, dining & essentials',
      icon: Compass,
      isComplete: ((prop.gemIds || []).length + (prop.recommendations || []).length) > 0,
      meta: `${(prop.gemIds || []).length + (prop.recommendations || []).length} spots`
    },
    {
      id: 'transport-contact',
      number: '07',
      label: language === 'ka' ? 'ტრანსპორტი, კონტაქტი და შეფასებები' : language === 'ru' ? 'Транспорт, контакты и отзывы' : 'Transport, Contact & Review Links',
      subtitle: language === 'ka' ? 'ტაქსი, მასპინძლის კონტაქტი, 112 და Airbnb ბმული' : 'Transit, WhatsApp, emergency & review links',
      icon: Phone,
      isComplete: Boolean(prop.hostPhone && prop.taxiInfo),
      meta: prop.hostPhone || 'Contact'
    }
  ];

  const completedSectionsCount = studioSections.filter(s => s.isComplete).length;

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 font-sans space-y-6 sm:space-y-8 rounded-[28px] sm:rounded-[36px] my-4 sm:my-6 border shadow-xl relative overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#141312] text-[#F7F5F0] border-[#2B2926]' : 'bg-white text-[#1C1B1A] border-[#EBE6DF]'
    }`}>
      
      {/* Top Breadcrumb, Property Identity & Global Studio Toolbar */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b transition-colors ${
        isDarkMode ? 'border-[#2B2926]' : 'border-[#EBE6DF]'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentRoute('/app/properties')}
              className={`text-xs flex items-center gap-1.5 font-semibold transition-colors px-3 py-1 rounded-xl border w-fit cursor-pointer ${
                isDarkMode 
                  ? 'text-zinc-300 hover:text-white bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                  : 'text-zinc-700 hover:text-zinc-950 bg-zinc-100 border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F55A51]" />
              <span>{t.propertyHub.backToDashboard}</span>
            </button>

            <button
              onClick={() => togglePublishProperty(prop.id)}
              title="Click to toggle Published / Draft status"
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                prop.status === 'published'
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/25'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${prop.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{prop.status === 'published' ? t.hostDashboard.card.published : t.hostDashboard.card.draft}</span>
            </button>
          </div>
          
          <div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
            }`}>
              {prop.title}
            </h1>
            <div className={`text-xs flex items-center gap-2 flex-wrap mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F55A51]" />
                <span>{prop.address}, {prop.city}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">Wi-Fi: <strong className={isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}>{prop.wifiNetwork}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">PIN: <strong className="text-amber-500">{prop.doorKeypadCode}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAiAssistantModal(true)}
            className="px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Guide & Translate</span>
          </button>

          <button
            onClick={() => setShowTemplateModal(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDarkMode 
                ? 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#F55A51]" />
            <span>{language === 'ka' ? 'შაბლონები' : 'Templates'}</span>
          </button>

          <button
            onClick={() => setShowHealthModal(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDarkMode 
                ? 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{completedSectionsCount}/7 Ready</span>
          </button>

          <button
            onClick={handleCopyLink}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDarkMode 
                ? 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? hubContent.qr.copied : t.common.copy}</span>
          </button>

          <button
            onClick={() => navigateToGuestGuide(prop.slug)}
            className="px-4 py-2 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>{t.guestGuide.liveView}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4 MAIN PROPERTY HUB DESTINATIONS                                    */}
      {/* 1. Guidebook Studio | 2. Share & QR/NFC | 3. Activity | 4. Settings */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 border-zinc-200 dark:border-zinc-800">
        <div className={`grid grid-cols-2 sm:inline-flex items-center p-1 rounded-xl border w-full sm:w-auto gap-1 ${
          isDarkMode ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-[#F3EFE9] border-[#EBE6DF]'
        }`}>
          {[
            {
              id: 'studio' as HubMainDestination,
              label: language === 'ka' ? 'გიდის სტუდია' : language === 'ru' ? 'Студия гида' : 'Guidebook Studio',
              icon: BookOpen,
              onClick: () => setPropertySubTab('guide'),
              badge: `${completedSectionsCount}/7`
            },
            {
              id: 'qr' as HubMainDestination,
              label: language === 'ka' ? 'გაზიარება & QR/NFC' : language === 'ru' ? 'Доступ и QR/NFC' : 'Share & QR/NFC',
              icon: QrIcon,
              onClick: () => setPropertySubTab('qr')
            },
            {
              id: 'activity' as HubMainDestination,
              label: language === 'ka' ? 'აქტივობა' : language === 'ru' ? 'Активность' : 'Activity',
              icon: TrendingUp,
              onClick: () => setPropertySubTab('analytics'),
              badge: (propertyRequestsCount + propertyFeedbacksCount) > 0 ? String(propertyRequestsCount + propertyFeedbacksCount) : undefined
            },
            {
              id: 'settings' as HubMainDestination,
              label: t.propertyHub.tabs.settings,
              icon: SettingsIcon,
              onClick: () => setPropertySubTab('settings')
            }
          ].map((dest) => {
            const Icon = dest.icon;
            const isActive = activeDestination === dest.id;
            return (
              <motion.button
                key={dest.id}
                whileTap={{ scale: 0.96 }}
                onClick={dest.onClick}
                className={`relative px-2.5 sm:px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all min-w-0 cursor-pointer ${
                  isActive
                    ? isDarkMode ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
                    : isDarkMode ? 'text-[#ACA79F] hover:text-[#F7F5F0]' : 'text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePropertyHubMainDest"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className={`absolute inset-0 rounded-lg shadow-xs ${
                      isDarkMode ? 'bg-[#272522] border border-[#3B3833]' : 'bg-white border border-[#EBE6DF]'
                    }`}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F55A51] shrink-0" />
                  <span className="truncate">{dest.label}</span>
                  {dest.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                      isActive
                        ? isDarkMode ? 'bg-[#141312] text-zinc-200 border border-[#3B3833]' : 'bg-zinc-100 text-zinc-800'
                        : isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200/70 text-zinc-700'
                    }`}>
                      {dest.badge}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Studio View Controls: Toggle Live Mobile Preview or Full Simulator */}
        {activeDestination === 'studio' && (
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => {
                if (propertySubTab === 'preview') {
                  setPropertySubTab('guide');
                } else {
                  setShowSplitPreview(!showSplitPreview);
                }
              }}
              className={`hidden lg:flex px-3 py-1.5 rounded-xl border text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer ${
                showSplitPreview && propertySubTab !== 'preview'
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                  : isDarkMode
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-950'
              }`}
            >
              {showSplitPreview && propertySubTab !== 'preview' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSplitPreview && propertySubTab !== 'preview' ? 'Hide Side Preview' : 'Side-by-Side Preview'}</span>
            </button>

            <button
              onClick={() => setPropertySubTab(propertySubTab === 'preview' ? 'guide' : 'preview')}
              className={`w-full sm:w-auto justify-center px-3 py-2 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                propertySubTab === 'preview'
                  ? 'bg-[#F55A51] text-white border-[#F55A51]'
                  : isDarkMode
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-950'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{propertySubTab === 'preview' ? 'Back to Editor' : 'Full Simulator'}</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DESTINATION 1: GUIDEBOOK STUDIO (7 Sections + Live Preview)         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeDestination === 'studio' && (
          <motion.div
            key="dest-studio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Compact Guide Health & Readiness Bar */}
            <GuideHealthChecker
              property={prop}
              compact={true}
              onNavigateToSection={(sec) => {
                setPropertySubTab('guide');
                setGuideActiveSection(sec);
                setActiveStudioSection(resolveStudioSection(sec, 'guide'));
              }}
            />

            {propertySubTab === 'preview' ? (
              <LiveGuestPreviewSimulator
                property={prop}
                onNavigateToSection={(sec) => {
                  setPropertySubTab('guide');
                  setGuideActiveSection(sec);
                  setActiveStudioSection(resolveStudioSection(sec, 'guide'));
                }}
                onOpenLiveTab={() => navigateToGuestGuide(prop.slug)}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                
                {/* Mobile Compact Section Selector (< lg) */}
                <div className={`lg:hidden rounded-2xl border p-3 space-y-2.5 ${
                  isDarkMode ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between px-1">
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      Guidebook Studio ({completedSectionsCount}/7)
                    </span>
                    <span className="text-[10px] font-mono text-[#F55A51] font-semibold">
                      Tap section to edit
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {studioSections.map((sec) => {
                      const Icon = sec.icon;
                      const isActive = activeStudioSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => selectStudioSection(sec.id)}
                          className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer border min-w-0 ${
                            isActive
                              ? isDarkMode
                                ? 'bg-[#272522] text-white border-[#F55A51] shadow-xs'
                                : 'bg-white text-zinc-950 border-[#F55A51] shadow-xs'
                              : isDarkMode
                              ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300'
                              : 'bg-white/70 border-zinc-200/80 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#F55A51]' : sec.isComplete ? 'text-emerald-500' : 'text-amber-500'}`} />
                            <span className="text-[11px] font-bold truncate">{sec.label}</span>
                          </div>
                          {sec.isComplete ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Left Column: 7-Section Guidebook Studio Navigation (Desktop lg+) */}
                <div className={`hidden lg:block lg:col-span-4 rounded-2xl border p-3 space-y-1.5 ${
                  isDarkMode ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      7 Guidebook Studio Sections
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                      {completedSectionsCount}/7 complete
                    </span>
                  </div>

                  {studioSections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeStudioSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => selectStudioSection(sec.id)}
                        className={`w-full p-3 rounded-xl text-left transition-all flex items-start justify-between gap-2.5 cursor-pointer border ${
                          isActive
                            ? isDarkMode
                              ? 'bg-[#272522] text-white border-[#3B3833] shadow-xs'
                              : 'bg-white text-zinc-950 border-[#EBE6DF] shadow-xs'
                            : isDarkMode
                            ? 'border-transparent text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                            : 'border-transparent text-zinc-700 hover:text-zinc-950 hover:bg-white/70'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                            isActive
                              ? 'bg-[#F55A51] text-white border-[#F55A51]'
                              : sec.isComplete
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                              : isDarkMode
                              ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono opacity-50">{sec.number}</span>
                              <span className="text-xs font-bold truncate">{sec.label}</span>
                            </div>
                            <p className={`text-[11px] truncate mt-0.5 ${
                              isActive
                                ? isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                                : isDarkMode ? 'text-zinc-500' : 'text-zinc-500'
                            }`}>
                              {sec.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-center">
                          {sec.isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#F55A51]' : 'opacity-40'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Center / Right Column: Active Section Editor (+ Optional Split Preview) */}
                <div className={`${showSplitPreview ? 'lg:col-span-5' : 'lg:col-span-8'} rounded-2xl border p-5 sm:p-7 space-y-6 ${
                  isDarkMode ? 'bg-[#1C1B19] border-[#2B2926] text-zinc-100' : 'bg-white border-[#EBE6DF] text-zinc-900 shadow-xs'
                }`}>
                  
                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 1: WELCOME & PHOTO GALLERY                        */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'welcome' && (
                    <div className="space-y-6">
                      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 01</span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                          {language === 'ka' ? 'მისალმება და ფოტო გალერეა' : 'Welcome & Photo Gallery'}
                        </h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {hubContent.guide.welcomeSub}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {language === 'ka' ? 'ობიექტის სახელი (Title)' : 'Property Title'}
                          </label>
                          <input
                            type="text"
                            value={prop.title || ''}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                            placeholder="Old Tbilisi Apartment"
                          />
                        </div>
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.headlineGreeting}
                          </label>
                          <input
                            type="text"
                            value={prop.welcomeTitle || ''}
                            onChange={(e) => handleFieldChange('welcomeTitle', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                            placeholder="Welcome to our home!"
                          />
                        </div>
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {language === 'ka' ? 'მოკლე სლოგანი (Tagline)' : 'Guest Guide Tagline'}
                          </label>
                          <input
                            type="text"
                            value={prop.tagline || ''}
                            onChange={(e) => handleFieldChange('tagline', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                            placeholder="Make yourself at home. Everything you need is right here."
                          />
                        </div>
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {language === 'ka' ? 'მთავარი ფოტოს ბმული (Cover Image URL)' : 'Hero Cover Image URL'}
                          </label>
                          <input
                            type="text"
                            value={prop.coverImage || ''}
                            onChange={(e) => handleFieldChange('coverImage', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                      </div>

                      <div className="text-xs">
                        <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {hubContent.guide.welcomeNote}
                        </label>
                        <textarea
                          rows={3}
                          value={prop.welcomeGreeting || ''}
                          onChange={(e) => handleFieldChange('welcomeGreeting', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                          }`}
                        />
                      </div>

                      {/* Smart Photo Guide Builder */}
                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <SmartPhotoBuilder
                          photos={prop.photos || []}
                          onChange={(updatedPhotos) => handleFieldChange('photos', updatedPhotos)}
                          onCoverChange={(coverUrl) => handleFieldChange('coverImage', coverUrl)}
                          onDraftGenerated={({ welcomeGreeting, arrivalDirections, suggestedAppliances }) => {
                            if (welcomeGreeting) {
                              handleFieldChange('welcomeGreeting', welcomeGreeting);
                            }
                            if (arrivalDirections) {
                              handleFieldChange('arrivalDirections', arrivalDirections);
                            }
                            if (suggestedAppliances && suggestedAppliances.length > 0) {
                              const formatted = suggestedAppliances.map((s, idx) => ({
                                id: `app-gen-${Date.now()}-${idx}`,
                                title: s.title || 'Appliance',
                                icon: s.icon || 'Thermometer',
                                category: s.category || 'climate',
                                instructions: s.instructions || 'Standard operating instructions.',
                                troubleshooting: s.troubleshooting
                              }));
                              handleFieldChange('appliances', [...(prop.appliances || []), ...formatted]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 2: ARRIVAL, CHECK-IN & PARKING                    */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'checkin' && (
                    <div className="space-y-5 text-xs">
                      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 02</span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                          {language === 'ka' ? 'ჩამოსვლა, შესვლა და პარკინგი' : 'Arrival, Check-in & Parking'}
                        </h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {hubContent.guide.checkinSub}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.checkinTime}
                          </label>
                          <input
                            type="text"
                            value={prop.checkInTime}
                            onChange={(e) => handleFieldChange('checkInTime', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {language === 'ka' ? 'შესვლის მეთოდი' : 'Check-in Method'}
                          </label>
                          <select
                            value={prop.checkInMethod || 'keypad'}
                            onChange={(e) => handleFieldChange('checkInMethod', e.target.value as any)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                          >
                            <option value="keypad">Smart Keypad / Door Code</option>
                            <option value="lockbox">Key Lockbox</option>
                            <option value="in-person">In-Person Meet & Greet</option>
                            <option value="concierge">24/7 Reception / Concierge</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.doorCode}
                          </label>
                          <input
                            type="text"
                            value={prop.doorKeypadCode}
                            onChange={(e) => handleFieldChange('doorKeypadCode', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-amber-400 focus:border-amber-500' : 'bg-amber-50/40 border-amber-300 text-amber-800 focus:border-amber-600'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.lockboxCode}
                          </label>
                          <input
                            type="text"
                            value={prop.lockboxCode}
                            onChange={(e) => handleFieldChange('lockboxCode', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {hubContent.guide.entryDirections}
                        </label>
                        <textarea
                          rows={3}
                          value={prop.arrivalDirections}
                          onChange={(e) => handleFieldChange('arrivalDirections', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {hubContent.guide.parkingInstructions}
                        </label>
                        <textarea
                          rows={2}
                          value={prop.parkingInstructions}
                          onChange={(e) => handleFieldChange('parkingInstructions', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 3: WI-FI                                          */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'wifi' && (
                    <div className="space-y-5 text-xs">
                      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 03</span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                          {hubContent.guide.wifiTitle}
                        </h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {hubContent.guide.wifiSub}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.ssid}
                          </label>
                          <input
                            type="text"
                            value={prop.wifiNetwork}
                            onChange={(e) => handleFieldChange('wifiNetwork', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.wifiPass}
                          </label>
                          <input
                            type="text"
                            value={prop.wifiPassword}
                            onChange={(e) => handleFieldChange('wifiPassword', e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-emerald-400 focus:border-emerald-500' : 'bg-emerald-50/40 border-emerald-300 text-emerald-800 focus:border-emerald-600'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Guest Card Live Preview */}
                      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
                            <Wifi className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-bold block">
                              Guest 1-Tap Wi-Fi Card Preview
                            </span>
                            <span className="font-bold text-sm truncate block">{prop.wifiNetwork || 'Wi-Fi Network'}</span>
                            <span className="font-mono text-xs opacity-75 truncate block">Password: {prop.wifiPassword || '••••••••'}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(prop.wifiPassword || '');
                            showToast('Wi-Fi password copied');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shrink-0 cursor-pointer self-start sm:self-auto"
                        >
                          Test Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 4: APPLIANCES & VIDEO HOW-TOS                     */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'appliances' && (
                    <div className="space-y-5">
                      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 04</span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                          {language === 'ka' ? 'ტექნიკა და ვიდეო ინსტრუქციები' : 'Appliances & Video How-Tos'}
                        </h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {language === 'ka'
                            ? 'დაამატეთ მოკლე ვიდეო ან ფოტო ინსტრუქციები გათბობის, ყავის აპარატის და სხვა ტექნიკისთვის.'
                            : 'Record 20-second visual how-to clips, upload step-by-step photos, or insert 1-click preset guides.'}
                        </p>
                      </div>

                      <VisualHowToManager
                        appliances={prop.appliances || []}
                        onChange={(updatedApps) => handleFieldChange('appliances', updatedApps)}
                        allowLibraryPresets={true}
                      />
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 5: HOUSE RULES & CHECKOUT                         */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'rules-checkout' && (
                    <div className="space-y-6 text-xs">
                      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 05</span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                          {language === 'ka' ? 'სახლის წესები და გასვლა (Checkout)' : 'House Rules & Checkout'}
                        </h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          Set clear house expectations, quiet hours, trash disposal, and departure steps.
                        </p>
                      </div>

                      {/* Part A: House Rules */}
                      <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50/70 border-zinc-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-base flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#F55A51]" />
                            <span>{hubContent.guide.rulesTitle}</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('houseRules', [...(prop.houseRules || []), ''])}
                            className="px-2.5 py-1 rounded-lg bg-[#F55A51]/15 text-[#F55A51] hover:bg-[#F55A51]/25 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Rule</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.quietHours}
                            </label>
                            <input
                              type="text"
                              value={prop.quietHours}
                              onChange={(e) => handleFieldChange('quietHours', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.trashSchedule}
                            </label>
                            <input
                              type="text"
                              value={prop.trashSchedule}
                              onChange={(e) => handleFieldChange('trashSchedule', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.rulesList}
                          </label>
                          <div className="space-y-2">
                            {(prop.houseRules || []).map((rule, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={rule}
                                  onChange={(e) => {
                                    const updated = [...prop.houseRules];
                                    updated[idx] = e.target.value;
                                    handleFieldChange('houseRules', updated);
                                  }}
                                  className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                                  }`}
                                  placeholder="Enter house rule..."
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = prop.houseRules.filter((_, i) => i !== idx);
                                    handleFieldChange('houseRules', updated);
                                  }}
                                  className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Remove rule"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Part B: Checkout & Departure Checklist */}
                      <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50/70 border-zinc-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-base flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span>{hubContent.guide.checkoutTitle}</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('departureChecklist', [...(prop.departureChecklist || []), ''])}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Step</span>
                          </button>
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.checkoutTime}
                          </label>
                          <input
                            type="text"
                            value={prop.checkOutTime}
                            onChange={(e) => handleFieldChange('checkOutTime', e.target.value)}
                            className={`w-full sm:w-64 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.departureChecklist}
                          </label>
                          <div className="space-y-2">
                            {(prop.departureChecklist || []).map((step, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={step}
                                  onChange={(e) => {
                                    const updated = [...prop.departureChecklist];
                                    updated[idx] = e.target.value;
                                    handleFieldChange('departureChecklist', updated);
                                  }}
                                  className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                                  }`}
                                  placeholder="Enter checkout step..."
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = prop.departureChecklist.filter((_, i) => i !== idx);
                                    handleFieldChange('departureChecklist', updated);
                                  }}
                                  className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Remove checkout step"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 6: LOCAL GEMS & ESSENTIALS                        */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'gems-essentials' && (
                    <div className="space-y-5 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 06</span>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                            {language === 'ka' ? 'ადგილობრივი რჩევები და ადგილები' : 'Local Gems & Neighborhood Essentials'}
                          </h3>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Curate authentic Stumari Gems and practical nearby essentials (supermarkets, pharmacies, ATMs, cafes).
                          </p>
                        </div>

                        <div className={`inline-flex items-center p-1 rounded-xl border shrink-0 self-start sm:self-auto ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                        }`}>
                          <button
                            type="button"
                            onClick={() => setGemsSubView('gems')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              gemsSubView === 'gems'
                                ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-zinc-900 shadow-xs'
                                : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                          >
                            <Compass className="w-3.5 h-3.5 text-[#F55A51]" />
                            <span>Stumari Gems ({(prop.gemIds || []).length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGemsSubView('essentials')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              gemsSubView === 'essentials'
                                ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-zinc-900 shadow-xs'
                                : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span>Essentials & Spots ({(prop.recommendations || []).length})</span>
                          </button>
                        </div>
                      </div>

                      {gemsSubView === 'gems' ? (
                        <PropertyGemsCurator property={prop} />
                      ) : (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-serif font-bold text-base">{hubContent.guide.recsTitle}</h4>
                              <p className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{hubContent.guide.recsSub}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newRec = {
                                  id: `rec-${Date.now()}`,
                                  name: '',
                                  category: 'coffee' as const,
                                  description: '',
                                  address: prop.city,
                                  distance: '5 min walk',
                                  mapsUrl: 'https://maps.google.com'
                                };
                                handleFieldChange('recommendations', [...(prop.recommendations || []), newRec]);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F55A51] text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Place</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(prop.recommendations || []).map((rec, idx) => (
                              <div key={rec.id} className={`p-4 rounded-2xl border space-y-2.5 ${
                                isDarkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                              }`}>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                                    <input
                                      type="text"
                                      value={rec.name}
                                      onChange={(e) => {
                                        const updated = [...prop.recommendations];
                                        updated[idx] = { ...updated[idx], name: e.target.value };
                                        handleFieldChange('recommendations', updated);
                                      }}
                                      className={`px-3 py-2 rounded-xl border font-bold text-xs focus:outline-none ${
                                        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                                      }`}
                                      placeholder={hubContent.guide.placeNamePlaceholder}
                                    />
                                    <input
                                      type="text"
                                      value={rec.distance}
                                      onChange={(e) => {
                                        const updated = [...prop.recommendations];
                                        updated[idx] = { ...updated[idx], distance: e.target.value };
                                        handleFieldChange('recommendations', updated);
                                      }}
                                      className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                                        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                                      }`}
                                      placeholder={hubContent.guide.distancePlaceholder}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = prop.recommendations.filter((_, i) => i !== idx);
                                      handleFieldChange('recommendations', updated);
                                    }}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                    title="Remove recommendation"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  rows={2}
                                  value={rec.description}
                                  onChange={(e) => {
                                    const updated = [...prop.recommendations];
                                    updated[idx] = { ...updated[idx], description: e.target.value };
                                    handleFieldChange('recommendations', updated);
                                  }}
                                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                                  }`}
                                  placeholder="Why guests love this place..."
                                />
                              </div>
                            ))}
                          </div>

                          {/* Verified Nearby Essentials Suggester */}
                          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <NearbyEssentialsSuggester
                              propertyAddress={prop.address}
                              propertyCity={prop.city}
                              currentRecommendations={prop.recommendations || []}
                              onAddRecommendations={(newRecs) => handleFieldChange('recommendations', newRecs)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* SECTION 7: TRANSPORT, CONTACT & REVIEW LINKS              */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {activeStudioSection === 'transport-contact' && (
                    <div className="space-y-6 text-xs">
                      <div className="border-b pb-4 border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F55A51] font-bold">Section 07</span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                          {language === 'ka' ? 'ტრანსპორტი, კონტაქტი და შეფასების ბმულები' : 'Transport, Contact & Review Links'}
                        </h3>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          Help guests get around the city, reach you on WhatsApp, access emergency numbers, and leave 5-star reviews.
                        </p>
                      </div>

                      {/* Card 1: Getting Around & Airport Transit */}
                      <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50/70 border-zinc-200'
                      }`}>
                        <h4 className="font-serif font-bold text-base flex items-center gap-2">
                          <Car className="w-4 h-4 text-[#F55A51]" />
                          <span>{hubContent.guide.transportTitle}</span>
                        </h4>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.taxiInfo}
                          </label>
                          <textarea
                            rows={2}
                            value={prop.taxiInfo}
                            onChange={(e) => handleFieldChange('taxiInfo', e.target.value)}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.publicTransit}
                          </label>
                          <textarea
                            rows={2}
                            value={prop.transitInfo}
                            onChange={(e) => handleFieldChange('transitInfo', e.target.value)}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {hubContent.guide.airportTransit}
                          </label>
                          <textarea
                            rows={2}
                            value={prop.airportTransit}
                            onChange={(e) => handleFieldChange('airportTransit', e.target.value)}
                            className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Card 2: Host Contact & Emergency Numbers */}
                      <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50/70 border-zinc-200'
                      }`}>
                        <h4 className="font-serif font-bold text-base flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span>{hubContent.guide.contactTitle} & {hubContent.guide.emergencyTitle}</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.hostName}
                            </label>
                            <input
                              type="text"
                              value={prop.hostName}
                              onChange={(e) => handleFieldChange('hostName', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.hostPhone}
                            </label>
                            <input
                              type="text"
                              value={prop.hostPhone}
                              onChange={(e) => handleFieldChange('hostPhone', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.hostWhatsApp}
                            </label>
                            <input
                              type="text"
                              value={prop.hostWhatsApp}
                              onChange={(e) => handleFieldChange('hostWhatsApp', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-700 text-emerald-400' : 'bg-white border-zinc-300 text-emerald-700'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.emergencyServicesNum}
                            </label>
                            <input
                              type="text"
                              value={prop.emergencyServicesNumber || '112'}
                              onChange={(e) => handleFieldChange('emergencyServicesNumber', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-rose-400' : 'bg-white border-zinc-300 text-rose-700'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {hubContent.guide.emergencyContact}
                            </label>
                            <input
                              type="text"
                              value={prop.emergencyContact}
                              onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Public Review Platform Redirect Links */}
                      <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50/70 border-zinc-200'
                      }`}>
                        <div>
                          <h4 className="font-serif font-bold text-base flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>Public Review Links (Airbnb, Booking, Google)</span>
                          </h4>
                          <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            When guests rate their stay as "Amazing" or "Good", Stumari invites them to post a public review on your preferred platforms.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              Airbnb Review URL
                            </label>
                            <input
                              type="url"
                              value={prop.publicReviewLinks?.airbnb || ''}
                              onChange={(e) =>
                                handleFieldChange('publicReviewLinks', {
                                  ...(prop.publicReviewLinks || {}),
                                  airbnb: e.target.value
                                })
                              }
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                              placeholder="https://airbnb.com/rooms/..."
                            />
                          </div>

                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              Booking.com URL
                            </label>
                            <input
                              type="url"
                              value={prop.publicReviewLinks?.booking || ''}
                              onChange={(e) =>
                                handleFieldChange('publicReviewLinks', {
                                  ...(prop.publicReviewLinks || {}),
                                  booking: e.target.value
                                })
                              }
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                              placeholder="https://booking.com/hotel/..."
                            />
                          </div>

                          <div>
                            <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              Google Maps Review URL
                            </label>
                            <input
                              type="url"
                              value={prop.publicReviewLinks?.google || ''}
                              onChange={(e) =>
                                handleFieldChange('publicReviewLinks', {
                                  ...(prop.publicReviewLinks || {}),
                                  google: e.target.value
                                })
                              }
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                              }`}
                              placeholder="https://g.page/r/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Auto-Save & Next Section Footer */}
                  <div className={`pt-5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{hubContent.guide.autoSaveNotice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateProperty(prop)}
                        className="px-5 py-2.5 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                      >
                        {hubContent.guide.saveChanges}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Column (When Side-by-Side Live Preview is Toggled On) */}
                {showSplitPreview && (
                  <div className="hidden lg:block lg:col-span-3 space-y-3 sticky top-24">
                    <div className={`p-3 rounded-2xl border ${
                      isDarkMode ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                    }`}>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live Guest Preview</span>
                        </span>
                        <button
                          onClick={() => setPropertySubTab('preview')}
                          className="text-[10px] font-semibold underline opacity-75 hover:opacity-100 cursor-pointer"
                        >
                          Expand
                        </button>
                      </div>

                      {/* Compact Phone Frame Preview */}
                      <div className="rounded-[24px] border-4 border-zinc-900 bg-zinc-950 text-white p-3.5 space-y-3 shadow-xl max-h-[540px] overflow-y-auto no-scrollbar">
                        <div className="relative h-28 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                          {(prop.coverImage || prop.photos?.[0]?.url) ? (
                            <img src={prop.coverImage || prop.photos?.[0]?.url} alt={prop.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                              <Building2 className="w-7 h-7 opacity-40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400">
                              {prop.city}
                            </span>
                            <h4 className="font-serif font-bold text-sm leading-tight truncate">{prop.title}</h4>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 block">
                            {prop.welcomeTitle || 'Welcome!'}
                          </span>
                          <p className="text-[10px] text-zinc-300 line-clamp-2">
                            {prop.welcomeGreeting}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                            <span className="text-[8px] font-mono uppercase text-zinc-400 block">Wi-Fi</span>
                            <span className="text-[10px] font-semibold truncate block">{prop.wifiNetwork}</span>
                            <span className="text-[9px] font-mono text-emerald-400 truncate block">{prop.wifiPassword}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                            <span className="text-[8px] font-mono uppercase text-zinc-400 block">Door Code</span>
                            <span className="text-[11px] font-mono font-bold text-amber-400 truncate block">{prop.doorKeypadCode}</span>
                            <span className="text-[9px] text-zinc-400 truncate block">In: {prop.checkInTime}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-300">Visual How-Tos</span>
                          <span className="font-mono font-bold text-zinc-100">{(prop.appliances || []).length} guides</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-300">Curated Local Gems</span>
                          <span className="font-mono font-bold text-zinc-100">{(prop.gemIds || []).length + (prop.recommendations || []).length} spots</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigateToGuestGuide(prop.slug)}
                          className="w-full py-2 rounded-xl bg-[#F55A51] text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Open Full Guest Guide</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DESTINATION 2: SHARE & QR/NFC                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeDestination === 'qr' && (
          <motion.div
            key="dest-qr"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Card: QR Code & Direct Guest Link */}
            <div className={`lg:col-span-6 rounded-2xl border p-6 sm:p-8 space-y-6 text-center ${
              isDarkMode ? 'bg-[#1C1B19] border-[#2B2926] text-zinc-100' : 'bg-white border-[#EBE6DF] text-zinc-900 shadow-xs'
            }`}>
              <div>
                <h2 className="text-2xl font-serif font-bold tracking-tight">
                  {hubContent.qr.connectGuestsTitle}
                </h2>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {hubContent.qr.connectGuestsSub}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 inline-block mx-auto shadow-md">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Stumari QR Code" className="w-52 h-52 mx-auto rounded-lg" />
                ) : (
                  <div className="w-52 h-52 bg-zinc-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-zinc-400 font-medium">
                    {hubContent.qr.generatingQr}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <button
                  onClick={handleDownloadQr}
                  className="px-5 py-2.5 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white font-bold text-xs transition-all inline-flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{hubContent.qr.downloadQrBtn}</span>
                </button>

                <button
                  onClick={() => navigateToGuestGuide(prop.slug)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  <span>{t.guestGuide.liveView}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Guest Check-in URL with Capability Token & Public Link Controls */}
              <div className="text-left space-y-2.5 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <label className={`text-xs font-mono uppercase tracking-wider font-semibold block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {hubContent.qr.guestUrlLabel}
                  </label>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Protected Check-in Link
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getGuestCheckInUrl(prop, true)}
                    className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border font-mono text-xs font-semibold focus:outline-none ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? hubContent.qr.copied : hubContent.qr.copyLink}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={handleCopyPublicOnlyLink}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      isDarkMode
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copy Public Guide Link (No Wi-Fi / Door Codes)</span>
                  </button>

                  {firebaseUser && prop.ownerId === firebaseUser.uid && !prop.isDemo && (
                    <button
                      type="button"
                      onClick={() => rotatePropertyAccessToken(prop.id)}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                        isDarkMode
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Rotate Check-In Key</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Card: Printable Stand Flyer & Physical NFC/QR Table Stand */}
            <div className="lg:col-span-6 space-y-4">
              {/* Printable Bedside Stand Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isDarkMode ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-white border-[#EBE6DF] shadow-xs'
              }`}>
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg">
                      Printable Bedside Frame & Table-Talker (5x7 & A4)
                    </h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Pre-formatted with your property title, Wi-Fi SSID, password, and scannable QR code for bedside frames or entryway tables.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Preview & Print Bedside Stand Flyer</span>
                </button>
              </div>

              {/* Physical Birch & Acrylic QR + NFC Stand Card */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isDarkMode ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-white border-[#EBE6DF] shadow-xs'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg">
                        {hubContent.qr.nfcReadyTitle}
                      </h3>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {hubContent.qr.nfcReadySub}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-500 font-mono font-bold text-[10px] shrink-0 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{hubContent.qr.nfcActive}</span>
                  </span>
                </div>

                <button
                  onClick={() => setShowPhysicalStandModal(true)}
                  className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800' : 'bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  <Radio className="w-4 h-4 text-[#F55A51]" />
                  <span>Customize Physical QR & NFC Stand</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DESTINATION 3: ACTIVITY (Analytics, Guest Requests, Stay Reviews)   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeDestination === 'activity' && (
          <motion.div
            key="dest-activity"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Activity Sub-Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif font-bold text-xl tracking-tight">
                  {language === 'ka' ? 'ობიექტის აქტივობა და უკუკავშირი' : 'Property Activity, Requests & Reviews'}
                </h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Track guest guide engagement, active maintenance/assistance requests, and post-stay reviews for {prop.title}.
                </p>
              </div>

              <div className={`flex flex-wrap items-center p-1 rounded-xl border self-start sm:self-auto ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  onClick={() => {
                    setActivitySubView('analytics');
                    setPropertySubTab('analytics');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activitySubView === 'analytics'
                      ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-zinc-900 shadow-xs'
                      : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#F55A51]" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => setActivitySubView('requests')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activitySubView === 'requests'
                      ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-zinc-900 shadow-xs'
                      : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Requests ({propertyRequestsCount})</span>
                </button>

                <button
                  onClick={() => {
                    setActivitySubView('reviews');
                    setPropertySubTab('reviews');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activitySubView === 'reviews'
                      ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-zinc-900 shadow-xs'
                      : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reviews ({propertyFeedbacksCount})</span>
                </button>
              </div>
            </div>

            {activitySubView === 'analytics' && <HostAnalytics propertyIdFilter={prop.id} />}
            {activitySubView === 'requests' && <GuestRequestsInbox propertyIdFilter={prop.id} />}
            {activitySubView === 'reviews' && <ReviewEngineInbox propertyIdFilter={prop.id} />}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DESTINATION 4: SETTINGS                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeDestination === 'settings' && (
          <motion.div
            key="dest-settings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-3xl mx-auto rounded-2xl border p-6 sm:p-8 space-y-6 text-xs transition-colors ${
              isDarkMode ? 'bg-[#1C1B19] border-[#2B2926] text-zinc-200' : 'bg-white border-[#EBE6DF] text-zinc-900 shadow-xs'
            }`}
          >
            <div>
              <h2 className="text-2xl font-serif font-bold tracking-tight">
                {hubContent.settings.settingsTitle}
              </h2>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {hubContent.settings.settingsSub}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {hubContent.settings.propName}
                </label>
                <input
                  type="text"
                  value={prop.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {hubContent.settings.propType}
                  </label>
                  <select
                    value={prop.type}
                    onChange={(e) => handleFieldChange('type', e.target.value as PropertyType)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="guesthouse">Guesthouse</option>
                    <option value="hotel">Boutique Hotel</option>
                    <option value="villa">Villa</option>
                    <option value="resort">Resort</option>
                  </select>
                </div>

                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {hubContent.settings.guestUrlSlug}
                  </label>
                  <input
                    type="text"
                    value={prop.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs font-bold focus:outline-none ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {hubContent.settings.addressLocation}
                  </label>
                  <input
                    type="text"
                    value={prop.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    City
                  </label>
                  <input
                    type="text"
                    value={prop.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {hubContent.settings.coverImageUrl}
                </label>
                <input
                  type="text"
                  value={prop.coverImage}
                  onChange={(e) => handleFieldChange('coverImage', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs focus:outline-none ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {hubContent.settings.airbnbBookingLink}
                </label>
                <input
                  type="text"
                  value={prop.sourceUrl || ''}
                  onChange={(e) => handleFieldChange('sourceUrl', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                  placeholder="https://airbnb.com/rooms/..."
                />
              </div>

              {/* Publish / Unpublish Toggle */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div>
                  <span className="font-bold block">{hubContent.settings.publishStatus}</span>
                  <span className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {prop.status === 'published'
                      ? hubContent.settings.publishedNotice
                      : hubContent.settings.draftNotice}
                  </span>
                </div>
                <button
                  onClick={() => togglePublishProperty(prop.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto ${
                    prop.status === 'published'
                      ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {prop.status === 'published' ? hubContent.settings.unpublishGuide : hubContent.settings.publishGuide}
                </button>
              </div>

              {/* Duplicate Property */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div>
                  <span className="font-bold block">Duplicate Property Guide</span>
                  <span className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Create a copy of this property's rules, appliances, and settings for another unit.
                  </span>
                </div>
                <button
                  onClick={() => duplicateProperty(prop.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 self-start sm:self-auto ${
                    isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.hostDashboard.card.duplicate}</span>
                </button>
              </div>

              {/* Danger Zone: Delete */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200'
              }`}>
                <div>
                  <span className={`font-bold block ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>
                    {hubContent.settings.deleteProperty}
                  </span>
                  <span className={`text-[11px] ${isDarkMode ? 'text-red-300/80' : 'text-red-600'}`}>
                    {hubContent.settings.deleteWarning}
                  </span>
                </div>
                <button
                  onClick={() => {
                    deleteProperty(prop.id);
                    setCurrentRoute('/app');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                    isDarkMode 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40' 
                      : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{hubContent.settings.deleteBtn}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Printable Bedside Stand & Flyer Modal */}
      <AnimatePresence>
        {showPrintModal && (
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
              className="relative w-full max-w-4xl bg-stone-100 rounded-3xl p-4 sm:p-6 my-auto shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-stone-900" />
                  <span className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    Printable Guest Stand & Table-Talker · {prop.title}
                  </span>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <PrintFlyer property={prop} onBack={() => setShowPrintModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Physical QR & NFC Stand Customizer Modal */}
      {showPhysicalStandModal && (
        <PhysicalStandModal
          property={prop}
          isOpen={showPhysicalStandModal}
          onClose={() => setShowPhysicalStandModal(false)}
        />
      )}

      {/* Reusable Templates Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`max-w-4xl w-full max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col p-6 my-auto ${
                isDarkMode ? 'bg-[#181716] border-[#2B2926]' : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800 mb-4">
                <span className="font-serif font-bold text-lg">
                  {language === 'ka' ? 'შაბლონის მორგება ამ ბინაზე' : 'Apply Master Template to Property'}
                </span>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                <PropertyTemplatesManager onApplyTemplate={() => setShowTemplateModal(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Guide & Multilingual Assistant Modal */}
      <AIGuideAssistantModal
        isOpen={showAiAssistantModal}
        onClose={() => setShowAiAssistantModal(false)}
        property={prop}
        onApplyChanges={(updates) => {
          const updated = { ...prop, ...updates };
          setProp(updated);
          updateProperty(updated);
        }}
      />

      {/* Guide Health Checker Modal */}
      <AnimatePresence>
        {showHealthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-w-3xl w-full my-auto"
            >
              <div className="relative">
                <button
                  onClick={() => setShowHealthModal(false)}
                  className="absolute right-4 top-4 z-10 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <GuideHealthChecker
                  property={prop}
                  onNavigateToSection={(sec) => {
                    setShowHealthModal(false);
                    setPropertySubTab('guide');
                    setGuideActiveSection(sec);
                    setActiveStudioSection(resolveStudioSection(sec, 'guide'));
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
