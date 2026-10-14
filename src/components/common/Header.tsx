import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowUpRight,
  LogOut,
  TrendingUp,
  User as UserIcon,
  MessageSquareHeart
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
    language,
    firebaseUser,
    openAuthModal,
    signOutHost,
    currentUser
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
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 font-sans tracking-tight ${
      isDarkHeader ? 'bg-[#141312]/95 border-b border-[#2B2926] text-[#F7F5F0] shadow-sm' : 'bg-[#FAF8F5]/95 border-b border-[#EBE6DF] text-[#1C1B1A] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* Top Demo Bar: 4 Core Stumari Products Navigation + Language Switcher */}
      <div className={`text-xs px-3 sm:px-4 py-1.5 font-medium flex items-center justify-between border-b ${
        isDarkHeader ? 'bg-[#1C1B19] text-[#ACA79F] border-[#2B2926]' : 'bg-[#F3EFE9] text-[#5C5853] border-[#EBE6DF]'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className={`uppercase tracking-wider text-[9px] sm:text-[10px] font-semibold shrink-0 mr-1 ${
            isDarkHeader ? 'text-[#78736A]' : 'text-[#8A857D]'
          }`}>
            {t.nav.mvpBadge}:
          </span>

          {/* 1. Marketing */}
          <button
            onClick={() => setCurrentRoute('/')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 shrink-0 ${
              isMarketing 
                ? 'bg-[#F55A51] text-white font-semibold shadow-xs' 
                : isDarkHeader ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#EAE4DC]'
            }`}
          >
            <span>{t.nav.marketing}</span>
          </button>

          {/* 2. Host SaaS */}
          <button
            onClick={() => setCurrentRoute('/app')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 shrink-0 ${
              isHost 
                ? 'bg-[#F55A51] text-white font-semibold shadow-xs' 
                : isDarkHeader ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#EAE4DC]'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>{t.nav.hostSaas}</span>
          </button>

          {/* 3. Onboarding */}
          <button
            onClick={() => setCurrentRoute('/onboarding')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 shrink-0 ${
              isOnboarding 
                ? 'bg-[#F55A51] text-white font-semibold shadow-xs' 
                : isDarkHeader ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#EAE4DC]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{t.nav.onboarding}</span>
          </button>

          {/* 4. Guest Guide */}
          <button
            onClick={() => navigateToGuestGuide(currentProperty.slug)}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 shrink-0 ${
              isGuest 
                ? 'bg-[#F55A51] text-white font-semibold shadow-xs' 
                : isDarkHeader ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#EAE4DC]'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>{t.nav.guestGuide}</span>
          </button>

          {/* 5. Admin */}
          <button
            onClick={() => setCurrentRoute('/admin')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1 shrink-0 ${
              isAdmin 
                ? 'bg-[#F55A51] text-white font-semibold shadow-xs' 
                : isDarkHeader ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#272522]' : 'text-[#5C5853] hover:text-[#1C1B1A] hover:bg-[#EAE4DC]'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{t.nav.admin}</span>
          </button>
        </div>

        <div className={`flex items-center gap-2 shrink-0 text-[11px] ${isDarkHeader ? 'text-[#ACA79F]' : 'text-[#5C5853]'}`}>
          <div className="hidden lg:flex items-center gap-1.5">
            <span>{t.nav.activeProp} <strong className={`max-w-[140px] truncate inline-block align-bottom font-semibold ${isHost ? (isDarkHeader ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]') : (isDarkHeader ? 'text-[#ACA79F]' : 'text-[#5C5853]')}`}>{currentProperty.title}</strong></span>
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
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-colors shrink-0 ${
            isDarkHeader 
              ? 'bg-[#F55A51]/15 border border-[#F55A51]/30 text-[#F55A51] group-hover:border-[#F55A51]' 
              : 'bg-[#FDF1F0] border border-[#F55A51]/25 text-[#F55A51] group-hover:bg-[#FCE3E1]'
          }`}>
            <StumariArchIcon size={18} className="text-[#F55A51]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`tracking-[0.16em] text-lg font-bold font-serif uppercase leading-none transition-colors ${
                isDarkHeader ? 'text-[#F7F5F0]' : 'text-[#1C1B1A]'
              }`}>
                STUMARI
              </span>
              <span className={`text-[10px] font-sans uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md ${
                isDarkHeader ? 'bg-[#748C96]/15 text-[#9CB1BB] border border-[#748C96]/30' : 'bg-[#F0F4F6] text-[#607680] border border-[#748C96]/25'
              }`}>
                Hospitality
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Links */}
        {isMarketing ? (
          <nav ref={navRef} className={`hidden lg:flex items-center gap-1.5 text-sm font-semibold relative ${
            isDarkHeader ? 'text-stone-200' : 'text-stone-800'
          }`}>
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
                    ? isDarkHeader 
                      ? 'bg-zinc-850 text-zinc-100 font-semibold shadow-xs border border-zinc-750' 
                      : 'bg-zinc-900 text-zinc-100 font-semibold shadow-xs'
                    : isDarkHeader 
                      ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/80' 
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <span>{t.nav.features}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>

              {/* Features Dark Dropdown */}
              {activeDropdown === 'features' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-xl p-2 border animate-in fade-in zoom-in-95 z-50 ${
                    isDarkHeader 
                      ? 'bg-zinc-900 text-zinc-100 border-zinc-800' 
                      : 'bg-white text-zinc-900 border-zinc-200'
                  }`}
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
                        className={`w-full px-3 py-1.5 rounded-lg text-left transition-colors flex items-center gap-2.5 group cursor-pointer ${
                          isDarkHeader 
                            ? 'hover:bg-zinc-800 text-zinc-300 hover:text-white' 
                            : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900'
                        }`}
                      >
                        <span className="text-zinc-400 text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                        <span className="text-xs font-medium">{item.label}</span>
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
                    ? isDarkHeader 
                      ? 'bg-zinc-850 text-zinc-100 font-semibold shadow-xs border border-zinc-750' 
                      : 'bg-zinc-900 text-zinc-100 font-semibold shadow-xs'
                    : isDarkHeader 
                      ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/80' 
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <span>{t.nav.forProperties}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'properties' ? 'rotate-180' : ''}`} />
              </button>

              {/* Properties Dropdown */}
              {activeDropdown === 'properties' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl p-2 border animate-in fade-in zoom-in-95 z-50 ${
                    isDarkHeader 
                      ? 'bg-zinc-900 text-zinc-100 border-zinc-800' 
                      : 'bg-white text-zinc-900 border-zinc-200'
                  }`}
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
                        className={`w-full px-3 py-2 rounded-lg text-left transition-colors flex items-center gap-2.5 group cursor-pointer ${
                          isDarkHeader 
                            ? 'hover:bg-zinc-800 text-zinc-300 hover:text-white' 
                            : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900'
                        }`}
                      >
                        <span className="text-zinc-400 text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                        <span className="text-xs font-medium">{item.label}</span>
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
              className={`transition-all px-3.5 py-1.5 rounded-xl cursor-pointer ${
                currentRoute === '/pricing' 
                  ? isDarkHeader 
                    ? 'bg-zinc-850 text-zinc-100 font-semibold shadow-xs border border-zinc-750' 
                    : 'bg-zinc-900 text-zinc-100 font-semibold shadow-xs'
                  : isDarkHeader 
                    ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/80' 
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
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
                className={`transition-all flex items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer ${
                  activeDropdown === 'demo' || currentRoute === '/demo'
                    ? isDarkHeader 
                      ? 'bg-zinc-850 text-zinc-100 font-semibold shadow-xs border border-zinc-750' 
                      : 'bg-zinc-900 text-zinc-100 font-semibold shadow-xs'
                    : isDarkHeader 
                      ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/80' 
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <span>{t.nav.demo}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'demo' ? 'rotate-180' : ''}`} />
              </button>

              {/* Demo Dropdown */}
              {activeDropdown === 'demo' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-72 bg-zinc-900 text-zinc-100 rounded-xl shadow-xl p-2 border border-zinc-800 animate-in fade-in zoom-in-95 z-50"
                >
                  <div className="space-y-0.5">
                    {properties.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigateToGuestGuide(p.slug);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-3 py-2 rounded-lg text-left hover:bg-zinc-800 transition-colors flex items-center gap-2.5 group cursor-pointer"
                      >
                        <span className="text-zinc-400 text-[10px] group-hover:translate-x-0.5 transition-transform">▶</span>
                        <div>
                          <span className="text-xs font-semibold text-zinc-200 group-hover:text-white block">{p.title}</span>
                          <span className="text-[10px] text-zinc-400">{p.city}, {p.country}</span>
                        </div>
                      </button>
                    ))}
                    <div className="pt-1.5 mt-1 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setCurrentRoute('/demo');
                          setActiveDropdown(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-semibold text-zinc-200 hover:text-white flex items-center justify-between cursor-pointer"
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
          <nav className={`hidden lg:flex items-center gap-1.5 text-xs font-medium ${isDarkHeader ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <button 
              onClick={() => setCurrentRoute('/app')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentRoute === '/app' 
                  ? isDarkHeader ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750' : 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-zinc-800/60' : 'hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {t.nav.dashboard}
            </button>
            <button 
              onClick={() => setCurrentRoute('/app/analytics')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRoute === '/app/analytics' 
                  ? isDarkHeader ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750' : 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-zinc-800/60' : 'hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'ka' ? 'ანალიტიკა' : language === 'ru' ? 'Аналитика' : 'Analytics'}</span>
            </button>
            <button 
              onClick={() => setCurrentRoute('/app/properties')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentRoute === '/app/properties' 
                  ? isDarkHeader ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750' : 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-zinc-800/60' : 'hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {t.nav.myProperties}
            </button>
            <button 
              onClick={() => setCurrentRoute('/app/reviews')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRoute === '/app/reviews' 
                  ? isDarkHeader ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750' : 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-zinc-800/60' : 'hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>{language === 'ka' ? 'შეფასებები' : language === 'ru' ? 'Отзывы' : 'Reviews'}</span>
            </button>
            <button 
              onClick={() => navigateToPropertyHub(currentProperty.id, 'overview')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentRoute === '/app/properties/:id' 
                  ? isDarkHeader ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750' : 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : isDarkHeader ? 'hover:text-white hover:bg-zinc-800/60' : 'hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {t.nav.propertyHub}
            </button>
            <button 
              onClick={() => navigateToGuestGuide(currentProperty.slug)}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isDarkHeader ? 'hover:text-white hover:bg-zinc-800/60 text-zinc-300' : 'hover:text-zinc-950 hover:bg-zinc-100 text-zinc-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
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
              {firebaseUser ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentRoute('/app')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                      isDarkHeader ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 hover:border-zinc-700' : 'bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="max-w-[110px] truncate">{currentUser.name}</span>
                  </button>
                  <button
                    onClick={signOutHost}
                    title="Sign Out"
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className={`hidden xl:inline-flex text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    isDarkHeader ? 'text-zinc-300 hover:text-white hover:bg-zinc-850' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  {t.nav.hostLogin}
                </button>
              )}
              <button
                onClick={() => setCurrentRoute('/demo')}
                className={`hidden md:inline-flex px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer shadow-xs ${
                  isDarkHeader ? 'text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border-zinc-800' : 'text-zinc-800 bg-white hover:bg-zinc-50 border-zinc-200'
                }`}
              >
                {t.nav.bookDemo}
              </button>
              <button
                onClick={() => {
                  if (!firebaseUser) {
                    openAuthModal('signup');
                  } else {
                    setCurrentRoute('/onboarding');
                  }
                }}
                className="px-4 py-2 text-xs font-bold rounded-full shadow-md shadow-[#F55A51]/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer bg-[#F55A51] hover:bg-[#e04a41] text-white active:scale-95"
              >
                <span>{t.nav.createStumari}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : isHost ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigateToGuestGuide(currentProperty.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isDarkHeader 
                    ? 'text-zinc-200 bg-zinc-900 border-zinc-800 hover:bg-zinc-850' 
                    : 'text-zinc-700 bg-white border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.nav.guestUrl}</span>
              </button>
              <button
                onClick={() => setCurrentRoute('/onboarding')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
                  isDarkHeader 
                    ? 'text-zinc-950 bg-zinc-100 hover:bg-white' 
                    : 'text-zinc-100 bg-zinc-900 hover:bg-zinc-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.nav.addProperty}</span>
              </button>
              <button
                onClick={signOutHost}
                title="Sign Out of Host Account"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center">
              <button
                onClick={() => setCurrentRoute('/app')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer bg-[#F55A51] hover:bg-[#E04840] text-white"
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

      {/* Mobile & Tablet Drawer (Theme-Adaptive & Context-Aware Command Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`lg:hidden absolute top-full left-0 right-0 z-50 border-b px-4 pt-3.5 pb-6 space-y-4 transition-colors shadow-2xl max-h-[82vh] overflow-y-auto ${
              isDarkHeader 
                ? 'bg-[#0B0F12]/98 border-stone-800 text-stone-100' 
                : 'bg-white/98 border-stone-200 text-stone-900'
            }`}
          >
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
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider block ${isDarkHeader ? 'text-amber-400' : 'text-amber-700'}`}>
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
                        ? 'bg-stone-900 border-stone-700 text-amber-400 hover:bg-stone-850' 
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
                              ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' 
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
                    <Smartphone className="w-4 h-4 text-amber-500" />
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
                    <QrCode className="w-4 h-4 text-amber-500" />
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="font-bold text-xs">{t.propertyHub.tabs.qr}</div>
                  <div className="text-[10px] text-stone-500">QR / NFC</div>
                </button>
              </div>

              {/* Direct Host Shortcuts & Global Hub */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    navigateToGuestGuide(currentProperty.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                    isDarkHeader 
                      ? 'bg-stone-900/90 border-stone-800 text-stone-200 hover:border-stone-700' 
                      : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-100 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="font-bold text-xs">{t.nav.guestView}</div>
                  <div className="text-[10px] text-stone-500">{t.common.preview}</div>
                </button>

                <button
                  onClick={() => {
                    navigateToPropertyHub(currentProperty.id, 'overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                    isDarkHeader 
                      ? 'bg-stone-900/90 border-stone-800 text-stone-200 hover:border-stone-700' 
                      : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-100 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="font-bold text-xs">{t.nav.propertyHub}</div>
                  <div className="text-[10px] text-stone-500">Edit Guide</div>
                </button>
              </div>

              {/* On-Page Navigation Context Notice */}
              <div className={`p-2.5 rounded-xl text-xs border flex items-center justify-between gap-2 ${
                isDarkHeader ? 'bg-stone-900/50 border-stone-800 text-stone-400' : 'bg-stone-100/80 border-stone-200 text-stone-600'
              }`}>
                <span className="text-[11px] font-medium">
                  {language === 'ka' 
                    ? '💡 ჩანართები (მიმოხილვა, ანალიტიკა, საკუთრებები) გვერდზეა' 
                    : language === 'ru' 
                    ? '💡 Вкладки (Обзор, Аналитика, Объекты) доступны на странице' 
                    : '💡 Dashboard tabs (Overview, Analytics, Properties) are on the page'}
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                    isDarkHeader ? 'bg-stone-800 text-amber-400' : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
                  }`}
                >
                  OK
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800/80 space-y-2">
                <button
                  onClick={() => {
                    setCurrentRoute('/onboarding');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
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
                {firebaseUser ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentRoute('/app');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 text-center py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                        isDarkHeader ? 'bg-stone-800 hover:bg-stone-750 text-white' : 'bg-stone-900 hover:bg-stone-850 text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t.nav.dashboard} ({currentUser.name})</span>
                    </button>
                    <button
                      onClick={() => {
                        signOutHost();
                        setMobileMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-center py-2.5 rounded-xl font-bold text-xs transition-colors border ${
                      isDarkHeader ? 'border-stone-700 bg-stone-850 hover:bg-stone-800 text-stone-200' : 'border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    {t.nav.hostLogin}
                  </button>
                )}

                <button
                  onClick={() => {
                    if (!firebaseUser) {
                      openAuthModal('signup');
                    } else {
                      setCurrentRoute('/onboarding');
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-sm transition-colors"
                >
                  {t.nav.createStumari}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Dimmed Backdrop Click-Away Dismissal */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-[110px] bg-black/40 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
        />
      )}
      </AnimatePresence>
    </header>
  );
};
