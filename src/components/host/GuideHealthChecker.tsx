import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Wifi, 
  KeyRound, 
  Clock, 
  Phone, 
  Image as ImageIcon, 
  Wrench, 
  Compass, 
  Globe2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Property } from '../../types';
import { GuideSectionKey } from '../../context/AppContext';

export interface HealthCheckItem {
  id: string;
  category: 'essentials' | 'visuals' | 'multilingual';
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'missing';
  sectionKey: GuideSectionKey;
  importance: 'critical' | 'recommended';
}

interface GuideHealthCheckerProps {
  property: Property;
  onNavigateToSection: (sectionKey: GuideSectionKey) => void;
  compact?: boolean;
}

export const evaluatePropertyHealth = (property: Property): {
  items: HealthCheckItem[];
  passedCount: number;
  totalCount: number;
  criticalMissingCount: number;
  healthStatus: 'ready' | 'needs_attention' | 'incomplete';
} => {
  const items: HealthCheckItem[] = [
    // 1. Wi-Fi
    {
      id: 'wifi',
      category: 'essentials',
      title: 'Wi-Fi Network & Password',
      description: property.wifiNetwork && property.wifiPassword 
        ? `Configured: "${property.wifiNetwork}"` 
        : 'Guests need instant Wi-Fi access upon arrival.',
      status: (property.wifiNetwork && property.wifiPassword) ? 'passed' : 'missing',
      sectionKey: 'wifi',
      importance: 'critical'
    },
    // 2. Arrival & Door Access
    {
      id: 'checkin',
      category: 'essentials',
      title: 'Arrival & Entry Instructions',
      description: (property.lockboxCode || property.doorKeypadCode || property.arrivalDirections)
        ? 'Clear check-in code and building door guidance provided.'
        : 'Missing door lockbox code or building entrance steps.',
      status: (property.lockboxCode || property.doorKeypadCode || property.arrivalDirections) ? 'passed' : 'missing',
      sectionKey: 'checkin',
      importance: 'critical'
    },
    // 3. Checkout Times & Key Instructions
    {
      id: 'checkout',
      category: 'essentials',
      title: 'Checkout & Key Return',
      description: property.checkOutTime 
        ? `Checkout set at ${property.checkOutTime}. Key drop instructions ready.` 
        : 'Specify checkout hour and where guests should leave keys.',
      status: property.checkOutTime ? 'passed' : 'warning',
      sectionKey: 'checkout',
      importance: 'critical'
    },
    // 4. Host Contact & Emergency
    {
      id: 'contact',
      category: 'essentials',
      title: 'Host Emergency Contact',
      description: (property.hostPhone || property.hostWhatsApp)
        ? `Direct line: ${property.hostPhone || property.hostWhatsApp}`
        : 'Add phone or WhatsApp so guests can reach you in urgent cases.',
      status: (property.hostPhone || property.hostWhatsApp) ? 'passed' : 'missing',
      sectionKey: 'contact',
      importance: 'critical'
    },
    // 5. High-Resolution Cover & Photos
    {
      id: 'photos',
      category: 'visuals',
      title: 'Cover & Room Photo Gallery',
      description: property.photos && property.photos.length >= 3
        ? `${property.photos.length} visual photos organized by room.`
        : property.coverImage
        ? 'Cover photo added. Add 2+ room photos for better guest orientation.'
        : 'No property photos yet. Add entrance and living area photos.',
      status: (property.photos && property.photos.length >= 3) 
        ? 'passed' 
        : property.coverImage ? 'warning' : 'missing',
      sectionKey: 'welcome',
      importance: 'recommended'
    },
    // 6. Appliance & Visual How-To Guides
    {
      id: 'appliances',
      category: 'visuals',
      title: 'Appliance & How-To Guides',
      description: property.appliances && property.appliances.length > 0
        ? `${property.appliances.length} appliance visual guides configured.`
        : 'Add guides for AC, Boiler, or Washing Machine to stop questions.',
      status: (property.appliances && property.appliances.length >= 2)
        ? 'passed'
        : (property.appliances && property.appliances.length === 1)
        ? 'warning'
        : 'missing',
      sectionKey: 'how-it-works',
      importance: 'recommended'
    },
    // 7. Local Gems & Recommendations
    {
      id: 'gems',
      category: 'essentials',
      title: 'Local Recommendations & Gems',
      description: (property.gemIds && property.gemIds.length > 0) || (property.recommendations && property.recommendations.length > 0)
        ? `${(property.gemIds?.length || 0) + (property.recommendations?.length || 0)} curated spots linked.`
        : 'Curate 2-3 favorite cafes, bakeries, or wine bars for guests.',
      status: ((property.gemIds && property.gemIds.length > 0) || (property.recommendations && property.recommendations.length > 0)) ? 'passed' : 'warning',
      sectionKey: 'recommendations',
      importance: 'recommended'
    },
    // 8. Multilingual Ready
    {
      id: 'languages',
      category: 'multilingual',
      title: 'Multilingual Languages (EN, KA, RU)',
      description: property.languages && property.languages.length >= 2
        ? `Available in: ${property.languages.map(l => l.toUpperCase()).join(', ')}`
        : 'Translate your guide to English and Georgian for international visitors.',
      status: (property.languages && property.languages.length >= 2) ? 'passed' : 'warning',
      sectionKey: 'welcome',
      importance: 'recommended'
    }
  ];

  const passedCount = items.filter(i => i.status === 'passed').length;
  const criticalMissingCount = items.filter(i => i.importance === 'critical' && i.status === 'missing').length;
  
  let healthStatus: 'ready' | 'needs_attention' | 'incomplete' = 'ready';
  if (criticalMissingCount > 0) {
    healthStatus = 'incomplete';
  } else if (passedCount < items.length) {
    healthStatus = 'needs_attention';
  }

  return {
    items,
    passedCount,
    totalCount: items.length,
    criticalMissingCount,
    healthStatus
  };
};

