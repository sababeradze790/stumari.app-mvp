import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Wifi, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  X, 
  Smartphone, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
  FileText,
  Phone,
  Car
} from 'lucide-react';
import { Property, PropertyType, ApplianceGuide } from '../../types';
import { SmartPhotoBuilder } from '../host/SmartPhotoBuilder';
import { VisualHowToManager } from '../host/VisualHowToManager';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from '../common/StumariLogo';
import {
  ONBOARDING_DRAFT_STORAGE_KEY,
  getInitialBlankOnboardingDraft,
  evaluateOnboardingReadiness,
  OnboardingLiveGuestPreview,
  SUPPORTED_CITIES,
  COMMON_HOUSE_RULE_PRESETS
} from './OnboardingWizard';

interface GuidedOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (property: Property) => void;
}

export const GuidedOnboardingModal: React.FC<GuidedOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleted
}) => {
  const { 
    createProperty, 
    templates, 
    gems,
    navigateToPropertyHub,
    setCurrentRoute,
    showToast, 
    theme, 
    language,
    firebaseUser,
    currentUser
  } = useApp();

  const isDark = theme === 'dark';

  const defaultHostName = (
    firebaseUser?.displayName ||
    (currentUser?.id && currentUser.id !== 'host-user-1' ? currentUser.name : '') ||
    ''
  ).trim();

  const [step, setStep] = useState<number>(1);
  const [showLivePhone, setShowLivePhone] = useState<boolean>(true);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [confirmSampleLoad, setConfirmSampleLoad] = useState<boolean>(false);
  const [newRuleText, setNewRuleText] = useState<string>('');

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

  // Sync draft with sessionStorage when modal opens or formData updates
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = sessionStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData(prev => ({
            ...prev,
            ...parsed,
            hostName: parsed.hostName || prev.hostName || defaultHostName
          }));
        }
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      sessionStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  useEffect(() => {
    if (defaultHostName && !formData.hostName?.trim()) {
      setFormData(prev => ({ ...prev, hostName: defaultHostName }));
    }
  }, [defaultHostName]);

  const readiness = evaluateOnboardingReadiness(formData, language);

  const hasCustomInput = Boolean(
    formData.title?.trim() ||
    formData.subtitle?.trim() ||
    formData.address?.trim() ||
    formData.wifiNetwork?.trim() ||
    formData.doorKeypadCode?.trim() ||
    formData.arrivalDirections?.trim()
  );

  const applySampleDemoData = () => {
    setFormData(prev => ({
      ...prev,
      title: language === 'ka' ? 'მზიანი სოლოლაკის რეზიდენცია (Sample)' : 'Sunny Sololaki Historic Residence (Sample)',
      subtitle: language === 'ka' ? 'მყუდრო ბინა ძველ თბილისში პანორამული ხედით' : 'Boutique residence with courtyard balcony & high ceilings',
      type: 'apartment',
      address: '14 Lado Asatiani Street, Apt 3',
      city: 'Tbilisi',
      country: 'Georgia',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      photos: [],
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      checkInMethod: 'keypad',
      doorKeypadCode: '3829#',
      lockboxCode: '7419',
      parkingInstructions: 'Free street parking along Lado Asatiani St or courtyard space.',
      arrivalDirections: 'Push wooden courtyard gate, walk up iron staircase to 2nd floor, teal door on left.',
      wifiNetwork: 'OldTbilisi_Guest_5G',
      wifiPassword: 'WelcomeHome2026!',
      hostName: prev.hostName || defaultHostName || 'Host',
      hostWhatsApp: prev.hostWhatsApp || '+995 555 123 456',
      hostPhone: prev.hostPhone || '+995 555 123 456',
      appliances: [
        {
          id: 'app-ob-1',
          title: 'Climate Control (AC & Heat)',
          icon: 'Thermometer',
          category: 'climate',
          instructions: 'Hallway remote controls heating & cooling. Set to 22°C (72°F) for comfort.',
          troubleshooting: 'Ensure balcony French doors are closed; unit pauses if doors stay open.',
          mediaUrl: '/tbilisi-twilight.mp4',
          mediaType: 'video',
          videoDurationSeconds: 15
        },
        {
          id: 'app-ob-2',
          title: 'DeLonghi Espresso Machine',
          icon: 'Coffee',
          category: 'kitchen',
          instructions: 'Fresh coffee beans in glass jar. Turn on power, wait for green light, and press brew.',
          troubleshooting: 'Refill rear water tank with Brita filtered water.'
        }
      ],
      gemIds: gems.slice(0, 3).map(g => g.id)
    }));
    setConfirmSampleLoad(false);
    setPublishError(null);
    showToast(
      language === 'ka'
        ? 'სანიმუშო დემო მონაცემები ჩაიტვირთა ფორმაში'
        : 'Sample demo data loaded into form'
    );
  };

  const handleApplyTemplate = (tmplId: string) => {
    const tmpl = templates.find(t => t.id === tmplId);
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
      setStep(1);
      const msg =
        language === 'ka'
          ? 'მონახაზის შესანახად გთხოვთ მიუთითოთ ობიექტის სახელი 1-ელ ნაბიჯზე.'
          : 'Please enter a Property Name in Stage 1 to save a draft.';
      setPublishError(msg);
      showToast(msg, 'info');
      return;
    }

    setIsSavingDraft(true);
    setPublishError(null);
    try {
      const created = await createProperty({ ...formData, status: 'draft' });
      sessionStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
      setStep(1);
      setFormData(getInitialBlankOnboardingDraft(defaultHostName));
      if (onCompleted) {
        onCompleted(created);
      } else {
        onClose();
        navigateToPropertyHub(created.id, 'overview');
      }
    } catch (err: any) {
      console.error('Failed to save draft:', err);
      setPublishError(err?.message || 'Could not save draft.');
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
          ? `გამოქვეყნებამდე შეავსეთ სავალდებულო პუნქტები: ${missingLabels}. (ან შეინახეთ მონახაზად)`
          : `Before publishing, please complete the essential items: ${missingLabels}. You can also Save Draft anytime.`;
      setPublishError(msg);
      if (firstMissing && step !== 5) {
        setStep(firstMissing.stage);
      } else if (step !== 5) {
        setStep(5);
      }
      showToast(msg, 'info');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    try {
      const created = await createProperty({ ...formData, status: 'published' });
      sessionStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
      setStep(1);
      setFormData(getInitialBlankOnboardingDraft(defaultHostName));
      if (onCompleted) {
        onCompleted(created);
      } else {
        onClose();
        navigateToPropertyHub(created.id, 'overview');
      }
    } catch (err: any) {
      console.error('Failed to create and save property:', err);
      const errorMsg = err?.message || 'Database write failed. Please check connection and permissions.';
      setPublishError(errorMsg);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        className={`w-full max-w-6xl my-auto rounded-[28px] border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FAFAF8] border-[#EBE6DF] text-[#1C1B1A]'
        }`}
      >
        {/* Top Header Bar */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
          isDark ? 'border-[#2B2926] bg-[#1F1E1C]' : 'border-[#EBE6DF] bg-white'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              isDark ? 'bg-amber-950/40 border-amber-900/60 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <StumariArchIcon size={20} className={isDark ? 'text-amber-400' : 'text-amber-800'} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif font-bold text-base sm:text-lg leading-tight truncate">
                  {language === 'ka' ? 'ახალი სტუმრის გიდის შექმნა' : 'Guided Property Setup'}
                </h2>
                <span className="text-xs font-mono text-stone-400">
                  · Stage {step} of 5
                </span>
              </div>
              <p className={`text-xs truncate ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                {language === 'ka'
                  ? 'შეავსეთ სავალდებულო ველები ან შეინახეთ მონახაზად.'
                  : 'Complete the essentials at your own pace or save as a draft anytime.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Switch to Full-Page 5-Stage Wizard */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setCurrentRoute('/onboarding');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-zinc-850 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
              title="Open the full-page 5-stage Onboarding Workspace"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B85D3B]" />
              <span className="hidden sm:inline">
                {language === 'ka' ? 'სრულ ეკრანზე გახსნა' : 'Full-Screen Wizard'}
              </span>
              <span className="sm:hidden">Full View</span>
            </button>

            {/* Honest Progress Indicator */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-20 h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    readiness.canPublish ? 'bg-emerald-500' : 'bg-[#B85D3B]'
                  }`}
                  style={{ width: `${readiness.readinessPct}%` }}
                />
              </div>
              <span className="text-xs font-mono font-medium tabular-nums text-stone-500">
                {readiness.readinessPct}%
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-600 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Stage Navigation Strip */}
        <div className={`px-5 py-2.5 border-b flex items-center justify-between text-xs overflow-x-auto no-scrollbar ${
          isDark ? 'border-[#2B2926] bg-[#141312]' : 'border-[#EBE6DF] bg-[#F5F2EB]'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { num: 1, label: language === 'ka' ? '1. ძირითადი' : '1. Property Basics' },
              { num: 2, label: language === 'ka' ? '2. შესვლა & Wi-Fi' : '2. Arrival Essentials' },
              { num: 3, label: language === 'ka' ? '3. კომფორტი & წესები' : '3. Stay & Rules' },
              { num: 4, label: language === 'ka' ? '4. რჩევები & კონტაქტი' : '4. Gems & Contact' },
              { num: 5, label: language === 'ka' ? '5. გადახედვა & გაშვება' : '5. Preview & Publish' }
            ].map(s => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  setPublishError(null);
                  setStep(s.num);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  step === s.num
                    ? 'bg-[#B85D3B] text-white font-semibold shadow-2xs'
                    : step > s.num
                    ? isDark ? 'text-emerald-400 hover:text-zinc-200' : 'text-emerald-700 hover:text-stone-900'
                    : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {step > s.num && <Check className="w-3 h-3" />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(true)}
              className="lg:hidden flex items-center gap-1 text-[#B85D3B] font-semibold text-xs cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLivePhone(!showLivePhone)}
              className="hidden lg:flex items-center gap-1.5 text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs font-medium cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#B85D3B]" />
              <span>{showLivePhone ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
          </div>
        </div>

        {/* Main Body: Split Screen on Desktop (Form Left, Live Preview Right) */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Form Viewport */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">

            {/* STAGE 1: PROPERTY BASICS */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Real Property vs Optional Sample Demo Data */}
                <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-amber-50/50 border-amber-200/70'
                }`}>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#B85D3B]" />
                      <span>
                        {language === 'ka' ? 'ახალი რეალური ობიექტის შექმნა' : 'Stage 1: Property Basics'}
                      </span>
                    </span>
                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
                      {language === 'ka'
                        ? 'შეიყვანეთ თქვენი ბინის მონაცემები ქვემოთ, ან ჩატვირთეთ სანიმუშო მონაცემები სატესტოდ.'
                        : 'Enter your property name, type, and city below, or test with sample demo data.'}
                    </p>
                  </div>

                  {!confirmSampleLoad ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (hasCustomInput) {
                          setConfirmSampleLoad(true);
                        } else {
                          applySampleDemoData();
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border shrink-0 transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-750'
                          : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      {language === 'ka' ? 'სანიმუშო დემო მონაცემები' : 'Fill Sample Demo Data'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-amber-500 font-medium">
                        {language === 'ka' ? 'ჩანაცვლდეს შეყვანილი ტექსტი?' : 'Replace current input?'}
                      </span>
                      <button
                        type="button"
                        onClick={applySampleDemoData}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer"
                      >
                        {language === 'ka' ? 'დიახ' : 'Replace'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmSampleLoad(false)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Reusable Template Quick Loader */}
                {templates.length > 0 && (
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#B85D3B]" />
                      <span>{language === 'ka' ? 'მზა შაბლონის გამოყენება (სურვილისამებრ)' : 'Apply Reusable Template for Rules & Appliances (Optional)'}</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {templates.slice(0, 3).map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleApplyTemplate(tmpl.id)}
                          className={`p-2.5 text-left rounded-xl border transition-all text-xs cursor-pointer ${
                            isDark 
                              ? 'bg-zinc-850 border-zinc-700 hover:border-amber-500/50' 
                              : 'bg-white border-stone-200 hover:border-amber-600/50'
                          }`}
                        >
                          <div className="font-semibold text-stone-900 dark:text-zinc-100 truncate">{tmpl.name}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{tmpl.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold">
                        {language === 'ka' ? 'ბინის სახელი' : 'Property Name'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <span className="text-[11px] text-[#B85D3B] font-medium">Essential</span>
                    </div>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Sunny Sololaki Historic Residence"
                      className={`w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">
                        {language === 'ka' ? 'ტიპი' : 'Property Type'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <select
                        value={formData.type || 'apartment'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                        className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      >
                        <option value="apartment">Apartment</option>
                        <option value="guesthouse">Guesthouse</option>
                        <option value="villa">Villa / Chalet</option>
                        <option value="hotel">Boutique Hotel</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">
                        {language === 'ka' ? 'ქალაქი' : 'City'} <span className="text-[#F55A51]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Tbilisi"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Quick City Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SUPPORTED_CITIES.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, city: c })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                          (formData.city || '').toLowerCase() === c.toLowerCase()
                            ? isDark ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold' : 'bg-stone-900 text-white border-stone-900 font-semibold'
                            : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold">
                          {language === 'ka' ? 'ზუსტი მისამართი' : 'Street Address'}
                        </label>
                        <span className="text-[10px] text-stone-400">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. 14 Lado Asatiani Street, Apt 3"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold">
                          {language === 'ka' ? 'მოკლე ქვესათაური' : 'Subtitle / Tagline'}
                        </label>
                        <span className="text-[10px] text-stone-400">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g. Charming Old Town apartment"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Smart Photo Builder (Optional) */}
                  <div className="pt-2 border-t border-stone-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">
                        {language === 'ka' ? 'გარეკანის ფოტო და გალერეა (სურვილისამებრ)' : 'Cover Photo & Room Gallery (Optional)'}
                      </span>
                      <span className="text-[10px] text-stone-400">Can be added anytime</span>
                    </div>
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
                </div>
              </div>
            )}

            {/* STAGE 2: ARRIVAL ESSENTIALS */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block">
                    Stage 2 of 5 · Arrival Essentials
                  </span>
                  <h3 className="text-lg font-serif font-bold">
                    {language === 'ka' ? 'შესვლის მეთოდი, მარშრუტი და Wi-Fi' : 'Check-in method, directions & Wi-Fi'}
                  </h3>
                </div>

                {/* Check-in Method */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'keypad', label: 'Smart Keypad' },
                    { id: 'lockbox', label: 'Key Lockbox' },
                    { id: 'in-person', label: 'Meet in Person' },
                    { id: 'concierge', label: '24h Reception' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, checkInMethod: m.id as Property['checkInMethod'] })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        (formData.checkInMethod || 'keypad') === m.id
                          ? 'bg-[#B85D3B] text-white border-[#B85D3B]'
                          : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      {formData.checkInMethod === 'in-person' || formData.checkInMethod === 'concierge'
                        ? 'Building / Gate Code (Optional)'
                        : 'Door / Keypad Code *'}
                    </label>
                    <input
                      type="text"
                      value={formData.doorKeypadCode || ''}
                      onChange={(e) => setFormData({ ...formData, doorKeypadCode: e.target.value })}
                      placeholder="e.g. 3829#"
                      className={`w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      {formData.checkInMethod === 'lockbox' ? 'Lockbox Code *' : 'Lockbox Code (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={formData.lockboxCode || ''}
                      onChange={(e) => setFormData({ ...formData, lockboxCode: e.target.value })}
                      placeholder="7419"
                      className={`w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Check-in Time</label>
                    <input
                      type="text"
                      value={formData.checkInTime || '3:00 PM'}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold">
                      {language === 'ka' ? 'მოსვლის & შესვლის ინსტრუქცია' : 'Step-by-step Arrival Directions'} <span className="text-[#F55A51]">*</span>
                    </label>
                    <span className="text-[11px] text-[#B85D3B] font-medium">Essential</span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.arrivalDirections || ''}
                    onChange={(e) => setFormData({ ...formData, arrivalDirections: e.target.value })}
                    placeholder="Push wooden courtyard gate, walk up iron staircase to 2nd floor, teal door on left..."
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none leading-relaxed ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      {language === 'ka' ? 'Wi-Fi ქსელის სახელი' : 'Wi-Fi Network Name (SSID)'} <span className="text-[#F55A51]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.wifiNetwork || ''}
                      onChange={(e) => setFormData({ ...formData, wifiNetwork: e.target.value })}
                      placeholder="OldTbilisi_5G"
                      className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      {language === 'ka' ? 'Wi-Fi პაროლი' : 'Wi-Fi Password'} <span className="text-[#F55A51]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.wifiPassword || ''}
                      onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                      placeholder="WelcomeGuest2026!"
                      className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-stone-400" />
                      <span>Parking Instructions</span>
                    </label>
                    <span className="text-[10px] text-stone-400">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={formData.parkingInstructions || ''}
                    onChange={(e) => setFormData({ ...formData, parkingInstructions: e.target.value })}
                    placeholder="e.g. Free street parking along the avenue"
                    className={`w-full text-xs px-3.5 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* STAGE 3: MAKE THE STAY EASIER (APPLIANCES, RULES, CHECKOUT) */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block">
                    Stage 3 of 5 · Stay & Rules (Optional)
                  </span>
                  <h3 className="text-lg font-serif font-bold">
                    {language === 'ka' ? 'ტექნიკა, სახლის წესები და გასვლა' : 'Appliance instructions, house rules & checkout'}
                  </h3>
                </div>

                <VisualHowToManager
                  appliances={formData.appliances || []}
                  onChange={(updatedApps) => setFormData({ ...formData, appliances: updatedApps })}
                  allowLibraryPresets={true}
                />

                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Quiet Hours</label>
                      <input
                        type="text"
                        value={formData.quietHours || '11:00 PM – 8:00 AM'}
                        onChange={(e) => setFormData({ ...formData, quietHours: e.target.value })}
                        className={`w-full text-xs px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Check-out Time</label>
                      <input
                        type="text"
                        value={formData.checkOutTime || '11:00 AM'}
                        onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                        className={`w-full text-xs px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200'
                        }`}
                      />
                    </div>
                  </div>

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
                              houseRules: active ? current.filter(r => r !== rulePreset) : [...current, rulePreset]
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                              : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-stone-200 text-stone-600'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {rulePreset}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      placeholder="Add a custom house rule..."
                      className={`flex-1 text-xs px-3 py-2 rounded-xl border ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200'
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
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#B85D3B] text-white cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: LOCAL RECOMMENDATIONS & HOST CONTACT */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block">
                    Stage 4 of 5 · Local Recommendations & Host Contact
                  </span>
                  <h3 className="text-lg font-serif font-bold">
                    {language === 'ka' ? 'მასპინძლის კონტაქტი და რჩეული ადგილები' : 'Host contact & curated neighborhood Gems'}
                  </h3>
                </div>

                {/* Host Contact (Essential) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B85D3B]" />
                      <span>Host Contact Details *</span>
                    </span>
                    <span className="text-[11px] text-[#B85D3B] font-medium">Essential</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Host Name *</label>
                      <input
                        type="text"
                        value={formData.hostName || ''}
                        onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                        placeholder="e.g. Saba"
                        className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">WhatsApp / Phone Number *</label>
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
                        className={`w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border ${
                          isDark ? 'bg-zinc-900 border-zinc-700 text-emerald-400' : 'bg-white border-stone-200 text-emerald-700'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Curated Gems Selection (Optional) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Curated Local Gems (Optional)</span>
                    <span className="text-xs font-mono text-[#B85D3B]">
                      {(formData.gemIds || []).length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                    {gems.slice(0, 6).map(gem => {
                      const selected = (formData.gemIds || []).includes(gem.id);
                      return (
                        <button
                          key={gem.id}
                          type="button"
                          onClick={() => {
                            const current = formData.gemIds || [];
                            setFormData({
                              ...formData,
                              gemIds: selected ? current.filter(id => id !== gem.id) : [...current, gem.id]
                            });
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            selected
                              ? isDark ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
                              : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                          }`}
                        >
                          <img src={gem.image} alt={gem.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold block truncate">{gem.title}</span>
                            <span className="text-[10px] text-stone-400 block truncate">{gem.distance}</span>
                          </div>
                          {selected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 5: PREVIEW & PUBLISH */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#B85D3B] font-semibold block">
                    Stage 5 of 5 · Preview & Publish
                  </span>
                  <h3 className="text-lg font-serif font-bold">
                    {readiness.canPublish
                      ? (language === 'ka' ? 'გიდი მზადაა გამოსაქვეყნებლად!' : 'Ready to publish your guest guide!')
                      : (language === 'ka' ? 'შეამოწმეთ მზადყოფნა გამოქვეყნებამდე' : 'Review readiness before publishing')}
                  </h3>
                </div>

                {/* Essential Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                    Essential Requirements ({readiness.essentialCompletedCount}/{readiness.essentialTotalCount})
                  </span>
                  {readiness.essentialItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                        item.done
                          ? isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                          : isDark ? 'bg-amber-950/30 border-amber-500/40' : 'bg-amber-50 border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold block">{item.label}</span>
                          <span className="text-[11px] text-stone-400 block truncate">{item.helper}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(item.stage)}
                        className="px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-[#B85D3B]/15 text-[#B85D3B] hover:bg-[#B85D3B] hover:text-white transition-colors shrink-0 cursor-pointer"
                      >
                        {item.done ? 'Edit' : `Go to Stage ${item.stage}`}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Optional Enhancements */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                    Optional Enhancements ({readiness.optionalCompletedCount}/{readiness.optionalTotalCount})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {readiness.optionalItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-stone-200'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <button
                          type="button"
                          onClick={() => setStep(item.stage)}
                          className="text-[11px] font-semibold text-[#B85D3B] hover:underline shrink-0 cursor-pointer"
                        >
                          {item.done ? 'Done ✓' : `Add`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Live Guest Preview (Desktop only; Mobile uses accessible Preview drawer) */}
          {showLivePhone && (
            <div className={`hidden lg:flex w-[370px] p-5 border-l flex-col justify-between shrink-0 overflow-y-auto ${
              isDark ? 'bg-[#121110] border-[#2B2926]' : 'bg-[#F2EEE9] border-[#EBE6DF]'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Live Guest Preview</span>
                  <span className="text-[11px] font-mono text-stone-400">Current draft</span>
                </div>
                <OnboardingLiveGuestPreview
                  formData={formData}
                  gems={gems}
                  isDark={isDark}
                  language={language}
                  compact={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Preview Drawer */}
        {mobilePreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/75 backdrop-blur-xs lg:hidden">
            <div className={`w-full max-w-md rounded-[28px] border p-4 space-y-3 max-h-[88vh] overflow-y-auto ${
              isDark ? 'bg-[#181716] border-[#2B2926] text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
                <span className="font-serif font-bold text-sm">Live Guest Guide Preview</span>
                <button
                  type="button"
                  onClick={() => setMobilePreviewOpen(false)}
                  className="p-1 rounded-full hover:bg-black/10"
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

        {/* Bottom Wizard Actions: Back, Save Draft, Continue / Publish */}
        <div className={`p-4 sm:p-5 border-t flex flex-col gap-3 ${
          isDark ? 'border-[#2B2926] bg-[#1F1E1C]' : 'border-[#EBE6DF] bg-white'
        }`}>
          {publishError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{publishError}</span>
              </div>
              <button
                type="button"
                onClick={() => setPublishError(null)}
                className="p-1 rounded hover:bg-black/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              disabled={step === 1 || isPublishing || isSavingDraft}
              onClick={() => {
                setPublishError(null);
                setStep(step - 1);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ka' ? 'უკან' : 'Back'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSavingDraft || isPublishing}
                onClick={handleSaveDraft}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                    : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isSavingDraft ? 'Saving...' : (language === 'ka' ? 'მონახაზად შენახვა' : 'Save Draft')}</span>
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    setPublishError(null);
                    setStep(step + 1);
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white flex items-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                >
                  <span>{language === 'ka' ? 'გაგრძელება' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPublishing || isSavingDraft}
                  onClick={handlePublish}
                  className={`px-6 py-2.5 text-xs font-bold rounded-xl disabled:opacity-50 text-white flex items-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer ${
                    readiness.canPublish
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#B85D3B] hover:bg-[#A35132]'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'ka' ? 'ქვეყნდება...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'ka' ? 'გიდის გამოქვეყნება' : 'Publish Guest Guide'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
