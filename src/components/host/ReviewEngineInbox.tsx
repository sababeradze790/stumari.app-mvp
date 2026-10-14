import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Heart, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  MessageSquare, 
  ExternalLink, 
  ArrowUpRight, 
  TrendingUp, 
  Filter,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Settings,
  Copy,
  Send,
  Building2,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StayFeedback, GuestSentiment } from '../../types';

interface ReviewEngineInboxProps {
  propertyIdFilter?: string;
}

export const ReviewEngineInbox: React.FC<ReviewEngineInboxProps> = ({ propertyIdFilter }) => {
  const { 
    theme, 
    language, 
    feedbacks, 
    resolveFeedback, 
    currentProperty, 
    properties,
    showToast 
  } = useApp();

  const isDark = theme === 'dark';

  const [selectedPropId, setSelectedPropId] = useState<string>(propertyIdFilter || 'all');
  const [filterSentiment, setFilterSentiment] = useState<'all' | GuestSentiment>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'resolved'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync prop filter when propertyIdFilter changes
  React.useEffect(() => {
    if (propertyIdFilter) {
      setSelectedPropId(propertyIdFilter);
    }
  }, [propertyIdFilter]);

  const propertyFeedbacks = feedbacks.filter(f => {
    if (selectedPropId === 'all') return true;
    return f.propertyId === selectedPropId || (!f.propertyId && selectedPropId === currentProperty.id);
  });

  const total = propertyFeedbacks.length;
  const amazingCount = propertyFeedbacks.filter(f => f.sentiment === 'amazing' || f.sentiment === 'good').length;
  const issuesIntercepted = propertyFeedbacks.filter(f => f.sentiment === 'could_be_better' || f.sentiment === 'problem').length;
  const resolvedCount = propertyFeedbacks.filter(f => f.status === 'resolved').length;
  const satisfactionRate = total > 0 ? Math.round((amazingCount / total) * 100) : 100;

  const filteredList = propertyFeedbacks.filter(item => {
    const matchSentiment = filterSentiment === 'all' || item.sentiment === filterSentiment;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSentiment && matchStatus;
  });

  const handleCopyTestimonial = (item: StayFeedback) => {
    const quote = `"${item.comment}" — ${item.guestName || 'Guest'} (Stayed at ${currentProperty.title})`;
    navigator.clipboard.writeText(quote);
    setCopiedId(item.id);
    showToast('Copied testimonial quote to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining the Review Engine & Intercept Strategy */}
      <div className={`p-6 sm:p-8 rounded-[32px] border relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-[#12181C] via-[#161F25] to-[#101518] border-stone-800 text-stone-100 shadow-xl' 
          : 'bg-gradient-to-br from-amber-50/90 via-stone-50 to-[#F5F2EB] border-stone-200 text-stone-900 shadow-md'
      }`}>
        <div className="max-w-3xl relative z-10 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${
              isDark 
                ? 'text-amber-400 bg-[#0C1510]/80 border-amber-500/20' 
                : 'text-amber-900 bg-amber-100/90 border-amber-300'
            }`}>
              Stumari Review Engine & Issue Interceptor
            </span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Happy Guests → 5-Star Reviews → Zero Bad Surprises
          </h2>
          
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            Stumari acts as an automatic firewall between your guests and public review platforms. Delighted guests are nudged directly to your Airbnb or Google review page. Guests with minor issues (e.g. cold water, tricky heating) reach out to you privately first, so you can resolve them before they turn into public 3-star complaints.
          </p>

          {!propertyIdFilter && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-mono opacity-60">Filter Property:</span>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                  isDark ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'
                }`}
              >
                <option value="all">All Properties ({feedbacks.length} total)</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-9xl">
          ⭐
        </div>
      </div>

      {/* Metric Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Guest Satisfaction */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Satisfaction</span>
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{satisfactionRate}%</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Based on {total} stays</p>
        </motion.div>

        {/* Metric 2: Intercepted Issues */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Intercepted</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{issuesIntercepted}</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Caught privately before Airbnb</p>
        </motion.div>

        {/* Metric 3: Converted to Public 5-Stars */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Public 5-Stars</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className={`text-2xl sm:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>{amazingCount}</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Sent to Airbnb / Google</p>
        </motion.div>

        {/* Metric 4: Resolved Issues */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-blue-400">{resolvedCount}</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Issues solved by host</p>
        </motion.div>

      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 transition-colors ${
        isDark ? 'bg-[#14191D] border-stone-800' : 'bg-stone-50 border-stone-200'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterSentiment('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              filterSentiment === 'all'
                ? isDark ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : isDark ? 'bg-[#101417] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            All Feedback ({total})
          </button>
          <button
            onClick={() => setFilterSentiment('amazing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              filterSentiment === 'amazing'
                ? 'bg-emerald-500 text-white border-emerald-500'
                : isDark ? 'bg-[#101417] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            😊 Amazing ({propertyFeedbacks.filter(f => f.sentiment === 'amazing').length})
          </button>
          <button
            onClick={() => setFilterSentiment('could_be_better')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              filterSentiment === 'could_be_better'
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : isDark ? 'bg-[#101417] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            😐 Needs Attention ({propertyFeedbacks.filter(f => f.sentiment === 'could_be_better').length})
          </button>
          <button
            onClick={() => setFilterSentiment('problem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              filterSentiment === 'problem'
                ? 'bg-rose-500 text-white border-rose-500'
                : isDark ? 'bg-[#101417] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            ⚠️ Problem ({propertyFeedbacks.filter(f => f.sentiment === 'problem').length})
          </button>
        </div>

        <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
          <button
            onClick={() => setFilterStatus(filterStatus === 'all' ? 'new' : filterStatus === 'new' ? 'resolved' : 'all')}
            className={`font-bold underline cursor-pointer ${isDark ? 'text-white' : 'text-stone-950'}`}
          >
            {filterStatus === 'all' ? 'All' : filterStatus === 'new' ? 'New Only' : 'Resolved Only'}
          </button>
        </div>
      </div>

      {/* Feedback Feed Cards */}
      <div className="space-y-3.5">
        <AnimatePresence>
          {filteredList.length > 0 ? (
            filteredList.map((item) => {
              const isPositive = item.sentiment === 'amazing' || item.sentiment === 'good';
              const isResolved = item.status === 'resolved';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 sm:p-6 rounded-[28px] border transition-all ${
                    isDark ? 'bg-[#101518] border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl">
                        {item.sentiment === 'amazing' ? '😊' : item.sentiment === 'good' ? '🙂' : item.sentiment === 'could_be_better' ? '😐' : '😕'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className={`text-sm font-bold ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                            {item.guestName || 'Guest'}
                          </strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPositive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30'
                          }`}>
                            {item.sentiment === 'amazing' ? '5-Star Loved It' : item.sentiment === 'good' ? 'Good Stay' : item.sentiment === 'could_be_better' ? 'Minor Issue' : 'Problem Reported'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5 opacity-60">
                          <span>{item.createdAt}</span>
                          {item.propertyId && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[150px]">
                                {properties.find(p => p.id === item.propertyId)?.title || 'Property'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {item.publicReviewPlatformChosen && (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FF5A5F]/15 text-[#FF5A5F] border border-[#FF5A5F]/30 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Routed to {item.publicReviewPlatformChosen.toUpperCase()}</span>
                        </span>
                      )}

                      {/* Copy quote testimonial */}
                      {item.comment && isPositive && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopyTestimonial(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark ? 'border-stone-700 bg-stone-900 text-stone-300 hover:text-white' : 'border-stone-300 bg-stone-100 text-stone-700 hover:text-stone-950'
                          }`}
                          title="Copy as testimonial for marketing"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy Quote'}</span>
                        </motion.button>
                      )}

                      {/* Direct Message WhatsApp */}
                      {!isPositive && (
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Hi ${item.guestName || 'Guest'}! Thank you for staying with us at Stumari. I saw your feedback regarding: "${item.comment || 'your stay'}". How can I make this right for you immediately?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Guest</span>
                        </a>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => resolveFeedback(item.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                        }`}
                      >
                        {isResolved ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Resolved ✓</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Categories */}
                  {item.categories && item.categories.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                      <span className="text-[10px] font-mono uppercase opacity-60">Reported Topic:</span>
                      {item.categories.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 capitalize">
                          {c.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comment */}
                  {item.comment && (
                    <p className={`text-xs leading-relaxed p-3.5 rounded-2xl border ${
                      isDark ? 'bg-[#14191D] border-stone-800/80 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'
                    }`}>
                      "{item.comment}"
                    </p>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className={`p-8 rounded-[28px] border text-center space-y-2 ${
              isDark ? 'bg-[#101518] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600'
            }`}>
              <p className="text-sm font-semibold">No feedback records match the current filter.</p>
              <button
                onClick={() => {
                  setFilterSentiment('all');
                  setFilterStatus('all');
                }}
                className="px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
