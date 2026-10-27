import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Send,
  ThumbsUp,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { Property, GuestSentiment, StayFeedbackCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { safeCopyToClipboard } from '../../utils/clipboard';

export interface ReviewEngineModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  property?: Property;
  language?: 'en' | 'ka' | 'ru';
  initialStars?: number | null;
  onSubmitted?: () => void;
}

const HIGHLIGHT_TAGS: {
  id: StayFeedbackCategory;
  label: { en: string; ka: string; ru: string };
}[] = [
  { id: 'cleanliness', label: { en: 'Spotless Clean', ka: 'იდეალური სისუფთავე', ru: 'Идеальная чистота' } },
  { id: 'location', label: { en: 'Great Location', ka: 'საუკეთესო მდებარეობა', ru: 'Отличная локация' } },
  { id: 'check_in', label: { en: 'Smooth Check-in', ka: 'მარტივი შესვლა', ru: 'Лёгкое заселение' } },
  { id: 'communication', label: { en: 'Responsive Host', ka: 'ყურადღებიანი მასპინძელი', ru: 'Отзывчивый хозяин' } },
  { id: 'wifi', label: { en: 'Fast Wi-Fi', ka: 'სწრაფი Wi-Fi', ru: 'Быстрый Wi-Fi' } },
  { id: 'equipment', label: { en: 'Great Amenities', ka: 'კომფორტული გარემო', ru: 'Отличные удобства' } },
];

