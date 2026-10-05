import React from 'react';
import { 
  Compass, 
  Wifi, 
  Key, 
  MapPin, 
  Utensils, 
  Coffee, 
  Clock, 
  Luggage, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, StayMoment } from '../../types';

interface StayMomentsTimelineProps {
  property: Property;
  onOpenFeedback: () => void;
  onSelectTab: (tabId: string) => void;
}

export const StayMomentsTimeline: React.FC<StayMomentsTimelineProps> = ({ 
  property, 
  onOpenFeedback,
  onSelectTab
}) => {
  const { theme, language, activeMoment, setActiveMoment, showToast } = useApp();
  const isDark = theme === 'dark';

  const moments: { id: StayMoment; label: string; icon: string; subtitle: string }[] = [
    {
      id: 'before_arrival',
      label: language === 'ka' ? 'ჩამოსვლამდე' : language === 'ru' ? 'До заезда' : 'Before Arrival',
      icon: '🚗',
      subtitle: language === 'ka' ? 'მისამართი და პარკინგი' : language === 'ru' ? 'Адрес и парковка' : 'Address, directions & parking'
    },
    {
      id: 'first_10_min',
      label: language === 'ka' ? 'პირველი 10 წუთი' : language === 'ru' ? 'Первые 10 минут' : 'First 10 Minutes',
      icon: '📶',
      subtitle: language === 'ka' ? 'Wi-Fi და ბინის ჩართვა' : language === 'ru' ? 'Wi-Fi и отопление' : 'Wi-Fi, heating & settling in'
    },
    {
      id: 'first_evening',
      label: language === 'ka' ? 'პირველი საღამო' : language === 'ru' ? 'Первый вечер' : 'First Evening',
      icon: '🥟',
      subtitle: language === 'ka' ? 'სად ვივახშმოთ დღეს?' : language === 'ru' ? 'Где поужинать сегодня?' : 'Where to eat tonight?'
    },
    {
      id: 'next_morning',
      label: language === 'ka' ? 'დილა და ყავა' : language === 'ru' ? 'Утро и завтрак' : 'Next Morning',
      icon: '☕',
      subtitle: language === 'ka' ? 'საუკეთესო საუზმე' : language === 'ru' ? 'Лучший кофе и выпечка' : 'Best breakfast & coffee'
    },
    {
      id: 'during_stay',
      label: language === 'ka' ? 'ქალაქის აღმოჩენა' : language === 'ru' ? 'Во время отдыха' : 'During Stay',
      icon: '🗺',
      subtitle: language === 'ka' ? 'Stumari Gems & საიდუმლოებები' : language === 'ru' ? 'Секретные места и гид' : 'Gems, moods & hidden spots'
    },
    {
      id: 'before_checkout',
      label: language === 'ka' ? 'გამგზავრებამდე' : language === 'ru' ? 'Перед выездом' : 'Before Checkout',
      icon: '🧳',
      subtitle: language === 'ka' ? 'Check-out და ტაქსი' : language === 'ru' ? 'Выезд и трансфер' : 'Check-out & airport transit'
    },
    {
      id: 'after_checkout',
      label: language === 'ka' ? 'შეფასება' : language === 'ru' ? 'После выезда' : 'After Stay',
      icon: '⭐',
      subtitle: language === 'ka' ? 'როგორ ჩაიარა?' : language === 'ru' ? 'Ваш отзыв хозяину' : 'How was your stay?'
    }
  ];

  const copyWifi = () => {
    navigator.clipboard.writeText(property.wifiPassword);
    showToast(language === 'ka' ? 'Wi-Fi პაროლი დაკოპირდა!' : language === 'ru' ? 'Пароль Wi-Fi скопирован!' : 'Wi-Fi password copied!');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Moments Horizontal Selector Strip */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-400 block px-1">
          {language === 'ka' ? 'მოგზაურობის ეტაპები (Stay Journey):' : language === 'ru' ? 'Этапы пребывания (Stay Journey):' : 'Explore by Stay Journey Moments:'}
        </span>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {moments.map((m) => {
            const isSelected = activeMoment === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMoment(m.id)}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shrink-0 flex items-center gap-2 active:scale-95 ${
                  isSelected
                    ? isDark 
                      ? 'bg-[#E4E98E] text-[#0C1510] border-[#E4E98E] shadow-sm' 
                      : 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : isDark 
                      ? 'bg-[#121619] border-stone-800 text-stone-300 hover:border-stone-700' 
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MOMENT CARD CONTENT */}
      <div className={`p-5 sm:p-7 rounded-[32px] border transition-all ${
        isDark ? 'bg-[#0E1317] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
      }`}>
        
        {/* 1. BEFORE ARRIVAL */}
        {activeMoment === 'before_arrival' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-1 ${
                  isDark ? 'text-[#E4E98E]' : 'text-amber-700'
                }`}>
                  🚗 {language === 'ka' ? 'ეტაპი 1 • ჩამოსვლამდე' : language === 'ru' ? 'Шаг 1 • До заезда' : 'Step 1 • Before Arrival'}
                </span>
                <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  {language === 'ka' ? 'მისამართი, პარკინგი და წვდომა' : language === 'ru' ? 'Адрес, парковка и проезд' : 'Directions, Parking & Access'}
                </h3>
                <p className={`text-xs mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {language === 'ka' ? 'ყველაფერი რაც გჭირდებათ ბინაში მარტივად მოსახვედრად.' : language === 'ru' ? 'Всё необходимое для лёгкого прибытия и доступа.' : 'Everything you need to navigate to the property seamlessly.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Address card */}
              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-[#14191C] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'}`}>
                <div className={`flex items-center gap-2 font-bold ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                  <MapPin className={`w-4 h-4 ${isDark ? 'text-[#E4E98E]' : 'text-amber-600'}`} />
                  <span>{language === 'ka' ? 'ზუსტი მისამართი' : language === 'ru' ? 'Точный адрес' : 'Exact Address'}</span>
                </div>
                <p className="font-mono text-[13px] font-bold">{property.address}, {property.city}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${property.address}, ${property.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 font-bold text-xs hover:underline mt-1 ${isDark ? 'text-[#E4E98E]' : 'text-amber-700'}`}
                >
                  <span>{language === 'ka' ? 'გახსნა Google Maps-ში' : language === 'ru' ? 'Открыть в Google Maps' : 'Open in Google Maps'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Parking */}
              <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-[#14191C] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'}`}>
                <div className={`flex items-center gap-2 font-bold ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                  <span className="text-sm">🅿️</span>
                  <span>{language === 'ka' ? 'ინფორმაცია პარკინგზე' : language === 'ru' ? 'Информация о парковке' : 'Parking Information'}</span>
                </div>
                <p className={`leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  {property.parkingInstructions || (language === 'ka' ? 'უფასო პარკინგი შიდა ეზოში ან ქუჩის გასწვრივ.' : 'Free street parking available along the street or building courtyard.')}
                </p>
              </div>
            </div>

            {/* Arrival Walkthrough */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-[#14191C] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'}`}>
              <div className={`flex items-center gap-2 font-bold text-xs ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>{language === 'ka' ? 'როგორ მივაგნოთ შესასვლელს' : language === 'ru' ? 'Как найти вход' : 'Finding the Entrance'}</span>
              </div>
              <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {property.arrivalDirections || (language === 'ka' ? 'შეაბიჯეთ თბილისურ ეზოში, აუყევით მეორე სართულს მარჯვენა მხარეს.' : 'Walk through the historical archway into the Italian courtyard, take the wooden stairs to the 2nd floor.')}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-stone-200/40 dark:border-stone-800/80">
                <span className={`font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {language === 'ka' ? 'Check-in დრო:' : language === 'ru' ? 'Время заезда:' : 'Check-in from:'}{' '}
                  <strong className={`font-bold font-mono ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>{property.checkInTime}</strong>
                </span>
                <button
                  onClick={() => onSelectTab('checkin')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                    isDark ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80]' : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  <span>{language === 'ka' ? 'Check-in ინსტრუქცია' : language === 'ru' ? 'Пошаговый заезд' : 'View Step-by-Step Check-in'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FIRST 10 MINUTES */}
        {activeMoment === 'first_10_min' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-1 ${
                isDark ? 'text-[#E4E98E]' : 'text-emerald-700'
              }`}>
                📶 {language === 'ka' ? 'ეტაპი 2 • პირველი 10 წუთი' : language === 'ru' ? 'Шаг 2 • Первые 10 минут' : 'Step 2 • First 10 Minutes'}
              </span>
              <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {language === 'ka' ? 'ბინაში დაბინავება და დაკავშირება' : language === 'ru' ? 'Распаковка и подключение' : 'Unpack & Settle In'}
              </h3>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'ka' ? 'ჩართეთ Wi-Fi და მოირგეთ ბინის ტემპერატურა.' : language === 'ru' ? 'Подключите Wi-Fi и настройте комфортный климат в апартаментах.' : 'Connect your devices and get the apartment comfortable right away.'}
              </p>
            </div>

            {/* Wi-Fi Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-950/40 via-stone-900 to-[#14191C] border-emerald-500/30 text-white' 
                : 'bg-gradient-to-r from-emerald-50 via-white to-stone-50 border-emerald-300 text-stone-900 shadow-xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Wi-Fi Network</span>
                  <strong className={`text-base font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>{property.wifiNetwork}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-xl border ${
                  isDark ? 'bg-black/50 border-stone-700 text-stone-100' : 'bg-stone-100 border-stone-300 text-stone-900'
                }`}>
                  {property.wifiPassword}
                </span>
                <button
                  onClick={copyWifi}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-sm transition-all ${
                    isDark ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80]' : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  <span>{language === 'ka' ? 'კოპირება' : language === 'ru' ? 'Копировать' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Property Appliances */}
            <div className="space-y-2">
              <span className={`text-xs font-mono uppercase tracking-wider font-bold block ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}>
                {language === 'ka' ? 'მთავარი ტექნიკა და მოწყობილობები:' : language === 'ru' ? 'Основная бытовая техника:' : 'Top Priority Appliances:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {property.appliances.slice(0, 2).map((app) => (
                  <div key={app.id} className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                    <strong className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>{app.title}</span>
                    </strong>
                    <p className={`leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{app.instructions}</p>
                    {app.troubleshooting && (
                      <p className={`text-[11px] font-semibold italic mt-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                        Tip: {app.troubleshooting}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className={`font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'ka' ? 'გაქვთ კითხვები ან დახმარება გჭირდებათ?' : language === 'ru' ? 'Нужна помощь или что-то непонятно?' : 'Need something fixed or confusing?'}
              </span>
              <button
                onClick={() => onSelectTab('contact')}
                className={`px-4 py-2 rounded-xl border font-bold text-xs transition-colors ${
                  isDark 
                    ? 'border-stone-700 bg-stone-900 text-stone-200 hover:text-white hover:bg-stone-800' 
                    : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100'
                }`}
              >
                {language === 'ka' ? 'მასპინძლის კონტაქტი' : language === 'ru' ? 'Связь с хозяином' : 'Contact Host'}
              </button>
            </div>
          </div>
        )}

        {/* 3. FIRST EVENING */}
        {activeMoment === 'first_evening' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-1 ${
                isDark ? 'text-[#E4E98E]' : 'text-amber-700'
              }`}>
                🥟 {language === 'ka' ? 'ეტაპი 3 • პირველი საღამო' : language === 'ru' ? 'Шаг 3 • Первый вечер' : 'Step 3 • First Evening'}
              </span>
              <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {language === 'ka' ? 'სად ვივახშმოთ დღეს საღამოს?' : language === 'ru' ? 'Где вкусно поужинать сегодня?' : 'Where Should I Eat Tonight?'}
              </h3>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'ka' ? 'ჩვენი პირადი რეკომენდაციები ბინიდან ფეხით სავალ მანძილზე.' : language === 'ru' ? 'Наши персональные рекомендации в паре минут пешком от дома.' : 'Our top personal recommendations within walking distance of the apartment.'}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="space-y-1.5 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E4E98E] text-[#0C1510] inline-block">
                  {language === 'ka' ? 'მასპინძლის რჩეული' : language === 'ru' ? 'Выбор хозяина' : "Host's Top Pick"}
                </span>
                <h4 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  Amo Rame Bani (Khinkali Courtyard)
                </h4>
                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  {language === 'ka' 
                    ? '6 წუთი ფეხით. შეუკვეთეთ 10 მთიულური ხინკალი, ნადუღის რულეტები და საფერავი.' 
                    : language === 'ru' 
                    ? '6 минут пешком. Попробуйте 10 сочных хинкали с травами, рулетики из надуги и саперави.' 
                    : '6 min walk. Order 10 khinkali with mountain herbs, Nadughi cheese rolls, and a carafe of Saperavi wine.'}
                </p>
              </div>

              <button
                onClick={() => onSelectTab('gems')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                  isDark ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80]' : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                <span>{language === 'ka' ? 'ყველა რესტორანი' : language === 'ru' ? 'Все гастро-места' : 'Browse All Food Gems'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. NEXT MORNING */}
        {activeMoment === 'next_morning' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-1 ${
                isDark ? 'text-[#E4E98E]' : 'text-amber-700'
              }`}>
                ☕ {language === 'ka' ? 'ეტაპი 4 • მეორე დილა' : language === 'ru' ? 'Шаг 4 • Следующее утро' : 'Step 4 • Next Morning'}
              </span>
              <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {language === 'ka' ? 'საუკეთესო საუზმე და ყავა' : language === 'ru' ? 'Где позавтракать и выпить лучший кофе?' : 'Where Should I Have Breakfast & Coffee?'}
              </h3>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'ka' ? 'დაიწყეთ დღე ნამდვილი თბილისელივით: ახალი თონის ხაჭაპური ან სპეშალთი ყავა.' : language === 'ru' ? 'Начните день как местный: хрустящий хачапури из печи или свежеобжаренный спешелти кофе.' : 'Start your day like a local with stone-oven baking or specialty flat whites.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-base">☕</span>
                <strong className={`text-sm font-bold block ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>Coffee LAB Sololaki (3 min walk)</strong>
                <p className={`leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  {language === 'ka' ? 'მყუდრო ეზო, ეთიოპიური ფილტრ ყავა და ახალი კარდამონის ფუნთუშები.' : 'Quiet leafy back patio, single-origin Ethiopian pour-overs, and fresh cardamom pastries.'}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-base">🥐</span>
                <strong className={`text-sm font-bold block ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>Puri Guliani Bakery (River Walk)</strong>
                <p className={`leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  {language === 'ka' ? 'შამფურზე შემწვარი ხაჭაპური, ცხელი ფუნთუშები და მტკვრის პანორამა.' : 'Spit-roasted hot khachapuri, fresh morning brioche, and panoramic riverside seating.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('gems')}
              className={`w-full py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                isDark 
                  ? 'border-stone-700 bg-stone-900 text-stone-200 hover:text-white hover:bg-stone-800' 
                  : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>{language === 'ka' ? 'საუზმის და ყავის ყველა ლოკაცია' : language === 'ru' ? 'Все места для завтрака и кофе' : 'Explore All Breakfast & Coffee Spots'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 5. DURING STAY */}
        {activeMoment === 'during_stay' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-1 ${
                isDark ? 'text-[#E4E98E]' : 'text-emerald-700'
              }`}>
                🗺 {language === 'ka' ? 'ეტაპი 5 • ქალაქის აღმოჩენა' : language === 'ru' ? 'Шаг 5 • Во время отдыха' : 'Step 5 • During Stay'}
              </span>
              <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {language === 'ka' ? 'აღმოაჩინეთ თბილისი ტურისტული კლიშეების გარეშე' : language === 'ru' ? 'Откройте настоящий Тбилиси без туристических клише' : 'Discover Tbilisi Beyond the Obvious'}
              </h3>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'ka' ? 'საიდუმლო ჩანჩქერები, მშრალი ხიდის საგანძური და გოგირდის აბანოები.' : language === 'ru' ? 'Секретные каньоны, блошиный рынок Сухого моста и серные бани.' : 'Filter by mood or experience: secret canyon waterfalls, flea markets & sulfur baths.'}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark 
                ? 'bg-gradient-to-r from-amber-500/10 via-stone-900 to-[#14191C] border-amber-500/20' 
                : 'bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-amber-300'
            }`}>
              <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>Featured Secret: Leghvtakhevi Waterfall</span>
              </div>
              <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {language === 'ka'
                  ? 'სულ რაღაც 8 წუთის სავალზე თქვენი კარიდან. გუმბათიანი გოგირდის აბანოების უკან დამალულია 22-მეტრიანი ბუნებრივი ჩანჩქერი ხის ხიდებით.'
                  : 'Just an 8-minute walk from your door. Tucked right behind the domed sulfur baths is a natural 22-meter canyon waterfall with wooden footbridges.'}
              </p>
              <button
                onClick={() => onSelectTab('gems')}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                  isDark ? 'bg-[#E4E98E] text-[#0C1510] hover:bg-[#d8dd80]' : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                <span>{language === 'ka' ? 'Gems კატალოგის გახსნა' : language === 'ru' ? 'Открыть каталог мест' : 'Open Full Gems Catalog'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 6. BEFORE CHECKOUT */}
        {activeMoment === 'before_checkout' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-1 ${
                isDark ? 'text-[#E4E98E]' : 'text-amber-700'
              }`}>
                🧳 {language === 'ka' ? 'ეტაპი 6 • გამგზავრება' : language === 'ru' ? 'Шаг 6 • Выезд' : 'Step 6 • Departure'}
              </span>
              <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {language === 'ka' ? 'გამგზავრების ჩექლისტი და აეროპორტის ტრანსფერი' : language === 'ru' ? 'Чек-лист выезда и трансфер в аэропорт' : 'Check-out Checklist & Airport Transfer'}
              </h3>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {language === 'ka' ? 'Check-out დროა:' : language === 'ru' ? 'Время выезда:' : 'Check-out is at:'}{' '}
                <strong className={`font-bold font-mono ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>{property.checkOutTime}</strong>.{' '}
                {language === 'ka' ? 'გთხოვთ გაეცნოთ მარტივ წესებს.' : 'Here is the easy departure guide.'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {property.departureChecklist.map((step, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{step}</span>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs gap-3 ${
              isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div>
                <strong className={`block font-bold ${isDark ? 'text-stone-100' : 'text-stone-950'}`}>
                  {language === 'ka' ? 'აეროპორტი და Bolt ტაქსი' : language === 'ru' ? 'Трансфер в аэропорт / Такси' : 'Airport Transfer or Bolt Taxi'}
                </strong>
                <span className={`text-[11px] font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{property.airportTransit}</span>
              </div>
              <button
                onClick={onOpenFeedback}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs active:scale-95 shadow-sm shrink-0 ml-3"
              >
                ⭐ {language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Оценить' : 'Rate Your Stay'}
              </button>
            </div>
          </div>
        )}

        {/* 7. AFTER CHECKOUT / STAY FEEDBACK */}
        {activeMoment === 'after_checkout' && (
          <div className="space-y-5 animate-in fade-in text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[#E4E98E]/20 text-[#E4E98E] flex items-center justify-center mx-auto border border-[#E4E98E]/30">
              <Heart className="w-7 h-7 fill-[#E4E98E]" />
            </div>

            <div>
              <h3 className={`font-serif text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {language === 'ka' ? 'როგორ ჩაიარა თქვენმა სტუმრობამ?' : language === 'ru' ? 'Как прошло ваше пребывание?' : 'How Was Your Stay?'}
              </h3>
              <p className={`text-xs max-w-sm mx-auto mt-1 leading-relaxed font-medium ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {language === 'ka'
                  ? 'თქვენი პირადი შეფასება ეხმარება მასპინძელს ყოველი შემდეგი სტუმრობა კიდევ უფრო უკეთესი გახადოს.'
                  : language === 'ru'
                  ? 'Ваш приватный отзыв помогает хозяину сделать отдых гостей ещё уютнее и комфортнее.'
                  : 'Whether everything was magic or if something needed improvement, your private feedback helps us make every stay better.'}
              </p>
            </div>

            <button
              onClick={onOpenFeedback}
              className={`px-8 py-3 rounded-full font-bold text-xs shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 ${
                isDark ? 'bg-[#E4E98E] hover:bg-[#d8dd80] text-[#0C1510]' : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <span>{language === 'ka' ? 'შეაფასეთ სტუმრობა' : language === 'ru' ? 'Оставить отзыв хозяину' : 'Share Private Stay Feedback'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
