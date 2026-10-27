import React, { useState } from 'react';
import {
  KeyRound,
  Wifi,
  MapPin,
  Copy,
  Check,
  Navigation,
  ChevronRight,
  Clock,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { safeCopyToClipboard } from '../../utils/clipboard';

interface ArrivalBoardingPassProps {
  property: Property;
  language: 'en' | 'ka' | 'ru';
  onOpenCheckinInstructions: () => void;
  onOpenWifiModal: () => void;
}

export const ArrivalBoardingPass: React.FC<ArrivalBoardingPassProps> = ({
  property,
  language,
  onOpenCheckinInstructions,
  onOpenWifiModal,
}) => {
  const { isPropertyAccessUnlocked } = useApp();
  const [copiedField, setCopiedField] = useState<'door' | 'wifi' | 'address' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAccessUnlocked = isPropertyAccessUnlocked(property);
  const doorCode = isAccessUnlocked ? property.doorKeypadCode || property.lockboxCode || '' : '';
  const hasWifiCredentials = Boolean(
    isAccessUnlocked && (property.wifiNetwork || property.wifiPassword)
  );
  const hasExactAddress = Boolean(isAccessUnlocked && property.address);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const copyDoorCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!doorCode) {
      onOpenCheckinInstructions();
      return;
    }
    const ok = await safeCopyToClipboard(doorCode);
    if (ok) {
      setCopiedField('door');
      showToast(
        language === 'ka'
          ? 'კარის კოდი დაკოპირებულია'
          : language === 'ru'
          ? 'Код двери скопирован'
          : 'Door code copied to clipboard'
      );
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      showToast(
        language === 'ka'
          ? 'ავტომატური კოპირება ვერ მოხერხდა'
          : language === 'ru'
          ? 'Не удалось скопировать автоматически'
          : 'Could not copy code automatically'
      );
    }
  };

  const copyWifi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.wifiPassword) {
      onOpenWifiModal();
      return;
    }
    const ok = await safeCopyToClipboard(property.wifiPassword);
    if (ok) {
      setCopiedField('wifi');
      showToast(
        language === 'ka'
          ? 'Wi-Fi პაროლი დაკოპირებულია'
          : language === 'ru'
          ? 'Пароль Wi-Fi скопирован'
          : `Wi-Fi password copied (${property.wifiNetwork || 'Network'})`
      );
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      showToast(
        language === 'ka'
          ? 'ავტომატური კოპირება ვერ მოხერხდა'
          : language === 'ru'
          ? 'Не удалось скопировать автоматически'
          : 'Could not copy Wi-Fi password automatically'
      );
    }
  };

  const copyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasExactAddress) {
      onOpenCheckinInstructions();
      return;
    }
    const ok = await safeCopyToClipboard(property.address);
    if (ok) {
      setCopiedField('address');
      showToast(
        language === 'ka'
          ? 'მისამართი დაკოპირებულია'
          : language === 'ru'
          ? 'Адрес скопирован'
          : 'Address copied to clipboard'
      );
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      showToast(
        language === 'ka'
          ? 'ავტომატური კოპირება ვერ მოხერხდა'
          : language === 'ru'
          ? 'Не удалось скопировать автоматически'
          : 'Could not copy address automatically'
      );
    }
  };

  const mapsDestination = hasExactAddress
    ? property.latitude && property.longitude
      ? `${property.latitude},${property.longitude}`
      : encodeURIComponent(property.address)
    : encodeURIComponent(`${property.city || 'Tbilisi'}, ${property.country || 'Georgia'}`);

  return (
    <div className="relative">
      {/* Floating Copy Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-3.5 h-3.5 text-[#F55A51]" />
          {toastMessage}
        </div>
      )}

      {/* Tier 1: High-Contrast Utility Boarding Pass */}
      <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] shadow-[0_14px_38px_-14px_rgba(28,27,26,0.09)] dark:shadow-none overflow-hidden">
        {/* Top Schedule & Access Strip (honest schedule & lock state, no fake live status) */}
        <div className="px-5 py-3.5 bg-[#FAF8F5] dark:bg-[#141312]/80 border-b border-[#EBE6DF] dark:border-[#2B2926] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isAccessUnlocked ? (
              <span className="w-5 h-5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full bg-[#748C96]/15 text-[#748C96] flex items-center justify-center shrink-0">
                <Lock className="w-3 h-3" />
              </span>
            )}
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1C1B1A] dark:text-[#F7F5F0]">
              {language === 'ka'
                ? 'ჩამოსვლის ბარათი'
                : language === 'ru'
                ? 'Карта заселения'
                : 'Arrival Essentials'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#5C5852] dark:text-[#A39E93]">
            {property.checkInTime && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]">
                <Clock className="w-3.5 h-3.5 text-[#F55A51]" />
                {language === 'ka'
                  ? `შესვლა: ${property.checkInTime}`
                  : language === 'ru'
                  ? `Заезд: ${property.checkInTime}`
                  : `In ${property.checkInTime}`}
              </span>
            )}
            {property.checkOutTime && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926]">
                {language === 'ka'
                  ? `გასვლა: ${property.checkOutTime}`
                  : language === 'ru'
                  ? `Выезд: ${property.checkOutTime}`
                  : `Out ${property.checkOutTime}`}
              </span>
            )}
          </div>
        </div>

        {/* Main 2-Column Essential Credentials: Door Code & Wi-Fi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#EBE6DF] dark:divide-[#2B2926]">
          {/* Door / Lockbox Code */}
          <div
            onClick={onOpenCheckinInstructions}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenCheckinInstructions();
              }
            }}
            className="p-5 text-left hover:bg-[#FAF8F5]/75 dark:hover:bg-[#141312]/40 transition-colors flex flex-col justify-between gap-3.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93]">
                    {property.doorKeypadCode
                      ? language === 'ka'
                        ? 'კარის კოდი'
                        : language === 'ru'
                        ? 'Код двери'
                        : 'Door Code'
                      : property.lockboxCode
                      ? language === 'ka'
                        ? 'სეიფის კოდი'
                        : language === 'ru'
                        ? 'Код сейфа'
                        : 'Lockbox Code'
                      : language === 'ka'
                      ? 'შესვლის ინსტრუქცია'
                      : language === 'ru'
                      ? 'Инструкция по входу'
                      : 'Check-In Access'}
                  </p>
                </div>
              </div>
              {doorCode ? (
                <button
                  type="button"
                  onClick={copyDoorCode}
                  className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] hover:border-[#F55A51]/50 flex items-center gap-1.5 transition-colors min-h-[38px] shrink-0"
                >
                  {copiedField === 'door' ? (
                    <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                  )}
                  {copiedField === 'door'
                    ? language === 'ka'
                      ? 'დაკოპირდა'
                      : language === 'ru'
                      ? 'Скопировано'
                      : 'Copied'
                    : language === 'ka'
                    ? 'კოპირება'
                    : language === 'ru'
                    ? 'Копировать'
                    : 'Copy'}
                </button>
              ) : (
                <ChevronRight className="w-4 h-4 text-[#7A756D] group-hover:translate-x-0.5 transition-transform shrink-0" />
              )}
            </div>

            <div>
              {doorCode ? (
                <div className="space-y-1.5">
                  <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                    {doorCode}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F55A51] group-hover:underline">
                    {language === 'ka'
                      ? 'შესვლის სრული ინსტრუქცია'
                      : language === 'ru'
                      ? 'Пошаговая инструкция входа'
                      : 'Step-by-step entry guide'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ) : (
                <p className="text-sm font-bold text-[#F55A51] flex items-center gap-1">
                  {isAccessUnlocked
                    ? language === 'ka'
                      ? 'შესვლის ნაბიჯების ნახვა'
                      : language === 'ru'
                      ? 'Открыть инструкцию входа'
                      : 'Open Entry Instructions'
                    : language === 'ka'
                    ? 'შესვლის კოდის გახსნა'
                    : language === 'ru'
                    ? 'Разблокировать код входа'
                    : 'Unlock with Check-In Key'}
                  <ChevronRight className="w-4 h-4" />
                </p>
              )}
            </div>
          </div>

          {/* Instant Wi-Fi Copy */}
          <div
            onClick={onOpenWifiModal}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenWifiModal();
              }
            }}
            className="p-5 text-left hover:bg-[#FAF8F5]/75 dark:hover:bg-[#141312]/40 transition-colors flex flex-col justify-between gap-3.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#748C96]/15 text-[#748C96] flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93]">
                    {language === 'ka' ? 'Wi-Fi ქსელი' : language === 'ru' ? 'Сеть Wi-Fi' : 'Wi-Fi Network'}
                  </p>
                  {hasWifiCredentials && (
                    <p className="text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                      {property.wifiNetwork || 'Property Wi-Fi'}
                    </p>
                  )}
                </div>
              </div>
              {hasWifiCredentials && property.wifiPassword ? (
                <button
                  type="button"
                  onClick={copyWifi}
                  className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] hover:border-[#F55A51]/50 flex items-center gap-1.5 transition-colors min-h-[38px] shrink-0"
                >
                  {copiedField === 'wifi' ? (
                    <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                  )}
                  {copiedField === 'wifi'
                    ? language === 'ka'
                      ? 'დაკოპირდა'
                      : language === 'ru'
                      ? 'Скопировано'
                      : 'Copied'
                    : language === 'ka'
                    ? 'პაროლი'
                    : language === 'ru'
                    ? 'Пароль'
                    : 'Copy Pass'}
                </button>
              ) : (
                <ChevronRight className="w-4 h-4 text-[#7A756D] group-hover:translate-x-0.5 transition-transform shrink-0" />
              )}
            </div>

            <div>
              {hasWifiCredentials ? (
                <div className="space-y-1.5">
                  {property.wifiPassword ? (
                    <p className="font-mono text-base sm:text-lg font-bold tracking-wide text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                      {property.wifiPassword}
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                      {property.wifiNetwork}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#748C96] group-hover:underline">
                    {language === 'ka'
                      ? 'კავშირის დეტალები'
                      : language === 'ru'
                      ? 'Детали подключения'
                      : 'Connection details'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ) : (
                <p className="text-sm font-bold text-[#748C96] flex items-center gap-1">
                  {isAccessUnlocked
                    ? language === 'ka'
                      ? 'დეტალების ნახვა'
                      : language === 'ru'
                      ? 'Показать детали'
                      : 'View Wi-Fi Info'
                    : language === 'ka'
                    ? 'პაროლის გახსნა'
                    : language === 'ru'
                    ? 'Разблокировать Wi-Fi'
                    : 'Unlock Wi-Fi Credentials'}
                  <ChevronRight className="w-4 h-4" />
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Perforated Boarding-Pass Divider */}
        <div className="relative flex items-center justify-between px-2">
          <div className="w-4 h-4 rounded-full bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] -ml-4" />
          <div className="flex-1 border-t border-dashed border-[#EBE6DF] dark:border-[#2B2926] mx-2" />
          <div className="w-4 h-4 rounded-full bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] -mr-4" />
        </div>

        {/* Bottom Strip: Address + Copy + Maps Navigation */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-[#FAF8F5]/60 dark:bg-[#141312]/40">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FFC757]/20 text-[#1C1B1A] dark:text-[#FFC757] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93]">
                {language === 'ka'
                  ? 'საცხოვრებლის მისამართი'
                  : language === 'ru'
                  ? 'Адрес проживания'
                  : 'Property Location'}
              </p>
              <p className="text-sm font-bold text-[#1C1B1A] dark:text-[#F7F5F0] break-words mt-0.5">
                {hasExactAddress
                  ? property.address
                  : `${property.city || 'Tbilisi'}, ${property.country || 'Georgia'}`}
              </p>
              {!hasExactAddress && (
                <p className="text-[11px] text-[#7A756D] dark:text-[#A39E93] mt-0.5">
                  {language === 'ka'
                    ? 'ზუსტი მისამართი ჩანს წვდომის კოდის გახსნის შემდეგ'
                    : language === 'ru'
                    ? 'Точный адрес доступен после ввода ключа доступа'
                    : 'Exact street address unlocks with your check-in key'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasExactAddress && (
              <button
                type="button"
                onClick={copyAddress}
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-[#1C1B1A] dark:text-[#F7F5F0] text-xs font-bold flex items-center gap-1.5 hover:border-[#F55A51]/40 transition-colors min-h-[42px] cursor-pointer"
              >
                {copiedField === 'address' ? (
                  <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                )}
                {copiedField === 'address'
                  ? language === 'ka'
                    ? 'დაკოპირდა'
                    : language === 'ru'
                    ? 'Скопировано'
                    : 'Copied'
                  : language === 'ka'
                  ? 'კოპირება'
                  : language === 'ru'
                  ? 'Копировать'
                  : 'Copy'}
              </button>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapsDestination}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity min-h-[42px]"
            >
              <Navigation className="w-3.5 h-3.5 text-[#F55A51]" />
              {language === 'ka' ? 'რუკა' : language === 'ru' ? 'Маршрут' : 'Directions'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
