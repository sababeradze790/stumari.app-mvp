import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Wifi, 
  Thermometer, 
  Sparkles, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building2, 
  Filter, 
  Check, 
  MessageCircle, 
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GuestRequest, RequestStatus, RequestCategory } from '../../types';

interface GuestRequestsInboxProps {
  propertyIdFilter?: string;
}

export const GuestRequestsInbox: React.FC<GuestRequestsInboxProps> = ({ propertyIdFilter }) => {
  const { 
    theme, 
    language, 
    requests, 
    updateRequestStatus, 
    properties, 
    showToast,
    firebaseUser
  } = useApp();

  const isDark = theme === 'dark';
  const hostProperties = firebaseUser
    ? properties.filter(p => p.ownerId === firebaseUser.uid && !p.isDemo)
    : properties;
  const hostRequests = firebaseUser
    ? requests.filter(r => r.hostId === firebaseUser.uid)
    : requests;

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(propertyIdFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  React.useEffect(() => {
    if (propertyIdFilter) {
      setSelectedPropertyId(propertyIdFilter);
    }
  }, [propertyIdFilter]);

  const filteredRequests = hostRequests.filter(req => {
    if (selectedPropertyId !== 'all' && req.propertyId !== selectedPropertyId) return false;
    if (selectedCategory !== 'all' && req.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && req.status !== selectedStatus) return false;
    return true;
  });

  const getCategoryIcon = (category: RequestCategory) => {
    switch (category) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'climate':
        return <Thermometer className="w-4 h-4 text-sky-400" />;
      case 'cleaning':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'access':
        return <KeyRound className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-stone-400" />;
    }
  };

  const getUrgencyBadge = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
            {language === 'ka' ? 'სასწრაფო' : language === 'ru' ? 'Срочно' : 'Urgent'}
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {language === 'ka' ? 'საშუალო' : language === 'ru' ? 'Средний' : 'Medium'}
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-stone-500/15 text-stone-400 border border-stone-500/30">
            {language === 'ka' ? 'დაბალი' : language === 'ru' ? 'Низкий' : 'Low'}
          </span>
        );
    }
  };

  const pendingCount = hostRequests.filter(r => r.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className={`p-6 sm:p-8 rounded-[28px] border transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-[#13191D] to-[#171F24] border-stone-800 text-stone-100 shadow-xl' 
          : 'bg-white border-stone-200 text-stone-900 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Bell className="w-5 h-5" />
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                {language === 'ka' ? 'სტუმრების მოთხოვნები & შეტყობინებები' : language === 'ru' ? 'Запросы и сообщения гостей' : 'Guest Requests & Live Inbox'}
              </h2>
            </div>
            <p className={`text-xs sm:text-sm mt-1.5 max-w-xl ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              {language === 'ka'
                ? 'სტუმრების რეალური მოთხოვნები: Wi-Fi შეფერხება, ტემპერატურა, კოდის დახმარება და დამატებითი სერვისები.'
                : language === 'ru'
                ? 'Прямые запросы гостей во время проживания: Wi-Fi, кондиционер, помощь с кодом и сервисы.'
                : 'Real-time in-stay guest tickets: Wi-Fi resets, AC climate, access codes, and amenities.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold ${
              pendingCount > 0 
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {pendingCount} {language === 'ka' ? 'აქტიური მოთხოვნა' : language === 'ru' ? 'активных' : 'Active Tickets'}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-5 border-t border-stone-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Tabs */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
          }`}>
            {[
              { id: 'all', label: language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'All' },
              { id: 'new', label: language === 'ka' ? 'ახალი' : language === 'ru' ? 'Новые' : 'New' },
              { id: 'in_progress', label: language === 'ka' ? 'პროცესში' : language === 'ru' ? 'В работе' : 'In Progress' },
              { id: 'resolved', label: language === 'ka' ? 'მოგვარებული' : language === 'ru' ? 'Решено' : 'Resolved' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedStatus === tab.id
                    ? 'bg-[#F55A51] text-white shadow-xs'
                    : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Property Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border font-medium focus:outline-none transition-colors bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 focus:border-amber-600 dark:focus:border-amber-500"
            >
              <option value="all">{language === 'ka' ? 'ყველა ობიექტი' : language === 'ru' ? 'Все объекты' : 'All Properties'}</option>
              {hostProperties.map((p, pIdx) => (
                <option key={p.id ? `prop-opt-${p.id}` : `prop-opt-${pIdx}`} value={p.id || `prop-${pIdx}`}>
                  {p.title || `Property ${pIdx + 1}`}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border font-medium focus:outline-none transition-colors bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 focus:border-amber-600 dark:focus:border-amber-500"
            >
              <option value="all">{language === 'ka' ? 'ყველა კატეგორია' : language === 'ru' ? 'Все категории' : 'All Categories'}</option>
              <option value="wifi">Wi-Fi</option>
              <option value="climate">{language === 'ka' ? 'კონდიცირება/გათბობა' : 'AC & Climate'}</option>
              <option value="cleaning">{language === 'ka' ? 'დასუფთავება' : 'Cleaning'}</option>
              <option value="access">{language === 'ka' ? 'კარის საკეტი/წვდომა' : 'Access & Keypad'}</option>
              <option value="other">{language === 'ka' ? 'სხვა' : 'Other'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length === 0 ? (
            <motion.div
              key="empty-requests-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-10 rounded-[24px] border text-center space-y-2 ${
                isDark ? 'bg-[#13191D] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600'
              }`}
            >
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 opacity-80" />
              <h4 className="font-serif font-bold text-base text-stone-200">
                {language === 'ka' ? 'მოთხოვნები არ არის' : language === 'ru' ? 'Нет активных запросов' : 'No matching requests'}
              </h4>
              <p className="text-xs">
                {language === 'ka' ? 'ყველა მოთხოვნა მოგვარებულია ან ფილტრი ცარიელია.' : 'All guest requests are resolved or no tickets match filters.'}
              </p>
            </motion.div>
          ) : (
            filteredRequests.map((req, reqIdx) => {
              const uniqueKey = req.id ? `req-${req.id}` : `req-idx-${reqIdx}`;
              return (
                <motion.div
                  key={uniqueKey}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-4 sm:p-5 rounded-[22px] border transition-all ${
                    isDark 
                      ? 'bg-[#141A1E] border-stone-800 hover:border-stone-700 text-stone-100' 
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-900 shadow-xs'
                  }`}
                >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${
                    isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-100 border-stone-200 text-stone-800'
                  }`}>
                    {getCategoryIcon(req.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base">{req.title}</h4>
                      {getUrgencyBadge(req.urgency)}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        req.status === 'new' 
                          ? 'bg-rose-500/20 text-rose-300' 
                          : req.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {req.status === 'new' 
                          ? (language === 'ka' ? 'ახალი' : 'New') 
                          : req.status === 'in_progress'
                          ? (language === 'ka' ? 'პროცესშია' : 'In Progress')
                          : (language === 'ka' ? 'მოგვარებული' : 'Resolved')}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {req.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] mt-3 opacity-70 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <strong>{req.propertyName}</strong>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{req.guestName}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{req.createdAt}</span>
                      </span>
                      {req.assignedTo && (
                        <>
                          <span>·</span>
                          <span>{language === 'ka' ? 'პასუხისმგებელი:' : 'Assigned:'} <strong>{req.assignedTo}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Take Task & Mark Resolved */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  {req.status !== 'in_progress' && req.status !== 'resolved' && (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'in_progress')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-[#FFC757]/20 hover:bg-[#FFC757]/30 text-[#8A6300] dark:text-[#FFC757] border border-[#FFC757]/40 active:scale-95"
                    >
                      {language === 'ka' ? 'დავალების აღება (Take Task)' : 'Take Task'}
                    </button>
                  )}

                  {req.status !== 'resolved' ? (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'resolved')}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'ka' ? 'მოგვარებულად მონიშვნა' : 'Mark Resolved'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'in_progress')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
                        isDark 
                          ? 'text-stone-400 hover:text-white border-stone-750 hover:bg-stone-800' 
                          : 'text-stone-600 hover:text-stone-900 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === 'ka' ? 'ხელახლა გახსნა' : 'Reopen Ticket'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
