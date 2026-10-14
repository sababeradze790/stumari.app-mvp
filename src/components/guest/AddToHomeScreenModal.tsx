import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Smartphone, 
  Check, 
  X, 
  WifiOff, 
  Sparkles 
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
            className="fixed inset-0 bg-black/75 backdrop-blur-md" 
            onClick={onClose} 
          />

          <motion.div 
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`w-full max-w-sm rounded-[32px] border p-6 shadow-2xl relative transition-all overflow-hidden z-10 ${
              isDark 
                ? 'bg-[#0E1317] border-stone-800 text-stone-100' 
                : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-stone-400 hover:text-white bg-stone-900' : 'text-stone-500 hover:text-stone-900 bg-stone-100'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Icon & Title */}
            <div className="text-center space-y-2 mb-5">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner"
              >
                <Smartphone className="w-7 h-7 text-amber-500" />
              </motion.div>
              <h3 className={`font-serif font-bold text-xl tracking-tight ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                {language === 'ka' ? 'დაამატეთ ტელეფონის ეკრანზე' : language === 'ru' ? 'Добавить на главный экран' : 'Install as Phone App'}
              </h3>
              <p className={`text-xs leading-relaxed px-2 font-medium ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {language === 'ka' 
                  ? 'გახსენით 1 შეხებით, ინტერნეტის ან როუმინგის გარეშეც კი!'
                  : language === 'ru'
                  ? 'Мгновенный доступ в 1 касание без роуминга и интернета!'
                  : '1-tap instant access right from your home screen — works 100% offline!'}
              </p>
            </div>

            {/* Platform Selector */}
            <div className={`p-1 rounded-xl border flex items-center mb-4 text-xs font-bold relative ${
              isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
            }`}>
              <button
                onClick={() => setDeviceType('ios')}
                className={`flex-1 py-1.5 rounded-lg transition-colors relative z-10 cursor-pointer ${
                  deviceType === 'ios'
                    ? isDark ? 'text-stone-950 font-bold' : 'text-white font-bold'
                    : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {deviceType === 'ios' && (
                  <motion.div
                    layoutId="a2hsPlatformTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className={`absolute inset-0 rounded-lg shadow-sm -z-10 ${
                      isDark ? 'bg-amber-600' : 'bg-stone-900'
                    }`}
                  />
                )}
                <span>iPhone (iOS Safari)</span>
              </button>
              <button
                onClick={() => setDeviceType('android')}
                className={`flex-1 py-1.5 rounded-lg transition-colors relative z-10 cursor-pointer ${
                  deviceType === 'android'
                    ? isDark ? 'text-stone-950 font-bold' : 'text-white font-bold'
                    : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {deviceType === 'android' && (
                  <motion.div
                    layoutId="a2hsPlatformTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className={`absolute inset-0 rounded-lg shadow-sm -z-10 ${
                      isDark ? 'bg-amber-600' : 'bg-stone-900'
                    }`}
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
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3 text-xs"
                >
                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div className="min-w-0">
                      <span className={`font-bold block ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                        {language === 'ka' ? 'დააჭირეთ Share ღილაკს' : language === 'ru' ? 'Нажмите «Поделиться»' : 'Tap the Share Button'}
                      </span>
                      <span className={`text-[11px] flex items-center gap-1 mt-0.5 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        <Share className="w-3 h-3 text-blue-500" />
                        <span>{language === 'ka' ? 'Safari-ს ქვედა პანელზე' : language === 'ru' ? 'На нижней панели Safari' : 'On the bottom bar of Safari'}</span>
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div className="min-w-0">
                      <span className={`font-bold block ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                        {language === 'ka' ? 'აირჩიეთ "Add to Home Screen"' : language === 'ru' ? 'Выберите «На экран Домой»' : 'Select "Add to Home Screen"'}
                      </span>
                      <span className={`text-[11px] flex items-center gap-1 mt-0.5 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        <PlusSquare className="w-3 h-3 text-amber-500" />
                        <span>{language === 'ka' ? 'დააჭირეთ «Add» ზედა მარჯვენა კუთხეში' : language === 'ru' ? 'Нажмите «Добавить» в правом верхнем углу' : 'Tap "Add" in the top-right corner'}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="android"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3 text-xs"
                >
                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div className="min-w-0">
                      <span className={`font-bold block ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                        {language === 'ka' ? 'დააჭირეთ მენიუს (⋮)' : language === 'ru' ? 'Нажмите меню (⋮)' : 'Tap Menu (⋮)'}
                      </span>
                      <span className={`text-[11px] mt-0.5 block font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        {language === 'ka' ? 'Chrome-ის ზედა მარჯვენა კუთხეში' : language === 'ru' ? 'В верхнем правом углу Chrome' : 'In the top-right corner of Chrome'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div className="min-w-0">
                      <span className={`font-bold block ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                        {language === 'ka' ? 'აირჩიეთ "Install app"' : language === 'ru' ? 'Выберите «Установить приложение»' : 'Select "Install app"'}
                      </span>
                      <span className={`text-[11px] mt-0.5 block font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        {language === 'ka' ? 'გაიხსნება როგორც ნამდვილი მობილური აპი' : language === 'ru' ? 'Запустится как настоящее приложение' : 'Opens instantly just like a native mobile app'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={onClose}
              className="w-full mt-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              {language === 'ka' ? 'გავიგე, მადლობა!' : language === 'ru' ? 'Понятно, спасибо!' : 'Got it, thanks!'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
