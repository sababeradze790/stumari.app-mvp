import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  KeyRound, 
  Clock, 
  ArrowRight, 
  Check, 
  Copy, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Smartphone, 
  ChevronRight, 
  Layers, 
  Coffee, 
  Utensils, 
  Thermometer, 
  ExternalLink, 
  Star, 
  Heart, 
  PhoneCall, 
  MapPin, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  Radio, 
  Compass as CompassIcon,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StumariArchIcon } from '../common/StumariLogo';
import { PhysicalStandModal } from '../common/PhysicalStandModal';
import { 
  TbilisiBalconySketch, 
  TbilisiTowerSketch, 
  CheckinArtSketch, 
  AppliancesArtSketch, 
  KhinkaliSketch, 
  WineGlassSketch 
} from '../guest/GuestGuideIllustrations';
import { INITIAL_PROPERTIES } from '../../data/mockData';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, navigateToGuestGuide, currentProperty, theme, showToast, t, language, openAuthModal } = useApp();
  const isDark = theme === 'dark';

  // Interactive phone states in Hero
  const [phoneTab, setPhoneTab] = useState<'access' | 'wifi' | 'amenities' | 'gems'>('access');
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedKeypad, setCopiedKeypad] = useState(false);
  const [pinRevealed, setPinRevealed] = useState(false);

  // Property Showcase State
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const [showStandDemo, setShowStandDemo] = useState(false);
  const [selectedStandMaterial, setSelectedStandMaterial] = useState<'walnut' | 'birch' | 'acrylic'>('walnut');

  // Curated showcase properties
  const showcaseProperties = [
    {
      id: 'prop-1',
      slug: 'old-tbilisi-apartment',
      name: 'Old Tbilisi Heritage Residence',
      location: 'Sololaki, Tbilisi · Georgia',
      tagline: '19th-Century bohemian loft above cobbled wine streets',
      cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      host: 'Saba Beradze',
      rating: '4.98',
      reviews: 142,
      wifiNet: 'OldTbilisi_5G',
      wifiPass: 'MadlobaGuest2026!',
      doorPin: '3829#',
      lockboxPin: '7419',
      checkinTime: '3:00 PM',
      checkoutTime: '11:00 AM',
      highlightAmenity: 'DeLonghi Espresso & Vintage Balcony',
      heroGem: 'Ezo Courtyard Dining · 300m'
    },
    {
      id: 'prop-2',
      slug: 'kazbegi-chalet',
      name: 'Kazbegi Mountain Alpine Chalet',
      location: 'Stepantsminda · High Caucasus',
      tagline: 'Panoramic glass refuge facing Mount Kazbek glacier',
      cover: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      host: 'Nino & Davit',
      rating: '4.99',
      reviews: 98,
      wifiNet: 'Kazbegi_Glacier_5G',
      wifiPass: 'GergetiPeak2026',
      doorPin: '9102#',
      lockboxPin: '4421',
      checkinTime: '2:00 PM',
      checkoutTime: '12:00 PM',
      highlightAmenity: 'Cast-Iron Wood Stove & Sauna',
      heroGem: 'Rooms Kazbegi Terrace · 450m'
    },
    {
      id: 'prop-3',
      slug: 'signagi-villa',
      name: 'Signagi Wine Country Manor',
      location: 'Signagi, Kakheti · Wine Cradle',
      tagline: 'Terraced stone residence overlooking the Alazani Valley',
      cover: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      host: 'Giorgi K.',
      rating: '4.97',
      reviews: 116,
      wifiNet: 'SignagiValley_Fiber',
      wifiPass: 'AmberWine8000BC',
      doorPin: '5177#',
      lockboxPin: '8830',
      checkinTime: '3:00 PM',
      checkoutTime: '11:00 AM',
      highlightAmenity: 'Private Qvevri Cellar & Sun Deck',
      heroGem: 'Pheasant’s Tears Winery · 600m'
    }
  ];

  const currentShowcase = showcaseProperties[activePropertyIndex];

  const handleCopyWifi = (pass = 'MadlobaGuest2026!') => {
    navigator.clipboard.writeText(pass);
    setCopiedWifi(true);
    showToast(language === 'ka' ? 'Wi-Fi პაროლი დაკოპირდა!' : 'Wi-Fi Password copied to clipboard!');
    setTimeout(() => setCopiedWifi(false), 2400);
  };

  const handleCopyPin = (pin = '3829#') => {
    navigator.clipboard.writeText(pin);
    setCopiedKeypad(true);
    showToast(language === 'ka' ? 'კოდი დაკოპირდა!' : `Door Code ${pin} copied!`);
    setTimeout(() => setCopiedKeypad(false), 2400);
  };

  return (
    <div className={`min-h-screen selection:bg-[#B45309] selection:text-white transition-colors duration-300 ${
      isDark ? 'bg-[#141312] text-[#F7F5F0]' : 'bg-[#FAF8F5] text-[#1C1B1A]'
    }`}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. EDITORIAL SPLIT HERO SECTION                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 overflow-hidden border-b border-stone-200/70 dark:border-stone-800/60">
        
        {/* Subtle Ambient Warm Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 dark:bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-stone-200/50 dark:bg-stone-900/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Quiet, unboxed metadata kicker */}
              <div className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#B45309] dark:text-[#FBBF24]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] dark:bg-[#FBBF24]" />
                <span className="font-semibold">Boutique Hospitality & Digital Guidebooks</span>
                <span className="opacity-40" aria-hidden="true">·</span>
                <span className="text-stone-500 dark:text-stone-400">Zero App Downloads</span>
              </div>

              {/* High-Impact Statement Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]">
                  The guest experience your property deserves.
                </h1>
                <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-normal max-w-2xl">
                  Replace midnight WhatsApp confusion, lost paper binders, and repetitive Wi-Fi questions with a tactile, quiet luxury digital guide. Instant 1-tap connection right from the bedside stand.
                </p>
              </div>

              {/* Seductive Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigateToGuestGuide('old-tbilisi-apartment')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <span>Explore Live Guest Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowStandDemo(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 text-stone-800 dark:text-stone-200 font-medium text-sm bg-white/60 dark:bg-stone-900/60 backdrop-blur-xs transition-colors"
                >
                  <Radio className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
                  <span>Bedside Stand Demo</span>
                </button>

                <button
                  onClick={() => {
                    if (openAuthModal) openAuthModal();
                    else setCurrentRoute('/onboarding');
                  }}
                  className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 text-sm font-medium px-3 py-2 transition-colors flex items-center gap-1.5"
                >
                  <span>Host Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quiet Social Proof & Trust Strip */}
              <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800/80 flex flex-wrap items-center gap-6 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 font-medium">
                  <div className="flex -space-x-1">
                    <img className="w-6 h-6 rounded-full border border-white dark:border-stone-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Superhost" />
                    <img className="w-6 h-6 rounded-full border border-white dark:border-stone-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Superhost" />
                    <img className="w-6 h-6 rounded-full border border-white dark:border-stone-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Superhost" />
                  </div>
                  <span>2,400+ boutique hosts & villas</span>
                </div>
                <span className="opacity-40" aria-hidden="true">·</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#B45309] text-[#B45309] dark:fill-[#FBBF24] dark:text-[#FBBF24]" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">4.98</span>
                  <span>average guest satisfaction</span>
                </div>
                <span className="opacity-40" aria-hidden="true">·</span>
                <span>Protected 5-star reviews</span>
              </div>

            </div>

            {/* Right Column: Interactive Smartphone Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                
                {/* Subtle Luxury Outer Shadow */}
                <div className="absolute -inset-2 bg-gradient-to-b from-stone-400/20 via-amber-200/10 to-transparent dark:from-stone-700/20 rounded-[48px] blur-xl opacity-60" />

                {/* Smartphone Device Shell */}
                <div className="relative bg-stone-900 dark:bg-black rounded-[44px] p-3 shadow-2xl border-[5px] border-stone-800/80 dark:border-stone-800">
                  
                  {/* Dynamic Island Speaker Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-900 rounded-full z-30 flex items-center justify-between px-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                    <span className="w-2 h-2 rounded-full bg-stone-800/60" />
                  </div>

                  {/* Device Screen Canvas */}
                  <div className="relative bg-[#FAF8F5] dark:bg-[#1C1917] rounded-[34px] overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col h-[580px] border border-stone-200/50 dark:border-stone-800">
                    
                    {/* Screen Header Bar with Property Image */}
                    <div className="relative h-32 shrink-0 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
                        alt="Old Tbilisi Heritage" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
                      
                      {/* Quiet Property Meta on Banner */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                        <div>
                          <p className="text-[11px] font-mono tracking-wider uppercase text-amber-200 opacity-90">Sololaki · Historic Loft</p>
                          <h2 className="text-base font-serif font-bold leading-tight">Old Tbilisi Residence</h2>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Host Saba</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Phone Segmented Navigation (Interactive) */}
                    <div className="p-2.5 bg-stone-100/90 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 shrink-0">
                      <div className="grid grid-cols-4 gap-1 p-0.5 bg-stone-200/70 dark:bg-stone-800/70 rounded-lg text-xs">
                        <button
                          onClick={() => setPhoneTab('access')}
                          className={`py-1.5 rounded-md font-medium text-[11px] transition-all flex flex-col items-center gap-0.5 ${
                            phoneTab === 'access'
                              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Entry</span>
                        </button>

                        <button
                          onClick={() => setPhoneTab('wifi')}
                          className={`py-1.5 rounded-md font-medium text-[11px] transition-all flex flex-col items-center gap-0.5 ${
                            phoneTab === 'wifi'
                              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          <Wifi className="w-3.5 h-3.5" />
                          <span>Wi-Fi</span>
                        </button>

                        <button
                          onClick={() => setPhoneTab('amenities')}
                          className={`py-1.5 rounded-md font-medium text-[11px] transition-all flex flex-col items-center gap-0.5 ${
                            phoneTab === 'amenities'
                              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          <Coffee className="w-3.5 h-3.5" />
                          <span>House</span>
                        </button>

                        <button
                          onClick={() => setPhoneTab('gems')}
                          className={`py-1.5 rounded-md font-medium text-[11px] transition-all flex flex-col items-center gap-0.5 ${
                            phoneTab === 'gems'
                              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Gems</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Phone Content Body */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-left">
                      
                      <AnimatePresence mode="wait">
                        {phoneTab === 'access' && (
                          <motion.div
                            key="mini-access"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-3"
                          >
                            <div className="p-3 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs space-y-2.5">
                              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                                <span className="font-mono uppercase tracking-wider text-[10px]">Smart Keypad PIN</span>
                                <span>Apt #3 · 2nd Floor</span>
                              </div>

                              <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700">
                                <span className="text-xl font-mono font-bold tracking-widest text-stone-900 dark:text-stone-100">
                                  {pinRevealed ? '3829#' : '••••#'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setPinRevealed(!pinRevealed)}
                                    className="px-2 py-1 text-[11px] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                                  >
                                    {pinRevealed ? 'Hide' : 'Reveal'}
                                  </button>
                                  <button
                                    onClick={() => handleCopyPin('3829#')}
                                    className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-[11px] font-medium flex items-center gap-1"
                                  >
                                    {copiedKeypad ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedKeypad ? 'Copied' : 'Copy'}</span>
                                  </button>
                                </div>
                              </div>

                              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                                Enter through the wooden courtyard gate. Climb the spiral stairs to the teal door knocker.
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-900/60 text-xs flex items-center justify-between text-stone-600 dark:text-stone-300">
                              <span>Check-In: <strong>3:00 PM</strong></span>
                              <span className="opacity-40">·</span>
                              <span>Check-Out: <strong>11:00 AM</strong></span>
                            </div>
                          </motion.div>
                        )}

                        {phoneTab === 'wifi' && (
                          <motion.div
                            key="mini-wifi"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-3"
                          >
                            <div className="p-3 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs space-y-2.5">
                              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                                <span className="font-mono uppercase tracking-wider text-[10px]">High-Speed 5G Network</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">350 Mbps</span>
                              </div>

                              <div>
                                <p className="text-xs text-stone-500">SSID</p>
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono">OldTbilisi_5G</p>
                              </div>

                              <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700">
                                <div>
                                  <p className="text-[10px] text-stone-500 uppercase">Password</p>
                                  <p className="text-xs font-mono font-medium text-stone-900 dark:text-stone-100">MadlobaGuest2026!</p>
                                </div>
                                <button
                                  onClick={() => handleCopyWifi('MadlobaGuest2026!')}
                                  className="px-2.5 py-1.5 rounded-md bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-medium flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  {copiedWifi ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedWifi ? 'Copied' : '1-Tap Copy'}</span>
                                </button>
                              </div>

                              <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                                Tap once to copy password directly to your phone clipboard.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {phoneTab === 'amenities' && (
                          <motion.div
                            key="mini-amenities"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-2"
                          >
                            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex items-start gap-2.5 text-left">
                              <Coffee className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                              <div className="text-xs space-y-0.5">
                                <p className="font-semibold text-stone-900 dark:text-stone-100">DeLonghi Espresso Machine</p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                                  Press top-left power. Green light = ready. Local roasted beans in the glass jar.
                                </p>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs flex items-start gap-2.5 text-left">
                              <Thermometer className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                              <div className="text-xs space-y-0.5">
                                <p className="font-semibold text-stone-900 dark:text-stone-100">Daikin Inverter AC</p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                                  Remote beside hallway arch. Optimal setting: 22°C (72°F). Doors must be closed.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {phoneTab === 'gems' && (
                          <motion.div
                            key="mini-gems"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-2"
                          >
                            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs text-left">
                              <div className="flex items-center justify-between text-xs">
                                <p className="font-semibold text-stone-900 dark:text-stone-100">Ezo Courtyard</p>
                                <span className="text-[10px] text-stone-500">4 min walk</span>
                              </div>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                                Organic Sololaki dining. Outstanding khachapuri with artisanal cheese.
                              </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs text-left">
                              <div className="flex items-center justify-between text-xs">
                                <p className="font-semibold text-stone-900 dark:text-stone-100">Vino Underground</p>
                                <span className="text-[10px] text-stone-500">5 min walk</span>
                              </div>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                                Natural qvevri wine cellar. Try the Kakhetian amber flight.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* Bottom Phone Action Bar */}
                    <div className="p-3 bg-stone-100/90 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 shrink-0">
                      <button
                        onClick={() => navigateToGuestGuide('old-tbilisi-apartment')}
                        className="w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Open Fullscreen Guest View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>

                {/* Micro Footnote under Device */}
                <p className="text-center text-[11px] text-stone-500 dark:text-stone-400 mt-3 font-mono">
                  Interactive Simulator · Tap tabs and buttons above
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. ARCHITECTURAL METRIC & PROOF STRIP                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-100/60 dark:bg-stone-900/40 border-b border-stone-200/70 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">&lt; 15s</p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">First Check-In</p>
              <p className="text-xs text-stone-600 dark:text-stone-400">Average guest time to Wi-Fi connection and smart lock entry.</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">98.4%</p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">Message Reduction</p>
              <p className="text-xs text-stone-600 dark:text-stone-400">Fewer midnight calls asking for codes, remotes, and checkout steps.</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">4.98 ★</p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">Superhost Rating</p>
              <p className="text-xs text-stone-600 dark:text-stone-400">Average guest review rating across properties featuring Stumari stands.</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">0 Apps</p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">Instant Web-Native</p>
              <p className="text-xs text-stone-600 dark:text-stone-400">No App Store barrier. Works in iOS Safari, Chrome, and any browser.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 3. CURATED PROPERTY MOOD SWITCHER & SPACIOUS CARD ARCHITECTURE  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">
            <span>Card Structure & Content Hierarchy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Designed for clarity, structured with calm.
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            Every card gives guests exactly what they need at that moment without sensory overload. Switch between curated spaces below to preview real guest layouts.
          </p>
        </div>

        {/* Property Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          {showcaseProperties.map((prop, idx) => (
            <button
              key={prop.id}
              onClick={() => setActivePropertyIndex(idx)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activePropertyIndex === idx
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              <span>{prop.name}</span>
            </button>
          ))}
        </div>

        {/* Active Property Feature Cards (Spacious, Uncluttered, Elegant) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Arrival & Keyless Entry */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 shadow-[0_8px_30px_rgb(28,25,23,0.04)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">01 · Arrival & Access</span>
                <KeyRound className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
              </div>
              
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Self Check-In & Entry PIN
              </h3>
              
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Clear door codes and keypad instructions delivered securely to the guest phone.
              </p>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Smart Keypad Code</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Valid for stay</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-stone-900 dark:text-stone-100">{currentShowcase.doorPin}</span>
                  <button
                    onClick={() => handleCopyPin(currentShowcase.doorPin)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Check-in: {currentShowcase.checkinTime}</span>
              <span className="opacity-40">·</span>
              <span>Backup lockbox: {currentShowcase.lockboxPin}</span>
            </div>
          </div>

          {/* Card 2: 1-Tap High Speed Wi-Fi */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 shadow-[0_8px_30px_rgb(28,25,23,0.04)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">02 · Connectivity</span>
                <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                1-Tap Wi-Fi Copy
              </h3>

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                No mistyped network passwords or searching under routers. Guests copy with one single tap.
              </p>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Network</span>
                  <span className="font-mono text-stone-900 dark:text-stone-200 font-medium">{currentShowcase.wifiNet}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-stone-800 dark:text-stone-200">{currentShowcase.wifiPass}</span>
                  <button
                    onClick={() => handleCopyWifi(currentShowcase.wifiPass)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#B45309] hover:bg-[#92400E] text-white transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Password</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Automatic QR connection</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">5G High Speed</span>
            </div>
          </div>

          {/* Card 3: Appliance Clarity & Guides */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 shadow-[0_8px_30px_rgb(28,25,23,0.04)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">03 · Comfort</span>
                <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Appliances Without the Drama
              </h3>

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Step-by-step guidance for air conditioning, washer/dryers, and coffee machines.
              </p>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 space-y-1.5">
                <p className="text-xs font-medium text-stone-900 dark:text-stone-100">{currentShowcase.highlightAmenity}</p>
                <p className="text-xs text-stone-500 leading-normal">
                  Simple 3-step operational guide with quick troubleshooting to prevent incorrect settings.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Zero confusion</span>
              <span>Illustrated line drawings</span>
            </div>
          </div>

          {/* Card 4: Curated Local Gems */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 shadow-[0_8px_30px_rgb(28,25,23,0.04)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">04 · Local Gems</span>
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Host-Curated Neighborhood
              </h3>

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Skip generic tourist traps. Guide guests directly to authentic wine bars, bakeries, and sights.
              </p>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 space-y-1.5">
                <p className="text-xs font-medium text-stone-900 dark:text-stone-100">{currentShowcase.heroGem}</p>
                <p className="text-xs text-stone-500 leading-normal">
                  Includes walking distances, personal host tips, and direct 1-tap Google Maps pins.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Hand-picked by host</span>
              <span>1-tap navigation</span>
            </div>
          </div>

          {/* Card 5: Respectful House Rules & Checkout */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 shadow-[0_8px_30px_rgb(28,25,23,0.04)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">05 · House Respect</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Quiet Hours & Departure
              </h3>

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Respectful reminders on quiet hours, shoe-free etiquette, and simple departure checklists.
              </p>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 space-y-1">
                <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Quiet hours: 11:00 PM – 8:00 AM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Turn off heating / AC upon departure</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Checkout: {currentShowcase.checkoutTime}</span>
              <span>Clean key handoff</span>
            </div>
          </div>

          {/* Card 6: Direct Host Contact & Emergency */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 shadow-[0_8px_30px_rgb(28,25,23,0.04)] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">06 · Communication</span>
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Instant WhatsApp & 112 Dial
              </h3>

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Emergency services and co-host contact details always accessible without cell roaming anxiety.
              </p>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 space-y-1.5">
                <p className="text-xs font-medium text-stone-900 dark:text-stone-100">Direct Host WhatsApp</p>
                <p className="text-xs text-stone-500 leading-normal">
                  Pre-composed messages for check-in confirmation and quick requests.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Host {currentShowcase.host}</span>
              <span className="text-emerald-600 dark:text-emerald-400">Verified Superhost</span>
            </div>
          </div>

        </div>

        {/* CTA to open full live guide */}
        <div className="pt-4 text-center">
          <button
            onClick={() => navigateToGuestGuide(currentShowcase.slug)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-sm font-medium transition-all shadow-sm"
          >
            <span>Open Complete {currentShowcase.name} Guide</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 4. THE PHYSICAL TOUCHPOINT: THE BEDSIDE QR & NFC STAND           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#F3EFEA] dark:bg-[#181615] border-y border-stone-200/70 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Stand Visual Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Physical Stand Card Showcase */}
                <div className="relative bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
                  
                  {/* Stand Top Brand & NFC Indicator */}
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                    <div className="flex items-center gap-2">
                      <StumariArchIcon className="w-6 h-6 text-[#B45309] dark:text-[#FBBF24]" />
                      <span className="font-serif font-bold tracking-tight text-base">STUMARI</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                      <Radio className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FBBF24] animate-pulse" />
                      <span>NFC Tap & QR</span>
                    </div>
                  </div>

                  {/* QR Core with Decorative Arch */}
                  <div className="flex flex-col items-center text-center space-y-4 py-3">
                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://stumari.guide/g/old-tbilisi-apartment" 
                        alt="Stumari Guest Guide QR Code" 
                        className="w-36 h-36 rounded-lg mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    
                    <div>
                      <p className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Welcome to Your Stay</p>
                      <p className="text-xs text-stone-500 mt-0.5">Tap phone on wood base or scan code for instant Wi-Fi & guide</p>
                    </div>
                  </div>

                  {/* Tactile Material Base Simulation */}
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                    <span>Handcrafted base</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">{selectedStandMaterial} Wood & Acrylic</span>
                  </div>

                </div>

                {/* Stand Material Selector Underneath */}
                <div className="flex justify-center items-center gap-2 mt-4">
                  {(['walnut', 'birch', 'acrylic'] as const).map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedStandMaterial(mat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                        selectedStandMaterial === mat
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                          : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Right: Stand Editorial Value */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">
                <span>The Tactile Room Touchpoint</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
                No awkward search. Guests tap as they walk in.
              </h2>

              <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Placed on the coffee table or entry foyer, the Stumari stand is the first thing guests notice after putting down their luggage. One natural tap opens the guide in their language without entering a URL or downloading an app.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Printable Free PDF Template</p>
                    <p className="text-xs text-stone-500 leading-normal">Generate and print an elegant tabletop tent card instantly on your home or office printer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Embedded NFC & Laser Engraving</p>
                    <p className="text-xs text-stone-500 leading-normal">Premium solid walnut and frosted acrylic physical stands available with pre-programmed NFC tags.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Instant Dynamic Updates</p>
                    <p className="text-xs text-stone-500 leading-normal">Change your Wi-Fi password or checkout notes anytime; the physical QR stand always points to your newest guide.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowStandDemo(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-sm font-medium transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate Free Printable Stand</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 5. BEFORE VS AFTER: THE HOST PEACE OF MIND                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-2xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">
            <span>Peace of Mind</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            The difference between hospitality and chaos.
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            See how boutique hosts switch from constant emergency messaging to effortless 5-star reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: The Fragmented Way */}
          <div className="p-8 rounded-3xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400">The Fragmented Way</span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">Paper Binders & WhatsApp</h3>
            </div>

            <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                <span>Guests arrive tired at midnight and can’t read laminated text printouts in the dark.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                <span>Host answers the same question about the espresso machine 4 times every weekend.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                <span>Foreign guests struggle with language barriers and appliance symbols.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                <span>4-star reviews caused by minor check-in misunderstandings.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: The Stumari Standard */}
          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-100 shadow-lg space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">The Stumari Standard</span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">Tactile, Quiet Hospitality</h3>
            </div>

            <ul className="space-y-4 text-sm text-stone-700 dark:text-stone-200">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>One phone tap on the bedside stand connects Wi-Fi and presents the entire home.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>Visual, step-by-step instructions resolve questions before they turn into calls.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>Instant multi-language support (English, Georgian, and more).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>Protected 5-star reviews and delighted guests who praise your welcoming attention to detail.</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 6. EDITORIAL SUPERHOST TESTIMONIALS                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-stone-100/60 dark:bg-stone-900/40 border-t border-stone-200/70 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">Host Reflections</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Loved by hosts who care about details.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-7 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "Our Airbnb guests constantly mention the wooden Stumari stand in their reviews. Midnight Wi-Fi messages dropped from 3 a week to zero."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Saba" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Saba Beradze</p>
                  <p className="text-[11px] text-stone-500">Superhost · Sololaki Heritage Loft</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "Having the appliance guides with drawings stopped guests from turning off our boiler safety valve by mistake. Essential for any mountain property."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Davit" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Davit & Nino</p>
                  <p className="text-[11px] text-stone-500">Owners · Kazbegi Alpine Chalet</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "Guests love our curated wine tasting spots. Stumari makes our small guesthouse feel like a bespoke boutique hotel with a concierge."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Elena" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Elena M.</p>
                  <p className="text-[11px] text-stone-500">Host · Signagi Terraces</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 7. SEDUCTIVE FINAL INVITATION CALL TO ACTION                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-stone-900 dark:bg-stone-950 text-white p-10 sm:p-16 lg:p-20 overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Background Grain */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B45309]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FBBF24]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              <span>Begin in Under 3 Minutes</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Give your next guest an unforgettable welcome.
            </h2>

            <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-2xl">
              Create your first digital guide today. Connect your Wi-Fi details, door instructions, and favorite neighborhood spots. Test it instantly on your phone.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (openAuthModal) openAuthModal();
                  else setCurrentRoute('/onboarding');
                }}
                className="px-8 py-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-sm transition-all shadow-md active:scale-[0.98] flex items-center gap-2"
              >
                <span>Create Your Digital Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateToGuestGuide('old-tbilisi-apartment')}
                className="px-6 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-200 text-sm font-medium transition-colors"
              >
                <span>View Sample Guide</span>
              </button>
            </div>

            <p className="text-xs text-stone-400 font-mono pt-2">
              Free setup · No credit card required · Instant QR code generation
            </p>

          </div>

        </div>
      </section>

      {/* Physical Stand Modal */}
      {currentProperty && (
        <PhysicalStandModal
          property={currentProperty}
          isOpen={showStandDemo}
          onClose={() => setShowStandDemo(false)}
        />
      )}

    </div>
  );
};
