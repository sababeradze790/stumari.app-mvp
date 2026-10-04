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
  Moon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from '../common/StumariLogo';
import { MARKETING_I18N } from '../../data/marketingI18n';

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
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-5">
          
          {/* Bento Card 1 (WIDE HERO): Live Interactive Guide Phone Mockup */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'demo') && (
            <div className={`col-span-2 md:col-span-8 p-4 sm:p-8 rounded-[28px] sm:rounded-[36px] border transition-all relative overflow-hidden flex flex-col justify-between ${
              isDark 
                ? 'bg-[#0C1013] border-stone-800/80 shadow-2xl text-stone-100' 
                : 'bg-white border-stone-200/90 shadow-xl text-stone-900'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
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
                  <h3 className={`text-xl sm:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {content.phoneMockup.heading}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 max-w-md ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {content.phoneMockup.subtext}
                  </p>
                </div>

                <button
                  onClick={() => navigateToGuestGuide(currentProperty.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start ${
                    isDark 
                      ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d9de7d]' 
                      : 'bg-stone-900 text-white hover:bg-stone-850'
                  }`}
                >
                  <span>{content.phoneMockup.fullScreenBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Nested Phone Experience Card */}
              <div className={`p-3.5 sm:p-5 rounded-[24px] sm:rounded-[28px] border transition-all ${
                isDark 
                  ? 'bg-[#14191C] border-stone-800/90 shadow-inner' 
                  : 'bg-stone-50 border-stone-200/90 shadow-inner'
              }`}>
                
                {/* Phone Hero Image with Badges */}
                <div className="relative h-36 sm:h-52 rounded-2xl overflow-hidden mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                    alt="Old Tbilisi Balcony"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  <div className="absolute bottom-2.5 sm:bottom-3 left-3 right-3 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase text-[#E4E98E]">
                        {content.phoneMockup.mockupLocation}
                      </span>
                      <h4 className="text-sm sm:text-lg font-serif font-bold text-white truncate max-w-[200px] sm:max-w-none">
                        {content.phoneMockup.mockupTitle}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-stone-300">
                        {content.phoneMockup.mockupHost}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/90 text-white text-[9px] sm:text-[10px] font-bold shadow-xs shrink-0">
                      {content.phoneMockup.mockupVerified}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Interactive Wi-Fi Card Inside Guide */}
                <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-2.5 mb-2.5 transition-colors ${
                  isDark 
                    ? 'bg-[#132A23] border-emerald-500/30 text-white' 
                    : 'bg-[#D7EFE7] border-[#B8E4D5] text-[#0A2D22] shadow-xs'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-600/15 text-emerald-800'
                    }`}>
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[9px] uppercase font-mono tracking-wider font-bold block ${
                        isDark ? 'text-emerald-400' : 'text-emerald-800'
                      }`}>
                        {content.phoneMockup.wifiLabel}
                      </span>
                      <span className="text-xs font-bold font-mono truncate block">OldTbilisi_Guest_5G</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyWifi}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-xs ${
                      isDark ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-[#0A2D22] text-white hover:bg-[#123e30]'
                    }`}
                  >
                    {copiedWifi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWifi ? content.phoneMockup.copied : content.phoneMockup.copyKey}</span>
                  </button>
                </div>

                {/* 4 Mini Action Cards with Matched Pastel Colors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 1. Door Keypad */}
                  <div 
                    onClick={handleCopyKeypad}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isDark 
                        ? 'bg-[#282115] border-amber-500/30 text-amber-100 hover:border-amber-400' 
                        : 'bg-[#FDF0D5] border-[#F6E0B3] text-[#2C1F0D] hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[9px] font-mono opacity-70">{content.phoneMockup.doorCodeLabel}</span>
                    </div>
                    <span className="text-[11px] font-bold block truncate">{content.phoneMockup.doorCodeTitle}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      {copiedKeypad ? content.phoneMockup.copied : '4820#'}
                    </span>
                  </div>

                  {/* 2. Appliances */}
                  <div 
                    onClick={() => setCurrentRoute('/demo')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isDark 
                        ? 'bg-[#1E2B1C] border-[#859768]/30 text-stone-100' 
                        : 'bg-[#E5ECE0] border-[#CFDEC7] text-[#192A17]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Coffee className="w-3.5 h-3.5 text-[#859768]" />
                      <span className="text-[9px] font-mono opacity-70">{content.phoneMockup.appliancesLabel}</span>
                    </div>
                    <span className="text-[11px] font-bold block truncate">{content.phoneMockup.appliancesTitle}</span>
                    <span className="text-[10px] opacity-70">{content.phoneMockup.appliancesSub}</span>
                  </div>

                  {/* 3. House Rules */}
                  <div 
                    onClick={() => setCurrentRoute('/demo')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isDark 
                        ? 'bg-[#182733] border-[#92B1C9]/30 text-stone-100' 
                        : 'bg-[#E3EDF4] border-[#C9DEED] text-[#0F2230]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Shield className="w-3.5 h-3.5 text-[#92B1C9]" />
                      <span className="text-[9px] font-mono opacity-70">{content.phoneMockup.rulesLabel}</span>
                    </div>
                    <span className="text-[11px] font-bold block truncate">{content.phoneMockup.rulesTitle}</span>
                    <span className="text-[10px] opacity-70">{content.phoneMockup.rulesSub}</span>
                  </div>

                  {/* 4. Local Spots */}
                  <div 
                    onClick={() => setCurrentRoute('/demo')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isDark 
                        ? 'bg-[#242A16] border-[#E4E98E]/30 text-stone-100' 
                        : 'bg-[#F6F9D6] border-[#E9F0B2] text-[#1D260D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Compass className="w-3.5 h-3.5 text-[#B6BD4B]" />
                      <span className="text-[9px] font-mono opacity-70">{content.phoneMockup.secretsLabel}</span>
                    </div>
                    <span className="text-[11px] font-bold block truncate">{content.phoneMockup.secretsTitle}</span>
                    <span className="text-[10px] opacity-70">{content.phoneMockup.secretsSub}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Bento Card 2 (SAGE GREEN 4-COL METRIC & PEACE OF MIND) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'automation') && (
            <div className={`col-span-1 md:col-span-4 p-4 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md ${
              isDark 
                ? 'bg-[#243522] border border-[#859768]/60 text-stone-100 shadow-xl' 
                : 'bg-[#859768] text-[#0C1510]'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
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

                <h3 className={`text-base sm:text-2xl font-serif font-bold mb-2 sm:mb-3 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0C1510]'
                }`}>
                  {content.bentoCards.peaceOfMind.title}
                </h3>

                <p className={`text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4 ${
                  isDark ? 'text-stone-300' : 'text-[#0C1510]/85'
                }`}>
                  {content.bentoCards.peaceOfMind.desc}
                </p>

                {/* Compact Comparison */}
                <div className="space-y-1.5">
                  <div className={`p-2 sm:p-2.5 rounded-xl text-[10px] sm:text-[11px] flex items-center gap-2 ${
                    isDark ? 'bg-[#152014] text-stone-300' : 'bg-black/10 text-[#0C1510]'
                  }`}>
                    <span className="text-rose-500 font-bold">✕</span>
                    <span className="truncate">{content.bentoCards.peaceOfMind.problem}</span>
                  </div>

                  <div className={`p-2 sm:p-2.5 rounded-xl text-[10px] sm:text-[11px] flex items-center gap-2 ${
                    isDark ? 'bg-[#152014] text-stone-100 font-semibold' : 'bg-black/15 text-[#0C1510] font-semibold'
                  }`}>
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="truncate">{content.bentoCards.peaceOfMind.solution}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Key Metric Stat */}
              <div className={`mt-4 pt-3.5 border-t ${isDark ? 'border-[#859768]/30' : 'border-[#0C1510]/15'}`}>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className={`text-2xl sm:text-4xl font-serif font-bold leading-none ${
                      isDark ? 'text-[#E4E98E]' : 'text-[#0C1510]'
                    }`}>
                      {content.bentoCards.peaceOfMind.savedTimeValue}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-300' : 'text-[#0C1510]/75'}`}>
                      {content.bentoCards.peaceOfMind.savedTimeLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-2xl font-serif font-bold text-emerald-400">
                      {content.bentoCards.peaceOfMind.ratingValue}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-300' : 'text-[#0C1510]/75'}`}>
                      {content.bentoCards.peaceOfMind.ratingLabel}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Bento Card 5 (BUTTERY LIME 4-COL: 5-Star Reviews & Host Brand) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'proof') && (
            <div className="col-span-1 md:col-span-4 p-4 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md bg-[#E4E98E] text-[#0C1510]">
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-[#0C1510]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0C1510]/15 text-[#0C1510] px-2 py-0.5 rounded-full">
                    {content.bentoCards.reviews.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-2xl font-serif font-bold mb-2 leading-tight text-[#0C1510]">
                  {content.bentoCards.reviews.title}
                </h3>
                <p className="text-[11px] sm:text-xs italic leading-relaxed text-[#0C1510]/85 mb-3">
                  {content.bentoCards.reviews.quote}
                </p>

                <div className="p-2 sm:p-2.5 rounded-xl bg-[#0C1510]/10 text-[10px] sm:text-[11px] font-semibold flex items-center justify-between">
                  <span>{content.bentoCards.reviews.autonomyLabel}</span>
                  <span className="font-bold text-emerald-800">{content.bentoCards.reviews.autonomyValue}</span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#0C1510]/15 text-[11px] font-semibold flex items-center justify-between text-[#0C1510]">
                <span>{content.bentoCards.reviews.author}</span>
                <span>{content.bentoCards.reviews.location}</span>
              </div>
            </div>
          )}

          {/* Bento Card 3 (SOFT SLATE BLUE 4-COL: QR Stand & Bedside NFC) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'demo' || mobileBentoFilter === 'automation') && (
            <div className={`col-span-1 md:col-span-4 p-4 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md ${
              isDark 
                ? 'bg-[#1B2933] border border-[#92B1C9]/60 text-stone-100 shadow-xl' 
                : 'bg-[#92B1C9] text-[#0A1A26]'
            }`}>
              <div>
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

                <h3 className={`text-base sm:text-2xl font-serif font-bold mb-2 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0A1A26]'
                }`}>
                  {content.bentoCards.hardware.title}
                </h3>
                <p className={`text-[11px] sm:text-xs leading-relaxed mb-3 ${
                  isDark ? 'text-stone-300' : 'text-[#0A1A26]/85'
                }`}>
                  {content.bentoCards.hardware.desc}
                </p>

                {/* Visual QR Card */}
                <div className={`p-2.5 sm:p-3 rounded-2xl text-center flex flex-col items-center justify-center ${
                  isDark ? 'bg-[#0C1217]' : 'bg-white/70 shadow-xs'
                }`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-1.5 shadow-xs flex items-center justify-center mb-1">
                    <QrCode className="w-14 h-14 sm:w-16 sm:h-16 text-stone-950" />
                  </div>
                  <span className={`text-[9px] font-mono ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {content.bentoCards.hardware.scanAction}
                  </span>
                </div>
              </div>

              <div className={`mt-4 pt-3.5 border-t text-[10px] sm:text-xs flex items-center justify-between ${
                isDark ? 'border-[#92B1C9]/30 text-stone-300' : 'border-[#0A1A26]/15 text-[#0A1A26]'
              }`}>
                <span>{content.bentoCards.hardware.printLabel}</span>
                <span className="font-bold">{content.bentoCards.hardware.printStatus}</span>
              </div>
            </div>
          )}

          {/* Bento Card 4 (SOFT MINT SEAFOAM 4-COL: Offline PWA & Zero Reception) */}
          {(mobileBentoFilter === 'all' || mobileBentoFilter === 'automation') && (
            <div className={`col-span-1 md:col-span-4 p-4 sm:p-7 rounded-[26px] sm:rounded-[36px] flex flex-col justify-between transition-all shadow-md ${
              isDark 
                ? 'bg-[#142C23] border border-emerald-500/50 text-stone-100 shadow-xl' 
                : 'bg-[#D7EFE7] text-[#0A2D22]'
            }`}>
              <div>
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

                <h3 className={`text-base sm:text-2xl font-serif font-bold mb-2 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0A2D22]'
                }`}>
                  {content.bentoCards.offline.title}
                </h3>
                <p className={`text-[11px] sm:text-xs leading-relaxed mb-3 ${
                  isDark ? 'text-stone-300' : 'text-[#0A2D22]/85'
                }`}>
                  {content.bentoCards.offline.desc}
                </p>

                {/* Feature Chips */}
                <div className="space-y-1.5">
                  <div className={`p-2 rounded-xl flex items-center gap-2 text-[10px] sm:text-[11px] ${
                    isDark ? 'bg-[#0E2019] text-stone-200' : 'bg-white/60 text-[#0A2D22]'
                  }`}>
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{content.bentoCards.offline.pwaChip}</span>
                  </div>
                  <div className={`p-2 rounded-xl flex items-center gap-2 text-[10px] sm:text-[11px] ${
                    isDark ? 'bg-[#0E2019] text-stone-200' : 'bg-white/60 text-[#0A2D22]'
                  }`}>
                    <MessageCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{content.bentoCards.offline.whatsappChip}</span>
                  </div>
                </div>
              </div>

              <div className={`mt-4 pt-3.5 border-t text-[10px] sm:text-xs flex items-center justify-between ${
                isDark ? 'border-emerald-500/30 text-stone-300' : 'border-[#0A2D22]/15 text-[#0A2D22]'
              }`}>
                <span>{content.bentoCards.offline.syncLabel}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{content.bentoCards.offline.syncValue}</span>
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
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-amber-500/40' : 'bg-white border-stone-200 hover:border-amber-400 shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#282115] text-[#F9E2AF] border-amber-500/30' : 'bg-[#FDF0D5] text-[#2C1F0D] border-[#F6E0B3]'
                      }`}>
                        {content.propertyTypes.apartmentCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.apartmentCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.apartmentCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80" alt="Loft" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#859768]/50' : 'bg-white border-stone-200 hover:border-[#859768] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]'
                      }`}>
                        {content.propertyTypes.apartmentCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.apartmentCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.apartmentCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" alt="Cafe" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#92B1C9]/50' : 'bg-white border-stone-200 hover:border-[#92B1C9] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]'
                      }`}>
                        {content.propertyTypes.apartmentCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.apartmentCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.apartmentCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" alt="Kitchen" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>
              </>
            )}

            {activePropertyType === 'villa' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-amber-500/40' : 'bg-white border-stone-200 hover:border-amber-400 shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#282115] text-[#F9E2AF] border-amber-500/30' : 'bg-[#FDF0D5] text-[#2C1F0D] border-[#F6E0B3]'
                      }`}>
                        {content.propertyTypes.villaCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.villaCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.villaCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1542314831-c6a4d27f8842?auto=format&fit=crop&w=600&q=80" alt="Chalet" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#859768]/50' : 'bg-white border-stone-200 hover:border-[#859768] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]'
                      }`}>
                        {content.propertyTypes.villaCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.villaCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.villaCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" alt="Mountain" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#92B1C9]/50' : 'bg-white border-stone-200 hover:border-[#92B1C9] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]'
                      }`}>
                        {content.propertyTypes.villaCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.villaCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.villaCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80" alt="Villa" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>
              </>
            )}

            {activePropertyType === 'hotel' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#E4E98E]/50' : 'bg-white border-stone-200 hover:border-[#B6BD4B] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#252A17] text-[#E4E98E] border-[#E4E98E]/30' : 'bg-[#F6F9D6] text-[#1D260D] border-[#E9F0B2]'
                      }`}>
                        {content.propertyTypes.hotelCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.hotelCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.hotelCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" alt="Hotel" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-emerald-500/50' : 'bg-white border-stone-200 hover:border-emerald-400 shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#132A23] text-emerald-300 border-emerald-500/30' : 'bg-[#D7EFE7] text-[#0A2D22] border-[#B8E4D5]'
                      }`}>
                        {content.propertyTypes.hotelCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.hotelCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.hotelCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" alt="Room" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#92B1C9]/50' : 'bg-white border-stone-200 hover:border-[#92B1C9] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]'
                      }`}>
                        {content.propertyTypes.hotelCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.hotelCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.hotelCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" alt="Spa" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>
              </>
            )}

            {activePropertyType === 'guesthouse' && (
              <>
                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#859768]/50' : 'bg-white border-stone-200 hover:border-[#859768] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]'
                      }`}>
                        {content.propertyTypes.guesthouseCards[0].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">01</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.guesthouseCards[0].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.guesthouseCards[0].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80" alt="Guesthouse" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-emerald-500/50' : 'bg-white border-stone-200 hover:border-emerald-400 shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#132A23] text-emerald-300 border-emerald-500/30' : 'bg-[#D7EFE7] text-[#0A2D22] border-[#B8E4D5]'
                      }`}>
                        {content.propertyTypes.guesthouseCards[1].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">02</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.guesthouseCards[1].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.guesthouseCards[1].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80" alt="Wine" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between sm:col-span-2 md:col-span-1 ${
                  isDark ? 'bg-[#13181B] border-stone-800 hover:border-[#E4E98E]/50' : 'bg-white border-stone-200 hover:border-[#B6BD4B] shadow-xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                        isDark ? 'bg-[#252A17] text-[#E4E98E] border-[#E4E98E]/30' : 'bg-[#F6F9D6] text-[#1D260D] border-[#E9F0B2]'
                      }`}>
                        {content.propertyTypes.guesthouseCards[2].badge}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">03</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif font-bold mb-2">
                      {content.propertyTypes.guesthouseCards[2].title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {content.propertyTypes.guesthouseCards[2].desc}
                    </p>
                  </div>
                  <div className="h-36 sm:h-40 rounded-2xl overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" alt="Language" className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* 4. 3-STEP ONBOARDING PROCESS BENTO (CSS Selectors 10-21) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
            isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-stone-100 text-stone-800'
          }`}>
            {content.onboardingProcess.badge}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold mt-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {content.onboardingProcess.title}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            {content.onboardingProcess.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 01 - Sage Green */}
          <div className={`p-6 sm:p-7 rounded-[28px] sm:rounded-[32px] border relative overflow-hidden flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-md'
          }`}>
            <div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm mb-4 bg-[#859768] text-[#0C1510] shadow-xs">
                01
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-2">
                {content.onboardingProcess.step1.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {content.onboardingProcess.step1.desc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-500">
              {content.onboardingProcess.step1.foot}
            </div>
          </div>

          {/* Step 02 - Soft Slate Blue */}
          <div className={`p-6 sm:p-7 rounded-[28px] sm:rounded-[32px] border relative overflow-hidden flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-md'
          }`}>
            <div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm mb-4 bg-[#92B1C9] text-[#0A1A26] shadow-xs">
                02
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-2">
                {content.onboardingProcess.step2.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {content.onboardingProcess.step2.desc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-500">
              {content.onboardingProcess.step2.foot}
            </div>
          </div>

          {/* Step 03 - Buttery Lime */}
          <div className={`p-6 sm:p-7 rounded-[28px] sm:rounded-[32px] border relative overflow-hidden flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-md'
          }`}>
            <div>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm mb-4 bg-[#E4E98E] text-[#0C1510] shadow-xs">
                03
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-2">
                {content.onboardingProcess.step3.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {content.onboardingProcess.step3.desc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800/80 text-[11px] font-mono text-stone-500">
              {content.onboardingProcess.step3.foot}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER (CSS Selectors 22-25) */}
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
                className="px-8 py-3.5 rounded-full bg-[#E4E98E] hover:bg-[#d9de7d] text-[#0C1510] font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>{content.ctaBanner.primaryBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentRoute('/pricing')}
                className="px-6 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-750 text-stone-200 border border-stone-700 font-semibold text-sm transition-all"
              >
                {content.ctaBanner.secondaryBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