export const ReviewEngineModal: React.FC<ReviewEngineModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  property: propProperty,
  language: propLanguage,
  initialStars = null,
  onSubmitted,
}) => {
  const {
    currentProperty,
    language: ctxLanguage,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    addStayFeedback,
    isPropertyAccessUnlocked,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isFeedbackModalOpen;
  const onClose = propOnClose || (() => setIsFeedbackModalOpen(false));
  const property = propProperty || currentProperty;
  const language = propLanguage || ctxLanguage;

  const [sentiment, setSentiment] = useState<GuestSentiment | null>(null);
  const [selectedTags, setSelectedTags] = useState<StayFeedbackCategory[]>([]);
  const [guestName, setGuestName] = useState('');
  const [publicNote, setPublicNote] = useState('');
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  const isAccessUnlocked = isPropertyAccessUnlocked(property);
  const cleanHostWhatsApp = property.hostWhatsApp
    ? property.hostWhatsApp.replace(/[^0-9]/g, '')
    : '';
  const canUseDirectWhatsApp = Boolean(isAccessUnlocked && cleanHostWhatsApp);

  // Sync initial star selection from the Review tab into the modal sentiment state
  useEffect(() => {
    if (!isOpen) return;
    if (initialStars) {
      if (initialStars >= 5) setSentiment('amazing');
      else if (initialStars === 4) setSentiment('good');
      else if (initialStars === 3) setSentiment('could_be_better');
      else setSentiment('problem');
    } else {
      setSentiment(null);
    }
  }, [isOpen, initialStars]);

  const toggleTag = (id: StayFeedbackCategory) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isPositive = sentiment === 'amazing' || sentiment === 'good';
  const isNegative = sentiment === 'could_be_better' || sentiment === 'problem';

  const handleSubmitPositive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentiment) return;
    addStayFeedback({
      propertyId: property.id,
      hostId: property.ownerId,
      propertyName: property.title,
      guestName: guestName.trim() || 'Happy Guest',
      sentiment,
      categories: selectedTags,
      comment: publicNote.trim() || undefined,
      publicReviewPlatformChosen: 'none',
    });
    setSubmitted(true);
    onSubmitted?.();
  };

  const handleSubmitPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentiment) return;
    addStayFeedback({
      propertyId: property.id,
      hostId: property.ownerId,
      propertyName: property.title,
      guestName: guestName.trim() || 'Guest',
      sentiment,
      categories: selectedTags,
      comment: privateFeedback.trim(),
      publicReviewPlatformChosen: 'none',
    });
    setSubmitted(true);
    onSubmitted?.();
  };

  const handleCopyReviewText = async () => {
    if (!publicNote.trim()) return;
    const ok = await safeCopyToClipboard(publicNote);
    if (ok) {
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    }
  };

  const resetAndClose = () => {
    if (submitted) {
      setSelectedTags([]);
      setPublicNote('');
      setPrivateFeedback('');
      setSentiment(null);
    }
    setSubmitted(false);
    onClose();
  };

  const airbnbUrl = property.publicReviewLinks?.airbnb;
  const bookingUrl = property.publicReviewLinks?.booking;
  const googleUrl = property.publicReviewLinks?.google;

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={resetAndClose}
      title={
        language === 'ka'
          ? 'შეაფასეთ თქვენი ვიზიტი'
          : language === 'ru'
          ? 'Оцените ваше проживание'
          : 'How is your stay going?'
      }
    >
      <div className="space-y-6 pb-4">
        {submitted ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif text-2xl font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                {isPositive
                  ? language === 'ka'
                    ? 'დიდი მადლობა!'
                    : language === 'ru'
                    ? 'Большое спасибо!'
                    : 'Didi Madloba! Thank You!'
                  : language === 'ka'
                  ? 'შეტყობინება მიღებულია'
                  : language === 'ru'
                  ? 'Сообщение получено'
                  : 'Thank you for letting us know'}
              </h4>
              <p className="text-xs text-[#7A756D] dark:text-[#A39E93] max-w-sm mx-auto leading-relaxed">
                {isPositive
                  ? language === 'ka'
                    ? `თქვენი ჩანაწერი დაემატა ${property.hostName}-ის სტუმრების წიგნაკს.`
                    : language === 'ru'
                    ? `Ваша запись добавлена в гостевую книгу ${property.hostName}.`
                    : `Your note has been added to ${property.hostName}'s guestbook.`
                  : language === 'ka'
                  ? `${property.hostName} ყურადღებით გაეცნობა თქვენს შენიშვნას.`
                  : language === 'ru'
                  ? `${property.hostName} внимательно изучит ваш комментарий.`
                  : `Your private note has been recorded for ${property.hostName}.`}
              </p>
            </div>

            {/* External Review Copy Helper for Happy Guests */}
            {isPositive && publicNote.trim() && (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F55A51]">
                    {language === 'ka'
                      ? 'გააზიარეთ Airbnb / Booking-ზე'
                      : language === 'ru'
                      ? 'Поделитесь на Airbnb / Booking'
                      : 'Reuse on Airbnb or Booking.com'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReviewText}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0] cursor-pointer"
                  >
                    {copiedNote ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                        {language === 'ka'
                          ? 'დაკოპირდა'
                          : language === 'ru'
                          ? 'Скопировано'
                          : 'Copied'}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7A756D]" />
                        {language === 'ka'
                          ? 'ტექსტის კოპირება'
                          : language === 'ru'
                          ? 'Скопировать текст'
                          : 'Copy text'}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs italic text-[#5C5852] dark:text-[#A39E93] line-clamp-3">
                  “{publicNote}”
                </p>

                {(airbnbUrl || bookingUrl || googleUrl) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {airbnbUrl && (
                      <a
                        href={airbnbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF5A5F] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        Airbnb Review <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {bookingUrl && (
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#003580] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        Booking.com <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {googleUrl && (
                      <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        Google Review <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-3.5 rounded-2xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] font-bold text-xs cursor-pointer"
            >
              {language === 'ka' ? 'დახურვა' : language === 'ru' ? 'Закрыть' : 'Done'}
            </button>
          </div>
        ) : (
          <>
            {/* Step 1: Sentiment Selection */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93]">
                {language === 'ka'
                  ? '1. როგორ შეაფასებდით თქვენს სტუმრობას?'
                  : language === 'ru'
                  ? '1. Как проходит ваше проживание?'
                  : '1. Select your overall experience'}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'amazing' as const,
                    stars: 5,
                    title: { en: 'Loved It', ka: 'საუკეთესოა', ru: 'Великолепно' },
                    sub: { en: '5-star stay', ka: '5 ვარსკვლავი', ru: 'На 5 звёзд' },
                    icon: Heart,
                  },
                  {
                    id: 'good' as const,
                    stars: 4,
                    title: { en: 'Very Good', ka: 'ძალიან კარგი', ru: 'Очень хорошо' },
                    sub: { en: 'Enjoyed our time', ka: 'კმაყოფილი ვართ', ru: 'Всё понравилось' },
                    icon: ThumbsUp,
                  },
                  {
                    id: 'could_be_better' as const,
                    stars: 3,
                    title: { en: 'Could Be Better', ka: 'უკეთესი შეიძლებოდა', ru: 'Могло быть лучше' },
                    sub: { en: 'Share suggestions', ka: 'გაქვთ რჩევა', ru: 'Есть пожелания' },
                    icon: Sparkles,
                  },
                  {
                    id: 'problem' as const,
                    stars: 2,
                    title: { en: 'Need Help Now', ka: 'პრობლემაა', ru: 'Нужна помощь' },
                    sub: { en: 'Something needs fixing', ka: 'საჭიროა დახმარება', ru: 'Нужно исправить' },
                    icon: AlertTriangle,
                  },
                ].map(option => {
                  const Icon = option.icon;
                  const active = sentiment === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSentiment(option.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] cursor-pointer ${
                        active
                          ? 'bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] border-[#1C1B1A] dark:border-[#F7F5F0] shadow-sm'
                          : 'bg-white dark:bg-[#1F1E1C] text-[#1C1B1A] dark:text-[#F7F5F0] border-[#EBE6DF] dark:border-[#2B2926] hover:border-[#F55A51]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon
                          className={`w-4 h-4 ${
                            active ? 'text-[#F55A51]' : 'text-[#7A756D] dark:text-[#A39E93]'
                          }`}
                        />
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: option.stars }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-[#FFC757] text-[#FFC757]"
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-xs">{option.title[language]}</p>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            active
                              ? 'text-[#F7F5F0]/75 dark:text-[#1C1B1A]/75'
                              : 'text-[#7A756D] dark:text-[#A39E93]'
                          }`}
                        >
                          {option.sub[language]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2A: Positive Flow -> Digital Guestbook + Highlight Tags */}
            {isPositive && (
              <form
                onSubmit={handleSubmitPositive}
                className="space-y-4 pt-2 border-t border-[#EBE6DF] dark:border-[#2B2926]"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93] block">
                    {language === 'ka'
                      ? '2. რა მოგეწონათ ყველაზე მეტად?'
                      : language === 'ru'
                      ? '2. Что вам особенно понравилось?'
                      : '2. What stood out during your stay?'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HIGHLIGHT_TAGS.map(tag => {
                      const active = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            active
                              ? 'bg-[#F55A51] text-white border-[#F55A51]'
                              : 'bg-white dark:bg-[#1F1E1C] text-[#5C5852] dark:text-[#A39E93] border-[#EBE6DF] dark:border-[#2B2926]'
                          }`}
                        >
                          {tag.label[language]}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                      language === 'ka'
                        ? 'მაგ. ანა და ლუკა'
                        : language === 'ru'
                        ? 'напр. Анна'
                        : 'e.g. Sarah & Tom'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs text-[#1C1B1A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#F55A51]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7A756D] dark:text-[#A39E93] block mb-1">
                    {language === 'ka'
                      ? 'დატოვეთ ჩანაწერი სტუმრების წიგნაკში'
                      : language === 'ru'
                      ? 'Оставьте запись в гостевой книге'
                      : 'Leave a note for the guestbook & future travelers'}
                  </label>
                  <textarea
                    rows={3}
                    value={publicNote}
                    onChange={e => setPublicNote(e.target.value)}
                    placeholder={
                      language === 'ka'
                        ? 'გაუზიარეთ თქვენი შთაბეჭდილება ან საყვარელი კაფე მომავალ სტუმრებს...'
                        : language === 'ru'
                        ? 'Поделитесь впечатлениями или любимым местом рядом...'
                        : 'Share a favorite memory, view, or local tip for future guests...'
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
                    ? 'სტუმრების წიგნაკში დამატება'
                    : language === 'ru'
                    ? 'Опубликовать в гостевой книге'
                    : 'Sign the Guestbook'}
                </button>
              </form>
            )}

            {/* Step 2B: Constructive / Problem Flow -> Direct Host Resolution */}
            {isNegative && (
              <form
                onSubmit={handleSubmitPrivateFeedback}
                className="space-y-4 pt-2 border-t border-[#EBE6DF] dark:border-[#2B2926]"
              >
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] space-y-1.5">
                  <p className="text-xs font-bold text-[#1C1B1A] dark:text-[#F7F5F0]">
                    {language === 'ka'
                      ? `პირდაპირი კავშირი ${property.hostName}-თან`
                      : language === 'ru'
                      ? `Прямое сообщение для ${property.hostName}`
                      : `Direct Note to ${property.hostName}`}
                  </p>
                  <p className="text-xs text-[#7A756D] dark:text-[#A39E93] leading-relaxed">
                    {language === 'ka'
                      ? `მოგვწერეთ რა საჭიროებს ყურადღებას, რათა ${property.hostName}-მა დროულად შეძლოს დახმარება.`
                      : language === 'ru'
                      ? `Напишите, что пошло не так, чтобы ${property.hostName} мог быстро помочь вам.`
                      : `Let ${property.hostName} know what went wrong or needs attention so we can make it right during your stay.`}
                  </p>
                </div>

                <div>
                  <textarea
                    rows={3}
                    required
                    value={privateFeedback}
                    onChange={e => setPrivateFeedback(e.target.value)}
                    placeholder={
                      language === 'ka'
                        ? `მიუთითეთ დეტალები ${property.hostName}-ისთვის...`
                        : language === 'ru'
                        ? `Опишите проблему для ${property.hostName}...`
                        : `Tell ${property.hostName} what needs attention...`
                    }
                    className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1F1E1C] border border-[#EBE6DF] dark:border-[#2B2926] text-xs text-[#1C1B1A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#F55A51]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1C1B1A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#1C1B1A] font-bold text-xs flex items-center justify-center gap-2 min-h-[46px] cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#F55A51]" />
                    {language === 'ka'
                      ? 'შენიშვნის გაგზავნა'
                      : language === 'ru'
                      ? 'Отправить сообщение'
                      : 'Send Private Feedback'}
                  </button>

                  {canUseDirectWhatsApp && (
                    <a
                      href={`https://wa.me/${cleanHostWhatsApp}?text=${encodeURIComponent(
                        `Hi ${property.hostName}, I'm staying at ${property.title} and wanted to share a quick note: ${privateFeedback}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 px-4 rounded-2xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[46px]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {language === 'ka'
                        ? 'WhatsApp-ით მიწერა'
                        : language === 'ru'
                        ? 'Написать в WhatsApp'
                        : `WhatsApp ${property.hostName}`}
                    </a>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </MobileBottomSheet>
  );
};
