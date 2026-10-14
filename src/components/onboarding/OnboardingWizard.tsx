import React, { useState, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  KeyRound, 
  Wifi, 
  BookOpen, 
  Compass, 
  Phone, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Clock,
  Car,
  Coffee,
  AlertCircle,
  Shirt,
  Tv,
  Thermometer,
  Shield,
  Zap,
  HelpCircle,
  MessageCircle,
  UploadCloud,
  Film,
  Play,
  Pause,
  Video,
  Eye,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, ApplianceGuide } from '../../types';
import { StumariArchIcon } from '../common/StumariLogo';
import { ThemeAndLanguageControls } from '../common/LanguageSelector';
import { ONBOARDING_I18N } from '../../data/onboardingI18n';

export const OnboardingWizard: React.FC = () => {
  const { createProperty, navigateToPropertyHub, setCurrentRoute, theme, showToast, t, language } = useApp();
  const isDark = theme === 'dark';
  const obContent = ONBOARDING_I18N[language] || ONBOARDING_I18N.en;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [coverInputMode, setCoverInputMode] = useState<'upload' | 'url'>('upload');
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [previewMediaApp, setPreviewMediaApp] = useState<ApplianceGuide | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverFileSelect = (file: File) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast(language === 'ka' ? 'გთხოვთ ატვირთოთ JPG, PNG ან WEBP სურათი' : 'Please upload a JPG, PNG, or WEBP image');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, coverImage: result }));
        showToast(language === 'ka' ? 'მთავარი სურათი განახლდა!' : 'Property cover image updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplianceMediaUpload = (appId: string, file: File) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData(prev => ({
          ...prev,
          appliances: (prev.appliances || []).map(app => 
            app.id === appId ? { ...app, mediaUrl: result, mediaType: isVideo ? 'video' : 'photo' } : app
          )
        }));
        showToast(language === 'ka' ? 'ტექნიკის მედია გიდი აიტვირთა!' : 'Appliance media guide attached!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Property>>({
    title: language === 'ka' ? 'მზიანი სოლოლაკის ტერასა' : language === 'ru' ? 'Солнечная терраса в Сололаки' : 'Sunny Sololaki Terrace',
    subtitle: language === 'ka' ? 'მყუდრო აპარტამენტი ძველ თბილისში პანორამული აივნით' : language === 'ru' ? 'Уютные апартаменты в Старом городе с живописным балконом' : 'Charming Old Town apartment with scenic balcony',
    type: 'apartment',
    address: '8 Asatiani Street, Apt 4',
    city: 'Tbilisi',
    country: 'Georgia',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sourcePlatform: 'airbnb',
    sourceUrl: 'https://airbnb.com/rooms/example-listing',

    // Step 2 Arrival
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    checkInMethod: 'keypad',
    doorKeypadCode: '4820#',
    lockboxCode: '6192',
    parkingInstructions: 'Free street parking along the street or courtyard space behind building.',
    arrivalDirections: 'Push wooden courtyard gate, walk up iron staircase to 2nd floor, teal door on left.',

    // Step 3 Stay
    wifiNetwork: 'Stumari_Guest_5G',
    wifiPassword: 'WelcomeGuest2026',
    appliances: [
      { id: 'app-ob-1', title: 'Daikin AC & Heating', icon: 'Thermometer', instructions: 'Wall remote in hallway. Set to 22°C for optimal comfort.' },
      { id: 'app-ob-2', title: 'Coffee Machine', icon: 'Coffee', instructions: 'Complimentary beans in glass jar. Press power button and slide lever.' },
      { id: 'app-ob-3', title: 'Washing Machine', icon: 'Shirt', instructions: 'Pods under sink. Turn dial to Quick 30° cycle.' }
    ],

    // Step 4 Rules
    quietHours: '11:00 PM – 8:00 AM',
    trashSchedule: 'Municipal green bins on the corner. Daily pickup after 9 PM.',
    houseRules: [
      'No smoking inside (balcony is fine)',
      'Quiet hours from 11 PM to 8 AM',
      'Please take off shoes at the entryway'
    ],

    // Step 5 Explore & Transport
    recommendations: [
      { id: 'rec-ob-1', name: 'Luka Polare Coffee & Gelato', category: 'coffee', description: 'Best morning espresso and pistacchio gelato.', hostTip: 'Get an iced latte and sit outside.', address: '4 Asatiani St', distance: '2 min walk', mapsUrl: 'https://maps.google.com' },
      { id: 'rec-ob-2', name: 'Ezo Georgian Kitchen', category: 'food', description: 'Authentic organic dishes in an open courtyard.', hostTip: 'Order the Shkmeruli garlic chicken.', address: '16 Kikodze St', distance: '4 min walk', mapsUrl: 'https://maps.google.com' }
    ],
    taxiInfo: 'Download Bolt app for affordable and safe rides around the city.',
    transitInfo: 'Liberty Square Metro Station is a 10-minute stroll.',
    airportTransit: '25 minutes by taxi to Tbilisi International Airport (~35 GEL).',

    // Step 6 Contact
    hostName: 'Saba Beradze',
    hostRole: 'Host & Superhost',
    hostPhone: '+995 555 123 456',
    hostWhatsApp: '+995555123456',
    emergencyContact: '+995 555 987 654 (Nino / Co-host)',
    emergencyServicesNumber: '112'
  });

  const stepTitles = [
    t.onboarding.steps.step1,
    t.onboarding.steps.step2,
    t.onboarding.steps.step3,
    t.onboarding.steps.step4,
    t.propertyHub.guideSections.recommendations,
    t.guestGuide.bento.contact,
    t.propertyHub.tabs.preview
  ];

  // Presets to populate data with 1-click
  const handleApplyPreset = (presetName: 'tbilisi' | 'batumi' | 'kazbegi') => {
    if (presetName === 'tbilisi') {
      setFormData(prev => ({
        ...prev,
        title: language === 'ka' ? 'მზიანი სოლოლაკის ტერასა' : language === 'ru' ? 'Солнечная терраса в Сололаки' : 'Sunny Sololaki Terrace',
        subtitle: language === 'ka' ? 'მყუდრო აპარტამენტი ძველ თბილისში პანორამული აივნით' : language === 'ru' ? 'Уютные апартаменты в Старом городе с живописным балконом' : 'Charming Old Town apartment with scenic balcony',
        type: 'apartment',
        address: '8 Asatiani Street, Apt 4',
        city: 'Tbilisi',
        country: 'Georgia',
        coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        wifiNetwork: 'OldTbilisi_5G',
        wifiPassword: 'TbilisiHost2026',
        doorKeypadCode: '4820#'
      }));
      showToast(obContent.presets.loadedToast(obContent.presets.tbilisiTitle));
    } else if (presetName === 'batumi') {
      setFormData(prev => ({
        ...prev,
        title: language === 'ka' ? 'ბათუმის ბულვარის პენტჰაუსი' : language === 'ru' ? 'Пентхаус на бульваре Батуми' : 'Batumi Boulevard Sea Penthouse',
        subtitle: language === 'ka' ? 'თანამედროვე აპარტამენტი შავი ზღვის მზის ჩასვლის ტერასით' : language === 'ru' ? 'Современные апартаменты с террасой и видом на Черное море' : 'Modern waterfront apartment with Black Sea sunset terrace',
        type: 'apartment',
        address: '15 Rustaveli Ave, 18th Floor',
        city: 'Batumi',
        country: 'Georgia',
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        wifiNetwork: 'BatumiSunset_Fiber',
        wifiPassword: 'SeaBreeze2026',
        doorKeypadCode: '9182#'
      }));
      showToast(obContent.presets.loadedToast(obContent.presets.batumiTitle));
    } else {
      setFormData(prev => ({
        ...prev,
        title: language === 'ka' ? 'ყაზბეგის ალპური შალე' : language === 'ru' ? 'Альпийское шале в Казбеги' : 'Kazbegi Alpine Chalet',
        subtitle: language === 'ka' ? 'ხის მთის კოტეჯი მყინვარწვერის პანორამული ხედით' : language === 'ru' ? 'Уютный деревянный коттедж с видом на гору Казбек' : 'Timber mountain retreat with panoramic Mount Kazbek view',
        type: 'villa',
        address: 'Mountain Valley Way 12',
        city: 'Stepantsminda',
        country: 'Georgia',
        coverImage: 'https://images.unsplash.com/photo-1542314831-c6a4d27f8842?auto=format&fit=crop&w=1200&q=80',
        wifiNetwork: 'Kazbek_Starlink_WiFi',
        wifiPassword: 'MountPeak2026',
        doorKeypadCode: '3311#'
      }));
      showToast(obContent.presets.loadedToast(obContent.presets.kazbegiTitle));
    }
  };

  const handlePublish = () => {
    const created = createProperty(formData);
    showToast(`"${created.title}" ${t.common.saved || 'created'}`);
    navigateToPropertyHub(created.id, 'overview');
  };

  // Calculate readiness score
  const readinessChecklist = [
    { label: obContent.readiness.items.titleAddress, done: !!formData.title && !!formData.city },
    { label: obContent.readiness.items.coverPhoto, done: !!formData.coverImage },
    { label: obContent.readiness.items.doorCode, done: !!formData.doorKeypadCode },
    { label: obContent.readiness.items.wifi, done: !!formData.wifiPassword },
    { label: obContent.readiness.items.rules, done: (formData.houseRules || []).length > 0 },
    { label: obContent.readiness.items.recs, done: (formData.recommendations || []).length > 0 },
    { label: obContent.readiness.items.contact, done: !!formData.hostWhatsApp }
  ];
  const completedCount = readinessChecklist.filter(c => c.done).length;
  const readinessPct = Math.round((completedCount / readinessChecklist.length) * 100);

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAFAF8] text-zinc-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className={`p-6 sm:p-7 rounded-[32px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-[#15161C] border-zinc-800 text-zinc-100 shadow-xl' : 'bg-white border-zinc-200 text-zinc-900 shadow-xs'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
              isDark ? 'bg-stone-900 border-stone-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <StumariArchIcon size={22} className={isDark ? 'text-amber-400' : 'text-amber-700'} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {obContent.header.title}
                </h1>
                <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                  isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {obContent.header.stepCounter} {currentStep} / 7
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {obContent.header.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Stepper Progress Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(stepNum)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isCurrent
                        ? 'bg-amber-600 text-white shadow-sm'
                        : isCompleted
                        ? isDark 
                          ? 'bg-stone-800 text-stone-300 hover:text-white' 
                          : 'bg-stone-200 text-stone-700 hover:text-stone-950'
                        : isDark
                        ? 'text-stone-500 hover:text-stone-400'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent ? 'bg-black/20 text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-stone-700/40'
                    }`}>
                      {isCompleted ? <Check className="w-2.5 h-2.5" /> : stepNum}
                    </span>
                    <span>{title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet View Toggle: Form vs Live Phone Preview */}
        <div className={`flex lg:hidden items-center justify-center p-1 rounded-2xl border max-w-xs mx-auto mb-4 ${
          isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-100 border-stone-200'
        }`}>
          <button
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              mobileTab === 'form' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            {obContent.header.mobileForm} ({currentStep}/7)
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              mobileTab === 'preview' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            {obContent.header.mobilePreview}
          </button>
        </div>

        {/* Asymmetric Bento Workspace: Form Card + Preview & Presets Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form Bento Card (Span 7 cols) */}
          <div className={`lg:col-span-7 ${mobileTab === 'form' ? 'flex' : 'hidden lg:flex'} p-6 sm:p-8 rounded-[36px] border transition-all flex-col justify-between ${
            isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-2xl' : 'bg-white border-stone-200 text-stone-900 shadow-xl'
          }`}>
            
            {/* Step 1: Property Identity */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {obContent.step1.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step1.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step1.desc}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step1.titleLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' 
                          : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                      }`}
                      placeholder={obContent.step1.titlePlaceholder}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step1.subtitleLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' 
                          : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                      }`}
                      placeholder={obContent.step1.subtitlePlaceholder}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step1.typeLabel}
                      </label>
                      <select
                        value={formData.type || 'apartment'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500 focus:ring-amber-500/30' 
                            : 'bg-white border-stone-200 text-stone-900 focus:border-amber-600 focus:ring-amber-500/20'
                        }`}
                      >
                        <option value="apartment">{obContent.step1.types.apartment}</option>
                        <option value="guesthouse">{obContent.step1.types.guesthouse}</option>
                        <option value="hotel">{obContent.step1.types.hotel}</option>
                        <option value="villa">{obContent.step1.types.villa}</option>
                      </select>
                    </div>

                    <div>
                      <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step1.cityCountryLabel}
                      </label>
                      <input
                        type="text"
                        value={`${formData.city || ''}, ${formData.country || ''}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(',');
                          setFormData({ 
                            ...formData, 
                            city: parts[0]?.trim() || '', 
                            country: parts[1]?.trim() || '' 
                          });
                        }}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' 
                            : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                        }`}
                        placeholder={obContent.step1.cityCountryPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`font-bold block ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step1.coverPhotoLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setCoverInputMode(coverInputMode === 'upload' ? 'url' : 'upload')}
                        className="text-[11px] font-bold text-[#F55A51] hover:underline cursor-pointer"
                      >
                        {coverInputMode === 'upload' 
                          ? (language === 'ka' ? 'ან ჩასვით სურათის URL' : language === 'ru' ? 'Или вставить ссылку URL' : 'Or paste image URL') 
                          : (language === 'ka' ? 'ატვირთეთ ფაილი (Drag & Drop)' : language === 'ru' ? 'Загрузить файл' : 'Upload file instead')}
                      </button>
                    </div>

                    {coverInputMode === 'upload' ? (
                      <div>
                        {/* Hidden native input */}
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

                        {/* Interactive Drop Zone */}
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
                          className={`border-2 border-dashed rounded-[22px] p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                            isDraggingCover
                              ? 'border-[#F55A51] bg-[#F55A51]/10 scale-[1.01]'
                              : isDark
                              ? 'border-white/15 bg-[#12161A] hover:border-white/30 hover:bg-[#161B20]'
                              : 'border-stone-300 bg-stone-50/80 hover:border-stone-400 hover:bg-stone-100'
                          }`}
                        >
                          {formData.coverImage ? (
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                              <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                                <img
                                  src={formData.coverImage}
                                  alt="Selected cover preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <UploadCloud className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 text-center sm:text-left">
                                <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                  {language === 'ka' ? 'სურათი არჩეულია ✓' : 'Cover image active ✓'}
                                </span>
                                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                  {language === 'ka' ? 'დააწკაპუნეთ ან გადმოათრიეთ ახალი JPG, PNG, WEBP შესაცვლელად' : 'Click or drop a new JPG, PNG, or WEBP to replace'}
                                </p>
                                <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-[#F55A51] text-white">
                                  {language === 'ka' ? 'ფაილის შეცვლა' : 'Change Photo'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="py-3 flex flex-col items-center justify-center space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-[#F55A51]/15 text-[#F55A51] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <div>
                                <span className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                  {language === 'ka' ? 'ჩააგდეთ სურათი აქ ან დააწკაპუნეთ' : 'Drop photo here, or browse files'}
                                </span>
                                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                  {language === 'ka' ? 'მიიღება JPG, PNG, WEBP (ავტომატური ოპტიმიზაცია)' : 'Supports JPG, PNG, WEBP · Instant live simulator preview'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData.coverImage || ''}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-[#F55A51] focus:ring-[#F55A51]/20' 
                            : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-[#F55A51] focus:ring-[#F55A51]/20'
                        }`}
                        placeholder="https://images.unsplash.com/..."
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Arrival & Check-in */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {obContent.step2.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step2.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step2.desc}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step2.checkInLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.checkInTime || '3:00 PM'}
                        onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step2.checkOutLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.checkOutTime || '11:00 AM'}
                        onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <label className={`font-bold block ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
                      {obContent.step2.keypadCodeLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.doorKeypadCode || ''}
                      onChange={(e) => setFormData({ ...formData, doorKeypadCode: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-base font-mono font-bold tracking-widest ${
                        isDark ? 'bg-zinc-950 border-zinc-700 text-amber-400' : 'bg-white border-stone-300 text-amber-700'
                      }`}
                      placeholder={obContent.step2.keypadCodePlaceholder}
                    />
                    <span className={`text-[11px] block ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                      {obContent.step2.keypadTip}
                    </span>
                  </div>

                  <div>
                    <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step2.directionsLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.arrivalDirections || ''}
                      onChange={(e) => setFormData({ ...formData, arrivalDirections: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                      }`}
                      placeholder={obContent.step2.directionsPlaceholder}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Stay & Wi-Fi */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {obContent.step3.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step3.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step3.desc}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className={`p-4 rounded-2xl border space-y-3.5 ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div>
                      <label className={`font-bold block mb-1 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step3.wifiNameLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.wifiNetwork || ''}
                        onChange={(e) => setFormData({ ...formData, wifiNetwork: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold ${
                          isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-500' : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                        }`}
                        placeholder={obContent.step3.wifiNamePlaceholder}
                      />
                    </div>

                    <div>
                      <label className={`font-bold block mb-1 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step3.wifiPassLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.wifiPassword || ''}
                        onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-bold ${
                          isDark ? 'bg-zinc-950 border-zinc-700 text-emerald-400' : 'bg-white border-stone-300 text-emerald-700'
                        }`}
                        placeholder={obContent.step3.wifiPassPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`font-bold block ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step3.appliancesLabel}
                      </label>
                      <span className="text-[10px] font-mono text-[#F55A51] font-bold">
                        {language === 'ka' ? 'ვიდეო/ფოტო გიდების მხარდაჭერით (5-10 წმ)' : 'Supports 5-10s Video / Photo Guides'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(formData.appliances || []).map((app, idx) => (
                        <div 
                          key={app.id || idx} 
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-stone-900'}`}>{app.title}</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                  isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-stone-100 text-stone-700'
                                }`}>
                                  {obContent.step3.activeBadge}
                                </span>
                              </div>
                              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>{app.instructions}</p>
                            </div>
                          </div>

                          {/* Media Guide Attachment Zone */}
                          <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0">
                              {app.mediaUrl ? (
                                <div 
                                  onClick={() => setPreviewMediaApp(app)}
                                  className="flex items-center gap-2 group cursor-pointer"
                                >
                                  {/* Inline Mini-Preview Thumbnail with Play / Zoom Icon */}
                                  <div className="relative w-12 h-10 rounded-xl overflow-hidden shrink-0 bg-stone-950 border border-white/20 shadow-xs group-hover:scale-105 transition-transform">
                                    {app.mediaType === 'video' ? (
                                      <>
                                        <video
                                          src={app.mediaUrl}
                                          className="w-full h-full object-cover"
                                          muted
                                          playsInline
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          src={app.mediaUrl}
                                          alt={app.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                          <Eye className="w-3.5 h-3.5 text-white" />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="min-w-0 text-left">
                                    <span className="text-[11px] font-bold text-emerald-500 block truncate flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      {app.mediaType === 'video' 
                                        ? (language === 'ka' ? '10-წმ ვიდეო გიდი მიბმულია' : '10-sec video guide attached') 
                                        : (language === 'ka' ? 'ფოტო ინსტრუქცია მიბმულია' : 'Photo guide attached')}
                                    </span>
                                    <span className="text-[10px] text-stone-400 group-hover:underline">
                                      {language === 'ka' ? 'დააწკაპუნეთ საყურებლად' : 'Click to preview'}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                                  <Film className="w-3.5 h-3.5" />
                                  <span>{language === 'ka' ? 'მედია გიდი ჯერ არ არის' : 'No media guide attached'}</span>
                                </div>
                              )}
                            </div>

                            {/* Upload / Change Action */}
                            <div className="flex items-center gap-2">
                              <label className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#F55A51] hover:bg-[#e04a41] text-white cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-1.5">
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>{app.mediaUrl ? (language === 'ka' ? 'შეცვლა' : 'Change') : (language === 'ka' ? 'ვიდეო/ფოტო გიდი' : 'Upload Guide')}</span>
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

                              {!app.mediaUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      appliances: (prev.appliances || []).map(a => 
                                        a.id === app.id ? { ...a, mediaUrl: '/tbilisi-twilight.mp4', mediaType: 'video' } : a
                                      )
                                    }));
                                    showToast(language === 'ka' ? 'სანიმუშო 10-წამიანი ვიდეო მიება!' : 'Sample 10s video guide attached!');
                                  }}
                                  className={`px-2.5 py-1.5 rounded-full text-[10px] font-mono border transition-colors cursor-pointer ${
                                    isDark ? 'border-zinc-750 text-zinc-300 hover:bg-zinc-800' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                                  }`}
                                >
                                  {language === 'ka' ? 'სანიმუშო ვიდეო' : 'Sample Video'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: House Rules */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {obContent.step4.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step4.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step4.desc}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step4.quietHoursLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.quietHours || '11:00 PM – 8:00 AM'}
                      onChange={(e) => setFormData({ ...formData, quietHours: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step4.trashLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.trashSchedule || ''}
                      onChange={(e) => setFormData({ ...formData, trashSchedule: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`font-bold block mb-2 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step4.rulesListLabel}
                    </label>
                    <div className="space-y-2">
                      {(formData.houseRules || []).map((rule, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-stone-200 text-stone-800'
                        }`}>
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
                            ✓
                          </span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Explore & Recommendations */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {obContent.step5.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step5.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step5.desc}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {(formData.recommendations || []).map((rec, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#14191C] border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{rec.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold border ${
                          isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}>
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-xs mb-1.5">{rec.description}</p>
                      <div className={`p-2 rounded-xl text-[11px] ${
                        isDark ? 'bg-[#1C2327] text-stone-300' : 'bg-stone-50 text-stone-700 border border-stone-200/60'
                      }`}>
                        <strong>{obContent.step5.hostTipPrefix}</strong> {rec.hostTip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Contact */}
            {currentStep === 6 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {obContent.step6.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step6.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step6.desc}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step6.hostNameLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.hostName || ''}
                        onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                        {obContent.step6.whatsappLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.hostWhatsApp || ''}
                        onChange={(e) => setFormData({ ...formData, hostWhatsApp: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono font-semibold focus:outline-none focus:ring-2 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-emerald-400 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/30' : 'bg-white border-stone-200 text-emerald-700 placeholder:text-stone-400 focus:border-emerald-600 focus:ring-emerald-500/20'
                        }`}
                        placeholder={obContent.step6.whatsappPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`font-bold block mb-1.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {obContent.step6.emergencyLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/30' : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:ring-amber-500/20'
                      }`}
                      placeholder={obContent.step6.emergencyPlaceholder}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Ready to Launch */}
            {currentStep === 7 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 text-emerald-600 dark:text-emerald-400`}>
                    {obContent.step7.badge}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{obContent.step7.question}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {obContent.step7.desc}
                  </p>
                </div>

                <div className={`p-5 rounded-3xl border space-y-3.5 ${
                  isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">{formData.title}</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{formData.city}, {formData.country} · {formData.type}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                      {obContent.step7.configured100}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#1B2226] border-stone-700' : 'bg-white border-stone-200'}`}>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{obContent.step7.wifiLabel}</span>
                      <strong className="truncate block text-stone-900 dark:text-stone-100">{formData.wifiNetwork}</strong>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#1B2226] border-stone-700' : 'bg-white border-stone-200'}`}>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{obContent.step7.keypadLabel}</span>
                      <strong className="truncate block text-amber-700 dark:text-amber-400 font-mono font-bold">{formData.doorKeypadCode}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className={`mt-8 pt-6 border-t flex items-center justify-between ${
              isDark ? 'border-stone-800' : 'border-stone-200'
            }`}>
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentStep === 1 
                    ? 'opacity-30 cursor-not-allowed' 
                    : isDark 
                      ? 'bg-stone-900 hover:bg-stone-800 text-stone-300' 
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{obContent.buttons.back}</span>
              </button>

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 ${
                    isDark 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                      : 'bg-stone-950 hover:bg-stone-850 text-white'
                  }`}
                >
                  <span>{obContent.buttons.continue}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-7 py-2.5 rounded-full font-bold text-xs shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{obContent.buttons.finishAndLaunch}</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Bento Sidebar: Live Guest Mirror Card + Starter Presets Card (Span 5 cols) */}
          <div className={`lg:col-span-5 space-y-5 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            
            {/* Bento Card A: Real-Time Live Guest Guide Mirror */}
            <div className={`p-6 rounded-[36px] border transition-all ${
              isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
                  isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {obContent.mirror.liveGuestView}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {obContent.mirror.realtimeMirror}
                </span>
              </div>

              {/* Smartphone Card Frame */}
              <div className={`rounded-[28px] overflow-hidden border shadow-inner ${
                isDark ? 'bg-[#14191C] border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={formData.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  
                  {/* Top-Right Theme and Language Controls Pair on Mirror */}
                  <ThemeAndLanguageControls 
                    className="absolute top-2.5 right-2.5 z-10 scale-90 origin-top-right" 
                    themeButtonClassName="bg-black/60 hover:bg-black/80 border-white/20 text-stone-200"
                    languageSelectorClassName="[&>button]:bg-black/60 [&>button]:hover:bg-black/80 [&>button]:border-white/20 [&>button]:text-stone-200"
                  />

                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                      {formData.city || 'Tbilisi'}, {formData.country || 'Georgia'}
                    </span>
                    <h4 className="text-base font-serif font-bold text-white leading-tight">
                      {formData.title || 'Untitled Property'}
                    </h4>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs">
                  {/* Wi-Fi Pill */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-[#1C2327] border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-bold text-[11px] truncate">{formData.wifiNetwork || 'Wi-Fi Name'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{obContent.mirror.tapCopy}</span>
                  </div>

                  {/* Door Keypad Pill */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-[#1C2327] border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="font-bold text-[11px]">{obContent.mirror.doorCodeLabel}</span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">{formData.doorKeypadCode || '----'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card B: Quick 1-Click Starter Presets */}
            <div className={`p-6 rounded-[36px] border transition-all ${
              isDark ? 'bg-[#0C1013] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
                  isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {obContent.presets.badge}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              </div>

              <h4 className="text-sm font-serif font-bold mb-1 text-stone-900 dark:text-stone-100">
                {obContent.presets.title}
              </h4>
              <p className={`text-xs mb-3 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {obContent.presets.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('tbilisi')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isDark 
                      ? 'bg-[#282115] border-amber-500/30 text-amber-100 hover:border-amber-400' 
                      : 'bg-[#FDF0D5] border-[#F6E0B3] text-[#2C1F0D] hover:border-amber-400'
                  }`}
                >
                  <span className="text-[11px] font-bold block truncate">{obContent.presets.tbilisiTitle}</span>
                  <span className="text-[9px] opacity-75 block truncate">{obContent.presets.tbilisiSub}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('batumi')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isDark 
                      ? 'bg-[#182733] border-[#92B1C9]/30 text-stone-100 hover:border-[#92B1C9]' 
                      : 'bg-[#E3EDF4] border-[#C9DEED] text-[#0F2230] hover:border-[#92B1C9]'
                  }`}
                >
                  <span className="text-[11px] font-bold block truncate">{obContent.presets.batumiTitle}</span>
                  <span className="text-[9px] opacity-75 block truncate">{obContent.presets.batumiSub}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('kazbegi')}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isDark 
                      ? 'bg-[#1E2B1C] border-[#859768]/30 text-stone-100 hover:border-[#859768]' 
                      : 'bg-[#E5ECE0] border-[#CFDEC7] text-[#192A17] hover:border-[#859768]'
                  }`}
                >
                  <span className="text-[11px] font-bold block truncate">{obContent.presets.kazbegiTitle}</span>
                  <span className="text-[9px] opacity-75 block truncate">{obContent.presets.kazbegiSub}</span>
                </button>
              </div>
            </div>

            {/* Bento Card C: Guidebook Readiness Meter */}
            <div className={`p-6 rounded-[36px] border transition-all ${
              isDark ? 'bg-[#14191C] border-stone-800 text-stone-100 shadow-xl' : 'bg-white border-stone-200 text-stone-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
                  readinessPct === 100 
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                    : isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {obContent.readiness.scoreLabel}: {readinessPct}%
                </span>
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">{completedCount}/7 {obContent.readiness.checksLabel}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden mb-3">
                <div 
                  className="h-full bg-amber-600 transition-all duration-500" 
                  style={{ width: `${readinessPct}%` }}
                />
              </div>

              <div className="space-y-1.5 text-xs">
                {readinessChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className={item.done ? 'text-stone-300' : 'text-stone-500'}>{item.label}</span>
                    <span className={item.done ? 'text-emerald-400 font-bold' : 'text-stone-600'}>
                      {item.done ? obContent.readiness.doneLabel : obContent.readiness.pendingLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

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
