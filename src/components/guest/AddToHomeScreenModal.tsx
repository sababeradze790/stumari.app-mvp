import React, { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-sm rounded-[32px] border p-6 shadow-2xl relative transition-all overflow-hidden ${
          isDark 
            ? 'bg-[#0E1317] border-stone-800 text-stone-100' 
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark ? 'text-stone-400 hover:text-white bg-stone-900' : 'text-stone-500 hover:text-stone-900 bg-stone-100'
          }`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#E4E98E]/15 text-[#E4E98E] border border-[#E4E98E]/30 flex items-center justify-center mx-auto shadow-inner">
            <Smartphone className="w-7 h-7 text-[#E4E98E]" />
          </div>
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
        <div className={`p-1 rounded-xl border flex items-center mb-4 text-xs font-bold ${
          isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
        }`}>
          <button
            onClick={() => setDeviceType('ios')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              deviceType === 'ios'
                ? isDark ? 'bg-[#E4E98E] text-stone-950 shadow-sm' : 'bg-stone-900 text-white shadow-sm'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            iPhone (iOS Safari)
          </button>
          <button
            onClick={() => setDeviceType('android')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              deviceType === 'android'
                ? isDark ? 'bg-[#E4E98E] text-stone-950 shadow-sm' : 'bg-stone-900 text-white shadow-sm'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Android (Chrome)
          </button>
        </div>

        {/* Step-by-step instructions */}
        {deviceType === 'ios' ? (
          <div className="space-y-3 text-xs">
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
              <div className="w-8 h-8 rounded-xl bg-[#E4E98E]/20 text-[#E4E98E] dark:text-[#E4E98E] flex items-center justify-center shrink-0 font-bold">
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
          </div>
        ) : (
          <div className="space-y-3 text-xs">
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
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-[#E4E98E] hover:bg-[#d9de83] text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
        >
          {language === 'ka' ? 'გავიგე, მადლობა!' : language === 'ru' ? 'Понятно, спасибо!' : 'Got it, thanks!'}
        </button>
      </div>
    </div>
  );
};
