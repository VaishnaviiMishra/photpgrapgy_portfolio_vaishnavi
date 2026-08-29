import React, { useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  ExternalLink,
  Mail
} from 'lucide-react';
import { Photo } from '../types';

interface LightboxModalProps {
  photo: Photo | null;
  photosList: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photosList,
  onClose,
  onSelectPhoto,
}) => {
  if (!photo) return null;

  const currentIndex = photosList.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photosList.length - 1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasPrev) {
      onSelectPhoto(photosList[currentIndex - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasNext) {
      onSelectPhoto(photosList[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onSelectPhoto(photosList[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) onSelectPhoto(photosList[currentIndex + 1]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, photosList, onClose, onSelectPhoto]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${photo.categoryLabel || photo.category} by Vaishnavi Mishra`,
          text: `Photography by Vaishnavi Mishra - ${photo.categoryLabel || photo.category}`,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      id="lightbox-backdrop"
    >
      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-[#351C24] hover:bg-[#DE4373] text-white transition-all cursor-pointer border border-white/15 shadow-xl"
        aria-label="Close modal"
        id="lightbox-close-btn"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev Navigation Button */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-50 p-3.5 rounded-full bg-[#351C24]/90 hover:bg-[#DE4373] text-white border border-white/15 transition-all cursor-pointer hover:scale-105 shadow-2xl"
          aria-label="Previous photo"
          id="lightbox-prev-btn"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next Navigation Button */}
      {hasNext && (
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-50 p-3.5 rounded-full bg-[#351C24]/90 hover:bg-[#DE4373] text-white border border-white/15 transition-all cursor-pointer hover:scale-105 shadow-2xl"
          aria-label="Next photo"
          id="lightbox-next-btn"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Lightbox Container */}
      <div 
        className="relative max-w-5xl w-full max-h-[92vh] bg-[#351C24] overflow-hidden rounded-2xl border border-white/15 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#2B141C] border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white uppercase tracking-wider shadow">
              {photo.categoryLabel || photo.category}
            </span>
            <span className="text-xs font-mono text-rose-200/70">
              {currentIndex + 1} of {photosList.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#4A2632] hover:bg-[#582E3C] border border-white/10 text-rose-200 hover:text-white transition-colors cursor-pointer shadow"
              title="Share photo"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns on Desktop (Image & Metadata) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto max-h-[calc(92vh-4rem)]">
          {/* Main Visual */}
          <div className="lg:col-span-8 bg-[#1D0B12] flex items-center justify-center p-2 sm:p-4 min-h-[300px] lg:min-h-[500px]">
            <img 
              src={photo.imageUrl} 
              alt={photo.title || photo.category}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Sidebar: Details & Inquire CTA */}
          <div className="lg:col-span-4 p-6 bg-[#351C24] flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#DE4373] font-semibold">
                  {photo.categoryLabel || photo.category}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                  {photo.title || photo.categoryLabel}
                </h3>
              </div>

              {photo.description && (
                <p className="text-xs text-rose-100/80 leading-relaxed font-normal">
                  {photo.description}
                </p>
              )}

              {/* Technical Optics Details */}
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <span className="font-semibold text-rose-200/90 uppercase tracking-wider text-[10px] block">
                  Optics & Capture Gear
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-[#2A131B] border border-white/5 space-y-0.5">
                    <span className="text-rose-200/50 block text-[9px] uppercase">Body</span>
                    <span className="text-white font-medium">Canon EOS R10</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#2A131B] border border-white/5 space-y-0.5">
                    <span className="text-rose-200/50 block text-[9px] uppercase">Lens / Focal</span>
                    <span className="text-white font-medium truncate block">{photo.cameraInfo?.lens || 'Prime Optics'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquire Action CTA */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <a
                href="#contact"
                onClick={onClose}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] text-white text-xs font-bold text-center block transition-all shadow-lg hover:shadow-pink-950/50"
              >
                Inquire For Shoot
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
