import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Sparkles, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  Maximize2, 
  X, 
  Plus, 
  Tag, 
  Wand2,
  Loader2,
  GripVertical
} from 'lucide-react';
import { PropertyPhotoAsset, ApplianceGuide } from '../../types';
import { SAMPLE_PHOTO_BUNDLES } from '../../data/templateData';
import { useApp } from '../../context/AppContext';
import { uploadMediaFile } from '../../firebase';

interface SmartPhotoBuilderProps {
  photos: PropertyPhotoAsset[];
  onChange: (photos: PropertyPhotoAsset[]) => void;
  onCoverChange?: (coverUrl: string) => void;
  onDraftGenerated?: (draft: {
    welcomeGreeting?: string;
    arrivalDirections?: string;
    suggestedAppliances?: Partial<ApplianceGuide>[];
    suggestedSections?: string[];
  }) => void;
}

const ROOM_CATEGORIES: {
  id: PropertyPhotoAsset['roomCategory'];
  labelEn: string;
  labelKa: string;
  suggestedSectionEn: string;
  suggestedSectionKa: string;
  sectionKey: 'checkin' | 'welcome' | 'how-it-works' | 'rules';
}[] = [
  { id: 'entrance', labelEn: 'Building & Entrance', labelKa: 'შესასვლელი & ეზო', suggestedSectionEn: 'Arrival & Check-in', suggestedSectionKa: 'მოსვლა & შესვლა', sectionKey: 'checkin' },
  { id: 'living', labelEn: 'Living Room', labelKa: 'მისაღები ოთახი', suggestedSectionEn: 'Welcome & Space Gallery', suggestedSectionKa: 'მისალმება & სივრცე', sectionKey: 'welcome' },
  { id: 'kitchen', labelEn: 'Kitchen & Dining', labelKa: 'სამზარეულო', suggestedSectionEn: 'Visual How-To & Appliances', suggestedSectionKa: 'ვიზუალური გიდი & ტექნიკა', sectionKey: 'how-it-works' },
  { id: 'bedroom', labelEn: 'Sleeping Areas', labelKa: 'საძინებელი', suggestedSectionEn: 'Welcome & Space Gallery', suggestedSectionKa: 'მისალმება & სივრცე', sectionKey: 'welcome' },
  { id: 'bathroom', labelEn: 'Bathroom & Water', labelKa: 'აბაზანა', suggestedSectionEn: 'Welcome & Space Gallery', suggestedSectionKa: 'მისალმება & სივრცე', sectionKey: 'welcome' },
  { id: 'balcony', labelEn: 'Balcony & Views', labelKa: 'აივანი & ხედი', suggestedSectionEn: 'Welcome & Space Gallery', suggestedSectionKa: 'მისალმება & სივრცე', sectionKey: 'welcome' },
  { id: 'amenity', labelEn: 'Appliances & Amenities', labelKa: 'ტექნიკა & კომფორტი', suggestedSectionEn: 'Visual How-To & Appliances', suggestedSectionKa: 'ვიზუალური გიდი & ტექნიკა', sectionKey: 'how-it-works' },
  { id: 'other', labelEn: 'Other Details', labelKa: 'სხვა დეტალი', suggestedSectionEn: 'House Rules & Notes', suggestedSectionKa: 'წესები & დეტალები', sectionKey: 'rules' }
];

