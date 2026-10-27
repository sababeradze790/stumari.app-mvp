import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  Bookmark, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  AlertCircle, 
  HelpCircle, 
  Layers, 
  Thermometer, 
  Coffee, 
  Shirt, 
  Tv, 
  Flame, 
  Zap, 
  KeyRound, 
  Utensils, 
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Camera,
  Loader2,
  StopCircle,
  Eye,
  Share2
} from 'lucide-react';
import { ApplianceGuide, HowToStep } from '../../types';
import { DEFAULT_INSTRUCTION_LIBRARY } from '../../data/templateData';
import { useApp } from '../../context/AppContext';
import { uploadMediaFile } from '../../firebase';
import { VisualHowToPlayer } from '../common/VisualHowToPlayer';

interface VisualHowToManagerProps {
  appliances: ApplianceGuide[];
  onChange: (appliances: ApplianceGuide[]) => void;
  allowLibraryPresets?: boolean;
}

const APPLIANCE_ICONS: { id: ApplianceGuide['icon']; label: string; icon: React.ReactNode }[] = [
  { id: 'Thermometer', label: 'AC / Climate', icon: <Thermometer className="w-4 h-4 text-sky-500" /> },
  { id: 'Coffee', label: 'Coffee / Espresso', icon: <Coffee className="w-4 h-4 text-amber-600" /> },
  { id: 'Shirt', label: 'Washing Machine', icon: <Shirt className="w-4 h-4 text-emerald-500" /> },
  { id: 'Flame', label: 'Boiler / Hot Water', icon: <Flame className="w-4 h-4 text-orange-500" /> },
  { id: 'KeyRound', label: 'Gate / Checkout Keys', icon: <KeyRound className="w-4 h-4 text-yellow-500" /> },
  { id: 'Tv', label: 'Smart TV / Audio', icon: <Tv className="w-4 h-4 text-purple-500" /> },
  { id: 'Zap', label: 'Electricity / Circuit', icon: <Zap className="w-4 h-4 text-amber-500" /> },
  { id: 'Utensils', label: 'Stove / Dishwasher', icon: <Utensils className="w-4 h-4 text-rose-500" /> }
];

