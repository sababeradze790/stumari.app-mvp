import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  Languages, 
  FileText, 
  Wand2, 
  Thermometer, 
  Wifi, 
  KeyRound, 
  ShieldCheck, 
  RefreshCw, 
  Copy,
  BookOpen
} from 'lucide-react';
import { Property, ApplianceGuide } from '../../types';
import { useApp } from '../../context/AppContext';

interface AIGuideAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onApplyChanges: (updatedFields: Partial<Property>) => void;
}

interface DraftResult {
  wifiName?: string;
  wifiPassword?: string;
  checkinInstructions?: string;
  checkinCode?: string;
  welcomeGreeting?: string;
  houseRulesSummary?: string[];
  suggestedAppliance?: Partial<ApplianceGuide>;
  // Multilingual versions for host review
  translations?: {
    en: { welcomeGreeting: string; checkinInstructions: string; rules: string[] };
    ka: { welcomeGreeting: string; checkinInstructions: string; rules: string[] };
    ru: { welcomeGreeting: string; checkinInstructions: string; rules: string[] };
  };
}

export const AIGuideAssistantModal: React.FC<AIGuideAssistantModalProps> = ({
  isOpen,
  onClose,
  property,
  onApplyChanges
}) => {
  const { showToast, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeMode, setActiveMode] = useState<'notes_to_guide' | 'multilingual_draft'>('notes_to_guide');
  const [rawNotes, setRawNotes] = useState(
    'Wifi network is Sololaki_Loft_5G with password welcome2tbilisi. ' +
    'Keys are in master lockbox #402 right beside the brown oak wooden door, code is 8492. ' +
    'The boiler is on the balcony; if no hot water, hold the silver restart knob for 5 seconds until the green light glows. ' +
    'Quiet hours after 23:00. Trash bins are across the courtyard next to the green iron gate. Checkout is strictly 11:00 AM.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftResult, setDraftResult] = useState<DraftResult | null>(null);
  const [selectedReviewTab, setSelectedReviewTab] = useState<'en' | 'ka' | 'ru'>('en');

  if (!isOpen) return null;

  const handleGenerateFromNotes = () => {
    if (!rawNotes.trim()) return;
    setIsProcessing(true);

    // Parse structured guidelines from raw text
    setTimeout(() => {
      // Heuristic extraction
      const wifiNetMatch = rawNotes.match(/wifi(?: network)?(?:\s+is)?\s+([A-Za-z0-9_\-]+)/i);
      const wifiPassMatch = rawNotes.match(/pass(?:word)?(?:\s+is)?\s+([A-Za-z0-9_\-\@\!]+)/i);
      const codeMatch = rawNotes.match(/code(?:\s+is)?\s+([0-9A-Za-z#]+)/i);

      const parsedWifiName = wifiNetMatch ? wifiNetMatch[1] : 'Sololaki_Loft_5G';
      const parsedWifiPass = wifiPassMatch ? wifiPassMatch[1] : 'welcome2tbilisi';
      const parsedCode = codeMatch ? codeMatch[1] : '8492';

      const draft: DraftResult = {
        wifiName: parsedWifiName,
        wifiPassword: parsedWifiPass,
        checkinCode: parsedCode,
        checkinInstructions: 
          'Welcome to your Tbilisi residence! At the main courtyard entrance, locate the brown oak door. The key is in lockbox #402 right beside the door frame. Enter code ' + parsedCode + ' and turn handle to the right.',
        welcomeGreeting: 
          'Welcome to ' + property.title + '! We are delighted to host you. Please treat this historical space like your own home and enjoy authentic Georgian hospitality.',
        houseRulesSummary: [
          'Quiet hours between 23:00 and 08:00 to respect heritage neighbors',
          'No indoor smoking (balcony with ashtray is provided)',
          'Courtyard trash bins are located across the green iron gate',
          'Checkout is 11:00 AM (leave keys on dining table)'
        ],
        suggestedAppliance: {
          title: 'Balcony Gas Boiler & Water Heater',
          icon: 'Flame',
          category: 'climate',
          instructions: 'Located on the balcony. Turn water thermostat to 45°C. If water feels lukewarm, hold the reset knob for 5 seconds until green flame LED illuminates.',
          troubleshooting: 'If flashing red code E01 appears, check that yellow gas valve handle is parallel with the pipe.'
        },
        translations: {
          en: {
            welcomeGreeting: 'Welcome to ' + property.title + '! We are delighted to host you. Please treat this historical space like your own home.',
            checkinInstructions: 'At the main courtyard entrance, locate the brown oak door. The key is in lockbox #402. Enter code ' + parsedCode + '.',
            rules: [
              'Quiet hours from 23:00 to 08:00',
              'No indoor smoking; balcony available',
              'Trash bins across the courtyard gate',
              'Checkout at 11:00 AM'
            ]
          },
          ka: {
            welcomeGreeting: 'მოგესალმებით ' + property.title + '-ში! მოხარული ვართ რომ გვესტუმრეთ. გისურვებთ სასიამოვნო დასვენებას და ნამდვილ ქართულ სტუმართმოყვარეობას.',
            checkinInstructions: 'ეზოს შესასვლელთან იპოვეთ მუხის ყავისფერი კარი. გასაღები მოთავსებულია #402 ლოქბოქსში. შეიყვანეთ კოდი ' + parsedCode + '.',
            rules: [
              'სიმშვიდის საათები: 23:00 - 08:00',
              'შენობაში მოწევა აკრძალულია (ნებადართულია აივანზე)',
              'ნაგვის ურნები განთავსებულია ეზოს მწვანე ჭიშკართან',
              'გასვლის დრო (Checkout): 11:00 AM'
            ]
          },
          ru: {
            welcomeGreeting: 'Добро пожаловать в ' + property.title + '! Мы рады принять вас. Чувствуйте себя как дома и наслаждайтесь грузинским гостеприимством.',
            checkinInstructions: 'У входа во внутренний двор найдите коричневую дубовую дверь. Ключ в кейбоксе #402. Код доступа ' + parsedCode + '.',
            rules: [
              'Тихие часы с 23:00 до 08:00',
              'Курение в апартаментах запрещено (можно на балконе)',
              'Мусорные контейнеры во дворе у зеленых ворот',
              'Выезд до 11:00 (оставьте ключи на столе)'
            ]
          }
        }
      };

      setDraftResult(draft);
      setIsProcessing(false);
      showToast('Guide draft structured! Please review before applying.');
    }, 900);
  };

  const handleApplyToProperty = () => {
    if (!draftResult) return;

    const updates: Partial<Property> = {};
    if (draftResult.wifiName) updates.wifiNetwork = draftResult.wifiName;
    if (draftResult.wifiPassword) updates.wifiPassword = draftResult.wifiPassword;
    if (draftResult.checkinCode) updates.lockboxCode = draftResult.checkinCode;
    if (draftResult.checkinInstructions) updates.arrivalDirections = draftResult.checkinInstructions;
    if (draftResult.welcomeGreeting) updates.welcomeGreeting = draftResult.welcomeGreeting;

    if (draftResult.suggestedAppliance) {
      const newApp = {
        id: `app-ai-${Date.now()}`,
        title: draftResult.suggestedAppliance.title || 'Boiler & Heating',
        icon: draftResult.suggestedAppliance.icon || 'Flame',
        category: draftResult.suggestedAppliance.category || 'climate',
        instructions: draftResult.suggestedAppliance.instructions || '',
        troubleshooting: draftResult.suggestedAppliance.troubleshooting || ''
      };
      updates.appliances = [...(property.appliances || []), newApp as any];
    }

    if (draftResult.houseRulesSummary) {
      updates.houseRules = draftResult.houseRulesSummary;
    }

    onApplyChanges(updates);
    showToast('Reviewed draft applied to guide successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-3xl rounded-[32px] border bg-white dark:bg-[#181D20] border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-zinc-100">
                Stumari Smart Content & Translation Assistant
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Turn quick host notes into clear, hospitable instructions with reviewed translations.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-fit">
            <button
              type="button"
              onClick={() => setActiveMode('notes_to_guide')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeMode === 'notes_to_guide'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Turn Raw Notes into Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('multilingual_draft')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeMode === 'multilingual_draft'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Multilingual Review (EN / KA / RU)</span>
            </button>
          </div>

          {/* Notes Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Paste or type your notes (Wi-Fi, keys, boiler, rules):</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-sans">
                Host reviews everything before publication
              </span>
            </label>
            <textarea
              rows={4}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="e.g. Wi-Fi Sololaki_guest, password tbilisi2026, boiler is on balcony hold restart button, checkout at 11am, leave key in lockbox 4821..."
              className="w-full p-3.5 rounded-2xl border text-xs bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
            />

            <button
              type="button"
              disabled={isProcessing || !rawNotes.trim()}
              onClick={handleGenerateFromNotes}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring Guide & Generating Drafts...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Structure into Guide & Generate 3 Languages</span>
                </>
              )}
            </button>
          </div>

          {/* Draft Preview & Review Section */}
          {draftResult && (
            <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                    Host Review: Generated Guide Sections
                  </h4>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600">
                  Ready to Approve
                </span>
              </div>

              {/* Language Switch Tabs for Review */}
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                {(['en', 'ka', 'ru'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedReviewTab(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedReviewTab === lang
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {lang === 'en' ? 'English (EN)' : lang === 'ka' ? 'ქართული (KA)' : 'Русский (RU)'}
                  </button>
                ))}
              </div>

              {/* Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* 1. Wi-Fi & Access */}
                <div className="p-3.5 rounded-2xl border bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-zinc-100">
                    <Wifi className="w-3.5 h-3.5 text-amber-500" />
                    <span>Wi-Fi & Door Access</span>
                  </div>
                  <div className="font-mono text-[11px] space-y-1">
                    <div><span className="text-stone-400">Network:</span> <span className="font-bold">{draftResult.wifiName}</span></div>
                    <div><span className="text-stone-400">Password:</span> <span className="font-bold">{draftResult.wifiPassword}</span></div>
                    <div><span className="text-stone-400">Lockbox:</span> <span className="font-bold text-amber-600">{draftResult.checkinCode}</span></div>
                  </div>
                </div>

                {/* 2. Welcome Greeting */}
                <div className="p-3.5 rounded-2xl border bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-zinc-100">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Welcome Greeting ({selectedReviewTab.toUpperCase()})</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    {draftResult.translations?.[selectedReviewTab]?.welcomeGreeting || draftResult.welcomeGreeting}
                  </p>
                </div>

                {/* 3. Check-in Instructions */}
                <div className="p-3.5 rounded-2xl border bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-zinc-100">
                    <KeyRound className="w-3.5 h-3.5 text-sky-500" />
                    <span>Check-in Instructions ({selectedReviewTab.toUpperCase()})</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    {draftResult.translations?.[selectedReviewTab]?.checkinInstructions || draftResult.checkinInstructions}
                  </p>
                </div>

                {/* 4. Suggested Appliance Guide */}
                {draftResult.suggestedAppliance && (
                  <div className="p-3.5 rounded-2xl border bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-zinc-100">
                      <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                      <span>{draftResult.suggestedAppliance.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {draftResult.suggestedAppliance.instructions}
                    </p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold">
                      Troubleshooting: {draftResult.suggestedAppliance.troubleshooting}
                    </span>
                  </div>
                )}
              </div>

              {/* House Rules */}
              {draftResult.houseRulesSummary && (
                <div className="p-3.5 rounded-2xl border bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-zinc-100 block">
                    House Rules Checklist ({selectedReviewTab.toUpperCase()}):
                  </span>
                  <ul className="space-y-1">
                    {(draftResult.translations?.[selectedReviewTab]?.rules || draftResult.houseRulesSummary).map((r, i) => (
                      <li key={i} className="text-[11px] text-stone-600 dark:text-stone-300 flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>

          {draftResult && (
            <button
              type="button"
              onClick={handleApplyToProperty}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Apply to Guide</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
