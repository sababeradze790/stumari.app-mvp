import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ThumbsUp,
  MessageCircle
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

    if (chosenPlatform) {
      // Automatically copy 5-star template to clipboard for convenience
      try {
        navigator.clipboard.writeText(defaultPublicReview);
      } catch {}
      showToast(language === 'ka' ? 'ტექსტი დაკოპირდა! გადამისამართება...' : 'Review copied! Redirecting...');

      let targetUrl = 'https://www.airbnb.com';
      if (chosenPlatform === 'airbnb') {
        targetUrl = property.sourceUrl || 'https://www.airbnb.com';
      } else if (chosenPlatform === 'google') {
        targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.title} ${property.address || ''} ${property.city}`)}`;
      } else if (chosenPlatform === 'booking') {
        targetUrl = 'https://www.booking.com';
      }
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = targetUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 300);
    }
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
            onClick={handleReset} 
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.94, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 14 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`w-full max-w-lg rounded-xl border p-6 sm:p-7 shadow-xl relative transition-all overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar z-10 tracking-tight ${
              isDark 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className={`absolute top-5 right-5 p-2 rounded-lg transition-colors cursor-pointer border ${
                isDark ? 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800' : 'text-zinc-500 hover:text-zinc-900 bg-zinc-100 border-zinc-200'
              }`}
              aria-label="Close feedback modal"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {!isSubmitted ? (
              <div className="space-y-5">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                      {language === 'ka' ? 'სტუმრის შეფასება' : language === 'ru' ? 'Отзыв о пребывании' : 'Private Stay Feedback'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {language === 'ka' ? 'როგორ ჩაიარა თქვენმა ყოფნამ?' : language === 'ru' ? 'Как прошло ваше пребывание?' : 'How was your stay?'}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1.5 font-normal leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
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
                    { id: 'amazing' as GuestSentiment, label: language === 'ka' ? 'საოცარი ❤️' : language === 'ru' ? 'Восторг ❤️' : 'Amazing ❤️', icon: '😊', bg: 'hover:border-zinc-700' },
                    { id: 'good' as GuestSentiment, label: language === 'ka' ? 'კარგი 👍' : language === 'ru' ? 'Хорошо 👍' : 'Good 👍', icon: '🙂', bg: 'hover:border-zinc-700' },
                    { id: 'could_be_better' as GuestSentiment, label: language === 'ka' ? 'უკეთესიც...' : language === 'ru' ? 'Могло лучше' : 'Could be better', icon: '😐', bg: 'hover:border-zinc-700' },
                    { id: 'problem' as GuestSentiment, label: language === 'ka' ? 'იყო პრობლემა' : language === 'ru' ? 'Была проблема' : 'Had a problem', icon: '😕', bg: 'hover:border-zinc-700' }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      onClick={() => setSentiment(item.id)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer shadow-sm ${
                        sentiment === item.id
                          ? item.id === 'amazing'
                            ? 'border-emerald-500 bg-emerald-500/15 shadow-sm text-emerald-400 font-semibold ring-1 ring-emerald-500/30'
                            : item.id === 'good'
                            ? 'border-blue-500 bg-blue-500/15 shadow-sm text-blue-400 font-semibold ring-1 ring-blue-500/30'
                            : item.id === 'could_be_better'
                            ? 'border-amber-500 bg-amber-500/15 shadow-sm text-amber-400 font-semibold ring-1 ring-amber-500/30'
                            : 'border-rose-500 bg-rose-500/15 shadow-sm text-rose-400 font-semibold ring-1 ring-rose-500/30'
                          : isDark
                          ? `border-zinc-800 bg-zinc-900 text-zinc-300 ${item.bg}`
                          : `border-zinc-200 bg-zinc-50 text-zinc-800 ${item.bg}`
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className={`text-xs font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.label}</span>
                    </motion.button>
                  ))}
                </div>

            {/* BRANCH A: AMAZING / GOOD */}
            {(sentiment === 'amazing' || sentiment === 'good') && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className={`p-4 rounded-xl border shadow-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-emerald-50 border-emerald-200 text-zinc-900'
                }`}>
                  <div className="flex items-center gap-2 font-semibold text-sm sm:text-base mb-1">
                    <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                    <span>
                      {language === 'ka' 
                        ? 'ძალიან გვიხარია, რომ ისიამოვნეთ!' 
                        : language === 'ru' 
                        ? 'Мы очень рады, что вам понравилось!' 
                        : 'We are thrilled you enjoyed your stay!'}
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {language === 'ka'
                      ? 'გაუზიარეთ თქვენი შთაბეჭდილება სხვა მოგზაურებს public შეფასებით:'
                      : language === 'ru'
                      ? 'Поделитесь вашим отзывом на платформе бронирования:'
                      : 'Would you take 30 seconds to share your experience publicly? It makes a huge difference for our family-run hosting.'}
                  </p>
                </div>

                {/* Pre-composed draft copy */}
                <div className={`p-4 rounded-xl border text-xs sm:text-sm shadow-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {language === 'ka' ? 'მზა ტექსტი დასაკოპირებლად' : language === 'ru' ? 'Шаблон отзыва' : 'Ready Review Template'}
                    </span>
                    <button
                      onClick={copyDraftReview}
                      className={`flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}
                    >
                      {copiedReview ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReview ? 'Copied!' : 'Copy draft'}</span>
                    </button>
                  </div>
                  <p className={`italic leading-relaxed font-normal ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>"{defaultPublicReview}"</p>
                </div>

                {/* Direct Platform Links */}
                <div className="space-y-2">
                  <span className={`text-xs font-mono uppercase tracking-wider font-semibold block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {language === 'ka' ? 'აირჩიეთ პლატფორმა:' : language === 'ru' ? 'Оставить отзыв на:' : 'Share review directly on:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSubmit('airbnb')}
                      className="px-3.5 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 bg-[#FF5A5F] hover:bg-[#e04e53] text-white transition-all shadow-sm active:scale-98 cursor-pointer"
                    >
                      <span>Airbnb</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSubmit('google')}
                      className="px-3.5 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-98 cursor-pointer"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSubmit('booking')}
                      className="px-3.5 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 bg-[#003580] hover:bg-[#002b66] text-white transition-all shadow-sm active:scale-98 cursor-pointer"
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
                <div className={`p-4 rounded-xl border shadow-sm ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-amber-50 border-amber-200 text-zinc-900'
                }`}>
                  <div className="flex items-center gap-2 font-semibold text-sm sm:text-base mb-1">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      {language === 'ka'
                        ? 'ბოდიშს გიხდით, რომ ყველაფერი იდეალური არ იყო.'
                        : language === 'ru'
                        ? 'Нам искренне жаль, что возникли неудобства.'
                        : "We're sorry something wasn't perfect."}
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {language === 'ka'
                      ? 'გთხოვთ გვითხრათ რა მოხდა. ეს წერილი პირდაპირ მასპინძელთან მიდის პირად არხში, რათა მყისიერად გამოსწორდეს.'
                      : language === 'ru'
                      ? 'Расскажите нам лично, что пошло не так. Это сообщение поступит прямо хозяину без публикации в открытом доступе.'
                      : 'Tell us privately what went wrong. Your feedback goes directly to your host so we can fix it immediately for you and future guests.'}
                  </p>
                </div>

                {/* Category Pills */}
                <div>
                  <span className={`text-xs font-mono uppercase tracking-wider font-semibold block mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {language === 'ka' ? 'რა საკითხს ეხებოდა პრობლემა?' : language === 'ru' ? 'Что можно улучшить?' : 'What could we improve?'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer ${
                            isSelected
                              ? isDark
                                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                                : 'bg-zinc-900 text-zinc-100 border-zinc-900 font-semibold'
                              : isDark
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                              : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300'
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
                  <label className={`text-xs font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {language === 'ka' ? 'თქვენი სახელი (სურვილისამებრ)' : language === 'ru' ? 'Ваше имя (необязательно)' : 'Your name (optional)'}
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. David / Apartment 3"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-normal focus:outline-none focus:ring-1 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                    }`}
                  />
                </div>

                {/* Private Comment Note */}
                <div>
                  <label className={`text-xs font-mono uppercase tracking-wider font-semibold block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {language === 'ka' ? 'პირადი კომენტარი მასპინძელს' : language === 'ru' ? 'Личное сообщение хозяину' : 'Private note to host'}
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={language === 'ka' ? 'მოგვიყევით რა მოხდა...' : language === 'ru' ? 'Опишите ситуацию подробно...' : 'Tell Saba what went wrong so we can fix it right away...'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-normal focus:outline-none focus:ring-1 resize-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                    }`}
                  />
                </div>

                {/* Dispatch Actions: WhatsApp Triage Draft + Private Submission */}
                <div className="space-y-2 pt-1">
                  <a
                    href={`https://wa.me/${property.hostWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hi ${property.hostName}, I am staying at ${property.title}. I noticed an issue regarding ${
                        selectedCategories.length > 0 ? selectedCategories.join(', ') : 'my stay'
                      }: "${comment || 'could use some immediate assistance'}". Could you please help?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSubmit()}
                    className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {language === 'ka' 
                        ? 'პირდაპირი WhatsApp შეტყობინება მასპინძელს' 
                        : language === 'ru'
                        ? 'Написать хозяину в WhatsApp'
                        : 'Direct WhatsApp Triage to Host'}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className={`w-full py-2.5 rounded-full border font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                      isDark 
                        ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white' 
                        : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-zinc-950'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {language === 'ka' 
                        ? 'მხოლოდ შიდა პირადი შეფასების გაგზავნა' 
                        : language === 'ru' 
                        ? 'Отправить только в личный кабинет хозяина' 
                        : 'Submit In-App Privately'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-emerald-400">
                {language === 'ka' ? 'დიდი მადლობა!' : language === 'ru' ? 'Большое спасибо!' : 'Thank you so much!'}
              </h4>
              <p className={`text-xs mt-2 max-w-sm mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={handleReset}
              className={`px-5 py-2.5 rounded-lg font-semibold text-xs shadow-sm transition-colors cursor-pointer ${
                isDark ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {language === 'ka' ? 'დახურვა' : language === 'ru' ? 'Закрыть' : 'Done & Return to Guide'}
            </motion.button>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
