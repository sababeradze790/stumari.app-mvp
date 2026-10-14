import React from 'react';
import { motion } from 'motion/react';
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
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="fixed bottom-0 inset-x-0 z-40 w-full flex justify-center pointer-events-auto"
    >
      <nav 
        aria-label="Guest App Navigation Bar"
        className={`w-full max-w-xl border-t backdrop-blur-2xl px-2 sm:px-4 pt-2 pb-safe pb-2.5 flex items-center justify-around transition-all duration-300 ${
          isDark 
            ? 'bg-[#141312]/95 border-[#2B2926] shadow-sm text-[#ACA79F]' 
            : 'bg-[#FAF8F5]/95 border-[#EBE6DF] shadow-sm text-[#5C5853]'
        }`}
        style={{
          paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0px))'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              whileTap={{ scale: 0.94 }}
              className="relative flex-1 py-1 flex flex-col items-center justify-center select-none cursor-pointer focus-visible:outline-hidden"
            >
              {isActive ? (
                /* Active State: Clean Stumari coral rounded-xl container */
                <div className="relative px-3 py-1.5 flex flex-col items-center justify-center">
                  <motion.div 
                    layoutId="activeDockPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 rounded-xl shadow-xs bg-[#F55A51] border border-[#F55A51]"
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center text-white">
                    <div className="relative">
                      {tab.icon}
                      {tab.badge && (
                        <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#FFC757] ring-2 ring-[#F55A51]" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold leading-tight mt-0.5 tracking-tight">
                      {tab.label}
                    </span>
                  </div>
                </div>
              ) : (
                /* Inactive State: Clean Icon + Subdued Label */
                <div className={`py-1 px-2 flex flex-col items-center justify-center transition-colors ${
                  isDark ? 'text-[#ACA79F] hover:text-[#F7F5F0]' : 'text-[#8A857D] hover:text-[#1C1B1A]'
                }`}>
                  <div className="relative">
                    {tab.icon}
                    {tab.badge && (
                      <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#FFC757] ring-2 ${
                        isDark ? 'ring-[#141312]' : 'ring-[#FAF8F5]'
                      }`} />
                    )}
                  </div>
                  <span className="text-[11px] font-medium leading-tight mt-0.5 truncate tracking-tight">
                    {tab.label}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};
