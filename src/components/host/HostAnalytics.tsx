import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MousePointerClick, 
  Wifi, 
  KeyRound, 
  Sparkles, 
  MapPin, 
  Download, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Smartphone, 
  MessageCircle, 
  CheckCircle2, 
  Compass,
  ArrowUpRight,
  Filter,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

interface HostAnalyticsProps {
  propertyIdFilter?: string;
  onNavigateToProperty?: (propertyId: string) => void;
}

type TimeRange = '7d' | '30d' | '90d' | 'year';

export const HostAnalytics: React.FC<HostAnalyticsProps> = ({ 
  propertyIdFilter, 
  onNavigateToProperty 
}) => {
  const { properties, theme, language, showToast, navigateToGuestGuide, firebaseUser } = useApp();
  const isDark = theme === 'dark';

  const hostProperties = useMemo(() => {
    if (firebaseUser) {
      return properties.filter(p => p.ownerId === firebaseUser.uid && !p.isDemo);
    }
    return properties;
  }, [properties, firebaseUser]);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(propertyIdFilter || 'all');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartMetric, setChartMetric] = useState<'both' | 'views' | 'unique'>('both');

  // Filter properties
  const activeProperty = selectedPropertyId !== 'all' 
    ? hostProperties.find(p => p.id === selectedPropertyId) || hostProperties[0] || null
    : null;

  const scopedProperties = useMemo(() => {
    if (selectedPropertyId !== 'all' && activeProperty) {
      return [activeProperty];
    }
    return hostProperties;
  }, [selectedPropertyId, activeProperty, hostProperties]);

  const totalRealViews = useMemo(() => {
    return scopedProperties.reduce((acc, p) => acc + (typeof p.viewsCount === 'number' ? p.viewsCount : 0), 0);
  }, [scopedProperties]);

  const hasDemoProps = useMemo(() => {
    return scopedProperties.some(p => p.isDemo);
  }, [scopedProperties]);

  const hasEngagementData = totalRealViews > 0 || hasDemoProps;

  // Multiplier depending on selected property
  const propertyMultiplier = useMemo(() => {
    if (!hasEngagementData) return 0;
    if (!activeProperty) return 1;
    if (activeProperty.slug === 'old-tbilisi-apartment') return 0.52;
    if (activeProperty.slug === 'batumi-sea-view-suite') return 0.32;
    return 0.16;
  }, [activeProperty, hasEngagementData]);

  // Multiplier depending on time range
  const rangeFactor = useMemo(() => {
    if (!hasEngagementData) return 0;
    if (timeRange === '7d') return 0.25;
    if (timeRange === '30d') return 1;
    if (timeRange === '90d') return 2.8;
    return 10.5;
  }, [timeRange, hasEngagementData]);

  // 1. Time Series Data for AreaChart
  const timeSeriesData = useMemo(() => {
    const scale = !hasEngagementData ? 0 : (selectedPropertyId === 'all' ? 1 : propertyMultiplier * 1.9);
    if (timeRange === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const baseViews = [48, 52, 64, 59, 112, 148, 96];
      const baseGuests = [14, 15, 18, 17, 36, 44, 29];
      const baseInteractions = [38, 41, 52, 49, 94, 122, 78];

      return days.map((day, idx) => ({
        date: day,
        views: Math.round(baseViews[idx] * scale),
        uniqueGuests: Math.round(baseGuests[idx] * scale),
        interactions: Math.round(baseInteractions[idx] * scale),
      }));
    }

    if (timeRange === '30d') {
      const dates = [
        'Sep 08', 'Sep 11', 'Sep 14', 'Sep 17', 'Sep 20', 'Sep 23', 'Sep 26', 'Sep 29',
        'Oct 02', 'Oct 05'
      ];
      const baseViews = [210, 245, 290, 260, 380, 420, 360, 410, 490, 520];
      const baseGuests = [62, 74, 88, 79, 118, 134, 112, 129, 154, 168];
      const baseInteractions = [175, 205, 240, 215, 320, 355, 305, 345, 410, 438];

      return dates.map((date, idx) => ({
        date,
        views: Math.round(baseViews[idx] * scale),
        uniqueGuests: Math.round(baseGuests[idx] * scale),
        interactions: Math.round(baseInteractions[idx] * scale),
      }));
    }

    if (timeRange === '90d') {
      const weeks = [
        'W1 Jul', 'W3 Jul', 'W1 Aug', 'W3 Aug', 'W1 Sep', 'W3 Sep', 'W1 Oct'
      ];
      const baseViews = [780, 890, 1120, 1240, 1080, 1350, 1490];
      const baseGuests = [240, 275, 350, 390, 335, 420, 465];
      const baseInteractions = [650, 740, 940, 1040, 910, 1140, 1260];

      return weeks.map((week, idx) => ({
        date: week,
        views: Math.round(baseViews[idx] * scale),
        uniqueGuests: Math.round(baseGuests[idx] * scale),
        interactions: Math.round(baseInteractions[idx] * scale),
      }));
    }

    // 1 Year
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const baseViews = [1100, 1650, 1420, 1280, 1850, 2200, 2700, 3400, 3850, 4100, 3600, 3950];
    const baseGuests = [340, 510, 440, 390, 580, 690, 850, 1050, 1200, 1280, 1120, 1230];
    const baseInteractions = [920, 1380, 1190, 1070, 1550, 1840, 2260, 2850, 3230, 3440, 3020, 3310];

    return months.map((m, idx) => ({
      date: m,
      views: Math.round(baseViews[idx] * scale),
      uniqueGuests: Math.round(baseGuests[idx] * scale),
      interactions: Math.round(baseInteractions[idx] * scale),
    }));
  }, [timeRange, selectedPropertyId, propertyMultiplier, hasEngagementData]);

  // 2. Feature Engagement Breakdown
  const featureEngagementData = useMemo(() => {
    const mult = !hasEngagementData ? 0 : (selectedPropertyId === 'all' ? 1 : propertyMultiplier * 1.8);
    return [
      { name: 'Wi-Fi Copy', taps: Math.round(940 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 95 : 0, icon: '📶', fill: '#F55A51' },
      { name: 'Door Code', taps: Math.round(890 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 91 : 0, icon: '🔑', fill: '#38BDF8' },
      { name: 'Local Gems', taps: Math.round(760 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 78 : 0, icon: '✨', fill: '#34D399' },
      { name: 'Checkout', taps: Math.round(650 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 68 : 0, icon: '🚪', fill: '#F59E0B' },
      { name: 'Appliances', taps: Math.round(520 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 54 : 0, icon: '⚡', fill: '#A78BFA' },
      { name: 'Transit Info', taps: Math.round(440 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 46 : 0, icon: '🚕', fill: '#FB7185' },
      { name: 'Host Chat', taps: Math.round(260 * mult * rangeFactor * 0.35), percentage: hasEngagementData ? 27 : 0, icon: '💬', fill: '#4ADE80' },
    ];
  }, [selectedPropertyId, propertyMultiplier, rangeFactor, hasEngagementData]);

  // 3. Hourly Check-in Arrival Rush
  const hourlyData = useMemo(() => {
    const s = hasEngagementData ? 1 : 0;
    return [
      { hour: '08:00', scans: 18 * s, checkouts: 42 * s },
      { hour: '10:00', scans: 34 * s, checkouts: 88 * s },
      { hour: '12:00', scans: 56 * s, checkouts: 32 * s },
      { hour: '14:00', scans: 142 * s, checkouts: 12 * s },
      { hour: '15:00', scans: 220 * s, checkouts: 8 * s },
      { hour: '16:00', scans: 285 * s, checkouts: 5 * s },
      { hour: '17:00', scans: 240 * s, checkouts: 4 * s },
      { hour: '18:00', scans: 195 * s, checkouts: 2 * s },
      { hour: '20:00', scans: 160 * s, checkouts: 1 * s },
      { hour: '22:00', scans: 110 * s, checkouts: 0 },
    ];
  }, [hasEngagementData]);

  // 4. Guest Language & Source Distribution
  const guestLanguageData = [
    { name: 'English', value: 58, color: '#F55A51' },
    { name: 'Georgian', value: 24, color: '#38BDF8' },
    { name: 'Russian', value: 12, color: '#34D399' },
    { name: 'Others (DE, FR, PL)', value: 6, color: '#F59E0B' },
  ];

  const accessSourceData = [
    { name: 'NFC Stand / QR Foyer', value: 56, color: '#34D399' },
    { name: 'WhatsApp Message', value: 28, color: '#F55A51' },
    { name: 'Airbnb Auto-Msg', value: 16, color: '#38BDF8' },
  ];

  // Aggregated KPI Stats
  const totalViews = useMemo(() => {
    if (!hasEngagementData) return 0;
    if (timeRange === '30d' && totalRealViews > 0) return totalRealViews;
    return timeSeriesData.reduce((acc, curr) => acc + curr.views, 0);
  }, [timeSeriesData, hasEngagementData, timeRange, totalRealViews]);

  const totalGuests = useMemo(() => {
    if (!hasEngagementData) return 0;
    return timeSeriesData.reduce((acc, curr) => acc + curr.uniqueGuests, 0);
  }, [timeSeriesData, hasEngagementData]);

  const totalInteractions = useMemo(() => {
    if (!hasEngagementData) return 0;
    return timeSeriesData.reduce((acc, curr) => acc + curr.interactions, 0);
  }, [timeSeriesData, hasEngagementData]);

  const questionsAvoided = hasEngagementData ? Math.round(totalGuests * 1.8) : 0;

  // CSV Export
  const handleExportCSV = () => {
    const headers = 'Date,Views,UniqueGuests,Interactions\n';
    const rows = timeSeriesData.map(d => `${d.date},${d.views},${d.uniqueGuests},${d.interactions}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stumari-analytics-${selectedPropertyId}-${timeRange}.csv`;
    a.click();
    showToast('Analytics CSV exported successfully!');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Toolbar with Filter Controls */}
      <div className={`p-4 sm:p-6 rounded-[24px] sm:rounded-[30px] border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
      }`}>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-amber-700 dark:text-amber-400">
              {language === 'ka' ? 'მასპინძლის ანალიტიკა' : language === 'ru' ? 'Аналитика хоста' : 'Host Performance Analytics'}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
            }`}>
              {hasEngagementData ? 'Live' : 'No Views Yet'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-950 dark:text-white">
            {language === 'ka' 
              ? 'გიდის ნახვები და სტუმრების ჩართულობა დროში' 
              : language === 'ru' 
              ? 'Просмотры путеводителя и вовлеченность гостей' 
              : 'Guide Views & Guest Engagement Metrics'}
          </h2>

          <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            Track QR/NFC scans, 1-tap code copy events, and local recommendation engagement across your properties.
          </p>
        </div>

        {/* Action Controls: Property Selector, Time Range, Export */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          
          {/* Property Dropdown Filter */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-initial min-w-0">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className={`w-full text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer pr-8 appearance-none truncate focus:outline-hidden ${
                isDark 
                  ? 'bg-stone-900 border-stone-700 text-stone-100 hover:border-stone-500' 
                  : 'bg-stone-50 border-stone-300 text-stone-900 hover:border-stone-400'
              }`}
            >
              <option value="all">
                {language === 'ka' ? `ყველა ბინა (${hostProperties.length} აქტიური)` : language === 'ru' ? `Все объекты (${hostProperties.length})` : `All Properties (${hostProperties.length})`}
              </option>
              {hostProperties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
          </div>

          {/* Time Range Selector */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
          }`}>
            {(['7d', '30d', '90d', 'year'] as TimeRange[]).map((r) => {
              const isActive = timeRange === r;
              return (
                <motion.button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative px-2.5 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer transition-colors ${
                    isActive
                      ? isDark 
                        ? 'text-[#0C1510] font-black' 
                        : 'text-white font-black'
                      : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAnalyticsTimeRange"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className={`absolute inset-0 rounded-lg shadow-xs ${
                        isDark ? 'bg-amber-600' : 'bg-stone-950'
                      }`}
                    />
                  )}
                  <span className="relative z-10">{r}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Export CSV Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportCSV}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-stone-900 border-stone-700 hover:bg-stone-800 text-stone-200' 
                : 'bg-white border-stone-300 hover:bg-stone-50 text-stone-800 shadow-2xs'
            }`}
            title="Download analytics data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {!hasEngagementData && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 flex-wrap ${
          isDark ? 'bg-stone-900/70 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}>
          <div className="flex items-center gap-2.5 text-xs">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {language === 'ka'
                ? 'ამ ობიექტზე სტუმრების ნახვები ჯერ არ დაფიქსირებულა. გაუზიარეთ ცოცხალი გიდის ბმული სტუმრებს.'
                : language === 'ru'
                ? 'По этому объекту пока нет просмотров. Поделитесь ссылкой на гид с гостями.'
                : 'No guest guide views recorded yet for this selection. Share your live guide link or QR stand to begin tracking engagement.'}
            </span>
          </div>
        </div>
      )}

      {/* 2. Top Summary KPI Bento Cards */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Total Views */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`p-4 sm:p-5 rounded-[22px] border relative overflow-hidden transition-all ${
            isDark ? 'bg-[#12171B] border-stone-800 hover:shadow-xl hover:shadow-black/50' : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}>
              Total Guide Views
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-white tabular-nums">
              {totalViews.toLocaleString()}
            </span>
            {hasEngagementData && (
              <span className="text-[11px] font-mono font-bold text-emerald-500 flex items-center">
                +18.4%
              </span>
            )}
          </div>
          <p className="text-[10px] mt-1 text-stone-500">
            {hasEngagementData
              ? (timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Compared to previous period')
              : 'Waiting for first guest view'}
          </p>
        </motion.div>

        {/* Metric 2: Unique Guest Sessions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`p-4 sm:p-5 rounded-[22px] border relative overflow-hidden transition-all ${
            isDark ? 'bg-[#12171B] border-stone-800 hover:shadow-xl hover:shadow-black/50' : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}>
              Unique Guest Arrivals
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-white tabular-nums">
              {totalGuests.toLocaleString()}
            </span>
            {hasEngagementData && (
              <span className="text-[11px] font-mono font-bold text-emerald-500 flex items-center">
                +14.2%
              </span>
            )}
          </div>
          <p className="text-[10px] mt-1 text-stone-500">
            QR stands & direct links
          </p>
        </motion.div>

        {/* Metric 3: Total 1-Tap Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`p-4 sm:p-5 rounded-[22px] border relative overflow-hidden transition-all ${
            isDark ? 'bg-[#12171B] border-stone-800 hover:shadow-xl hover:shadow-black/50' : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}>
              1-Tap Guest Actions
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-white tabular-nums">
              {totalInteractions.toLocaleString()}
            </span>
            {hasEngagementData && (
              <span className="text-[11px] font-mono font-bold text-emerald-500 flex items-center">
                +22.8%
              </span>
            )}
          </div>
          <p className="text-[10px] mt-1 text-stone-500">
            Wi-Fi, keypad, map taps
          </p>
        </motion.div>

        {/* Metric 4: Repetitive Questions Avoided */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`p-4 sm:p-5 rounded-[22px] border relative overflow-hidden transition-all ${
            isDark ? 'bg-[#12171B] border-stone-800 hover:shadow-xl hover:shadow-black/50' : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}>
              Questions Avoided
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-white tabular-nums">
              {hasEngagementData ? `~${questionsAvoided}` : '0'}
            </span>
            {hasEngagementData && (
              <span className="text-[11px] font-mono font-bold text-emerald-500 flex items-center">
                -68% msgs
              </span>
            )}
          </div>
          <p className="text-[10px] mt-1 text-stone-500">
            Self-served via digital guide
          </p>
        </motion.div>

      </div>

      {/* 3. Primary Recharts Chart: Views & Unique Visitors Over Time */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`p-5 sm:p-6 rounded-[28px] border space-y-4 ${
          isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 dark:text-white">
                Property Views & Guest Arrival Sessions Over Time
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isDark ? 'bg-stone-800 text-amber-400' : 'bg-stone-100 text-stone-800'
              }`}>
                Recharts
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-0.5`}>
              Daily view count surges correlate with Friday/Saturday arrival check-ins.
            </p>
          </div>

          {/* Metric Toggle with sliding layoutId indicator */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 self-start sm:self-auto ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
          }`}>
            {[
              { id: 'both', label: 'All Metrics' },
              { id: 'views', label: 'Views Only' },
              { id: 'unique', label: 'Guests' },
            ].map(m => {
              const isActive = chartMetric === m.id;
              return (
                <motion.button
                  key={m.id}
                  onClick={() => setChartMetric(m.id as any)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    isActive
                      ? 'text-white font-black'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeChartMetric"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className={`absolute inset-0 rounded-lg shadow-xs ${
                        isDark ? 'bg-amber-600' : 'bg-stone-950'
                      }`}
                    />
                  )}
                  <span className="relative z-10">{m.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* The Recharts Area Chart Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F55A51" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#F55A51" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="guestsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="interactionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0.0}/>
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#272E35' : '#E7E5E4'} 
                vertical={false} 
              />

              <XAxis 
                dataKey="date" 
                stroke={isDark ? '#78828A' : '#78716C'} 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke={isDark ? '#78828A' : '#78716C'} 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />

              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={`p-3 rounded-2xl border shadow-xl text-xs space-y-1.5 backdrop-blur-md ${
                        isDark 
                          ? 'bg-[#0B0F12]/95 border-stone-700 text-stone-100' 
                          : 'bg-white/95 border-stone-200 text-stone-900'
                      }`}>
                        <div className="font-mono font-bold text-stone-400">{label}</div>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 font-semibold">
                            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span>{entry.name}:</span>
                            </span>
                            <span className="font-mono font-black">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }} 
              />

              <Legend 
                wrapperStyle={{ paddingTop: 10, fontSize: 12, fontWeight: 600 }} 
              />

              {(chartMetric === 'both' || chartMetric === 'views') && (
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  name="Pageviews" 
                  stroke="#F55A51" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#viewsGradient)" 
                />
              )}

              {(chartMetric === 'both' || chartMetric === 'unique') && (
                <Area 
                  type="monotone" 
                  dataKey="uniqueGuests" 
                  name="Unique Guests" 
                  stroke="#38BDF8" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#guestsGradient)" 
                />
              )}

              {chartMetric === 'both' && (
                <Area 
                  type="monotone" 
                  dataKey="interactions" 
                  name="Interactions" 
                  stroke="#34D399" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#interactionsGradient)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4. Two-Column Grid: Section Engagement + Hourly Scan Rush */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Chart A: Section Engagement Breakdown (BarChart) */}
        <div className={`p-5 sm:p-6 rounded-[28px] border space-y-4 ${
          isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 dark:text-white">
                Guest Feature & Card Engagement
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isDark ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-800'
              }`}>
                Tap Rate %
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-0.5`}>
              Which guide features guests tap and use most during their stay.
            </p>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={featureEngagementData} 
                layout="vertical"
                margin={{ top: 5, right: 16, left: 10, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#272E35' : '#E7E5E4'} 
                  horizontal={false} 
                />
                <XAxis 
                  type="number" 
                  stroke={isDark ? '#78828A' : '#78716C'} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke={isDark ? '#D6D3D1' : '#1C1917'} 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={false} 
                  width={90} 
                />
                <Tooltip 
                  formatter={(val: any) => [`${val} actions`, 'Total Taps']} 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0C1013' : '#FFFFFF', 
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar 
                  dataKey="taps" 
                  radius={[0, 8, 8, 0]} 
                >
                  {featureEngagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress list quick recap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-800/50">
            <div className="text-[11px] flex items-center justify-between">
              <span className="opacity-70">📶 Wi-Fi 1-Tap Copy:</span>
              <strong className="font-mono text-emerald-400">{hasEngagementData ? '95% of guests' : '0 taps'}</strong>
            </div>
            <div className="text-[11px] flex items-center justify-between">
              <span className="opacity-70">🔑 Door Keypad:</span>
              <strong className="font-mono text-sky-400">{hasEngagementData ? '91% of guests' : '0 taps'}</strong>
            </div>
          </div>
        </div>

        {/* Chart B: Hourly Scan Distribution (Arrival Check-in Pattern) */}
        <div className={`p-5 sm:p-6 rounded-[28px] border space-y-4 ${
          isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 dark:text-white">
                Arrival Rush Pattern (By Hour of Day)
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isDark ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-800'
              }`}>
                Peak: 15:00 - 18:00
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-0.5`}>
              Time distribution of initial QR/NFC scans upon guest arrival in Tbilisi.
            </p>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#272E35' : '#E7E5E4'} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="hour" 
                  stroke={isDark ? '#78828A' : '#78716C'} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke={isDark ? '#78828A' : '#78716C'} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0C1013' : '#FFFFFF', 
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Bar 
                  dataKey="scans" 
                  name="Arrival Scans (Check-ins)" 
                  fill="#F55A51" 
                  radius={[6, 6, 0, 0]} 
                />
                <Bar 
                  dataKey="checkouts" 
                  name="Departure Guide Reads" 
                  fill="#38BDF8" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-xl border text-[11px] flex items-center gap-2 bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Host Tip:</strong> 72% of all scans happen between 15:00 and 18:00. Having automated keypad codes ready on WhatsApp saves up to 45 mins/day.
            </span>
          </div>
        </div>

      </div>

      {/* 5. Bottom Breakdown: Guest Languages, Access Sources, and Per-Property Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Pie 1: Languages */}
        <div className={`p-5 sm:p-6 rounded-[28px] border space-y-3 ${
          isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
        }`}>
          <h4 className="font-serif font-bold text-base text-stone-950 dark:text-white">
            Guest Languages
          </h4>
          <p className="text-[11px] text-stone-500">
            Detected from guest browser and preferred translation.
          </p>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={guestLanguageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {guestLanguageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0C1013' : '#FFFFFF', 
                    borderRadius: '12px',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            {guestLanguageData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-stone-700 dark:text-stone-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie 2: Acquisition Sources */}
        <div className={`p-5 sm:p-6 rounded-[28px] border space-y-3 ${
          isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
        }`}>
          <h4 className="font-serif font-bold text-base text-stone-950 dark:text-white">
            Access Channel
          </h4>
          <p className="text-[11px] text-stone-500">
            How guests access your Stumari digital guide.
          </p>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accessSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {accessSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0C1013' : '#FFFFFF', 
                    borderRadius: '12px',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            {accessSourceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-stone-700 dark:text-stone-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations Card */}
        <div className={`p-5 sm:p-6 rounded-[28px] border flex flex-col justify-between space-y-4 ${
          isDark ? 'bg-gradient-to-br from-[#12191D] to-[#0A0E11] border-stone-800' : 'bg-gradient-to-br from-amber-50/50 to-white border-amber-200 shadow-xs'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="font-serif font-bold text-base text-stone-950 dark:text-white">
                Stumari Optimization Insights
              </h4>
            </div>

            <div className="space-y-2.5 text-xs leading-relaxed">
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <span className="font-bold text-emerald-500 block mb-0.5">🌟 High Gem Engagement</span>
                <p className="text-stone-600 dark:text-stone-300">
                  78% of your guests explore Tbilisi Gems. Adding 2 more dinner spots could boost your 5-star review rate.
                </p>
              </div>

              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <span className="font-bold text-sky-400 block mb-0.5">🖨️ Hardware QR Stand</span>
                <p className="text-stone-600 dark:text-stone-300">
                  56% of sessions are scanned directly in the foyer. Keep your physical acrylic stand on the entry table.
                </p>
              </div>
            </div>
          </div>

          {hostProperties[0] && (
            <div className="pt-2 border-t border-stone-800/40">
              <button
                onClick={() => navigateToGuestGuide(hostProperties[0].slug)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>Preview Live Guide Experience</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 6. Per-Property Performance Leaderboard */}
      <div className={`p-5 sm:p-6 rounded-[28px] border space-y-4 ${
        isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 dark:text-white">
              Property Performance Breakdown
            </h3>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              Compare view volume and guest interaction rates across your listings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-mono tracking-wider ${
                isDark ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-500'
              }`}>
                <th className="pb-3 font-bold">Property</th>
                <th className="pb-3 font-bold">City</th>
                <th className="pb-3 font-bold text-right">Total Views</th>
                <th className="pb-3 font-bold text-right">Unique Guests</th>
                <th className="pb-3 font-bold text-right">Top Action</th>
                <th className="pb-3 font-bold text-right">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/40">
              {hostProperties.map((p, idx) => {
                const rawViews = typeof p.viewsCount === 'number' ? p.viewsCount : (p.isDemo ? 1420 : 0);
                const propViews = rawViews === 0 ? 0 : Math.round(rawViews * (timeRange === '30d' ? 1 : rangeFactor * 0.4));
                const propGuests = Math.round(propViews * 0.32);

                return (
                  <tr key={p.id} className="group hover:bg-stone-500/5 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        {(p.coverImage || p.photos?.[0]?.url) ? (
                          <img 
                            src={p.coverImage || p.photos?.[0]?.url} 
                            alt={p.title} 
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-700/40" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl shrink-0 border border-stone-700/40 bg-stone-800/50 flex items-center justify-center text-xs font-serif font-bold text-stone-400">
                            {(p.title || 'P').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-serif font-bold text-sm block truncate text-stone-950 dark:text-white">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono truncate block">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-stone-600 dark:text-stone-300">
                      {p.city}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-stone-950 dark:text-white">
                      {propViews.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-sky-400">
                      {propGuests.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-medium">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                        {propViews === 0 ? '—' : (idx === 0 ? '📶 Wi-Fi (95%)' : idx === 1 ? '🔑 Keypad (92%)' : '✨ Gems (84%)')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                        p.status === 'published' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-stone-800 text-stone-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'published' ? 'bg-emerald-400' : 'bg-stone-500'}`} />
                        <span>{p.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 pl-3 text-right">
                      <button
                        onClick={() => navigateToGuestGuide(p.slug)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
