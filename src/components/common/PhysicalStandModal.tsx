import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  Sparkles, 
  Radio, 
  QrCode, 
  Wifi, 
  Check, 
  ExternalLink, 
  Layers, 
  Palette, 
  Share2 
} from 'lucide-react';
import { Property } from '../../types';
import { QrCodeView } from './QrCodeView';
import { StumariArchIcon } from './StumariLogo';
import { useApp } from '../../context/AppContext';

interface PhysicalStandModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const PhysicalStandModal: React.FC<PhysicalStandModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const { language, showToast, theme, getGuestCheckInUrl } = useApp();
  const [material, setMaterial] = useState<'birch' | 'walnut' | 'black' | 'acrylic'>('birch');
  const [cardSize, setCardSize] = useState<'bedside' | 'table' | 'plaque'>('bedside');
  const [showNfcSim, setShowNfcSim] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const guideUrl = getGuestCheckInUrl(property, true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
    showToast(language === 'ka' ? 'გაიგზავნა საბეჭდ დიალოგში 🖨️' : 'Sent to printer dialog 🖨️');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guideUrl);
    setCopiedLink(true);
    showToast(language === 'ka' ? 'NFC / QR ბმული დაკოპირდა!' : 'NFC / QR Guide Link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateNfcTap = () => {
    setShowNfcSim(true);
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch {}
    setTimeout(() => {
      setShowNfcSim(false);
      showToast(language === 'ka' ? 'NFC ჩიპი წარმატებით წაიკითხა! 📲' : 'NFC Tag tapped successfully! 📲');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="relative w-full max-w-4xl bg-[#11171A] border border-stone-800 text-stone-100 rounded-[32px] p-5 sm:p-8 my-auto shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-stone-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F55A51] text-white flex items-center justify-center font-bold shadow-xs">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold">
                  {language === 'ka' ? 'ფიზიკური QR & NFC სადგამი' : language === 'ru' ? 'Физическая стойка QR и NFC' : 'Physical QR & NFC Table Stand'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FFC757]/15 text-[#FFC757] border border-[#FFC757]/30">
                  Touchpoint 2.0
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {language === 'ka' 
                  ? 'ლაზერულად გრავირებული ხის და აკრილის მაგიდის სადგამი სტუმრებისთვის.' 
                  : 'Laser-engraved birch wood & acrylic table stand with 1-tap NFC chip and QR code.'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left 3D Stand Mockup, Right Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: Stand Visual Mockup */}
          <div className="md:col-span-6 flex flex-col items-center">
            
            {/* Realistic Physical Stand Render */}
            <div className="w-full max-w-[280px] sm:max-w-[310px] perspective-1000">
              <motion.div 
                whileHover={{ rotateY: 6, rotateX: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all text-center flex flex-col items-center justify-between min-h-[380px] ${
                  material === 'birch'
                    ? 'bg-gradient-to-b from-[#F7F4EB] via-[#EFE8D8] to-[#E5DAC4] text-stone-900 border-amber-200/60 shadow-amber-950/20'
                    : material === 'walnut'
                    ? 'bg-gradient-to-b from-[#3E2723] via-[#2E1D1A] to-[#1C110F] text-amber-50 border-amber-900/40 shadow-black/40'
                    : material === 'black'
                    ? 'bg-gradient-to-b from-[#1C2024] via-[#14181B] to-[#0A0D0F] text-stone-100 border-stone-800 shadow-black/60'
                    : 'bg-gradient-to-b from-white/90 via-stone-50/80 to-white/70 backdrop-blur-xl text-stone-900 border-white/60 shadow-xl'
                }`}
              >
                {/* Frosted Arch Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/15 text-[10px] font-mono uppercase tracking-widest font-bold opacity-80 mb-2">
                  <StumariArchIcon size={14} />
                  <span>STUMARI GUEST GUIDE</span>
                </div>

                {/* Property Name */}
                <div className="space-y-1 mb-4">
                  <h4 className="font-serif text-lg font-bold tracking-tight truncate max-w-[220px]">
                    {property.title}
                  </h4>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70 block">
                    {property.city} · Fast Wi-Fi & Door Code
                  </span>
                </div>

                {/* Central High-Contrast QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-md border border-black/5 relative group cursor-pointer" onClick={handleSimulateNfcTap}>
                  <QrCodeView 
                    url={guideUrl}
                    size={140}
                    showActions={false}
                    propertyName={property.title}
                  />
                  
                  {/* NFC Tap Floating Ring */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-stone-950 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>TAP NFC OR SCAN</span>
                  </div>
                </div>

                {/* Wi-Fi Essentials at Bottom */}
                <div className="mt-5 pt-3 border-t border-current/15 w-full flex items-center justify-between text-left text-[11px] font-mono">
                  <div className="truncate pr-2">
                    <span className="text-[8px] uppercase tracking-wider opacity-60 block">Network</span>
                    <strong className="truncate block">{property.wifiNetwork}</strong>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[8px] uppercase tracking-wider opacity-60 block">PIN</span>
                    <strong className="text-amber-600 dark:text-amber-400">{property.doorKeypadCode}</strong>
                  </div>
                </div>

                {/* Simulated Wood Base / Plinth */}
                <div className={`absolute -bottom-3 left-6 right-6 h-3 rounded-b-xl border-t shadow-md ${
                  material === 'walnut' 
                    ? 'bg-[#1F1412] border-amber-950' 
                    : material === 'black'
                    ? 'bg-[#0A0D0E] border-stone-900'
                    : 'bg-[#D4C3A3] border-amber-300'
                }`} />
              </motion.div>
            </div>

            {/* NFC Tap Simulator Button */}
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={handleSimulateNfcTap}
                className="px-4 py-2 rounded-full text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-2 transition-all cursor-pointer border border-stone-700"
              >
                <Radio className={`w-3.5 h-3.5 ${showNfcSim ? 'text-amber-400 animate-ping' : 'text-amber-400'}`} />
                <span>{language === 'ka' ? 'NFC შეხების სიმულაცია 📲' : 'Simulate Phone NFC Tap 📲'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Stand Customization & Ordering Options */}
          <div className="md:col-span-6 space-y-5">
            
            {/* Material Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold block">
                {language === 'ka' ? 'მასალა & დიზაინი' : 'Material & Finish'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'birch', label: 'Natural Birch Wood', desc: 'Warm oak & frosted matte' },
                  { id: 'walnut', label: 'Dark Walnut Wood', desc: 'Luxury deep boutique tone' },
                  { id: 'black', label: 'Matte Obsidian', desc: 'Architectural minimalism' },
                  { id: 'acrylic', label: 'Clear Frosted Acrylic', desc: 'Ultra-clean hotel elegance' }
                ].map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterial(mat.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      material === mat.id 
                        ? 'bg-[#F55A51]/15 border-[#F55A51] text-white ring-1 ring-[#F55A51]/50' 
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="font-bold text-xs block">{mat.label}</span>
                    <span className="text-[10px] opacity-70 block">{mat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Form Factor */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold block">
                {language === 'ka' ? 'ზომა & ფორმატი' : 'Format & Placement'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'bedside', title: 'Bedside Table', size: '10 × 15 cm' },
                  { id: 'table', title: 'Tent Card', size: 'A6 Fold' },
                  { id: 'plaque', title: 'Wall Plaque', size: 'Door / Entry' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setCardSize(s.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      cardSize === s.id 
                        ? 'bg-[#F55A51] text-white font-bold border-[#F55A51] shadow-xs' 
                        : 'bg-stone-900 border-stone-800 text-stone-300'
                    }`}
                  >
                    <span className="block">{s.title}</span>
                    <span className="text-[9px] font-mono opacity-70 block">{s.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Details */}
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs text-stone-300">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">NFC Frequency:</span>
                <span className="font-mono text-[#FFC757]">NTAG213 / 215 (13.56 MHz)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">QR Code Error Correction:</span>
                <span className="font-mono text-emerald-400">High (Level H 30%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Direct Link:</span>
                <span className="font-mono text-stone-200 truncate max-w-[200px]">{guideUrl}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#F55A51] hover:bg-[#e04a41] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'ka' ? 'ფლაერის დაბეჭდვა (A4 / 5x7)' : 'Print Stand Template'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto py-3 px-4 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy NFC URL'}</span>
              </button>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};
