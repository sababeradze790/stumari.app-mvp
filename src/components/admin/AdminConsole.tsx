import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Eye, 
  QrCode, 
  TrendingUp, 
  Star, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  ExternalLink, 
  Bell, 
  Sun, 
  Moon, 
  RefreshCw, 
  Copy, 
  Layers, 
  Sparkles, 
  Compass, 
  MessageSquareHeart, 
  Headphones, 
  CreditCard, 
  Cpu, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Plus, 
  Smartphone, 
  Check, 
  ArrowUpRight,
  Filter,
  Package,
  Wrench,
  Globe2,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from '../common/StumariLogo';
import { MOCK_ADMIN_HOSTS, MOCK_PLATFORM_STATS } from '../../data/mockData';

// Chart Activity Data matching REFERENCE A
const ACTIVITY_TIMELINE_DATA = [
  { name: 'Sep 8', views: 820, scans: 410, wifi: 220, gems: 140 },
  { name: 'Sep 15', views: 1140, scans: 620, wifi: 380, gems: 260 },
  { name: 'Sep 22', views: 1490, scans: 880, wifi: 510, gems: 390 },
  { name: 'Sep 29', views: 1842, scans: 1120, wifi: 690, gems: 520 },
  { name: 'Oct 6', views: 1680, scans: 990, wifi: 590, gems: 460 },
];

const PLAN_DISTRIBUTION_DATA = [
  { name: 'Pro', value: 28, pct: '67%', color: '#D97706' },
  { name: 'Free', value: 12, pct: '29%', color: '#3B82F6' },
  { name: 'Enterprise', value: 2, pct: '5%', color: '#8B5CF6' },
];