export const VisualHowToManager: React.FC<VisualHowToManagerProps> = ({
  appliances,
  onChange,
  allowLibraryPresets = true
}) => {
  const {
    theme,
    showToast,
    language,
    instructionLibrary,
    saveInstructionToLibrary,
    properties,
    updateProperty
  } = useApp();
  const isDark = theme === 'dark';

  const [activePresetDrawer, setActivePresetDrawer] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<ApplianceGuide | null>(null);
  const [previewingAppliance, setPreviewingAppliance] = useState<ApplianceGuide | null>(null);
  const [syncingTaskToProps, setSyncingTaskToProps] = useState<ApplianceGuide | null>(null);
  const [selectedSyncPropIds, setSelectedSyncPropIds] = useState<string[]>([]);
  const [isPlayingVideoId, setIsPlayingVideoId] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadingStepIdx, setUploadingStepIdx] = useState<number | null>(null);

  // Live 20s Video Camera Recorder State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Upload existing video file
  const handleVideoFileUpload = async (file: File | undefined) => {
    if (!file || !editingAppliance) return;
    if (!file.type.startsWith('video/')) {
      showToast(language === 'ka' ? 'გთხოვთ აირჩიოთ ვიდეო ფაილი (MP4, MOV, WEBM)' : 'Please select a valid video file');
      return;
    }
    setIsUploadingMedia(true);
    try {
      const sanitized = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const url = await uploadMediaFile(file, `properties/howto-videos/${Date.now()}-${sanitized}`);
      setEditingAppliance(prev => prev ? {
        ...prev,
        mediaUrl: url,
        mediaType: 'video',
        videoDurationSeconds: prev.videoDurationSeconds || 15
      } : null);
      showToast(language === 'ka' ? 'ვიდეო ინსტრუქცია წარმატებით აიტვირთა!' : 'Video uploaded successfully!');
    } catch (err) {
      console.error('Video upload error:', err);
      showToast(language === 'ka' ? 'ვიდეოს ატვირთვა ვერ მოხერხდა' : 'Failed to upload video');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Start live camera for 20-second video recording
  const startCameraRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true
      });
      mediaStreamRef.current = stream;
      setIsCameraOpen(true);
      setRecordingSeconds(0);
      setTimeout(() => {
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
          cameraVideoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      console.warn('Camera access unavailable, falling back to file capture input:', err);
      videoFileInputRef.current?.click();
    }
  };

  const stopCameraStream = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setIsCameraOpen(false);
  };

  const beginRecordingClip = () => {
    if (!mediaStreamRef.current) return;
    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const duration = Math.max(1, Math.min(20, recordingSeconds || 10));
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `howto-clip-${Date.now()}.webm`, { type: 'video/webm' });
      stopCameraStream();
      setIsUploadingMedia(true);
      try {
        const url = await uploadMediaFile(file, `properties/howto-videos/${file.name}`);
        setEditingAppliance(prev => prev ? {
          ...prev,
          mediaUrl: url,
          mediaType: 'video',
          videoDurationSeconds: duration
        } : null);
        showToast(language === 'ka' ? 'ჩაწერილი ვიდეო შენახულია!' : `Recorded ${duration}s video clip saved!`);
      } catch (err) {
        console.error('Recorded clip upload failed:', err);
      } finally {
        setIsUploadingMedia(false);
      }
    };

    recorder.start();
    setIsRecording(true);
    setRecordingSeconds(0);

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev + 1 >= 20) {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          return 20;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const finishRecordingClip = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      stopCameraStream();
    }
  };

  // Upload photo for a specific numbered step
  const handleStepPhotoUpload = async (stepIndex: number, file: File | undefined) => {
    if (!file || !editingAppliance) return;
    setUploadingStepIdx(stepIndex);
    try {
      const sanitized = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const url = await uploadMediaFile(file, `properties/howto-steps/${Date.now()}-${stepIndex}-${sanitized}`);
      setEditingAppliance(prev => {
        if (!prev) return null;
        const updatedSteps = [...(prev.steps || [])];
        if (updatedSteps[stepIndex]) {
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            mediaType: 'photo',
            mediaUrl: url
          };
        }
        return { ...prev, steps: updatedSteps };
      });
      showToast(language === 'ka' ? `ნაბიჯი #${stepIndex + 1} ფოტო აიტვირთა` : `Step #${stepIndex + 1} photo uploaded`);
    } catch (err) {
      console.error('Step photo upload failed:', err);
    } finally {
      setUploadingStepIdx(null);
    }
  };

  // Reorder step up or down in the sequence
  const moveStep = (stepIndex: number, direction: 'up' | 'down') => {
    if (!editingAppliance || !editingAppliance.steps) return;
    const targetIdx = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (targetIdx < 0 || targetIdx >= editingAppliance.steps.length) return;
    const copy = [...editingAppliance.steps];
    const temp = copy[stepIndex];
    copy[stepIndex] = copy[targetIdx];
    copy[targetIdx] = temp;
    const renumbered = copy.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setEditingAppliance({ ...editingAppliance, steps: renumbered });
  };

  // Helper to render icon
  const renderIcon = (iconName: ApplianceGuide['icon']) => {
    const item = APPLIANCE_ICONS.find(i => i.id === iconName);
    return item ? item.icon : <Zap className="w-4 h-4 text-amber-500" />;
  };

  // Add from Reusable Library
  const handleAddFromLibrary = (preset: ApplianceGuide) => {
    const newGuide: ApplianceGuide = {
      ...preset,
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      steps: preset.steps ? preset.steps.map(s => ({ ...s })) : []
    };
    onChange([...appliances, newGuide]);
    showToast(
      language === 'ka' 
        ? `ინსტრუქცია "${preset.title}" დაემატა გიდში` 
        : `Attached "${preset.title}" from instruction library`
    );
  };

  // Open a Repeatable Task Blueprint directly in the editor so host can customize & save
  const handleStartRepeatableBlueprint = (presetId: string) => {
    const found =
      instructionLibrary.find(p => p.id === presetId) ||
      DEFAULT_INSTRUCTION_LIBRARY.find(p => p.id === presetId);
    if (!found) {
      handleCreateNew();
      return;
    }
    const draft: ApplianceGuide = {
      ...found,
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      steps: found.steps ? found.steps.map(s => ({ ...s })) : []
    };
    setEditingAppliance(draft);
  };

  // Create new blank instruction
  const handleCreateNew = () => {
    const newGuide: ApplianceGuide = {
      id: `app-${Date.now()}`,
      title: language === 'ka' ? 'ახალი ტექნიკის გიდი' : 'New Visual How-To Task',
      icon: 'Thermometer',
      category: 'climate',
      instructions: language === 'ka' ? 'აღწერეთ როგორ ჩაირთოს მოწყობილობა მარტივად...' : 'Brief instructions on how to complete this task or operate the appliance...',
      troubleshooting: language === 'ka' ? 'ხშირი პრობლემის მოგვარება...' : 'Common troubleshooting tip if needed...',
      steps: [
        {
          stepNumber: 1,
          title: language === 'ka' ? 'პირველი ნაბიჯი' : 'Step 1: Locate controls',
          description: language === 'ka' ? 'დააჭირეთ ჩართვის ღილაკს...' : 'Turn on the main switch or remote control.',
          mediaType: 'photo',
          mediaUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
        },
        {
          stepNumber: 2,
          title: language === 'ka' ? 'მეორე ნაბიჯი' : 'Step 2: Select desired setting',
          description: language === 'ka' ? 'აირჩიეთ სასურველი რეჟიმი...' : 'Confirm the indicator light turns solid green.',
          mediaType: 'photo',
          mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        }
      ]
    };
    setEditingAppliance(newGuide);
  };

  // Save edited appliance
  const handleSaveAppliance = (updated: ApplianceGuide) => {
    const exists = appliances.some(a => a.id === updated.id);
    if (exists) {
      onChange(appliances.map(a => a.id === updated.id ? updated : a));
    } else {
      onChange([...appliances, updated]);
    }
    setEditingAppliance(null);
    showToast(language === 'ka' ? 'ინსტრუქცია შენახულია' : 'Visual How-To saved');
  };

  // Delete appliance
  const handleDeleteAppliance = (id: string) => {
    onChange(appliances.filter(a => a.id !== id));
    showToast(language === 'ka' ? 'ინსტრუქცია წაიშალა' : 'Instruction removed');
  };

  // Save to host reusable library
  const handleSaveToGlobalLibrary = (guide: ApplianceGuide) => {
    saveInstructionToLibrary(guide);
  };

  // Sync repeatable task to selected properties
  const handleConfirmSyncToProperties = () => {
    if (!syncingTaskToProps || selectedSyncPropIds.length === 0) return;

    selectedSyncPropIds.forEach(propId => {
      const targetProp = properties.find(p => p.id === propId);
      if (!targetProp) return;
      const existing = targetProp.appliances || [];
      const alreadyIdx = existing.findIndex(
        a => a.title.toLowerCase() === syncingTaskToProps.title.toLowerCase()
      );
      const clonedGuide: ApplianceGuide = {
        ...syncingTaskToProps,
        id: alreadyIdx >= 0 ? existing[alreadyIdx].id : `app-sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        steps: syncingTaskToProps.steps ? syncingTaskToProps.steps.map(s => ({ ...s })) : []
      };
      const updatedList =
        alreadyIdx >= 0
          ? existing.map((item, idx) => (idx === alreadyIdx ? clonedGuide : item))
          : [...existing, clonedGuide];
      updateProperty({ ...targetProp, appliances: updatedList });
    });

    showToast(
      language === 'ka'
        ? `"${syncingTaskToProps.title}" გავრცელდა ${selectedSyncPropIds.length} ბინაზე!`
        : `Synced "${syncingTaskToProps.title}" to ${selectedSyncPropIds.length} properties!`
    );
    setSyncingTaskToProps(null);
    setSelectedSyncPropIds([]);
  };

  // Toggle video play in card
  const toggleVideoPlay = (appId: string) => {
    const video = videoRefs.current[appId];
    if (!video) return;

    if (isPlayingVideoId === appId) {
      video.pause();
      setIsPlayingVideoId(null);
    } else {
      Object.keys(videoRefs.current).forEach(id => {
        if (id !== appId) videoRefs.current[id]?.pause();
      });
      video.play();
      setIsPlayingVideoId(appId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
        isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FBF9F6] border-[#EBE6DF] text-[#1C1B1A]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg">
                {language === 'ka' ? 'ვიზუალური ინსტრუქციების გიდი' : 'Visual How-To Guides'}
              </span>
              <span className="text-xs text-stone-500 dark:text-zinc-400">
                · {appliances.length} {language === 'ka' ? 'აქტიური ინსტრუქცია' : 'tasks configured'}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
              {language === 'ka'
                ? 'ჩაშენებული მოკლე ვიდეოები და ნაბიჯ-ნაბიჯ ფოტო-ინსტრუქციები განმეორებადი ამოცანებისთვის (ქვაბის ჩართვა, გასვლის წესები, საკეტი).'
                : 'Embed short videos and step-by-step image sequences for repeatable tasks like Boiler operation, Check-out key return, and Gate access.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allowLibraryPresets && (
              <button
                type="button"
                onClick={() => setActivePresetDrawer(true)}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isDark 
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-750' 
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'ka' ? 'ბიბლიოთეკიდან არჩევა' : 'Reusable Library'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCreateNew}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ka' ? 'ახალი ინსტრუქცია' : 'Create How-To'}</span>
            </button>
          </div>
        </div>

        {/* Quick Repeatable Task Blueprints Bar */}
        <div className="pt-3 border-t border-stone-200/70 dark:border-zinc-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium text-stone-500 dark:text-zinc-400 mr-1">
            {language === 'ka' ? 'სწრაფი შაბლონები:' : 'Quick repeatable tasks:'}
          </span>
          {[
            { id: 'lib-boiler-baxi', labelEn: 'Boiler Operation', labelKa: 'ქვაბი & ცხელი წყალი', icon: <Flame className="w-3 h-3 text-orange-500" /> },
            { id: 'lib-checkout-keys', labelEn: 'Check-out Instructions', labelKa: 'გასვლა & გასაღები', icon: <KeyRound className="w-3 h-3 text-amber-500" /> },
            { id: 'lib-find-entrance', labelEn: 'Apartment Entrance', labelKa: 'შესასვლელის პოვნა', icon: <KeyRound className="w-3 h-3 text-emerald-500" /> },
            { id: 'lib-washer-bosch', labelEn: 'Washing Machine', labelKa: 'სარეცხი მანქანა', icon: <Shirt className="w-3 h-3 text-sky-500" /> },
            { id: 'lib-ac-daikin', labelEn: 'AC & Heating', labelKa: 'კონდიციონერი', icon: <Thermometer className="w-3 h-3 text-sky-400" /> }
          ].map(task => (
            <button
              key={task.id}
              type="button"
              onClick={() => handleStartRepeatableBlueprint(task.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:text-stone-900'
              }`}
            >
              {task.icon}
              <span>{language === 'ka' ? task.labelKa : task.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Appliance Guides List */}
      {appliances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appliances.map((app) => {
            const hasVideo = !!app.mediaUrl && (app.mediaType === 'video' || app.mediaUrl.endsWith('.mp4') || app.mediaUrl.includes('youtube.com') || app.mediaUrl.includes('youtu.be') || app.mediaUrl.includes('vimeo.com'));
            const isPlaying = isPlayingVideoId === app.id;
            const stepsCount = (app.steps || []).length;

            return (
              <div
                key={app.id}
                className={`p-4 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
                  isDark ? 'bg-[#181716] border-[#2B2926]' : 'bg-white border-stone-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-stone-200 dark:border-zinc-700">
                        {renderIcon(app.icon)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight text-stone-900 dark:text-zinc-100">
                          {app.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                          <span className="capitalize">{app.category || 'Appliance'}</span>
                          {stepsCount > 0 && (
                            <>
                              <span>·</span>
                              <span>{stepsCount} {language === 'ka' ? 'ფოტო-ნაბიჯი' : 'image steps'}</span>
                            </>
                          )}
                          {hasVideo && (
                            <>
                              <span>·</span>
                              <span className="text-amber-600 dark:text-amber-400 font-medium">
                                {app.videoDurationSeconds ? `${app.videoDurationSeconds}s Video` : 'Short Video'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewingAppliance(app)}
                        title={language === 'ka' ? 'სტუმრის ხედის ნახვა' : 'Preview interactive How-To player'}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#B85D3B] dark:hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {properties.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSyncingTaskToProps(app);
                            setSelectedSyncPropIds([]);
                          }}
                          title={language === 'ka' ? 'სხვა ბინებზე გავრცელება' : 'Apply repeatable task to other properties'}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-sky-500 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSaveToGlobalLibrary(app)}
                        title="Save to Reusable Library"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAppliance(app)}
                        title="Edit guide"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAppliance(app.id)}
                        title="Delete guide"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Video Preview or First Step Image Banner */}
                  {hasVideo && app.mediaUrl && (app.mediaUrl.endsWith('.mp4') || app.mediaUrl.startsWith('data:video/')) ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/10 dark:bg-black/40 border border-stone-200 dark:border-zinc-800">
                      <video
                        ref={(el) => { videoRefs.current[app.id] = el; }}
                        src={app.mediaUrl}
                        poster={app.mediaPoster || app.steps?.[0]?.mediaUrl}
                        playsInline
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => toggleVideoPlay(app.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/90 group-hover:scale-105 text-stone-900 flex items-center justify-center shadow-lg transition-transform">
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </div>
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
                        <Video className="w-3 h-3 text-amber-400" />
                        <span>{app.videoDurationSeconds ? `${app.videoDurationSeconds}s` : '15s Clip'}</span>
                      </div>
                    </div>
                  ) : app.steps?.[0]?.mediaUrl ? (
                    <div
                      onClick={() => setPreviewingAppliance(app)}
                      className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 cursor-pointer group"
                    >
                      <img
                        src={app.steps[0].mediaUrl}
                        alt={app.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-mono bg-black/75 text-white backdrop-blur-xs flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        <span>{stepsCount}-Step Image Sequence</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Instructions Summary */}
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-stone-600'}`}>
                    {app.instructions}
                  </p>

                  {/* Troubleshooting Note */}
                  {app.troubleshooting && (
                    <div className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                      isDark ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                      <span><strong>{language === 'ka' ? 'მოგვარება:' : 'Troubleshooting:'}</strong> {app.troubleshooting}</span>
                    </div>
                  )}
                </div>

                {/* Numbered Steps Thumbnail Strip + Interactive Preview Trigger */}
                <div className="pt-3 mt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                  {stepsCount > 0 ? (
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
                      {app.steps?.map((step) => (
                        <button
                          key={step.stepNumber}
                          type="button"
                          onClick={() => setPreviewingAppliance(app)}
                          className={`px-2 py-1 rounded-lg border text-[10px] whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark ? 'bg-zinc-800/90 border-zinc-700 text-zinc-300 hover:border-amber-500/50' : 'bg-stone-100 border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          {step.mediaUrl && (
                            <img src={step.mediaUrl} alt="" className="w-4 h-4 rounded-xs object-cover" />
                          )}
                          <span>0{step.stepNumber}. {step.title}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-400">
                      {language === 'ka' ? 'ტექსტური და ვიდეო გიდი' : 'Video & text guide'}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewingAppliance(app)}
                    className="text-xs font-semibold text-[#B85D3B] dark:text-amber-400 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ka' ? 'ნახვა' : 'Preview'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border text-center ${
          isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-stone-50 border-stone-200 text-stone-500'
        }`}>
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">
            {language === 'ka' ? 'ინსტრუქციები ჯერ არ არის დამატებული' : 'No visual instructions yet'}
          </p>
          <p className="text-xs mt-0.5">
            {language === 'ka'
              ? 'დააწკაპუნეთ "ბიბლიოთეკიდან არჩევა" ან აირჩიეთ სწრაფი შაბლონი ზემოთ'
              : 'Pick a repeatable task above (Boiler Operation, Check-out Instructions) or open the Reusable Library.'}
          </p>
        </div>
      )}

      {/* Interactive Host Preview Modal using VisualHowToPlayer */}
      <AnimatePresence>
        {previewingAppliance && (
          <div
            onClick={() => setPreviewingAppliance(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-xl w-full max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center border border-stone-200 dark:border-zinc-700">
                    {renderIcon(previewingAppliance.icon)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base leading-tight">
                      {previewingAppliance.title}
                    </h3>
                    <span className="text-xs text-stone-500 dark:text-zinc-400">
                      {language === 'ka' ? 'სტუმრის ინტერაქტიული ხედი' : 'Interactive Guest How-To Player'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const target = previewingAppliance;
                      setPreviewingAppliance(null);
                      setEditingAppliance(target);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    {language === 'ka' ? 'რედაქტირება' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewingAppliance(null)}
                    className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                <VisualHowToPlayer
                  guide={previewingAppliance}
                  language={language}
                  isDark={isDark}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sync Repeatable Task Across Multiple Properties Modal */}
      <AnimatePresence>
        {syncingTaskToProps && (
          <div
            onClick={() => setSyncingTaskToProps(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base">
                    {language === 'ka' ? 'განმეორებადი ინსტრუქციის გავრცელება' : 'Sync Repeatable Task to Properties'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                    {syncingTaskToProps.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSyncingTaskToProps(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  {language === 'ka'
                    ? 'აირჩიეთ ბინები, სადაც გსურთ ამ ვიდეო და ფოტო-ინსტრუქციის დამატება ან განახლება:'
                    : 'Select which properties should receive this video and step-by-step image sequence:'}
                </p>
                {properties.map(p => {
                  const isChecked = selectedSyncPropIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? isDark ? 'bg-zinc-800 border-[#B85D3B]' : 'bg-amber-50/40 border-[#B85D3B]'
                          : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedSyncPropIds(prev =>
                              prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className="accent-[#B85D3B]"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block truncate">{p.title}</span>
                          <span className="text-[11px] text-stone-400 block truncate">{p.address}</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="p-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSyncingTaskToProps(null)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-zinc-700 cursor-pointer"
                >
                  {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={selectedSyncPropIds.length === 0}
                  onClick={handleConfirmSyncToProperties}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] disabled:opacity-40 text-white cursor-pointer"
                >
                  {language === 'ka' ? 'გავრცელება' : `Apply to ${selectedSyncPropIds.length || ''} Properties`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preset Library Drawer Modal */}
      <AnimatePresence>
        {activePresetDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className={`max-w-2xl w-full max-h-[85vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    {language === 'ka' ? 'მასპინძლის ინსტრუქციების ბიბლიოთეკა' : 'Host Instruction Library'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    {language === 'ka' 
                      ? 'აირჩიეთ მზა ინსტრუქციები თქვენი ბინისთვის' 
                      : 'Pick from host-verified instructions to instantly add to this property.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePresetDrawer(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 overflow-y-auto space-y-3 flex-1">
                {instructionLibrary.map((preset) => {
                  const isAlreadyAdded = appliances.some(a => a.title.toLowerCase() === preset.title.toLowerCase());

                  return (
                    <div
                      key={preset.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isAlreadyAdded 
                          ? isDark ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60' : 'bg-stone-50 border-stone-200 opacity-60'
                          : isDark ? 'bg-zinc-850 border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-stone-200 dark:border-zinc-700">
                          {renderIcon(preset.icon)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight text-stone-900 dark:text-zinc-100">
                            {preset.title}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {preset.instructions}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 dark:text-zinc-500 mt-1">
                            <span className="capitalize">{preset.category}</span>
                            <span>·</span>
                            <span>{(preset.steps || []).length} steps</span>
                            {preset.mediaUrl && (
                              <>
                                <span>·</span>
                                <span className="text-amber-500">Video included</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewingAppliance(preset)}
                          className="p-2 rounded-xl border border-stone-200 dark:border-zinc-700 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleAddFromLibrary(preset);
                            setActivePresetDrawer(false);
                          }}
                          disabled={isAlreadyAdded}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                            isAlreadyAdded
                              ? 'bg-stone-200 dark:bg-zinc-800 text-stone-500 cursor-not-allowed'
                              : 'bg-[#B85D3B] hover:bg-[#A35132] text-white active:scale-98'
                          }`}
                        >
                          {isAlreadyAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'ka' ? 'დამატებულია' : 'Added'}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{language === 'ka' ? 'დამატება' : 'Attach'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Appliance Modal */}
      <AnimatePresence>
        {editingAppliance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`max-w-xl w-full max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg">
                  {editingAppliance.id.startsWith('app-') && !appliances.some(a => a.id === editingAppliance.id)
                    ? (language === 'ka' ? 'ახალი ინსტრუქციის შექმნა' : 'Create Visual How-To Task')
                    : (language === 'ka' ? 'ინსტრუქციის რედაქტირება' : 'Edit Visual How-To Task')}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingAppliance(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                    {language === 'ka' ? 'ამოცანის / მოწყობილობის სახელი' : 'Task or Appliance Title'}
                  </label>
                  <input
                    type="text"
                    value={editingAppliance.title}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, title: e.target.value })}
                    placeholder="e.g. Boiler Operation & Hot Water, or Check-out Key Return"
                    className={`w-full text-sm px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                {/* Icon & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                      {language === 'ka' ? 'ხატულა' : 'Icon'}
                    </label>
                    <select
                      value={editingAppliance.icon}
                      onChange={(e) => setEditingAppliance({ ...editingAppliance, icon: e.target.value as ApplianceGuide['icon'] })}
                      className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    >
                      {APPLIANCE_ICONS.map(i => (
                        <option key={i.id} value={i.id}>{i.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                      {language === 'ka' ? 'კატეგორია' : 'Category'}
                    </label>
                    <select
                      value={editingAppliance.category || 'climate'}
                      onChange={(e) => setEditingAppliance({ ...editingAppliance, category: e.target.value as ApplianceGuide['category'] })}
                      className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    >
                      <option value="climate">Climate, Boiler & Heating</option>
                      <option value="access">Arrival, Gate & Check-out</option>
                      <option value="kitchen">Kitchen & Coffee</option>
                      <option value="laundry">Laundry</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="other">Other Repeatable Task</option>
                    </select>
                  </div>
                </div>

                {/* Video Upload, Phone Camera Record (20s), or Embed URL */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>{language === 'ka' ? 'მოკლე ვიდეო გიდი (15-20 წმ)' : 'Embedded Short Video (15–20s)'}</span>
                    <span className="text-[10px] text-stone-400">
                      {language === 'ka' ? 'MP4, კამერა ან YouTube/Vimeo ბმული' : 'Upload MP4, record camera, or paste YouTube/Vimeo URL'}
                    </span>
                  </label>

                  {/* Hidden video file input */}
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoFileUpload(e.target.files?.[0])}
                  />

                  {/* Action Buttons: Upload Video | Record 20s Clip | Use Demo MP4 */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isUploadingMedia}
                      onClick={() => videoFileInputRef.current?.click()}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDark
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-750'
                          : 'bg-stone-100 border-stone-200 text-stone-800 hover:bg-stone-200/70'
                      }`}
                    >
                      {isUploadingMedia ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-[#B85D3B]" />
                      )}
                      <span>
                        {isUploadingMedia
                          ? (language === 'ka' ? 'იტვირთება...' : 'Uploading...')
                          : (language === 'ka' ? 'ვიდეოს ატვირთვა' : 'Upload Video')}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isUploadingMedia}
                      onClick={isCameraOpen ? stopCameraStream : startCameraRecorder}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCameraOpen
                          ? 'bg-red-600 text-white border-red-600'
                          : isDark
                          ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
                          : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/80'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>
                        {isCameraOpen
                          ? (language === 'ka' ? 'კამერის დახურვა' : 'Close Camera')
                          : (language === 'ka' ? 'კამერით ჩაწერა (20 წმ)' : 'Record 20s Video')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingAppliance({ 
                        ...editingAppliance, 
                        mediaUrl: '/tbilisi-twilight.mp4',
                        mediaType: 'video',
                        videoDurationSeconds: 15
                      })}
                      className="px-2.5 py-2 text-[11px] font-medium rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 whitespace-nowrap cursor-pointer"
                    >
                      {language === 'ka' ? 'სანიმუშო ვიდეო' : 'Use Demo MP4'}
                    </button>
                  </div>

                  {/* Live Camera 20-Second Recorder View */}
                  {isCameraOpen && (
                    <div className="p-3 rounded-2xl border border-amber-500/40 bg-black text-white space-y-2.5">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900">
                        <video
                          ref={cameraVideoRef}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 text-[11px] font-mono flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                          <span>{isRecording ? `REC ${recordingSeconds}s / 20s` : 'Ready (Max 20s)'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400">
                          {language === 'ka'
                            ? 'აჩვენეთ სტუმარს რომელ ღილაკს დააჭიროს (მაქს. 20 წამი)'
                            : 'Show guests which button or dial to press (up to 20 seconds)'}
                        </span>
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={beginRecordingClip}
                            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>{language === 'ka' ? 'ჩაწერის დაწყება' : 'Start Recording'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={finishRecordingClip}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <StopCircle className="w-3.5 h-3.5" />
                            <span>{language === 'ka' ? 'დასრულება & შენახვა' : 'Stop & Save Clip'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Direct URL input */}
                  <input
                    type="text"
                    value={editingAppliance.mediaUrl || ''}
                    onChange={(e) => setEditingAppliance({ 
                      ...editingAppliance, 
                      mediaUrl: e.target.value,
                      mediaType: e.target.value ? 'video' : undefined 
                    })}
                    placeholder={language === 'ka' ? 'ან ჩასვით ვიდეოს ბმული (MP4, YouTube, Vimeo)...' : 'Or paste video URL (MP4, YouTube, Vimeo, Loom)...'}
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                {/* Instructions */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                    {language === 'ka' ? 'მოკლე ინსტრუქცია' : 'Summary Overview'}
                  </label>
                  <textarea
                    rows={2}
                    value={editingAppliance.instructions}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, instructions: e.target.value })}
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none leading-relaxed ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                {/* Troubleshooting Note */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                    {language === 'ka' ? 'ხშირი პრობლემის მოგვარება' : 'Troubleshooting Tip'}
                  </label>
                  <input
                    type="text"
                    value={editingAppliance.troubleshooting || ''}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, troubleshooting: e.target.value })}
                    placeholder="e.g. If display flashes E01, turn dial to R for 2 seconds..."
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                {/* Numbered Steps Section with Photo Upload & Reorder per Step */}
                <div className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                      {language === 'ka' ? 'ნაბიჯ-ნაბიჯ ფოტო-ინსტრუქცია' : 'Step-by-Step Image Sequence'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentSteps = editingAppliance.steps || [];
                        const nextStepNum = currentSteps.length + 1;
                        setEditingAppliance({
                          ...editingAppliance,
                          steps: [
                            ...currentSteps,
                            {
                              stepNumber: nextStepNum,
                              title: `Step ${nextStepNum}`,
                              description: '',
                              mediaType: 'photo',
                              mediaUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
                            }
                          ]
                        });
                      }}
                      className="text-[11px] font-semibold text-[#B85D3B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'ka' ? 'ნაბიჯის დამატება' : 'Add Step'}</span>
                    </button>
                  </div>

                  {(editingAppliance.steps || []).map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800 space-y-2.5 bg-stone-50/50 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                          0{step.stepNumber}.
                        </span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updatedSteps = [...(editingAppliance.steps || [])];
                            updatedSteps[sIdx] = { ...step, title: e.target.value };
                            setEditingAppliance({ ...editingAppliance, steps: updatedSteps });
                          }}
                          placeholder="Step title..."
                          className="flex-1 text-xs px-2 py-1 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-850"
                        />

                        {/* Step Reorder Up/Down + Delete */}
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={sIdx === 0}
                            onClick={() => moveStep(sIdx, 'up')}
                            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                            title="Move step up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={sIdx === (editingAppliance.steps?.length || 1) - 1}
                            onClick={() => moveStep(sIdx, 'down')}
                            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                            title="Move step down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSteps = (editingAppliance.steps || [])
                                .filter((_, idx) => idx !== sIdx)
                                .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
                              setEditingAppliance({ ...editingAppliance, steps: updatedSteps });
                            }}
                            className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                            title="Remove step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        {/* Step Photo Thumbnail + Upload Trigger */}
                        <label className="relative w-16 h-14 rounded-lg overflow-hidden border border-stone-200 dark:border-zinc-700 bg-stone-100 dark:bg-zinc-800 shrink-0 cursor-pointer group">
                          {step.mediaUrl ? (
                            <img
                              src={step.mediaUrl}
                              alt={step.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-semibold text-center px-1">
                            {uploadingStepIdx === sIdx
                              ? '...'
                              : (language === 'ka' ? 'ატვირთვა' : 'Upload')}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleStepPhotoUpload(sIdx, e.target.files?.[0])}
                          />
                        </label>

                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) => {
                              const updatedSteps = [...(editingAppliance.steps || [])];
                              updatedSteps[sIdx] = { ...step, description: e.target.value };
                              setEditingAppliance({ ...editingAppliance, steps: updatedSteps });
                            }}
                            placeholder="Action instructions for this step..."
                            className="w-full text-xs px-2 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-850"
                          />
                          <input
                            type="text"
                            value={step.mediaUrl || ''}
                            onChange={(e) => {
                              const updatedSteps = [...(editingAppliance.steps || [])];
                              updatedSteps[sIdx] = { ...step, mediaUrl: e.target.value, mediaType: 'photo' };
                              setEditingAppliance({ ...editingAppliance, steps: updatedSteps });
                            }}
                            placeholder={language === 'ka' ? 'ან ჩასვით ნაბიჯის ფოტოს ბმული...' : 'Or paste step image URL...'}
                            className="w-full text-[11px] px-2 py-1 rounded-lg border border-stone-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-stone-500 dark:text-zinc-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveToGlobalLibrary(editingAppliance)}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'ka' ? 'ბიბლიოთეკაში შენახვა' : 'Save as Repeatable Preset'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAppliance(null)}
                    className="px-4 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveAppliance(editingAppliance)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white shadow-sm cursor-pointer"
                  >
                    {language === 'ka' ? 'შენახვა' : 'Save Guide'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
