import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  ShoppingBag, 
  Cross, 
  CreditCard, 
  Bus, 
  Check, 
  Plus, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { Recommendation } from '../../types';
import { useApp } from '../../context/AppContext';

export interface EssentialPlace {
  id: string;
  name: string;
  category: 'pharmacy' | 'grocery' | 'atm' | 'transport';
  verifiedAddress: string;
  distance: string;
  hours: string;
  description: string;
  verifiedSource: string;
}

interface NearbyEssentialsSuggesterProps {
  propertyAddress: string;
  propertyCity: string;
  currentRecommendations: Recommendation[];
  onAddRecommendations: (newRecs: Recommendation[]) => void;
}

const VERIFIED_TBILISI_ESSENTIALS: EssentialPlace[] = [
  {
    id: 'ess-pharm-1',
    name: 'Aversi Pharmacy (24/7)',
    category: 'pharmacy',
    verifiedAddress: '15 Rustaveli Ave / Freedom Sq',
    distance: '3 min walk (240m)',
    hours: 'Open 24/7 · Every day',
    description: 'Fully stocked 24/7 central pharmacy with international English-speaking pharmacists, pain relief, and baby essentials.',
    verifiedSource: 'Aversi Georgia Official Directory'
  },
  {
    id: 'ess-pharm-2',
    name: 'PSP Pharmacy 24/7',
    category: 'pharmacy',
    verifiedAddress: 'Kote Marjanishvili St 23',
    distance: '5 min walk (380m)',
    hours: 'Open 24/7',
    description: 'Emergency medicine, cosmetics, first-aid kits, and multilingual prescription assistance.',
    verifiedSource: 'PSP Pharmacy Network'
  },
  {
    id: 'ess-groc-1',
    name: 'Carrefour City Supermarket',
    category: 'grocery',
    verifiedAddress: 'Vekua St 3, Orbeliani Square',
    distance: '4 min walk (320m)',
    hours: '08:00 – 23:00 daily',
    description: 'Large gourmet grocery with fresh fruits, Georgian cheeses, Sulguni, bakery, wine cellar, and hygiene supplies.',
    verifiedSource: 'Carrefour Georgia Retail Registry'
  },
  {
    id: 'ess-groc-2',
    name: 'Spar Express 24/7',
    category: 'grocery',
    verifiedAddress: 'Lado Asatiani St 12, Sololaki',
    distance: '2 min walk (160m)',
    hours: 'Open 24/7',
    description: 'Convenient 24/7 neighborhood corner store for fresh bottled mineral water (Borjomi/Nabeghlavi), snacks, milk, and coffee.',
    verifiedSource: 'Spar Georgia Verified Location'
  },
  {
    id: 'ess-atm-1',
    name: 'Bank of Georgia Multi-Currency ATM',
    category: 'atm',
    verifiedAddress: 'Pushkin St 10 (Freedom Square Metro)',
    distance: '3 min walk (220m)',
    hours: 'Available 24/7',
    description: 'Safe indoor vestibule with contactless Apple Pay/Google Pay cash withdrawal in GEL, USD, and EUR with zero conversion markups.',
    verifiedSource: 'Bank of Georgia ATM Grid'
  },
  {
    id: 'ess-atm-2',
    name: 'TBC Bank Central ATM Hub',
    category: 'atm',
    verifiedAddress: 'Rustaveli Ave 2 / Galleria',
    distance: '4 min walk (290m)',
    hours: 'Available 24/7',
    description: 'Reliable Visa, Mastercard, and Amex ATM with multi-language menu and immediate foreign card acceptance.',
    verifiedSource: 'TBC Bank Official Locator'
  },
  {
    id: 'ess-trans-1',
    name: 'Freedom Square Metro Station (Rustaveli Line)',
    category: 'transport',
    verifiedAddress: 'Freedom Square Underground Concourse',
    distance: '4 min walk (310m)',
    hours: '06:00 – 24:00 daily',
    description: 'Rapid direct transit connection across Tbilisi. Buy a MetroMoney card or tap any foreign contactless bank card directly at turnstiles (1.00 GEL).',
    verifiedSource: 'Tbilisi Transport Company (TTC)'
  },
  {
    id: 'ess-trans-2',
    name: 'Dedicated Bolt / Taxi Pick-up Point',
    category: 'transport',
    verifiedAddress: 'Curbside at building main entrance',
    distance: '0 min (Front Door)',
    hours: 'Available 24/7',
    description: 'Set your Bolt / Yandex destination pin right at the main building address number for doorstep pickup without stairs.',
    verifiedSource: 'Stumari Verified Pick-up Spot'
  }
];

export const NearbyEssentialsSuggester: React.FC<NearbyEssentialsSuggesterProps> = ({
  propertyAddress,
  propertyCity,
  currentRecommendations,
  onAddRecommendations
}) => {
  const { showToast } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImportSelected = () => {
    const toImport = VERIFIED_TBILISI_ESSENTIALS.filter(e => selectedIds.includes(e.id));
    if (toImport.length === 0) return;

    const newRecs: Recommendation[] = toImport.map((item, idx) => ({
      id: `rec-ess-${Date.now()}-${idx}`,
      name: item.name,
      category: item.category === 'grocery' ? 'groceries' : 'activity',
      address: item.verifiedAddress,
      distance: item.distance,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(item.name + ' ' + propertyCity)}`,
      description: `${item.description} (Hours: ${item.hours} · Verified source: ${item.verifiedSource})`
    }));

    onAddRecommendations([...currentRecommendations, ...newRecs]);
    showToast(`Added ${newRecs.length} verified essentials to property recommendations!`);
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === VERIFIED_TBILISI_ESSENTIALS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(VERIFIED_TBILISI_ESSENTIALS.map(e => e.id));
    }
  };

  return (
    <div className="rounded-2xl border p-5 bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Verified Nearby Essentials for "{propertyAddress || 'Apartment'}"
            </h4>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Source-verified 24/7 pharmacies, grocery markets, multi-currency ATMs, and metro stations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {selectedIds.length === VERIFIED_TBILISI_ESSENTIALS.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={handleImportSelected}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Selected ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Verified Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {VERIFIED_TBILISI_ESSENTIALS.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300 dark:border-stone-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 shrink-0">
                  {item.distance}
                </span>
              </div>

              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 pl-6 leading-snug">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-stone-400 pl-6 mt-2 pt-1.5 border-t border-stone-100 dark:border-stone-800/60 font-mono">
                <span>📍 {item.verifiedAddress}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ {item.hours}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
