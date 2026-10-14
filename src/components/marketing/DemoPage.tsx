import React, { useState } from 'react';
import { 
  Smartphone, 
  ExternalLink, 
  ArrowRight, 
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GuestGuideSimple } from '../guest/GuestGuideSimple';
import { MARKETING_I18N } from '../../data/marketingI18n';

export const DemoPage: React.FC = () => {
  const { properties, navigateToGuestGuide, setCurrentRoute, theme, language } = useApp();
  const isDark = theme === 'dark';

  const [selectedSlug, setSelectedSlug] = useState<string>(properties[0]?.slug || 'old-tbilisi-apartment');
  const [mobileTab, setMobileTab] = useState<'demo' | 'journey'>('demo');

  const content = MARKETING_I18N[language]?.demoPage || MARKETING_I18N.en.demoPage;

  const selectedProperty = properties.find(p => p.slug === selectedSlug) || properties[0];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 pb-20 ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAFAF8] text-zinc-900'
    }`}>
      {/* Top Banner */}
      <section className={`py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b text-center transition-colors ${
        isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-stone-900 border-stone-800 text-white'
      }`}>
        <div className="max-w-3xl mx-auto space-y-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase inline-block ${
            isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {content.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
            {content.subtitle}
          </p>

          {/* Property Selector */}
          <div className="pt-2 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-1">
            <span className="text-[11px] text-stone-400 mr-1 font-mono uppercase tracking-wider shrink-0">{content.propertyLabel}</span>
            {properties.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedSlug(p.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSlug === p.slug
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                {p.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Tab Switcher: Guide vs How it Works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="flex sm:hidden items-center justify-between p-1.5 rounded-2xl border shadow-md bg-white dark:bg-[#14191C] border-stone-200 dark:border-stone-800 gap-1 mb-4">
          <button
            onClick={() => setMobileTab('demo')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'demo'
                ? isDark ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                : 'text-stone-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{content.tabDemo}</span>
          </button>
          <button
            onClick={() => setMobileTab('journey')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'journey'
                ? isDark ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                : 'text-stone-500'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{content.tabJourney}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Demo Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Side: Explanatory Journey Card */}
        <div className={`lg:col-span-5 space-y-6 order-2 lg:order-1 ${
          mobileTab === 'demo' ? 'hidden sm:block' : 'block'
        }`}>
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-md space-y-4 transition-colors ${
            isDark ? 'bg-[#12171A] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {content.simBadge}
              </span>
            </div>

            <h2 className="text-2xl font-serif font-bold">
              {content.journeyTitle}
            </h2>

            <div className="space-y-3.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {content.steps.map((st) => (
                <div 
                  key={st.step}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                    isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-100'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isDark ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {st.step}
                  </div>
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 block text-xs mb-0.5">{st.title}</strong>
                    <span>{st.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800/80 space-y-2.5">
              <button
                onClick={() => navigateToGuestGuide(selectedProperty.slug)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isDark 
                    ? 'bg-amber-600 text-white hover:bg-amber-500' 
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                <span>{content.launchFullscreen}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentRoute('/onboarding')}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs border transition-colors flex items-center justify-center gap-1.5 ${
                  isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-300 text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span>{content.createYourOwn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Guide Experience */}
        <div className={`lg:col-span-7 flex flex-col items-center order-1 lg:order-2 w-full ${
          mobileTab === 'journey' ? 'hidden sm:flex' : 'flex'
        }`}>
          {/* Desktop/Tablet Phone Bezel vs Mobile Native Frameless Display */}
          <div className="w-full sm:max-w-[420px] bg-white dark:bg-[#12171A] sm:bg-stone-950 sm:dark:bg-stone-950 rounded-3xl sm:rounded-[44px] p-0 sm:p-3 shadow-xl sm:shadow-2xl border-0 sm:border-4 border-stone-800 relative overflow-hidden">
            {/* Phone Speaker Notch (Desktop/Tablet only) */}
            <div className="hidden sm:flex w-32 h-5 bg-stone-950 rounded-b-xl absolute top-3 left-1/2 -translate-x-1/2 z-50 items-center justify-center">
              <div className="w-12 h-1 bg-stone-800 rounded-full" />
            </div>

            {/* Inner Phone Screen Container */}
            <div className="w-full bg-stone-50 dark:bg-[#0B0F12] rounded-2xl sm:rounded-[34px] overflow-hidden min-h-[580px] sm:min-h-[640px] max-h-[740px] overflow-y-auto no-scrollbar shadow-inner relative border border-stone-200 sm:border-0 dark:border-stone-800">
              <GuestGuideSimple propertyOverride={selectedProperty} isEmbed={true} />
            </div>
          </div>

          {/* Quick Helper under device */}
          <div className="mt-3 flex items-center justify-between w-full max-w-[420px] px-2 text-[11px] text-stone-500">
            <span>{content.helperTip}</span>
            <button 
              onClick={() => navigateToGuestGuide(selectedProperty.slug)}
              className="text-amber-600 dark:text-amber-400 font-bold underline"
            >
              {content.openFullscreen}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
