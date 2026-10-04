import React from 'react';
import { 
  Home, 
  Sparkles, 
  MapPin, 
  Star, 
  MessageCircle,
  KeyRound
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
  unreadFeedbackBadge = false
}) => {
  const { theme, language } = useApp();
  const isDark = theme === 'dark';

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {
      // ignore
    }
  };

  const handleTabClick = (tab: GuestTab) => {
    triggerHaptic();
    onSelectTab(tab);
  };

  const tabs: { id: GuestTab; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    {
      id: 'stay',
      label: language === 'ka' ? 'ბინა' : language === 'ru' ? 'Жильё' : 'Stay',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'gems',
      label: language === 'ka' ? 'ადგილები' : language === 'ru' ? 'Секреты' : 'Gems',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'explore',
      label: language === 'ka' ? 'რუკა' : language === 'ru' ? 'Карта' : 'Explore',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'feedback',
      label: language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Отзыв' : 'Review',
      icon: <Star className="w-5 h-5" />,
      badge: unreadFeedbackBadge
    },
    {
      id: 'host',
      label: language === 'ka' ? 'კონტაქტი' : language === 'ru' ? 'Хозяин' : 'Host',
      icon: <MessageCircle className="w-5 h-5" />
    }
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 mx-auto max-w-sm px-4 z-40 pointer-events-none">
      <nav 
        aria-label="Mobile Navigation Dock"
        className={`pointer-events-auto rounded-full border shadow-2xl backdrop-blur-xl p-1.5 flex items-center justify-between transition-all duration-300 ${
          isDark 
            ? 'bg-[#0E1317]/90 border-stone-800/90 shadow-black/80 text-stone-400' 
            : 'bg-white/92 border-stone-200/90 shadow-stone-900/15 text-stone-600'
        }`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex-1 py-1.5 px-1 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none ${
                isActive
                  ? isDark 
                    ? 'bg-[#E4E98E] text-[#0A100D] font-bold shadow-md shadow-[#E4E98E]/20' 
                    : 'bg-stone-900 text-white font-bold shadow-md shadow-stone-900/20'
                  : isDark 
                    ? 'hover:text-stone-200' 
                    : 'hover:text-stone-900'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#0E1317] animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[56px] ${
                isActive ? 'font-bold' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