export const AdminConsole: React.FC = () => {
  const { 
    properties, 
    setCurrentRoute, 
    navigateToGuestGuide, 
    navigateToPropertyHub, 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    showToast,
    feedbacks
  } = useApp();

  const isDark = theme === 'dark';

  // Navigation tab matching REFERENCE A
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hosts' | 'properties' | 'activity' | 'gems' | 'qr' | 'reviews' | 'support' | 'billing' | 'system' | 'settings'
  >('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'30days' | '7days' | 'today'>('30days');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');

  // Platform setting states
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Stumari',
    supportEmail: 'support@stumari.app',
    supportWhatsApp: '+995 555 123 456',
    defaultCurrency: 'USD ($)',
    maintenanceMode: false
  });

  const handlePurgeCache = () => {
    showToast(language === 'ka' ? 'ქეში წარმატებით გასუფთავდა' : 'Edge PWA cache purged successfully');
  };

  const navItems = [
    { id: 'overview', label: language === 'ka' ? 'მიმოხილვა' : 'Overview', icon: Building2 },
    { id: 'hosts', label: language === 'ka' ? 'ჰოსტები' : 'Hosts', icon: Users, badge: '42' },
    { id: 'properties', label: language === 'ka' ? 'ობიექტები' : 'Properties', icon: Layers, badge: String(properties.length) },
    { id: 'activity', label: language === 'ka' ? 'სტუმრების აქტივობა' : 'Guest Activity', icon: TrendingUp },
    { id: 'gems', label: language === 'ka' ? 'Gems (კონტენტი)' : 'Gems Content', icon: Compass, badge: '156' },
    { id: 'qr', label: language === 'ka' ? 'QR / NFC' : 'QR / NFC Stands', icon: QrCode, badge: '2 new' },
    { id: 'reviews', label: language === 'ka' ? 'შეფასებები' : 'Reviews', icon: Star, badge: String(feedbacks.length) },
    { id: 'support', label: language === 'ka' ? 'მხარდაჭერა' : 'Support', icon: Headphones },
    { id: 'billing', label: language === 'ka' ? 'ბილინგი' : 'Billing', icon: CreditCard },
    { id: 'system', label: language === 'ka' ? 'სისტემა' : 'System Status', icon: Cpu },
    { id: 'settings', label: language === 'ka' ? 'პარამეტრები' : 'Settings', icon: Settings },
  ];

  const topHostsLeaderboard = [
    { rank: 1, name: 'Saba Beradze', plan: 'PRO', propertiesCount: 5, rating: 4.98, views: 342, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { rank: 2, name: 'Nino Chikovani', plan: 'PRO', propertiesCount: 3, rating: 4.91, views: 218, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { rank: 3, name: 'David Giorgadze', plan: 'PRO', propertiesCount: 4, rating: 4.87, views: 191, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { rank: 4, name: 'Ana Kalandadze', plan: 'FREE', propertiesCount: 1, rating: 4.80, views: 96, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { rank: 5, name: 'Giorgi Meladze', plan: 'PRO', propertiesCount: 6, rating: 4.79, views: 88, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  ];

  const needsAttentionList = [
    { id: 1, title: language === 'ka' ? '3 ჰოსტმა არ დაასრულა onboarding-ი' : '3 hosts incomplete onboarding', count: 3, type: 'critical', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
    { id: 2, title: language === 'ka' ? '4 ობიექტს არ აქვს Wi-Fi ინფორმაცია' : '4 properties missing Wi-Fi info', count: 4, type: 'warning', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10' },
    { id: 3, title: language === 'ka' ? '2 QR/NFC შეკვეთა დამუშავებას ელის' : '2 QR/NFC orders awaiting fulfillment', count: 2, type: 'order', icon: Package, color: 'text-purple-500 bg-purple-500/10' },
    { id: 4, title: language === 'ka' ? '5 ახალი უარყოფითი შეფასება' : '5 stay feedback items received', count: 5, type: 'feedback', icon: Star, color: 'text-rose-500 bg-rose-500/10' },
    { id: 5, title: language === 'ka' ? '1 ტექნიკური პრობლემა' : '1 technical router report', count: 1, type: 'tech', icon: Wrench, color: 'text-sky-500 bg-sky-500/10' },
  ];

  const recentActivityStream = [
    { id: 1, text: language === 'ka' ? 'ახალი ჰოსტი დარეგისტრირდა' : 'New host registered', user: 'Nino Chikovani', time: '2 წთ წინ' },
    { id: 2, text: language === 'ka' ? 'ახალი ობიექტი დაემატა' : 'New property added', user: 'Kazbegi Cabin', time: '8 წთ წინ' },
    { id: 3, text: language === 'ka' ? 'QR სკანირებული' : 'QR code scanned', user: 'Old Tbilisi Apartment', time: '12 წთ წინ' },
    { id: 4, text: language === 'ka' ? 'ახალი შეფასება (5.0)' : 'New 5-star review left', user: 'Sunny Sololaki', time: '25 წთ წინ' },
    { id: 5, text: language === 'ka' ? 'Wi-Fi კოდი დაკოპირდა' : 'Wi-Fi credentials copied', user: 'Batumi Sea View', time: '34 წთ წინ' },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 tracking-tight ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAFAF8] text-zinc-900'
    }`}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Matching REFERENCE A)              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <aside className={`w-full md:w-64 shrink-0 border-r transition-colors flex flex-col justify-between p-4 ${
        isDark ? 'bg-[#14151B] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
      }`}>
        <div className="space-y-6">
          {/* Brand Header with Admin Badge */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div 
              onClick={() => setCurrentRoute('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs transition-colors shrink-0 ${
                isDark ? 'bg-stone-900 border-stone-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                <StumariArchIcon size={18} className={isDark ? 'text-amber-400' : 'text-amber-700'} />
              </div>
              <div>
                <span className="font-serif tracking-[0.2em] text-base font-bold uppercase leading-none block">
                  STUMARI
                </span>
                <span className="text-[9px] font-mono uppercase font-bold text-emerald-500 tracking-wider">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase">
              Admin
            </span>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-amber-600 text-white font-bold shadow-xs' 
                      : isDark
                      ? 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      isActive 
                        ? 'bg-black/25 text-white' 
                        : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Cards */}
        <div className="pt-4 space-y-2 border-t border-stone-200/70 dark:border-stone-800/70">
          <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
            isDark ? 'bg-[#12181C] border-stone-800/80 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-amber-500">👑</span>
              <span className="font-bold text-[11px]">Stumari MVP</span>
            </div>
            <span className="font-mono text-[10px] opacity-70">v1.0.0</span>
          </div>

          <button
            onClick={() => setCurrentRoute('/app')}
            className={`w-full p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-colors ${
              isDark ? 'border-stone-800 hover:bg-stone-850 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-stone-400" />
              <span>{language === 'ka' ? 'Host SaaS-ზე გადასვლა' : 'Switch to Host SaaS'}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN CONSOLE WORKSPACE                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Top Operational Command Bar (Search + Quick Tools) */}
        <header className={`px-4 sm:px-8 py-3.5 border-b flex items-center justify-between gap-3 shrink-0 backdrop-blur-md sticky top-0 z-30 transition-colors ${
          isDark ? 'bg-[#0B0F12]/90 border-stone-800/80' : 'bg-[#FAF9F6]/90 border-stone-200/80'
        }`}>
          {/* Universal Search Input matching REFERENCE A */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text"
              placeholder={language === 'ka' ? 'მოძებნე ჰოსტი, ობიექტი, QR კოდი, სტუმარი...' : 'Search host, property, QR code, guest...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-2xl border text-xs transition-all focus:outline-none ${
                isDark 
                  ? 'bg-[#12181C] border-stone-800 text-stone-100 focus:border-amber-500' 
                  : 'bg-white border-stone-200 text-stone-900 focus:border-amber-600 shadow-2xs'
              }`}
            />
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'border-stone-800 hover:bg-stone-850 text-stone-300' : 'border-stone-200 hover:bg-white text-stone-700'
              }`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Selector */}
            <div className={`flex items-center border rounded-xl p-0.5 text-xs font-bold ${
              isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
            }`}>
              {(['ka', 'en', 'ru'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-lg uppercase text-[10px] transition-colors ${
                    language === lang 
                      ? 'bg-amber-600 text-white font-bold' 
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <button className={`p-2 rounded-xl border relative transition-colors ${
              isDark ? 'border-stone-800 hover:bg-stone-850 text-stone-300' : 'border-stone-200 hover:bg-white text-stone-700'
            }`}>
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>

            {/* Admin User Pill */}
            <div className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs font-semibold ${
              isDark ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-white border-stone-200 text-stone-800'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Saba" 
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden sm:inline">Saba Beradze</span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">Admin</span>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 3. DYNAMIC TAB VIEW ROUTER                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-8 space-y-6 flex-1">

          {/* TAB 1: OVERVIEW DASHBOARD (STRICTLY MATCHING REFERENCE A) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Header Greeting & Date Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'კარგი დღე, Saba 👋' : 'Good day, Saba 👋'}
                  </h1>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {language === 'ka' ? 'აი, რა ხდება Stumari ეკოსისტემაში დღეს.' : 'Here is what is happening in the Stumari ecosystem today.'}
                  </p>
                </div>

                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-semibold ${
                  isDark ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-700 shadow-2xs'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{language === 'ka' ? 'დღეს, 8 ოქტომბერი' : 'Today, 8 October'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              {/* 5 TOP METRIC CARDS (Exact match to REFERENCE A) */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                
                {/* 1. აქტიური ჰოსტები (Active Hosts) */}
                <div className={`p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      +12%
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl sm:text-3xl font-serif font-bold block leading-none">42</span>
                    <span className={`text-xs font-semibold block mt-1 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {language === 'ka' ? 'აქტიური ჰოსტები' : 'Active Hosts'}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {language === 'ka' ? 'შედარებით წინა თვესთან' : 'vs last month'}
                    </span>
                  </div>
                </div>

                {/* 2. ობიექტები (Properties) */}
                <div className={`p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full">
                      +8%
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl sm:text-3xl font-serif font-bold block leading-none">87</span>
                    <span className={`text-xs font-semibold block mt-1 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {language === 'ka' ? 'ობიექტები' : 'Properties'}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {language === 'ka' ? 'სულ რეგისტრირებული' : 'Total registered'}
                    </span>
                  </div>
                </div>

                {/* 3. აქტიური სტუმრები (Active Guests) */}
                <div className={`p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      +24%
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl sm:text-3xl font-serif font-bold block leading-none">1,284</span>
                    <span className={`text-xs font-semibold block mt-1 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {language === 'ka' ? 'აქტიური სტუმრები' : 'Active Guests'}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {language === 'ka' ? 'ბოლო 30 დღე' : 'Last 30 days'}
                    </span>
                  </div>
                </div>

                {/* 4. QR / NFC სკანები (QR/NFC Scans) */}
                <div className={`p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      +31%
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl sm:text-3xl font-serif font-bold block leading-none">12,436</span>
                    <span className={`text-xs font-semibold block mt-1 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {language === 'ka' ? 'QR / NFC სკანები' : 'QR / NFC Scans'}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {language === 'ka' ? 'ბოლო 30 დღე' : 'Last 30 days'}
                    </span>
                  </div>
                </div>

                {/* 5. საშუალო შეფასება (Average Rating) */}
                <div className={`col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-rose-500" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                      +0.1
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl sm:text-3xl font-serif font-bold block leading-none">4.92</span>
                    <span className={`text-xs font-semibold block mt-1 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {language === 'ka' ? 'საშუალო შეფასება' : 'Average Rating'}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {language === 'ka' ? '1,248 შეფასება' : '1,248 total reviews'}
                    </span>
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW: Chart + Needs Attention + Activity Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Guest Activity Timeline Chart (6-Col) */}
                <div className={`lg:col-span-6 p-5 sm:p-6 rounded-[28px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg">
                        {language === 'ka' ? 'სტუმრების აქტივობა' : 'Guest Activity'}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] mt-1 text-stone-500">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Guide views</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> QR scans</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Wi-Fi copies</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Gem opens</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        1,842 Peak
                      </span>
                    </div>
                  </div>

                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ACTIVITY_TIMELINE_DATA}>
                        <XAxis dataKey="name" stroke={isDark ? '#525252' : '#a3a3a3'} fontSize={11} />
                        <YAxis stroke={isDark ? '#525252' : '#a3a3a3'} fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: isDark ? '#161B1E' : '#ffffff',
                            borderRadius: '16px',
                            border: isDark ? '1px solid #292524' : '1px solid #e7e5e4',
                            fontSize: '12px'
                          }}
                        />
                        <Line type="monotone" dataKey="views" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="scans" stroke="#3B82F6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="wifi" stroke="#F59E0B" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="gems" stroke="#FB7185" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Needs Attention List (3-Col) */}
                <div className={`lg:col-span-3 p-5 sm:p-6 rounded-[28px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
                      <h3 className="font-serif font-bold text-base">
                        {language === 'ka' ? 'ყურადღება სჭირდება' : 'Needs Attention'}
                      </h3>
                      <button 
                        onClick={() => setActiveTab('support')}
                        className="text-[11px] font-bold text-amber-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {language === 'ka' ? 'ყველას ნახვა' : 'View all'} →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {needsAttentionList.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            if (item.type === 'order') setActiveTab('qr');
                            else if (item.type === 'feedback') setActiveTab('reviews');
                            else setActiveTab('support');
                          }}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 hover:translate-x-0.5 ${
                            isDark ? 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                              <item.icon className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-xs font-semibold truncate">
                              {item.title}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            item.type === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Recent Activity Stream (3-Col) */}
                <div className={`lg:col-span-3 p-5 sm:p-6 rounded-[28px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
                      <h3 className="font-serif font-bold text-base">
                        {language === 'ka' ? 'ბოლო აქტივობა' : 'Recent Activity'}
                      </h3>
                      <button 
                        onClick={() => setActiveTab('activity')}
                        className="text-[11px] font-bold text-emerald-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {language === 'ka' ? 'ყველას ნახვა' : 'View all'} →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {recentActivityStream.map((item) => (
                        <div 
                          key={item.id}
                          className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                            isDark ? 'bg-stone-900/40 border-stone-800/80' : 'bg-stone-50 border-stone-200'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-bold block truncate">{item.text}</span>
                            <span className={`text-[11px] block truncate ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{item.user}</span>
                          </div>
                          <span className="text-[10px] font-mono text-stone-400 shrink-0">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* THIRD ROW: Recently Added Properties + Top Hosts Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Recently Added Properties Cards (7-Col) */}
                <div className={`lg:col-span-7 p-5 sm:p-6 rounded-[28px] border transition-all ${
                  isDark ? 'bg-[#12171B] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-base sm:text-lg">
                      {language === 'ka' ? 'ბოლო დამატებული ობიექტები' : 'Recently Added Properties'}
                    </h3>
                    <button 
                      onClick={() => setActiveTab('properties')}
                      className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {language === 'ka' ? 'ყველას ნახვა' : 'View all'} ({properties.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {properties.slice(0, 3).map((prop) => (
                      <div 
                        key={prop.id}
                        className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group ${
                          isDark ? 'bg-stone-900/80 border-stone-800 hover:border-stone-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="h-28 relative overflow-hidden">
                          <img 
                            src={prop.coverImage} 
                            alt={prop.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            {language === 'ka' ? 'აქტიური' : 'Active'}
                          </span>
                        </div>

                        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-xs truncate">{prop.title}</h4>
                            <span className={`text-[10px] block truncate ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                              {prop.city} · {prop.type}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-mono mt-1 text-amber-500 font-bold">
                              <span>⭐ 4.98</span>
                              <span className="opacity-70">·</span>
                              <span className="text-stone-400 font-normal">👁️ {prop.viewsCount || 1420}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                            <button
                              onClick={() => navigateToGuestGuide(prop.slug)}
                              className="py-1 rounded-lg text-[10px] font-bold bg-amber-600 text-white hover:bg-amber-700 text-center transition-colors"
                            >
                              Guide
                            </button>
                            <button
                              onClick={() => navigateToPropertyHub(prop.id, 'qr')}
                              className={`py-1 rounded-lg text-[10px] font-bold border text-center transition-colors ${
                                isDark ? 'border-stone-700 hover:bg-stone-800' : 'border-stone-200 hover:bg-stone-200'
                              }`}
                            >
                              QR
                            </button>
                            <button
                              onClick={() => navigateToPropertyHub(prop.id, 'overview')}
                              className={`py-1 rounded-lg text-[10px] font-bold border text-center transition-colors ${
                                isDark ? 'border-stone-700 hover:bg-stone-800' : 'border-stone-200 hover:bg-stone-200'
                              }`}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Top Hosts Leaderboard (5-Col) */}
                <div className={`lg:col-span-5 p-5 sm:p-6 rounded-[28px] border transition-all ${
                  isDark ? 'bg-[#12181C] border-stone-800/90 shadow-sm' : 'bg-white border-stone-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-base sm:text-lg">
                      {language === 'ka' ? 'ბესტ ჰოსტები' : 'Top Hosts'}
                    </h3>
                    <button 
                      onClick={() => setActiveTab('hosts')}
                      className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {language === 'ka' ? 'ყველას ნახვა' : 'View all'} →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {topHostsLeaderboard.map((host) => (
                      <div 
                        key={host.rank}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                          isDark ? 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-850' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            host.rank === 1 ? 'bg-amber-400 text-stone-950 font-black' : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {host.rank}
                          </span>
                          <img 
                            src={host.avatar} 
                            alt={host.name} 
                            className="w-7 h-7 rounded-full object-cover shrink-0" 
                          />
                          <div className="min-w-0">
                            <span className="font-bold block truncate">{host.name}</span>
                            <span className="text-[10px] text-stone-400 block truncate">
                              {host.propertiesCount} {language === 'ka' ? 'ობიექტი' : 'properties'} · ⭐ {host.rating}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                            host.plan === 'PRO' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                          }`}>
                            {host.plan}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">{host.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* FOURTH ROW: Gems + QR fulfillment + Plan Distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* 1. Gems Stats */}
                <div className={`p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90' : 'bg-white border-stone-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm">Gems {language === 'ka' ? 'სტატისტიკა' : 'Statistics'}</span>
                      <Compass className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-serif text-3xl font-bold">156</span>
                      <span className="text-xs text-stone-400">{language === 'ka' ? 'სულ ლოკაცია' : 'curated locations'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-3 text-stone-500">
                      <span><strong>28</strong> {language === 'ka' ? 'ახალი' : 'new'}</span>
                      <span>·</span>
                      <span>⭐ <strong>4.6</strong> {language === 'ka' ? 'საშუალო' : 'avg'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('gems')}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-current/20 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    Gems {language === 'ka' ? 'მართვა' : 'Manager'} →
                  </button>
                </div>

                {/* 2. QR / NFC Status */}
                <div className={`p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90' : 'bg-white border-stone-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm">QR / NFC {language === 'ka' ? 'სტატუსი' : 'Status'}</span>
                      <QrCode className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-serif text-3xl font-bold">482</span>
                      <span className="text-xs text-stone-400">{language === 'ka' ? 'გაცემული კოდი' : 'issued tags'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-3 text-stone-500">
                      <span><strong>342</strong> {language === 'ka' ? 'აქტიური' : 'active'}</span>
                      <span>·</span>
                      <span className="text-amber-500"><strong>16</strong> {language === 'ka' ? 'მოლოდინში' : 'pending'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('qr')}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-current/20 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {language === 'ka' ? 'კოდების მართვა' : 'Fulfillment'} →
                  </button>
                </div>

                {/* 3. Subscription Plans Donut */}
                <div className={`p-5 rounded-[24px] border transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#12171B] border-stone-800/90' : 'bg-white border-stone-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm">{language === 'ka' ? 'გადახდები & გეგმები' : 'Plans & Subscriptions'}</span>
                      <CreditCard className="w-4 h-4 text-sky-500" />
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div>
                        <span className="font-serif text-3xl font-bold block">42</span>
                        <span className="text-xs text-stone-400 block">{language === 'ka' ? 'ჰოსტი' : 'hosts'}</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        {PLAN_DISTRIBUTION_DATA.map(p => (
                          <div key={p.name} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            <span>{p.name}: <strong>{p.pct}</strong> ({p.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-current/20 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {language === 'ka' ? 'პლანების მართვა' : 'Manage Plans'} →
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: HOSTS DIRECTORY */}
          {activeTab === 'hosts' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl">{language === 'ka' ? 'რეგისტრირებული ჰოსტები' : 'Host Directory'}</h2>
                  <p className="text-xs text-stone-500">{language === 'ka' ? 'ყველა აქტიური და საცდელი ჰოსტი Stumari ქსელში.' : 'All hosts registered across the Stumari network.'}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  42 Active Hosts
                </span>
              </div>

              <div className={`rounded-[28px] border overflow-hidden ${
                isDark ? 'bg-[#12171B] border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b font-mono uppercase text-[10px] tracking-wider ${
                      isDark ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}>
                      <tr>
                        <th className="p-4">Host Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Properties</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800/80">
                      {MOCK_ADMIN_HOSTS.map((host) => (
                        <tr key={host.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                          <td className="p-4 font-semibold flex items-center gap-2.5">
                            <img src={host.avatar} alt={host.name} className="w-7 h-7 rounded-full object-cover" />
                            <span>{host.name}</span>
                          </td>
                          <td className="p-4 font-mono text-stone-500">{host.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                              host.plan === 'pro' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                            }`}>
                              {host.plan.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 font-bold">{host.propertyCount} listings</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                showToast(`Inspect host account: ${host.name}`);
                                setCurrentRoute('/app');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold transition-all"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl">{language === 'ka' ? 'ობიექტების კატალოგი' : 'Property Inventory'}</h2>
                  <p className="text-xs text-stone-500">{language === 'ka' ? 'ყველა აქტიური გიდი და ობიექტი.' : 'All properties and guidebooks across the platform.'}</p>
                </div>
                <button
                  onClick={() => setCurrentRoute('/onboarding')}
                  className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ {language === 'ka' ? 'დაამატე ობიექტი' : 'Add Property'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {properties.map((p) => (
                  <div 
                    key={p.id}
                    className={`rounded-[24px] border overflow-hidden flex flex-col justify-between ${
                      isDark ? 'bg-[#12171B] border-stone-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="h-36 relative">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0C1510]/80 text-amber-400 backdrop-blur-md">
                        {p.city}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-sm truncate">{p.title}</h4>
                      <p className="text-[11px] text-stone-500 truncate">{p.address}</p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                        <span className="font-mono text-[11px] text-emerald-500 font-bold">Wi-Fi: {p.wifiNetwork}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => navigateToGuestGuide(p.slug)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px]"
                          >
                            Live
                          </button>
                          <button
                            onClick={() => navigateToPropertyHub(p.id, 'overview')}
                            className="px-2.5 py-1 rounded-lg border text-[10px] font-bold"
                          >
                            Hub
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & FEEDBACK */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl">{language === 'ka' ? 'სტუმრების შეფასებები' : 'Guest Reviews & Ratings'}</h2>
                  <p className="text-xs text-stone-500">{language === 'ka' ? 'ყველა გამოხმაურება და შეფასება.' : 'Cross-property guest feedback records.'}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  ⭐ 4.92 Average Rating
                </span>
              </div>

              <div className="space-y-3">
                {feedbacks.map((f) => (
                  <div 
                    key={f.id}
                    className={`p-4 rounded-[24px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? 'bg-[#12171B] border-stone-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          f.sentiment === 'amazing' ? 'bg-emerald-500/20 text-emerald-500' : f.sentiment === 'problem' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {f.sentiment}
                        </span>
                        <span className="font-bold text-xs">{f.guestName || 'Guest'}</span>
                        <span className="text-[10px] text-stone-400">· {f.propertyName || 'Property'}</span>
                      </div>
                      <p className="text-xs italic text-stone-300">"{f.comment || 'Smooth check-in, wonderful experience.'}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-stone-400">{f.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM HEALTH */}
          {(activeTab === 'system' || activeTab === 'settings') && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="font-serif font-bold text-2xl">{language === 'ka' ? 'სისტემური პარამეტრები' : 'System & Settings'}</h2>
              
              <div className={`p-6 rounded-[28px] border space-y-4 ${
                isDark ? 'bg-[#12171B] border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
                  <div>
                    <h4 className="font-bold text-sm">{language === 'ka' ? 'PWA & Edge სერვერი' : 'Edge PWA & Service Worker'}</h4>
                    <p className="text-xs text-stone-400">PWA cache, offline sync, fast asset delivery.</p>
                  </div>
                  <button
                    onClick={handlePurgeCache}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-800 hover:bg-stone-700 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'ka' ? 'ქეშის გასუფთავება' : 'Purge Cache'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">Service Worker</span>
                    <span className="text-emerald-500 font-bold text-sm block mt-0.5">🟢 Active (v1.0.0)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">Database Sync</span>
                    <span className="text-emerald-500 font-bold text-sm block mt-0.5">🟢 Connected (Firestore)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">QR Resolution Speed</span>
                    <span className="font-mono font-bold text-sm block mt-0.5 text-stone-100">18ms average</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {(activeTab === 'activity' || activeTab === 'gems' || activeTab === 'qr' || activeTab === 'support' || activeTab === 'billing') && (
            <div className={`p-8 rounded-[28px] border text-center space-y-3 ${
              isDark ? 'bg-[#12171B] border-stone-800' : 'bg-white border-stone-200'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl capitalize">{activeTab} Management</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Real-time monitoring active. All data and operational pipelines connected to Stumari Core.
              </p>
              <button 
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Back to Dashboard Overview
              </button>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
