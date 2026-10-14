import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Hotel, 
  Layers, 
  Check, 
  ArrowRight, 
  Star,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MARKETING_I18N } from '../../data/marketingI18n';

export const ForPropertiesPage: React.FC = () => {
  const { setCurrentRoute, theme, language } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'apartments' | 'guesthouses' | 'hotels' | 'managers'>('apartments');
  const [mobileDetailView, setMobileDetailView] = useState<'solution' | 'headaches'>('solution');

  const content = MARKETING_I18N[language]?.forPropertiesPage || MARKETING_I18N.en.forPropertiesPage;

  const tabIcons: Record<string, React.ReactNode> = {
    apartments: <Home className="w-4 h-4" />,
    guesthouses: <Building2 className="w-4 h-4" />,
    hotels: <Hotel className="w-4 h-4" />,
    managers: <Layers className="w-4 h-4" />
  };

  const propertyTypes = content.types.map(t => ({
    ...t,
    icon: tabIcons[t.id] || <Home className="w-4 h-4" />
  }));

  const currentType = propertyTypes.find(t => t.id === activeTab) || propertyTypes[0];

  const typeThemeConfig: Record<string, { badge: string; border: string }> = {
    apartments: {
      badge: isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]',
      border: 'hover:border-[#92B1C9]'
    },
    guesthouses: {
      badge: isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]',
      border: 'hover:border-[#859768]'
    },
    hotels: {
      badge: isDark ? 'bg-amber-950/40 text-amber-300 border-amber-600/30' : 'bg-amber-100 text-amber-900 border-amber-300',
      border: 'hover:border-amber-500'
    },
    managers: {
      badge: isDark ? 'bg-[#132A23] text-emerald-300 border-emerald-500/30' : 'bg-[#D7EFE7] text-[#0A2D22] border-[#B8E4D5]',
      border: 'hover:border-emerald-400'
    }
  };
  const activeTheme = typeThemeConfig[activeTab] || typeThemeConfig.apartments;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 pb-20 ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAFAF8] text-zinc-900'
    }`}>
      {/* Top Hero */}
      <section className={`pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b text-center transition-colors ${
        isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-stone-900 border-stone-800 text-white'
      }`}>
        <div className="max-w-3xl mx-auto space-y-4">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase inline-block ${
            isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {content.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {content.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Tabs Row (Optimized horizontal swipe for mobile) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className={`p-1.5 sm:p-2 rounded-2xl shadow-md border flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar transition-colors ${
          isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-200'
        }`}>
          {propertyTypes.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? isDark 
                    ? 'bg-amber-600 text-white font-bold shadow-xs' 
                    : 'bg-stone-900 text-white font-bold shadow-xs'
                  : isDark 
                    ? 'text-stone-400 hover:text-white hover:bg-stone-800' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className={`rounded-[32px] border shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-colors ${
          isDark ? 'bg-[#12171A] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}>
          
          {/* Left Column: Details */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-md inline-block border ${activeTheme.badge}`}>
                {currentType.label}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
                {currentType.headline}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {currentType.subhead}
              </p>

              {/* Mobile View Toggle: Solution vs Pain Points */}
              <div className="flex sm:hidden items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                <button
                  onClick={() => setMobileDetailView('solution')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mobileDetailView === 'solution'
                      ? isDark ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                      : 'text-stone-500'
                  }`}
                >
                  {content.solutionTab}
                </button>
                <button
                  onClick={() => setMobileDetailView('headaches')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mobileDetailView === 'headaches'
                      ? isDark ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                      : 'text-stone-500'
                  }`}
                >
                  {content.headachesTab}
                </button>
              </div>

              {/* Stumari Solution Checkpoints */}
              <div className={`space-y-2.5 ${mobileDetailView === 'headaches' ? 'hidden sm:block' : 'block'}`}>
                <h3 className="text-xs font-bold font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{content.solutionHeader}</span>
                </h3>
                <div className="space-y-2">
                  {currentType.solution.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-800 dark:text-stone-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pain Points / Headaches Avoided */}
              <div className={`space-y-2.5 pt-2 ${mobileDetailView === 'solution' ? 'hidden sm:block' : 'block'}`}>
                <h3 className="text-xs font-bold font-mono uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{content.headachesHeader}</span>
                </h3>
                <div className="space-y-2">
                  {currentType.painPoints.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                      <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✕
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center gap-3">
              <button
                onClick={() => setCurrentRoute('/onboarding')}
                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 active:scale-95 ${
                  isDark 
                    ? 'bg-amber-600 text-white hover:bg-amber-500' 
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                <span>{content.ctaBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentRoute('/demo')}
                className={`px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm border transition-colors ${
                  isDark 
                    ? 'border-stone-700 text-stone-300 hover:bg-stone-800' 
                    : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {language === 'ka' ? 'ინტერაქტიული დემო' : language === 'ru' ? 'Интерактивное демо' : 'Try Interactive Demo'}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative bg-stone-900 min-h-[260px] lg:min-h-full">
            <img
              src={currentType.image}
              alt={currentType.headline}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent p-6 flex flex-col justify-end text-white">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs italic text-stone-200 font-serif">
                {language === 'ka' 
                  ? '"Stumari-მ მკვეთრად შეამცირა სტუმრების შეტყობინებების რაოდენობა. სტუმრები მშვიდად და კმაყოფილნი ჩამოდიან."' 
                  : language === 'ru'
                    ? '"Stumari колоссально сократил поток повторяющихся сообщений. Гости заселяются спокойно и уверенно."'
                    : '"Stumari cut our messaging volume dramatically. Guests arrive confident and relaxed."'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
