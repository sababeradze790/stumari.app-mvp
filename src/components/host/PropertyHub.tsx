import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp, PropertyTab, GuideSectionKey } from '../../context/AppContext';
import { Property, ApplianceGuide, Recommendation, PropertyType } from '../../types';
import { GuestGuideSimple } from '../guest/GuestGuideSimple';
import { PROPERTY_HUB_I18N } from '../../data/propertyHubI18n';
import { HostAnalytics } from './HostAnalytics';
import { PropertyGemsCurator } from './PropertyGemsCurator';
import { ReviewEngineInbox } from './ReviewEngineInbox';
import { PrintFlyer } from '../print/PrintFlyer';

export const PropertyHub: React.FC = () => {
  const { 
    currentProperty, 
    updateProperty, 
    deleteProperty, 
    togglePublishProperty,
    propertySubTab, 
    setPropertySubTab, 
    guideActiveSection, 
    setGuideActiveSection,
    navigateToGuestGuide,
    setCurrentRoute,
    showToast,
    theme,
    t,
    language
  } = useApp();

  const isDarkMode = theme === 'dark';
  const hubContent = PROPERTY_HUB_I18N[language] || PROPERTY_HUB_I18N.en;

  const [prop, setProp] = useState<Property>(currentProperty);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Sync prop when currentProperty changes
  useEffect(() => {
    setProp(currentProperty);
  }, [currentProperty]);

  // Generate QR Code data URL
  useEffect(() => {
    if (!prop?.slug) return;
    const guestUrl = `${window.location.origin}/#/g/${prop.slug}`;
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
  }, [prop?.slug]);

  const handleFieldChange = (field: keyof Property, value: any) => {
    const updated = { ...prop, [field]: value };
    setProp(updated);
    updateProperty(updated);
  };

  const handleCopyLink = () => {
    const guestUrl = `${window.location.origin}/#/g/${prop.slug}`;
    navigator.clipboard.writeText(guestUrl);
    setCopiedLink(true);
    showToast(t.common.copied);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `stumari-qr-${prop.slug}.png`;
    a.click();
    showToast(t.common.download);
  };

  const guideSections: { id: GuideSectionKey; label: string }[] = [
    { id: 'welcome', label: t.propertyHub.guideSections.welcome },
    { id: 'checkin', label: t.propertyHub.guideSections.checkin },
    { id: 'wifi', label: t.propertyHub.guideSections.wifi },
    { id: 'how-it-works', label: t.propertyHub.guideSections.appliances },
    { id: 'rules', label: t.propertyHub.guideSections.rules },
    { id: 'recommendations', label: t.propertyHub.guideSections.recommendations },
    { id: 'transport', label: t.propertyHub.guideSections.transport },
    { id: 'checkout', label: t.propertyHub.guideSections.checkout },
    { id: 'contact', label: t.guestGuide.bento.contact },
    { id: 'emergency', label: t.propertyHub.guideSections.emergency },
  ];

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

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8 rounded-[36px] my-6 border shadow-2xl relative overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0C1013] text-stone-100 border-stone-800/80' : 'bg-white text-stone-900 border-stone-200 shadow-xl'
    }`}>
      
      {/* Top Breadcrumb & Status Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b transition-colors ${
        isDarkMode ? 'border-stone-800/80' : 'border-stone-200'
      }`}>
        <div className="space-y-1.5">
          <button
            onClick={() => setCurrentRoute('/app')}
            className={`text-xs flex items-center gap-1.5 font-semibold transition-colors mb-1.5 px-3 py-1 rounded-full border w-fit ${
              isDarkMode 
                ? 'text-stone-400 hover:text-white bg-stone-900 border-stone-800 hover:border-stone-700' 
                : 'text-stone-700 hover:text-stone-950 bg-stone-100 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isDarkMode ? 'text-amber-400' : 'text-stone-900'}`} />
            <span>{t.propertyHub.backToDashboard}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
              {prop.title}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold capitalize ${
                prop.status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {prop.status === 'published' ? t.hostDashboard.card.published : t.hostDashboard.card.draft}
            </span>
          </div>
          <p className={`text-xs flex items-center gap-1.5 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
            <MapPin className="w-3.5 h-3.5" />
            <span>{prop.address}, {prop.city}, {prop.country}</span>
          </p>
        </div>

        {/* Action Header Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isDarkMode 
                ? 'border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800' 
                : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? hubContent.qr.copied : t.common.copy}</span>
          </button>

          <button
            onClick={() => navigateToGuestGuide(prop.slug)}
            className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>{t.guestGuide.liveView}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Subtabs Navigation */}
      <div className={`flex items-center gap-1.5 border-b pb-1 overflow-x-auto no-scrollbar ${
        isDarkMode ? 'border-stone-800/80' : 'border-stone-200'
      }`}>
        {[
          { id: 'overview', label: t.propertyHub.tabs.overview, icon: Building2 },
          { id: 'guide', label: t.propertyHub.tabs.guide, icon: BookOpen },
          { 
            id: 'gems', 
            label: language === 'ka' ? 'რჩევები' : language === 'ru' ? 'Рекомендации' : 'Local Gems', 
            icon: Compass,
            badge: prop.gemIds?.length ? String(prop.gemIds.length) : undefined
          },
          { 
            id: 'reviews', 
            label: language === 'ka' ? 'შეფასებები' : language === 'ru' ? 'Отзывы' : 'Review Engine', 
            icon: MessageSquareHeart 
          },
          { id: 'preview', label: t.propertyHub.tabs.preview, icon: Smartphone },
          { id: 'qr', label: language === 'ka' ? 'QR & სტენდი' : language === 'ru' ? 'QR и Стенд' : 'QR & Stand', icon: QrIcon },
          { id: 'analytics', label: language === 'ka' ? 'ანალიტიკა' : language === 'ru' ? 'Аналитика' : 'Analytics', icon: TrendingUp },
          { id: 'settings', label: t.propertyHub.tabs.settings, icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = propertySubTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPropertySubTab(tab.id as PropertyTab)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 relative cursor-pointer ${
                isActive
                  ? 'text-white font-bold'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-white hover:bg-stone-900/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePropertyHubSubTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className={`absolute inset-0 rounded-2xl shadow-sm ${
                    isDarkMode ? 'bg-amber-600' : 'bg-stone-900'
                  }`}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                    isActive 
                      ? 'bg-black/25 text-white' 
                      : isDarkMode ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
      {/* TAB 1: OVERVIEW */}
      {propertySubTab === 'overview' && (
        <motion.div
          key="overview"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Top 3 Metric Cards Styled matching the reference pastel bento cards (Asymmetric 2-Col Bento on Mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            
            {/* 1. Status */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`col-span-2 md:col-span-1 p-5 sm:p-6 rounded-[22px] sm:rounded-[26px] border shadow-sm flex flex-col justify-between h-[138px] sm:h-[154px] cursor-pointer ${
                isDarkMode ? 'bg-[#18181B] border-zinc-800/90 text-stone-100' : 'bg-white border-stone-200/90 text-stone-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-mono tracking-wider font-bold block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    {hubContent.overview.guidebookStatus}
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 capitalize leading-none">
                    {prop.status === 'published' ? t.hostDashboard.card.published : t.hostDashboard.card.draft}
                  </div>
                </div>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center ${
                  prop.status === 'published' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                }`}>
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <p className={`text-xs font-semibold ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                {hubContent.overview.liveAndInstant}
              </p>
            </motion.div>

            {/* 2. Wi-Fi */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`col-span-1 p-4 sm:p-6 rounded-[22px] sm:rounded-[26px] border shadow-sm flex flex-col justify-between h-[138px] sm:h-[154px] cursor-pointer ${
                isDarkMode ? 'bg-[#18181B] border-zinc-800/90 text-stone-100' : 'bg-white border-stone-200/90 text-stone-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <span className={`text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-bold block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    {hubContent.overview.highSpeedWifi}
                  </span>
                  <div className="text-sm sm:xl font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                    {prop.wifiNetwork}
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <p className={`text-[11px] sm:text-xs font-mono font-bold truncate ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {t.propertyHub.overview.wifiCard}: {prop.wifiPassword}
              </p>
            </motion.div>

            {/* 3. Keypad PIN */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`col-span-1 p-4 sm:p-6 rounded-[22px] sm:rounded-[26px] border shadow-sm flex flex-col justify-between h-[138px] sm:h-[154px] cursor-pointer ${
                isDarkMode ? 'bg-[#18181B] border-zinc-800/90 text-stone-100' : 'bg-white border-stone-200/90 text-stone-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <span className={`text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-bold block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    {hubContent.overview.frontKeypadCode}
                  </span>
                  <div className="text-xl sm:text-3xl font-mono font-bold text-amber-700 dark:text-amber-400 mt-1 leading-none truncate">
                    {prop.doorKeypadCode}
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <p className={`text-[11px] sm:text-xs font-semibold truncate ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                {hubContent.overview.backupLockbox} {prop.lockboxCode || hubContent.overview.notSet}
              </p>
            </motion.div>

          </div>

          {/* Quick Management Shortcuts (5 Cards Grid) */}
          <div className={`rounded-[28px] border p-6 sm:p-8 space-y-5 transition-colors ${
            isDarkMode ? 'bg-[#161B1E] border-stone-800/80 text-white' : 'bg-stone-50 border-stone-200 text-stone-900 shadow-xs'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-serif text-xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                {hubContent.overview.quickShortcutsTitle}
              </h3>
              <span className="text-xs font-mono opacity-60">5 Host Workflows</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              
              {/* 1. Edit Guidebook */}
              <motion.button
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setPropertySubTab('guide')}
                className={`p-5 rounded-2xl border text-left space-y-2.5 transition-colors group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#0F1417] hover:bg-[#13191D] border-stone-800 hover:border-stone-700' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-108 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-bold block text-sm transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-stone-900 group-hover:text-amber-700'
                  }`}>
                    {hubContent.overview.editGuidebook}
                  </span>
                  <span className={`mt-1 block font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    {hubContent.overview.editGuidebookSub}
                  </span>
                </div>
              </motion.button>

              {/* 2. Curate Local Gems */}
              <motion.button
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setPropertySubTab('gems')}
                className={`p-5 rounded-2xl border text-left space-y-2.5 transition-colors group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#0F1417] hover:bg-[#13191D] border-stone-800 hover:border-stone-700' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-108 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-bold block text-sm transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-stone-900 group-hover:text-amber-700'
                  }`}>
                    Local Gems Curator
                  </span>
                  <span className={`mt-1 block font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    Select authentic neighborhood spots & secrets ({prop.gemIds?.length || 0} active)
                  </span>
                </div>
              </motion.button>

              {/* 3. Review Engine & Feedback */}
              <motion.button
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setPropertySubTab('reviews')}
                className={`p-5 rounded-2xl border text-left space-y-2.5 transition-colors group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#0F1417] hover:bg-[#13191D] border-stone-800 hover:border-stone-700' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-108 transition-transform">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-bold block text-sm transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-stone-900 group-hover:text-amber-700'
                  }`}>
                    Review Engine & Interceptor
                  </span>
                  <span className={`mt-1 block font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    Private guest feedback & routing to 5-star Airbnb reviews
                  </span>
                </div>
              </motion.button>

              {/* 4. Bedside Stand & QR */}
              <motion.button
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setPropertySubTab('qr')}
                className={`p-5 rounded-2xl border text-left space-y-2.5 transition-colors group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#0F1417] hover:bg-[#13191D] border-stone-800 hover:border-stone-700' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-108 transition-transform">
                  <QrIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-bold block text-sm transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-stone-900 group-hover:text-amber-700'
                  }`}>
                    {hubContent.overview.qrFlyerNfc}
                  </span>
                  <span className={`mt-1 block font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    Print bedside table stand flyer & download QR code
                  </span>
                </div>
              </motion.button>

              {/* 5. Live Simulator */}
              <motion.button
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setPropertySubTab('preview')}
                className={`p-5 rounded-2xl border text-left space-y-2.5 transition-colors group cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#0F1417] hover:bg-[#13191D] border-stone-800 hover:border-stone-700' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-108 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-bold block text-sm transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-stone-900 group-hover:text-amber-700'
                  }`}>
                    {hubContent.overview.livePreview}
                  </span>
                  <span className={`mt-1 block font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    {hubContent.overview.livePreviewSub}
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: GUIDE BUILDER (Sidebar with 10 sections) */}
      {propertySubTab === 'guide' && (
        <motion.div
          key="guide"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          
          {/* Left Guide Sidebar (10 Sections) */}
          <div className={`md:col-span-4 rounded-[28px] border p-3 space-y-1 ${
            isDarkMode ? 'bg-[#161B1E] border-stone-800/90' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-widest font-bold block px-3 py-2 ${
              isDarkMode ? 'text-stone-400' : 'text-stone-600'
            }`}>
              {hubContent.guide.guideSectionsTitle}
            </span>
            {guideSections.map((sec) => {
              const isActive = guideActiveSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setGuideActiveSection(sec.id)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all text-left ${
                    isActive
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : isDarkMode
                      ? 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/70'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Check className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    <span>{sec.label}</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Editor Panel */}
          <div className={`md:col-span-8 rounded-[28px] border p-6 sm:p-8 space-y-6 ${
            isDarkMode ? 'bg-[#181D20] border-stone-800/90 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-xs'
          }`}>
            
            {/* 1. Welcome Section */}
            {guideActiveSection === 'welcome' && (
              <div className="space-y-5">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.welcomeTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.welcomeSub}</p>
                </div>
                <div>
                  <label className={`text-xs font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.headlineGreeting}</label>
                  <input
                    type="text"
                    value={prop.welcomeTitle || ''}
                    onChange={(e) => handleFieldChange('welcomeTitle', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-800'
                    }`}
                    placeholder="Welcome!"
                  />
                </div>
                <div>
                  <label className={`text-xs font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.welcomeNote}</label>
                  <textarea
                    rows={3}
                    value={prop.welcomeGreeting || ''}
                    onChange={(e) => handleFieldChange('welcomeGreeting', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-800'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* 2. Check-in Section */}
            {guideActiveSection === 'checkin' && (
              <div className="space-y-5">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.checkinTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.checkinSub}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.checkinTime}</label>
                    <input
                      type="text"
                      value={prop.checkInTime}
                      onChange={(e) => handleFieldChange('checkInTime', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.doorCode}</label>
                    <input
                      type="text"
                      value={prop.doorKeypadCode}
                      onChange={(e) => handleFieldChange('doorKeypadCode', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-700 text-amber-400 focus:border-amber-500' : 'bg-white border-stone-200 text-amber-700 focus:border-amber-600'
                      }`}
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.lockboxCode}</label>
                  <input
                    type="text"
                    value={prop.lockboxCode}
                    onChange={(e) => handleFieldChange('lockboxCode', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>

                <div className="text-xs">
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.entryDirections}</label>
                  <textarea
                    rows={3}
                    value={prop.arrivalDirections}
                    onChange={(e) => handleFieldChange('arrivalDirections', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>

                <div className="text-xs">
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.parkingInstructions}</label>
                  <textarea
                    rows={2}
                    value={prop.parkingInstructions}
                    onChange={(e) => handleFieldChange('parkingInstructions', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* 3. Wi-Fi Section */}
            {guideActiveSection === 'wifi' && (
              <div className="space-y-5">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.wifiTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.wifiSub}</p>
                </div>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.ssid}</label>
                    <input
                      type="text"
                      value={prop.wifiNetwork}
                      onChange={(e) => handleFieldChange('wifiNetwork', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.wifiPass}</label>
                    <input
                      type="text"
                      value={prop.wifiPassword}
                      onChange={(e) => handleFieldChange('wifiPassword', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-700 text-amber-400 focus:border-amber-500' : 'bg-white border-stone-200 text-amber-700 focus:border-amber-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. How Things Work */}
            {guideActiveSection === 'how-it-works' && (
              <div className="space-y-5">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.appliancesTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.appliancesSub}</p>
                </div>
                <div className="space-y-3">
                  {prop.appliances.map((app, idx) => (
                    <div key={app.id} className={`p-4 rounded-2xl border space-y-2 text-xs ${
                      isDarkMode ? 'bg-[#0F1417] border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{app.title}</span>
                      </div>
                      <textarea
                        rows={2}
                        value={app.instructions}
                        onChange={(e) => {
                          const updated = [...prop.appliances];
                          updated[idx] = { ...updated[idx], instructions: e.target.value };
                          handleFieldChange('appliances', updated);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                          isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. House Rules */}
            {guideActiveSection === 'rules' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.rulesTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.rulesSub}</p>
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.quietHours}</label>
                  <input
                    type="text"
                    value={prop.quietHours}
                    onChange={(e) => handleFieldChange('quietHours', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.trashSchedule}</label>
                  <input
                    type="text"
                    value={prop.trashSchedule}
                    onChange={(e) => handleFieldChange('trashSchedule', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.rulesList}</label>
                  <div className="space-y-2">
                    {prop.houseRules.map((rule, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const updated = [...prop.houseRules];
                          updated[idx] = e.target.value;
                          handleFieldChange('houseRules', updated);
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Recommendations */}
            {guideActiveSection === 'recommendations' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.recsTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.recsSub}</p>
                </div>
                <div className="space-y-3">
                  {prop.recommendations.map((rec, idx) => (
                    <div key={rec.id} className={`p-4 rounded-2xl border space-y-2.5 ${
                      isDarkMode ? 'bg-[#0F1417] border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={rec.name}
                          onChange={(e) => {
                            const updated = [...prop.recommendations];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            handleFieldChange('recommendations', updated);
                          }}
                          className={`px-3 py-2 rounded-xl border font-bold text-xs focus:outline-none ${
                            isDarkMode ? 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500' : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
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
                          className="px-3 py-2 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                          placeholder={hubContent.guide.distancePlaceholder}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={rec.description}
                        onChange={(e) => {
                          const updated = [...prop.recommendations];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          handleFieldChange('recommendations', updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Transport */}
            {guideActiveSection === 'transport' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.transportTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.transportSub}</p>
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.taxiInfo}</label>
                  <textarea
                    rows={2}
                    value={prop.taxiInfo}
                    onChange={(e) => handleFieldChange('taxiInfo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.publicTransit}</label>
                  <textarea
                    rows={2}
                    value={prop.transitInfo}
                    onChange={(e) => handleFieldChange('transitInfo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.airportTransit}</label>
                  <textarea
                    rows={2}
                    value={prop.airportTransit}
                    onChange={(e) => handleFieldChange('airportTransit', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* 8. Check-out */}
            {guideActiveSection === 'checkout' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.checkoutTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.checkoutSub}</p>
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.checkoutTime}</label>
                  <input
                    type="text"
                    value={prop.checkOutTime}
                    onChange={(e) => handleFieldChange('checkOutTime', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.departureChecklist}</label>
                  <div className="space-y-2">
                    {prop.departureChecklist.map((step, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...prop.departureChecklist];
                          updated[idx] = e.target.value;
                          handleFieldChange('departureChecklist', updated);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 9. Contact */}
            {guideActiveSection === 'contact' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.contactTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.contactSub}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.hostName}</label>
                    <input
                      type="text"
                      value={prop.hostName}
                      onChange={(e) => handleFieldChange('hostName', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.hostPhone}</label>
                    <input
                      type="text"
                      value={prop.hostPhone}
                      onChange={(e) => handleFieldChange('hostPhone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.hostWhatsApp}</label>
                  <input
                    type="text"
                    value={prop.hostWhatsApp}
                    onChange={(e) => handleFieldChange('hostWhatsApp', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-700 text-amber-400 focus:border-amber-500' : 'bg-white border-stone-200 text-amber-700 focus:border-amber-600'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* 10. Emergency */}
            {guideActiveSection === 'emergency' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.guide.emergencyTitle}</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.guide.emergencySub}</p>
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.emergencyServicesNum}</label>
                  <input
                    type="text"
                    value={prop.emergencyServicesNumber || '112'}
                    onChange={(e) => handleFieldChange('emergencyServicesNumber', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.guide.emergencyContact}</label>
                  <input
                    type="text"
                    value={prop.emergencyContact}
                    onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div className={`pt-6 border-t flex items-center justify-between text-xs ${isDarkMode ? 'border-stone-800/80 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
              <span>{hubContent.guide.autoSaveNotice}</span>
              <button
                onClick={() => showToast(hubContent.guide.savedToast)}
                className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                {hubContent.guide.saveChanges}
              </button>
            </div>

          </div>

        </motion.div>
      )}

      {/* TAB 3: LOCAL GEMS CURATOR */}
      {propertySubTab === 'gems' && (
        <motion.div
          key="gems"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <PropertyGemsCurator property={prop} />
        </motion.div>
      )}

      {/* TAB 4: REVIEWS & PRIVATE FEEDBACK INBOX */}
      {propertySubTab === 'reviews' && (
        <motion.div
          key="reviews"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <ReviewEngineInbox propertyIdFilter={prop.id} />
        </motion.div>
      )}

      {/* TAB 5: PREVIEW */}
      {propertySubTab === 'preview' && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className={`flex items-center justify-between p-5 rounded-2xl border transition-colors ${
            isDarkMode ? 'bg-[#161B1E] border-stone-800' : 'bg-stone-50 border-stone-200 shadow-xs'
          }`}>
            <div>
              <span className={`text-sm font-bold block ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.preview.simulatorTitle}</span>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>{hubContent.preview.simulatorSub}</span>
            </div>
            <button
              onClick={() => navigateToGuestGuide(prop.slug)}
              className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>{hubContent.preview.openGuideBtn}</span>
            </button>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-[400px] bg-stone-950 rounded-[44px] p-3 shadow-2xl border-4 border-stone-800 relative">
              <div className="w-full bg-stone-50 rounded-[34px] overflow-hidden min-h-[640px] max-h-[720px] overflow-y-auto no-scrollbar shadow-inner relative">
                <GuestGuideSimple propertyOverride={prop} isEmbed={true} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: QR & NFC (Matches user mockup) */}
      {propertySubTab === 'qr' && (
        <motion.div
          key="qr"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-2xl mx-auto rounded-[32px] border p-8 sm:p-10 shadow-xl space-y-6 text-center ${
            isDarkMode ? 'bg-[#161B1E] border-stone-800/90 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-md'
          }`}
        >
          <div>
            <h2 className={`text-3xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
              {hubContent.qr.connectGuestsTitle}
            </h2>
            <p className={`text-xs mt-1.5 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
              {hubContent.qr.connectGuestsSub}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 inline-block mx-auto shadow-2xl">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Stumari QR Code" className="w-56 h-56 mx-auto rounded-xl" />
            ) : (
              <div className="w-56 h-56 bg-stone-100 animate-pulse rounded-xl flex items-center justify-center text-xs text-stone-400 font-medium">
                {hubContent.qr.generatingQr}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <button
              onClick={handleDownloadQr}
              className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all inline-flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
              <span>{hubContent.qr.downloadQrBtn}</span>
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer ${
                isDarkMode 
                  ? 'bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800' 
                  : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-500" />
              <span>Print Bedside Stand Flyer</span>
            </button>
          </div>

          {/* Printable Bedside Stand Preview Banner */}
          <div className={`p-4 rounded-2xl border text-left text-xs transition-colors flex items-center justify-between gap-3 ${
            isDarkMode ? 'bg-[#101518] border-stone-800' : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className={`font-bold block ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                  Guest Table Stand & Acrylic Tent Card (5x7 & A4)
                </span>
                <span className={`text-[11px] font-medium block mt-0.5 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  Formatted with your Wi-Fi name, password, and QR code for bedside photo frames & kitchen counters.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 active:scale-95 shadow-xs"
            >
              Preview & Print ↗
            </button>
          </div>

          {/* NFC Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-left text-xs ${
            isDarkMode 
              ? 'bg-stone-900 border-emerald-500/30 text-stone-200' 
              : 'bg-emerald-50/70 border-emerald-300 text-stone-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className={`font-bold block ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.qr.nfcReadyTitle}</span>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  {hubContent.qr.nfcReadySub}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[10px] shrink-0 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{hubContent.qr.nfcActive}</span>
            </span>
          </div>

          {/* Guest URL with Copy */}
          <div className="text-left space-y-1.5 pt-2">
            <label className={`text-xs font-mono uppercase tracking-wider font-semibold block ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.qr.guestUrlLabel}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`stumari.app/g/${prop.slug}`}
                className="flex-1 px-4 py-2.5 rounded-xl border font-mono text-xs font-bold focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
              />
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? hubContent.qr.copied : hubContent.qr.copyLink}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: ANALYTICS (Recharts Powered Live Performance Engine) */}
      {propertySubTab === 'analytics' && (
        <motion.div
          key="analytics"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <HostAnalytics propertyIdFilter={prop.id} />
        </motion.div>
      )}

      {/* TAB 6: SETTINGS */}
      {propertySubTab === 'settings' && (
        <motion.div
          key="settings"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-2xl mx-auto rounded-[32px] border p-8 sm:p-10 shadow-xl space-y-6 text-xs transition-colors ${
            isDarkMode ? 'bg-[#161B1E] border-stone-800/90 text-stone-200' : 'bg-white border-stone-200 text-stone-900 shadow-md'
          }`}
        >
          <div>
            <h2 className={`text-3xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
              {hubContent.settings.settingsTitle}
            </h2>
            <p className={`text-xs mt-1.5 font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
              {hubContent.settings.settingsSub}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.settings.propName}</label>
              <input
                type="text"
                value={prop.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.settings.propType}</label>
                <select
                  value={prop.type}
                  onChange={(e) => handleFieldChange('type', e.target.value as PropertyType)}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="guesthouse">Guesthouse</option>
                  <option value="hotel">Boutique Hotel</option>
                  <option value="villa">Villa</option>
                  <option value="resort">Resort</option>
                </select>
              </div>

              <div>
                <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.settings.guestUrlSlug}</label>
                <input
                  type="text"
                  value={prop.slug}
                  onChange={(e) => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-4 py-2.5 rounded-xl border font-mono text-xs font-bold focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.settings.addressLocation}</label>
              <input
                type="text"
                value={prop.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
              />
            </div>

            <div>
              <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.settings.coverImageUrl}</label>
              <input
                type="text"
                value={prop.coverImage}
                onChange={(e) => handleFieldChange('coverImage', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border font-mono text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
              />
            </div>

            <div className="pt-1">
              <label className={`font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDarkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{hubContent.settings.airbnbBookingLink}</label>
              <input
                type="text"
                value={prop.sourceUrl || ''}
                onChange={(e) => handleFieldChange('sourceUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                placeholder="https://airbnb.com/rooms/..."
              />
            </div>

            {/* Publish / Unpublish Toggle */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div>
                <span className={`font-bold block ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{hubContent.settings.publishStatus}</span>
                <span className={`text-[11px] ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  {prop.status === 'published'
                    ? hubContent.settings.publishedNotice
                    : hubContent.settings.draftNotice}
                </span>
              </div>
              <button
                onClick={() => togglePublishProperty(prop.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  prop.status === 'published'
                    ? 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                }`}
              >
                {prop.status === 'published' ? hubContent.settings.unpublishGuide : hubContent.settings.publishGuide}
              </button>
            </div>

            {/* Danger Zone: Delete */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDarkMode ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200'
            }`}>
              <div>
                <span className={`font-bold block ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>{hubContent.settings.deleteProperty}</span>
                <span className={`text-[11px] ${isDarkMode ? 'text-red-300/80' : 'text-red-600'}`}>
                  {hubContent.settings.deleteWarning}
                </span>
              </div>
              <button
                onClick={() => {
                  deleteProperty(prop.id);
                  setCurrentRoute('/app');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
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

    </div>
  );
};
