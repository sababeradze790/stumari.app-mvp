import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

interface HostDashboardSimpleProps {
  isFullList?: boolean;
}

export const HostDashboardSimple: React.FC<HostDashboardSimpleProps> = ({ isFullList = false }) => {
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
    getLocalizedProperty
  } = useApp();

  const isDarkMode = theme === 'dark';
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'cards' | 'grid' | 'list'>('cards');
  const [mobileSection, setMobileSection] = useState<'all' | 'metrics' | 'properties' | 'tools'>('all');
  const [activePropertyIndex, setActivePropertyIndex] = useState<number>(0);

  const localizedProperties = properties.map(p => getLocalizedProperty(p));
  const primaryProperty = localizedProperties[activePropertyIndex] || localizedProperties[0];

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
    <div className={`max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-5 sm:space-y-8 font-sans rounded-[24px] sm:rounded-[36px] my-2 sm:my-6 border shadow-2xl relative overflow-hidden transition-colors duration-300 pb-20 md:pb-10 ${
      isDarkMode ? 'bg-[#0C1013] text-stone-100 border-stone-800/80' : 'bg-white text-stone-900 border-stone-200 shadow-xl'
    }`}>
      
      {/* Top Welcome Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b transition-colors ${
        isDarkMode ? 'border-stone-800/80' : 'border-stone-200'
      }`}>
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <h1 className={`text-xl sm:text-4xl font-serif font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-stone-950'
            }`}>
              {t.hostDashboard.welcomeBack}
            </h1>
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold font-mono uppercase bg-[#E4E98E] text-[#0C1510] shadow-xs">
              {currentUser.plan} {t.hostDashboard.planTag}
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 sm:mt-1.5 font-normal ${
            isDarkMode ? 'text-stone-400' : 'text-stone-500'
          }`}>
            {isFullList 
              ? t.hostDashboard.fullListSubtitle
              : t.hostDashboard.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentRoute('/onboarding')}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-full bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#0C1510]" />
            <span>{t.nav.addProperty}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0C1510]" />
          </button>
        </div>
      </div>

      {/* MOBILE SECTION SEGMENTED BAR */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: `⭐ ${t.propertyHub.tabs.overview}` },
          { id: 'properties', label: `🏘️ ${t.nav.myProperties} (${properties.length})` },
          { id: 'metrics', label: `📊 ${t.admin.tabs.overview}` },
          { id: 'tools', label: `⚡ ${t.hostDashboard.quickActions.title}` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMobileSection(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              mobileSection === tab.id
                ? isDarkMode ? 'bg-[#E4E98E] text-[#0C1510] shadow-xs' : 'bg-stone-900 text-white shadow-xs'
                : isDarkMode ? 'bg-stone-900 text-stone-400 border border-stone-800' : 'bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: ASYMMETRIC BENTO METRICS & HERO STATUS */}
      {(mobileSection === 'all' || mobileSection === 'metrics' || mobileSection === 'tools') && (
        <div className="space-y-3 sm:space-y-4">
          
          {/* PHONE ASYMMETRIC BENTO GRID */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4">
            
            {/* 1. WIDE HERO GUIDE BANNER */}
            <div className={`col-span-2 md:col-span-8 p-4 sm:p-6 rounded-[22px] sm:rounded-[28px] border transition-all relative overflow-hidden flex flex-col justify-between ${
              isDarkMode ? 'bg-gradient-to-br from-[#12181C] via-[#161D22] to-[#141A1E] border-stone-800 text-stone-100 shadow-xl' : 'bg-gradient-to-br from-[#FAF8F5] via-white to-[#F2EFE9] border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400">
                    {t.hostDashboard.card.published} Stumari Guide
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isDarkMode ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {primaryProperty.city}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopy(primaryProperty)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-all active:scale-95 bg-white/10 hover:bg-white/20 text-inherit border-current/20"
                  >
                    {copiedSlug === primaryProperty.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSlug === primaryProperty.slug ? t.common.copied : t.common.share}</span>
                  </button>

                  <button
                    onClick={() => navigateToGuestGuide(primaryProperty.slug)}
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80] flex items-center gap-1 shadow-xs active:scale-95"
                  >
                    <span>{t.guestGuide.liveView}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-2xl font-serif font-bold tracking-tight truncate">
                  {primaryProperty.title}
                </h2>
                <div className="flex items-center gap-3 text-xs mt-1 opacity-80">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>4.98 {t.marketing.stats.ratingLabel}</span>
                  </span>
                  <span>·</span>
                  <span>{t.propertyHub.overview.wifiCard}: <strong className="font-mono">{primaryProperty.wifiNetwork}</strong></span>
                </div>
              </div>
            </div>

            {/* 2. PAIRED MICRO-BENTO CARD: Active Guides */}
            <div className="col-span-1 md:col-span-4 bg-[#859768] text-[#0C1510] rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 shadow-md flex flex-col justify-between h-[120px] sm:h-auto min-h-[120px] transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <span className="font-serif text-3xl sm:text-5xl font-bold leading-none tracking-tight">
                  {String(properties.length).padStart(2, '0')}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#0C1510]/20 flex items-center justify-center text-[#0C1510]">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <div>
                <span className="font-bold text-[11px] sm:text-xs text-[#0C1510] tracking-tight block leading-tight">
                  {t.hostDashboard.metrics.activeGuides}
                </span>
                <span className="text-[10px] text-[#0C1510]/70 font-mono block mt-0.5">
                  {publishedCount} {t.hostDashboard.card.published.toLowerCase()}
                </span>
              </div>
            </div>

            {/* 3. PAIRED MICRO-BENTO CARD: Guest Views */}
            <div className="col-span-1 md:col-span-4 bg-[#E4E98E] text-[#0C1510] rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 shadow-md flex flex-col justify-between h-[120px] sm:h-auto min-h-[120px] transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <span className="font-serif text-3xl sm:text-5xl font-bold leading-none tracking-tight">
                  {primaryProperty.viewsCount || 1420}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#0C1510]/20 flex items-center justify-center text-[#0C1510]">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
              </div>
              <div>
                <span className="font-bold text-[11px] sm:text-xs text-[#0C1510] tracking-tight block leading-tight">
                  {t.hostDashboard.metrics.totalViews}
                </span>
                <span className="text-[10px] text-[#0C1510]/70 font-mono block mt-0.5">
                  {t.hostDashboard.metrics.thisMonth}
                </span>
              </div>
            </div>

            {/* 4. PAIRED QUICK-TOOL MICRO-CARD: 1-Tap Wi-Fi (1-Col on mobile, 4-col on desktop) */}
            <div 
              onClick={() => handleCopyText(primaryProperty.wifiPassword, 'Wi-Fi Password')}
              className={`col-span-1 md:col-span-4 p-3.5 sm:p-5 rounded-[22px] sm:rounded-[28px] border cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between ${
                isDarkMode ? 'bg-[#151B1F] border-stone-800 hover:border-emerald-500/50' : 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold text-emerald-500">
                  {copiedItem === 'Wi-Fi Password' ? t.common.copied : t.hostDashboard.tapToCopy}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">{t.hostDashboard.wifiPassword}</span>
                <span className="text-xs sm:text-sm font-bold font-mono truncate block text-emerald-500">
                  {primaryProperty.wifiPassword}
                </span>
              </div>
            </div>

            {/* 5. PAIRED QUICK-TOOL MICRO-CARD: Door Keypad (1-Col on mobile, 4-col on desktop) */}
            <div 
              onClick={() => handleCopyText(primaryProperty.doorKeypadCode, 'Keypad Code')}
              className={`col-span-1 md:col-span-4 p-3.5 sm:p-5 rounded-[22px] sm:rounded-[28px] border cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between ${
                isDarkMode ? 'bg-[#151B1F] border-stone-800 hover:border-amber-500/50' : 'bg-amber-50/80 border-amber-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold text-amber-500">
                  {copiedItem === 'Keypad Code' ? t.common.copied : t.hostDashboard.tapToCopy}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">{t.hostDashboard.frontDoorCode}</span>
                <span className="text-xs sm:text-sm font-bold font-mono tracking-wider truncate block text-amber-500">
                  {primaryProperty.doorKeypadCode}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 2: YOUR PROPERTIES (With 3-Way Mobile Mode Switcher) */}
      {(mobileSection === 'all' || mobileSection === 'properties') && (
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
              <div className={`flex items-center p-0.5 rounded-full border ${
                isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
              }`}>
                <button
                  onClick={() => setMobileView('cards')}
                  className={`p-1.5 rounded-full transition-all ${
                    mobileView === 'cards' 
                      ? isDarkMode ? 'bg-[#E4E98E] text-[#0C1510]' : 'bg-white text-stone-900 shadow-2xs' 
                      : 'text-stone-400'
                  }`}
                  title="Bento swipe flow"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobileView('grid')}
                  className={`p-1.5 rounded-full transition-all ${
                    mobileView === 'grid' 
                      ? isDarkMode ? 'bg-[#E4E98E] text-[#0C1510]' : 'bg-white text-stone-900 shadow-2xs' 
                      : 'text-stone-400'
                  }`}
                  title="2-Column micro-grid"
                >
                  <Grid2x2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobileView('list')}
                  className={`p-1.5 rounded-full transition-all ${
                    mobileView === 'list' 
                      ? isDarkMode ? 'bg-[#E4E98E] text-[#0C1510]' : 'bg-white text-stone-900 shadow-2xs' 
                      : 'text-stone-400'
                  }`}
                  title="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {!isFullList && properties.length > 2 && (
                <button
                  onClick={() => setCurrentRoute('/app/properties')}
                  className={`text-xs font-bold hidden sm:flex items-center gap-1 transition-colors ${
                    isDarkMode ? 'text-[#E4E98E] hover:text-white' : 'text-stone-900 hover:text-stone-700'
                  }`}
                >
                  <span>{t.hostDashboard.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* VIEW MODE 1: BENTO PEEK SWIPE CAROUSEL (Horizontal with Dots) */}
          {mobileView === 'cards' && (
            <div className="space-y-2">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-3 px-3 md:mx-0 md:px-0 pb-2">
                {properties.map((p, index) => {
                  const isGradient = index === 0;
                  const isHalo = index === 1;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setActivePropertyIndex(index)}
                      className={`w-[82vw] max-w-[320px] md:w-auto shrink-0 snap-center rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xl flex flex-col justify-between space-y-3.5 sm:space-y-5 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
                        isGradient 
                          ? 'bg-gradient-to-b from-[#A1BCD8] via-[#9AB88A] to-[#596D32] text-[#0C1510] border border-white/20'
                          : isHalo
                          ? 'bg-gradient-to-b from-[#E7E9BD] via-[#D3DFD7] to-[#8FAEC5] text-[#0C1510] border border-white/20'
                          : 'bg-[#182024] text-stone-100 border border-stone-800'
                      }`}
                    >
                      {isHalo && (
                        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#E4E98E]/30 blur-2xl pointer-events-none" />
                      )}

                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className={`font-serif text-base sm:text-xl font-bold tracking-tight leading-tight truncate ${isGradient || isHalo ? 'text-[#0C1510]' : 'text-white'}`}>
                              {p.title}
                            </h3>
                            <div className={`flex items-center gap-1.5 text-xs mt-0.5 font-medium ${isGradient || isHalo ? 'text-[#0C1510]/80' : 'text-stone-400'}`}>
                              <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                              <span className="truncate">{p.city}</span>
                              <span>·</span>
                              <span className="capitalize shrink-0">{p.type}</span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1 shrink-0 ${
                            p.status === 'published'
                              ? isGradient || isHalo ? 'bg-white/40 text-[#0C1510]' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-stone-800 text-stone-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                            <span>{p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}</span>
                          </span>
                        </div>

                        {/* Quick Essentials Chips */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className={`p-2 rounded-xl flex items-center gap-2 ${
                            isGradient || isHalo ? 'bg-white/40 text-[#0C1510]' : 'bg-stone-900/90 text-stone-200 border border-stone-800'
                          }`}>
                            <Wifi className="w-3.5 h-3.5 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase font-mono block opacity-60">Wi-Fi</span>
                              <span className="font-bold text-[11px] truncate block">{p.wifiNetwork}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl flex items-center gap-2 ${
                            isGradient || isHalo ? 'bg-white/40 text-[#0C1510]' : 'bg-stone-900/90 text-stone-200 border border-stone-800'
                          }`}>
                            <KeyRound className="w-3.5 h-3.5 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[8px] uppercase font-mono block opacity-60">{t.hostDashboard.keypadCode}</span>
                              <span className="font-mono font-bold text-[11px] truncate block">{p.doorKeypadCode}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`pt-2.5 flex items-center justify-between gap-2 border-t ${
                        isGradient || isHalo ? 'border-black/10' : 'border-stone-800'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPropertyHub(p.id, 'guide');
                            }}
                            className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 active:scale-95 ${
                              isGradient || isHalo ? 'bg-[#0C1510] text-white' : 'bg-[#E4E98E] text-[#0C1510]'
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
                            className={`px-2.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 active:scale-95 ${
                              isGradient || isHalo ? 'bg-white/40 text-[#0C1510]' : 'bg-stone-800 text-stone-200'
                            }`}
                          >
                            <span>{t.hostDashboard.live}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(p);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              isGradient || isHalo ? 'bg-white/40 text-[#0C1510]' : 'bg-stone-800 text-stone-300'
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
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              isGradient || isHalo ? 'bg-white/40 text-[#0C1510]' : 'bg-stone-800 text-stone-300'
                            }`}
                            title={t.hostDashboard.propertyHub}
                          >
                            <Layers className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Mobile Swipe Indicators */}
              <div className="flex md:hidden items-center justify-between text-[11px] text-stone-500 font-mono px-1">
                <div className="flex items-center gap-1">
                  {properties.map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-1 rounded-full transition-all ${
                        activePropertyIndex === i ? 'w-4 bg-[#E4E98E]' : 'w-1.5 bg-stone-700'
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
              {properties.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => navigateToPropertyHub(p.id, 'overview')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col justify-between ${
                    isDarkMode ? 'bg-[#151A1E] border-stone-800 text-stone-100' : 'bg-stone-50 border-stone-200 text-stone-900 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="h-20 sm:h-28 rounded-xl overflow-hidden mb-2 relative">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold ${
                        p.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-stone-900/80 text-stone-300'
                      }`}>
                        {p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-xs sm:text-sm truncate leading-snug">
                      {p.title}
                    </h4>
                    <span className="text-[10px] opacity-60 truncate block">{p.city}</span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-stone-800/40 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPropertyHub(p.id, 'guide');
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#E4E98E] text-[#0C1510]"
                    >
                      {t.common.edit}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToGuestGuide(p.slug);
                      }}
                      className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5"
                    >
                      <span>{t.hostDashboard.live}</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 3: COMPACT LIST VIEW */}
          {mobileView === 'list' && (
            <div className="space-y-2">
              {properties.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                    isDarkMode ? 'bg-[#14191C] border-stone-800 text-stone-100' : 'bg-stone-50 border-stone-200 text-stone-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-stone-700/50">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs sm:text-sm truncate block">{p.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold shrink-0 ${
                          p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {p.status === 'published' ? t.hostDashboard.live : t.hostDashboard.draft}
                        </span>
                      </div>
                      <span className={`text-[10px] truncate block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        {p.city} · Wi-Fi: <strong className="font-mono">{p.wifiNetwork}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(p)}
                      className={`p-1.5 rounded-lg border ${
                        isDarkMode ? 'bg-stone-900 border-stone-700 text-stone-300' : 'bg-white border-stone-300 text-stone-700'
                      }`}
                      title={t.common.copy}
                    >
                      {copiedSlug === p.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => navigateToPropertyHub(p.id, 'guide')}
                      className="px-2.5 py-1 rounded-lg font-bold text-xs bg-[#E4E98E] text-[#0C1510] active:scale-95"
                    >
                      {t.common.edit}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* QUICK ACTIONS BENTO FOOTER */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
        isDarkMode ? 'bg-[#121619] border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E4E98E]" />
          <span className="text-xs font-semibold">{t.hostDashboard.wantAnotherGuide}</span>
        </div>
        <button
          onClick={() => setCurrentRoute('/onboarding')}
          className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80] flex items-center gap-1 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.hostDashboard.addProperty}</span>
        </button>
      </div>

    </div>
  );
};
