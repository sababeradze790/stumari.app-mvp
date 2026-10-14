import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Coffee, 
  Utensils, 
  Wine, 
  Moon, 
  Eye, 
  Heart, 
  Star, 
  Check, 
  Plus, 
  ExternalLink, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  ArrowUpRight, 
  X,
  Filter,
  CheckCircle2,
  Camera,
  MessageSquareHeart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, StumariGem, GemMood, GemExperience } from '../../types';
import { TBILISI_GEMS_LIBRARY } from '../../data/stumariGemsData';

interface PropertyGemsCuratorProps {
  property: Property;
}

export const PropertyGemsCurator: React.FC<PropertyGemsCuratorProps> = ({ property }) => {
  const { 
    gems: appGems, 
    togglePropertyGem, 
    addCustomGem, 
    showToast, 
    theme, 
    language,
    navigateToGuestGuide
  } = useApp();

  const isDark = theme === 'dark';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [filterActiveOnly, setFilterActiveOnly] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for new custom gem
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newExperience, setNewExperience] = useState<GemExperience>('eat');
  const [newDistance, setNewDistance] = useState('5 min walk');
  const [newAddress, setNewAddress] = useState('');
  const [newMapsUrl, setNewMapsUrl] = useState('');
  const [newPrice, setNewPrice] = useState<'$' | '$$' | '$$$' | 'Free'>('$$');
  const [newWhatToTry, setNewWhatToTry] = useState('');
  const [newHostQuote, setNewHostQuote] = useState('');
  const [newWhyRecommend, setNewWhyRecommend] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Combined gems library
  const allLibraryGems = useMemo(() => {
    const customList = appGems || [];
    const map = new Map<string, StumariGem>();
    TBILISI_GEMS_LIBRARY.forEach(g => map.set(g.id, g));
    customList.forEach(g => map.set(g.id, g));
    return Array.from(map.values());
  }, [appGems]);

  // Active gems for this specific property
  const activeGemIds = useMemo(() => {
    return new Set(property.gemIds || []);
  }, [property.gemIds]);

  // Filtered gems
  const filteredGems = useMemo(() => {
    return allLibraryGems.filter(gem => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = gem.title.toLowerCase().includes(query);
        const matchSub = gem.subtitle?.toLowerCase().includes(query);
        const matchAddr = gem.address.toLowerCase().includes(query);
        const matchTip = gem.hostQuote?.toLowerCase().includes(query) || gem.localTip?.toLowerCase().includes(query);
        if (!matchTitle && !matchSub && !matchAddr && !matchTip) return false;
      }

      // Experience
      if (selectedExperience !== 'all' && gem.experience !== selectedExperience) {
        return false;
      }

      // Mood
      if (selectedMood !== 'all' && !gem.moods.includes(selectedMood as GemMood)) {
        return false;
      }

      // Active in guide only
      if (filterActiveOnly && !activeGemIds.has(gem.id)) {
        return false;
      }

      return true;
    });
  }, [allLibraryGems, searchQuery, selectedExperience, selectedMood, filterActiveOnly, activeGemIds]);

  const activeCount = allLibraryGems.filter(g => activeGemIds.has(g.id)).length;
  const favoritesCount = allLibraryGems.filter(g => activeGemIds.has(g.id) && g.isHostFavorite).length;

  const handleToggle = (gemId: string) => {
    togglePropertyGem(property.id, gemId);
    const willBeActive = !activeGemIds.has(gemId);
    showToast(willBeActive ? 'Added to guest guide recommendations' : 'Removed from guest guide');
  };

  const handleCreateCustomGem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a spot name');
      return;
    }

    const customId = `gem-custom-${Date.now()}`;
    const itemsList = newWhatToTry
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const fallbackImages: Record<GemExperience, string> = {
      eat: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      drink: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      explore: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      escape: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      experience: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      local_life: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    };

    const newGem: StumariGem = {
      id: customId,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Host Secret Recommendation',
      type: 'host',
      experience: newExperience,
      subCategory: 'Host Secret',
      moods: ['nearby'],
      distance: newDistance || 'Nearby',
      priceLevel: newPrice,
      timeNeeded: '1–2 hours',
      bestTime: 'Anytime',
      whyWeRecommend: newWhyRecommend.trim() || 'A personal favorite spot recommended by your host.',
      whatToTry: itemsList.length > 0 ? itemsList : ['House specialty'],
      localTip: newHostQuote.trim() || 'Mention that your Stumari host recommended this spot!',
      hostQuote: newHostQuote.trim() || 'One of my personal favorite hidden gems.',
      address: newAddress.trim() || property.city,
      mapsUrl: newMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(newTitle + ' ' + property.city)}`,
      image: newImageUrl.trim() || fallbackImages[newExperience] || fallbackImages.eat,
      isHostFavorite: true,
      rating: 5,
    };

    addCustomGem(newGem);
    togglePropertyGem(property.id, customId);
    showToast('Created custom recommendation & added to your guide!');

    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewAddress('');
    setNewMapsUrl('');
    setNewWhatToTry('');
    setNewHostQuote('');
    setNewWhyRecommend('');
    setNewImageUrl('');
    setIsAddModalOpen(false);
  };

  const experienceButtons = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'eat', label: 'Eat & Dine', icon: Utensils },
    { id: 'drink', label: 'Wine & Bars', icon: Wine },
    { id: 'coffee', label: 'Craft Coffee', icon: Coffee },
    { id: 'see', label: 'Sightseeing', icon: Eye },
    { id: 'hidden', label: 'Hidden Yards', icon: Compass },
    { id: 'night', label: 'Nightlife', icon: Moon },
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Curator Banner */}
      <div className={`p-6 sm:p-7 rounded-[30px] border relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-[#12181C] via-[#161F25] to-[#111619] border-stone-800 text-stone-100 shadow-xl' 
          : 'bg-gradient-to-br from-[#FAF8F5] via-white to-[#F2EFE9] border-stone-200 text-stone-900 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                Local Neighborhood Curator · Stumari Gems
              </span>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-tight">
              Curate Insider Spots for {property.title}
            </h2>
            
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              Personal recommendations are the single biggest driver of 5-star host reviews. Select authentic local spots from our hand-picked library or add your own secret courtyard gems with custom tips.
            </p>

            {/* Quick counters */}
            <div className="flex items-center gap-4 pt-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{activeCount} Active in Guide</span>
              </div>
              <span className="opacity-40">·</span>
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{favoritesCount} Host Favorites</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0 self-start md:self-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Spot</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => navigateToGuestGuide(property.slug)}
              className={`px-4 py-2.5 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isDark ? 'border-stone-700 bg-stone-900/80 text-stone-200 hover:bg-stone-800' : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
              }`}
            >
              <span>Preview in Guide</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
        isDark ? 'bg-[#14191D] border-stone-800' : 'bg-stone-50 border-stone-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search spots, khinkali, craft coffee, wine bars, addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-[#0E1215] border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-500' 
                  : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-amber-600'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Toggle Active Only */}
          <button
            onClick={() => setFilterActiveOnly(!filterActiveOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              filterActiveOnly
                ? isDark ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : isDark ? 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700' : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active in Guide ({activeCount})</span>
          </button>
        </div>

        {/* Experience Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {experienceButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = selectedExperience === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedExperience(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? isDark 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' 
                      : 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                    : isDark 
                      ? 'bg-[#0E1316] text-stone-300 border-stone-800 hover:bg-stone-800/60' 
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gems Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGems.map((gem) => {
          const isActive = activeGemIds.has(gem.id);

          return (
            <motion.div
              key={gem.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              whileHover={{ y: -3 }}
              className={`rounded-[24px] border overflow-hidden flex flex-col justify-between transition-all relative ${
                isActive
                  ? isDark 
                    ? 'bg-[#151C20] border-emerald-500/40 shadow-lg shadow-emerald-950/20' 
                    : 'bg-white border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                  : isDark 
                    ? 'bg-[#101417] border-stone-800/80 opacity-80 hover:opacity-100' 
                    : 'bg-white border-stone-200 opacity-90 hover:opacity-100 shadow-xs'
              }`}
            >
              {/* Card Image */}
              <div className="h-36 sm:h-40 relative overflow-hidden group">
                <img 
                  src={gem.image} 
                  alt={gem.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges in Image */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase backdrop-blur-md ${
                    gem.experience === 'eat' ? 'bg-amber-500/80 text-black' :
                    gem.experience === 'drink' ? 'bg-rose-500/80 text-white' :
                    gem.experience === 'explore' ? 'bg-sky-500/80 text-white' :
                    gem.experience === 'escape' ? 'bg-teal-500/80 text-white' :
                    'bg-emerald-500/80 text-white'
                  }`}>
                    {gem.subCategory || gem.experience}
                  </span>

                  {gem.isHostFavorite && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-stone-950" />
                      <span>Host Pick</span>
                    </span>
                  )}
                </div>

                {/* Bottom title overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-base leading-snug truncate drop-shadow-sm">
                    {gem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] opacity-90 font-medium">
                    <span>{gem.distance}</span>
                    <span>·</span>
                    <span className="font-mono">{gem.priceLevel}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {gem.whyWeRecommend}
                  </p>

                  {/* Host Tip quote */}
                  {(gem.hostQuote || gem.localTip) && (
                    <div className={`p-2.5 rounded-xl border text-[11px] leading-snug flex items-start gap-2 ${
                      isDark ? 'bg-[#0D1215] border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}>
                      <MessageSquareHeart className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">"{gem.hostQuote || gem.localTip}"</span>
                    </div>
                  )}

                  {/* What to try tags */}
                  {gem.whatToTry && gem.whatToTry.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {gem.whatToTry.slice(0, 3).map((item, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            isDark ? 'bg-stone-800/90 text-stone-300' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? 'border-stone-800' : 'border-stone-200'
                }`}>
                  <a
                    href={gem.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                      isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>Maps</span>
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                  </a>

                  {/* Main Toggle Button */}
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleToggle(gem.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : isDark
                        ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Guide</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredGems.length === 0 && (
        <div className={`p-10 rounded-[28px] border text-center space-y-3 ${
          isDark ? 'bg-[#121619] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600'
        }`}>
          <Compass className="w-8 h-8 mx-auto text-stone-500 animate-spin" />
          <h3 className="font-serif text-lg font-bold">No recommendations match your search</h3>
          <p className="text-xs">Try different keywords or click "Add Custom Spot" to create your own recommendation.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedExperience('all');
              setFilterActiveOnly(false);
            }}
            className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add Custom Spot Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`w-full max-w-lg rounded-[32px] border p-6 sm:p-7 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar space-y-5 ${
                isDark ? 'bg-[#13191D] border-stone-700 text-stone-100' : 'bg-white border-stone-300 text-stone-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-4 border-stone-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight">Add Secret Local Gem</h3>
                    <span className="text-[11px] opacity-60">Personal host recommendation for {property.city}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-800/40 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomGem} className="space-y-4 text-xs">
                <div>
                  <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Spot Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amo Rame Bani, Café Linville, Hidden Waterfall"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Category</label>
                    <select
                      value={newExperience}
                      onChange={(e) => setNewExperience(e.target.value as GemExperience)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#0B0F12] border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                      }`}
                    >
                      <option value="eat">🍽️ Eat & Dine</option>
                      <option value="drink">🍷 Wine & Cocktails</option>
                      <option value="explore">🏛️ Explore & Courtyards</option>
                      <option value="escape">🌿 Escape & Scenic Views</option>
                      <option value="experience">✨ Sulfur Baths & Local Art</option>
                      <option value="local_life">🛍️ Markets & Local Life</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Walking Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 min walk (300m)"
                      value={newDistance}
                      onChange={(e) => setNewDistance(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#0B0F12] border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Address / Neighborhood</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Galaktion Tabidze St"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#0B0F12] border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Price Level</label>
                    <select
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value as any)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isDark ? 'bg-[#0B0F12] border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                      }`}
                    >
                      <option value="$">$ (Budget friendly)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Upscale)</option>
                      <option value="Free">Free (Viewpoint / Walk)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Host Insider Quote / Tip *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Order the wild herb khinkali and ask to sit in the vine courtyard under the fig tree!"
                    value={newHostQuote}
                    onChange={(e) => setNewHostQuote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">What to Try (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Badrijani, Saperavi wine, Shkmeruli"
                    value={newWhatToTry}
                    onChange={(e) => setNewWhatToTry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase font-bold text-[10px] tracking-wider block mb-1 opacity-70">Photo URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono focus:outline-none bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-amber-600 dark:focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className={`px-4 py-2.5 rounded-full border text-xs font-semibold ${
                      isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                  >
                    Save & Include in Guide
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
