import React, { useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star,
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
  isFavorite?: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photosList,
  onClose,
  onSelectPhoto,
  isFavorite = false,
}) => {
  if (!photo) return null;

  const currentIndex = photosList.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photosList.length - 1;
  const isTopPick = isFavorite || photo.isFeatured;

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
            {isTopPick && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <Star className="w-2.5 h-2.5 fill-amber-300" />
                Top Pick
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#4A2632] hover:bg-[#582E3C] border border-white/10 text-rose-200 hover:text-white transition-colors cursor-pointer shadow"
              title="Share photo"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={photo.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-[#4A2632] hover:bg-[#582E3C] text-white border border-white/10 transition-colors shadow"
              title="Open full resolution"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Center: Full Photo Stage */}
        <div className="bg-[#1C0D12] flex items-center justify-center p-3 sm:p-6 min-h-[380px] max-h-[75vh]">
          <img
            src={photo.imageUrl}
            alt={photo.categoryLabel || photo.category}
            className="max-h-[68vh] w-auto max-w-full object-contain shadow-2xl rounded-lg"
          />
        </div>

        {/* Bottom Minimal Footer Bar */}
        <div className="px-5 py-3 bg-[#2B141C] border-t border-white/10 flex items-center justify-between gap-4">
          <div className="text-xs text-rose-100 font-medium">
            Category: <span className="text-white font-semibold">{photo.categoryLabel || photo.category}</span>
          </div>

          <a
            href={`mailto:vaishnavisudha111@gmail.com?subject=Inquiry regarding ${encodeURIComponent(photo.categoryLabel || photo.category)} photography`}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inquire Photo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
