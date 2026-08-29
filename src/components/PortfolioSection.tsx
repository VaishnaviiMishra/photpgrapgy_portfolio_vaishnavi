import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  PlusCircle,
  Heart,
  Cpu,
  HeartHandshake,
  Compass,
  Music,
  Camera,
  Layers,
  RotateCcw
} from 'lucide-react';
import { Photo, PhotoCategory } from '../types';
import { PhotoCard } from './PhotoCard';

interface PortfolioSectionProps {
  photos: Photo[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenLightbox: (photo: Photo) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onDeleteUserPhoto: (id: string) => void;
  onResetToDefault: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  photos,
  activeCategory,
  onSelectCategory,
  onOpenLightbox,
  favorites,
  onToggleFavorite,
  onDeleteUserPhoto,
  onResetToDefault,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [viewColumns, setViewColumns] = useState<'3-col' | '2-col'>('3-col');

  // Categories definitions
  const CATEGORIES: { id: string; label: string; icon: React.ReactNode; badge: string; description: string }[] = [
    {
      id: 'top',
      label: 'Top Photos',
      icon: <Heart className="w-3.5 h-3.5 text-[#DE4373] fill-[#DE4373]" />,
      badge: 'Curated Favorites',
      description: 'Handpicked highlights and top favorite photographs curated across all sessions—heart any photo to add it to this collection.'
    },
    {
      id: 'tech',
      label: 'Tech Events',
      icon: <Cpu className="w-3.5 h-3.5 text-[#DE4373]" />,
      badge: 'Google Devs & Commutels',
      description: 'Documenting developer conferences, Google Developers events, and Commutels hackathons—framing keynote moments, collaborative sprints, and speaker passion.'
    },
    {
      id: 'fur-babies',
      label: 'Fur Babies',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-[#DE4373]" />,
      badge: 'Animal Portraiture',
      description: 'Personal portrait sessions for companion animals. High-speed shutter mechanics freezing mid-air sprints with patient golden-hour framing.'
    },
    {
      id: 'landscapes',
      label: 'Landscapes',
      icon: <Compass className="w-3.5 h-3.5 text-[#DE4373]" />,
      badge: 'Natural Horizons',
      description: 'Capturing natural vistas, scenic horizons, mountain perspectives, and landscape photography.'
    },
    {
      id: 'concerts-fests',
      label: 'Concerts & Stage',
      icon: <Music className="w-3.5 h-3.5 text-[#DE4373]" />,
      badge: 'Stage Lighting & Lasers',
      description: 'Live performance and cultural fest atmosphere captured with fast prime optics and dynamic low-light color grading.'
    },
    {
      id: 'portraits',
      label: 'Portraits & Clicks',
      icon: <Camera className="w-3.5 h-3.5 text-[#DE4373]" />,
      badge: 'Creative Expressions',
      description: 'Individual editorial portraits with natural prism lighting, graduation memories, and clean true-tone skin color mastering in Adobe Lightroom.'
    },
    {
      id: 'fauna',
      label: 'Fauna & Wildlife',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#DE4373]" />,
      badge: 'Avian & Wildlife',
      description: 'Candid wildlife frames and avian encounters in natural habitat with sharp focus and authentic detail.'
    },
  ];

  // Helper to match category IDs with alias tolerance
  const isCategoryMatch = (photoCategory: string, targetCategory: string) => {
    if (targetCategory === 'top' || targetCategory === 'all') return true;
    if (photoCategory === targetCategory) return true;
    const normP = photoCategory.toLowerCase().replace(/[-_]/g, '');
    const normT = targetCategory.toLowerCase().replace(/[-_]/g, '');
    if (normP === normT) return true;
    if ((targetCategory === 'fur-babies' || targetCategory === 'furbabies') && (photoCategory === 'fur-babies' || photoCategory === 'furbabies' || photoCategory === 'pet' || photoCategory === 'pets')) return true;
    if ((targetCategory === 'concerts-fests' || targetCategory === 'concert' || targetCategory === 'concerts') && (photoCategory === 'concerts-fests' || photoCategory === 'concert' || photoCategory === 'concerts')) return true;
    if (targetCategory === 'tech' && (photoCategory === 'tech' || photoCategory === 'tech-events')) return true;
    return false;
  };

  // Filter photos based on category, search, and favorites
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Top Photos check: shows user-liked/favorited photos (or featured if no favorites yet)
      if (activeCategory === 'top' || activeCategory === 'all') {
        const isLiked = favorites.has(photo.id);
        if (favorites.size > 0) {
          if (!isLiked) return false;
        } else {
          if (!photo.isFeatured) return false;
        }
      } else if (!isCategoryMatch(photo.category, activeCategory)) {
        return false;
      }
      // Favorites filter toggle check
      if (showOnlyFavorites && !favorites.has(photo.id)) {
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
  }, [photos, activeCategory, showOnlyFavorites, favorites, searchQuery]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory || isCategoryMatch(c.id, activeCategory)) || CATEGORIES[0];

  // Count per category
  const getCategoryCount = (catId: string) => {
    if (catId === 'top' || catId === 'all') {
      return favorites.size > 0
        ? photos.filter((p) => favorites.has(p.id)).length
        : photos.filter((p) => p.isFeatured).length;
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
              Filter through specialized series, inspect technical EXIF parameters, or add your custom pictures directly into the vault.
            </p>
          </div>

          {/* Quick Actions: Favorites (Pill style) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-5 py-3 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${showOnlyFavorites
                ? 'bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white border-transparent'
                : 'bg-[#43232E] border-white/10 text-rose-100 hover:text-white hover:border-[#DE4373]/50'
                }`}
              title="Show only favorited photos"
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white text-white' : ''}`} />
              <span>Favorites ({favorites.size})</span>
            </button>
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
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isSelected ? 'bg-black/40 text-white' : 'bg-black/20 text-rose-200'
                  }`}>
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
                onToggleFavorite={onToggleFavorite}
                onDeleteUserPhoto={onDeleteUserPhoto}
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
                  : 'There are currently no photos in this selection.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowOnlyFavorites(false);
                  onSelectCategory('top');
                }}
                className="px-5 py-2.5 rounded-full bg-[#4A2632] hover:bg-[#58303D] text-white text-xs font-semibold border border-white/10 cursor-pointer"
              >
                Clear Filters
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
            <span>Local Vault Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetToDefault}
              className="flex items-center gap-1.5 text-rose-200 hover:text-white transition-colors cursor-pointer"
              title="Reset gallery to original portfolio shots"
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
