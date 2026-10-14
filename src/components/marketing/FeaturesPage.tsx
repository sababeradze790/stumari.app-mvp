import React, { useState } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Wifi, 
  KeyRound, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Bus, 
  Globe2, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MARKETING_I18N } from '../../data/marketingI18n';

type FeatureCategory = 'all' | 'access' | 'house' | 'local' | 'support';

export const FeaturesPage: React.FC = () => {
  const { setCurrentRoute, navigateToGuestGuide, currentProperty, theme, language } = useApp();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory>('all');
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'grid'>('cards');

  const content = MARKETING_I18N[language]?.featuresPage || MARKETING_I18N.en.featuresPage;

  const featureIcons = [
    <Smartphone className="w-5 h-5 text-amber-500" />,
    <QrCode className="w-5 h-5 text-emerald-500" />,
    <KeyRound className="w-5 h-5 text-sky-500" />,
    <Wifi className="w-5 h-5 text-purple-400" />,
    <BookOpen className="w-5 h-5 text-rose-400" />,
    <Sparkles className="w-5 h-5 text-amber-400" />,
    <Compass className="w-5 h-5 text-teal-400" />,
    <Bus className="w-5 h-5 text-indigo-400" />,
    <Globe2 className="w-5 h-5 text-sky-400" />,
    <MessageCircle className="w-5 h-5 text-emerald-400" />
  ];

  const coreFeatures = content.features.map((feat, index) => ({
    ...feat,
    icon: featureIcons[index] || <Sparkles className="w-5 h-5 text-amber-400" />
  }));

  const filteredFeatures = selectedCategory === 'all'
    ? coreFeatures
    : coreFeatures.filter(f => f.category === selectedCategory);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 pb-20 ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAFAF8] text-zinc-900'
    }`}>
      {/* Header Banner */}
      <section className={`pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
        isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-stone-900 border-stone-800 text-white'
      }`}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase inline-block ${
            isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {content.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            {content.titlePart1} <br className="hidden sm:inline" />
            <span className="text-amber-400 font-extrabold">{content.titleHighlight}</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentRoute('/onboarding')}
              className={`px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                isDark ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <span>{content.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateToGuestGuide(currentProperty.slug)}
              className="px-5 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-750 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <span>{content.ctaSecondary}</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      </section>

      {/* Mobile-Friendly Category Switcher & View Mode Toggle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className={`p-2 rounded-2xl border shadow-md flex items-center justify-between gap-2 overflow-x-auto no-scrollbar transition-colors ${
          isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-200'
        }`}>
          {/* Categories */}
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: 'all', label: content.categories.all },
              { id: 'access', label: content.categories.access },
              { id: 'house', label: content.categories.house },
              { id: 'local', label: content.categories.local },
              { id: 'support', label: content.categories.support }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? isDark 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'bg-stone-900 text-white shadow-xs'
                    : isDark 
                      ? 'text-stone-400 hover:text-white hover:bg-stone-800' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile Layout Switcher (Cards vs Compact 2-Col Grid) */}
          <div className="flex sm:hidden items-center gap-1 pl-2 border-l border-stone-200 dark:border-stone-800 shrink-0">
            <button
              onClick={() => setMobileViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold ${
                mobileViewMode === 'cards' 
                  ? isDark ? 'bg-stone-800 text-amber-400' : 'bg-stone-200 text-stone-900' 
                  : 'text-stone-400'
              }`}
              title={content.viewCards}
            >
              {content.viewCards}
            </button>
            <button
              onClick={() => setMobileViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold ${
                mobileViewMode === 'grid' 
                  ? isDark ? 'bg-stone-800 text-amber-400' : 'bg-stone-200 text-stone-900' 
                  : 'text-stone-400'
              }`}
              title={content.viewGrid}
            >
              {content.viewGrid}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid (Responsive Bento & Mobile Adaptations) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Render Mobile View depending on toggle */}
        <div className={`grid gap-4 sm:gap-6 ${
          mobileViewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredFeatures.map((feat, idx) => {
            const isCompactMobile = mobileViewMode === 'grid';
            
            // Matched color themes per category
            const themeConfig: Record<string, { bgBadge: string; textBadge: string; borderBadge: string; iconBg: string; hoverBorder: string }> = {
              access: {
                bgBadge: isDark ? 'bg-[#132A23]' : 'bg-[#D7EFE7]',
                textBadge: isDark ? 'text-emerald-300' : 'text-[#0A2D22]',
                borderBadge: isDark ? 'border-emerald-500/30' : 'border-[#B8E4D5]',
                iconBg: isDark ? 'bg-emerald-500/15 border-emerald-500/25' : 'bg-[#D7EFE7] border-[#B8E4D5]',
                hoverBorder: isDark ? 'hover:border-emerald-500/40' : 'hover:border-emerald-400'
              },
              house: {
                bgBadge: isDark ? 'bg-[#1E2B1C]' : 'bg-[#E5ECE0]',
                textBadge: isDark ? 'text-[#CBE2C1]' : 'text-[#192A17]',
                borderBadge: isDark ? 'border-[#859768]/30' : 'border-[#CFDEC7]',
                iconBg: isDark ? 'bg-[#859768]/15 border-[#859768]/25' : 'bg-[#E5ECE0] border-[#CFDEC7]',
                hoverBorder: isDark ? 'hover:border-[#859768]/50' : 'hover:border-[#859768]'
              },
              local: {
                bgBadge: isDark ? 'bg-[#282115]' : 'bg-[#FDF0D5]',
                textBadge: isDark ? 'text-[#F9E2AF]' : 'text-[#2C1F0D]',
                borderBadge: isDark ? 'border-amber-500/30' : 'border-[#F6E0B3]',
                iconBg: isDark ? 'bg-amber-500/15 border-amber-500/25' : 'bg-[#FDF0D5] border-[#F6E0B3]',
                hoverBorder: isDark ? 'hover:border-amber-500/40' : 'hover:border-amber-400'
              },
              support: {
                bgBadge: isDark ? 'bg-[#182733]' : 'bg-[#E3EDF4]',
                textBadge: isDark ? 'text-[#B8D9EF]' : 'text-[#0F2230]',
                borderBadge: isDark ? 'border-[#92B1C9]/30' : 'border-[#C9DEED]',
                iconBg: isDark ? 'bg-sky-500/15 border-sky-500/25' : 'bg-[#E3EDF4] border-[#C9DEED]',
                hoverBorder: isDark ? 'hover:border-[#92B1C9]/50' : 'hover:border-[#92B1C9]'
              }
            };
            const currentTheme = themeConfig[feat.category] || themeConfig.access;

            return (
              <div
                key={idx}
                className={`p-4 sm:p-6 rounded-[24px] border transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md ${
                  isDark 
                    ? `bg-[#12171A] border-stone-800 ${currentTheme.hoverBorder} shadow-sm` 
                    : `bg-white border-stone-200 ${currentTheme.hoverBorder} shadow-xs`
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${currentTheme.iconBg}`}>
                      {feat.icon}
                    </div>
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${currentTheme.bgBadge} ${currentTheme.textBadge} ${currentTheme.borderBadge}`}>
                      {feat.category}
                    </span>
                  </div>

                  <div>
                    <h3 className={`font-serif font-bold text-stone-900 dark:text-white ${
                      isCompactMobile ? 'text-sm line-clamp-1' : 'text-base sm:text-lg'
                    }`}>
                      {feat.title}
                    </h3>
                    <p className={`font-medium ${
                      isDark ? 'text-amber-400' : 'text-amber-800'
                    } ${isCompactMobile ? 'text-[10px] line-clamp-1' : 'text-xs mt-0.5'}`}>
                      {feat.subtitle}
                    </p>
                  </div>

                  <p className={`text-stone-600 dark:text-stone-400 leading-relaxed ${
                    isCompactMobile ? 'text-[11px] line-clamp-2' : 'text-xs'
                  }`}>
                    {feat.description}
                  </p>
                </div>

                <div className={`pt-3 mt-3.5 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center text-[10px] sm:text-[11px] font-medium ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" />
                  <span className={isCompactMobile ? 'truncate' : ''}>{content.includedTag}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Anti-Feature Note: Deliberately disciplined */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className={`border rounded-[28px] p-5 sm:p-7 text-center space-y-2.5 transition-colors ${
          isDark 
            ? 'bg-[#12171A] border-stone-800 text-stone-200' 
            : 'bg-amber-50/80 border-amber-200/90 text-stone-900'
        }`}>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${
            isDark ? 'bg-stone-800 text-amber-400' : 'bg-amber-100 text-amber-900'
          }`}>
            {content.disciplineBadge}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold">
            {content.disciplineTitle}
          </h3>
          <p className={`text-xs max-w-xl mx-auto leading-relaxed ${
            isDark ? 'text-stone-400' : 'text-stone-700'
          }`}>
            {content.disciplineDesc}
          </p>
        </div>
      </section>

      {/* Call to Action Footer Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <div className={`rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 shadow-xl space-y-5 transition-colors ${
          isDark 
            ? 'bg-gradient-to-br from-[#161D20] via-[#0C1013] to-[#12181A] border border-stone-800 text-white' 
            : 'bg-stone-900 text-white'
        }`}>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {content.ctaBannerTitle}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {content.ctaBannerSubtitle}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCurrentRoute('/onboarding')}
              className={`px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 ${
                isDark ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
              }`}
            >
              {content.ctaBannerBtn1}
            </button>
            <button
              onClick={() => navigateToGuestGuide(currentProperty.slug)}
              className="px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-750 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 transition-colors"
            >
              {content.ctaBannerBtn2}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
