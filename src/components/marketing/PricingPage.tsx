import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRICING_PLANS } from '../../data/mockData';
import { MARKETING_I18N } from '../../data/marketingI18n';

export const PricingPage: React.FC = () => {
  const { setCurrentRoute, theme, t, language } = useApp();
  const isDark = theme === 'dark';
  const [annualBilling, setAnnualBilling] = useState(true);
  const [selectedMobilePlan, setSelectedMobilePlan] = useState<'all' | string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const content = MARKETING_I18N[language]?.pricingPage || MARKETING_I18N.en.pricingPage;
  const plans = content.plans || PRICING_PLANS;

  return (
    <div className={`min-h-screen pb-20 font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAFAF8] text-zinc-900'
    }`}>
      {/* Hero Header */}
      <section className={`pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b text-center transition-colors ${
        isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-stone-900 border-stone-800 text-white'
      }`}>
        <div className="max-w-3xl mx-auto space-y-4">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase inline-block ${
            isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {t.nav.pricing}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {t.marketing.pricing.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            {t.marketing.pricing.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="pt-3 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${!annualBilling ? 'text-white' : 'text-stone-400'}`}>
              {t.marketing.pricing.monthly}
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-12 h-6 rounded-full bg-stone-800 border border-stone-700 p-0.5 transition-colors relative cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-5 h-5 rounded-full ${
                  annualBilling ? 'translate-x-6 bg-amber-500' : 'translate-x-0 bg-stone-400'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${annualBilling ? 'text-white' : 'text-stone-400'}`}>
                {t.marketing.pricing.annual}
              </span>
              <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                {t.marketing.pricing.saveTag}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Plan Selector Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex sm:hidden items-center justify-between p-1.5 rounded-2xl border shadow-md bg-white dark:bg-[#14191C] border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar gap-1 mb-4">
          <button
            onClick={() => setSelectedMobilePlan('all')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMobilePlan === 'all'
                ? isDark ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                : 'text-stone-500'
            }`}
          >
            {content.allPlans}
          </button>
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedMobilePlan(plan.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMobilePlan === plan.id
                  ? isDark ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                  : 'text-stone-500'
              }`}
            >
              {plan.isPopular ? `⭐ ${plan.name}` : plan.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Bento Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sm:-mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {plans.filter(p => selectedMobilePlan === 'all' || p.id === selectedMobilePlan).map((plan, index) => {
            const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
            const isHeroCard = plan.isPopular;

            // Plan-specific color palettes
            const planThemes = [
              {
                badge: isDark ? 'bg-[#1E2B1C] text-[#CBE2C1] border-[#859768]/30' : 'bg-[#E5ECE0] text-[#192A17] border-[#CFDEC7]',
                accentBorder: isDark ? 'hover:border-[#859768]/50' : 'hover:border-[#859768]'
              },
              {
                badge: isDark ? 'bg-amber-950/40 text-amber-300 border-amber-600/30' : 'bg-amber-100 text-amber-900 border-amber-300',
                accentBorder: isDark ? 'border-amber-500' : 'border-amber-400'
              },
              {
                badge: isDark ? 'bg-[#182733] text-[#B8D9EF] border-[#92B1C9]/30' : 'bg-[#E3EDF4] text-[#0F2230] border-[#C9DEED]',
                accentBorder: isDark ? 'hover:border-[#92B1C9]/50' : 'hover:border-[#92B1C9]'
              }
            ];
            const currentPlanTheme = planThemes[index % planThemes.length];

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`rounded-[30px] sm:rounded-[32px] p-6 sm:p-8 border flex flex-col justify-between transition-all duration-300 relative ${
                  isHeroCard
                    ? isDark 
                      ? 'bg-gradient-to-b from-[#182024] to-[#12171A] border-amber-500 shadow-2xl ring-1 ring-amber-500/50'
                      : 'bg-white border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                    : isDark 
                      ? `bg-[#0C1013] border-stone-800 text-stone-100 shadow-lg ${currentPlanTheme.accentBorder}` 
                      : `bg-white border-stone-200 text-stone-900 shadow-md ${currentPlanTheme.accentBorder}`
                }`}
              >
                {isHeroCard && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md whitespace-nowrap animate-glow">
                    {content.mostPopular}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-serif text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {plan.name}
                    </h3>
                    <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${currentPlanTheme.badge}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <p className={`text-xs mb-5 leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-5 flex items-baseline gap-1.5">
                    <span className={`text-4xl font-extrabold font-serif ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      ${price}
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      / {content.month} {annualBilling && price > 0 ? content.billedAnnually : ''}
                    </span>
                  </div>

                  {/* Feature checklist */}
                  <div className={`space-y-2.5 pt-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-100'}`}>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 sm:pt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrentRoute('/onboarding')}
                    className={`w-full py-3 sm:py-3.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                      isHeroCard
                        ? isDark 
                          ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                          : 'bg-stone-950 hover:bg-stone-850 text-white'
                        : isDark 
                          ? 'bg-stone-800 hover:bg-stone-750 text-white' 
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ Interactive Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-16 text-center space-y-5">
        <h3 className={`text-2xl font-serif font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
          {content.faqTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {content.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -2 }}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 hover:border-stone-700' : 'bg-white border-stone-200 text-stone-900 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold">{faq.q}</h4>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-500' : 'text-stone-400'}`} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-xs leading-relaxed mt-2 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!isOpen && (
                  <p className={`hidden sm:block text-xs leading-relaxed mt-2 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {faq.a}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
