import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Car,
  BedDouble,
  MessageSquare,
  Send,
  CheckCircle2,
  MessageCircle,
  Wifi,
  Thermometer,
} from 'lucide-react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { GuestRequest, Property, RequestCategory } from '../../types';
import { useApp } from '../../context/AppContext';

export interface GuestRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'ka' | 'ru';
  property?: Property;
}

const REQUEST_OPTIONS: {
  id: string;
  category: RequestCategory;
  label: { en: string; ka: string; ru: string };
  desc: { en: string; ka: string; ru: string };
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'late_checkout',
    category: 'other',
    label: { en: 'Late Check-Out', ka: 'გვიანი გასვლა', ru: 'Поздний выезд' },
    desc: {
      en: 'Request extra time before departure',
      ka: 'დამატებითი დრო გასვლამდე',
      ru: 'Дополнительное время перед выездом',
    },
    icon: Clock,
  },
  {
    id: 'extra_towels',
    category: 'cleaning',
    label: {
      en: 'Fresh Linens & Towels',
      ka: 'დამატებითი პირსახოცები',
      ru: 'Свежие полотенца и бельё',
    },
    desc: {
      en: 'Extra towels, pillows, or blankets',
      ka: 'პირსახოცი, ბალიში ან პლედი',
      ru: 'Полотенца, подушки или одеяла',
    },
    icon: BedDouble,
  },
  {
    id: 'climate_help',
    category: 'climate',
    label: {
      en: 'Heating / AC Help',
      ka: 'გათბობა / კონდიცირება',
      ru: 'Отопление и климат',
    },
    desc: {
      en: 'Assistance with boiler or temperature',
      ka: 'დახმარება ქვაბთან ან ტემპერატურასთან',
      ru: 'Помощь с котлом или кондиционером',
    },
    icon: Thermometer,
  },
  {
    id: 'wifi_help',
    category: 'wifi',
    label: {
      en: 'Wi-Fi / TV Support',
      ka: 'Wi-Fi / ტელევიზია',
      ru: 'Помощь с Wi-Fi / ТВ',
    },
    desc: {
      en: 'Connection or smart TV assistance',
      ka: 'ინტერნეტის ან ტელევიზორის დახმარება',
      ru: 'Помощь с интернетом или ТВ',
    },
    icon: Wifi,
  },
  {
    id: 'airport_transfer',
    category: 'other',
    label: { en: 'Airport Transfer', ka: 'აეროპორტის ტრანსფერი', ru: 'Трансфер в аэропорт' },
    desc: {
      en: 'Arrange a pickup or drop-off',
      ka: 'ტაქსის ან დახვედრის ორგანიზება',
      ru: 'Заказать встречу или поездку',
    },
    icon: Car,
  },
  {
    id: 'custom',
    category: 'other',
    label: { en: 'Something Else', ka: 'სხვა მოთხოვნა', ru: 'Другой вопрос' },
    desc: {
      en: 'Ask your host anything',
      ka: 'ნებისმიერი კითხვა მასპინძელს',
      ru: 'Любой вопрос хозяину',
    },
    icon: MessageSquare,
  },
];

