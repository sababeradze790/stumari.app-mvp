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
  unreadFeedbackBadge = false
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
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
    },
    {
      id: 'gems',
      label: language === 'ka' ? 'ადგილები' : language === 'ru' ? 'Места' : 'Gems',
      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
    },
    {
      id: 'explore',
      label: language === 'ka' ? 'გარემო' : language === 'ru' ? 'Район' : 'Explore',
      icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
    },
    {
      id: 'feedback',
      label: language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Отзыв' : 'Review',
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />,
      badge: unreadFeedbackBadge
    },
    {
      id: 'host',
      label: language === 'ka' ? 'მასპინძელი' : language === 'ru' ? 'Хозяин' : 'Host',
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
    }
  ];

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="fixed bottom-0 inset-x-0 z-40 w-full flex justify-center pointer-events-none sm:pb-3"
    >
      <nav
        aria-label="Guest Guide Navigation"
        className={`pointer-events-auto w-full sm:max-w-xl lg:max-w-2xl border-t sm:border sm:rounded-2xl backdrop-blur-2xl px-2 sm:px-3 pt-1.5 pb-2 flex items-center justify-around transition-all duration-300 ${
          isDark
            ? 'bg-[#141312]/95 border-[#2B2926] shadow-warm-lg text-[#ACA79F]'
            : 'bg-[#FAF8F5]/95 border-[#EBE6DF] shadow-warm-lg text-[#5C5853]'
        }`}
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              whileTap={{ scale: 0.95 }}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex-1 min-h-[46px] py-1 flex flex-col items-center justify-center select-none cursor-pointer focus-visible:outline-hidden"
            >
              {isActive ? (
                <div className="relative px-3.5 py-1.5 flex flex-col sm:flex-row items-center justify-center sm:gap-2">
                  <motion.div
                    layoutId="activeDockPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 rounded-xl shadow-xs bg-[#F55A51] border border-[#F55A51]"
                  />
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center sm:gap-1.5 text-white">
                    <div className="relative">
                      {tab.icon}
                      {tab.badge && (
                        <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#FFC757] ring-2 ring-[#F55A51]" />
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold leading-tight mt-0.5 sm:mt-0 tracking-tight">
                      {tab.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`py-1.5 px-2.5 flex flex-col sm:flex-row items-center justify-center sm:gap-1.5 transition-colors rounded-xl ${
                    isDark
                      ? 'text-[#ACA79F] hover:text-[#F7F5F0] hover:bg-[#1F1E1C]'
                      : 'text-[#8A857D] hover:text-[#1C1B1A] hover:bg-[#F3EFE9]/70'
                  }`}
                >
                  <div className="relative">
                    {tab.icon}
                    {tab.badge && (
                      <span
                        className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#FFC757] ring-2 ${
                          isDark ? 'ring-[#141312]' : 'ring-[#FAF8F5]'
                        }`}
                      />
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium leading-tight mt-0.5 sm:mt-0 truncate tracking-tight">
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
