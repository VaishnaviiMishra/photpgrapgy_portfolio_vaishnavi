import { Photo, PhotoCategory } from '../types';

// Load images eagerly using Vite's glob import from assets/photos/
const techModules = import.meta.glob('../../assets/photos/tech/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const landscapeModules = import.meta.glob('../../assets/photos/Landscapes/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const concertModules = import.meta.glob('../../assets/photos/concert/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const faunaModules = import.meta.glob('../../assets/photos/fauna/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const furbabiesModules = import.meta.glob('../../assets/photos/furbabies/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const portraitModules = import.meta.glob('../../assets/photos/portraits/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const rootModules = import.meta.glob('../../assets/photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Helper to extract clean titles from filenames
function getCleanTitle(filename: string, categoryName: string, index: number): string {
  const base = filename.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
  if (base.includes('VaishnaviMishra_MAIT')) return 'Campus Horizon & Scenic Framing';
  if (base.includes('behance_project')) return `Live Stage Performance Feature ${index + 1}`;
  if (base.includes('Image 1')) return 'Scenic Mountain Vista';
  if (base.includes('Image 2')) return 'Open Skies Panorama';
  if (base.includes('Image 3')) return 'Stage Energy & Rhythm';

  const descriptiveTitles: Record<string, string[]> = {
    tech: [
      'Tech Summit Keynote Focus',
      'Hackathon Sprint & Collaboration',
      'Developer Stage Presentation',
      'Live Coding & Project Demo',
      'Community Hackathon Milestone',
      'Technical Speaker Spotlight',
      'DevFest Keynote Engagement',
      'Developer Team Brainstorm',
      'Commutels Summit Milestones',
      'Conference Stage Atmosphere',
      'Dev Community Highlights',
    ],
    landscapes: [
      'Golden Hour Horizon',
      'Dawn Reflections & Quiet Skies',
      'Morning Light & Mist',
      'Golden Sunrise Vista',
      'Sunlit Scenic Valley',
      'Early Dawn Panorama',
      'Morning Solitude & Open Range',
      'Afternoon Skies & Horizon',
      'Warm Evening Glow',
      'Verdant Nature & Scenic Calm',
      'Open Horizon Perspective',
      'Dramatic Sky Formations',
      'Mountain Horizon & Skies',
      'Pristine Natural Vistas',
      'Tranquil Scenic Atmosphere',
      'Vast Skyline & Terrain',
      'Quiet Forest Path',
      'Lush Green Canopy',
      'Natural Light Contrast',
      'Dusk Horizon Palette',
      'Atmospheric Mist & Horizon',
      'Twilight Landscape Study',
      'Open Air Vista',
      'Scenic Nature Horizon',
      'Campus Framing & Landscape',
    ],
    'concerts-fests': [
      'Spotlight & Artist Performance',
      'Live Stage Energy & Bass',
      'Dynamic Concert Laser Display',
      'Cultural Fest Euphoria',
      'Stage Atmosphere & Beams',
      'Artist in Musical Flow',
      'Live Music Euphoria',
      'Concert Stage Highlights I',
      'Concert Stage Highlights II',
    ],
    fauna: [
      'Wildlife in Natural Habitat',
      'Avian Focus & Plumage Detail',
      'Nature & Habitat Observation',
      'Perched Avian Detail',
      'Candid Wildlife Gaze',
      'Nature & Feather Study',
    ],
    'fur-babies': [
      'Playful Morning Pup Sprint',
      'Golden Companion Portrait',
      'Soulful Pet Eye Contact',
      'Joyful Fur Baby Moment',
      'Outdoor Meadow Sprints',
      'Pure Dog Joy & Sunshine',
      'Sweet Companion Close-Up',
      'Golden Hour Fur Gaze',
      'Gentle Companion Portrait',
      'Cozy Fur Baby Session',
    ],
    portraits: [
      'Expressive Portraiture Study I',
      'Natural Light Editorial',
      'Golden Radiance Portrait',
      'Creative Mood & Ambient Tone',
      'Editorial Silhouette & Lighting',
      'Introspective Expression Study',
      'Soft Prism Lighting Portrait',
      'Natural True-Tone Portrait',
      'Classic Creative Portraiture',
    ],
  };

  const titles = descriptiveTitles[categoryName];
  if (titles && titles[index]) {
    return titles[index];
  }
  return `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Shot #${index + 1}`;
}

// Convert a module collection to Photo array
function buildPhotosFromModule(
  modules: Record<string, string>,
  category: PhotoCategory,
  categoryLabel: string,
  prefix: string,
  defaultLens: string,
  defaultPreset: string,
  categoryTags: string[],
  categoryDesc: string
): Photo[] {
  return Object.entries(modules).map(([pathKey, url], index) => {
    const filename = pathKey.split('/').pop() || '';
    const title = getCleanTitle(filename, category, index);
    return {
      id: `${prefix}-${index + 1}`,
      title,
      category,
      categoryLabel,
      imageUrl: url,
      aspectRatio: index % 3 === 0 ? 'portrait' : 'landscape',
      description: `${title}. ${categoryDesc} captured by Vaishnavi Mishra.`,
      isFeatured: index < 4,
      year: '2024-2026',
      cameraInfo: {
        body: 'Canon EOS R10',
        lens: defaultLens,
        lightroomPreset: defaultPreset,
      },
      tags: [...categoryTags, 'photography', 'vaishnavimishra'],
    };
  });
}

// 1. Tech Events & Commutels (from assets/photos/tech)
const techPhotos = buildPhotosFromModule(
  techModules,
  'tech',
  'Tech Events',
  'tech',
  '85mm f/1.8 & 35mm Prime',
  'Clean Tech Conference Profile',
  ['tech', 'googledevs', 'hackathon', 'commutels', 'conference', 'developers'],
  'Developer conferences, Google Developers summits, and hackathon milestones'
);

// 2. Landscapes (from assets/photos/Landscapes)
const landscapePhotos = buildPhotosFromModule(
  landscapeModules,
  'landscapes',
  'Landscapes',
  'landscape',
  'Wide Angle & 50mm Prime',
  'Cinematic Natural Horizons',
  ['landscapes', 'scenic', 'nature', 'horizons', 'skies'],
  'Scenic landscape compositions and open vistas'
);

// 3. Concerts & Stage (from assets/photos/concert)
const concertPhotos = buildPhotosFromModule(
  concertModules,
  'concerts-fests',
  'Concerts & Stage',
  'concert',
  '85mm f/1.8 & 50mm f/1.8 Prime',
  'Dynamic Stage & Lasers Profile',
  ['concert', 'concerts-fests', 'livemusic', 'stage', 'performance', 'lowlight'],
  'Live concert energy, stage lighting, and performance emotion'
);

// 4. Fauna & Wildlife (from assets/photos/fauna)
const faunaPhotos = buildPhotosFromModule(
  faunaModules,
  'fauna',
  'Fauna & Wildlife',
  'fauna',
  'Telephoto & Fast Prime Optics',
  'Sharp Wildlife Detail & Clarity',
  ['fauna', 'wildlife', 'nature', 'birds', 'avian'],
  'Candid avian encounters and wildlife in natural habitats'
);

// 5. Fur Babies (from assets/photos/furbabies)
const furbabiesPhotos = buildPhotosFromModule(
  furbabiesModules,
  'fur-babies',
  'Fur Babies',
  'furbaby',
  '85mm f/1.8 Prime (Eye-AF)',
  'Warm Golden Fur & Soulful Bokeh',
  ['fur-babies', 'furbabies', 'pets', 'dogs', 'animals', 'goldenhour'],
  'Heartfelt pet portrait sessions and high-speed candid joy'
);

// 6. Portraits & Clicks (from assets/photos/portraits)
const portraitPhotos = buildPhotosFromModule(
  portraitModules,
  'portraits',
  'Portraits & Clicks',
  'portrait',
  '85mm & 50mm f/1.8 Prime',
  'True-Tone Natural Skin Mastering',
  ['portraits', 'editorial', 'expressions', 'naturallight', 'lifestyle'],
  'Individual editorial expressions and creative lighting portraiture'
);

// 7. Root photos in assets/photos (e.g., IMG_2217.jpg)
const rootPhotos: Photo[] = Object.entries(rootModules).map(([pathKey, url], index) => {
  const filename = pathKey.split('/').pop() || '';
  return {
    id: `root-photo-${index + 1}`,
    title: 'Companion Golden Fur Moment',
    category: 'fur-babies',
    categoryLabel: 'Fur Babies',
    imageUrl: url,
    aspectRatio: 'portrait',
    description: 'Soulful companion portrait captured with natural lighting.',
    isFeatured: true,
    year: '2024-2026',
    cameraInfo: {
      body: 'Canon EOS R10',
      lens: '85mm f/1.8 Prime',
      lightroomPreset: 'Warm Golden Fur Profile',
    },
    tags: ['fur-babies', 'furbabies', 'pets', 'dogs', 'photography'],
  };
});

// Master curated gallery combining all category photos from assets/photos/
export const INITIAL_PHOTOS: Photo[] = [
  ...techPhotos,
  ...furbabiesPhotos,
  ...rootPhotos,
  ...concertPhotos,
  ...landscapePhotos,
  ...portraitPhotos,
  ...faunaPhotos,
];