export const GuestRequestModal: React.FC<GuestRequestModalProps> = ({
  isOpen,
  onClose,
  language: propLanguage,
  property,
}) => {
  const {
    currentProperty,
    requests,
    addGuestRequest,
    isPropertyAccessUnlocked,
    language: ctxLanguage,
  } = useApp();

  const resolvedProperty = property || currentProperty;
  const language = propLanguage || ctxLanguage;

  const [selectedOptionId, setSelectedOptionId] = useState<string>('late_checkout');
  const [guestName, setGuestName] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [message, setMessage] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<GuestRequest | null>(null);

  const isAccessUnlocked = isPropertyAccessUnlocked(resolvedProperty);
  const cleanHostWhatsApp = resolvedProperty.hostWhatsApp
    ? resolvedProperty.hostWhatsApp.replace(/[^0-9]/g, '')
    : '';
  const canUseDirectWhatsApp = Boolean(isAccessUnlocked && cleanHostWhatsApp);

  const propertyRequests = requests.filter(r => r.propertyId === resolvedProperty.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const option =
      REQUEST_OPTIONS.find(o => o.id === selectedOptionId) || REQUEST_OPTIONS[0];

    const newReq: Omit<GuestRequest, 'id' | 'createdAt' | 'status'> = {
      propertyId: resolvedProperty.id,
      hostId: resolvedProperty.ownerId,
      propertyName: resolvedProperty.title,
      guestName:
        guestName.trim() ||
        (language === 'ka'
          ? 'სტუმარი'
          : language === 'ru'
          ? 'Гость'
          : 'Current Guest'),
      category: option.category,
      title: option.label[language],
      description: message.trim() || option.desc[language],
      urgency,
    };

    addGuestRequest(newReq);
    setSubmittedRequest({
      ...newReq,
      id: `req-${Date.now()}`,
      status: 'new',
      createdAt:
        language === 'ka' ? 'ახლახანს' : language === 'ru' ? 'Только что' : 'Just now',
    });
  };

  const getWhatsAppForwardUrl = (req: GuestRequest) => {
    const text = `Hi ${resolvedProperty.hostName}! I'm staying at ${resolvedProperty.title} (${req.guestName}). Request: ${req.title}${
      req.description ? ` — ${req.description}` : ''
    }`;
    return `https://wa.me/${cleanHostWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  const resetAndClose = () => {
    setSubmittedRequest(null);
    setMessage('');
    onClose();
  };

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={resetAndClose}
      title={
        language === 'ka'
          ? 'მოთხოვნა მასპინძელთან'
          : language === 'ru'
          ? 'Запрос хозяину'
          : `Request for ${resolvedProperty.hostName}`
      }
    >
      <div className="space-y-5 pb-4">
        {submittedRequest ? (
          <div className="py-5 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-xl font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                {language === 'ka'
                  ? 'მოთხოვნა მომზადებულია'
                  : language === 'ru'
                  ? 'Запрос сформирован'
                  : 'Request Prepared'}
              </h4>
              <p className="text-xs text-[#7A756D] dark:text-[#A39E93] max-w-sm mx-auto leading-relaxed">
                {canUseDirectWhatsApp
                  ? language === 'ka'
                    ? `თქვენი მოთხოვნა შენახულია. სწრაფი პასუხისთვის გაუგზავნეთ პირდაპირ ${resolvedProperty.hostName}-ს WhatsApp-ში.`
                    : language === 'ru'
                    ? `Ваш запрос сохранён. Для мгновенного ответа отправьте его ${resolvedProperty.hostName} в WhatsApp.`
                    : `Your request is saved below. For the fastest response, send it directly to ${resolvedProperty.hostName} on WhatsApp.`
                  : language === 'ka'
                  ? `თქვენი მოთხოვნა ჩაწერილია ${resolvedProperty.hostName}-ისთვის.`
                  : language === 'ru'
                  ? `Ваш запрос записан для ${resolvedProperty.hostName}.`
                  : `Your request has been logged for ${resolvedProperty.hostName}.`}
              </p>
            </div>

            {canUseDirectWhatsApp && (
              <a
                href={getWhatsAppForwardUrl(submittedRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity min-h-[46px]"
              >
                <MessageCircle className="w-4 h-4" />
                {language === 'ka'
                  ? `გაგზავნა ${resolvedProperty.hostName}-თან WhatsApp-ში`
                  : language === 'ru'
                  ? `Отправить ${resolvedProperty.hostName} в WhatsApp`
                  : `Send to ${resolvedProperty.hostName} via WhatsApp`}
              </a>
            )}

            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] cursor-pointer"
            >
              {language === 'ka' ? 'დახურვა' : language === 'ru' ? 'Закрыть' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Request Type Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                {language === 'ka'
                  ? 'რისი მოთხოვნა გსურთ?'
                  : language === 'ru'
                  ? 'Чем может помочь хозяин?'
                  : 'How can your host help?'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REQUEST_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const active = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        active
                          ? 'bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] border-[#1C1B1A] dark:border-[#F7F5F0] shadow-sm'
                          : 'bg-white dark:bg-[#1F1E1C] text-[#1C1B1A] dark:text-[#F7F5F0] border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51]/40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-[#F55A51] text-white'
                            : 'bg-[#FAF8F5] dark:bg-[#141312] text-[#F55A51]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs">{opt.label[language]}</p>
                        <p
                          className={`text-[11px] mt-0.5 line-clamp-1 ${
                            active
                              ? 'text-[#F7F5F0]/75 dark:text-[#1C1B1A]/75'
                              : 'text-[#7A756D] dark:text-[#A39E93]'
                          }`}
                        >
                          {opt.desc[language]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Name & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#7A756D] dark:text-[#A39E93] block mb-1">
                  {language === 'ka'
                    ? 'თქვენი სახელი'
                    : language === 'ru'
                    ? 'Ваше имя'
                    : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder={
                    language === 'ka' ? 'სახელი' : language === 'ru' ? 'Имя' : 'e.g. Alex'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs text-[#1C1B1A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#F55A51]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7A756D] dark:text-[#A39E93] block mb-1">
                  {language === 'ka'
                    ? 'პრიორიტეტი'
                    : language === 'ru'
                    ? 'Срочность'
                    : 'Urgency'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['low', 'medium', 'high'] as const).map(level => {
                    const labelMap = {
                      low: { en: 'Low', ka: 'დაბალი', ru: 'Низкая' },
                      medium: { en: 'Medium', ka: 'საშუალო', ru: 'Средняя' },
                      high: { en: 'High', ka: 'მაღალი', ru: 'Высокая' },
                    };
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgency(level)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          urgency === level
                            ? 'bg-[#F55A51] text-white border-[#F55A51]'
                            : 'bg-white dark:bg-[#1F1E1C] text-[#7A756D] dark:text-[#A39E93] border-[#EBE6DF] dark:border-[#2B2926]'
                        }`}
                      >
                        {labelMap[level][language]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-bold text-[#7A756D] dark:text-[#A39E93] block mb-1">
                {language === 'ka'
                  ? 'დამატებითი დეტალები'
                  : language === 'ru'
                  ? 'Дополнительные детали'
                  : 'Additional Details'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={
                  language === 'ka'
                    ? `მიწერეთ დეტალები ${resolvedProperty.hostName}-ს...`
                    : language === 'ru'
                    ? `Напишите детали для ${resolvedProperty.hostName}...`
                    : `Add preferred time or helpful details for ${resolvedProperty.hostName}...`
                }
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs text-[#1C1B1A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#F55A51]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#F55A51] hover:bg-[#E04840] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[46px] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {language === 'ka'
                ? 'მოთხოვნის გაგზავნა'
                : language === 'ru'
                ? 'Отправить запрос'
                : `Send Request to ${resolvedProperty.hostName}`}
            </button>

            {/* Recent Session Requests */}
            {propertyRequests.length > 0 && (
              <div className="pt-4 border-t border-[#EBE6DF] dark:border-[#2B2926] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                  {language === 'ka'
                    ? 'ამ სესიაზე გაგზავნილი მოთხოვნები'
                    : language === 'ru'
                    ? 'Запросы в этой сессии'
                    : 'Recent Requests in This Session'}
                </span>
                <div className="space-y-2">
                  {propertyRequests.slice(0, 3).map(req => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1C1B1A] dark:text-[#F7F5F0] truncate">
                          {req.title}
                        </p>
                        {req.description && (
                          <p className="text-[11px] text-[#7A756D] dark:text-[#A39E93] truncate">
                            {req.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#FFC757]/20 text-[#1C1B1A] dark:text-[#FFC757] text-[10px] font-bold shrink-0">
                        {req.status === 'resolved'
                          ? language === 'ka'
                            ? 'შესრულდა'
                            : language === 'ru'
                            ? 'Выполнено'
                            : 'Resolved'
                          : req.status === 'in_progress'
                          ? language === 'ka'
                            ? 'მუშავდება'
                            : language === 'ru'
                            ? 'В работе'
                            : 'In Progress'
                          : language === 'ka'
                          ? 'ახალი'
                          : language === 'ru'
                          ? 'Новый'
                          : 'New'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </MobileBottomSheet>
  );
};
