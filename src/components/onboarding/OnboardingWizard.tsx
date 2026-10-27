import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  KeyRound, 
  Wifi, 
  Compass, 
  Phone, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Coffee,
  AlertCircle,
  Shirt,
  Tv,
  Thermometer,
  Shield,
  Zap,
  UploadCloud,
  Film,
  Play,
  Video,
  Eye,
  X,
  Plus,
  Trash2,
  Smartphone,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Utensils,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, ApplianceGuide, Recommendation, StumariGem } from '../../types';
import { StumariArchIcon } from '../common/StumariLogo';
import { ThemeAndLanguageControls } from '../common/LanguageSelector';
import { SmartPhotoBuilder } from '../host/SmartPhotoBuilder';
import { ONBOARDING_I18N } from '../../data/onboardingI18n';
import { uploadMediaFile } from '../../firebase';
import { Language } from '../../i18n/types';

export const ONBOARDING_DRAFT_STORAGE_KEY = 'stumari_onboarding_draft_v1';

export interface ReadinessItem {
  id: string;
  label: string;
  helper: string;
  done: boolean;
  essential: boolean;
  stage: number;
}

export interface OnboardingReadinessSummary {
  essentialItems: ReadinessItem[];
  optionalItems: ReadinessItem[];
  allItems: ReadinessItem[];
  essentialCompletedCount: number;
  essentialTotalCount: number;
  optionalCompletedCount: number;
  optionalTotalCount: number;
  readinessPct: number;
  canSaveDraft: boolean;
  canPublish: boolean;
  missingEssentialItems: ReadinessItem[];
}

export const getInitialBlankOnboardingDraft = (defaultHostName = ''): Partial<Property> => ({
  title: '',
  subtitle: '',
  type: 'apartment',
  address: '',
  city: 'Tbilisi',
  country: 'Georgia',
  coverImage: '',
  photos: [],
  sourcePlatform: 'direct',
  sourceUrl: '',

  // Stage 2: Arrival essentials
  checkInTime: '3:00 PM',
  checkOutTime: '11:00 AM',
  checkInMethod: 'keypad',
  doorKeypadCode: '',
  lockboxCode: '',
  parkingInstructions: '',
  arrivalDirections: '',
  wifiNetwork: '',
  wifiPassword: '',

  // Stage 3: Make the stay easier
  appliances: [],
  quietHours: '11:00 PM – 8:00 AM',
  trashSchedule: '',
  houseRules: [
    'No smoking inside (balcony is fine)',
    'Quiet hours from 11 PM to 8 AM',
    'Please remove outdoor shoes at the entrance'
  ],
  departureChecklist: [
    'Turn off AC, heating, and lights',
    'Leave keys on the dining table or inside lockbox',
    'Close the entrance door firmly'
  ],

  // Stage 4: Local recommendations & Host contact
  gemIds: [],
  recommendations: [],
  taxiInfo: 'Use the Bolt app for reliable, metered rides around the city.',
  transitInfo: '',
  airportTransit: '',
  hostName: defaultHostName,
  hostRole: 'Host',
  hostPhone: '',
  hostWhatsApp: '',
  emergencyContact: '',
  emergencyServicesNumber: '112'
});

export function evaluateOnboardingReadiness(
  formData: Partial<Property>,
  language: Language = 'en'
): OnboardingReadinessSummary {
  const hasTitle = Boolean(formData.title?.trim());
  const hasCity = Boolean(formData.city?.trim());
  const hasBasics = hasTitle && hasCity && Boolean(formData.type);

  const method = formData.checkInMethod || 'keypad';
  const hasAccessCodeForMethod =
    method === 'in-person' ||
    method === 'concierge' ||
    (method === 'lockbox'
      ? Boolean(formData.lockboxCode?.trim() || formData.doorKeypadCode?.trim())
      : Boolean(formData.doorKeypadCode?.trim() || formData.lockboxCode?.trim()));
  const hasArrival = Boolean(formData.arrivalDirections?.trim()) && hasAccessCodeForMethod;

  const hasWifi = Boolean(formData.wifiNetwork?.trim() && formData.wifiPassword?.trim());
  const hasHostContact = Boolean(
    formData.hostName?.trim() && (formData.hostWhatsApp?.trim() || formData.hostPhone?.trim())
  );

  const hasCoverOrPhotos = Boolean(
    formData.coverImage?.trim() || (formData.photos && formData.photos.length > 0)
  );
  const hasAppliances = Boolean((formData.appliances || []).length > 0);
  const hasRulesAndCheckout = Boolean(
    (formData.houseRules || []).filter(r => r.trim()).length > 0 && formData.checkOutTime?.trim()
  );
  const hasLocalRecs = Boolean(
    (formData.gemIds || []).length > 0 || (formData.recommendations || []).length > 0
  );

  const essentialItems: ReadinessItem[] = [
    {
      id: 'basics',
      label: language === 'ka' ? 'ობიექტის სახელი, ტიპი და ქალაქი' : language === 'ru' ? 'Название, тип и город' : 'Property name, type & city',
      helper: hasBasics
        ? `${formData.title} · ${formData.city}`
        : (language === 'ka' ? 'მიუთითეთ ბინის სახელი და ქალაქი' : 'Enter your property name and city'),
      done: hasBasics,
      essential: true,
      stage: 1
    },
    {
      id: 'arrival',
      label: language === 'ka' ? 'შესვლის მეთოდი და მოსვლის ინსტრუქცია' : language === 'ru' ? 'Способ заселения и инструкция' : 'Check-in access & arrival instructions',
      helper: hasArrival
        ? (method === 'in-person' || method === 'concierge'
            ? 'In-person / reception greeting + directions set'
            : `Code & step-by-step directions ready`)
        : (language === 'ka'
            ? 'მიუთითეთ კარის/სეიფის კოდი და როგორ შევიდეს სტუმარი'
            : 'Add your access code (if self check-in) and step-by-step directions'),
      done: hasArrival,
      essential: true,
      stage: 2
    },
    {
      id: 'wifi',
      label: language === 'ka' ? 'Wi-Fi ქსელი და პაროლი' : language === 'ru' ? 'Сеть и пароль Wi-Fi' : 'Wi-Fi network & password',
      helper: hasWifi
        ? `SSID: ${formData.wifiNetwork}`
        : (language === 'ka' ? 'მიუთითეთ Wi-Fi სახელი და პაროლი' : 'Enter Wi-Fi network name and password for 1-tap guest copy'),
      done: hasWifi,
      essential: true,
      stage: 2
    },
    {
      id: 'contact',
      label: language === 'ka' ? 'მასპინძლის სახელი და საკონტაქტო ნომერი' : language === 'ru' ? 'Имя и телефон / WhatsApp хозяина' : 'Host name & WhatsApp / phone number',
      helper: hasHostContact
        ? `${formData.hostName} · ${formData.hostWhatsApp || formData.hostPhone}`
        : (language === 'ka' ? 'მიუთითეთ სახელი და WhatsApp/ტელეფონი' : 'Add your name and WhatsApp or phone number for guests'),
      done: hasHostContact,
      essential: true,
      stage: 4
    }
  ];

  const optionalItems: ReadinessItem[] = [
    {
      id: 'photos',
      label: language === 'ka' ? 'მთავარი ფოტო ან გალერეა' : language === 'ru' ? 'Фото обложки или галерея' : 'Cover photo or room gallery',
      helper: hasCoverOrPhotos
        ? 'Visual cover ready'
        : (language === 'ka' ? 'სურვილისამებრ — შეგიძლიათ მოგვიანებით დაამატოთ' : 'Optional — makes your welcome screen shine'),
      done: hasCoverOrPhotos,
      essential: false,
      stage: 1
    },
    {
      id: 'appliances',
      label: language === 'ka' ? 'ტექნიკის ინსტრუქციები' : language === 'ru' ? 'Инструкции к технике' : 'Appliance & comfort guides',
      helper: hasAppliances
        ? `${(formData.appliances || []).length} guide(s) added`
        : (language === 'ka' ? 'სურვილისამებრ — კონდიციონერი, ყავა, სარეცხი მანქანა' : 'Optional — explain AC, coffee maker, or laundry'),
      done: hasAppliances,
      essential: false,
      stage: 3
    },
    {
      id: 'rules',
      label: language === 'ka' ? 'სახლის წესები და გასვლის დრო' : language === 'ru' ? 'Правила дома и время выезда' : 'House rules & checkout checklist',
      helper: hasRulesAndCheckout
        ? `${(formData.houseRules || []).length} rules · Checkout ${formData.checkOutTime}`
        : (language === 'ka' ? 'სურვილისამებრ — სიჩუმის საათები და გასვლა' : 'Optional — quiet hours and departure steps'),
      done: hasRulesAndCheckout,
      essential: false,
      stage: 3
    },
    {
      id: 'gems',
      label: language === 'ka' ? 'ადგილობრივი რჩევები (Gems)' : language === 'ru' ? 'Локальные рекомендации (Gems)' : 'Local Gems & neighborhood spots',
      helper: hasLocalRecs
        ? `${(formData.gemIds || []).length + (formData.recommendations || []).length} spot(s) selected`
        : (language === 'ka' ? 'სურვილისამებრ — კაფეები, რესტორნები და ხედები' : 'Optional — share favorite cafes, bakeries & sights'),
      done: hasLocalRecs,
      essential: false,
      stage: 4
    }
  ];

  const essentialCompletedCount = essentialItems.filter(i => i.done).length;
  const optionalCompletedCount = optionalItems.filter(i => i.done).length;
  // Each essential item = 15% (4 * 15 = 60%), each optional item = 10% (4 * 10 = 40%)
  const readinessPct = Math.min(100, essentialCompletedCount * 15 + optionalCompletedCount * 10);

  return {
    essentialItems,
    optionalItems,
    allItems: [...essentialItems, ...optionalItems],
    essentialCompletedCount,
    essentialTotalCount: essentialItems.length,
    optionalCompletedCount,
    optionalTotalCount: optionalItems.length,
    readinessPct,
    canSaveDraft: hasTitle,
    canPublish: essentialCompletedCount === essentialItems.length,
    missingEssentialItems: essentialItems.filter(i => !i.done)
  };
}

