import React, { useState } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Wifi, 
  KeyRound, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Layers, 
  MessageCircle, 
  ExternalLink,
  Copy,
  Check,
  Zap,
  Sparkles,
  Compass,
  FileText,
  Heart,
  ChevronRight,
  Shield,
  ArrowUpRight,
  Radio,
  Coffee,
  Sun,
  Moon,
  Utensils,
  ShoppingBag,
  Car,
  Trash2,
  CheckSquare,
  MapPin,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from '../common/StumariLogo';
import { MARKETING_I18N } from '../../data/marketingI18n';
import { 
  CheckinArtSketch, 
  AppliancesArtSketch, 
  HouseRulesArtSketch, 
  DepartureArtSketch, 
  GroceryMarketSketch, 
  TaxiSedanSketch, 
  RecyclingBinsSketch, 
  TbilisiPanoramaSketch, 
  TbilisiBalconySketch, 
  TbilisiTowerSketch, 
  KhinkaliSketch, 
  WineGlassSketch, 
  BinocularsSketch 
} from '../guest/GuestGuideIllustrations';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, navigateToGuestGuide, currentProperty, theme, showToast, t, language } = useApp();
  const isDark = theme === 'dark';

  const [activePropertyType, setActivePropertyType] = useState<'apartment' | 'villa' | 'hotel' | 'guesthouse'>('apartment');
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedKeypad, setCopiedKeypad] = useState(false);
  const [mobileBentoFilter, setMobileBentoFilter] = useState<'all' | 'demo' | 'automation' | 'proof'>('all');

  const content = MARKETING_I18N[language]?.landingPage || MARKETING_I18N.en.landingPage;

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('TbilisiGuest_5G');
    setCopiedWifi(true);
    showToast(t.common.copied);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleCopyKeypad = () => {
    navigator.clipboard.writeText('4820#');
    setCopiedKeypad(true);
    showToast(t.common.copied);
    setTimeout(() => setCopiedKeypad(false), 2000);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#080B0D] text-stone-100' : 'bg-stone-50 text-stone-900'
    }`}>
      
      {/* 1. HERO BENTO SECTION */}
      <section className="pt-8 sm:pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Kicker & Editorial Header */}
        <div className="max-w-3xl mb-8 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold transition-colors ${
            isDark 
              ? 'bg-[#E4E98E]/15 text-[#E4E98E] border border-[#E4E98E]/30' 
              : 'bg-stone-900 text-white'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4E98E] animate-pulse" />
            <span>{content.hero.badge}</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.08] ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            {content.hero.titlePart1} <br className="hidden sm:inline" />
            <span className={isDark ? 'text-[#E4E98E]' : 'text-stone-700'}>{content.hero.titleHighlight}</span> {content.hero.titlePart2}
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            {content.hero.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentRoute('/onboarding')}
              className={`px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                isDark 
                  ? 'bg-[#E4E98E] hover:bg-[#d9de7d] text-[#0C1510]' 
                  : 'bg-stone-950 hover:bg-stone-850 text-white'
              }`}
            >
              <span>{content.hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentRoute('/demo')}
              className={`px-5 py-3.5 rounded-full font-semibold text-sm border transition-all flex items-center gap-2 ${
                isDark 
                  ? 'bg-stone-900/80 hover:bg-stone-850 text-stone-200 border-stone-800' 
                  : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-2xs'
              }`}
            >
              <span>{content.hero.secondaryCta}</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </button>

            <div className={`flex items-center gap-4 text-xs ml-0 sm:ml-2 mt-2 sm:mt-0 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{content.hero.trustText}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Bento Category Filter Pills */}
        <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'all', label: content.hero.filters.all },
            { id: 'demo', label: content.hero.filters.demo },
            { id: 'automation', label: content.hero.filters.automation },
            { id: 'proof', label: content.hero.filters.proof }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setMobileBentoFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                mobileBentoFilter === f.id
                  ? isDark ? 'bg-[#E4E98E] text-[#0C1510] shadow-xs' : 'bg-stone-900 text-white shadow-xs'
                  : isDark ? 'bg-stone-900 text-stone-400 border border-stone-800' : 'bg-stone-100 text-stone-600 border border-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 2. DIVERSE SIZED CARDS BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 sm:gap-5">
          
          {/* Bento Card 1 (WIDE HERO): Live Interactive Guide Phone Mockup - CSS selector 2 */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'demo') && (
            <div className={`col-span-1 sm:col-span-2 md:col-span-8 p-4 sm:p-5 md:p-6 rounded-[28px] sm:rounded-[36px] border transition-all relative overflow-hidden flex flex-col justify-between md:h-[490px] ${
              isDark 
                ? 'bg-[#0C1013] border-stone-800/80 shadow-2xl text-stone-100' 
                : 'bg-white border-stone-200/90 shadow-xl text-stone-900'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4 mb-2.5 sm:mb-3 z-10 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-[#E4E98E]/30 text-[#1C2618] border border-[#E4E98E]/50'
                    }`}>
                      {content.phoneMockup.previewBadge}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {content.phoneMockup.interactiveBadge}
                    </span>
                  </div>
                  <h3 className={`text-lg sm:text-2xl font-serif font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {content.phoneMockup.heading}
                  </h3>
                  <p className={`text-[11px] sm:text-xs mt-0.5 max-w-md ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {content.phoneMockup.subtext}
                  </p>
                </div>

                <button
                  onClick={() => navigateToGuestGuide(currentProperty.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start ${
                    isDark 
                      ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d9de7d]' 
                      : 'bg-stone-900 text-white hover:bg-stone-850'
                  }`}
                >
                  <span>{content.phoneMockup.fullScreenBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Nested Phone Experience Card (Scrollable & Sleek) */}
              <div className={`flex-1 min-h-0 overflow-y-auto no-scrollbar scroll-smooth p-3 sm:p-3.5 rounded-[22px] sm:rounded-[26px] border transition-all relative ${
                isDark 
                  ? 'bg-[#111619] border-stone-800/80 shadow-inner text-stone-100' 
                  : 'bg-stone-50 border-stone-200/90 shadow-inner text-stone-900'
              }`}>
                {/* 1. Phone Hero Image with Badges */}
                <div className="relative h-26 sm:h-30 rounded-xl overflow-hidden mb-2.5 group shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                    alt="Old Tbilisi Balcony"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-black/20" />
                  
                  {/* Weather badge top right */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                    <span>🌤️</span>
                    <span>22°C</span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 w-fit mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                          STUMARI VERIFIED
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-serif font-bold text-white truncate max-w-[240px] sm:max-w-none">
                        Old Tbilisi Art & Heritage House
                      </h4>
                      <p className="text-[9px] sm:text-[10px] text-stone-200 font-medium">
                        Sololaki, Tbilisi · Hosted by Saba (Superhost)
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Arrival Boarding Pass (2 Fast Pass Bento Cards) */}
                <div className="grid grid-cols-2 gap-2 mb-2.5 shrink-0">
                  {/* Front Door Keypad Code in #E4E98E */}
                  <div 
                    onClick={handleCopyKeypad}
                    className="p-2.5 sm:p-3 rounded-xl bg-[#E4E98E] text-[#0C1510] shadow-2xs border border-[#0C1510]/10 relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex flex-col justify-between h-[74px] sm:h-[80px]"
                  >
                    <div className="absolute -right-2 -bottom-2 pointer-events-none text-[#0C1510]/15 opacity-70">
                      <TbilisiBalconySketch className="w-16 h-16" isDark={false} />
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border border-[#0C1510]/20 bg-[#0C1510]/10 text-[#0C1510] flex items-center justify-center shrink-0">
                          <KeyRound className="w-3 h-3" />
                        </div>
                        <span className="text-[9px] font-mono font-black uppercase text-[#0C1510]/70">
                          {copiedKeypad ? '✓ COPIED' : 'KEYPAD'}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-[#0C1510]/60 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Copy</span>
                      </span>
                    </div>
                    <div className="relative z-10 flex items-baseline justify-between">
                      <span className="font-mono text-base sm:text-lg font-black text-[#0C1510] tracking-wider">
                        4820#
                      </span>
                      <span className="text-[9px] font-bold text-[#0C1510]/70">Front Door</span>
                    </div>
                  </div>

                  {/* Instant Wi-Fi in #94B5D3 */}
                  <div 
                    onClick={handleCopyWifi}
                    className="p-2.5 sm:p-3 rounded-xl bg-[#94B5D3] text-[#0C1510] shadow-2xs border border-[#0C1510]/10 relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex flex-col justify-between h-[74px] sm:h-[80px]"
                  >
                    <div className="absolute -right-2 -bottom-2 pointer-events-none text-[#0C1510]/15 opacity-70">
                      <TbilisiTowerSketch className="w-16 h-16" isDark={false} />
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border border-[#0C1510]/20 bg-[#0C1510]/10 text-[#0C1510] flex items-center justify-center shrink-0">
                          <Wifi className="w-3 h-3" />
                        </div>
                        <span className="text-[9px] font-mono font-black uppercase text-[#0C1510]/70">
                          {copiedWifi ? '✓ COPIED' : 'WI-FI'}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-[#0C1510]/60 flex items-center gap-0.5">
                        <Copy className="w-2.5 h-2.5" />
                        <span>Connect</span>
                      </span>
                    </div>
                    <div className="relative z-10 flex items-baseline justify-between min-w-0">
                      <span className="font-mono text-xs sm:text-sm font-black text-[#0C1510] truncate block">
                        Pass: Tbilisi2026!
                      </span>
                      <span className="text-[9px] font-bold text-[#0C1510]/70 shrink-0 ml-1">5G Guest</span>
                    </div>
                  </div>
                </div>

                {/* 3. Five Micro Mood Pills (Compact & Sleek) */}
                <div className="mb-2.5 shrink-0">
                  <div className="flex items-center justify-between mb-1 px-0.5">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-stone-900 dark:text-stone-300">
                      WHAT ARE YOU IN THE MOOD FOR?
                    </span>
                    <button 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className="text-[10px] font-black text-stone-950 dark:text-[#E4E98E] hover:underline"
                    >
                      View all &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { label: "Hungry", icon: <Utensils className="w-3.5 h-3.5" />, bg: "bg-[#A8D5BA]", text: "text-[#0C1510]" },
                      { label: "Coffee", icon: <Coffee className="w-3.5 h-3.5" />, bg: "bg-[#E5C6A0]", text: "text-[#0C1510]" },
                      { label: "Khinkali", icon: <KhinkaliSketch className="w-3.5 h-3.5" />, bg: "bg-[#E4E98E]", text: "text-[#0C1510]" },
                      { label: "Wine", icon: <WineGlassSketch className="w-3.5 h-3.5" />, bg: "bg-[#E8BDC8]", text: "text-[#0C1510]" },
                      { label: "Secrets", icon: <BinocularsSketch className="w-3.5 h-3.5" />, bg: "bg-[#94B5D3]", text: "text-[#0C1510]" }
                    ].map((m, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => navigateToGuestGuide(currentProperty.slug)}
                        className={`p-1 rounded-xl border border-black/5 text-center flex flex-col items-center justify-between h-[46px] sm:h-[50px] shadow-2xs cursor-pointer hover:scale-105 transition-transform ${m.bg} ${m.text}`}
                      >
                        <div className="flex-1 flex items-center justify-center">{m.icon}</div>
                        <span className="text-[9px] font-black truncate w-full px-0.5">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Four Stay Guide Cards with Architectural Sketches (High Contrast) */}
                <div className="mb-2.5 shrink-0">
                  <div className="flex items-center justify-between mb-1 px-0.5">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-stone-900 dark:text-stone-300">
                      YOUR STAY GUIDE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Check-in Card */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-left flex justify-between relative overflow-hidden transition-all shadow-xs cursor-pointer hover:translate-y-[-2px] h-[82px] group ${
                        isDark 
                          ? 'bg-[#0D1812] border-emerald-500/25 text-stone-100 hover:border-emerald-500/50' 
                          : 'bg-[#EBF7EF] border-[#B9E6C6] text-stone-950 hover:border-[#8FD4A3]'
                      }`}
                    >
                      <div className="flex flex-col justify-between z-10 min-w-0 pr-1 flex-1">
                        <div className="w-5 h-5 rounded-full bg-emerald-200/90 text-emerald-900 flex items-center justify-center shrink-0 mb-0.5">
                          <KeyRound className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold block truncate text-stone-950 dark:text-stone-100">Arrival & Keys</span>
                          <span className="text-[9px] text-stone-800 dark:text-stone-300 block font-bold leading-tight line-clamp-1">Self check-in</span>
                        </div>
                      </div>
                      <div className="shrink-0 -mr-2 opacity-90 group-hover:scale-105 transition-transform">
                        <CheckinArtSketch className="w-12 h-12" isDark={isDark} />
                      </div>
                    </div>

                    {/* Appliances Card */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-left flex justify-between relative overflow-hidden transition-all shadow-xs cursor-pointer hover:translate-y-[-2px] h-[82px] group ${
                        isDark 
                          ? 'bg-[#0E1724] border-sky-500/25 text-stone-100 hover:border-sky-500/50' 
                          : 'bg-[#EDF5FF] border-[#BFDCFC] text-stone-950 hover:border-[#96C7FB]'
                      }`}
                    >
                      <div className="flex flex-col justify-between z-10 min-w-0 pr-1 flex-1">
                        <div className="w-5 h-5 rounded-full bg-sky-200/90 text-sky-900 flex items-center justify-center shrink-0 mb-0.5">
                          <Zap className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold block truncate text-stone-950 dark:text-stone-100">Appliances</span>
                          <span className="text-[9px] text-stone-800 dark:text-stone-300 block font-bold leading-tight line-clamp-1">5 video guides</span>
                        </div>
                      </div>
                      <div className="shrink-0 -mr-2 opacity-90 group-hover:scale-105 transition-transform">
                        <AppliancesArtSketch className="w-12 h-12" isDark={isDark} />
                      </div>
                    </div>

                    {/* House Rules */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-left flex justify-between relative overflow-hidden transition-all shadow-xs cursor-pointer hover:translate-y-[-2px] h-[82px] group ${
                        isDark 
                          ? 'bg-[#18140E] border-amber-500/25 text-stone-100 hover:border-amber-500/50' 
                          : 'bg-[#FDF6E7] border-[#F2DBAC] text-stone-950 hover:border-[#E8C883]'
                      }`}
                    >
                      <div className="flex flex-col justify-between z-10 min-w-0 pr-1 flex-1">
                        <div className="w-5 h-5 rounded-full bg-amber-200/90 text-amber-900 flex items-center justify-center shrink-0 mb-0.5">
                          <BookOpen className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold block truncate text-stone-950 dark:text-stone-100">House Rules</span>
                          <span className="text-[9px] text-stone-800 dark:text-stone-300 block font-bold leading-tight line-clamp-1">Quiet: 23:00</span>
                        </div>
                      </div>
                      <div className="shrink-0 -mr-2 opacity-90 group-hover:scale-105 transition-transform">
                        <HouseRulesArtSketch className="w-12 h-12" isDark={isDark} />
                      </div>
                    </div>

                    {/* Departure Checklist */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-left flex justify-between relative overflow-hidden transition-all shadow-xs cursor-pointer hover:translate-y-[-2px] h-[82px] group ${
                        isDark 
                          ? 'bg-[#191124] border-purple-500/25 text-stone-100 hover:border-purple-500/50' 
                          : 'bg-[#F6EDFD] border-[#DFC5FA] text-stone-950 hover:border-[#CA9FF6]'
                      }`}
                    >
                      <div className="flex flex-col justify-between z-10 min-w-0 pr-1 flex-1">
                        <div className="w-5 h-5 rounded-full bg-purple-200/90 text-purple-900 flex items-center justify-center shrink-0 mb-0.5">
                          <CheckSquare className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold block truncate text-stone-950 dark:text-stone-100">Check-out</span>
                          <span className="text-[9px] text-stone-800 dark:text-stone-300 block font-bold leading-tight line-clamp-1">By 11:00 AM</span>
                        </div>
                      </div>
                      <div className="shrink-0 -mr-2 opacity-90 group-hover:scale-105 transition-transform">
                        <DepartureArtSketch className="w-12 h-12" isDark={isDark} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Three Compact Useful Stickers (24/7 Market, Taxi & Bolt, Trash & Bins) */}
                <div className="mb-2 shrink-0">
                  <div className="flex items-center justify-between mb-1 px-0.5">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-stone-900 dark:text-stone-300">
                      USEFUL STICKERS
                    </span>
                    <button 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className="text-[10px] font-black text-stone-950 dark:text-[#E4E98E] hover:underline"
                    >
                      View all &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Sticker 1: 24/7 Market */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between h-[64px] sm:h-[68px] shadow-xs cursor-pointer hover:scale-102 transition-transform ${
                        isDark ? 'bg-[#1C180E] border-amber-500/30 text-amber-200' : 'bg-[#FFF9EB] border-[#FCE2A6] text-[#92400E]'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[8px] font-black shadow-2xs">
                        <ShoppingBag className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-[10px] font-black truncate w-full">24/7 Market</span>
                      <GroceryMarketSketch className="w-9 h-5.5" isDark={isDark} />
                    </div>

                    {/* Sticker 2: Taxi & Bolt */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between h-[64px] sm:h-[68px] shadow-xs cursor-pointer hover:scale-102 transition-transform ${
                        isDark ? 'bg-[#0E2016] border-emerald-500/30 text-emerald-200' : 'bg-[#ECF8F1] border-[#BEE9CB] text-[#064E3B]'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-black shadow-2xs">
                        <Car className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-[10px] font-black truncate w-full">Taxi & Bolt</span>
                      <TaxiSedanSketch className="w-9 h-5.5" isDark={isDark} />
                    </div>

                    {/* Sticker 3: Trash & Recycling */}
                    <div 
                      onClick={() => navigateToGuestGuide(currentProperty.slug)}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between h-[64px] sm:h-[68px] shadow-xs cursor-pointer hover:scale-102 transition-transform ${
                        isDark ? 'bg-[#1B1226] border-purple-500/30 text-purple-200' : 'bg-[#F3EAFD] border-[#DCC3F9] text-[#4C1D95]'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px] font-black shadow-2xs">
                        <Trash2 className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-[10px] font-black truncate w-full">Trash & Bins</span>
                      <RecyclingBinsSketch className="w-9 h-5.5" isDark={isDark} />
                    </div>
                  </div>
                </div>

                {/* 6. Review & Host Feedback Banner (Guest Guide Style) */}
                <div className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 shadow-2xs shrink-0 ${
                  isDark 
                    ? 'bg-gradient-to-r from-[#1E1911] via-[#16120D] to-[#1E1911] border-amber-500/30 text-stone-100' 
                    : 'bg-gradient-to-r from-[#FFFBEB] via-[#FEF9C3]/50 to-[#FFFBEB] border-amber-300 text-stone-900'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[11px] font-black block truncate ${
                        isDark ? 'text-stone-100' : 'text-stone-950'
                      }`}>
                        How is your stay going?
                      </span>
                      <span className={`text-[9px] block truncate font-semibold ${
                        isDark ? 'text-stone-300' : 'text-stone-700'
                      }`}>
                        Leave private feedback for your host
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToGuestGuide(currentProperty.slug)}
                    className="px-2.5 py-1 rounded-lg bg-[#E5EDA8] hover:bg-[#d8e293] text-stone-950 font-black text-[11px] shrink-0 shadow-xs active:scale-95 transition-all border border-stone-900/10"
                  >
                    Review
                  </button>
                </div>

                {/* Subtle Sticky Scroll Cue */}
                <div className="sticky bottom-0 inset-x-0 pt-2 pb-0.5 text-center pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#111619] dark:via-[#111619]/80 flex items-center justify-center">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-900/10 dark:bg-white/10 text-stone-700 dark:text-stone-300 backdrop-blur-xs flex items-center gap-1 shadow-2xs">
                    <span>↓ Scroll guide preview</span>
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* Bento Card 2 (SAGE GREEN 4-COL METRIC & PEACE OF MIND - CSS selector 1) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'automation') && (
            <div className={`col-span-1 sm:col-span-1 md:col-span-4 p-5 sm:p-6 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md relative overflow-hidden md:h-[490px] ${
              isDark 
                ? 'bg-[#243522] border border-[#859768]/60 text-stone-100 shadow-xl' 
                : 'bg-[#859768] text-[#0C1510]'
            }`}>
              <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-10">
                <TbilisiBalconySketch className="w-32 h-32" isDark={isDark} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                    isDark ? 'bg-[#859768]/20 text-[#A8C79A]' : 'bg-[#0C1510]/15 text-[#0C1510]'
                  }`}>
                    {content.bentoCards.peaceOfMind.badge}
                  </span>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'border border-[#859768]/40 text-[#A8C79A]' : 'border border-[#0C1510]/20 text-[#0C1510]'
                  }`}>
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                  </div>
                </div>

                <h3 className={`text-base sm:text-xl font-serif font-bold mb-1.5 sm:mb-2 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0C1510]'
                }`}>
                  {content.bentoCards.peaceOfMind.title}
                </h3>

                <p className={`text-xs sm:text-xs leading-relaxed mb-3 ${
                  isDark ? 'text-stone-200' : 'text-[#0C1510] font-medium'
                }`}>
                  {content.bentoCards.peaceOfMind.desc}
                </p>

                {/* Compact Comparison (Clean & Un-squeezed) */}
                <div className="space-y-1.5 mb-3">
                  <div className={`p-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-2 ${
                    isDark ? 'bg-[#152014] text-stone-200' : 'bg-black/15 text-[#0C1510] font-semibold'
                  }`}>
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-[10px] shrink-0">✕</span>
                    <span className="leading-snug">{content.bentoCards.peaceOfMind.problem}</span>
                  </div>

                  <div className={`p-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-2 ${
                    isDark ? 'bg-[#152014] text-stone-100 font-semibold' : 'bg-black/20 text-[#0C1510] font-bold'
                  }`}>
                    <span className="w-4 h-4 rounded-full bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-[10px] shrink-0">✓</span>
                    <span className="leading-snug">{content.bentoCards.peaceOfMind.solution}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Key Metric Stat */}
              <div className={`relative z-10 pt-3 border-t ${isDark ? 'border-[#859768]/30' : 'border-[#0C1510]/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-2xl sm:text-3xl font-serif font-bold leading-none ${
                      isDark ? 'text-[#E4E98E]' : 'text-[#0C1510]'
                    }`}>
                      {content.bentoCards.peaceOfMind.savedTimeValue}
                    </span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${isDark ? 'text-stone-300' : 'text-[#0C1510]'}`}>
                      {content.bentoCards.peaceOfMind.savedTimeLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg sm:text-xl font-serif font-bold ${isDark ? 'text-emerald-400' : 'text-[#0C1510]'}`}>
                      {content.bentoCards.peaceOfMind.ratingValue}
                    </span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${isDark ? 'text-stone-300' : 'text-[#0C1510]'}`}>
                      {content.bentoCards.peaceOfMind.ratingLabel}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Bento Card 5 (BUTTERY LIME 4-COL: 5-Star Reviews & Host Brand - CSS selector 1) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'proof') && (
            <div className="col-span-1 sm:col-span-1 md:col-span-4 p-5 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md bg-[#E4E98E] text-[#0C1510] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#0C1510] text-[#0C1510]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0C1510]/15 text-[#0C1510] px-2.5 py-0.5 rounded-full">
                    {content.bentoCards.reviews.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-serif font-bold mb-2 leading-tight text-[#0C1510]">
                  {content.bentoCards.reviews.title}
                </h3>
                <p className="text-xs sm:text-sm italic leading-relaxed text-[#0C1510] font-medium mb-3.5">
                  “{content.bentoCards.reviews.quote}”
                </p>

                <div className="p-2.5 rounded-xl bg-[#0C1510]/12 text-xs font-bold flex items-center justify-between mb-3">
                  <span>{content.bentoCards.reviews.autonomyLabel}</span>
                  <span className="font-black text-emerald-950 px-2 py-0.5 rounded-md bg-emerald-300/40">
                    {content.bentoCards.reviews.autonomyValue}
                  </span>
                </div>
              </div>

              {/* Author Info with Verified Badge */}
              <div className="relative z-10 pt-3.5 border-t border-[#0C1510]/20 flex items-center justify-between text-xs font-bold text-[#0C1510]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0C1510] text-[#E4E98E] flex items-center justify-center text-[10px] font-black">
                    ST
                  </div>
                  <div>
                    <span className="block font-black">{content.bentoCards.reviews.author}</span>
                    <span className="block text-[10px] font-medium opacity-80">{content.bentoCards.reviews.location}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/10">
                  Verified Stay
                </span>
              </div>
            </div>
          )}

          {/* Bento Card 3 (SOFT SLATE BLUE 4-COL: QR Stand & Bedside NFC - CSS selector 3) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'demo' || mobileBentoFilter === 'automation') && (
            <div className={`col-span-1 sm:col-span-1 md:col-span-4 p-5 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md relative overflow-hidden ${
              isDark 
                ? 'bg-[#1B2933] border border-[#92B1C9]/60 text-stone-100 shadow-xl' 
                : 'bg-[#92B1C9] text-[#0A1A26]'
            }`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                    isDark ? 'bg-[#92B1C9]/20 text-[#A9C8DD]' : 'bg-[#0A1A26]/15 text-[#0A1A26]'
                  }`}>
                    {content.bentoCards.hardware.badge}
                  </span>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'border border-[#92B1C9]/40 text-[#A9C8DD]' : 'border border-[#0A1A26]/20 text-[#0A1A26]'
                  }`}>
                    <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                  </div>
                </div>

                <h3 className={`text-lg sm:text-2xl font-serif font-bold mb-2 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0A1A26]'
                }`}>
                  {content.bentoCards.hardware.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-3.5 ${
                  isDark ? 'text-stone-200' : 'text-[#0A1A26] font-medium'
                }`}>
                  {content.bentoCards.hardware.desc}
                </p>

                {/* Tactile Bedside QR Card Preview */}
                <div className={`p-3 rounded-2xl flex items-center gap-3.5 ${
                  isDark ? 'bg-[#0C1217] border border-stone-800' : 'bg-white/90 shadow-sm border border-black/5'
                }`}>
                  <div className="w-14 h-14 bg-white rounded-xl p-1 shadow-sm flex items-center justify-center shrink-0 border border-stone-200">
                    <QrCode className="w-12 h-12 text-stone-950" />
                  </div>
                  <div>
                    <span className={`text-xs font-serif font-bold block ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      Bedside Touch Stand
                    </span>
                    <span className={`text-[10px] block ${isDark ? 'text-stone-400' : 'text-stone-600 font-medium'}`}>
                      📲 Tap phone or scan QR
                    </span>
                    <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">
                      Wi-Fi & Door Access
                    </span>
                  </div>
                </div>
              </div>

              <div className={`relative z-10 mt-4 pt-3.5 border-t text-xs flex items-center justify-between font-bold ${
                isDark ? 'border-[#92B1C9]/30 text-stone-300' : 'border-[#0A1A26]/20 text-[#0A1A26]'
              }`}>
                <span>{content.bentoCards.hardware.printLabel}</span>
                <span className="font-black px-2 py-0.5 rounded bg-black/10">
                  {content.bentoCards.hardware.printStatus}
                </span>
              </div>
            </div>
          )}

          {/* Bento Card 4 (SOFT MINT SEAFOAM 4-COL: Offline PWA & Zero Reception - CSS selector 4) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'automation') && (
            <div className={`col-span-1 sm:col-span-1 md:col-span-4 p-5 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md relative overflow-hidden ${
              isDark 
                ? 'bg-[#142C23] border border-emerald-500/50 text-stone-100 shadow-xl' 
                : 'bg-[#D7EFE7] text-[#0A2D22]'
            }`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#0A2D22]/15 text-[#0A2D22]'
                  }`}>
                    {content.bentoCards.offline.badge}
                  </span>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'border border-emerald-500/40 text-emerald-400' : 'border border-[#0A2D22]/20 text-[#0A2D22]'
                  }`}>
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                  </div>
                </div>

                <h3 className={`text-lg sm:text-2xl font-serif font-bold mb-2 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0A2D22]'
                }`}>
                  {content.bentoCards.offline.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-3.5 ${
                  isDark ? 'text-stone-200' : 'text-[#0A2D22] font-medium'
                }`}>
                  {content.bentoCards.offline.desc}
                </p>

                {/* Feature Chips */}
                <div className="space-y-2 mb-3">
                  <div className={`p-2.5 rounded-xl flex items-center gap-2.5 text-xs ${
                    isDark ? 'bg-[#0E2019] text-stone-100' : 'bg-white/85 text-[#0A2D22] font-bold shadow-xs'
                  }`}>
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{content.bentoCards.offline.pwaChip}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl flex items-center gap-2.5 text-xs ${
                    isDark ? 'bg-[#0E2019] text-stone-100' : 'bg-white/85 text-[#0A2D22] font-bold shadow-xs'
                  }`}>
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{content.bentoCards.offline.whatsappChip}</span>
                  </div>
                </div>
              </div>

              <div className={`relative z-10 mt-4 pt-3.5 border-t text-xs flex items-center justify-between font-bold ${
                isDark ? 'border-emerald-500/30 text-stone-300' : 'border-[#0A2D22]/20 text-[#0A2D22]'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{content.bentoCards.offline.syncLabel}</span>
                </div>
                <span className="font-black text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded bg-black/10">
                  {content.bentoCards.offline.syncValue}
                </span>
              </div>
            </div>
          )}

        </div>

      </section>

      {/* 3. PROPERTY TYPES SHOWCASE BENTO SECTION (CSS Selectors 1-9) */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 border-t transition-colors ${
        isDark ? 'bg-[#0C1013] border-stone-800/80' : 'bg-white border-stone-200'
      }`}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-stone-100 text-stone-800'
              }`}>
                {content.propertyTypes.badge}
              </span>
              <h2 className={`text-3xl sm:text-4xl font-serif font-bold mt-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {content.propertyTypes.title}
              </h2>
              <p className={`text-xs sm:text-sm mt-1 max-w-md ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {content.propertyTypes.subtitle}
              </p>
            </div>

            {/* Interactive Filter Tabs */}
            <div className={`flex items-center gap-1 p-1 rounded-2xl border overflow-x-auto no-scrollbar max-w-full ${
              isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-100 border-stone-200'
            }`}>
              {[
                { id: 'apartment', label: content.propertyTypes.tabs.apartment },
                { id: 'villa', label: content.propertyTypes.tabs.villa },
                { id: 'hotel', label: content.propertyTypes.tabs.hotel },
                { id: 'guesthouse', label: content.propertyTypes.tabs.guesthouse }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePropertyType(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                    activePropertyType === tab.id
                      ? isDark 
                        ? 'bg-[#E4E98E] text-[#0C1510] shadow-sm' 
                        : 'bg-white text-stone-900 shadow-sm'
                      : isDark 
                        ? 'text-stone-400 hover:text-white' 
                        : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Bento Cards based on Selected Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {activePropertyType === 'apartment' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-amber-500/40 text-stone-100' : 'bg-white border-stone-200/90 hover:border-amber-400 shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiBalconySketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#282115] text-[#F9E2AF] border-amber-500/30' : 'bg-[#FDF0D5] text-[#78350F] border-[#F6E0B3]'
                      }`}>
                        {content.propertyTypes.apartmentCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.apartmentCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.apartmentCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80" 
                      alt="Loft" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#859768]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#859768] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiBalconySketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]'
                      }`}>
                        {content.propertyTypes.apartmentCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.apartmentCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.apartmentCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" 
                      alt="Cafe" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#92B1C9]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#92B1C9] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiPanoramaSketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]'
                      }`}>
                        {content.propertyTypes.apartmentCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.apartmentCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.apartmentCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" 
                      alt="Kitchen" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>
              </>
            )}

            {activePropertyType === 'villa' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-amber-500/40 text-stone-100' : 'bg-white border-stone-200/90 hover:border-amber-400 shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiPanoramaSketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#282115] text-[#F9E2AF] border-amber-500/30' : 'bg-[#FDF0D5] text-[#78350F] border-[#F6E0B3]'
                      }`}>
                        {content.propertyTypes.villaCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.villaCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.villaCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1542314831-c6a4d27f8842?auto=format&fit=crop&w=600&q=80" 
                      alt="Chalet" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#859768]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#859768] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiPanoramaSketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]'
                      }`}>
                        {content.propertyTypes.villaCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.villaCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.villaCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" 
                      alt="Mountain" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#92B1C9]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#92B1C9] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <WineGlassSketch className="w-24 h-24" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]'
                      }`}>
                        {content.propertyTypes.villaCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.villaCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.villaCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80" 
                      alt="Villa" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>
              </>
            )}

            {activePropertyType === 'hotel' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#E4E98E]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#B6BD4B] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiTowerSketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#252A17] text-[#E4E98E] border-[#E4E98E]/30' : 'bg-[#F6F9D6] text-[#1D260D] border-[#E9F0B2]'
                      }`}>
                        {content.propertyTypes.hotelCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.hotelCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.hotelCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" 
                      alt="Hotel" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-emerald-500/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-emerald-400 shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiTowerSketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#132A23] text-emerald-300 border-emerald-500/30' : 'bg-[#D7EFE7] text-[#0A2D22] border-[#B8E4D5]'
                      }`}>
                        {content.propertyTypes.hotelCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.hotelCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.hotelCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" 
                      alt="Room" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#92B1C9]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#92B1C9] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiBalconySketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]'
                      }`}>
                        {content.propertyTypes.hotelCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.hotelCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.hotelCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" 
                      alt="Spa" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>
              </>
            )}

            {activePropertyType === 'guesthouse' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#859768]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#859768] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiBalconySketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]'
                      }`}>
                        {content.propertyTypes.guesthouseCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.guesthouseCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.guesthouseCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80" 
                      alt="Guesthouse" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-emerald-500/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-emerald-400 shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <TbilisiTowerSketch className="w-28 h-28" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#132A23] text-emerald-300 border-emerald-500/30' : 'bg-[#D7EFE7] text-[#0A2D22] border-[#B8E4D5]'
                      }`}>
                        {content.propertyTypes.guesthouseCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.guesthouseCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.guesthouseCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80" 
                      alt="Wine" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 relative overflow-hidden ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#E4E98E]/50 text-stone-100' : 'bg-white border-stone-200/90 hover:border-[#B6BD4B] shadow-xs text-stone-950'
                }`}>
                  <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-15">
                    <KhinkaliSketch className="w-24 h-24" isDark={isDark} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#252A17] text-[#E4E98E] border-[#E4E98E]/30' : 'bg-[#F6F9D6] text-[#1D260D] border-[#E9F0B2]'
                      }`}>
                        {content.propertyTypes.guesthouseCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                      {content.propertyTypes.guesthouseCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                      {content.propertyTypes.guesthouseCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs relative bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" 
                      alt="Language" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* 4. 3-STEP ONBOARDING PROCESS BENTO (High Contrast & Clear Typography) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
            isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-[#E4E98E]/30 text-[#1C2618] border border-[#E4E98E]/50'
          }`}>
            {content.onboardingProcess.badge}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold mt-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {content.onboardingProcess.title}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
            {content.onboardingProcess.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 01 - Sage Green */}
          <div className={`p-6 sm:p-7 rounded-[28px] sm:rounded-[32px] border relative overflow-hidden flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-950 shadow-md'
          }`}>
            <div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm mb-4 bg-[#859768] text-[#0C1510] shadow-xs">
                01
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                {content.onboardingProcess.step1.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                {content.onboardingProcess.step1.desc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-700 dark:text-stone-400 font-semibold">
              {content.onboardingProcess.step1.foot}
            </div>
          </div>

          {/* Step 02 - Soft Slate Blue */}
          <div className={`p-6 sm:p-7 rounded-[28px] sm:rounded-[32px] border relative overflow-hidden flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-950 shadow-md'
          }`}>
            <div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm mb-4 bg-[#92B1C9] text-[#0A1A26] shadow-xs">
                02
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                {content.onboardingProcess.step2.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                {content.onboardingProcess.step2.desc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-700 dark:text-stone-400 font-semibold">
              {content.onboardingProcess.step2.foot}
            </div>
          </div>

          {/* Step 03 - Buttery Lime */}
          <div className={`p-6 sm:p-7 rounded-[28px] sm:rounded-[32px] border relative overflow-hidden flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-950 shadow-md'
          }`}>
            <div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm mb-4 bg-[#E4E98E] text-[#0C1510] shadow-xs">
                03
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 text-stone-950 dark:text-white">
                {content.onboardingProcess.step3.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                {content.onboardingProcess.step3.desc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-700 dark:text-stone-400 font-semibold">
              {content.onboardingProcess.step3.foot}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className={`p-8 sm:p-12 rounded-[40px] border shadow-2xl relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-[#161D20] via-[#0C1013] to-[#12181A] border-stone-800' 
            : 'bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white border-stone-800'
        }`}>
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E4E98E]">
              {content.ctaBanner.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {content.ctaBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {content.ctaBanner.subtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentRoute('/onboarding')}
                className="px-8 py-3.5 rounded-full bg-[#E4E98E] hover:bg-[#d9de7d] text-[#0C1510] font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>{content.ctaBanner.primaryBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentRoute('/pricing')}
                className="px-6 py-3.5 rounded-full bg-stone-800/90 hover:bg-stone-750 text-stone-100 border border-stone-600 font-bold text-sm transition-all"
              >
                {content.ctaBanner.secondaryBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUIET MARKETING FOOTER (Frontend Design Compliant) */}
      <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-[#080B0D] border-stone-800/80 text-stone-300' : 'bg-stone-100/90 border-stone-200 text-stone-700'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-stone-800 flex items-center justify-center text-[#E4E98E] p-1.5 shadow-xs">
              <StumariArchIcon className="w-full h-full fill-current" />
            </div>
            <div>
              <span className={`text-base font-serif font-black tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                STUMARI
              </span>
              <span className="text-[11px] block font-medium opacity-75">
                Contactless Guest Guides for Georgian Hospitality
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
            <button onClick={() => setCurrentRoute('/')} className="hover:underline">
              {t.nav.marketing}
            </button>
            <button onClick={() => setCurrentRoute('/features')} className="hover:underline">
              Features
            </button>
            <button onClick={() => setCurrentRoute('/for-properties')} className="hover:underline">
              For Properties
            </button>
            <button onClick={() => setCurrentRoute('/pricing')} className="hover:underline">
              Pricing
            </button>
            <button onClick={() => setCurrentRoute('/demo')} className="hover:underline">
              Interactive Demo
            </button>
            <button onClick={() => setCurrentRoute('/app')} className="hover:underline">
              Host App
            </button>
          </div>

          <div className="text-xs text-center md:text-right font-medium opacity-70">
            <span>© 2026 Stumari. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
