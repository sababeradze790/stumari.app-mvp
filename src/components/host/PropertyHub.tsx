import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp, PropertyTab, GuideSectionKey } from '../../context/AppContext';
import { Property, ApplianceGuide, Recommendation, PropertyType } from '../../types';
import { GuestGuideSimple } from '../guest/GuestGuideSimple';
import { PROPERTY_HUB_I18N } from '../../data/propertyHubI18n';

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

  // Sync prop when currentProperty changes
  useEffect(() => {
    setProp(currentProperty);
  }, [currentProperty]);

  // Generate QR Code data URL
  useEffect(() => {
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
  }, [prop.slug]);

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
            <ArrowLeft className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#E4E98E]' : 'text-stone-900'}`} />
            <span>{t.propertyHub.backToDashboard}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-stone-950'
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
            className="px-4 py-2 rounded-full bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>{t.guestGuide.liveView}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Subtabs Navigation (Reference Styling matching screenshot) */}
      <div className={`flex items-center gap-1.5 border-b pb-1 overflow-x-auto no-scrollbar ${
        isDarkMode ? 'border-stone-800/80' : 'border-stone-200'
      }`}>
        {[
          { id: 'overview', label: t.propertyHub.tabs.overview, icon: Building2 },
          { id: 'guide', label: t.propertyHub.tabs.guide, icon: BookOpen },
          { id: 'preview', label: t.propertyHub.tabs.preview, icon: Smartphone },
          { id: 'qr', label: t.propertyHub.tabs.qr, icon: QrIcon },
          { id: 'settings', label: t.propertyHub.tabs.settings, icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = propertySubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPropertySubTab(tab.id as PropertyTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? isDarkMode 
                    ? 'bg-[#E4E98E] text-[#0C1510] font-bold shadow-sm' 
                    : 'bg-stone-900 text-white font-bold shadow-sm'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-white hover:bg-stone-900/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {propertySubTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top 3 Metric Cards Styled matching the reference pastel bento cards (Asymmetric 2-Col Bento on Mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            
            {/* 1. Status - Powder Blue (Wide on Mobile) */}
            <div className="col-span-2 md:col-span-1 p-5 sm:p-6 rounded-[22px] sm:rounded-[26px] bg-[#94B5D3] text-[#0C1510] shadow-md flex flex-col justify-between h-[138px] sm:h-[154px] transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#0C1510]/70 block">
                    {hubContent.overview.guidebookStatus}
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0C1510] mt-1 capitalize leading-none">
                    {prop.status === 'published' ? t.hostDashboard.card.published : t.hostDashboard.card.draft}
                  </div>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#0C1510]/20 flex items-center justify-center text-[#0C1510]">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <p className="text-xs font-semibold text-[#0C1510]/90">
                {hubContent.overview.liveAndInstant}
              </p>
            </div>

            {/* 2. Wi-Fi - Sage / Olive (Micro-Bento on Mobile) */}
            <div className="col-span-1 p-4 sm:p-6 rounded-[22px] sm:rounded-[26px] bg-[#859768] text-[#0C1510] shadow-md flex flex-col justify-between h-[138px] sm:h-[154px] transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-bold text-[#0C1510]/70 block">
                    {hubContent.overview.highSpeedWifi}
                  </span>
                  <div className="text-sm sm:text-xl font-bold text-[#0C1510] mt-1 truncate">
                    {prop.wifiNetwork}
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#0C1510]/20 flex items-center justify-center text-[#0C1510] shrink-0">
                  <Wifi className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <p className="text-[11px] sm:text-xs font-mono font-bold text-[#0C1510]/90 truncate">
                {t.propertyHub.overview.wifiCard}: {prop.wifiPassword}
              </p>
            </div>

            {/* 3. Keypad - Buttercup / Chartreuse (Micro-Bento on Mobile) */}
            <div className="col-span-1 p-4 sm:p-6 rounded-[22px] sm:rounded-[26px] bg-[#E4E98E] text-[#0C1510] shadow-md flex flex-col justify-between h-[138px] sm:h-[154px] transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider font-bold text-[#0C1510]/70 block">
                    {hubContent.overview.frontKeypadCode}
                  </span>
                  <div className="text-xl sm:text-3xl font-mono font-bold text-[#0C1510] mt-1 leading-none truncate">
                    {prop.doorKeypadCode}
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#0C1510]/20 flex items-center justify-center text-[#0C1510] shrink-0">
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-[#0C1510]/90 truncate">
                {hubContent.overview.backupLockbox} {prop.lockboxCode || hubContent.overview.notSet}
              </p>
            </div>

          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-[#161B1E] rounded-[28px] border border-stone-800/80 p-6 sm:p-8 space-y-5">
            <h3 className="font-serif text-xl font-bold text-white tracking-tight">
              {hubContent.overview.quickShortcutsTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <button
                onClick={() => setPropertySubTab('guide')}
                className="p-5 rounded-2xl bg-[#0F1417] hover:bg-[#13191D] border border-stone-800 hover:border-stone-700 text-left space-y-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#859768]/20 text-[#859768] border border-[#859768]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block text-sm group-hover:text-[#E4E98E] transition-colors">
                    {hubContent.overview.editGuidebook}
                  </span>
                  <span className="text-stone-400 mt-1 block">
                    {hubContent.overview.editGuidebookSub}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setPropertySubTab('qr')}
                className="p-5 rounded-2xl bg-[#0F1417] hover:bg-[#13191D] border border-stone-800 hover:border-stone-700 text-left space-y-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#94B5D3]/20 text-[#94B5D3] border border-[#94B5D3]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <QrIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block text-sm group-hover:text-[#E4E98E] transition-colors">
                    {hubContent.overview.qrFlyerNfc}
                  </span>
                  <span className="text-stone-400 mt-1 block">
                    {hubContent.overview.qrFlyerNfcSub}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setPropertySubTab('preview')}
                className="p-5 rounded-2xl bg-[#0F1417] hover:bg-[#13191D] border border-stone-800 hover:border-stone-700 text-left space-y-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E4E98E]/20 text-[#E4E98E] border border-[#E4E98E]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block text-sm group-hover:text-[#E4E98E] transition-colors">
                    {hubContent.overview.livePreview}
                  </span>
                  <span className="text-stone-400 mt-1 block">
                    {hubContent.overview.livePreviewSub}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUIDE BUILDER (Sidebar with 10 sections) */}
      {propertySubTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left Guide Sidebar (10 Sections) */}
          <div className="md:col-span-4 bg-[#161B1E] rounded-[28px] border border-stone-800/90 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block px-3 py-2">
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
                      ? 'bg-[#E4E98E] text-[#0C1510] font-bold shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Check className={`w-3.5 h-3.5 ${isActive ? 'text-[#0C1510]' : 'text-emerald-400'}`} />
                    <span>{sec.label}</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#0C1510]' : 'text-stone-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Editor Panel */}
          <div className="md:col-span-8 bg-[#181D20] rounded-[28px] border border-stone-800/90 p-6 sm:p-8 space-y-6 text-stone-100">
            
            {/* 1. Welcome Section */}
            {guideActiveSection === 'welcome' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.welcomeTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.welcomeSub}</p>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.headlineGreeting}</label>
                  <input
                    type="text"
                    value={prop.welcomeTitle || ''}
                    onChange={(e) => handleFieldChange('welcomeTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                    placeholder="Welcome!"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.welcomeNote}</label>
                  <textarea
                    rows={3}
                    value={prop.welcomeGreeting || ''}
                    onChange={(e) => handleFieldChange('welcomeGreeting', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 2. Check-in Section */}
            {guideActiveSection === 'checkin' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.checkinTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.checkinSub}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.checkinTime}</label>
                    <input
                      type="text"
                      value={prop.checkInTime}
                      onChange={(e) => handleFieldChange('checkInTime', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.doorCode}</label>
                    <input
                      type="text"
                      value={prop.doorKeypadCode}
                      onChange={(e) => handleFieldChange('doorKeypadCode', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-[#E4E98E] text-xs font-mono font-bold focus:border-[#E4E98E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.lockboxCode}</label>
                  <input
                    type="text"
                    value={prop.lockboxCode}
                    onChange={(e) => handleFieldChange('lockboxCode', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs font-mono focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.entryDirections}</label>
                  <textarea
                    rows={3}
                    value={prop.arrivalDirections}
                    onChange={(e) => handleFieldChange('arrivalDirections', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.parkingInstructions}</label>
                  <textarea
                    rows={2}
                    value={prop.parkingInstructions}
                    onChange={(e) => handleFieldChange('parkingInstructions', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3. Wi-Fi Section */}
            {guideActiveSection === 'wifi' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.wifiTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.wifiSub}</p>
                </div>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.ssid}</label>
                    <input
                      type="text"
                      value={prop.wifiNetwork}
                      onChange={(e) => handleFieldChange('wifiNetwork', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs font-mono focus:border-[#E4E98E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.wifiPass}</label>
                    <input
                      type="text"
                      value={prop.wifiPassword}
                      onChange={(e) => handleFieldChange('wifiPassword', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-[#E4E98E] text-xs font-mono font-bold focus:border-[#E4E98E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. How Things Work */}
            {guideActiveSection === 'how-it-works' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.appliancesTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.appliancesSub}</p>
                </div>
                <div className="space-y-3">
                  {prop.appliances.map((app, idx) => (
                    <div key={app.id} className="p-4 rounded-2xl bg-[#0F1417] border border-stone-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{app.title}</span>
                      </div>
                      <textarea
                        rows={2}
                        value={app.instructions}
                        onChange={(e) => {
                          const updated = [...prop.appliances];
                          updated[idx] = { ...updated[idx], instructions: e.target.value };
                          handleFieldChange('appliances', updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
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
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.rulesTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.rulesSub}</p>
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.quietHours}</label>
                  <input
                    type="text"
                    value={prop.quietHours}
                    onChange={(e) => handleFieldChange('quietHours', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.trashSchedule}</label>
                  <input
                    type="text"
                    value={prop.trashSchedule}
                    onChange={(e) => handleFieldChange('trashSchedule', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.rulesList}</label>
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
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
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.recsTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.recsSub}</p>
                </div>
                <div className="space-y-3">
                  {prop.recommendations.map((rec, idx) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-[#0F1417] border border-stone-800 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={rec.name}
                          onChange={(e) => {
                            const updated = [...prop.recommendations];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            handleFieldChange('recommendations', updated);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#0C1013] border border-stone-700 text-white font-bold text-xs focus:border-[#E4E98E] focus:outline-none"
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
                          className="px-3 py-2 rounded-xl bg-[#0C1013] border border-stone-700 text-stone-300 text-xs focus:border-[#E4E98E] focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
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
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.transportTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.transportSub}</p>
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.taxiInfo}</label>
                  <textarea
                    rows={2}
                    value={prop.taxiInfo}
                    onChange={(e) => handleFieldChange('taxiInfo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.publicTransit}</label>
                  <textarea
                    rows={2}
                    value={prop.transitInfo}
                    onChange={(e) => handleFieldChange('transitInfo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.airportTransit}</label>
                  <textarea
                    rows={2}
                    value={prop.airportTransit}
                    onChange={(e) => handleFieldChange('airportTransit', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 8. Check-out */}
            {guideActiveSection === 'checkout' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.checkoutTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.checkoutSub}</p>
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.checkoutTime}</label>
                  <input
                    type="text"
                    value={prop.checkOutTime}
                    onChange={(e) => handleFieldChange('checkOutTime', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.departureChecklist}</label>
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
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
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.contactTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.contactSub}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.hostName}</label>
                    <input
                      type="text"
                      value={prop.hostName}
                      onChange={(e) => handleFieldChange('hostName', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.hostPhone}</label>
                    <input
                      type="text"
                      value={prop.hostPhone}
                      onChange={(e) => handleFieldChange('hostPhone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.hostWhatsApp}</label>
                  <input
                    type="text"
                    value={prop.hostWhatsApp}
                    onChange={(e) => handleFieldChange('hostWhatsApp', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-[#E4E98E] text-xs font-mono focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 10. Emergency */}
            {guideActiveSection === 'emergency' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hubContent.guide.emergencyTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{hubContent.guide.emergencySub}</p>
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.emergencyServicesNum}</label>
                  <input
                    type="text"
                    value={prop.emergencyServicesNumber || '112'}
                    onChange={(e) => handleFieldChange('emergencyServicesNumber', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs font-mono font-bold focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.guide.emergencyContact}</label>
                  <input
                    type="text"
                    value={prop.emergencyContact}
                    onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <span>{hubContent.guide.autoSaveNotice}</span>
              <button
                onClick={() => showToast(hubContent.guide.savedToast)}
                className="px-5 py-2.5 rounded-full bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                {hubContent.guide.saveChanges}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: PREVIEW */}
      {propertySubTab === 'preview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#161B1E] p-5 rounded-2xl border border-stone-800">
            <div>
              <span className="text-sm font-bold text-white block">{hubContent.preview.simulatorTitle}</span>
              <span className="text-xs text-stone-400">{hubContent.preview.simulatorSub}</span>
            </div>
            <button
              onClick={() => navigateToGuestGuide(prop.slug)}
              className="px-5 py-2.5 rounded-full bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
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
        </div>
      )}

      {/* TAB 4: QR & NFC (Matches user mockup) */}
      {propertySubTab === 'qr' && (
        <div className="max-w-2xl mx-auto bg-[#161B1E] rounded-[32px] border border-stone-800/90 p-8 sm:p-10 shadow-xl space-y-6 text-center animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              {hubContent.qr.connectGuestsTitle}
            </h2>
            <p className="text-xs text-stone-400 mt-1.5">
              {hubContent.qr.connectGuestsSub}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 inline-block mx-auto shadow-2xl">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Stumari QR Code" className="w-56 h-56 mx-auto rounded-xl" />
            ) : (
              <div className="w-56 h-56 bg-stone-100 animate-pulse rounded-xl flex items-center justify-center text-xs text-stone-400">
                {hubContent.qr.generatingQr}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleDownloadQr}
              className="px-6 py-3 rounded-full bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] font-bold text-xs transition-all inline-flex items-center gap-2 shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
              <span>{hubContent.qr.downloadQrBtn}</span>
            </button>
          </div>

          {/* NFC Status Banner */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-emerald-500/30 flex items-center justify-between text-left text-xs text-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">{hubContent.qr.nfcReadyTitle}</span>
                <span className="text-[11px] text-stone-400">
                  {hubContent.qr.nfcReadySub}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] shrink-0 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{hubContent.qr.nfcActive}</span>
            </span>
          </div>

          {/* Guest URL with Copy */}
          <div className="text-left space-y-1.5 pt-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold block">{hubContent.qr.guestUrlLabel}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`stumari.app/g/${prop.slug}`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 bg-[#0C1013] font-mono text-xs text-white font-medium focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 rounded-xl bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? hubContent.qr.copied : hubContent.qr.copyLink}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {propertySubTab === 'settings' && (
        <div className="max-w-2xl mx-auto bg-[#161B1E] rounded-[32px] border border-stone-800/90 p-8 sm:p-10 shadow-xl space-y-6 text-xs text-stone-300 animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              {hubContent.settings.settingsTitle}
            </h2>
            <p className="text-xs text-stone-400 mt-1.5">
              {hubContent.settings.settingsSub}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.settings.propName}</label>
              <input
                type="text"
                value={prop.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-sm font-semibold focus:border-[#E4E98E] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.settings.propType}</label>
                <select
                  value={prop.type}
                  onChange={(e) => handleFieldChange('type', e.target.value as PropertyType)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                >
                  <option value="apartment">Apartment</option>
                  <option value="guesthouse">Guesthouse</option>
                  <option value="hotel">Boutique Hotel</option>
                  <option value="villa">Villa</option>
                  <option value="resort">Resort</option>
                </select>
              </div>

              <div>
                <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.settings.guestUrlSlug}</label>
                <input
                  type="text"
                  value={prop.slug}
                  onChange={(e) => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white font-mono text-xs focus:border-[#E4E98E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.settings.addressLocation}</label>
              <input
                type="text"
                value={prop.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.settings.coverImageUrl}</label>
              <input
                type="text"
                value={prop.coverImage}
                onChange={(e) => handleFieldChange('coverImage', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white font-mono text-xs focus:border-[#E4E98E] focus:outline-none"
              />
            </div>

            <div className="pt-1">
              <label className="font-mono uppercase tracking-wider text-stone-300 font-semibold block mb-1.5">{hubContent.settings.airbnbBookingLink}</label>
              <input
                type="text"
                value={prop.sourceUrl || ''}
                onChange={(e) => handleFieldChange('sourceUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0C1013] border border-stone-700 text-white text-xs focus:border-[#E4E98E] focus:outline-none"
                placeholder="https://airbnb.com/rooms/..."
              />
            </div>

            {/* Publish / Unpublish Toggle */}
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">{hubContent.settings.publishStatus}</span>
                <span className="text-stone-400 text-[11px]">
                  {prop.status === 'published'
                    ? hubContent.settings.publishedNotice
                    : hubContent.settings.draftNotice}
                </span>
              </div>
              <button
                onClick={() => togglePublishProperty(prop.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  prop.status === 'published'
                    ? 'bg-stone-800 text-stone-200 hover:bg-stone-750 border border-stone-700'
                    : 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80]'
                }`}
              >
                {prop.status === 'published' ? hubContent.settings.unpublishGuide : hubContent.settings.publishGuide}
              </button>
            </div>

            {/* Danger Zone: Delete */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-red-400 block">{hubContent.settings.deleteProperty}</span>
                <span className="text-red-300/70 text-[11px]">
                  {hubContent.settings.deleteWarning}
                </span>
              </div>
              <button
                onClick={() => {
                  deleteProperty(prop.id);
                  setCurrentRoute('/app');
                }}
                className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{hubContent.settings.deleteBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