export const COMMON_APPLIANCE_PRESETS: Omit<ApplianceGuide, 'id'>[] = [
  {
    title: 'Air Conditioning & Heating',
    icon: 'Thermometer',
    category: 'climate',
    instructions: 'Use the wall or handheld remote to set your preferred temperature (22°C / 72°F recommended). Please keep balcony doors closed while running.',
    troubleshooting: 'If the unit does not respond, check that the mode is set to Cool (snowflake) or Heat (sun).'
  },
  {
    title: 'Coffee & Espresso Maker',
    icon: 'Coffee',
    category: 'kitchen',
    instructions: 'Complimentary coffee capsules/beans are in the kitchen jar. Fill the rear tank with filtered water, press power, and select your cup size.',
    troubleshooting: 'Empty the used capsule tray if the indicator light blinks.'
  },
  {
    title: 'Washing Machine',
    icon: 'Shirt',
    category: 'laundry',
    instructions: 'Detergent pods are under the sink. Place pod directly in the drum, turn dial to "Quick 30°C", and press Start.',
    troubleshooting: 'Wait 2 minutes after the cycle finishes for the door lock to release.'
  },
  {
    title: 'Smart TV & Streaming',
    icon: 'Tv',
    category: 'entertainment',
    instructions: 'Use the black remote to turn on the TV. Netflix, YouTube, and Spotify are ready to use on the home screen.',
    troubleshooting: 'Select HDMI 1 if using the media box.'
  },
  {
    title: 'Hot Water & Boiler',
    icon: 'Flame',
    category: 'climate',
    instructions: 'Hot water runs automatically 24/7. Give the tap 15–20 seconds to reach full warmth.',
    troubleshooting: 'Please do not adjust the pressure valves on the utility boiler.'
  },
  {
    title: 'Induction Stove & Oven',
    icon: 'Utensils',
    category: 'kitchen',
    instructions: 'Hold the power symbol for 2 seconds until it beeps, then select the burner and slide to set heat level.',
    troubleshooting: 'If "L" appears on the display, hold the lock icon for 3 seconds to unlock child safety.'
  }
];

export const COMMON_HOUSE_RULE_PRESETS: string[] = [
  'No smoking inside (balcony is fine)',
  'Quiet hours from 11 PM to 8 AM',
  'Please remove outdoor shoes at the entrance',
  'No parties or unregistered overnight guests',
  'Please turn off AC and lights when going out'
];

export const SUPPORTED_CITIES = [
  'Tbilisi',
  'Batumi',
  'Kazbegi',
  'Kutaisi',
  'Gudauri',
  'Bakuriani',
  'Sighnaghi',
  'Mestia'
];

interface LiveGuestPreviewProps {
  formData: Partial<Property>;
  gems: StumariGem[];
  isDark: boolean;
  language: Language;
  compact?: boolean;
}

