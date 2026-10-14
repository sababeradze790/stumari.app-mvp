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
      <div className={`w-full flex items-center p-1 rounded-xl border transition-all ${
        isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
      } ${className}`}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#F55A51] text-white shadow-xs font-bold' 
                  : isDark 
                    ? 'text-[#ACA79F] hover:text-[#F7F5F0]' 
                    : 'text-[#5C5853] hover:text-[#1C1B1A]'
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
          ? 'bg-[#1F1E1C] border-[#2B2926]' 
          : 'bg-[#F3EFE9] border-[#EBE6DF]'
      } ${className}`}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#F55A51] text-white shadow-xs font-bold'
                  : isDark 
                    ? 'text-[#ACA79F] hover:text-[#F7F5F0]' 
                    : 'text-[#5C5853] hover:text-[#1C1B1A]'
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
          className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-2xs ${
            isDark
              ? 'bg-[#1F1E1C] hover:bg-[#272522] text-[#F7F5F0] border-[#2B2926]'
              : 'bg-white hover:bg-[#FAF8F5] text-[#1C1B1A] border-[#EBE6DF]'
          }`}
          title="Change language / ენის შეცვლა / Сменить язык"
        >
          <span className="text-sm">{currentLang.flag}</span>
          <span className="font-mono uppercase font-semibold text-[11px]">{currentLang.short}</span>
          <ChevronDown className={`w-3 h-3 text-[#ACA79F] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={`absolute right-0 top-full mt-1.5 w-44 rounded-xl border p-1.5 shadow-warm-lg z-50 animate-in fade-in zoom-in-95 duration-150 ${
            isDark ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
          }`}>
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#ACA79F]">
              Language / ენა
            </div>
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#F55A51] text-white font-bold' 
                      : isDark 
                        ? 'hover:bg-[#272522] text-[#F7F5F0]' 
                        : 'hover:bg-[#FAF8F5] text-[#1C1B1A]'
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
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-2xs ${
          isDark
            ? 'bg-[#1F1E1C] hover:bg-[#272522] border-[#2B2926] text-[#F7F5F0]'
            : 'bg-white hover:bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
        }`}
        aria-label="Select Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline font-sans">{currentLang.nativeLabel}</span>
        <span className="sm:hidden font-mono uppercase text-[11px] font-semibold">{currentLang.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#ACA79F] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl border p-1.5 shadow-warm-lg z-50 animate-in fade-in zoom-in-95 duration-150 ${
          isDark 
            ? 'bg-[#1F1E1C] border-[#2B2926] text-[#F7F5F0]' 
            : 'bg-white border-[#EBE6DF] text-[#1C1B1A]'
        }`}>
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#ACA79F]">
            Language / ენა / Язык
          </div>
          <div className="space-y-0.5 mt-0.5">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full px-3 py-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#F55A51] text-white font-bold' 
                      : isDark 
                        ? 'hover:bg-[#272522] text-[#F7F5F0]' 
                        : 'hover:bg-[#FAF8F5] text-[#1C1B1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div className="leading-tight">
                      <span className="block font-medium">{item.nativeLabel}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#ACA79F]'}`}>
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
        className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all active:scale-95 shrink-0 cursor-pointer shadow-2xs ${
          isDark
            ? 'bg-[#1F1E1C] hover:bg-[#272522] text-[#FFC757] border-[#2B2926]'
            : 'bg-white hover:bg-[#FAF8F5] text-[#5C5853] hover:text-[#1C1B1A] border-[#EBE6DF]'
        } ${themeButtonClassName}`}
        title={isDark ? (language === 'ka' ? 'ნათელი რეჟიმი' : language === 'ru' ? 'Светлая тема' : 'Switch to Light mode') : (language === 'ka' ? 'მუქი რეჟიმი' : language === 'ru' ? 'Темная тема' : 'Switch to Dark mode')}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-[#FFC757]" />
        ) : (
          <Moon className="w-4 h-4 text-[#5C5853]" />
        )}
      </button>

      <LanguageSelector variant="compact" className={languageSelectorClassName} />
    </div>
  );
};