export const SmartPhotoBuilder: React.FC<SmartPhotoBuilderProps> = ({
  photos,
  onChange,
  onCoverChange,
  onDraftGenerated
}) => {
  const { theme, showToast, language } = useApp();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PropertyPhotoAsset | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);

  // Host Approval Draft State
  const [pendingDraft, setPendingDraft] = useState<{
    welcomeGreeting: string;
    arrivalDirections: string;
    suggestedAppliances: Partial<ApplianceGuide>[];
    selectedApplianceIndices: number[];
    sectionSummary: { sectionEn: string; sectionKa: string; count: number }[];
  } | null>(null);

  // File selection & Storage / compressed upload conversion
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const validFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast(language === 'ka' ? 'გთხოვთ აირჩიოთ სურათები (JPG, PNG, WEBP)' : 'Please select valid image files');
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = validFiles.map(async (file, idx) => {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storagePath = `properties/photos/${Date.now()}-${idx}-${sanitizedName}`;
        
        // Upload to Firebase Storage with automatic compressed client fallback
        const url = await uploadMediaFile(file, storagePath);

        // Smart category guessing based on filename
        const fname = file.name.toLowerCase();
        let guessedCat: PropertyPhotoAsset['roomCategory'] = 'living';
        if (fname.includes('bed') || fname.includes('sleep')) guessedCat = 'bedroom';
        else if (fname.includes('bath') || fname.includes('shower') || fname.includes('toilet')) guessedCat = 'bathroom';
        else if (fname.includes('kitchen') || fname.includes('coffee') || fname.includes('cook')) guessedCat = 'kitchen';
        else if (fname.includes('balcony') || fname.includes('terrace') || fname.includes('view')) guessedCat = 'balcony';
        else if (fname.includes('door') || fname.includes('gate') || fname.includes('entrance') || fname.includes('entry')) guessedCat = 'entrance';
        else if (fname.includes('ac') || fname.includes('washer') || fname.includes('tv') || fname.includes('boiler')) guessedCat = 'amenity';

        const asset: PropertyPhotoAsset = {
          id: `photo-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
          url,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          roomCategory: guessedCat,
          order: photos.length + idx + 1,
          isCover: photos.length === 0 && idx === 0
        };
        return asset;
      });

      const newAssets = await Promise.all(uploadPromises);
      const merged = [...photos, ...newAssets];
      onChange(merged);
      if (photos.length === 0 && newAssets[0] && onCoverChange) {
        onCoverChange(newAssets[0].url);
      }
      showToast(
        language === 'ka' 
          ? `${newAssets.length} სურათი წარმატებით აიტვირთა!` 
          : `Uploaded ${newAssets.length} photos successfully!`
      );
    } catch (err: any) {
      console.error('Failed to upload photos:', err);
      showToast(language === 'ka' ? 'ფოტოების ატვირთვა ვერ მოხერხდა' : 'Photo upload failed', 'info');
    } finally {
      setIsUploading(false);
    }
  };

  // Load sample photo bundle
  const loadSampleBundle = (bundleName: string) => {
    const bundle = SAMPLE_PHOTO_BUNDLES.find(b => b.name === bundleName);
    if (!bundle) return;

    const formatted: PropertyPhotoAsset[] = bundle.photos.map((item, idx) => ({
      ...item,
      id: `photo-sample-${idx}-${Date.now()}`,
      order: idx + 1
    }));

    onChange(formatted);
    const cover = formatted.find(p => p.isCover) || formatted[0];
    if (cover && onCoverChange) {
      onCoverChange(cover.url);
    }
    showToast(
      language === 'ka' 
        ? `ჩაიტვირთა "${bundle.name}" ფოტოების კოლექცია` 
        : `Loaded "${bundle.name}" sample photo collection`
    );
  };

  // Reorder photos via arrow buttons
  const movePhoto = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;

    const updated = [...photos];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    // update order indices
    const reordered = updated.map((p, i) => ({ ...p, order: i + 1 }));
    onChange(reordered);
  };

  // Drag-and-drop reorder between two photo cards
  const handlePhotoReorderDrop = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const sourceIdx = photos.findIndex(p => p.id === sourceId);
    const targetIdx = photos.findIndex(p => p.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const updated = [...photos];
    const [moved] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, moved);
    const reordered = updated.map((p, i) => ({ ...p, order: i + 1 }));
    onChange(reordered);
    showToast(
      language === 'ka'
        ? `ფოტო გადაადგილდა პოზიციაზე #${targetIdx + 1}`
        : `Moved photo to position #${targetIdx + 1}`
    );
  };

  // Drag photo onto a room category pill to reassign its room
  const handleCategoryDrop = (photoId: string, category: PropertyPhotoAsset['roomCategory']) => {
    const updated = photos.map(p => p.id === photoId ? { ...p, roomCategory: category } : p);
    onChange(updated);
    const catMeta = ROOM_CATEGORIES.find(c => c.id === category);
    const catLabel = catMeta ? (language === 'ka' ? catMeta.labelKa : catMeta.labelEn) : category;
    showToast(
      language === 'ka'
        ? `ფოტო მიენიჭა ოთახს: ${catLabel}`
        : `Assigned photo to ${catLabel}`
    );
  };

  // Set as primary cover
  const setCover = (photoId: string) => {
    const updated = photos.map(p => ({
      ...p,
      isCover: p.id === photoId
    }));
    onChange(updated);
    const target = photos.find(p => p.id === photoId);
    if (target && onCoverChange) {
      onCoverChange(target.url);
    }
    showToast(language === 'ka' ? 'მთავარი ყდის ფოტო განახლდა' : 'Primary cover photo selected');
  };

  // Delete photo
  const deletePhoto = (photoId: string) => {
    const remaining = photos.filter(p => p.id !== photoId);
    if (remaining.length > 0 && !remaining.some(p => p.isCover)) {
      remaining[0].isCover = true;
      if (onCoverChange) onCoverChange(remaining[0].url);
    }
    onChange(remaining);
    showToast(language === 'ka' ? 'ფოტო წაიშალა' : 'Photo removed');
  };

  // Update room category
  const updateCategory = (photoId: string, category: PropertyPhotoAsset['roomCategory']) => {
    const updated = photos.map(p => p.id === photoId ? { ...p, roomCategory: category } : p);
    onChange(updated);
  };

  // Update caption
  const updateCaption = (photoId: string, caption: string) => {
    const updated = photos.map(p => p.id === photoId ? { ...p, caption } : p);
    onChange(updated);
  };

  // Auto-sort by natural guest arrival journey (entrance -> living -> kitchen -> bedroom -> bathroom -> balcony)
  const autoSortByRoom = () => {
    const priorityOrder: Record<PropertyPhotoAsset['roomCategory'], number> = {
      entrance: 1,
      living: 2,
      kitchen: 3,
      bedroom: 4,
      bathroom: 5,
      balcony: 6,
      amenity: 7,
      other: 8
    };

    const sorted = [...photos].sort((a, b) => {
      const orderA = priorityOrder[a.roomCategory] || 99;
      const orderB = priorityOrder[b.roomCategory] || 99;
      return orderA - orderB;
    }).map((p, idx) => ({ ...p, order: idx + 1 }));

    onChange(sorted);
    showToast(
      language === 'ka' 
        ? 'ფოტოები დალაგდა ოთახების მიხედვით (შესასვლელიდან აივნამდე)' 
        : 'Photos organized by guest journey: Entrance → Living → Kitchen → Sleeping'
    );
  };

  // Generate draft description, section mapping, and suggested how-to guides from photos for host approval
  const handleGenerateDraft = () => {
    if (photos.length === 0) {
      showToast(language === 'ka' ? 'გთხოვთ ჯერ ატვირთოთ ფოტოები' : 'Please upload photos first');
      return;
    }

    setIsGeneratingDraft(true);
    setTimeout(() => {
      setIsGeneratingDraft(false);

      const hasKitchen = photos.some(p => p.roomCategory === 'kitchen');
      const hasEntrance = photos.some(p => p.roomCategory === 'entrance');
      const hasBalcony = photos.some(p => p.roomCategory === 'balcony');
      const hasAmenity = photos.some(p => p.roomCategory === 'amenity');
      const hasLiving = photos.some(p => p.roomCategory === 'living');
      const hasBedroom = photos.some(p => p.roomCategory === 'bedroom');
      const hasBathroom = photos.some(p => p.roomCategory === 'bathroom');

      // Synthesize a warm, accurate draft welcome description from detected rooms & photo captions
      const roomHighlightsEn: string[] = [];
      const roomHighlightsKa: string[] = [];
      if (hasLiving) {
        roomHighlightsEn.push('a sunlit living area');
        roomHighlightsKa.push('ნათელი მისაღები ოთახით');
      }
      if (hasBedroom) {
        roomHighlightsEn.push('quiet sleeping quarters');
        roomHighlightsKa.push('მყუდრო საძინებლით');
      }
      if (hasKitchen) {
        roomHighlightsEn.push('a fully equipped kitchen & coffee station');
        roomHighlightsKa.push('სრულად აღჭურვილი სამზარეულოთი');
      }
      if (hasBalcony) {
        roomHighlightsEn.push('a private balcony overlooking the neighborhood');
        roomHighlightsKa.push('აივნით და ლამაზი ხედით');
      }
      if (hasBathroom) {
        roomHighlightsEn.push('a modern bathroom with fresh linens');
        roomHighlightsKa.push('თანამედროვე აბაზანით');
      }

      const captionNotes = photos
        .map(p => p.caption?.trim())
        .filter((c): c is string => !!c && c.length > 3 && !c.startsWith('photo'))
        .slice(0, 3);

      const welcomeGreeting = language === 'ka'
        ? `კეთილი იყოს თქვენი მობრძანება! ბინა გთავაზობთ კომფორტულ გარემოს ${roomHighlightsKa.length > 0 ? roomHighlightsKa.join(', ') : 'ყველა საჭირო დეტალით'}. ქვემოთ იხილავთ Wi-Fi კოდს, შესვლის ვიზუალურ ინსტრუქციას და ტექნიკის მართვის მოკლე გიდებს.`
        : `Welcome home! Make yourself comfortable in this thoughtfully prepared space featuring ${roomHighlightsEn.length > 0 ? roomHighlightsEn.join(', ') : 'everything needed for a relaxing stay'}${captionNotes.length > 0 ? ` (${captionNotes.join(', ')})` : ''}. Below you'll find one-tap Wi-Fi, visual arrival steps, and 15-second appliance guides.`;

      const entrancePhoto = photos.find(p => p.roomCategory === 'entrance');
      const arrivalDirections = hasEntrance
        ? (language === 'ka'
            ? `იხილეთ შესასვლელის ფოტო გიდში (${entrancePhoto?.caption || 'მთავარი კარი'}). შეიყვანეთ კოდი კლავიატურაზე, შეაღეთ ჭიშკარი და ადით სადარბაზოში.`
            : `Follow the entrance photo (${entrancePhoto?.caption || 'Building gate'}) in the Check-in card. Enter the keypad code followed by #, push the gate gently while it buzzes, and head up to the apartment door.`)
        : '';

      const suggestedAppliances: Partial<ApplianceGuide>[] = [];

      if (hasKitchen) {
        suggestedAppliances.push({
          title: 'Espresso Coffee Machine',
          icon: 'Coffee',
          category: 'kitchen',
          instructions: 'Complimentary coffee beans in pantry. Press power switch and slide portafilter snug.',
          troubleshooting: 'Ensure rear water tank has filtered water.'
        });
      }

      suggestedAppliances.push({
        title: 'Climate Control (AC & Heat)',
        icon: 'Thermometer',
        category: 'climate',
        instructions: 'Wall remote near hallway. Optimal temperature 22°C for peaceful sleep.',
        troubleshooting: hasBalcony ? 'Balcony sensor pauses cooling if French doors remain unlatched.' : undefined
      });

      if (hasEntrance) {
        suggestedAppliances.push({
          title: 'How to Find the Apartment Entrance',
          icon: 'KeyRound',
          category: 'access',
          instructions: 'Enter code followed by #. Electric latch buzzes for 5 seconds; push door firmly.',
          troubleshooting: 'Press * to reset code buffer if digit mistyped.'
        });
      }

      if (hasAmenity) {
        suggestedAppliances.push({
          title: 'Eco Washing Machine',
          icon: 'Shirt',
          category: 'laundry',
          instructions: 'Pods in cabinet under sink. Set to Quick 30° cycle for freshening travel clothing.',
          troubleshooting: 'Child lock key icon clears by holding Start button 3 seconds.'
        });
      }

      // Compute section distribution summary
      const welcomeCount = photos.filter(p => ['living', 'bedroom', 'bathroom', 'balcony'].includes(p.roomCategory)).length;
      const checkinCount = photos.filter(p => p.roomCategory === 'entrance').length;
      const howToCount = photos.filter(p => ['kitchen', 'amenity'].includes(p.roomCategory)).length;
      const rulesCount = photos.filter(p => p.roomCategory === 'other').length;

      const sectionSummary = [
        { sectionEn: 'Welcome & Space Gallery', sectionKa: 'მისალმება & სივრცე', count: welcomeCount },
        { sectionEn: 'Arrival & Check-in Section', sectionKa: 'მოსვლა & შესვლა', count: checkinCount },
        { sectionEn: 'Visual How-To & Appliances', sectionKa: 'ვიზუალური გიდი & ტექნიკა', count: howToCount },
        ...(rulesCount > 0 ? [{ sectionEn: 'House Rules & Notes', sectionKa: 'წესები & დეტალები', count: rulesCount }] : [])
      ];

      setPendingDraft({
        welcomeGreeting,
        arrivalDirections,
        suggestedAppliances,
        selectedApplianceIndices: suggestedAppliances.map((_, idx) => idx),
        sectionSummary
      });

      showToast(
        language === 'ka' 
          ? 'მონახაზი მზადაა! გადახედეთ და დაადასტურეთ ქვემოთ.' 
          : 'Draft ready! Review and approve the suggested description & sections below.'
      );
    }, 600);
  };

  // Host approves draft
  const handleApproveDraft = () => {
    if (!pendingDraft) return;
    const approvedAppliances = pendingDraft.suggestedAppliances.filter((_, idx) =>
      pendingDraft.selectedApplianceIndices.includes(idx)
    );

    if (onDraftGenerated) {
      onDraftGenerated({
        welcomeGreeting: pendingDraft.welcomeGreeting,
        arrivalDirections: pendingDraft.arrivalDirections || undefined,
        suggestedAppliances: approvedAppliances,
        suggestedSections: ['welcome', 'arrival', 'wifi', 'appliances', 'rules', 'explore']
      });
    }

    setPendingDraft(null);
    showToast(
      language === 'ka'
        ? 'მონახაზი დადასტურდა და აისახა გიდში!'
        : `Approved! Applied draft description and ${approvedAppliances.length} visual guides.`
    );
  };

  const filteredPhotos = activeFilter === 'all' 
    ? photos 
    : photos.filter(p => p.roomCategory === activeFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark 
          ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' 
          : 'bg-[#FBF9F6] border-[#EBE6DF] text-[#1C1B1A]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg">
              {language === 'ka' ? 'ფოტოებით გიდის შემქმნელი' : 'Smart Photo Guide Builder'}
            </span>
            <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-amber-950/40 text-amber-300 border-amber-800/50' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {photos.length} {language === 'ka' ? 'ფოტო' : 'photos'}
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
            {language === 'ka'
              ? 'ატვირთეთ ბინის ფოტოები ერთად. სისტემა ავტომატურად დააჯგუფებს ოთახებს და შექმნის ინსტრუქციების მონახაზს.'
              : 'Upload apartment photos together. Stumari organizes rooms and generates draft guide instructions for your review.'}
          </p>
        </div>

        {/* Quick sample loader & smart generate draft */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="dropdown relative">
            <button
              type="button"
              onClick={() => loadSampleBundle('Tbilisi Historic Residence')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs ${
                isDark 
                  ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-750' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ka' ? 'სანიმუშო ფოტოები' : 'Sample Photos'}</span>
            </button>
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={autoSortByRoom}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs ${
                isDark 
                  ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-750' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              <span>{language === 'ka' ? 'ოთახების დალაგება' : 'Auto-Order Rooms'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGenerateDraft}
            disabled={photos.length === 0 || isGeneratingDraft}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm ${
              photos.length === 0
                ? 'opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 text-zinc-500'
                : 'bg-[#B85D3B] hover:bg-[#A35132] text-white active:scale-98'
            }`}
          >
            <Wand2 className={`w-3.5 h-3.5 ${isGeneratingDraft ? 'animate-spin' : ''}`} />
            <span>
              {isGeneratingDraft
                ? (language === 'ka' ? 'მუშავდება...' : 'Drafting...')
                : (language === 'ka' ? 'მონახაზის გენერირება' : 'Generate Guide Draft')}
            </span>
          </button>
        </div>
      </div>

      {/* Host Approval Panel for Generated Guide Draft */}
      <AnimatePresence>
        {pendingDraft && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-5 rounded-2xl border-2 space-y-4 shadow-md ${
              isDark
                ? 'bg-zinc-900/90 border-[#B85D3B]/60 text-zinc-100'
                : 'bg-amber-50/40 border-[#B85D3B]/50 text-stone-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B85D3B] text-white flex items-center justify-center shrink-0">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base">
                    {language === 'ka' ? 'გადახედეთ და დაადასტურეთ გიდის მონახაზი' : 'Review & Approve Smart Guide Draft'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    {language === 'ka'
                      ? 'შექმნილია თქვენი ფოტოებისა და ოთახების მიხედვით. შეგიძლიათ ჩაასწოროთ დამტკიცებამდე.'
                      : 'Generated from your uploaded photos and room labels. Edit anything before approving.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingDraft(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Guide Section Mapping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {pendingDraft.sectionSummary.map((sec, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-stone-200'
                  }`}
                >
                  <span className="text-xs font-medium">
                    {language === 'ka' ? sec.sectionKa : sec.sectionEn}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#B85D3B]/15 text-[#B85D3B] dark:text-amber-400">
                    {sec.count} {language === 'ka' ? 'ფოტო' : 'photos'}
                  </span>
                </div>
              ))}
            </div>

            {/* Draft Welcome Description for Host Approval */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>{language === 'ka' ? 'შემოთავაზებული მისასალმებელი აღწერა' : 'Draft Welcome & Space Description'}</span>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                  {language === 'ka' ? 'რედაქტირებადი' : 'Editable before approval'}
                </span>
              </label>
              <textarea
                rows={3}
                value={pendingDraft.welcomeGreeting}
                onChange={(e) => setPendingDraft({ ...pendingDraft, welcomeGreeting: e.target.value })}
                className={`w-full text-xs p-3 rounded-xl border focus:outline-none leading-relaxed ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                }`}
              />
            </div>

            {/* Draft Arrival Directions (if entrance photo detected) */}
            {pendingDraft.arrivalDirections && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">
                  {language === 'ka' ? 'შემოთავაზებული შესვლის ინსტრუქცია (შესასვლელის ფოტოდან)' : 'Draft Arrival Note (from Entrance photo)'}
                </label>
                <textarea
                  rows={2}
                  value={pendingDraft.arrivalDirections}
                  onChange={(e) => setPendingDraft({ ...pendingDraft, arrivalDirections: e.target.value })}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none leading-relaxed ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>
            )}

            {/* Suggested Visual How-To Guides Checkboxes */}
            <div className="space-y-2">
              <span className="text-xs font-semibold block">
                {language === 'ka' ? 'შემოთავაზებული ვიზუალური ინსტრუქციები:' : 'Suggested Visual How-To Guides to create:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pendingDraft.suggestedAppliances.map((app, idx) => {
                  const isChecked = pendingDraft.selectedApplianceIndices.includes(idx);
                  return (
                    <label
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-colors ${
                        isChecked
                          ? isDark ? 'bg-zinc-800 border-[#B85D3B]/60' : 'bg-white border-[#B85D3B]'
                          : isDark ? 'bg-zinc-900/50 border-zinc-800 opacity-60' : 'bg-stone-50 border-stone-200 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const exists = pendingDraft.selectedApplianceIndices.includes(idx);
                          const next = exists
                            ? pendingDraft.selectedApplianceIndices.filter(i => i !== idx)
                            : [...pendingDraft.selectedApplianceIndices, idx];
                          setPendingDraft({ ...pendingDraft, selectedApplianceIndices: next });
                        }}
                        className="mt-0.5 accent-[#B85D3B]"
                      />
                      <div>
                        <span className="font-semibold block">{app.title}</span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 line-clamp-1">{app.instructions}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Approve / Dismiss Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingDraft(null)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                {language === 'ka' ? 'გაუქმება' : 'Dismiss'}
              </button>
              <button
                type="button"
                onClick={handleApproveDraft}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ka' ? 'დადასტურება და გიდში ასახვა' : 'Approve & Apply to Guide'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all duration-200 ${
          isDragging 
            ? 'border-[#B85D3B] bg-[#B85D3B]/5 scale-[1.005]' 
            : isDark 
            ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70' 
            : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleFiles(e.target.files)} 
        />
        
        <div className="max-w-md mx-auto space-y-2">
          <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border shadow-xs ${
            isDark ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-white border-stone-200 text-[#B85D3B]'
          }`}>
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <span className="font-semibold text-sm">
              {isUploading
                ? (language === 'ka' ? 'სურათები იტვირთება და ოპტიმიზდება...' : 'Uploading & optimizing images...')
                : (language === 'ka' ? 'დააწკაპუნეთ ან გადმოათრიეთ ფოტოები აქ' : 'Drag & drop multiple property photos here')}
            </span>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
              {language === 'ka' 
                ? 'მხარდაჭერილია JPG, PNG, WEBP. შეგიძლიათ ატვირთოთ 10-20 ფოტო ერთდროულად.' 
                : 'Supports JPG, PNG, WEBP. Upload living room, bedroom, kitchen, appliances & arrival gate.'}
            </p>
          </div>
        </div>
      </div>

      {/* Room Category Filter Bar (Also supports dropping a photo onto a category pill) */}
      {photos.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400">
            <span>
              {language === 'ka'
                ? '💡 გადაათრიეთ ფოტოები თანმიმდევრობის შესაცვლელად ან ჩააგდეთ ოთახის კატეგორიაზე'
                : '💡 Drag & drop photo cards to reorder, or drop onto a room tab below to reassign'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'all'
                  ? isDark ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'bg-stone-900 text-white font-semibold'
                  : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ka' ? 'ყველა ფოტო' : 'All Photos'} ({photos.length})
            </button>
            
            {ROOM_CATEGORIES.map(cat => {
              const count = photos.filter(p => p.roomCategory === cat.id).length;
              if (count === 0 && !draggedPhotoId) return null;
              const isDropTarget = dragOverCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFilter(cat.id)}
                  onDragOver={(e) => {
                    if (!draggedPhotoId) return;
                    e.preventDefault();
                    setDragOverCategoryId(cat.id);
                  }}
                  onDragLeave={() => {
                    if (dragOverCategoryId === cat.id) setDragOverCategoryId(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedPhotoId) {
                      handleCategoryDrop(draggedPhotoId, cat.id);
                    }
                    setDraggedPhotoId(null);
                    setDragOverCategoryId(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isDropTarget
                      ? 'ring-2 ring-[#B85D3B] bg-[#B85D3B]/15 text-[#B85D3B] dark:text-amber-400 scale-105'
                      : activeFilter === cat.id
                      ? isDark ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'bg-stone-900 text-white font-semibold'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/50' : 'text-stone-600 hover:text-stone-900 bg-stone-100'
                  }`}
                >
                  <span>{language === 'ka' ? cat.labelKa : cat.labelEn}</span>
                  <span className="text-[10px] opacity-75 tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredPhotos.map((photo) => {
              const actualIndex = photos.findIndex(p => p.id === photo.id);
              const isCover = photo.isCover;
              const isBeingDragged = draggedPhotoId === photo.id;
              const isDropOver = dragOverPhotoId === photo.id && draggedPhotoId !== photo.id;

              return (
                <motion.div
                  key={photo.id}
                  layout
                  draggable
                  onDragStart={(e: any) => {
                    setDraggedPhotoId(photo.id);
                    if (e?.dataTransfer) {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', photo.id);
                    }
                  }}
                  onDragOver={(e: any) => {
                    e.preventDefault();
                    if (draggedPhotoId && draggedPhotoId !== photo.id) {
                      setDragOverPhotoId(photo.id);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverPhotoId === photo.id) {
                      setDragOverPhotoId(null);
                    }
                  }}
                  onDrop={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (draggedPhotoId && draggedPhotoId !== photo.id) {
                      handlePhotoReorderDrop(draggedPhotoId, photo.id);
                    }
                    setDraggedPhotoId(null);
                    setDragOverPhotoId(null);
                  }}
                  onDragEnd={() => {
                    setDraggedPhotoId(null);
                    setDragOverPhotoId(null);
                    setDragOverCategoryId(null);
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: isBeingDragged ? 0.45 : 1, scale: isDropOver ? 1.02 : 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`rounded-2xl border overflow-hidden flex flex-col transition-all shadow-xs group relative cursor-grab active:cursor-grabbing ${
                    isDropOver
                      ? 'ring-2 ring-dashed ring-[#B85D3B] border-[#B85D3B] bg-[#B85D3B]/5'
                      : isCover 
                      ? 'ring-2 ring-[#B85D3B] border-transparent' 
                      : isDark ? 'bg-[#181716] border-[#2B2926]' : 'bg-white border-stone-200'
                  }`}
                >
                  {/* Photo Image Frame */}
                  <div className="relative aspect-video w-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption || 'Property photo'} 
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 select-none pointer-events-none" 
                    />
                    
                    {/* Top-Left Badges: Drag Handle + Cover Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <div
                        title={language === 'ka' ? 'გადაათრიეთ დასალაგებლად' : 'Drag to reorder'}
                        className="px-1.5 py-1 rounded-md bg-black/65 text-white/90 backdrop-blur-xs flex items-center gap-0.5 text-[10px] font-mono shadow-xs"
                      >
                        <GripVertical className="w-3.5 h-3.5 text-amber-400" />
                        <span>#{photo.order || actualIndex + 1}</span>
                      </div>

                      {isCover && (
                        <div className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider uppercase bg-[#B85D3B] text-white shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Cover Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => setCover(photo.id)}
                          title="Set as main cover"
                          className="w-7 h-7 rounded-lg bg-black/70 hover:bg-[#B85D3B] text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto(photo)}
                        title="Expand view"
                        className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePhoto(photo.id)}
                        title="Delete photo"
                        className="w-7 h-7 rounded-lg bg-black/70 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Drop Target Indicator Overlay */}
                    {isDropOver && (
                      <div className="absolute inset-0 bg-[#B85D3B]/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1.5 rounded-xl bg-black/80 text-white text-xs font-semibold shadow-lg">
                          {language === 'ka' ? 'ჩასვით აქ' : 'Drop to place here'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Photo Metadata Card Content */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Room Category Selector */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-stone-500 dark:text-zinc-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{language === 'ka' ? 'ოთახი:' : 'Room:'}</span>
                        </span>
                        <select
                          value={photo.roomCategory}
                          onChange={(e) => updateCategory(photo.id, e.target.value as PropertyPhotoAsset['roomCategory'])}
                          className={`text-xs font-medium px-2 py-1 rounded-lg border focus:outline-none transition-colors ${
                            isDark 
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-200 focus:border-zinc-500' 
                              : 'bg-stone-50 border-stone-200 text-stone-800 focus:border-stone-400'
                          }`}
                        >
                          {ROOM_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {language === 'ka' ? cat.labelKa : cat.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Suggested Guide Section Pill */}
                      {(() => {
                        const roomMeta = ROOM_CATEGORIES.find(c => c.id === photo.roomCategory) || ROOM_CATEGORIES[1];
                        return (
                          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center justify-between border ${
                            isDark
                              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
                              : 'bg-stone-50 border-stone-200/80 text-stone-600'
                          }`}>
                            <span className="opacity-75">
                              {language === 'ka' ? 'გიდის სექცია:' : 'Guide Section:'}
                            </span>
                            <span className="font-semibold text-[#B85D3B] dark:text-amber-400">
                              {language === 'ka' ? roomMeta.suggestedSectionKa : roomMeta.suggestedSectionEn}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Caption Input */}
                      <input
                        type="text"
                        value={photo.caption || ''}
                        onChange={(e) => updateCaption(photo.id, e.target.value)}
                        placeholder={language === 'ka' ? 'დაამატეთ წარწერა (მაგ. ყავის აპარატი)...' : 'Add photo note or caption...'}
                        className={`w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:border-zinc-700' 
                            : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-stone-300'
                        }`}
                      />
                    </div>

                    {/* Bottom Reorder Bar */}
                    <div className="pt-2 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => movePhoto(actualIndex, 'left')}
                          disabled={actualIndex === 0}
                          title="Move left"
                          className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePhoto(actualIndex, 'right')}
                          disabled={actualIndex === photos.length - 1}
                          title="Move right"
                          className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-stone-400 dark:text-zinc-500 ml-1">
                          {language === 'ka' ? 'ან გადაათრიეთ' : 'or drag card'}
                        </span>
                      </div>

                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => setCover(photo.id)}
                          className="text-[11px] font-medium text-stone-500 hover:text-[#B85D3B] dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
                        >
                          {language === 'ka' ? 'ყდად დაყენება' : 'Make Cover'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border text-center ${
          isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-stone-50 border-stone-200 text-stone-500'
        }`}>
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">
            {language === 'ka' ? 'ფოტოები ჯერ არ არის ატვირთული' : 'No photos added yet'}
          </p>
          <p className="text-xs mt-0.5">
            {language === 'ka' ? 'ატვირთეთ ფოტოები ზედა ველიდან ან დააწკაპუნეთ "სანიმუშო ფოტოები"' : 'Drag files above or click "Sample Photos" to load a pre-configured apartment gallery.'}
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.caption || 'Expanded preview'} 
                className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl" 
              />
              {selectedPhoto.caption && (
                <p className="text-white text-sm font-medium mt-3 text-center px-4">
                  {selectedPhoto.caption}
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
