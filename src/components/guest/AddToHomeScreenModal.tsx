import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share, 
  PlusSquare, 
  Smartphone, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddToHomeScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToHomeScreenModal: React.FC<AddToHomeScreenModalProps> = ({
  isOpen,
  onClose
}) => {
  const { theme, language } = useApp();
  const isDark = theme === 'dark';
  const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 14 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-warm-lg relative transition-all overflow-hidden z-10 ${
              isDark
                ? 'bg-[#141312] border-[#2B2926] text-[#F7F5F0]'
                : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
            }`}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={`absolute top-4 right-4 w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#ACA79F] hover:text-[#F7F5F0] bg-[#1F1E1C] border-[#2B2926]'
                  : 'text-[#5C5853] hover:text-[#1C1B1A] bg-white border-[#EBE6DF]'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Icon & Title */}
            <div className="text-center space-y-2 mb-5">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto shadow-2xs ${
                  isDark
                    ? 'bg-[#FFC757]/15 border-[#FFC757]/30 text-[#FFC757]'
                    : 'bg-[#FFF9ED] border-[#FFC757]/40 text-[#8A6300]'
                }`}
              >
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl tracking-tight">
                {language === 'ka'
                  ? 'დაამატეთ მთავარ ეკრანზე'
                  : language === 'ru'
                  ? 'Добавить на главный экран'
                  : 'Save Guide to Home Screen'}
              </h3>
              <p
                className={`text-xs leading-relaxed px-2 ${
                  isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                }`}
              >
                {language === 'ka'
                  ? 'გახსენით აპარტამენტის გზამკვლევი პირდაპირ ტელეფონის მთავარი ეკრანიდან.'
                  : language === 'ru'
                  ? 'Быстрый доступ к путеводителю прямо с главного экрана вашего телефона.'
                  : 'Pin this guest guide to your phone’s home screen for quick one-tap access during your stay.'}
              </p>
            </div>

            {/* Platform Selector */}
            <div
              className={`p-1 rounded-xl border flex items-center mb-4 text-xs font-semibold relative ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-[#F3EFE9] border-[#EBE6DF]'
              }`}
            >
              <button
                type="button"
                onClick={() => setDeviceType('ios')}
                className={`flex-1 py-2 rounded-lg transition-colors relative z-10 cursor-pointer ${
                  deviceType === 'ios'
                    ? 'text-white font-semibold'
                    : isDark
                    ? 'text-[#ACA79F] hover:text-[#F7F5F0]'
                    : 'text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
              >
                {deviceType === 'ios' && (
                  <motion.div
                    layoutId="a2hsPlatformTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 rounded-lg shadow-xs -z-10 bg-[#F55A51]"
                  />
                )}
                <span>iPhone (Safari)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceType('android')}
                className={`flex-1 py-2 rounded-lg transition-colors relative z-10 cursor-pointer ${
                  deviceType === 'android'
                    ? 'text-white font-semibold'
                    : isDark
                    ? 'text-[#ACA79F] hover:text-[#F7F5F0]'
                    : 'text-[#5C5853] hover:text-[#1C1B1A]'
                }`}
              >
                {deviceType === 'android' && (
                  <motion.div
                    layoutId="a2hsPlatformTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 rounded-lg shadow-xs -z-10 bg-[#F55A51]"
                  />
                )}
                <span>Android (Chrome)</span>
              </button>
            </div>

            {/* Step-by-step instructions */}
            <AnimatePresence mode="wait">
              {deviceType === 'ios' ? (
                <motion.div
                  key="ios"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2.5 text-xs"
                >
                  <div
                    className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                      isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 font-mono font-bold ${
                        isDark
                          ? 'bg-[#748C96]/15 border-[#748C96]/30 text-[#98B1BC]'
                          : 'bg-[#F0F4F6] border-[#748C96]/25 text-[#4D6169]'
                      }`}
                    >
                      1
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold block">
                        {language === 'ka'
                          ? 'დააჭირეთ Share ღილაკს'
                          : language === 'ru'
                          ? 'Нажмите «Поделиться»'
                          : 'Tap the Share Button'}
                      </span>
                      <span
                        className={`text-[11px] flex items-center gap-1 mt-0.5 ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}
                      >
                        <Share className="w-3 h-3 text-[#748C96]" />
                        <span>
                          {language === 'ka'
                            ? 'Safari-ს ქვედა პანელზე'
                            : language === 'ru'
                            ? 'На нижней панели Safari'
                            : 'On the bottom bar of Safari'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                      isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 font-mono font-bold ${
                        isDark
                          ? 'bg-[#FFC757]/15 border-[#FFC757]/30 text-[#FFC757]'
                          : 'bg-[#FFF9ED] border-[#FFC757]/35 text-[#8A6300]'
                      }`}
                    >
                      2
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold block">
                        {language === 'ka'
                          ? 'აირჩიეთ "Add to Home Screen"'
                          : language === 'ru'
                          ? 'Выберите «На экран Домой»'
                          : 'Select "Add to Home Screen"'}
                      </span>
                      <span
                        className={`text-[11px] flex items-center gap-1 mt-0.5 ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}
                      >
                        <PlusSquare className="w-3 h-3 text-[#F55A51]" />
                        <span>
                          {language === 'ka'
                            ? 'დააჭირეთ «Add» ზედა მარჯვენა კუთხეში'
                            : language === 'ru'
                            ? 'Нажмите «Добавить» в правом верхнем углу'
                            : 'Tap "Add" in the top-right corner'}
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="android"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2.5 text-xs"
                >
                  <div
                    className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                      isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 font-mono font-bold ${
                        isDark
                          ? 'bg-[#748C96]/15 border-[#748C96]/30 text-[#98B1BC]'
                          : 'bg-[#F0F4F6] border-[#748C96]/25 text-[#4D6169]'
                      }`}
                    >
                      1
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold block">
                        {language === 'ka'
                          ? 'დააჭირეთ მენიუს (⋮)'
                          : language === 'ru'
                          ? 'Нажмите меню (⋮)'
                          : 'Tap Browser Menu (⋮)'}
                      </span>
                      <span
                        className={`text-[11px] mt-0.5 block ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}
                      >
                        {language === 'ka'
                          ? 'Chrome-ის ზედა მარჯვენა კუთხეში'
                          : language === 'ru'
                          ? 'В правом верхнем углу Chrome'
                          : 'In the top-right corner of Chrome'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                      isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 font-mono font-bold ${
                        isDark
                          ? 'bg-[#FFC757]/15 border-[#FFC757]/30 text-[#FFC757]'
                          : 'bg-[#FFF9ED] border-[#FFC757]/35 text-[#8A6300]'
                      }`}
                    >
                      2
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold block">
                        {language === 'ka'
                          ? 'აირჩიეთ "Add to Home screen" ან "Install app"'
                          : language === 'ru'
                          ? 'Выберите «Добавить на гл. экран»'
                          : 'Select "Add to Home screen" or "Install app"'}
                      </span>
                      <span
                        className={`text-[11px] mt-0.5 block ${
                          isDark ? 'text-[#ACA79F]' : 'text-[#5C5853]'
                        }`}
                      >
                        {language === 'ka'
                          ? 'სწრაფი წვდომა მთავარი ეკრანიდან'
                          : language === 'ru'
                          ? 'Для быстрого запуска с главного экрана'
                          : 'Creates a shortcut icon on your home screen'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-5 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#F55A51] hover:bg-[#E04840] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {language === 'ka'
                ? 'გასაგებია'
                : language === 'ru'
                ? 'Понятно'
                : 'Done'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