export const OnboardingLiveGuestPreview: React.FC<LiveGuestPreviewProps> = ({
  formData,
  gems,
  isDark,
  language,
  compact = false
}) => {
  const [previewTab, setPreviewTab] = useState<'stay' | 'arrival' | 'explore'>('stay');
  const coverSrc = formData.coverImage?.trim() || formData.photos?.[0]?.url || '';
  const selectedGems = gems.filter(g => (formData.gemIds || []).includes(g.id));
  const customRecs = formData.recommendations || [];
  const method = formData.checkInMethod || 'keypad';
  const primaryCode =
    method === 'lockbox'
      ? formData.lockboxCode || formData.doorKeypadCode
      : formData.doorKeypadCode || formData.lockboxCode;

  return (
    <div className={`rounded-[28px] overflow-hidden border transition-all ${
      isDark ? 'bg-[#141312] border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A]'
    } ${compact ? 'max-w-[330px] mx-auto shadow-xl' : 'shadow-md'}`}>
      {/* Top Preview Bar */}
      <div className={`px-3.5 py-2.5 border-b flex items-center justify-between text-[11px] ${
        isDark ? 'bg-[#1C1B19] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#B85D3B]/15 text-[#B85D3B] flex items-center justify-center font-serif font-bold text-[11px] shrink-0">
            {(formData.hostName || 'H').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold truncate block leading-tight">
              {formData.title?.trim() || (language === 'ka' ? 'თქვენი ობიექტის სახელი' : 'Your Property Name')}
            </span>
            <span className={`text-[10px] truncate block ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
              {formData.city?.trim() || 'City'} · {formData.hostName?.trim() || (language === 'ka' ? 'მასპინძელი' : 'Host')}
            </span>
          </div>
        </div>
        <ThemeAndLanguageControls
          className="scale-90 origin-right shrink-0"
          themeButtonClassName={isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-stone-100 border-stone-200 text-stone-700'}
        />
      </div>

      {/* Hero Cover or Clean Architectural Placeholder (Never another property's photo) */}
      <div className="relative h-40 overflow-hidden">
        {coverSrc ? (
          <>
            <img
              src={coverSrc}
              alt={formData.title || 'Property preview'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${
            isDark
              ? 'bg-gradient-to-br from-[#23201D] via-[#1C1A17] to-[#151412]'
              : 'bg-gradient-to-br from-[#F3EFEA] via-[#EAE3DC] to-[#E2D9CF]'
          }`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1.5 border ${
              isDark ? 'bg-white/5 border-white/10 text-[#F55A51]' : 'bg-white/80 border-stone-300/80 text-[#B85D3B]'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}>
              {language === 'ka' ? 'გარეკანის ფოტო (სურვილისამებრ)' : 'Cover Photo Preview'}
            </span>
          </div>
        )}

        <div className={`absolute bottom-3 left-3.5 right-3.5 ${coverSrc ? 'text-white' : (isDark ? 'text-stone-100' : 'text-stone-900')}`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider block ${
            coverSrc ? 'text-amber-300' : 'text-[#B85D3B]'
          }`}>
            {formData.city?.trim() || 'City'}, {formData.country?.trim() || 'Georgia'} · {formData.type || 'apartment'}
          </span>
          <h4 className="text-base font-serif font-bold leading-snug truncate">
            {formData.title?.trim() || (language === 'ka' ? 'უსათაურო ობიექტი' : 'Untitled Property')}
          </h4>
          {formData.subtitle?.trim() && (
            <p className={`text-[11px] truncate ${coverSrc ? 'text-stone-200' : (isDark ? 'text-stone-400' : 'text-stone-600')}`}>
              {formData.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Mini Guest Tab Switcher */}
      <div className={`grid grid-cols-3 gap-1 p-1.5 border-b text-[11px] font-semibold ${
        isDark ? 'bg-[#1A1917] border-[#2B2926]' : 'bg-[#F3EFE9] border-[#EBE6DF]'
      }`}>
        {[
          { id: 'stay', label: language === 'ka' ? 'სახლი' : 'Stay' },
          { id: 'arrival', label: language === 'ka' ? 'შესვლა' : 'Arrival' },
          { id: 'explore', label: language === 'ka' ? 'რჩევები' : 'Explore' }
        ].map(tItem => (
          <button
            key={tItem.id}
            type="button"
            onClick={() => setPreviewTab(tItem.id as any)}
            className={`py-1 rounded-lg transition-colors cursor-pointer ${
              previewTab === tItem.id
                ? isDark ? 'bg-[#2B2926] text-white shadow-2xs' : 'bg-white text-stone-900 shadow-2xs'
                : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-3.5 space-y-2.5 text-xs max-h-[300px] overflow-y-auto">
        {previewTab === 'stay' && (
          <>
            {/* 1-Tap Wi-Fi & Access */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
              }`}>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-0.5">
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span>Wi-Fi</span>
                </div>
                <span className="font-semibold text-[11px] truncate block">
                  {formData.wifiNetwork?.trim() || (language === 'ka' ? 'არ არის მითითებული' : 'Not set yet')}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate block">
                  {formData.wifiPassword?.trim() ? `Pass: ${formData.wifiPassword}` : '—'}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
              }`}>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-0.5">
                  <KeyRound className="w-3 h-3 text-amber-500" />
                  <span className="capitalize">{method}</span>
                </div>
                <span className="font-mono font-bold text-xs text-[#B85D3B] dark:text-amber-400 truncate block">
                  {method === 'in-person' || method === 'concierge'
                    ? (language === 'ka' ? 'დახვედრა ადგილზე' : 'Host Greeting')
                    : (primaryCode?.trim() || '----')}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  In: {formData.checkInTime || '3:00 PM'}
                </span>
              </div>
            </div>

            {/* Appliances Preview */}
            <div className={`p-2.5 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
            }`}>
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>{language === 'ka' ? 'ტექნიკის გიდები' : 'Appliance Guides'}</span>
                <span>{(formData.appliances || []).length}</span>
              </div>
              {(formData.appliances || []).length === 0 ? (
                <p className="text-[11px] text-stone-400">
                  {language === 'ka' ? 'ტექნიკის ინსტრუქციები ჯერ არ დამატებულა' : 'No appliance guides added yet (Optional)'}
                </p>
              ) : (
                <div className="space-y-1">
                  {(formData.appliances || []).slice(0, 3).map((app, i) => (
                    <div key={app.id || i} className="flex items-center justify-between text-[11px]">
                      <span className="font-medium truncate">{app.title}</span>
                      {app.mediaUrl && (
                        <span className="text-[10px] text-[#B85D3B] font-mono shrink-0">
                          {app.mediaType === 'video' ? 'Video' : 'Photo'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rules & Host Contact */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
            }`}>
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>{language === 'ka' ? 'სახლის წესები' : 'House Rules'}</span>
                <span>Out: {formData.checkOutTime || '11:00 AM'}</span>
              </div>
              {(formData.houseRules || []).slice(0, 2).map((rule, idx) => (
                <div key={idx} className="text-[11px] flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{rule}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {previewTab === 'arrival' && (
          <div className="space-y-2">
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
            }`}>
              <span className="text-[10px] text-stone-400 block">
                {language === 'ka' ? 'მისამართი' : 'Address'}
              </span>
              <span className="font-medium text-[11px] block">
                {formData.address?.trim() || `${formData.city || 'Tbilisi'}, ${formData.country || 'Georgia'}`}
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
            }`}>
              <span className="text-[10px] text-stone-400 block">
                {language === 'ka' ? 'მოსვლის ინსტრუქცია' : 'Arrival Instructions'}
              </span>
              <p className="text-[11px] leading-relaxed">
                {formData.arrivalDirections?.trim() || (language === 'ka' ? 'ინსტრუქცია გამოჩნდება აქ...' : 'Your step-by-step arrival instructions will appear here.')}
              </p>
            </div>

            {formData.parkingInstructions?.trim() && (
              <div className={`p-2.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
              }`}>
                <span className="text-[10px] text-stone-400 block">
                  {language === 'ka' ? 'პარკინგი' : 'Parking'}
                </span>
                <p className="text-[11px]">{formData.parkingInstructions}</p>
              </div>
            )}
          </div>
        )}

        {previewTab === 'explore' && (
          <div className="space-y-2">
            <div className={`p-2.5 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
            }`}>
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>{language === 'ka' ? 'რჩეული ადგილები' : 'Local Recommendations'}</span>
                <span>{selectedGems.length + customRecs.length}</span>
              </div>
              {selectedGems.length === 0 && customRecs.length === 0 ? (
                <p className="text-[11px] text-stone-400">
                  {language === 'ka' ? 'აირჩიეთ ადგილობრივი Gems მე-4 ნაბიჯზე' : 'Select curated Gems or add neighborhood spots in Stage 4.'}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {selectedGems.slice(0, 3).map(g => (
                    <div key={g.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-medium truncate">{g.title}</span>
                      <span className="text-[10px] text-stone-400 shrink-0">{g.distance}</span>
                    </div>
                  ))}
                  {customRecs.slice(0, 2).map(r => (
                    <div key={r.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-medium truncate">{r.name}</span>
                      <span className="text-[10px] text-stone-400 capitalize shrink-0">{r.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#1F1E1C] border-[#2B2926]' : 'bg-white border-[#EBE6DF]'
            }`}>
              <div>
                <span className="text-[10px] text-stone-400 block">
                  {language === 'ka' ? 'მასპინძელთან კავშირი' : 'Host Contact'}
                </span>
                <span className="font-semibold text-[11px] block">
                  {formData.hostName?.trim() || (language === 'ka' ? 'მასპინძელი' : 'Host')}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                {formData.hostWhatsApp?.trim() || formData.hostPhone?.trim() || 'WhatsApp'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const OnboardingWizard: React.FC = () => {
  const {
    createProperty,
    navigateToPropertyHub,
    setCurrentRoute,
    openAddPropertyModal,
    firebaseUser,
    currentUser,
    templates,
    gems,
    theme,
    showToast,
    t,
    language
  } = useApp();

  const isDark = theme === 'dark';
  const obContent = ONBOARDING_I18N[language] || ONBOARDING_I18N.en;

  const defaultHostName = (
    firebaseUser?.displayName ||
    (currentUser?.id && currentUser.id !== 'host-user-1' ? currentUser.name : '') ||
    ''
  ).trim();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);
  const [coverInputMode, setCoverInputMode] = useState<'upload' | 'url'>('upload');
  const [showPhotoGalleryBuilder, setShowPhotoGalleryBuilder] = useState<boolean>(false);
  const [showTransportFields, setShowTransportFields] = useState<boolean>(false);
  const [isDraggingCover, setIsDraggingCover] = useState<boolean>(false);
  const [previewMediaApp, setPreviewMediaApp] = useState<ApplianceGuide | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [pendingPreset, setPendingPreset] = useState<'tbilisi' | 'batumi' | 'kazbegi' | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Custom appliance & rule inputs
  const [newRuleText, setNewRuleText] = useState<string>('');
  const [newChecklistText, setNewChecklistText] = useState<string>('');
  const [newRecName, setNewRecName] = useState<string>('');
  const [newRecCategory, setNewRecCategory] = useState<Recommendation['category']>('coffee');
  const [newRecTip, setNewRecTip] = useState<string>('');
  const [newRecDistance, setNewRecDistance] = useState<string>('5 min walk');

  const [formData, setFormData] = useState<Partial<Property>>(() => {
    try {
      const saved = sessionStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...getInitialBlankOnboardingDraft(defaultHostName),
            ...parsed,
            hostName: parsed.hostName || defaultHostName
          };
        }
      }
    } catch {
      // ignore storage errors
    }
    return getInitialBlankOnboardingDraft(defaultHostName);
  });

  // Persist draft in sessionStorage so switching steps or modes never loses work
  useEffect(() => {
    try {
      sessionStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  // Keep hostName synced if user logs in and hasn't typed one yet
  useEffect(() => {
    if (defaultHostName && !formData.hostName?.trim()) {
      setFormData(prev => ({ ...prev, hostName: defaultHostName }));
    }
  }, [defaultHostName]);

  const readiness = evaluateOnboardingReadiness(formData, language);

  const stages = [
    {
      num: 1,
      title: language === 'ka' ? '1. ძირითადი მონაცემები' : language === 'ru' ? '1. Основное' : '1. Property Basics',
      shortTitle: language === 'ka' ? 'ძირითადი' : language === 'ru' ? 'Основное' : 'Basics'
    },
    {
      num: 2,
      title: language === 'ka' ? '2. დახვედრა და Wi-Fi' : language === 'ru' ? '2. Заселение и Wi-Fi' : '2. Arrival Essentials',
      shortTitle: language === 'ka' ? 'დახვედრა' : language === 'ru' ? 'Заселение' : 'Arrival'
    },
    {
      num: 3,
      title: language === 'ka' ? '3. კომფორტი და წესები' : language === 'ru' ? '3. Удобства и правила' : '3. Stay & Rules',
      shortTitle: language === 'ka' ? 'კომფორტი' : language === 'ru' ? 'Удобства' : 'Stay & Rules'
    },
    {
      num: 4,
      title: language === 'ka' ? '4. რჩევები და კონტაქტი' : language === 'ru' ? '4. Места и контакты' : '4. Local Gems & Contact',
      shortTitle: language === 'ka' ? 'რჩევები' : language === 'ru' ? 'Места' : 'Recommendations'
    },
    {
      num: 5,
      title: language === 'ka' ? '5. გადახედვა და გაშვება' : language === 'ru' ? '5. Проверка и публикация' : '5. Preview & Publish',
      shortTitle: language === 'ka' ? 'გაშვება' : language === 'ru' ? 'Публикация' : 'Publish'
    }
  ];

  const hasCustomInput = Boolean(
    formData.title?.trim() ||
    formData.subtitle?.trim() ||
    formData.address?.trim() ||
    formData.wifiNetwork?.trim() ||
    formData.doorKeypadCode?.trim() ||
    formData.arrivalDirections?.trim()
  );

  const handleCoverFileSelect = async (file: File) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast(language === 'ka' ? 'გთხოვთ ატვირთოთ JPG, PNG ან WEBP სურათი' : 'Please upload a JPG, PNG, or WEBP image');
      return;
    }
    try {
      setIsUploadingMedia(true);
      const storagePath = `properties/covers/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const url = await uploadMediaFile(file, storagePath);
      setFormData(prev => ({ ...prev, coverImage: url }));
      showToast(language === 'ka' ? 'მთავარი სურათი განახლდა!' : 'Cover photo uploaded');
    } catch (err: any) {
      console.error('Failed to upload cover:', err);
      showToast('Could not upload cover image');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleApplianceMediaUpload = async (appId: string, file: File) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    try {
      setIsUploadingMedia(true);
      const storagePath = `properties/appliances/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const url = await uploadMediaFile(file, storagePath);
      setFormData(prev => ({
        ...prev,
        appliances: (prev.appliances || []).map(app =>
          app.id === appId ? { ...app, mediaUrl: url, mediaType: isVideo ? 'video' : 'photo' } : app
        )
      }));
      showToast(language === 'ka' ? 'ტექნიკის მედია გიდი აიტვირთა!' : 'Appliance media guide attached');
    } catch (err: any) {
      console.error('Failed to upload appliance media:', err);
      showToast('Failed to upload media file');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const applySamplePresetConfirmed = (presetName: 'tbilisi' | 'batumi' | 'kazbegi') => {
    if (presetName === 'tbilisi') {
      setFormData(prev => ({
        ...prev,
        title: language === 'ka' ? 'მზიანი სოლოლაკის ტერასა (Sample)' : language === 'ru' ? 'Солнечная терраса в Сололаки (Sample)' : 'Sunny Sololaki Terrace (Sample)',
        subtitle: language === 'ka' ? 'მყუდრო აპარტამენტი ძველ თბილისში პანორამული აივნით' : language === 'ru' ? 'Уютные апартаменты в Старом городе с живописным балконом' : 'Charming Old Town apartment with scenic balcony',
        type: 'apartment',
        address: '8 Lado Asatiani Street, Apt 4',
        city: 'Tbilisi',
        country: 'Georgia',
        coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        checkInMethod: 'keypad',
        wifiNetwork: 'OldTbilisi_5G',
        wifiPassword: 'TbilisiHost2026',
        doorKeypadCode: '4820#',
        arrivalDirections: 'Push wooden courtyard gate, walk up iron staircase to 2nd floor, teal door on left.',
        hostName: prev.hostName || defaultHostName || 'Host',
        hostWhatsApp: prev.hostWhatsApp || '+995 555 123 456',
        appliances: COMMON_APPLIANCE_PRESETS.slice(0, 3).map((a, i) => ({ ...a, id: `app-preset-tb-${i}` })),
        gemIds: gems.slice(0, 3).map(g => g.id)
      }));
      showToast(obContent.presets.loadedToast(obContent.presets.tbilisiTitle));
    } else if (presetName === 'batumi') {
      setFormData(prev => ({
        ...prev,
        title: language === 'ka' ? 'ბათუმის ბულვარის პენტჰაუსი (Sample)' : language === 'ru' ? 'Пентхаус на бульваре Батуми (Sample)' : 'Batumi Boulevard Sea Penthouse (Sample)',
        subtitle: language === 'ka' ? 'თანამედროვე აპარტამენტი შავი ზღვის მზის ჩასვლის ტერასით' : language === 'ru' ? 'Современные апартаменты с террасой и видом на Черное море' : 'Modern waterfront apartment with Black Sea sunset terrace',
        type: 'apartment',
        address: '15 Rustaveli Ave, 18th Floor',
        city: 'Batumi',
        country: 'Georgia',
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        checkInMethod: 'keypad',
        wifiNetwork: 'BatumiSunset_Fiber',
        wifiPassword: 'SeaBreeze2026',
        doorKeypadCode: '9182#',
        arrivalDirections: 'Enter tower lobby, take elevator to 18th floor, apartment 18B on the right.',
        hostName: prev.hostName || defaultHostName || 'Host',
        hostWhatsApp: prev.hostWhatsApp || '+995 555 234 567',
        appliances: COMMON_APPLIANCE_PRESETS.slice(0, 2).map((a, i) => ({ ...a, id: `app-preset-bt-${i}` })),
        gemIds: gems.slice(0, 2).map(g => g.id)
      }));
      showToast(obContent.presets.loadedToast(obContent.presets.batumiTitle));
    } else {
      setFormData(prev => ({
        ...prev,
        title: language === 'ka' ? 'ყაზბეგის ალპური შალე (Sample)' : language === 'ru' ? 'Альпийское шале в Казбеги (Sample)' : 'Kazbegi Alpine Chalet (Sample)',
        subtitle: language === 'ka' ? 'ხის მთის კოტეჯი მყინვარწვერის პანორამული ხედით' : language === 'ru' ? 'Уютный деревянный коттедж с видом на гору Казбек' : 'Timber mountain retreat with panoramic Mount Kazbek view',
        type: 'villa',
        address: 'Mountain Valley Way 12',
        city: 'Kazbegi',
        country: 'Georgia',
        coverImage: 'https://images.unsplash.com/photo-1542314831-c6a4d27f8842?auto=format&fit=crop&w=1200&q=80',
        checkInMethod: 'lockbox',
        wifiNetwork: 'Kazbek_Starlink_WiFi',
        wifiPassword: 'MountPeak2026',
        lockboxCode: '3311',
        doorKeypadCode: '3311#',
        arrivalDirections: 'Follow gravel driveway past the pine trees; lockbox is mounted by the main cedar door.',
        hostName: prev.hostName || defaultHostName || 'Host',
        hostWhatsApp: prev.hostWhatsApp || '+995 555 345 678',
        appliances: COMMON_APPLIANCE_PRESETS.slice(0, 2).map((a, i) => ({ ...a, id: `app-preset-kz-${i}` }))
      }));
      showToast(obContent.presets.loadedToast(obContent.presets.kazbegiTitle));
    }
    setPendingPreset(null);
    setValidationMessage(null);
  };

  const handleApplyPreset = (presetName: 'tbilisi' | 'batumi' | 'kazbegi') => {
    if (hasCustomInput) {
      setPendingPreset(presetName);
      return;
    }
    applySamplePresetConfirmed(presetName);
  };

  const handleApplyTemplate = (tmplId: string) => {
    const tmpl = templates.find(item => item.id === tmplId);
    if (!tmpl) return;
    setFormData(prev => ({
      ...prev,
      type: tmpl.propertyType || prev.type,
      houseRules: [...tmpl.houseRules],
      quietHours: tmpl.quietHours,
      trashSchedule: tmpl.trashSchedule,
      checkInTime: tmpl.checkInTime,
      checkOutTime: tmpl.checkOutTime,
      departureChecklist: [...(tmpl.departureChecklist || prev.departureChecklist || [])],
      appliances: tmpl.appliances.map(a => ({ ...a, id: `app-${Date.now()}-${Math.random()}` }))
    }));
    showToast(language === 'ka' ? `შაბლონი "${tmpl.name}" ჩაიტვირთა` : `Applied template "${tmpl.name}"`);
  };

  const handleSaveDraft = async () => {
    if (!formData.title?.trim()) {
      setCurrentStep(1);
      const msg =
        language === 'ka'
          ? 'მონახაზის შესანახად გთხოვთ მიუთითოთ მხოლოდ ობიექტის სახელი 1-ელ ნაბიჯზე.'
          : 'Please enter a Property Name in Stage 1 to save a draft.';
      setValidationMessage(msg);
      showToast(msg, 'info');
      return;
    }

    setIsSavingDraft(true);
    setValidationMessage(null);
    try {
      const created = await createProperty({ ...formData, status: 'draft' });
      sessionStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
      navigateToPropertyHub(created.id, 'overview');
    } catch (err: any) {
      console.error('Failed to save draft:', err);
      setValidationMessage(err?.message || 'Could not save draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!readiness.canPublish) {
      const firstMissing = readiness.missingEssentialItems[0];
      const missingLabels = readiness.missingEssentialItems.map(i => i.label).join(', ');
      const msg =
        language === 'ka'
          ? `გამოქვეყნებამდე გთხოვთ შეავსოთ სავალდებულო ველები: ${missingLabels}. (ან შეინახეთ მონახაზად)`
          : `Before publishing, please complete the essential items: ${missingLabels}. You can also Save as Draft anytime.`;
      setValidationMessage(msg);
      if (firstMissing && currentStep !== 5) {
        setCurrentStep(firstMissing.stage);
      } else if (currentStep !== 5) {
        setCurrentStep(5);
      }
      showToast(msg, 'info');
      return;
    }

    setIsPublishing(true);
    setValidationMessage(null);
    try {
      const created = await createProperty({ ...formData, status: 'published' });
      sessionStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
      navigateToPropertyHub(created.id, 'overview');
    } catch (err: any) {
      console.error('Failed to publish property:', err);
      setValidationMessage(err?.message || 'Failed to publish property.');
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleAppliancePreset = (preset: Omit<ApplianceGuide, 'id'>) => {
    const existing = (formData.appliances || []).find(
      a => a.title.toLowerCase() === preset.title.toLowerCase()
    );
    if (existing) {
      setFormData(prev => ({
        ...prev,
        appliances: (prev.appliances || []).filter(a => a.id !== existing.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        appliances: [
          ...(prev.appliances || []),
          { ...preset, id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }
        ]
      }));
    }
  };

  const addBlankAppliance = () => {
    setFormData(prev => ({
      ...prev,
      appliances: [
        ...(prev.appliances || []),
        {
          id: `app-${Date.now()}`,
          title: 'Custom Appliance',
          icon: 'Zap',
          category: 'other',
          instructions: ''
        }
      ]
    }));
  };

  const toggleGemSelection = (gemId: string) => {
    setFormData(prev => {
      const current = prev.gemIds || [];
      const exists = current.includes(gemId);
      return {
        ...prev,
        gemIds: exists ? current.filter(id => id !== gemId) : [...current, gemId]
      };
    });
  };

  const addCustomRecommendation = () => {
    if (!newRecName.trim()) return;
    const newRec: Recommendation = {
      id: `rec-${Date.now()}`,
      name: newRecName.trim(),
      category: newRecCategory,
      description: newRecTip.trim() || 'Recommended neighborhood spot.',
      hostTip: newRecTip.trim(),
      address: formData.city || 'Tbilisi',
      distance: newRecDistance.trim() || '5 min walk',
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${newRecName.trim()} ${formData.city || ''}`)}`
    };
    setFormData(prev => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), newRec]
    }));
    setNewRecName('');
    setNewRecTip('');
  };

  return (
    <div className={`min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 pb-24 lg:pb-12 ${
      isDark ? 'bg-[#121110] text-[#F7F5F0]' : 'bg-[#FAF8F5] text-[#1C1B1A]'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className={`p-5 sm:p-6 rounded-[28px] border transition-all space-y-4 ${
          isDark ? 'bg-[#1A1917] border-[#2B2926] shadow-xl' : 'bg-white border-[#EBE6DF] shadow-xs'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${
                isDark ? 'bg-[#F55A51]/15 border-[#F55A51]/30 text-[#F55A51]' : 'bg-[#FDF1F0] border-[#F55A51]/25 text-[#B85D3B]'
              }`}>
                <StumariArchIcon size={22} className="text-[#F55A51]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'ახალი სტუმრის გიდის შექმნა' : language === 'ru' ? 'Создание гида для гостей' : 'Create Your Guest Guide'}
                  </h1>
                  <span className={`text-xs font-mono font-semibold ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    · {language === 'ka' ? `ეტაპი ${currentStep} / 5` : language === 'ru' ? `Этап ${currentStep} из 5` : `Stage ${currentStep} of 5`}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {language === 'ka'
                    ? '5 მარტივი ნაბიჯი სრულყოფილი გზამკვლევისთვის. შეგიძლიათ ნებისმიერ დროს შეინახოთ მონახაზად.'
                    : 'Five guided stages designed for hosts. Fill in the essentials now and add optional touches anytime.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setCurrentRoute('/app');
                  openAddPropertyModal();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                    : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#B85D3B]" />
                <span>{language === 'ka' ? 'სწრაფი მოდალური რეჟიმი' : 'Quick Modal View'}</span>
              </button>

              <button
                type="button"
                disabled={isSavingDraft}
                onClick={handleSaveDraft}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                    : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isSavingDraft ? 'Saving...' : (language === 'ka' ? 'მონახაზად შენახვა' : 'Save Draft')}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRoute('/app')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-zinc-800 text-zinc-400 hover:text-white'
                    : 'border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {language === 'ka' ? 'დაფაზე დაბრუნება' : 'Back to Dashboard'}
              </button>
            </div>
          </div>

          {/* 5-Stage Interactive Progress Stepper */}
          <div className="pt-2 border-t border-stone-200/70 dark:border-zinc-800/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              {stages.map((stage) => {
                const isCurrent = currentStep === stage.num;
                const isPast = currentStep > stage.num;
                return (
                  <button
                    key={stage.num}
                    type="button"
                    onClick={() => {
                      setValidationMessage(null);
                      setCurrentStep(stage.num);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#B85D3B] text-white shadow-xs'
                        : isPast
                        ? isDark
                          ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-750'
                          : 'bg-stone-200/80 text-stone-800 hover:bg-stone-200'
                        : isDark
                        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-black/20 text-white'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {isPast ? <Check className="w-2.5 h-2.5" /> : stage.num}
                    </span>
                    <span className="hidden sm:inline">{stage.title}</span>
                    <span className="sm:hidden">{stage.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Readiness Summary Indicator */}
            <div className="hidden lg:flex items-center gap-3 shrink-0 text-xs">
              <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                {language === 'ka' ? 'სავალდებულო:' : 'Essentials:'}{' '}
                <strong className={readiness.canPublish ? 'text-emerald-500' : 'text-amber-500'}>
                  {readiness.essentialCompletedCount}/{readiness.essentialTotalCount}
                </strong>
              </span>
              <div className="w-24 h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${readiness.canPublish ? 'bg-emerald-500' : 'bg-[#B85D3B]'}`}
                  style={{ width: `${readiness.readinessPct}%` }}
                />
              </div>
              <span className="font-mono font-semibold tabular-nums">{readiness.readinessPct}%</span>
            </div>
          </div>
        </div>

        {/* Validation / Missing Requirement Banner */}
        {validationMessage && (
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{validationMessage}</p>
                {readiness.missingEssentialItems.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {readiness.missingEssentialItems.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setValidationMessage(null);
                          setCurrentStep(item.stage);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-semibold border transition-colors cursor-pointer ${
                          isDark ? 'bg-zinc-900 border-amber-500/40 text-amber-300 hover:bg-zinc-800' : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        Go to Stage {item.stage}: {item.label} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValidationMessage(null)}
              className="self-end sm:self-center p-1 rounded-lg hover:bg-black/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Workspace Grid: Form (7 cols) + Live Preview & Readiness Sidebar (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Stage Form Card */}
          <div className={`lg:col-span-7 p-6 sm:p-8 rounded-[28px] border transition-all flex flex-col justify-between ${
            isDark ? 'bg-[#1A1917] border-[#2B2926] text-[#F7F5F0] shadow-xl' : 'bg-white border-[#EBE6DF] text-[#1C1B1A] shadow-sm'
          }`}>

            {/* ========================================================= */}
            {/* STAGE 1: PROPERTY BASICS                                  */}
            {/* ========================================================= */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block mb-1">
                    {language === 'ka' ? 'ეტაპი 1 / 5 · ძირითადი ინფორმაცია' : 'Stage 1 of 5 · Property Basics'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'მოგვიყევით თქვენი ობიექტის შესახებ' : 'Tell guests about your property'}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {language === 'ka'
                      ? 'მიუთითეთ ბინის სახელი, ტიპი და ქალაქი. ფოტოს დამატება ახლაც შეგიძლიათ და მოგვიანებითაც.'
                      : 'Start with your property name, type, and city. You can upload a cover photo now or skip it for later.'}
                  </p>
                </div>

                {/* Optional Starter Tools: Reusable Templates & Sample Demo Presets */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold block">
                        {language === 'ka' ? 'სწრაფი დაწყება (სურვილისამებრ)' : 'Optional Quick-Start Presets'}
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {language === 'ka'
                          ? 'შეავსეთ რეალური მონაცემები ქვემოთ, ან გამოსცადეთ სანიმუშო დემო გიდი.'
                          : 'Fill in your real property below, or test with a sample preset.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['tbilisi', 'batumi', 'kazbegi'] as const).map(pKey => (
                        <button
                          key={pKey}
                          type="button"
                          onClick={() => handleApplyPreset(pKey)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer capitalize ${
                            isDark
                              ? 'bg-zinc-900 border-zinc-700 text-amber-300 hover:bg-zinc-800'
                              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          Sample: {pKey}
                        </button>
                      ))}
                    </div>
                  </div>

                  {pendingPreset && (
                    <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                      isDark ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}>
                      <span>
                        {language === 'ka'
                          ? 'ჩანაცვლდეს შეყვანილი მონაცემები სანიმუშო დემო ტექსტით?'
                          : 'Replace your current form inputs with sample demo data?'}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => applySamplePresetConfirmed(pendingPreset)}
                          className="px-2.5 py-1 rounded-lg font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer"
                        >
                          {language === 'ka' ? 'დიახ' : 'Replace'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingPreset(null)}
                          className="px-2.5 py-1 rounded-lg font-medium border border-stone-400/40 hover:bg-black/10 cursor-pointer"
                        >
                          {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}

                  {templates.length > 0 && (
                    <div className="pt-2 border-t border-stone-200/60 dark:border-zinc-800 flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {language === 'ka' ? 'წესების და ტექნიკის შაბლონი:' : 'Apply your saved template:'}
                      </span>
                      {templates.slice(0, 3).map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleApplyTemplate(tmpl.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {tmpl.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Essential Field 1: Property Name */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold">
                        {language === 'ka' ? 'ობიექტის / ბინის სახელი' : 'Property Name'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <span className="text-[11px] text-[#B85D3B] font-medium">
                        {language === 'ka' ? 'სავალდებულო' : 'Essential'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={language === 'ka' ? 'მაგ. მზიანი ლოფტი სოლოლაკში' : 'e.g. Sunny Sololaki Courtyard Apartment'}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                        isDark
                          ? 'bg-[#141312] border-[#2B2926] text-zinc-100 placeholder:text-zinc-500 focus:border-[#B85D3B] focus:ring-[#B85D3B]/20'
                          : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-[#B85D3B] focus:ring-[#B85D3B]/20'
                      }`}
                    />
                    <span className={`text-[11px] mt-1 block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {language === 'ka' ? 'ეს სახელი გამოჩნდება სტუმრის გზამკვლევის მთავარ ეკრანზე.' : 'Shown at the top of your digital guest guide and QR stand.'}
                    </span>
                  </div>

                  {/* Essential Field 2: Property Type */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold">
                        {language === 'ka' ? 'ობიექტის ტიპი' : 'Property Type'} <span className="text-[#F55A51]">*</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'apartment', label: language === 'ka' ? 'ბინა' : 'Apartment' },
                        { id: 'guesthouse', label: language === 'ka' ? 'საოჯახო სასტუმრო' : 'Guesthouse' },
                        { id: 'villa', label: language === 'ka' ? 'ვილა / კოტეჯი' : 'Villa / Chalet' },
                        { id: 'hotel', label: language === 'ka' ? 'ბუტიკ-სასტუმრო' : 'Boutique Hotel' }
                      ].map(tOpt => {
                        const selected = (formData.type || 'apartment') === tOpt.id;
                        return (
                          <button
                            key={tOpt.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: tOpt.id as PropertyType })}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              selected
                                ? 'bg-[#B85D3B] text-white border-[#B85D3B] shadow-xs'
                                : isDark
                                ? 'bg-[#141312] border-[#2B2926] text-stone-300 hover:border-stone-700'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {tOpt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Essential Field 3: City & Country */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold">
                        {language === 'ka' ? 'ქალაქი' : 'City'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <span className="text-[11px] text-[#B85D3B] font-medium">
                        {language === 'ka' ? 'სავალდებულო' : 'Essential'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      {SUPPORTED_CITIES.map(cityOption => {
                        const isSelected = (formData.city || '').toLowerCase() === cityOption.toLowerCase();
                        return (
                          <button
                            key={cityOption}
                            type="button"
                            onClick={() => setFormData({ ...formData, city: cityOption })}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                              isSelected
                                ? isDark ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold' : 'bg-stone-900 text-white border-stone-900 font-semibold'
                                : isDark ? 'bg-[#141312] border-[#2B2926] text-stone-400 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            {cityOption}
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City (e.g. Tbilisi)"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                          isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                      <input
                        type="text"
                        value={formData.country || 'Georgia'}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Country (e.g. Georgia)"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                          isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Optional Fields: Street Address & Short Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold">
                          {language === 'ka' ? 'ქუჩის მისამართი' : 'Street Address'}
                        </label>
                        <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          {language === 'ka' ? 'არასავალდებულო' : 'Optional'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. 14 Lado Asatiani St, Apt 3"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold">
                          {language === 'ka' ? 'მოკლე აღწერა / ქვესათაური' : 'Welcome Tagline'}
                        </label>
                        <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          {language === 'ka' ? 'არასავალდებულო' : 'Optional'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g. Quiet balcony overlooking the courtyard"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Optional Cover Photo */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="text-xs font-bold block">
                          {language === 'ka' ? 'გარეკანის ფოტო' : 'Cover Photo'}
                        </label>
                        <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          {language === 'ka'
                            ? 'არასავალდებულო — შეგიძლიათ გამოტოვოთ და მოგვიანებით ატვირთოთ.'
                            : 'Optional — upload a welcoming photo now or skip and add later.'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCoverInputMode(coverInputMode === 'upload' ? 'url' : 'upload')}
                        className="text-[11px] font-semibold text-[#B85D3B] hover:underline cursor-pointer"
                      >
                        {coverInputMode === 'upload'
                          ? (language === 'ka' ? 'ან ჩასვით URL ბმული' : 'Or paste image URL')
                          : (language === 'ka' ? 'ფაილის ატვირთვა' : 'Upload file instead')}
                      </button>
                    </div>

                    {coverInputMode === 'upload' ? (
                      <div>
                        <input
                          ref={coverFileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCoverFileSelect(file);
                          }}
                        />
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingCover(true);
                          }}
                          onDragLeave={() => setIsDraggingCover(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingCover(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleCoverFileSelect(file);
                          }}
                          onClick={() => coverFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                            isDraggingCover
                              ? 'border-[#B85D3B] bg-[#B85D3B]/10'
                              : isDark
                              ? 'border-[#2B2926] bg-[#141312] hover:border-stone-700'
                              : 'border-stone-300 bg-stone-50/70 hover:border-stone-400'
                          }`}
                        >
                          {formData.coverImage ? (
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                              <img
                                src={formData.coverImage}
                                alt="Cover preview"
                                className="w-24 h-20 rounded-xl object-cover shrink-0 border border-white/20"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold block">
                                  {language === 'ka' ? 'გარეკანის ფოტო არჩეულია ✓' : 'Cover photo ready ✓'}
                                </span>
                                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                  {language === 'ka' ? 'დააწკაპუნეთ სხვა ფოტოთი შესაცვლელად' : 'Click to replace with another JPG, PNG, or WEBP'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData({ ...formData, coverImage: '' });
                                }}
                                className="px-2.5 py-1 rounded-lg text-[11px] border border-stone-300 dark:border-zinc-700 hover:bg-black/10"
                              >
                                {language === 'ka' ? 'წაშლა' : 'Remove'}
                              </button>
                            </div>
                          ) : (
                            <div className="py-2 flex flex-col items-center justify-center space-y-1.5">
                              <UploadCloud className="w-6 h-6 text-[#B85D3B]" />
                              <span className="text-xs font-semibold block">
                                {isUploadingMedia
                                  ? 'Uploading photo...'
                                  : (language === 'ka' ? 'ჩააგდეთ ფოტო აქ ან დააწკაპუნეთ ასარჩევად' : 'Drop a cover photo here, or click to browse')}
                              </span>
                              <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                JPG, PNG, WEBP · Optional
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData.coverImage || ''}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    )}

                    {/* Collapsible Room Photo Gallery */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setShowPhotoGalleryBuilder(!showPhotoGalleryBuilder)}
                        className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                          isDark ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-950'
                        }`}
                      >
                        {showPhotoGalleryBuilder ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>
                          {language === 'ka'
                            ? `დამატებითი ოთახების ფოტოები (${(formData.photos || []).length}) — სურვილისამებრ`
                            : `Add room-by-room photo gallery (${(formData.photos || []).length}) — Optional`}
                        </span>
                      </button>

                      {showPhotoGalleryBuilder && (
                        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-zinc-800">
                          <SmartPhotoBuilder
                            photos={formData.photos || []}
                            onChange={(updatedPhotos) => setFormData({ ...formData, photos: updatedPhotos })}
                            onCoverChange={(coverUrl) => setFormData({ ...formData, coverImage: coverUrl })}
                            onDraftGenerated={({ welcomeGreeting, arrivalDirections, suggestedAppliances }) => {
                              const formatted: ApplianceGuide[] = (suggestedAppliances || []).map((s, idx) => ({
                                id: `app-gen-${Date.now()}-${idx}`,
                                title: s.title || 'Appliance',
                                icon: s.icon || 'Thermometer',
                                category: s.category || 'climate',
                                instructions: s.instructions || 'Standard operating instructions.',
                                troubleshooting: s.troubleshooting
                              }));
                              setFormData(prev => ({
                                ...prev,
                                ...(welcomeGreeting ? { welcomeGreeting } : {}),
                                ...(arrivalDirections ? { arrivalDirections } : {}),
                                ...(formatted.length > 0 ? { appliances: [...(prev.appliances || []), ...formatted] } : {})
                              }));
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STAGE 2: ARRIVAL ESSENTIALS                               */}
            {/* ========================================================= */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block mb-1">
                    {language === 'ka' ? 'ეტაპი 2 / 5 · დახვედრა და Wi-Fi' : 'Stage 2 of 5 · Arrival Essentials'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'როგორ შემოვიდეს სტუმარი და ჩართოს Wi-Fi?' : 'How will guests check in and connect to Wi-Fi?'}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {language === 'ka'
                      ? 'ეს ყველაზე მნიშვნელოვანი ნაწილია სტუმრის პირველი 10 წუთისთვის.'
                      : 'Travelers look for door access and Wi-Fi in the first 30 seconds of opening your guide.'}
                  </p>
                </div>

                {/* 1. Check-in Method (Progressive Disclosure) */}
                <div className="space-y-3">
                  <label className="text-xs font-bold block">
                    {language === 'ka' ? 'შესვლის მეთოდი (Check-in Method)' : 'How do guests enter the property?'} <span className="text-[#F55A51]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'keypad', label: language === 'ka' ? 'კოდური საკეტი' : 'Smart Keypad', sub: 'PIN on door' },
                      { id: 'lockbox', label: language === 'ka' ? 'მინი-სეიფი' : 'Key Lockbox', sub: 'Keys in box' },
                      { id: 'in-person', label: language === 'ka' ? 'პირადად დახვედრა' : 'Meet in Person', sub: 'Host greets' },
                      { id: 'concierge', label: language === 'ka' ? 'კონსიერჟი / 24სთ' : '24h Reception', sub: 'Front desk' }
                    ].map(mOpt => {
                      const active = (formData.checkInMethod || 'keypad') === mOpt.id;
                      return (
                        <button
                          key={mOpt.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, checkInMethod: mOpt.id as Property['checkInMethod'] })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-[#B85D3B] text-white border-[#B85D3B] shadow-xs'
                              : isDark
                              ? 'bg-[#141312] border-[#2B2926] text-stone-300 hover:border-stone-700'
                              : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                          }`}
                        >
                          <span className="text-xs font-bold block">{mOpt.label}</span>
                          <span className={`text-[10px] block mt-0.5 ${active ? 'text-white/80' : 'text-stone-400'}`}>
                            {mOpt.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progressive Access Code Inputs based on selected Check-in Method */}
                <div className={`p-4 rounded-2xl border space-y-3.5 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  {(formData.checkInMethod === 'in-person' || formData.checkInMethod === 'concierge') ? (
                    <div className="space-y-3">
                      <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        {formData.checkInMethod === 'in-person'
                          ? (language === 'ka'
                              ? 'თქვენ პირადად ხვდებით სტუმარს. კარის კოდი სავალდებულო არ არის, მაგრამ სურვილისამებრ შეგიძლიათ მიუთითოთ სადარბაზოს კოდი.'
                              : 'You greet guests in person. A door code is not required, though you can optionally share a building gate code below.')
                          : (language === 'ka'
                              ? 'სტუმრებს ხვდება რეცეფცია/კონსიერჟი. კოდი არასავალდებულოა.'
                              : 'Guests check in at reception/concierge. Door PIN codes are optional.')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold block mb-1">
                            {language === 'ka' ? 'სადარბაზოს / ჭიშკრის კოდი (სურვილისამებრ)' : 'Building / Gate Code (Optional)'}
                          </label>
                          <input
                            type="text"
                            value={formData.doorKeypadCode || ''}
                            onChange={(e) => setFormData({ ...formData, doorKeypadCode: e.target.value })}
                            placeholder="e.g. 1234#"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                              isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1">
                            {language === 'ka' ? 'შესვლის დრო (Check-in Time)' : 'Check-in Time'}
                          </label>
                          <input
                            type="text"
                            value={formData.checkInTime || '3:00 PM'}
                            onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                              isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : formData.checkInMethod === 'lockbox' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold block mb-1">
                          {language === 'ka' ? 'სეიფის კოდი (Lockbox)' : 'Lockbox Code'} <span className="text-[#F55A51]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.lockboxCode || ''}
                          onChange={(e) => setFormData({ ...formData, lockboxCode: e.target.value })}
                          placeholder="e.g. 7419"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-bold ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-amber-400' : 'bg-white border-stone-300 text-[#B85D3B]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          {language === 'ka' ? 'სადარბაზოს კოდი (არასავალდებულო)' : 'Gate / Keypad Code (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={formData.doorKeypadCode || ''}
                          onChange={(e) => setFormData({ ...formData, doorKeypadCode: e.target.value })}
                          placeholder="e.g. 3820#"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          {language === 'ka' ? 'შესვლის დრო' : 'Check-in Time'}
                        </label>
                        <input
                          type="text"
                          value={formData.checkInTime || '3:00 PM'}
                          onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold block mb-1">
                          {language === 'ka' ? 'კარის / საკეტის კოდი' : 'Door Keypad Code'} <span className="text-[#F55A51]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.doorKeypadCode || ''}
                          onChange={(e) => setFormData({ ...formData, doorKeypadCode: e.target.value })}
                          placeholder="e.g. 4820#"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-bold ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-amber-400' : 'bg-white border-stone-300 text-[#B85D3B]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          {language === 'ka' ? 'სათადარიგო სეიფი (არასავალდებულო)' : 'Backup Lockbox (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={formData.lockboxCode || ''}
                          onChange={(e) => setFormData({ ...formData, lockboxCode: e.target.value })}
                          placeholder="e.g. 7419"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          {language === 'ka' ? 'შესვლის დრო' : 'Check-in Time'}
                        </label>
                        <input
                          type="text"
                          value={formData.checkInTime || '3:00 PM'}
                          onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step-by-step Arrival Directions */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold">
                        {language === 'ka' ? 'ნაბიჯ-ნაბიჯ მოსვლის ინსტრუქცია' : 'Step-by-Step Arrival Instructions'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <span className="text-[11px] text-[#B85D3B] font-medium">
                        {language === 'ka' ? 'სავალდებულო' : 'Essential'}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.arrivalDirections || ''}
                      onChange={(e) => setFormData({ ...formData, arrivalDirections: e.target.value })}
                      placeholder={language === 'ka'
                        ? 'მაგ. შეაღეთ ეზოს ხის კარი, აუყევით კიბეს მე-2 სართულზე, მარცხენა კარი...'
                        : 'e.g. Enter through the wooden courtyard gate, take the stairs to the 2nd floor, apartment door is on the left.'}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed focus:outline-none ${
                        isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Wi-Fi Credentials */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold">
                        {language === 'ka' ? '1-შეხებით Wi-Fi წვდომა' : '1-Tap Wi-Fi Credentials'} <span className="text-[#F55A51]">*</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-[#B85D3B] font-medium">
                      {language === 'ka' ? 'სავალდებულო' : 'Essential'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        {language === 'ka' ? 'Wi-Fi ქსელის სახელი (SSID)' : 'Wi-Fi Network Name (SSID)'}
                      </label>
                      <input
                        type="text"
                        value={formData.wifiNetwork || ''}
                        onChange={(e) => setFormData({ ...formData, wifiNetwork: e.target.value })}
                        placeholder="e.g. Sololaki_Guest_5G"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        {language === 'ka' ? 'Wi-Fi პაროლი' : 'Wi-Fi Password'}
                      </label>
                      <input
                        type="text"
                        value={formData.wifiPassword || ''}
                        onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                        placeholder="e.g. WelcomeHome2026"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-emerald-400' : 'bg-white border-stone-200 text-emerald-700'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Optional Parking Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-stone-400" />
                      <span>{language === 'ka' ? 'პარკინგის ინსტრუქცია' : 'Parking Details'}</span>
                    </label>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {language === 'ka' ? 'არასავალდებულო' : 'Optional'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.parkingInstructions || ''}
                    onChange={(e) => setFormData({ ...formData, parkingInstructions: e.target.value })}
                    placeholder="e.g. Free street parking along the avenue or courtyard space #4"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STAGE 3: MAKE THE STAY EASIER (APPLIANCES, RULES, CHECKOUT)*/}
            {/* ========================================================= */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block mb-1">
                    {language === 'ka' ? 'ეტაპი 3 / 5 · კომფორტი, წესები და გასვლა' : 'Stage 3 of 5 · Make the Stay Easier'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'ტექნიკა, სახლის წესები და გასვლა' : 'Appliances, house rules & checkout'}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {language === 'ka'
                      ? 'აირჩიეთ მზა ტექნიკის ინსტრუქციები 1 დაწკაპუნებით, დაამატეთ წესები ან გამოტოვეთ ეს ნაბიჯი.'
                      : 'Tap any appliance below to add ready-made instructions, customize your house rules, or skip for later.'}
                  </p>
                </div>

                {/* Section A: Appliance Guides (Optional, 1-Click Presets) */}
                <div className={`p-4 rounded-2xl border space-y-3.5 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold block">
                        {language === 'ka' ? 'ტექნიკის ინსტრუქციები (Visual How-Tos)' : 'Appliance & Comfort Instructions'}
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {language === 'ka' ? 'არასავალდებულო — დააჭირეთ სწრაფად დასამატებლად:' : 'Optional — click to toggle common appliances:'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={addBlankAppliance}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#B85D3B] text-white flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'ka' ? 'სხვა ტექნიკა' : 'Custom'}</span>
                    </button>
                  </div>

                  {/* Quick-Add Preset Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COMMON_APPLIANCE_PRESETS.map(preset => {
                      const isAdded = (formData.appliances || []).some(
                        a => a.title.toLowerCase() === preset.title.toLowerCase()
                      );
                      return (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() => toggleAppliancePreset(preset)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                              : isDark
                              ? 'bg-[#1A1917] border-[#2B2926] text-stone-300 hover:border-stone-700'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-60" />}
                          <span>{preset.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Added Appliances List */}
                  {(formData.appliances || []).length === 0 ? (
                    <div className={`p-4 rounded-xl border text-center text-xs ${
                      isDark ? 'bg-[#1A1917] border-[#2B2926] text-stone-400' : 'bg-white border-stone-200 text-stone-500'
                    }`}>
                      {language === 'ka'
                        ? 'ტექნიკა ჯერ არ არის არჩეული. აირჩიეთ ზემოთ მოცემული ღილაკებიდან ან გადადით შემდეგ ნაბიჯზე.'
                        : 'No appliances selected yet. Tap a preset above to add instructions, or skip if not needed.'}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {(formData.appliances || []).map((app, idx) => (
                        <div
                          key={app.id || idx}
                          className={`p-3.5 rounded-xl border space-y-2.5 ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926]' : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={app.title}
                              onChange={(e) => {
                                const updated = [...(formData.appliances || [])];
                                updated[idx] = { ...app, title: e.target.value };
                                setFormData({ ...formData, appliances: updated });
                              }}
                              className="font-bold text-xs bg-transparent border-b border-transparent focus:border-[#B85D3B] focus:outline-none flex-1"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  appliances: (formData.appliances || []).filter((_, i) => i !== idx)
                                })
                              }
                              className="p-1 rounded-lg text-stone-400 hover:text-rose-500 cursor-pointer"
                              title="Remove appliance"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={app.instructions}
                            onChange={(e) => {
                              const updated = [...(formData.appliances || [])];
                              updated[idx] = { ...app, instructions: e.target.value };
                              setFormData({ ...formData, appliances: updated });
                            }}
                            placeholder="Write short step-by-step instructions for guests..."
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                              isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-800'
                            }`}
                          />

                          {/* Optional Video / Photo Attachment */}
                          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                            {app.mediaUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewMediaApp(app)}
                                className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1.5 hover:underline cursor-pointer"
                              >
                                <Play className="w-3 h-3" />
                                <span>{app.mediaType === 'video' ? 'Video guide attached (Preview)' : 'Photo guide attached (Preview)'}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-stone-400">
                                {language === 'ka' ? 'ფოტო/ვიდეო გიდი არასავალდებულოა' : 'Photo or short video clip (Optional)'}
                              </span>
                            )}

                            <div className="flex items-center gap-1.5">
                              <label className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-200/80 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-1">
                                <UploadCloud className="w-3 h-3" />
                                <span>{app.mediaUrl ? 'Replace Media' : 'Upload Photo/Video'}</span>
                                <input
                                  type="file"
                                  accept="video/mp4,video/webm,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleApplianceMediaUpload(app.id, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section B: House Rules & Quiet Hours */}
                <div className={`p-4 rounded-2xl border space-y-3.5 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      {language === 'ka' ? 'სახლის წესები და სიჩუმის საათები' : 'House Rules & Quiet Hours'}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {language === 'ka' ? 'არასავალდებულო' : 'Optional'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        {language === 'ka' ? 'სიჩუმის საათები' : 'Quiet Hours'}
                      </label>
                      <input
                        type="text"
                        value={formData.quietHours || '11:00 PM – 8:00 AM'}
                        onChange={(e) => setFormData({ ...formData, quietHours: e.target.value })}
                        className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        {language === 'ka' ? 'გასვლის დრო (Check-out Time)' : 'Check-out Time'}
                      </label>
                      <input
                        type="text"
                        value={formData.checkOutTime || '11:00 AM'}
                        onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                        className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Quick Toggle Common Rules */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COMMON_HOUSE_RULE_PRESETS.map(rulePreset => {
                      const active = (formData.houseRules || []).includes(rulePreset);
                      return (
                        <button
                          key={rulePreset}
                          type="button"
                          onClick={() => {
                            const current = formData.houseRules || [];
                            setFormData({
                              ...formData,
                              houseRules: active
                                ? current.filter(r => r !== rulePreset)
                                : [...current, rulePreset]
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                              : isDark
                              ? 'bg-[#1A1917] border-[#2B2926] text-stone-400 hover:text-white'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {rulePreset}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Rule Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newRuleText.trim()) {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            houseRules: [...(formData.houseRules || []), newRuleText.trim()]
                          });
                          setNewRuleText('');
                        }
                      }}
                      placeholder={language === 'ka' ? 'დაამატეთ საკუთარი წესი...' : 'Add a custom house rule...'}
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRuleText.trim()) return;
                        setFormData({
                          ...formData,
                          houseRules: [...(formData.houseRules || []), newRuleText.trim()]
                        });
                        setNewRuleText('');
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 cursor-pointer"
                    >
                      {language === 'ka' ? 'დამატება' : 'Add'}
                    </button>
                  </div>
                </div>

                {/* Section C: Checkout & Trash */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      {language === 'ka' ? 'გასვლის სია და ნაგვის გატანა' : 'Checkout Checklist & Trash Disposal'}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {language === 'ka' ? 'არასავალდებულო' : 'Optional'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {(formData.departureChecklist || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              departureChecklist: (formData.departureChecklist || []).filter((_, i) => i !== idx)
                            })
                          }
                          className="text-stone-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      placeholder={language === 'ka' ? 'დაამატეთ გასვლის პუნქტი...' : 'Add checkout step (e.g. Leave keys on table)...'}
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newChecklistText.trim()) return;
                        setFormData({
                          ...formData,
                          departureChecklist: [...(formData.departureChecklist || []), newChecklistText.trim()]
                        });
                        setNewChecklistText('');
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 cursor-pointer"
                    >
                      {language === 'ka' ? 'დამატება' : 'Add'}
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      {language === 'ka' ? 'ნაგვის გატანის ინსტრუქცია (სურვილისამებრ)' : 'Trash & Recycling Note (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={formData.trashSchedule || ''}
                      onChange={(e) => setFormData({ ...formData, trashSchedule: e.target.value })}
                      placeholder="e.g. Green municipal bins are on the street corner to the right of the gate."
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STAGE 4: LOCAL RECOMMENDATIONS & HOST CONTACT             */}
            {/* ========================================================= */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block mb-1">
                    {language === 'ka' ? 'ეტაპი 4 / 5 · რჩევები და კონტაქტი' : 'Stage 4 of 5 · Local Recommendations & Contact'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold tracking-tight">
                    {language === 'ka' ? 'მასპინძლის კონტაქტი და ადგილობრივი რჩევები' : 'Host contact & neighborhood recommendations'}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {language === 'ka'
                      ? 'მიუთითეთ თქვენი WhatsApp ნომერი სტუმრებისთვის და სურვილისამებრ აირჩიეთ რჩეული კაფეები და ადგილები.'
                      : 'Add your contact details so guests can reach you, and optionally select curated neighborhood Gems.'}
                  </p>
                </div>

                {/* 1. Host Contact Details (Essential) */}
                <div className={`p-4 rounded-2xl border space-y-3.5 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#B85D3B]" />
                      <span className="text-xs font-bold">
                        {language === 'ka' ? 'მასპინძლის საკონტაქტო ინფორმაცია' : 'Host Contact Details'} <span className="text-[#F55A51]">*</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-[#B85D3B] font-medium">
                      {language === 'ka' ? 'სავალდებულო' : 'Essential'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        {language === 'ka' ? 'მასპინძლის სახელი' : 'Your Host Name'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.hostName || ''}
                        onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                        placeholder="e.g. Nino or Saba"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        {language === 'ka' ? 'WhatsApp ან ტელეფონის ნომერი' : 'WhatsApp / Phone Number'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.hostWhatsApp || formData.hostPhone || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hostWhatsApp: e.target.value,
                            hostPhone: e.target.value
                          })
                        }
                        placeholder="+995 555 123 456"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-semibold ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-emerald-400' : 'bg-white border-stone-200 text-emerald-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      {language === 'ka' ? 'დამატებითი / გადაუდებელი კონტაქტი (სურვილისამებრ)' : 'Backup / Co-Host Contact (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="e.g. Building manager or co-host phone number"
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Curated Stumari Gems Picker (Optional) */}
                <div className={`p-4 rounded-2xl border space-y-3.5 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block">
                        {language === 'ka' ? 'რჩეული ადგილები (Curated Stumari Gems)' : 'Curated Local Gems'}
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {language === 'ka'
                          ? 'არასავალდებულო — მონიშნეთ ადგილები, რომლებიც გამოჩნდება სტუმრის გზამკვლევში:'
                          : 'Optional — select curated restaurants, cafes, and sights to include in your guide:'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#B85D3B]">
                      {(formData.gemIds || []).length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {gems.slice(0, 8).map(gem => {
                      const isSelected = (formData.gemIds || []).includes(gem.id);
                      return (
                        <button
                          key={gem.id}
                          type="button"
                          onClick={() => toggleGemSelection(gem.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? isDark
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-zinc-100'
                                : 'bg-emerald-50 border-emerald-300 text-stone-900'
                              : isDark
                              ? 'bg-[#1A1917] border-[#2B2926] text-stone-300 hover:border-stone-700'
                              : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                          }`}
                        >
                          <img
                            src={gem.image}
                            alt={gem.title}
                            className="w-11 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold truncate">{gem.title}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            </div>
                            <span className={`text-[10px] truncate block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                              {gem.subCategory || gem.experience} · {gem.distance}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Neighborhood Spot Adder */}
                  <div className="pt-3 border-t border-stone-200/60 dark:border-zinc-800 space-y-2">
                    <span className="text-xs font-semibold block">
                      {language === 'ka' ? 'ან დაამატეთ თქვენი უბნის ფავორიტი ადგილი:' : 'Or add your own neighborhood spot (bakery, pharmacy, supermarket):'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newRecName}
                        onChange={(e) => setNewRecName(e.target.value)}
                        placeholder="Place name (e.g. Corner Bakery)"
                        className={`px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                      <select
                        value={newRecCategory}
                        onChange={(e) => setNewRecCategory(e.target.value as Recommendation['category'])}
                        className={`px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      >
                        <option value="coffee">Coffee & Bakery</option>
                        <option value="food">Restaurant & Dining</option>
                        <option value="groceries">Groceries & Pharmacy</option>
                        <option value="activity">Sightseeing & Culture</option>
                        <option value="nightlife">Wine Bar & Nightlife</option>
                      </select>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newRecTip}
                          onChange={(e) => setNewRecTip(e.target.value)}
                          placeholder="Host tip (e.g. Fresh bread at 9 AM)"
                          className={`flex-1 px-3 py-2 rounded-xl border text-xs ${
                            isDark ? 'bg-[#1A1917] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={addCustomRecommendation}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#B85D3B] text-white cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {(formData.recommendations || []).length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {(formData.recommendations || []).map((rec, idx) => (
                          <div
                            key={rec.id || idx}
                            className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs ${
                              isDark ? 'bg-[#1A1917] border-[#2B2926]' : 'bg-white border-stone-200'
                            }`}
                          >
                            <div>
                              <strong>{rec.name}</strong> · <span className="capitalize text-stone-400">{rec.category}</span>
                              {rec.hostTip && <span className="text-stone-400"> — "{rec.hostTip}"</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  recommendations: (formData.recommendations || []).filter((_, i) => i !== idx)
                                })
                              }
                              className="text-stone-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Progressive Transport Section (Optional) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTransportFields(!showTransportFields)}
                    className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      isDark ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    {showTransportFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>
                      {language === 'ka'
                        ? 'ტაქსის, მეტროს და აეროპორტის ინფორმაცია (სურვილისამებრ)'
                        : 'Customize taxi, public transit & airport transfer notes (Optional)'}
                    </span>
                  </button>

                  {showTransportFields && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">Taxi Apps</label>
                        <input
                          type="text"
                          value={formData.taxiInfo || ''}
                          onChange={(e) => setFormData({ ...formData, taxiInfo: e.target.value })}
                          placeholder="e.g. Use Bolt app for metered rides"
                          className={`w-full px-3 py-2 rounded-xl border text-xs ${
                            isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">Public Transit</label>
                        <input
                          type="text"
                          value={formData.transitInfo || ''}
                          onChange={(e) => setFormData({ ...formData, transitInfo: e.target.value })}
                          placeholder="e.g. Liberty Square Metro is 6 min walk"
                          className={`w-full px-3 py-2 rounded-xl border text-xs ${
                            isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">Airport Transfer</label>
                        <input
                          type="text"
                          value={formData.airportTransit || ''}
                          onChange={(e) => setFormData({ ...formData, airportTransit: e.target.value })}
                          placeholder="e.g. 25 mins from airport by taxi"
                          className={`w-full px-3 py-2 rounded-xl border text-xs ${
                            isDark ? 'bg-[#141312] border-[#2B2926] text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STAGE 5: PREVIEW AND PUBLISH                              */}
            {/* ========================================================= */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block mb-1">
                    {language === 'ka' ? 'ეტაპი 5 / 5 · გადახედვა და გამოქვეყნება' : 'Stage 5 of 5 · Preview & Publish'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold tracking-tight">
                    {readiness.canPublish
                      ? (language === 'ka' ? 'თქვენი გზამკვლევი მზადაა გამოსაქვეყნებლად!' : 'Your guest guide is ready to publish!')
                      : (language === 'ka' ? 'გადახედეთ გზამკვლევს გამოქვეყნებამდე' : 'Review your guest guide before publishing')}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {readiness.canPublish
                      ? (language === 'ka'
                          ? 'ყველა სავალდებულო ველი შევსებულია. გამოაქვეყნეთ ახლავე ან შეინახეთ მონახაზად.'
                          : 'All essential guest details are in place. Publish now to get your QR code & guest link, or save as a draft.')
                      : (language === 'ka'
                          ? 'გამოქვეყნებისთვის შეავსეთ ქვემოთ მონიშნული სავალდებულო პუნქტები, ან შეინახეთ მონახაზად.'
                          : 'Complete the highlighted essential items below to publish, or save your work as a draft now and finish later.')}
                  </p>
                </div>

                {/* Honest Readiness Score Summary Banner */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#FAF8F5] border-[#EBE6DF]'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg">
                        {formData.title?.trim() || (language === 'ka' ? 'უსათაურო ობიექტი' : 'Untitled Property')}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {formData.city || 'Tbilisi'}, {formData.country || 'Georgia'} · <span className="capitalize">{formData.type || 'apartment'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-mono font-bold tabular-nums ${
                        readiness.canPublish ? 'text-emerald-500' : 'text-[#B85D3B]'
                      }`}>
                        {readiness.readinessPct}% {language === 'ka' ? 'მზადაა' : 'Complete'}
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        {readiness.essentialCompletedCount}/{readiness.essentialTotalCount} Essentials · {readiness.optionalCompletedCount}/{readiness.optionalTotalCount} Optional
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        readiness.canPublish ? 'bg-emerald-500' : 'bg-[#B85D3B]'
                      }`}
                      style={{ width: `${readiness.readinessPct}%` }}
                    />
                  </div>
                </div>

                {/* Essential Requirements Checklist (Required to Publish) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {language === 'ka' ? 'სავალდებულო პუნქტები გამოქვეყნებისთვის' : 'Essential Requirements (Required to Publish)'}
                    </h4>
                    <span className="text-xs font-mono font-semibold">
                      {readiness.essentialCompletedCount} / {readiness.essentialTotalCount}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {readiness.essentialItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                          item.done
                            ? isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-white border-stone-200'
                            : isDark ? 'bg-amber-950/25 border-amber-500/40' : 'bg-amber-50/70 border-amber-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className={`text-[11px] block truncate ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                              {item.helper}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentStep(item.stage)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                            item.done
                              ? isDark ? 'text-stone-400 hover:text-white hover:bg-zinc-800' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                              : 'bg-[#B85D3B] text-white hover:bg-[#A35132]'
                          }`}
                        >
                          {item.done
                            ? (language === 'ka' ? 'შეცვლა' : 'Edit')
                            : (language === 'ka' ? `შევსება (ეტაპი ${item.stage})` : `Complete in Stage ${item.stage}`)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Enhancements Checklist (Never blocks Draft or Publish) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {language === 'ka' ? 'არასავალდებულო გაუმჯობესებები (შეგიძლიათ მოგვიანებით დაამატოთ)' : 'Optional Enhancements (Can be added anytime)'}
                    </h4>
                    <span className="text-xs font-mono text-stone-400">
                      {readiness.optionalCompletedCount} / {readiness.optionalTotalCount}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {readiness.optionalItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                          isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.done ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-stone-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block truncate">{item.label}</span>
                            <span className="text-[10px] text-stone-400 block truncate">{item.helper}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(item.stage)}
                          className="text-[11px] font-semibold text-[#B85D3B] hover:underline shrink-0 cursor-pointer"
                        >
                          {item.done ? 'Edit' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Consistent Footer Navigation: Back, Save Draft, Continue / Publish */}
            <div className={`mt-8 pt-5 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-[#2B2926]' : 'border-[#EBE6DF]'
            }`}>
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => {
                  setValidationMessage(null);
                  setCurrentStep(prev => Math.max(1, prev - 1));
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentStep === 1
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 cursor-pointer'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'ka' ? 'უკან' : 'Back'}</span>
              </button>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  disabled={isSavingDraft || isPublishing}
                  onClick={handleSaveDraft}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                      : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {isSavingDraft
                    ? (language === 'ka' ? 'ინახება...' : 'Saving Draft...')
                    : (language === 'ka' ? 'მონახაზად შენახვა' : 'Save Draft')}
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setValidationMessage(null);
                      setCurrentStep(prev => Math.min(5, prev + 1));
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#B85D3B] hover:bg-[#A35132] text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>{language === 'ka' ? 'გაგრძელება' : 'Continue'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isPublishing || isSavingDraft}
                    onClick={handlePublish}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                      readiness.canPublish
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-[#B85D3B] hover:bg-[#A35132] text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isPublishing
                        ? (language === 'ka' ? 'ქვეყნდება...' : 'Publishing...')
                        : (language === 'ka' ? 'გიდის გამოქვეყნება' : 'Publish Guest Guide')}
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (Desktop): Live Guest Guide Preview + Readiness Checklist */}
          <div className="hidden lg:block lg:col-span-5 space-y-5 sticky top-24">
            <div className={`p-5 rounded-[28px] border space-y-4 ${
              isDark ? 'bg-[#1A1917] border-[#2B2926]' : 'bg-white border-[#EBE6DF] shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">
                    {language === 'ka' ? 'სტუმრის ცოცხალი ხედი' : 'Live Guest Guide Preview'}
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {language === 'ka' ? 'ასახავს მხოლოდ მიმდინარე ობიექტს' : 'Reflects your current property in real time'}
                  </span>
                </div>
                <Smartphone className="w-4 h-4 text-[#B85D3B]" />
              </div>

              <OnboardingLiveGuestPreview
                formData={formData}
                gems={gems}
                isDark={isDark}
                language={language}
              />
            </div>

            {/* Readiness Progress Card */}
            <div className={`p-5 rounded-[28px] border space-y-3 ${
              isDark ? 'bg-[#1A1917] border-[#2B2926]' : 'bg-white border-[#EBE6DF] shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">
                  {language === 'ka' ? 'მზადყოფნის სტატუსი' : 'Guide Readiness'}
                </span>
                <span className="font-mono font-bold text-[#B85D3B]">
                  {readiness.readinessPct}%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    readiness.canPublish ? 'bg-emerald-500' : 'bg-[#B85D3B]'
                  }`}
                  style={{ width: `${readiness.readinessPct}%` }}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {readiness.essentialItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentStep(item.stage)}
                    className="w-full flex items-center justify-between text-left text-[11px] py-1 hover:opacity-80 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      {item.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className={item.done ? '' : 'font-medium'}>{item.label}</span>
                    </span>
                    <span className={`text-[10px] font-mono ${item.done ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {item.done ? 'Ready' : `Stage ${item.stage}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Floating Preview Action Button & Drawer (Prevents cramped side-by-side on mobile) */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setMobilePreviewOpen(true)}
            className="px-4 py-3 rounded-full bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-[#F55A51]" />
            <span>{language === 'ka' ? 'სტუმრის გიდის ნახვა' : 'Preview Guest Guide'}</span>
          </button>
        </div>

        {mobilePreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
            <div className={`w-full max-w-md rounded-[28px] border p-4 space-y-3 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#1A1917] border-[#2B2926] text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
                <span className="font-serif font-bold text-sm">
                  {language === 'ka' ? 'სტუმრის გიდის გადახედვა' : 'Live Guest Guide Preview'}
                </span>
                <button
                  type="button"
                  onClick={() => setMobilePreviewOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <OnboardingLiveGuestPreview
                formData={formData}
                gems={gems}
                isDark={isDark}
                language={language}
              />
            </div>
          </div>
        )}

        {/* Interactive Media Guide Preview Modal */}
        {previewMediaApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#14181C] border border-white/15 rounded-[28px] overflow-hidden text-white shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#F55A51]" />
                  <h3 className="font-bold text-sm sm:text-base">{previewMediaApp.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMediaApp(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-stone-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                {previewMediaApp.mediaType === 'video' ? (
                  <video
                    src={previewMediaApp.mediaUrl}
                    autoPlay
                    loop
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={previewMediaApp.mediaUrl}
                    alt={previewMediaApp.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="p-3 bg-stone-900/80 rounded-xl border border-white/10 text-xs space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Instructions</span>
                <p className="text-stone-200">{previewMediaApp.instructions}</p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewMediaApp(null)}
                className="w-full py-2.5 rounded-full bg-[#F55A51] hover:bg-[#e04a41] text-white font-bold text-xs cursor-pointer"
              >
                {language === 'ka' ? 'დახურვა' : 'Close Preview'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