export const GuideHealthChecker: React.FC<GuideHealthCheckerProps> = ({
  property,
  onNavigateToSection,
  compact = false
}) => {
  const { items, passedCount, totalCount, criticalMissingCount, healthStatus } = evaluatePropertyHealth(property);

  const getStatusIcon = (status: HealthCheckItem['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
    }
  };

  if (compact) {
    return (
      <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
        healthStatus === 'ready' 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200' 
          : healthStatus === 'needs_attention'
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 min-w-0">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            {healthStatus === 'ready' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
            ) : healthStatus === 'needs_attention' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold block break-words leading-snug">
                {healthStatus === 'ready' 
                  ? 'Guide Health: Ready for Guests' 
                  : healthStatus === 'needs_attention' 
                  ? 'Guide Health: Recommended Items Pending' 
                  : 'Guide Health: Missing Critical Essentials'}
              </span>
              <span className="text-[11px] opacity-80 block mt-0.5 break-words">
                {passedCount} of {totalCount} essentials verified
                {criticalMissingCount > 0 ? ` · ${criticalMissingCount} critical missing` : ''}
              </span>
            </div>
          </div>
          <div className="w-full sm:w-24 bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden shrink-0">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                healthStatus === 'ready' ? 'bg-emerald-500' : healthStatus === 'needs_attention' ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${(passedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] sm:rounded-[28px] border p-4 sm:p-6 bg-white dark:bg-[#181D20] border-stone-200 dark:border-stone-800 space-y-5 sm:space-y-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug break-words">
              Guide Health & Guest Readiness Checker
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            Before publishing, ensure guests have every essential detail to avoid midnight calls.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
          <div className="sm:text-right">
            <span className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100 block">
              {passedCount} / {totalCount} Checked
            </span>
            <span className="text-[10px] block uppercase tracking-wider font-semibold text-stone-400">
              {healthStatus === 'ready' ? 'Ready to Publish' : `${totalCount - passedCount} items need attention`}
            </span>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-100 dark:text-stone-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={healthStatus === 'ready' ? 'text-emerald-500' : healthStatus === 'needs_attention' ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${(passedCount / totalCount) * 100}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
              {Math.round((passedCount / totalCount) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border flex items-start justify-between gap-2.5 sm:gap-3 transition-colors min-w-0 ${
              item.status === 'passed'
                ? 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800'
                : item.status === 'warning'
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
                : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40'
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="mt-0.5 shrink-0">{getStatusIcon(item.status)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 break-words leading-snug">
                    {item.title}
                  </span>
                  {item.importance === 'critical' && item.status !== 'passed' && (
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug line-clamp-2 break-words">
                  {item.description}
                </p>
              </div>
            </div>

            {item.status !== 'passed' && (
              <button
                type="button"
                onClick={() => onNavigateToSection(item.sectionKey)}
                className="shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1 active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <span>Fix</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
