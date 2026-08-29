import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Sparkles, 
  RotateCcw,
  LayoutGrid,
  Columns,
  Search,
  X,
  Star
} from 'lucide-react';
import { Photo } from '../types';
import { PhotoCard } from './PhotoCard';

interface PortfolioSectionProps {
  photos: Photo[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenLightbox: (photo: Photo) => void;
  favorites: Set<string>;
  onResetToDefault: () => void;
}

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  photos,
  activeCategory,
  onSelectCategory,
  onOpenLightbox,
  favorites,
  onResetToDefault,
}) => {
  const [viewColumns, setViewColumns] = useState<'2-col' | '3-col'>('3-col');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES: CategoryOption[] = [
    { id: 'top', label: 'Top Photos', icon: <Star className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'all', label: 'All Photos', icon: <Sparkles className="w-3.5 h-3.5 text-[#DE4373]" /> },
    { id: 'tech', label: 'Tech Events & Fests', icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" /> },
    { id: 'landscapes', label: 'Landscapes', icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" /> },
    { id: 'fauna', label: 'Fauna', icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" /> },
    { id: 'concert', label: 'Concerts & Fests', icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" /> },
    { id: 'fur-babies', label: 'Fur Babies', icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" /> },
    { id: 'portraits', label: 'Portraits', icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" /> },
  ];

  const isCategoryMatch = (photoCategory: string, targetCategory: string) => {
    if (targetCategory === 'all') return true;
    if (photoCategory === targetCategory) return true;
    const normP = photoCategory.toLowerCase().replace(/[-_]/g, '');
    const normT = targetCategory.toLowerCase().replace(/[-_]/g, '');
    if (normP === normT) return true;
    if ((targetCategory === 'fur-babies' || targetCategory === 'furbabies') && (photoCategory === 'fur-babies' || photoCategory === 'furbabies' || photoCategory === 'pet' || photoCategory === 'pets')) return true;
    if ((targetCategory === 'concerts-fests' || targetCategory === 'concert' || targetCategory === 'concerts') && (photoCategory === 'concerts-fests' || photoCategory === 'concert' || photoCategory === 'concerts')) return true;
    if (targetCategory === 'tech' && (photoCategory === 'tech' || photoCategory === 'tech-events')) return true;
    return false;
  };

  // Filter photos based on category and search
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Top Photos check: STRICTLY respects creator curated favorites
      if (activeCategory === 'top') {
        if (!favorites.has(photo.id)) return false;
      } else if (activeCategory !== 'all' && !isCategoryMatch(photo.category, activeCategory)) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = photo.title?.toLowerCase().includes(query);
        const matchCategory = photo.categoryLabel?.toLowerCase().includes(query) || photo.category?.toLowerCase().includes(query);
        const matchDesc = photo.description?.toLowerCase().includes(query);
        const matchLoc = photo.location?.toLowerCase().includes(query);
        const matchEvent = photo.eventOrClient?.toLowerCase().includes(query);
        const matchTags = photo.tags?.some((t) => t.toLowerCase().includes(query));
        const matchLens = photo.cameraInfo?.lens?.toLowerCase().includes(query);
        const matchLightroom = photo.cameraInfo?.lightroomPreset?.toLowerCase().includes(query);

        return matchTitle || matchCategory || matchDesc || matchLoc || matchEvent || matchTags || matchLens || matchLightroom;
      }
      return true;
    });
  }, [photos, activeCategory, favorites, searchQuery]);

  // Count per category
  const getCategoryCount = (catId: string) => {
    if (catId === 'top') {
      return photos.filter((p) => favorites.has(p.id)).length;
    }
    if (catId === 'all') {
      return photos.length;
    }
    return photos.filter((p) => isCategoryMatch(p.category, catId)).length;
  };

  return (
    <section id="portfolio" className="py-20 bg-[#351C24] relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider">
              <span>Best Clicks & Archive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Selected Works & Categories
            </h2>
            <p className="text-rose-100/80 text-sm font-normal max-w-xl">
              Filter through specialized series, inspect technical EXIF parameters, and explore curated photo stories.
            </p>
          </div>

          {/* Quick Actions: Search & Layout toggle */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-60 pl-8 pr-7 py-2 rounded-full bg-[#42222D] border border-white/10 text-xs text-white placeholder:text-rose-200/50 focus:outline-none focus:border-[#DE4373] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-rose-300/60 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rose-300 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Layout Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-[#42222D] border border-white/10">
              <button
                onClick={() => setViewColumns('2-col')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewColumns === '2-col' ? 'bg-[#DE4373] text-white' : 'text-rose-200/70 hover:text-white'}`}
                title="2 Columns Layout"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewColumns('3-col')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewColumns === '3-col' ? 'bg-[#DE4373] text-white' : 'text-rose-200/70 hover:text-white'}`}
                title="3 Columns Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar border-b border-white/10">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer border shadow-sm ${isSelected
                  ? 'bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] border-transparent text-white shadow-pink-950/40 scale-105'
                  : 'bg-[#42222D] border-white/10 text-rose-100/80 hover:bg-[#4E2835] hover:text-white'
                  }`}
                id={`cat-btn-${cat.id}`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isSelected ? 'bg-black/40 text-white' : 'bg-black/20 text-rose-200'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length > 0 ? (
          <div className={`mt-8 grid gap-6 ${viewColumns === '3-col'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
            }`}>
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onOpenLightbox={onOpenLightbox}
                isFavorite={favorites.has(photo.id)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="mt-12 text-center py-16 px-4 rounded-2xl bg-[#3E222C] border border-white/10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#4E2735] text-[#DE4373] border border-white/10 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-white">No photos matched your filter</h4>
              <p className="text-xs text-rose-200/70 max-w-md mx-auto">
                {searchQuery
                  ? `No photos found matching "${searchQuery}". Try a different keyword.`
                  : activeCategory === 'top'
                  ? 'No photos are currently marked as Top Picks. Star photos on /addphoto to curate your top collection!'
                  : 'There are currently no photos in this selection.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory('all');
                }}
                className="px-5 py-2.5 rounded-full bg-[#4A2632] hover:bg-[#58303D] text-white text-xs font-semibold border border-white/10 cursor-pointer"
              >
                View All Photos
              </button>
            </div>
          </div>
        )}

        {/* Gallery Footer Bar: Custom Photos Count & Reset */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-rose-200/70 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-white font-bold">{filteredPhotos.length}</span>
            <span>Items Indexed</span>
            <span className="text-rose-300/40">•</span>
            <span>Curated Showcase Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetToDefault}
              className="flex items-center gap-1.5 text-rose-200 hover:text-white transition-colors cursor-pointer"
              title="Reset gallery to default showcase shots"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#DE4373]" />
              <span>Reset Archive</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
