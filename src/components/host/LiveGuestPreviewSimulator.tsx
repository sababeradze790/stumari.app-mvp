import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  ExternalLink, 
  Languages, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Maximize2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Property } from '../../types';
import { GuideSectionKey } from '../../context/AppContext';
import { GuestGuideSimple } from '../guest/GuestGuideSimple';
import { evaluatePropertyHealth } from './GuideHealthChecker';

interface LiveGuestPreviewSimulatorProps {
  property: Property;
  onNavigateToSection: (sectionKey: GuideSectionKey) => void;
  onOpenLiveTab: () => void;
}

type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export const LiveGuestPreviewSimulator: React.FC<LiveGuestPreviewSimulatorProps> = ({
  property,
  onNavigateToSection,
  onOpenLiveTab
}) => {
  const [device, setDevice] = useState<DeviceMode>('mobile');
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'ka' | 'ru'>('en');
  const [showHealthSidebar, setShowHealthSidebar] = useState(true);
  const [simulatorKey, setSimulatorKey] = useState(0);

  const { items, passedCount, totalCount, criticalMissingCount, healthStatus } = evaluatePropertyHealth(property);

  const reloadSimulator = () => {
    setSimulatorKey(k => k + 1);
  };

  return (
    <div className="space-y-5">
      {/* Top Preview Controls Toolbar */}
      <div className="p-4 rounded-2xl border bg-white dark:bg-[#181D20] border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'mobile'
                ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-500" />
            <span>Mobile (390px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'tablet'
                ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5 text-amber-500" />
            <span>Tablet (640px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              device === 'desktop'
                ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-amber-500" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Language Preview Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs">
            <Languages className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-400 font-mono text-[11px]">Preview Lang:</span>
            <select
              value={previewLanguage}
              onChange={(e) => setPreviewLanguage(e.target.value as any)}
              className="bg-transparent font-bold text-stone-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="ka">ქართული (KA)</option>
              <option value="ru">Русский (RU)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={reloadSimulator}
            title="Reload Simulator View"
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowHealthSidebar(!showHealthSidebar)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showHealthSidebar
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Health Inspector ({totalCount - passedCount} pending)</span>
          </button>

          <button
            type="button"
            onClick={onOpenLiveTab}
            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Live Guest Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Frame with Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Device Canvas */}
        <div className={`transition-all duration-300 flex justify-center ${showHealthSidebar ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="w-full flex justify-center py-4">
            {device === 'mobile' && (
              <div className="w-full max-w-[400px] bg-stone-950 rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 relative">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30" />
                <div className="w-full bg-[#FAF8F5] dark:bg-[#141312] rounded-[38px] overflow-hidden min-h-[700px] max-h-[780px] overflow-y-auto no-scrollbar shadow-inner relative">
                  <GuestGuideSimple 
                    key={`mobile-${simulatorKey}-${previewLanguage}`} 
                    propertyOverride={property} 
                    isEmbed={true} 
                  />
                </div>
              </div>
            )}

            {device === 'tablet' && (
              <div className="w-full max-w-[640px] bg-stone-950 rounded-[40px] p-4 shadow-2xl border-4 border-stone-800 relative">
                <div className="w-full bg-[#FAF8F5] dark:bg-[#141312] rounded-[28px] overflow-hidden min-h-[720px] max-h-[820px] overflow-y-auto no-scrollbar shadow-inner relative">
                  <GuestGuideSimple 
                    key={`tablet-${simulatorKey}-${previewLanguage}`} 
                    propertyOverride={property} 
                    isEmbed={true} 
                  />
                </div>
              </div>
            )}

            {device === 'desktop' && (
              <div className="w-full max-w-4xl bg-stone-950 rounded-[28px] p-3 shadow-2xl border-4 border-stone-800 relative">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 rounded-t-xl mb-2 text-stone-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] font-mono ml-2 text-stone-400">stumari.ge/g/{property.slug}</span>
                </div>
                <div className="w-full bg-[#FAF8F5] dark:bg-[#141312] rounded-xl overflow-hidden min-h-[680px] max-h-[800px] overflow-y-auto no-scrollbar shadow-inner relative">
                  <GuestGuideSimple 
                    key={`desktop-${simulatorKey}-${previewLanguage}`} 
                    propertyOverride={property} 
                    isEmbed={true} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Health & Missing Information Inspector Sidebar */}
        {showHealthSidebar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:col-span-4 rounded-[28px] border p-5 bg-white dark:bg-[#181D20] border-stone-200 dark:border-stone-800 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 block">
                  Guide Health Inspector
                </span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                  Missing & Incomplete Details
                </h4>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                criticalMissingCount === 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'
              }`}>
                {criticalMissingCount === 0 ? 'Ready' : `${criticalMissingCount} Critical`}
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Click any item below to jump straight to the relevant editor section and complete it.
            </p>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto no-scrollbar pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border text-xs space-y-2 transition-all ${
                    item.status === 'passed'
                      ? 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800'
                      : item.status === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-rose-500/5 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {item.status === 'passed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : item.status === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className="font-bold text-stone-900 dark:text-zinc-100">
                        {item.title}
                      </span>
                    </div>

                    {item.importance === 'critical' && item.status !== 'passed' && (
                      <span className="text-[9px] font-mono font-bold text-rose-500">
                        Required
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {item.description}
                  </p>

                  {item.status !== 'passed' && (
                    <button
                      type="button"
                      onClick={() => onNavigateToSection(item.sectionKey)}
                      className="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Fix in {item.sectionKey} section</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
