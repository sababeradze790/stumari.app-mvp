import React, { useState } from 'react';
import { 
  X, 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  Sparkles, 
  Send, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldAlert, 
  MessageSquareHeart,
  ThumbsUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GuestSentiment, StayFeedbackCategory, Property } from '../../types';

interface ReviewEngineModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewEngineModal: React.FC<ReviewEngineModalProps> = ({ property, isOpen, onClose }) => {
  const { theme, language, addStayFeedback, showToast } = useApp();
  const isDark = theme === 'dark';

  const [sentiment, setSentiment] = useState<GuestSentiment | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<StayFeedbackCategory[]>([]);
  const [guestName, setGuestName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  if (!isOpen) return null;

  const categoriesList: { id: StayFeedbackCategory; label: string; icon: string }[] = [
    { id: 'cleanliness', label: language === 'ka' ? 'სისუფთავე' : language === 'ru' ? 'Чистота' : 'Cleanliness', icon: '🧹' },
    { id: 'check_in', label: language === 'ka' ? 'შესვლა / Check-in' : language === 'ru' ? 'Заселение' : 'Check-in', icon: '🚪' },
    { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { id: 'temperature', label: language === 'ka' ? 'ტემპერატურა / გათბობა' : language === 'ru' ? 'Температура / отопление' : 'Temperature & heating', icon: '🌡' },
    { id: 'equipment', label: language === 'ka' ? 'ტექნიკა და აღჭურვილობა' : language === 'ru' ? 'Техника и приборы' : 'Appliances & equipment', icon: '🛠' },
    { id: 'noise', label: language === 'ka' ? 'ხმაური' : language === 'ru' ? 'Шум' : 'Noise & quiet', icon: '🔊' },
    { id: 'location', label: language === 'ka' ? 'მდებარეობა' : language === 'ru' ? 'Локация' : 'Location', icon: '📍' },
    { id: 'communication', label: language === 'ka' ? 'კომუნიკაცია' : language === 'ru' ? 'Связь с хозяином' : 'Host communication', icon: '💬' },
    { id: 'other', label: language === 'ka' ? 'სხვა' : language === 'ru' ? 'Другое' : 'Other details', icon: '❓' }
  ];

  const toggleCategory = (catId: StayFeedbackCategory) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = (chosenPlatform?: 'airbnb' | 'google' | 'booking') => {
    if (!sentiment) return;
    addStayFeedback({
      propertyId: property.id,
      propertyName: property.title,
      guestName: guestName.trim() || (language === 'ka' ? 'სტუმარი' : language === 'ru' ? 'Гость' : 'Guest'),
      sentiment,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      comment: comment.trim() || undefined,
      publicReviewPlatformChosen: chosenPlatform
    });
    setIsSubmitted(true);
  };

  const defaultPublicReview = `Loved staying at ${property.title} in ${property.city}! The check-in was seamless, the instructions made everything crystal clear, and the host's local recommendations were incredible. Highly recommended! ⭐⭐⭐⭐⭐`;

  const copyDraftReview = () => {
    navigator.clipboard.writeText(defaultPublicReview);
    setCopiedReview(true);
    showToast(language === 'ka' ? 'ტექსტი დაკოპირდა!' : language === 'ru' ? 'Отзыв скопирован!' : 'Review text copied to clipboard!');
    setTimeout(() => setCopiedReview(false), 3000);
  };

  const handleReset = () => {
    setSentiment(null);
    setSelectedCategories([]);
    setComment('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-[32px] border p-6 sm:p-8 shadow-2xl relative transition-all overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar ${
          isDark 
            ? 'bg-[#0E1317] border-stone-800 text-stone-100' 
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${
            isDark ? 'text-stone-400 hover:text-white bg-stone-900/80' : 'text-stone-500 hover:text-stone-900 bg-stone-100'
          }`}
          aria-label="Close feedback modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                  isDark ? 'text-[#E4E98E]' : 'text-amber-600'
                }`}>
                  {language === 'ka' ? 'სტუმრის შეფასება' : language === 'ru' ? 'Отзыв о пребывании' : 'Private Stay Feedback'}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold tracking-tight">
                {language === 'ka' ? 'როგორ ჩაიარა თქვენმა ყოფნამ?' : language === 'ru' ? 'Как прошло ваше пребывание?' : 'How was your stay?'}
              </h3>
              <p className={`text-xs sm:text-sm mt-1.5 font-medium leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {language === 'ka' 
                  ? `${property.title} — თქვენი აზრი გვეხმარება გავაუმჯობესოთ მასპინძლობა.`
                  : language === 'ru'
                  ? `${property.title} — ваше мнение помогает сделать отдых идеальным.`
                  : `${property.title} — help us understand your experience and make every stay unforgettable.`}
              </p>
            </div>

            {/* 4 Sentiment Tier Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'amazing' as GuestSentiment, label: language === 'ka' ? 'საოცარი ❤️' : language === 'ru' ? 'Восторг ❤️' : 'Amazing ❤️', icon: '😊', bg: 'hover:border-emerald-500 hover:bg-emerald-500/10' },
                { id: 'good' as GuestSentiment, label: language === 'ka' ? 'კარგი 👍' : language === 'ru' ? 'Хорошо 👍' : 'Good 👍', icon: '🙂', bg: 'hover:border-blue-500 hover:bg-blue-500/10' },
                { id: 'could_be_better' as GuestSentiment, label: language === 'ka' ? 'უკეთესიც...' : language === 'ru' ? 'Могло лучше' : 'Could be better', icon: '😐', bg: 'hover:border-amber-500 hover:bg-amber-500/10' },
                { id: 'problem' as GuestSentiment, label: language === 'ka' ? 'იყო პრობლემა' : language === 'ru' ? 'Была проблема' : 'Had a problem', icon: '😕', bg: 'hover:border-rose-500 hover:bg-rose-500/10' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSentiment(item.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 active:scale-95 shadow-2xs ${
                    sentiment === item.id
                      ? item.id === 'amazing'
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-md text-emerald-700 dark:text-emerald-300 font-black ring-1 ring-emerald-500/30'
                        : item.id === 'good'
                        ? 'border-blue-500 bg-blue-500/20 shadow-md text-blue-700 dark:text-blue-300 font-black ring-1 ring-blue-500/30'
                        : item.id === 'could_be_better'
                        ? 'border-amber-500 bg-amber-500/20 shadow-md text-amber-700 dark:text-amber-300 font-black ring-1 ring-amber-500/30'
                        : 'border-rose-500 bg-rose-500/20 shadow-md text-rose-700 dark:text-rose-300 font-black ring-1 ring-rose-500/30'
                      : isDark
                      ? `border-stone-800 bg-[#14191C] text-stone-200 ${item.bg}`
                      : `border-stone-300 bg-stone-50 text-stone-900 ${item.bg}`
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-950 dark:text-stone-100">{item.label}</span>
                </button>
              ))}
            </div>

            {/* BRANCH A: AMAZING / GOOD */}
            {(sentiment === 'amazing' || sentiment === 'good') && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className={`p-4 rounded-2xl border shadow-xs ${
                  isDark ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-stone-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1">
                    <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500 shrink-0" />
                    <span>
                      {language === 'ka' 
                        ? 'ძალიან გვიხარია, რომ ისიამოვნეთ!' 
                        : language === 'ru' 
                        ? 'Мы очень рады, что вам понравилось!' 
                        : 'We are thrilled you enjoyed your stay!'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    {language === 'ka'
                      ? 'გაუზიარეთ თქვენი შთაბეჭდილება სხვა მოგზაურებს public შეფასებით:'
                      : language === 'ru'
                      ? 'Поделитесь вашим отзывом на платформе бронирования:'
                      : 'Would you take 30 seconds to share your experience publicly? It makes a huge difference for our family-run hosting.'}
                  </p>
                </div>

                {/* Pre-composed draft copy */}
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm shadow-xs ${
                  isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono uppercase tracking-wider font-black ${isDark ? 'text-[#E4E98E]' : 'text-stone-900'}`}>
                      {language === 'ka' ? 'მზა ტექსტი დასაკოპირებლად' : language === 'ru' ? 'Шаблон отзыва' : 'Ready Review Template'}
                    </span>
                    <button
                      onClick={copyDraftReview}
                      className={`flex items-center gap-1.5 text-xs font-black hover:underline ${isDark ? 'text-[#E4E98E]' : 'text-stone-950'}`}
                    >
                      {copiedReview ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReview ? 'Copied!' : 'Copy draft'}</span>
                    </button>
                  </div>
                  <p className={`italic leading-relaxed font-semibold ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>"{defaultPublicReview}"</p>
                </div>

                {/* Direct Platform Links */}
                <div className="space-y-2">
                  <span className={`text-xs font-mono uppercase tracking-wider font-black block ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
                    {language === 'ka' ? 'აირჩიეთ პლატფორმა:' : language === 'ru' ? 'Оставить отзыв на:' : 'Share review directly on:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSubmit('airbnb')}
                      className="px-4 py-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#FF5A5F] hover:bg-[#e04e53] text-white transition-all shadow-sm active:scale-95"
                    >
                      <span>Airbnb</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSubmit('google')}
                      className="px-4 py-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-95"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSubmit('booking')}
                      className="px-4 py-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#003580] hover:bg-[#002b66] text-white transition-all shadow-sm active:scale-95"
                    >
                      <span>Booking.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BRANCH B: COULD BE BETTER / HAD A PROBLEM */}
            {(sentiment === 'could_be_better' || sentiment === 'problem') && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className={`p-4 rounded-2xl border shadow-xs ${
                  isDark ? 'bg-amber-950/30 border-amber-800/50 text-amber-100' : 'bg-amber-50 border-amber-300 text-stone-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>
                      {language === 'ka'
                        ? 'ბოდიშს გიხდით, რომ ყველაფერი იდეალური არ იყო.'
                        : language === 'ru'
                        ? 'Нам искренне жаль, что возникли неудобства.'
                        : "We're sorry something wasn't perfect."}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    {language === 'ka'
                      ? 'გთხოვთ გვითხრათ რა მოხდა. ეს წერილი პირდაპირ მასპინძელთან მიდის პირად არხში, რათა მყისიერად გამოსწორდეს.'
                      : language === 'ru'
                      ? 'Расскажите нам лично, что пошло не так. Это сообщение поступит прямо хозяину без публикации в открытом доступе.'
                      : 'Tell us privately what went wrong. Your feedback goes directly to your host so we can fix it immediately for you and future guests.'}
                  </p>
                </div>

                {/* Category Pills */}
                <div>
                  <span className={`text-xs font-mono uppercase tracking-wider font-black block mb-2 ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
                    {language === 'ka' ? 'რა საკითხს ეხებოდა პრობლემა?' : language === 'ru' ? 'Что можно улучшить?' : 'What could we improve?'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs ${
                            isSelected
                              ? isDark
                                ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E] font-black shadow-xs'
                                : 'bg-stone-950 text-white border-stone-950 font-black shadow-xs'
                              : isDark
                              ? 'bg-[#14191C] border-stone-800 text-stone-200 hover:border-stone-700'
                              : 'bg-white border-stone-300 text-stone-900 hover:border-stone-400'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Guest Name */}
                <div>
                  <label className={`text-xs font-mono uppercase tracking-wider font-black block mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
                    {language === 'ka' ? 'თქვენი სახელი (სურვილისამებრ)' : language === 'ru' ? 'Ваше имя (необязательно)' : 'Your name (optional)'}
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. David / Apartment 3"
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                      isDark ? 'bg-[#14191C] border-stone-800 text-white focus:ring-[#E4E98E]/50' : 'bg-white border-stone-300 text-stone-900 focus:ring-amber-500'
                    }`}
                  />
                </div>

                {/* Private Comment Note */}
                <div>
                  <label className={`text-xs font-mono uppercase tracking-wider font-black block mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-900'}`}>
                    {language === 'ka' ? 'პირადი კომენტარი მასპინძელს' : language === 'ru' ? 'Личное сообщение хозяину' : 'Private note to host'}
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={language === 'ka' ? 'მოგვიყევით რა მოხდა...' : language === 'ru' ? 'Опишите ситуацию подробно...' : 'Tell Saba what went wrong so we can fix it right away...'}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 resize-none ${
                      isDark ? 'bg-[#14191C] border-stone-800 text-white focus:ring-[#E4E98E]/50' : 'bg-white border-stone-300 text-stone-900 focus:ring-amber-500'
                    }`}
                  />
                </div>

                {/* Dispatch Button */}
                <button
                  onClick={() => handleSubmit()}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 stroke-[2.2]" />
                  <span>
                    {language === 'ka' 
                      ? 'პირადი შეფასების გაგზავნა მასპინძელთან' 
                      : language === 'ru' 
                      ? 'Отправить личный отзыв хозяину' 
                      : 'Send Private Feedback to Host'}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-2xl font-serif font-bold text-emerald-400">
                {language === 'ka' ? 'დიდი მადლობა!' : language === 'ru' ? 'Большое спасибо!' : 'Thank you so much!'}
              </h4>
              <p className={`text-xs mt-2 max-w-sm mx-auto ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {sentiment === 'amazing' || sentiment === 'good'
                  ? language === 'ka'
                    ? 'თქვენი თბილი სიტყვები ძალიან ეხმარება ჩვენს მასპინძლობას.'
                    : language === 'ru'
                    ? 'Ваша поддержка помогает нам встречать гостей со всей душой.'
                    : 'Your review helps other travelers discover our home and motivates us to keep hosting with love.'
                  : language === 'ka'
                  ? 'თქვენი პირადი შეფასება პირდაპირ გადაეცა მასპინძელს. ჩვენ დაუყოვნებლივ მივიღებთ ზომებს.'
                  : language === 'ru'
                  ? 'Ваш отзыв передан хозяину. Мы немедленно примем меры для исправления ситуации.'
                  : 'Your private feedback has been delivered directly to your host inbox. Thank you for giving us the chance to make things right!'}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#E4E98E] text-[#0C1510] font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {language === 'ka' ? 'დახურვა' : language === 'ru' ? 'Закрыть' : 'Done & Return to Guide'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
