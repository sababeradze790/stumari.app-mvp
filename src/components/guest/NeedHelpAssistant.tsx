import React, { useState, useMemo } from 'react';
import {
  Wifi,
  KeyRound,
  Flame,
  LogOut,
  Trash2,
  Car,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Lock,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { getCachedGuidebook } from '../../pwa';
import { safeCopyToClipboard } from '../../utils/clipboard';

export interface NeedHelpAssistantProps {
  property: Property;
  language?: 'en' | 'ka' | 'ru';
  onOpenRequestModal?: () => void;
  onOpenUnlockModal?: () => void;
  onOpenSection?: (section: string) => void;
}

type TopicId = 'wifi' | 'door' | 'heating' | 'checkout' | 'trash' | 'airport';

export const NeedHelpAssistant: React.FC<NeedHelpAssistantProps> = ({
  property,
  language: propLanguage,
  onOpenRequestModal,
  onOpenUnlockModal,
}) => {
  const { isPropertyAccessUnlocked, language: ctxLanguage, showToast } = useApp();
  const language = propLanguage || ctxLanguage;
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>('wifi');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const isAccessUnlocked = isPropertyAccessUnlocked(property);
  const cleanHostWhatsApp = property.hostWhatsApp
    ? property.hostWhatsApp.replace(/[^0-9]/g, '')
    : '';
  const canUseDirectWhatsApp = Boolean(isAccessUnlocked && cleanHostWhatsApp);

  // Only show an offline-cached indicator if the guidebook is genuinely cached in localStorage
  const hasRealOfflineCopy = useMemo(() => {
    try {
      return Boolean(property.slug && getCachedGuidebook(property.slug));
    } catch {
      return false;
    }
  }, [property.slug]);

  const handleCopy = async (val: string, label: string) => {
    const ok = await safeCopyToClipboard(val);
    if (ok) {
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } else {
      showToast(
        language === 'ka'
          ? 'ავტომატური კოპირება ვერ მოხერხდა'
          : language === 'ru'
          ? 'Не удалось скопировать автоматически'
          : 'Could not copy automatically'
      );
    }
  };

  const boilerAppliance = property.appliances?.find(a => {
    const titleLower = (a.title || a.name || '').toLowerCase();
    return (
      titleLower.includes('boiler') ||
      titleLower.includes('heat') ||
      titleLower.includes('thermostat') ||
      titleLower.includes('water') ||
      a.icon === 'Flame' ||
      a.icon === 'Thermometer' ||
      a.category === 'climate'
    );
  });

  const topicGroups: {
    id: 'access' | 'comfort' | 'departure';
    title: { en: string; ka: string; ru: string };
    items: {
      id: TopicId;
      label: { en: string; ka: string; ru: string };
      icon: React.FC<{ className?: string }>;
    }[];
  }[] = [
    {
      id: 'comfort',
      title: {
        en: 'In-Apartment Comfort & Wi-Fi',
        ka: 'კომფორტი და Wi-Fi',
        ru: 'Комфорт в доме и Wi-Fi',
      },
      items: [
        {
          id: 'wifi',
          label: { en: 'Wi-Fi connection & password', ka: 'Wi-Fi კავშირი და პაროლი', ru: 'Wi-Fi и пароль сети' },
          icon: Wifi,
        },
        {
          id: 'heating',
          label: { en: 'Hot water, heating & A/C', ka: 'ცხელი წყალი და გათბობა', ru: 'Отопление и горячая вода' },
          icon: Flame,
        },
      ],
    },
    {
      id: 'access',
      title: {
        en: 'Arrival, Access & Getting Around',
        ka: 'შესვლა და ტრანსპორტი',
        ru: 'Заселение и транспорт',
      },
      items: [
        {
          id: 'door',
          label: { en: 'Door / Lockbox access codes', ka: 'კარის გაღება და კოდები', ru: 'Доступ и коды замков' },
          icon: KeyRound,
        },
        {
          id: 'airport',
          label: { en: 'Taxi & airport transfer', ka: 'ტაქსი და ტრანსფერი', ru: 'Такси и аэропорт' },
          icon: Car,
        },
      ],
    },
    {
      id: 'departure',
      title: {
        en: 'Housekeeping & Check-Out',
        ka: 'სისუფთავე და გასვლა',
        ru: 'Порядок и выезд',
      },
      items: [
        {
          id: 'trash',
          label: { en: 'Trash & recycling location', ka: 'ნაგვის გატანა', ru: 'Вынос мусора' },
          icon: Trash2,
        },
        {
          id: 'checkout',
          label: { en: 'Check-out time & steps', ka: 'გასვლის დრო და წესები', ru: 'Время и правила выезда' },
          icon: LogOut,
        },
      ],
    },
  ];

  const renderTopicAnswer = (topic: TopicId) => {
    switch (topic) {
      case 'wifi': {
        if (!isAccessUnlocked) {
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#748C96]">
                <Lock className="w-4 h-4 text-[#F55A51]" />
                {language === 'ka'
                  ? 'Wi-Fi-ს მონაცემები დაცულია წვდომის გასაღებით'
                  : language === 'ru'
                  ? 'Данные Wi-Fi защищены ключом доступа'
                  : 'Wi-Fi credentials are protected by your guest access key'}
              </div>
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                {language === 'ka'
                  ? 'გთხოვთ გახსნათ სტუმრის გზამკვლევი თქვენი QR ბმულით ან შეიყვანოთ წვდომის კოდი.'
                  : language === 'ru'
                  ? 'Откройте гид по QR-ссылке от хозяина или введите ключ доступа.'
                  : 'Open this guide using your check-in QR link or enter your guest key to view the network name and password.'}
              </p>
              {onOpenUnlockModal && (
                <button
                  type="button"
                  onClick={onOpenUnlockModal}
                  className="px-3.5 py-2 rounded-xl bg-[#F55A51] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  {language === 'ka'
                    ? 'წვდომის კოდის შეყვანა'
                    : language === 'ru'
                    ? 'Ввести ключ доступа'
                    : 'Enter Access Key'}
                </button>
              )}
            </div>
          );
        }

        if (!property.wifiNetwork && !property.wifiPassword) {
          return (
            <p className="text-xs text-[#5C5852] dark:text-[#A39E93]">
              {language === 'ka'
                ? `Wi-Fi-ს მონაცემები ჯერ არ არის მითითებული. გთხოვთ მიწეროთ ${property.hostName}-ს.`
                : language === 'ru'
                ? `Данные Wi-Fi пока не указаны. Пожалуйста, напишите ${property.hostName}.`
                : `Wi-Fi details haven't been added yet. Please message ${property.hostName} below.`}
            </p>
          );
        }

        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {property.wifiNetwork && (
                <div className="p-3 rounded-xl bg-white dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                    {language === 'ka' ? 'ქსელი' : language === 'ru' ? 'Сеть' : 'Network (SSID)'}
                  </span>
                  <span className="text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                    {property.wifiNetwork}
                  </span>
                </div>
              )}
              {property.wifiPassword && (
                <div className="p-3 rounded-xl bg-white dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                      {language === 'ka' ? 'პაროლი' : language === 'ru' ? 'Пароль' : 'Password'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1C1B1A] dark:text-[#F7F5F0] truncate block">
                      {property.wifiPassword}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(property.wifiPassword, 'wifi')}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedText === 'wifi' ? (
                      <Check className="w-3 h-3 text-[#2E7D32]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedText === 'wifi'
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
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'door': {
        if (!isAccessUnlocked) {
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#748C96]">
                <Lock className="w-4 h-4 text-[#F55A51]" />
                {language === 'ka'
                  ? 'შესვლის კოდები დაცულია'
                  : language === 'ru'
                  ? 'Коды доступа защищены'
                  : 'Door and lockbox codes require your check-in key'}
              </div>
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                {language === 'ka'
                  ? 'უსაფრთხოების მიზნით, კარის კოდი ჩანს მხოლოდ წვდომის გასაღების შეყვანის შემდეგ.'
                  : language === 'ru'
                  ? 'В целях безопасности коды от двери доступны только по ключу заезда.'
                  : 'For guest security, keypad and lockbox codes are only shown after unlocking with your check-in key.'}
              </p>
              {onOpenUnlockModal && (
                <button
                  type="button"
                  onClick={onOpenUnlockModal}
                  className="px-3.5 py-2 rounded-xl bg-[#F55A51] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  {language === 'ka'
                    ? 'წვდომის კოდის შეყვანა'
                    : language === 'ru'
                    ? 'Ввести ключ доступа'
                    : 'Enter Access Key'}
                </button>
              )}
            </div>
          );
        }

        const code = property.doorKeypadCode || property.lockboxCode;
        const directions = property.arrivalDirections;

        return (
          <div className="space-y-3">
            {code && (
              <div className="p-3 rounded-xl bg-white dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                    {property.doorKeypadCode
                      ? language === 'ka'
                        ? 'კარის კოდი'
                        : language === 'ru'
                        ? 'Код двери'
                        : 'Door Keypad Code'
                      : language === 'ka'
                      ? 'სეიფის კოდი'
                      : language === 'ru'
                      ? 'Код сейфа'
                      : 'Lockbox Code'}
                  </span>
                  <span className="text-sm font-mono font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(code, 'door')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === 'door' ? (
                    <Check className="w-3 h-3 text-[#2E7D32]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedText === 'door'
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
              </div>
            )}
            {directions ? (
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed whitespace-pre-line">
                {directions}
              </p>
            ) : (
              !code && (
                <p className="text-xs text-[#5C5852] dark:text-[#A39E93]">
                  {language === 'ka'
                    ? `შესვლის დეტალებისთვის მიწერეთ ${property.hostName}-ს.`
                    : language === 'ru'
                    ? `Свяжитесь с ${property.hostName} для уточнения деталей входа.`
                    : `Please contact ${property.hostName} for arrival access instructions.`}
                </p>
              )
            )}
          </div>
        );
      }

      case 'heating': {
        if (boilerAppliance) {
          return (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                {boilerAppliance.title || boilerAppliance.name}
              </p>
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                {boilerAppliance.instructions}
              </p>
              {(boilerAppliance.troubleshootingTip || boilerAppliance.troubleshooting) && (
                <p className="text-xs text-[#F55A51] mt-1">
                  {boilerAppliance.troubleshootingTip || boilerAppliance.troubleshooting}
                </p>
              )}
            </div>
          );
        }
        return (
          <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
            {language === 'ka'
              ? `გათბობისა და ცხელი წყლის ინსტრუქცია არ არის მითითებული. გთხოვთ მიწეროთ ${property.hostName}-ს დახმარებისთვის.`
              : language === 'ru'
              ? `Инструкция по отоплению и горячей воде не указана. Напишите ${property.hostName} для быстрой помощи.`
              : `No specific boiler or thermostat manual has been added for this property yet. Reach out to ${property.hostName} below if you need help adjusting the temperature.`}
          </p>
        );
      }

      case 'checkout': {
        const checklist = property.departureChecklist || [];

        return (
          <div className="space-y-2.5">
            {property.checkOutTime && (
              <p className="text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                {language === 'ka'
                  ? `გასვლის დრო: ${property.checkOutTime}`
                  : language === 'ru'
                  ? `Время выезда: ${property.checkOutTime}`
                  : `Scheduled Check-Out Time: ${property.checkOutTime}`}
              </p>
            )}
            {checklist.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-[#5C5852] dark:text-[#A39E93]">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#F55A51] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93]">
                {language === 'ka'
                  ? `დამატებითი გასვლის სია არ არის მითითებული. გთხოვთ შეამოწმოთ პირადი ნივთები.`
                  : language === 'ru'
                  ? `Дополнительный чек-лист выезда не указан. Пожалуйста, проверьте личные вещи.`
                  : `No special departure checklist is configured—simply make sure you have all personal belongings before locking up.`}
              </p>
            )}
          </div>
        );
      }

      case 'trash': {
        return (
          <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
            {property.trashSchedule ||
              (language === 'ka'
                ? `ნაგვის გატანის წესი ჯერ არ არის მითითებული. ჰკითხეთ ${property.hostName}-ს.`
                : language === 'ru'
                ? `Инструкция по выносу мусора пока не добавлена. Уточните у ${property.hostName}.`
                : `No specific waste disposal instructions are listed yet. Ask ${property.hostName} if you need the nearest bin location.`)}
          </p>
        );
      }

      case 'airport': {
        const transitNotes =
          property.airportTransit || property.taxiInfo || property.transitInfo;

        return (
          <div className="space-y-2.5">
            {transitNotes ? (
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                {transitNotes}
              </p>
            ) : (
              <p className="text-xs text-[#5C5852] dark:text-[#A39E93] leading-relaxed">
                {language === 'ka'
                  ? 'შეგიძლიათ მოითხოვოთ აეროპორტის ტრანსფერი პირდაპირ მასპინძელთან ქვემოთ მოცემული ღილაკით.'
                  : language === 'ru'
                  ? 'Вы можете запросить трансфер в аэропорт у хозяина через кнопку запроса ниже.'
                  : `You can request an airport transfer or taxi arrangement from ${property.hostName} using the request button below.`}
              </p>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] p-5 sm:p-6 space-y-5 shadow-[0_8px_28px_-14px_rgba(28,27,26,0.06)] dark:shadow-none">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F55A51]/10 text-[#F55A51] flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1B1A] dark:text-[#F7F5F0]">
                {language === 'ka'
                  ? 'სწრაფი დახმარება'
                  : language === 'ru'
                  ? 'Быстрые ответы по дому'
                  : 'Quick Stay Answers'}
              </h3>
              {hasRealOfflineCopy && (
                <span className="px-2 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] text-[10px] font-bold">
                  {language === 'ka'
                    ? 'ოფლაინ ასლი'
                    : language === 'ru'
                    ? 'Офлайн-копия'
                    : 'Cached on device'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#7A756D] dark:text-[#A39E93]">
              {language === 'ka'
                ? 'დააჭირეთ კითხვას მყისიერი პასუხისთვის'
                : language === 'ru'
                ? 'Нажмите на вопрос для мгновенного ответа'
                : `Organized by your stay needs from ${property.hostName}'s manual`}
            </p>
          </div>
        </div>
      </div>

      {/* Tier 3: Grouped Progressive-Disclosure Accordions */}
      <div className="space-y-4">
        {topicGroups.map(group => (
          <div key={group.id} className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#748C96] px-1 block">
              {group.title[language]}
            </span>

            <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] divide-y divide-[#EBE6DF] dark:divide-[#2B2926] overflow-hidden">
              {group.items.map(t => {
                const Icon = t.icon;
                const active = selectedTopic === t.id;
                return (
                  <div key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTopic(active ? null : t.id)}
                      aria-expanded={active}
                      className={`w-full px-4 py-3.5 text-left transition-colors flex items-center justify-between gap-3 min-h-[52px] cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-[#1F1E1C] text-[#1C1B1A] dark:text-[#F7F5F0]'
                          : 'hover:bg-white/60 dark:hover:bg-[#1F1E1C]/50 text-[#1C1B1A] dark:text-[#F7F5F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            active
                              ? 'bg-[#F55A51] text-white'
                              : 'bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-[#7A756D]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold leading-snug">
                          {t.label[language]}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#7A756D] shrink-0 transition-transform duration-200 ${
                          active ? 'rotate-180 text-[#F55A51]' : ''
                        }`}
                      />
                    </button>

                    {active && (
                      <div className="px-4 pb-4 pt-2 bg-white dark:bg-[#1F1E1C] space-y-3 border-t border-[#EBE6DF]/60 dark:border-[#2B2926]/60">
                        {renderTopicAnswer(t.id)}

                        <div className="pt-2.5 border-t border-[#EBE6DF]/60 dark:border-[#2B2926]/60 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-[#7A756D] dark:text-[#A39E93]">
                            {language === 'ka'
                              ? 'კიდევ გჭირდებათ დახმარება?'
                              : language === 'ru'
                              ? 'Всё ещё нужна помощь?'
                              : 'Still need a hand with this?'}
                          </span>

                          <div className="flex items-center gap-2">
                            {onOpenRequestModal && (
                              <button
                                type="button"
                                onClick={onOpenRequestModal}
                                className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] flex items-center gap-1.5 hover:border-[#F55A51]/40 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#F55A51]" />
                                {language === 'ka'
                                  ? 'მოთხოვნის გაგზავნა'
                                  : language === 'ru'
                                  ? 'Оставить запрос'
                                  : 'Send Stay Request'}
                              </button>
                            )}

                            {canUseDirectWhatsApp && (
                              <a
                                href={`https://wa.me/${cleanHostWhatsApp}?text=${encodeURIComponent(
                                  `Hi ${property.hostName}! Quick question from your Stumari guide at ${property.title}...`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
