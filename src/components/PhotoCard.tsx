import React from 'react';
import { 
  Maximize2, 
  Heart, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onOpenLightbox: (photo: Photo) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDeleteUserPhoto?: (id: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onOpenLightbox,
  isFavorite,
  onToggleFavorite,
  onDeleteUserPhoto,
}) => {
  return (
    <div 
      className="group relative bg-[#3C1F28] border border-white/10 hover:border-[#DE4373]/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
      id={`photo-card-${photo.id}`}
      onClick={() => onOpenLightbox(photo)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#2A131A] w-full">
        <img
          src={photo.imageUrl}
          alt={photo.categoryLabel || photo.category}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100 group-hover:scale-105"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#261218]/90 via-[#261218]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2A131A]/90 backdrop-blur-md border border-[#DE4373]/60 text-white shadow">
              {photo.categoryLabel || photo.category}
            </span>
            {photo.isUserAdded && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white flex items-center gap-1 shadow">
                <Sparkles className="w-2.5 h-2.5" />
                Custom
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(photo.id);
              }}
              className={`p-2 rounded-full transition-transform hover:scale-110 active:scale-95 shadow cursor-pointer ${
                isFavorite 
                  ? 'bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white' 
                  : 'bg-[#2A131A]/85 text-rose-200 hover:text-white border border-white/15'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* User Added Delete Button */}
            {photo.isUserAdded && onDeleteUserPhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete this photo from your portfolio?`)) {
                    onDeleteUserPhoto(photo.id);
                  }
                }}
                className="p-2 rounded-full bg-red-900/80 hover:bg-red-600 text-white border border-red-700 transition-transform hover:scale-110 shadow cursor-pointer"
                title="Delete this photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Hover Center Inspect Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-semibold tracking-wider shadow-xl flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View Photo</span>
          </div>
        </div>

        {/* Bottom Category Title */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white z-10">
          <h3 className="font-semibold text-base leading-tight drop-shadow group-hover:text-rose-200 transition-colors">
            {photo.categoryLabel || photo.category}
          </h3>
        </div>
      </div>
    </div>
  );
};
