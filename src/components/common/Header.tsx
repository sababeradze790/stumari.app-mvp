import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight,
  ExternalLink,
  QrCode,
  Sparkles,
  Layers,
  ChevronDown,
  Plus,
  Sun,
  Moon,
  Copy,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from './StumariLogo';
import { LanguageSelector, ThemeAndLanguageControls } from './LanguageSelector';

export const Header: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    navigateToGuestGuide, 
    navigateToPropertyHub,
    currentProperty,
    setCurrentPropertyId,
    properties,
    theme,
    toggleTheme,
    showToast,
    t,
    language
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'features' | 'properties' | 'demo' | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isMarketing = 
    currentRoute === '/' || 
    currentRoute === '/features' || 
    currentRoute === '/for-properties' || 
    currentRoute === '/pricing' || 
    currentRoute === '/demo';

  const isHost = currentRoute.startsWith('/app');
  const isAdmin = currentRoute.startsWith('/admin');
  const isOnboarding = currentRoute === '/onboarding';
  const isGuest = currentRoute === '/g/:propertySlug';
  const isDarkHeader = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 font-sans ${
      isDarkHeader ? 'bg-[#0B0F12]/95 border-b border-stone-800 text-stone-100 shadow-md' : 'bg-stone-50/95 border-b border-stone-200/90 text-stone-900 shadow-xs'
    }`}>
      
      {/* Top Demo Bar: 4 Core Stumari Products Navigation + Language Switcher */}
      <div className="bg-stone-900 text-stone-200 text-xs px-3 sm:px-4 py-1.5 font-medium flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-stone-400 uppercase tracking-widest text-[9px] sm:text-[10px] font-semibold shrink-0 mr-1">
            {t.nav.mvpBadge}:
          </span>

          {/* 1. Marketing */}
          <button
            onClick={() => setCurrentRoute('/')}
            className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 shrink-0 ${
              isMarketing 
                ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>{t.nav.marketing}</span>
          </button>

          {/* 2. Host SaaS */}
          <button
            onClick={() => setCurrentRoute('/app')}
            className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 shrink-0 ${
              isHost 
                ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>{t.nav.hostSaas}</span>
          </button>

          {/* 3. Onboarding */}
          <button
            onClick={() => setCurrentRoute('/onboarding')}
            className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 shrink-0 ${
              isOnboarding 
                ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{t.nav.onboarding}</span>
          </button>

          {/* 4. Guest Guide */}
          <button
            onClick={() => navigateToGuestGuide(currentProperty.slug)}
            className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 shrink-0 ${
              isGuest 
                ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>{t.nav.guestGuide}</span>
          </button>

          {/* 5. Admin */}
          <button
            onClick={() => setCurrentRoute('/admin')}
            className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 shrink-0 ${
              isAdmin 
                ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{t.nav.admin}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-stone-400 shrink-0 text-[11px]">
          <div className="hidden lg:flex items-center gap-1.5">
            <span>{t.nav.activeProp} <strong className={`max-w-[140px] truncate inline-block align-bottom ${isHost ? 'text-[#E4E98E]' : 'text-stone-200'}`}>{currentProperty.title}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentRoute('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs transition-colors shrink-0 ${
            isDarkHeader 
              ? 'bg-stone-900 border border-stone-800 text-[#E4E98E] group-hover:border-stone-700' 
              : 'bg-[#F5EFEB] border border-[#E7DFD5] text-stone-900 group-hover:bg-[#EFE7DE]'
          }`}>
            <StumariArchIcon size={20} className={isDarkHeader ? 'text-[#E4E98E]' : 'text-stone-900'} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-serif tracking-[0.22em] text-lg sm:text-xl font-bold uppercase leading-none transition-colors ${
                isDarkHeader ? 'text-white' : 'text-stone-900'
              }`}>
                STUMARI
              </span>
              <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md ${
                isDarkHeader ? 'bg-stone-800 text-[#E4E98E] border border-stone-700' : 'bg-amber-100 text-amber-900'
              }`}>
                MVP
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Links */}
        {isMarketing ? (
          <nav ref={navRef} className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-stone-700 relative">
            {/* 1. Features Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (activeDropdown === 'features') {
                    setCurrentRoute('/features');
                    setActiveDropdown(null);
                  } else {
                    setActiveDropdown('features');
                  }
                }}
                onMouseEnter={() => setActiveDropdown('features')}
                className={`transition-all flex items-center gap-1 px-3 py-1.5 rounded-xl ${
                  activeDropdown === 'features' || currentRoute === '/features'
                    ? 'bg-[#2DD4BF] text-[#0B151E] font-bold shadow-2xs' 
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
              >
                <span>{t.nav.features}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>

              {/* Features Dark Dropdown (Screenshot #1 Style) */}
              {activeDropdown === 'features' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-72 bg-[#0B151E] text-stone-100 rounded-2xl shadow-2xl p-2.5 border border-stone-800 animate-in fade-in zoom-in-95 z-50"
                >
                  <div className="space-y-0.5">
                    {[
                      { label: t.nav.featuresDropdown.guideGenerator, route: '/features' },
                      { label: t.nav.featuresDropdown.qrStand, route: '/features' },
                      { label: t.nav.featuresDropdown.instantWifi, route: '/features' },
                      { label: t.nav.featuresDropdown.appliances, route: '/features' },
                      { label: t.nav.featuresDropdown.houseRules, route: '/features' },
                      { label: t.nav.featuresDropdown.localSecrets, route: '/features' },
                      { label: t.nav.featuresDropdown.transport, route: '/features' },
                      { label: t.nav.featuresDropdown.multilingual, route: '/features' },
                      { label: t.nav.featuresDropdown.whatsappChat, route: '/features' },
                      { label: t.nav.featuresDropdown.reviews, route: '/features' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentRoute('/features');
                          setActiveDropdown(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl text-left hover:bg-stone-800/80 transition-colors flex items-center gap-2.5 group"
                      >
                        <span className="text-[#2DD4BF] text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                        <span className="text-xs font-semibold text-stone-200 group-hover:text-white">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. For Properties Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (activeDropdown === 'properties') {
                    setCurrentRoute('/for-properties');
                    setActiveDropdown(null);
                  } else {
                    setActiveDropdown('properties');
                  }
                }}
                onMouseEnter={() => setActiveDropdown('properties')}
                className={`transition-all flex items-center gap-1 px-3 py-1.5 rounded-xl ${
                  activeDropdown === 'properties' || currentRoute === '/for-properties'
                    ? 'bg-[#2DD4BF] text-[#0B151E] font-bold shadow-2xs' 
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
              >
                <span>{t.nav.forProperties}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'properties' ? 'rotate-180' : ''}`} />
              </button>

              {/* Properties Dropdown */}
              {activeDropdown === 'properties' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-64 bg-[#0B151E] text-stone-100 rounded-2xl shadow-2xl p-2.5 border border-stone-800 animate-in fade-in zoom-in-95 z-50"
                >
                  <div className="space-y-0.5">
                    {[
                      { label: t.nav.propertiesDropdown.apartments },
                      { label: t.nav.propertiesDropdown.guesthouses },
                      { label: t.nav.propertiesDropdown.boutiqueHotels },
                      { label: t.nav.propertiesDropdown.propertyManagers }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentRoute('/for-properties');
                          setActiveDropdown(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-stone-800/80 transition-colors flex items-center gap-2.5 group"
                      >
                        <span className="text-[#2DD4BF] text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                        <span className="text-xs font-semibold text-stone-200 group-hover:text-white">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Pricing */}
            <button 
              onClick={() => {
                setCurrentRoute('/pricing');
                setActiveDropdown(null);
              }}
              onMouseEnter={() => setActiveDropdown(null)}
              className={`transition-all px-3.5 py-1.5 rounded-xl ${
                currentRoute === '/pricing' 
                  ? 'bg-stone-200 text-stone-950 font-bold' 
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
              }`}
            >
              <span>{t.nav.pricing}</span>
            </button>

            {/* 4. Demo Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (activeDropdown === 'demo') {
                    setCurrentRoute('/demo');
                    setActiveDropdown(null);
                  } else {
                    setActiveDropdown('demo');
                  }
                }}
                onMouseEnter={() => setActiveDropdown('demo')}
                className={`transition-all flex items-center gap-1 px-3 py-1.5 rounded-xl ${
                  activeDropdown === 'demo' || currentRoute === '/demo'
                    ? 'bg-[#2DD4BF] text-[#0B151E] font-bold shadow-2xs' 
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
              >
                <span>{t.nav.demo}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'demo' ? 'rotate-180' : ''}`} />
              </button>

              {/* Demo Dropdown */}
              {activeDropdown === 'demo' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-72 bg-[#0B151E] text-stone-100 rounded-2xl shadow-2xl p-2.5 border border-stone-800 animate-in fade-in zoom-in-95 z-50"
                >
                  <div className="space-y-0.5">
                    {properties.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigateToGuestGuide(p.slug);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-stone-800/80 transition-colors flex items-center gap-2.5 group"
                      >
                        <span className="text-[#2DD4BF] text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                        <div>
                          <span className="text-xs font-semibold text-stone-200 group-hover:text-white block">{p.title}</span>
                          <span className="text-[10px] text-stone-400">{p.city}, {p.country}</span>
                        </div>
                      </button>
                    ))}
                    <div className="pt-1.5 mt-1 border-t border-stone-800">
                      <button
                        onClick={() => {
                          setCurrentRoute('/demo');
                          setActiveDropdown(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center justify-between"
                      >
                        <span>{t.common.preview}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        ) : isHost ? (
          <nav className={`hidden lg:flex items-center gap-1.5 text-xs font-semibold ${isDarkHeader ? 'text-stone-400' : 'text-stone-600'}`}>
            <button 
              onClick={() => setCurrentRoute('/app')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentRoute === '/app' 
                  ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510] font-bold shadow-xs' : 'bg-stone-900 text-white font-bold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-stone-800/60' : 'hover:text-stone-950 hover:bg-stone-200/80'
              }`}
            >
              {t.nav.dashboard}
            </button>
            <button 
              onClick={() => setCurrentRoute('/app/properties')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentRoute === '/app/properties' 
                  ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510] font-bold shadow-xs' : 'bg-stone-900 text-white font-bold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-stone-800/60' : 'hover:text-stone-950 hover:bg-stone-200/80'
              }`}
            >
              {t.nav.myProperties}
            </button>
            <button 
              onClick={() => navigateToPropertyHub(currentProperty.id, 'overview')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentRoute === '/app/properties/:id' 
                  ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510] font-bold shadow-xs' : 'bg-stone-900 text-white font-bold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-stone-800/60' : 'hover:text-stone-950 hover:bg-stone-200/80'
              }`}
            >
              {t.nav.propertyHub}
            </button>
            <button 
              onClick={() => navigateToGuestGuide(currentProperty.slug)}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                isDarkHeader ? 'hover:text-white hover:bg-stone-800/60 text-stone-300' : 'hover:text-stone-950 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-[#E4E98E]' : 'text-amber-600'}`} />
              <span>{t.nav.guestView}</span>
            </button>
          </nav>
        ) : (
          <div className="hidden xl:flex items-center gap-3 text-xs text-stone-500">
            <span>{language === 'ka' ? 'Stumari ციფრული მასპინძლობის გიდი' : language === 'ru' ? 'Stumari Цифровой путеводитель гостя' : 'Stumari Hospitality Guide'}</span>
          </div>
        )}

        {/* Right Actions & CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Action CTAs (Marketing / Host) */}
          {isMarketing ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setCurrentRoute('/app')}
                className={`hidden xl:inline-flex text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                  isDarkHeader ? 'text-stone-300 hover:text-white hover:bg-stone-800' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {t.nav.hostLogin}
              </button>
              <button
                onClick={() => setCurrentRoute('/demo')}
                className={`hidden md:inline-flex px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors ${
                  isDarkHeader ? 'text-stone-200 bg-stone-900 hover:bg-stone-800 border-stone-750' : 'text-stone-800 bg-white hover:bg-stone-100 border-stone-300'
                }`}
              >
                {t.nav.bookDemo}
              </button>
              <button
                onClick={() => setCurrentRoute('/onboarding')}
                className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  isDarkHeader ? 'text-[#0C1510] bg-[#E4E98E] hover:bg-[#d8dd80]' : 'text-white bg-stone-900 hover:bg-stone-800'
                }`}
              >
                <span>{t.nav.createStumari}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : isHost ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigateToGuestGuide(currentProperty.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-colors flex items-center gap-1.5 ${
                  isDarkHeader 
                    ? 'text-stone-300 bg-stone-900 border-stone-800 hover:bg-stone-850' 
                    : 'text-stone-700 bg-white border-stone-300 hover:bg-stone-100'
                }`}
              >
                <QrCode className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-[#E4E98E]' : 'text-amber-600'}`} />
                <span>{t.nav.guestUrl}</span>
              </button>
              <button
                onClick={() => setCurrentRoute('/onboarding')}
                className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-1 active:scale-95 ${
                  isDarkHeader 
                    ? 'text-[#0C1510] bg-[#E4E98E] hover:bg-[#d8dd80]' 
                    : 'text-white bg-stone-900 hover:bg-stone-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.nav.addProperty}</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center">
              <button
                onClick={() => setCurrentRoute('/app')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors ${
                  isDarkHeader ? 'text-[#0C1510] bg-[#E4E98E] hover:bg-[#d8dd80]' : 'text-white bg-stone-900 hover:bg-stone-800'
                }`}
              >
                {t.nav.hostSaas}
              </button>
            </div>
          )}

          {/* Theme & Language Controls Pair Placed Right on the Main Navbar */}
          <ThemeAndLanguageControls />

          {/* Mobile / Tablet menu toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isDarkHeader ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-950'}`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET HOST SAAS TOP BAR MENU (Prominent, Touch-Optimized Page Switcher for Phone/Tablet) */}
      {isHost && (
        <div className={`lg:hidden px-3 py-2 border-t flex items-center justify-between gap-1 overflow-x-auto no-scrollbar transition-colors ${
          isDarkHeader 
            ? 'bg-[#0B0F12] border-stone-800 text-stone-200' 
            : 'bg-stone-100/95 border-stone-200 text-stone-800'
        }`}>
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-stone-500 mr-0.5">
              Host:
            </span>
            <button
              onClick={() => setCurrentRoute('/app')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${
                currentRoute === '/app' 
                  ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510]' : 'bg-stone-900 text-white'
                  : isDarkHeader ? 'bg-stone-900/90 text-stone-300 border border-stone-800' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.nav.dashboard}</span>
            </button>

            <button
              onClick={() => setCurrentRoute('/app/properties')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${
                currentRoute === '/app/properties' 
                  ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510]' : 'bg-stone-900 text-white'
                  : isDarkHeader ? 'bg-stone-900/90 text-stone-300 border border-stone-800' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.nav.myProperties} ({properties.length})</span>
            </button>

            <button
              onClick={() => navigateToPropertyHub(currentProperty.id, 'overview')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${
                currentRoute === '/app/properties/:id' 
                  ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510]' : 'bg-stone-900 text-white'
                  : isDarkHeader ? 'bg-stone-900/90 text-stone-300 border border-stone-800' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.nav.propertyHub}</span>
            </button>

            <button
              onClick={() => navigateToGuestGuide(currentProperty.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${
                isDarkHeader 
                  ? 'bg-stone-900/90 text-[#E4E98E] border border-stone-800' 
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.nav.guestView}</span>
            </button>
          </div>

          <button
            onClick={() => setCurrentRoute('/onboarding')}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80] shrink-0 flex items-center gap-1 shadow-sm active:scale-95 ml-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ka' ? 'დამატება' : language === 'ru' ? 'Добавить' : 'Add'}</span>
          </button>
        </div>
      )}

      {/* Mobile & Tablet Drawer (Theme-Adaptive & Context-Aware Command Overlay) */}
      {mobileMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 z-50 border-b px-4 pt-3.5 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 transition-colors shadow-2xl max-h-[82vh] overflow-y-auto ${
          isDarkHeader 
            ? 'bg-[#0B0F12]/98 border-stone-800 text-stone-100' 
            : 'bg-white/98 border-stone-200 text-stone-900'
        }`}>
          {/* Unified Theme & Language Controls Pair */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              {language === 'ka' ? 'თემა და ენა' : language === 'ru' ? 'Тема и язык' : 'Theme & Language'}:
            </span>
            <ThemeAndLanguageControls />
          </div>

          {isHost ? (
            /* Host Specific Mobile Navigation & Command Center */
            <div className="space-y-3.5">
              {/* Top Drawer Header with Dismiss Button */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {t.nav.hostSaas}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-stone-100 dark:bg-stone-850 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.common.close}</span>
                </button>
              </div>

              {/* Active Property Card & 1-Tap Switcher */}
              <div className={`p-3.5 rounded-2xl border transition-colors ${
                isDarkHeader ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider block ${isDarkHeader ? 'text-[#E4E98E]' : 'text-amber-800'}`}>
                      {t.nav.activeProp} ({properties.length})
                    </span>
                    <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 truncate block">
                      {currentProperty.title}
                    </span>
                    <span className={`text-xs block ${isDarkHeader ? 'text-stone-400' : 'text-stone-500'}`}>
                      {currentProperty.city}, {currentProperty.country}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const guestUrl = `${window.location.origin}/#/g/${currentProperty.slug}`;
                      navigator.clipboard.writeText(guestUrl);
                      showToast(t.common.copied);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs shrink-0 active:scale-95 ${
                      isDarkHeader 
                        ? 'bg-stone-900 border-stone-700 text-[#E4E98E] hover:bg-stone-850' 
                        : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.common.copy}</span>
                  </button>
                </div>

                {/* Switch Active Property Carousel */}
                <div className="pt-2 border-t border-stone-200/70 dark:border-stone-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
                    {t.nav.myProperties}:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {properties.map((p) => {
                      const isSelected = p.id === currentProperty.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setCurrentPropertyId(p.id);
                            showToast(`${p.title}`);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all border ${
                            isSelected
                              ? isDarkHeader 
                                ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E] font-bold shadow-xs' 
                                : 'bg-stone-900 text-white border-stone-900 font-bold shadow-xs'
                              : isDarkHeader
                                ? 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-800'
                                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {p.title.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2x2 Quick Action Bento Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigateToGuestGuide(currentProperty.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                    isDarkHeader 
                      ? 'bg-stone-900/90 border-stone-800 text-stone-200 hover:border-stone-700' 
                      : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Smartphone className="w-4 h-4 text-[#E4E98E]" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="font-bold text-xs">{t.nav.guestView}</div>
                  <div className="text-[10px] text-stone-500">{t.common.preview}</div>
                </button>

                <button
                  onClick={() => {
                    navigateToPropertyHub(currentProperty.id, 'qr');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                    isDarkHeader 
                      ? 'bg-stone-900/90 border-stone-800 text-stone-200 hover:border-stone-700' 
                      : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <QrCode className="w-4 h-4 text-[#2DD4BF]" />
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="font-bold text-xs">{t.propertyHub.tabs.qr}</div>
                  <div className="text-[10px] text-stone-500">QR / NFC</div>
                </button>
              </div>

              {/* Host Navigation Buttons (Structured Grid) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-0.5 block">
                  {t.nav.hostSaas}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentRoute('/app');
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                      currentRoute === '/app' 
                        ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E]' : 'bg-stone-900 text-white border-stone-900'
                        : isDarkHeader ? 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-850' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{t.nav.dashboard}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRoute('/app/properties');
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                      currentRoute === '/app/properties' 
                        ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E]' : 'bg-stone-900 text-white border-stone-900'
                        : isDarkHeader ? 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-850' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{t.nav.myProperties} ({properties.length})</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigateToPropertyHub(currentProperty.id, 'overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                    currentRoute === '/app/properties/:id' 
                      ? isDarkHeader ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E]' : 'bg-stone-900 text-white border-stone-900'
                      : isDarkHeader ? 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-850' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#E4E98E]" />
                    <span>{t.nav.propertyHub}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800/80 space-y-2">
                <button
                  onClick={() => {
                    setCurrentRoute('/onboarding');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E4E98E] text-[#0C1510] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.nav.addProperty}</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    onClick={() => {
                      setCurrentRoute('/');
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 rounded-xl text-center text-xs font-semibold border transition-colors ${
                      isDarkHeader ? 'border-stone-800 hover:bg-stone-850 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {t.nav.marketing}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentRoute('/admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 rounded-xl text-center text-xs font-semibold border transition-colors ${
                      isDarkHeader ? 'border-stone-800 hover:bg-stone-850 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {t.nav.admin}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Marketing & Default Navigation */
            <div className="flex flex-col space-y-2 text-sm font-semibold">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                  {language === 'ka' ? 'ნავიგაცია' : language === 'ru' ? 'Навигация' : 'Navigation'}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setCurrentRoute('/');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-xl transition-colors ${isDarkHeader ? 'hover:bg-stone-850 text-stone-200' : 'hover:bg-stone-100 text-stone-800'}`}
              >
                {t.nav.marketing}
              </button>
              <button
                onClick={() => {
                  setCurrentRoute('/features');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-xl transition-colors ${isDarkHeader ? 'hover:bg-stone-850 text-stone-200' : 'hover:bg-stone-100 text-stone-800'}`}
              >
                {t.nav.features}
              </button>
              <button
                onClick={() => {
                  setCurrentRoute('/for-properties');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-xl transition-colors ${isDarkHeader ? 'hover:bg-stone-850 text-stone-200' : 'hover:bg-stone-100 text-stone-800'}`}
              >
                {t.nav.forProperties}
              </button>
              <button
                onClick={() => {
                  setCurrentRoute('/pricing');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-xl transition-colors ${isDarkHeader ? 'hover:bg-stone-850 text-stone-200' : 'hover:bg-stone-100 text-stone-800'}`}
              >
                {t.nav.pricing}
              </button>
              <button
                onClick={() => {
                  setCurrentRoute('/demo');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-xl transition-colors ${isDarkHeader ? 'hover:bg-stone-850 text-stone-200' : 'hover:bg-stone-100 text-stone-800'}`}
              >
                {t.nav.demo}
              </button>

              <div className={`pt-3 border-t flex flex-col gap-2 ${isDarkHeader ? 'border-stone-800' : 'border-stone-200'}`}>
                <button
                  onClick={() => {
                    setCurrentRoute('/app');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-center py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    isDarkHeader ? 'bg-stone-800 hover:bg-stone-750 text-white' : 'bg-stone-900 hover:bg-stone-850 text-white'
                  }`}
                >
                  {t.nav.dashboard}
                </button>
                <button
                  onClick={() => {
                    setCurrentRoute('/onboarding');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-[#E4E98E] text-[#0C1510] font-bold text-xs hover:bg-[#d8dd80] transition-colors"
                >
                  {t.nav.createStumari}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dimmed Backdrop Click-Away Dismissal */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-[110px] bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-150"
        />
      )}
    </header>
  );
};
