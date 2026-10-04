import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, SUPPORTED_LANGUAGES } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'pills' | 'compact' | 'segmented';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'dropdown',
  className = '' 
}) => {
  const { language, setLanguage, theme, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    const selected = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (selected) {
      showToast(
        code === 'ka' 
          ? 'ენა შეიცვალა: ქართული 🇬🇪' 
          : code === 'ru' 
            ? 'Язык изменён: Русский 🇷🇺' 
            : 'Language switched to English 🇬🇧'
      );
    }
  };

  // 1. Segmented 3-Way Toggle Bar (Prominent for Guest Guide)
  if (variant === 'segmented') {
    return (
      <div className={`w-full flex items-center p-1 rounded-2xl border transition-all ${
        isDark ? 'bg-[#121619] border-stone-800' : 'bg-stone-100 border-stone-200'
      } ${className}`}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                isActive
                  ? isDark 
                    ? 'bg-[#E4E98E] text-[#0C1510] shadow-sm' 
                    : 'bg-white text-stone-900 shadow-sm border border-stone-200/60'
                  : isDark 
                    ? 'text-stone-400 hover:text-stone-200' 
                    : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="text-sm">{item.flag}</span>
              <span className="truncate">{item.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Pills Variant (Ideal for mobile top bar or compact sections)
  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-full border transition-colors ${
        isDark 
          ? 'bg-stone-900 border-stone-800' 
          : 'bg-stone-100 border-stone-200'
      } ${className}`}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? isDark 
                    ? 'bg-[#E4E98E] text-[#0C1510] shadow-xs' 
                    : 'bg-stone-900 text-white shadow-xs'
                  : isDark 
                    ? 'text-stone-400 hover:text-stone-200' 
                    : 'text-stone-600 hover:text-stone-900'
              }`}
              title={item.nativeLabel}
            >
              <span>{item.flag}</span>
              <span>{item.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Compact Variant (Flag + short code button)
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-8 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
            isDark
              ? 'bg-stone-900/90 hover:bg-stone-850 text-stone-200 border-stone-800'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
          }`}
          title="Change language / ენის შეცვლა / Сменить язык"
        >
          <span className="text-sm">{currentLang.flag}</span>
          <span className="font-mono">{currentLang.short}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={`absolute right-0 top-full mt-1.5 w-44 rounded-2xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
            isDark ? 'bg-[#0E1317] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? isDark 
                        ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                        : 'bg-stone-900 text-white font-bold'
                      : isDark 
                        ? 'hover:bg-stone-800/80 text-stone-200' 
                        : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.flag}</span>
                    <span>{item.nativeLabel}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3. Dropdown Variant (Standard default for desktop header & bars)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 active:scale-95 ${
          isDark
            ? 'bg-stone-900/90 hover:bg-stone-800 border-stone-800 text-stone-200'
            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800 shadow-2xs'
        }`}
        aria-label="Select Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline font-sans">{currentLang.nativeLabel}</span>
        <span className="sm:hidden font-mono">{currentLang.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
          isDark 
            ? 'bg-[#0E1317] border-stone-800 text-stone-100 shadow-stone-950/80' 
            : 'bg-white border-stone-200 text-stone-900 shadow-xl'
        }`}>
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-400">
            Language / ენა / Язык
          </div>
          <div className="space-y-0.5 mt-0.5">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? isDark 
                        ? 'bg-[#E4E98E] text-[#0C1510] font-bold' 
                        : 'bg-stone-900 text-white font-bold'
                      : isDark 
                        ? 'hover:bg-stone-800/80 text-stone-200' 
                        : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div className="leading-tight">
                      <span className="block font-medium">{item.nativeLabel}</span>
                      <span className={`text-[10px] ${isSelected ? (isDark ? 'text-stone-700' : 'text-stone-300') : 'text-stone-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const GuestLanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <LanguageSelector variant="segmented" className={className} />;
};

export interface ThemeAndLanguageControlsProps {
  className?: string;
  themeButtonClassName?: string;
  languageSelectorClassName?: string;
}

export const ThemeAndLanguageControls: React.FC<ThemeAndLanguageControlsProps> = ({
  className = '',
  themeButtonClassName = '',
  languageSelectorClassName = ''
}) => {
  const { theme, toggleTheme, language } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-1.5 shrink-0 ${className}`}>
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark/light mode"
        className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-all active:scale-95 shrink-0 ${
          isDark
            ? 'bg-stone-900/90 hover:bg-stone-850 text-stone-200 hover:text-white border-stone-800 shadow-sm'
            : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
        } ${themeButtonClassName}`}
        title={isDark ? (language === 'ka' ? 'ნათელი რეჟიმი' : language === 'ru' ? 'Светлая тема' : 'Switch to Light mode') : (language === 'ka' ? 'მუქი რეჟიმი' : language === 'ru' ? 'Темная тема' : 'Switch to Dark mode')}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-[#E4E98E]" />
        ) : (
          <Moon className="w-4 h-4 text-stone-700" />
        )}
      </button>

      <LanguageSelector variant="compact" className={languageSelectorClassName} />
    </div>
  );
};

