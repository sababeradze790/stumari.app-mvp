import React, { useState } from 'react';
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
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StayFeedback, GuestSentiment } from '../../types';

export const ReviewEngineInbox: React.FC = () => {
  const { theme, language, feedbacks, resolveFeedback, currentProperty, showToast } = useApp();
  const isDark = theme === 'dark';

  const [filterSentiment, setFilterSentiment] = useState<'all' | GuestSentiment>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'resolved'>('all');

  const propertyFeedbacks = feedbacks.filter(f => f.propertyId === currentProperty.id || !f.propertyId);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner explaining the Review Engine & Intercept Strategy */}
      <div className={`p-6 sm:p-7 rounded-[32px] border relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-[#13191D] via-[#0E1317] to-[#0A0D10] border-stone-800' 
          : 'bg-gradient-to-br from-amber-50/80 via-stone-50 to-white border-stone-200'
      }`}>
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-[#E4E98E]' : 'text-amber-700'
            }`}>
              Stumari Review Engine & Private Feedback
            </span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Happy Guests → Better Reviews → Less Work → More Bookings
          </h2>
          
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            Instead of hoping guests leave 5 stars, Stumari creates a private post-stay moment. Amazing stays are routed to your public Airbnb / Google reviews; issues are caught privately so you can fix them before they become public 3-star complaints.
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-9xl">
          ⭐
        </div>
      </div>

      {/* Metric Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Metric 1: Guest Satisfaction */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-400">Satisfaction</span>
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{satisfactionRate}%</div>
          <p className="text-[11px] text-stone-400 mt-1">Based on {total} guest stays</p>
        </div>

        {/* Metric 2: Intercepted Issues */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-400">Intercepted</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{issuesIntercepted}</div>
          <p className="text-[11px] text-stone-400 mt-1">Caught privately before Airbnb</p>
        </div>

        {/* Metric 3: Converted to Public 5-Stars */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-400">Public Reviews</span>
            <Star className="w-4 h-4 text-[#E4E98E] fill-[#E4E98E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-white">{amazingCount}</div>
          <p className="text-[11px] text-stone-400 mt-1">Routed to Airbnb / Google</p>
        </div>

        {/* Metric 4: Resolved Issues */}
        <div className={`p-5 rounded-[24px] border ${isDark ? 'bg-[#12161A] border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-400">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-blue-400">{resolvedCount}</div>
          <p className="text-[11px] text-stone-400 mt-1">Operational fixes made</p>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterSentiment('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterSentiment === 'all'
                ? isDark ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E]' : 'bg-stone-900 text-white border-stone-900'
                : isDark ? 'bg-[#14191C] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            All Feedback ({total})
          </button>
          <button
            onClick={() => setFilterSentiment('amazing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterSentiment === 'amazing'
                ? 'bg-emerald-500 text-white border-emerald-500'
                : isDark ? 'bg-[#14191C] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            😊 Amazing ({propertyFeedbacks.filter(f => f.sentiment === 'amazing').length})
          </button>
          <button
            onClick={() => setFilterSentiment('could_be_better')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterSentiment === 'could_be_better'
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : isDark ? 'bg-[#14191C] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            😐 Could be better ({propertyFeedbacks.filter(f => f.sentiment === 'could_be_better').length})
          </button>
          <button
            onClick={() => setFilterSentiment('problem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filterSentiment === 'problem'
                ? 'bg-rose-500 text-white border-rose-500'
                : isDark ? 'bg-[#14191C] text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            😕 Had a problem ({propertyFeedbacks.filter(f => f.sentiment === 'problem').length})
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
          <button
            onClick={() => setFilterStatus(filterStatus === 'all' ? 'new' : filterStatus === 'new' ? 'resolved' : 'all')}
            className="font-bold underline text-stone-200"
          >
            {filterStatus === 'all' ? 'All' : filterStatus === 'new' ? 'Needs Attention' : 'Resolved'}
          </button>
        </div>
      </div>

      {/* Feedback Feed Cards */}
      <div className="space-y-3.5">
        {filteredList.length > 0 ? (
          filteredList.map((item) => {
            const isPositive = item.sentiment === 'amazing' || item.sentiment === 'good';
            const isResolved = item.status === 'resolved';

            return (
              <div
                key={item.id}
                className={`p-5 sm:p-6 rounded-[28px] border transition-all ${
                  isDark ? 'bg-[#0E1317] border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {item.sentiment === 'amazing' ? '😊' : item.sentiment === 'good' ? '🙂' : item.sentiment === 'could_be_better' ? '😐' : '😕'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-stone-100">{item.guestName || 'Guest'}</strong>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPositive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.sentiment === 'amazing' ? 'Amazing Stay' : item.sentiment === 'good' ? 'Good' : item.sentiment === 'could_be_better' ? 'Could Be Better' : 'Issue Reported'}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.publicReviewPlatformChosen && (
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FF5A5F]/15 text-[#FF5A5F] border border-[#FF5A5F]/30 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Routed to {item.publicReviewPlatformChosen.toUpperCase()}</span>
                      </span>
                    )}

                    <button
                      onClick={() => resolveFeedback(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : isDark
                          ? 'bg-stone-900 border-stone-750 text-stone-300 hover:text-white'
                          : 'bg-stone-100 border-stone-300 text-stone-700 hover:text-stone-950'
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Resolved</span>
                        </>
                      ) : (
                        <span>Mark as Resolved</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Categories */}
                {item.categories && item.categories.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Issues:</span>
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
                    isDark ? 'bg-[#14191C] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'
                  }`}>
                    "{item.comment}"
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className={`p-8 rounded-[28px] border text-center space-y-2 ${
            isDark ? 'bg-[#0E1317] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600'
          }`}>
            <p className="text-sm font-semibold">No feedback matches current filters.</p>
          </div>
        )}
      </div>

    </div>
  );
};
