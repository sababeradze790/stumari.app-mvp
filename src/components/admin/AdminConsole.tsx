import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Eye, 
  Sliders, 
  ExternalLink, 
  ArrowLeft, 
  Check, 
  Activity,
  Zap,
  Globe,
  RefreshCw,
  QrCode,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_ADMIN_HOSTS, MOCK_ADMIN_PROPERTIES_SUMMARY, MOCK_PLATFORM_STATS } from '../../data/mockData';
import { ADMIN_I18N } from '../../data/adminI18n';

export const AdminConsole: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    properties, 
    navigateToGuestGuide, 
    navigateToPropertyHub,
    showToast,
    theme,
    t,
    language
  } = useApp();
  const isDark = theme === 'dark';
  const adminContent = ADMIN_I18N[language] || ADMIN_I18N.en;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'hosts' | 'properties' | 'settings'>(() => {
    if (currentRoute === '/admin/hosts') return 'hosts';
    if (currentRoute === '/admin/properties') return 'properties';
    if (currentRoute === '/admin/settings') return 'settings';
    return 'dashboard';
  });

  // Basic admin platform settings
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Stumari',
    supportEmail: 'support@stumari.app',
    supportWhatsApp: '+995 555 123 456',
    defaultCurrency: 'USD ($)',
    maintenanceMode: false
  });

  const handleTabChange = (tab: 'dashboard' | 'hosts' | 'properties' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'dashboard') setCurrentRoute('/admin');
    else if (tab === 'hosts') setCurrentRoute('/admin/hosts');
    else if (tab === 'properties') setCurrentRoute('/admin/properties');
    else if (tab === 'settings') setCurrentRoute('/admin/settings');
  };

  const handlePurgeCache = () => {
    showToast(adminContent.dashboard.cachePurgedToast);
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6 transition-colors duration-300 ${
      isDark ? 'text-stone-100' : 'text-stone-900'
    }`}>
      
      {/* Admin Top Header Card */}
      <div className={`p-6 sm:p-7 rounded-[32px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
      }`}>
        <div>
          <button
            onClick={() => setCurrentRoute('/app')}
            className={`text-xs flex items-center gap-1.5 font-medium transition-colors mb-1.5 ${
              isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{adminContent.header.backToDashboard}</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {t.admin.title}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#E4E98E]/15 text-[#E4E98E] border border-[#E4E98E]/30' : 'bg-amber-100 text-amber-900 border border-amber-200'
            }`}>
              {adminContent.header.superuserBadge}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {t.admin.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Dynamic Segmented Admin Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border overflow-x-auto no-scrollbar max-w-full ${
            isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-100 border-stone-200'
          }`}>
            {[
              { id: 'dashboard', label: adminContent.header.tabs.overview },
              { id: 'hosts', label: adminContent.header.tabs.hosts },
              { id: 'properties', label: adminContent.header.tabs.properties },
              { id: 'settings', label: adminContent.header.tabs.settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab.id 
                    ? isDark 
                      ? 'bg-[#E4E98E] text-[#0C1510] shadow-sm' 
                      : 'bg-stone-900 text-white shadow-sm'
                    : isDark 
                      ? 'text-stone-400 hover:text-white' 
                      : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. DASHBOARD TAB (RICH DIVERSE SIZED BENTO GRID) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Bento Grid Layer 1: Different Sized Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Card 1 (WIDE 8-COL BENTO CARD): High-Impact Platform Scale */}
            <div className={`md:col-span-8 p-6 sm:p-7 rounded-[32px] border transition-all flex flex-col justify-between ${
              isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {adminContent.dashboard.platformScale}
                  </span>
                  <h3 className="text-xl font-serif font-bold mt-1.5">{adminContent.dashboard.volumeTitle}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>{adminContent.dashboard.growthMonth}</span>
                </div>
              </div>

              {/* 4 Inner Bento Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#14191C] border-stone-800/80' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.activeHosts}
                  </span>
                  <div className={`text-2xl sm:text-3xl font-bold font-serif mt-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {MOCK_PLATFORM_STATS.totalHosts}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-medium mt-1 block">{adminContent.dashboard.activeHostsSub}</span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#14191C] border-stone-800/80' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.totalGuides}
                  </span>
                  <div className={`text-2xl sm:text-3xl font-bold font-serif mt-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {MOCK_PLATFORM_STATS.totalProperties}
                  </div>
                  <span className={`text-[10px] block mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.totalGuidesSub}
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#14191C] border-stone-800/80' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.published}
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-serif mt-1 text-emerald-500">
                    {MOCK_PLATFORM_STATS.publishedProperties}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-medium mt-1 block">{adminContent.dashboard.publishedSub}</span>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#14191C] border-stone-800/80' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.draftGuides}
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-serif mt-1 text-amber-500">
                    {MOCK_PLATFORM_STATS.draftProperties}
                  </div>
                  <span className={`text-[10px] block mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.draftGuidesSub}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 (TALL 4-COL BENTO CARD): Edge Infrastructure & Service Worker Health */}
            <div className={`md:col-span-4 p-6 sm:p-7 rounded-[32px] border transition-all flex flex-col justify-between ${
              isDark ? 'bg-[#14191C] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                    isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {adminContent.dashboard.systemHealth}
                  </span>
                  <Server className="w-4 h-4 text-emerald-500" />
                </div>

                <h3 className="text-lg font-serif font-bold mb-1">
                  {adminContent.dashboard.edgePwaTitle}
                </h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {adminContent.dashboard.edgePwaSub}
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>{adminContent.dashboard.swUptime}</span>
                    <strong className="text-emerald-500 font-mono">99.98%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>{adminContent.dashboard.qrResolution}</span>
                    <strong className="font-mono">18ms</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>{adminContent.dashboard.activeSessions}</span>
                    <strong className={`font-mono ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>342 live</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-800/60">
                <button
                  onClick={handlePurgeCache}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isDark ? 'bg-stone-800 hover:bg-stone-750 text-stone-200' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{adminContent.dashboard.purgeCacheBtn}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bento Grid Layer 2: Side-by-side Tables (Different Sized Bento Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Card 3 (6-COL BENTO CARD): High Value Host Accounts */}
            <div className={`md:col-span-6 p-6 sm:p-7 rounded-[32px] border transition-all space-y-4 ${
              isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.accountDirectory}
                  </span>
                  <h3 className="font-serif text-lg font-bold">{adminContent.dashboard.topHostsTitle}</h3>
                </div>
                <button
                  onClick={() => handleTabChange('hosts')}
                  className={`text-xs font-bold transition-colors ${isDark ? 'text-[#E4E98E] hover:underline' : 'text-stone-900 hover:underline'}`}
                >
                  {adminContent.dashboard.viewAll} ({MOCK_ADMIN_HOSTS.length})
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {MOCK_ADMIN_HOSTS.slice(0, 4).map((h) => (
                  <div 
                    key={h.id} 
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                      isDark ? 'bg-[#14191C] border-stone-800/80 hover:border-stone-700' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {h.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold truncate block">{h.name}</span>
                        <span className={`text-[10px] truncate block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{h.email}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        h.plan === 'pro' 
                          ? isDark ? 'bg-[#E4E98E]/15 text-[#E4E98E]' : 'bg-emerald-100 text-emerald-800'
                          : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {h.plan} · {h.propertyCount} {adminContent.dashboard.propertiesCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4 (6-COL BENTO CARD): Live Properties Telemetry */}
            <div className={`md:col-span-6 p-6 sm:p-7 rounded-[32px] border transition-all space-y-4 ${
              isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {adminContent.dashboard.liveGuideboard}
                  </span>
                  <h3 className="font-serif text-lg font-bold">{adminContent.dashboard.liveTelemetryTitle}</h3>
                </div>
                <button
                  onClick={() => handleTabChange('properties')}
                  className={`text-xs font-bold transition-colors ${isDark ? 'text-[#E4E98E] hover:underline' : 'text-stone-900 hover:underline'}`}
                >
                  {adminContent.dashboard.viewAll} ({properties.length})
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {properties.slice(0, 4).map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                      isDark ? 'bg-[#14191C] border-stone-800/80 hover:border-stone-700' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold truncate block">{p.title}</span>
                        <span className={`text-[10px] font-mono truncate block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          /{p.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {p.status === 'published' ? adminContent.dashboard.published : adminContent.dashboard.draftGuides}
                      </span>
                      <button
                        onClick={() => navigateToGuestGuide(p.slug)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-stone-800 text-[#E4E98E]' : 'hover:bg-stone-200 text-stone-800'
                        }`}
                        title={adminContent.dashboard.viewGuestGuide}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. HOSTS TAB */}
      {activeTab === 'hosts' && (
        <div className={`rounded-[32px] border overflow-hidden transition-all shadow-xl animate-in fade-in ${
          isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}>
          <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
            <div>
              <h3 className="font-serif text-xl font-bold">{adminContent.hosts.title}</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {adminContent.hosts.subtitle}
              </p>
            </div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
              isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-stone-100 text-stone-800'
            }`}>
              {MOCK_ADMIN_HOSTS.length} {adminContent.hosts.totalHostsTag}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-mono text-[10px] ${
                isDark ? 'bg-[#14191C] border-stone-800 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}>
                <tr>
                  <th className="px-6 py-3.5">{adminContent.hosts.thHost}</th>
                  <th className="px-5 py-3.5">{adminContent.hosts.thEmail}</th>
                  <th className="px-5 py-3.5">{adminContent.hosts.thPlan}</th>
                  <th className="px-5 py-3.5">{adminContent.hosts.thProperties}</th>
                  <th className="px-5 py-3.5">{adminContent.hosts.thActions}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-stone-800/80' : 'divide-stone-100'}`}>
                {MOCK_ADMIN_HOSTS.map((h) => (
                  <tr key={h.id} className={`transition-colors ${isDark ? 'hover:bg-stone-850/50' : 'hover:bg-stone-50'}`}>
                    <td className="px-6 py-4 font-bold flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {h.name.charAt(0)}
                      </div>
                      <span>{h.name}</span>
                    </td>
                    <td className={`px-5 py-4 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>{h.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        h.plan === 'pro' 
                          ? isDark ? 'bg-[#E4E98E]/15 text-[#E4E98E]' : 'bg-emerald-100 text-emerald-800' 
                          : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {h.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold">{h.propertyCount} {adminContent.hosts.listings}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          showToast(adminContent.hosts.impersonateToast(h.name));
                          setCurrentRoute('/app');
                        }}
                        className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors ${
                          isDark ? 'bg-stone-800 hover:bg-stone-750 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                        }`}
                      >
                        {adminContent.hosts.inspectSaas}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PROPERTIES TAB */}
      {activeTab === 'properties' && (
        <div className={`rounded-[32px] border overflow-hidden transition-all shadow-xl animate-in fade-in ${
          isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}>
          <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
            <div>
              <h3 className="font-serif text-xl font-bold">{adminContent.properties.title}</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {adminContent.properties.subtitle}
              </p>
            </div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
              isDark ? 'bg-stone-800 text-[#E4E98E]' : 'bg-stone-100 text-stone-800'
            }`}>
              {properties.length} {adminContent.properties.totalPropertiesTag}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-mono text-[10px] ${
                isDark ? 'bg-[#14191C] border-stone-800 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}>
                <tr>
                  <th className="px-6 py-3.5">{adminContent.properties.thProperty}</th>
                  <th className="px-5 py-3.5">{adminContent.properties.thHost}</th>
                  <th className="px-5 py-3.5">{adminContent.properties.thType}</th>
                  <th className="px-5 py-3.5">{adminContent.properties.thStatus}</th>
                  <th className="px-5 py-3.5">{adminContent.properties.thActions}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-stone-800/80' : 'divide-stone-100'}`}>
                {properties.map((p) => (
                  <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-stone-850/50' : 'hover:bg-stone-50'}`}>
                    <td className="px-6 py-4 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="block">{p.title}</span>
                          <span className={`text-[10px] font-mono font-normal ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-4 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{p.hostName}</td>
                    <td className="px-5 py-4 capitalize font-medium">{p.type}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {p.status === 'published' ? adminContent.dashboard.published : adminContent.dashboard.draftGuides}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateToPropertyHub(p.id, 'overview')}
                          className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors ${
                            isDark ? 'bg-stone-800 hover:bg-stone-750 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                          }`}
                        >
                          {adminContent.properties.manageBtn}
                        </button>
                        <button
                          onClick={() => navigateToGuestGuide(p.slug)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-stone-800 text-[#E4E98E]' : 'hover:bg-stone-200 text-stone-900'
                          }`}
                          title={adminContent.properties.openLiveGuest}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className={`max-w-2xl p-8 rounded-[36px] border transition-all space-y-6 text-xs shadow-xl animate-in fade-in ${
          isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}>
          <div>
            <h2 className="text-2xl font-serif font-bold">{adminContent.settings.title}</h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              {adminContent.settings.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`font-bold block mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {adminContent.settings.brandNameLabel}
              </label>
              <input
                type="text"
                value={platformSettings.platformName}
                onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium ${
                  isDark ? 'bg-[#14191C] border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                }`}
              />
            </div>

            <div>
              <label className={`font-bold block mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {adminContent.settings.emailLabel}
              </label>
              <input
                type="email"
                value={platformSettings.supportEmail}
                onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium ${
                  isDark ? 'bg-[#14191C] border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                }`}
              />
            </div>

            <div>
              <label className={`font-bold block mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {adminContent.settings.whatsappLabel}
              </label>
              <input
                type="text"
                value={platformSettings.supportWhatsApp}
                onChange={(e) => setPlatformSettings({ ...platformSettings, supportWhatsApp: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono font-semibold ${
                  isDark ? 'bg-[#14191C] border-stone-700 text-emerald-400' : 'bg-stone-50 border-stone-300 text-emerald-600'
                }`}
              />
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-[#14191C] border-stone-700/80' : 'bg-stone-50 border-stone-200'
            }`}>
              <div>
                <span className="font-bold block text-sm">{adminContent.settings.maintenanceTitle}</span>
                <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {adminContent.settings.maintenanceDesc}
                </span>
              </div>
              <button
                onClick={() => {
                  const newMode = !platformSettings.maintenanceMode;
                  setPlatformSettings({ ...platformSettings, maintenanceMode: newMode });
                  showToast(newMode ? adminContent.settings.maintenanceEnabledToast : adminContent.settings.maintenanceDisabledToast);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  platformSettings.maintenanceMode ? 'bg-red-600 text-white' : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {platformSettings.maintenanceMode ? adminContent.settings.enabled : adminContent.settings.disabled}
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast(adminContent.settings.savedSettingsToast)}
                className={`px-7 py-3 rounded-full font-bold text-xs shadow-md transition-all ${
                  isDark ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d9de7d]' : 'bg-stone-900 text-white hover:bg-stone-850'
                }`}
              >
                {adminContent.settings.saveSettingsBtn}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
