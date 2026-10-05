import React from 'react';
import { 
  Home, 
  Sparkles, 
  MapPin, 
  Star, 
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type GuestTab = 'stay' | 'gems' | 'explore' | 'feedback' | 'host';

interface MobileBottomDockProps {
  activeTab: GuestTab;
  onSelectTab: (tab: GuestTab) => void;
  unreadFeedbackBadge?: boolean;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  activeTab,
  onSelectTab,
  unreadFeedbackBadge = true
}) => {
  const { theme, language } = useApp();
  const isDark = theme === 'dark';

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
  };

  const handleTabClick = (tab: GuestTab) => {
    triggerHaptic();
    onSelectTab(tab);
  };

  const tabs: { id: GuestTab; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    {
      id: 'stay',
      label: language === 'ka' ? 'ბინა' : language === 'ru' ? 'Жильё' : 'Stay',
      icon: <Home className="w-5 h-5 stroke-[2.2]" />
    },
    {
      id: 'gems',
      label: language === 'ka' ? 'ადგილები' : language === 'ru' ? 'Секреты' : 'Gems',
      icon: <Sparkles className="w-5 h-5 stroke-[2.2]" />
    },
    {
      id: 'explore',
      label: language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Explore',
      icon: <MapPin className="w-5 h-5 stroke-[2.2]" />
    },
    {
      id: 'feedback',
      label: language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Отзыв' : 'Review',
      icon: <Star className="w-5 h-5 stroke-[2.2]" />,
      badge: unreadFeedbackBadge
    },
    {
      id: 'host',
      label: language === 'ka' ? 'კონტაქტი' : language === 'ru' ? 'Хозяин' : 'Host',
      icon: <MessageCircle className="w-5 h-5 stroke-[2.2]" />
    }
  ];

  return (
    /* FIXED NATIVE APP BOTTOM BAR: Docked flush to the bottom as native apps do */
    <div className="fixed bottom-0 inset-x-0 z-40 w-full flex justify-center pointer-events-auto">
      <nav 
        aria-label="Guest App Navigation Bar"
        className={`w-full max-w-xl border-t backdrop-blur-2xl px-2 sm:px-4 pt-2 pb-safe pb-2.5 flex items-center justify-around transition-all duration-300 ${
          isDark 
            ? 'bg-[#0B0F13]/98 border-stone-800/90 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] text-stone-200' 
            : 'bg-white/98 border-stone-200/90 shadow-[0_-10px_35px_rgba(0,0,0,0.08)] text-stone-800'
        }`}
        style={{
          paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0px))'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex-1 py-1 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none cursor-pointer focus-visible:outline-hidden"
            >
              {isActive ? (
                /* Active State: Clean high-contrast capsule matching reference */
                <div className={`px-4 py-1.5 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-all duration-200 ${
                  isDark 
                    ? 'bg-[#E4E98E] text-[#0C1510] font-black' 
                    : 'bg-stone-950 text-white font-black'
                }`}>
                  <div className="relative">
                    {tab.icon}
                    {tab.badge && (
                      <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full ${
                        isDark ? 'bg-red-500 ring-2 ring-[#E4E98E]' : 'bg-amber-400 ring-2 ring-stone-950'
                      }`} />
                    )}
                  </div>
                  <span className="text-[11px] font-black leading-tight mt-0.5 tracking-normal">
                    {tab.label}
                  </span>
                </div>
              ) : (
                /* Inactive State: Clean Icon + Bold Visible Label below */
                <div className={`py-1 px-2 flex flex-col items-center justify-center transition-colors ${
                  isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-700 hover:text-stone-950'
                }`}>
                  <div className="relative">
                    {tab.icon}
                    {tab.badge && (
                      <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-[#0B0F13]" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold leading-tight mt-0.5 truncate tracking-normal">
                    {tab.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
