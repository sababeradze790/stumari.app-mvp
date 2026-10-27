import React, { useState, useRef } from 'react';
import { ApplianceGuide, HowToStep } from '../../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Clock,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface VisualHowToPlayerProps {
  guide: ApplianceGuide;
  language?: 'en' | 'ka' | 'ru';
  isDark?: boolean;
  compact?: boolean;
  onComplete?: () => void;
}

export const VisualHowToPlayer: React.FC<VisualHowToPlayerProps> = ({
  guide,
  language = 'en',
  isDark = false,
  compact = false,
  onComplete,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const videoUrl = guide.videoUrl || (guide.mediaType === 'video' ? guide.mediaUrl : undefined);
  const steps: HowToStep[] =
    guide.steps && guide.steps.length > 0
      ? guide.steps
      : (guide.stepsText || []).map((text, idx) => ({
          stepNumber: idx + 1,
          title:
            language === 'ka'
              ? `ნაბიჯი ${idx + 1}`
              : language === 'ru'
              ? `Шаг ${idx + 1}`
              : `Step ${idx + 1}`,
          description: text,
          mediaType: 'photo',
        }));

  const [viewMode, setViewMode] = useState<'steps' | 'video'>(
    videoUrl && steps.length === 0 ? 'video' : 'steps'
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    setActiveStepIndex(0);
    setCompletedSteps(new Set());
    setViewMode(videoUrl && steps.length === 0 ? 'video' : 'steps');
  }, [guide.id, videoUrl, steps.length]);

  const currentStep = steps[activeStepIndex];

  const getStepTitle = (step: HowToStep) => {
    if (language === 'ka' && step.titleKa) return step.titleKa;
    if (language === 'ru' && step.titleRu) return step.titleRu;
    return step.title;
  };

  const getStepDescription = (step: HowToStep) => {
    if (language === 'ka' && step.descriptionKa) return step.descriptionKa;
    if (language === 'ru' && step.descriptionRu) return step.descriptionRu;
    return step.description;
  };

  const toggleStepComplete = (stepNum: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNum)) {
        next.delete(stepNum);
      } else {
        next.add(stepNum);
        if (next.size === steps.length && onComplete) {
          onComplete();
        }
      }
      return next;
    });
  };

  const handleNextStep = () => {
    if (currentStep) {
      setCompletedSteps(prev => {
        const next = new Set(prev);
        next.add(currentStep.stepNumber);
        if (next.size === steps.length && onComplete) {
          onComplete();
        }
        return next;
      });
    }
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const isEmbedVideo = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }
    if (url.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
      } catch {
        return url;
      }
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const progressPct = steps.length > 0 ? Math.round((completedSteps.size / steps.length) * 100) : 0;
  const troubleshootingText = guide.troubleshootingTip || guide.troubleshooting;

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all ${
        isDark
          ? 'bg-[#141312] border-[#2B2926] text-[#F7F5F0]'
          : 'bg-[#FAF8F5] border-[#EBE6DF] text-[#1C1B1A] shadow-sm'
      }`}
    >
      {/* Top Bar: Mode Switcher + Progress */}
      {(steps.length > 0 || videoUrl) && (
        <div
          className={`px-4 py-3 border-b flex items-center justify-between gap-2 ${
            isDark ? 'border-[#2B2926] bg-[#1F1E1C]/80' : 'border-[#EBE6DF] bg-white/80'
          }`}
        >
          <div className="flex items-center gap-2">
            {steps.length > 0 && videoUrl ? (
              <div
                className={`inline-flex p-0.5 rounded-xl border ${
                  isDark ? 'bg-[#141312] border-[#2B2926]' : 'bg-[#F4F1EA] border-[#EBE6DF]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('steps')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'steps'
                      ? 'bg-[#F55A51] text-white shadow-sm'
                      : isDark
                      ? 'text-[#A39E93] hover:text-white'
                      : 'text-[#7A756D] hover:text-[#1C1B1A]'
                  }`}
                >
                  {language === 'ka'
                    ? `ნაბიჯები (${steps.length})`
                    : language === 'ru'
                    ? `Шаги (${steps.length})`
                    : `Steps (${steps.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === 'video'
                      ? 'bg-[#F55A51] text-white shadow-sm'
                      : isDark
                      ? 'text-[#A39E93] hover:text-white'
                      : 'text-[#7A756D] hover:text-[#1C1B1A]'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  {language === 'ka' ? 'ვიდეო' : language === 'ru' ? 'Видео' : 'Video Clip'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F55A51]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D] dark:text-[#A39E93]">
                  {viewMode === 'video'
                    ? language === 'ka'
                      ? 'ვიდეო ინსტრუქცია'
                      : language === 'ru'
                      ? 'Видеоинструкция'
                      : 'Video Guide'
                    : steps.length > 0
                    ? language === 'ka'
                      ? `ნაბიჯი ${activeStepIndex + 1} / ${steps.length}`
                      : language === 'ru'
                      ? `Шаг ${activeStepIndex + 1} из ${steps.length}`
                      : `Step ${activeStepIndex + 1} of ${steps.length}`
                    : guide.title || guide.name}
                </span>
              </div>
            )}

            {guide.videoDurationSeconds && (
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-[#141312] text-[#A39E93]' : 'bg-[#F4F1EA] text-[#7A756D]'
                }`}
              >
                <Clock className="w-3 h-3" />
                {guide.videoDurationSeconds < 60
                  ? `${guide.videoDurationSeconds}s`
                  : `${Math.ceil(guide.videoDurationSeconds / 60)} min`}
              </span>
            )}
          </div>

          {steps.length > 0 && (
            <div className="flex items-center gap-2">
              <div
                className={`w-20 h-1.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-[#2B2926]' : 'bg-[#EBE6DF]'
                }`}
              >
                <div
                  className="h-full bg-[#2E7D32] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#2E7D32]">
                {completedSteps.size}/{steps.length}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Video Mode */}
      {viewMode === 'video' && videoUrl && (
        <div className="relative bg-[#141312] aspect-video w-full overflow-hidden">
          {isEmbedVideo(videoUrl) ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              title={guide.title || guide.name || 'Appliance Video'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                poster={guide.mediaPoster}
                muted={isMuted}
                playsInline
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={toggleVideoPlay}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F55A51] text-white font-semibold text-xs shadow-lg hover:bg-[#E04840] transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        {language === 'ka' ? 'პაუზა' : language === 'ru' ? 'Пауза' : 'Pause'}
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {language === 'ka'
                          ? 'ვიდეოს ჩართვა'
                          : language === 'ru'
                          ? 'Смотреть видео'
                          : 'Watch Clip'}
                      </>
                    )}
                  </button>

                  {steps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setViewMode('steps')}
                      className="px-3.5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium hover:bg-white/25 transition-colors cursor-pointer"
                    >
                      {language === 'ka'
                        ? 'ნაბიჯების ნახვა →'
                        : language === 'ru'
                        ? 'Пошагово →'
                        : 'View Steps →'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Interactive Step-by-Step Story Mode */}
      {viewMode === 'steps' && currentStep && (
        <div className={compact ? 'p-4' : 'p-5'}>
          {/* Step Progress Pills */}
          <div className="flex items-center gap-1.5 mb-4">
            {steps.map((step, idx) => {
              const isDone = completedSteps.has(step.stepNumber);
              const isCurrent = idx === activeStepIndex;
              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  aria-label={`Step ${idx + 1}`}
                  className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#F55A51]'
                      : isDone
                      ? 'bg-[#2E7D32]'
                      : isDark
                      ? 'bg-[#2B2926] hover:bg-[#3A3733]'
                      : 'bg-[#EBE6DF] hover:bg-[#DED7CD]'
                  }`}
                />
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.stepNumber}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              {/* Visual Photo / Diagram if available */}
              {currentStep.mediaUrl && currentStep.mediaType === 'photo' && (
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#1F1E1C] group">
                  <img
                    src={currentStep.mediaUrl}
                    alt={getStepTitle(currentStep)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold">
                    {activeStepIndex + 1} / {steps.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(currentStep.mediaUrl!)}
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/65 backdrop-blur-md text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Zoom image"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step Header & Description */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F55A51]/15 text-[#F55A51] text-xs font-bold flex items-center justify-center shrink-0">
                      {activeStepIndex + 1}
                    </span>
                    <h4 className="font-bold text-base leading-snug">{getStepTitle(currentStep)}</h4>
                  </div>
                  <p
                    className={`text-sm leading-relaxed pl-8 ${
                      isDark ? 'text-[#A39E93]' : 'text-[#5C5852]'
                    }`}
                  >
                    {getStepDescription(currentStep)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStepComplete(currentStep.stepNumber)}
                  className={`shrink-0 p-2 rounded-xl border transition-all cursor-pointer ${
                    completedSteps.has(currentStep.stepNumber)
                      ? 'bg-[#2E7D32]/15 border-[#2E7D32]/40 text-[#2E7D32]'
                      : isDark
                      ? 'border-[#2B2926] text-[#A39E93] hover:text-white hover:border-[#3A3733]'
                      : 'border-[#EBE6DF] text-[#7A756D] hover:text-[#1C1B1A] hover:border-[#D5CEC4]'
                  }`}
                  title="Mark step complete"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>

              {/* Troubleshooting Tip Callout on final step or if present */}
              {troubleshootingText && activeStepIndex === steps.length - 1 && (
                <div
                  className={`ml-8 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    isDark
                      ? 'bg-[#FFC757]/10 border-[#FFC757]/25 text-[#F7F5F0]'
                      : 'bg-[#FFC757]/15 border-[#FFC757]/35 text-[#1C1B1A]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D99B26] dark:text-[#FFC757]" />
                  <span className="leading-relaxed">{troubleshootingText}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step Navigation Controls */}
          <div
            className={`mt-5 pt-4 border-t flex items-center justify-between gap-2 ${
              isDark ? 'border-[#2B2926]' : 'border-[#EBE6DF]'
            }`}
          >
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 cursor-pointer ${
                isDark
                  ? 'bg-[#1F1E1C] hover:bg-[#2B2926] text-[#F7F5F0] border border-[#2B2926]'
                  : 'bg-white hover:bg-[#F4F1EA] text-[#1C1B1A] border border-[#EBE6DF]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {language === 'ka' ? 'უკან' : language === 'ru' ? 'Назад' : 'Previous'}
            </button>

            {activeStepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F55A51] text-white hover:bg-[#E04840] transition-all shadow-sm cursor-pointer"
              >
                {language === 'ka' ? 'შემდეგი ნაბიჯი' : language === 'ru' ? 'Далее' : 'Next Step'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  toggleStepComplete(currentStep.stepNumber);
                  if (completedSteps.size === steps.length) {
                    setActiveStepIndex(0);
                  }
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  completedSteps.has(currentStep.stepNumber)
                    ? isDark
                      ? 'bg-[#2E7D32]/20 text-[#81C784] border border-[#2E7D32]/40'
                      : 'bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/30'
                    : 'bg-[#2E7D32] text-white hover:bg-[#256628]'
                }`}
              >
                {completedSteps.has(currentStep.stepNumber) ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    {language === 'ka' ? 'თავიდან' : language === 'ru' ? 'Сначала' : 'Start Over'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'ka' ? 'დასრულება' : language === 'ru' ? 'Готово!' : 'All Done!'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fallback when neither steps nor videoUrl are present */}
      {steps.length === 0 && !videoUrl && (
        <div className="p-5 space-y-2">
          <p className="text-sm leading-relaxed">{guide.instructions}</p>
          {troubleshootingText && (
            <p className="text-xs text-[#7A756D] dark:text-[#A39E93]">{troubleshootingText}</p>
          )}
        </div>
      )}

      {/* Fullscreen Image Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={lightboxImage}
            alt="Full size step"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
