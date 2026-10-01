import React, { useState, useEffect } from 'react';
import { Photo } from './types';
import { WorkExperience } from './types/workExperience';
import { INITIAL_PHOTOS } from './data/initialPhotos';
import { Navbar } from './components/Navbar';
import { Hero, Reel, DEFAULT_REELS } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { WorkExperienceSection } from './components/WorkExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { AddPhotoPage } from './components/AddPhotoPage';

const STORAGE_KEY  = 'vaishnavi_portfolio_photos_v12';
const WORK_STORAGE = 'vaishnavi_work_experience_v1';
const REEL_STORAGE = 'vaishnavi_best_clips_v1';

export default function App() {
  // ── Routing ──────────────────────────────────────────────────────────────
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/addphoto' || hash === '#/addphoto' || hash === '#addphoto') return '/addphoto';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/addphoto' || hash === '#/addphoto' || hash === '#addphoto') setCurrentPath('/addphoto');
      else setCurrentPath('/');
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAddPhoto = () => {
    try { window.history.pushState({}, '', '/addphoto'); } catch { window.location.hash = '/addphoto'; }
    setCurrentPath('/addphoto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    try { window.history.pushState({}, '', '/'); } catch { window.location.hash = ''; }
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Photos state ─────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return INITIAL_PHOTOS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('tech');
  const [lightboxPhoto, setLightboxPhoto]   = useState<Photo | null>(null);
  const [contactPrefilledService, setContactPrefilledService] = useState<string>('');

  // ── Work Experience state ─────────────────────────────────────────────────
  const [experiences, setExperiences] = useState<WorkExperience[]>(() => {
    try {
      const saved = localStorage.getItem(WORK_STORAGE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { /* ignore */ }
    return [];
  });

  // ── Reels (Best Clips) state ──────────────────────────────────────────────
  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem(REEL_STORAGE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return DEFAULT_REELS;
  });

  // Persist reels
  useEffect(() => {
    try { localStorage.setItem(REEL_STORAGE, JSON.stringify(reels)); }
    catch (e) { console.error('Failed to persist reels', e); }
  }, [reels]);

  // Persist work experiences to localStorage
  useEffect(() => {
    try { localStorage.setItem(WORK_STORAGE, JSON.stringify(experiences)); }
    catch (e) { console.error('Failed to persist work experiences', e); }
  }, [experiences]);

  // ── Server data loader ────────────────────────────────────────────────────
  const loadServerData = async () => {
    try {
      const res = await fetch('/api/photos', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.customPhotos)) {
          const customMap = new Map(data.customPhotos.map((p: Photo) => [p.id, p]));
          setPhotos(() => {
            const baseList = INITIAL_PHOTOS.filter(p => !customMap.has(p.id));
            return [...data.customPhotos, ...baseList];
          });
        }
      }
    } catch (err) { console.warn('Could not load photos from database API:', err); }
  };

  useEffect(() => { loadServerData(); }, [currentPath]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); }
    catch (e) { console.error('Failed to persist photos', e); }
  }, [photos]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddPhoto = async (newPhoto: Photo) => {
    setPhotos(prev => [newPhoto, ...prev.filter(p => p.id !== newPhoto.id)]);
    setActiveCategory(newPhoto.category);
    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      });
    } catch { /* silent */ }
  };

  const handleDeleteUserPhoto = async (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (lightboxPhoto?.id === id) setLightboxPhoto(null);
    try { await fetch(`/api/photos?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
    catch { /* silent */ }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset gallery back to default showcase shots?')) {
      setPhotos(INITIAL_PHOTOS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleAddExperience = (exp: WorkExperience) => {
    setExperiences(prev => [exp, ...prev]);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  const handleAddReel = (reel: Reel) => {
    setReels(prev => [...prev, reel]);
  };

  const handleDeleteReel = (id: string) => {
    setReels(prev => prev.filter(r => r.id !== id));
  };

  const handleExplorePortfolio = (category?: string) => {
    if (category) setActiveCategory(category);
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Admin route ───────────────────────────────────────────────────────────
  if (currentPath === '/addphoto') {
    return (
      <AddPhotoPage
        onBack={navigateToHome}
        onAddPhoto={handleAddPhoto}
        photos={photos}
        onDeleteUserPhoto={handleDeleteUserPhoto}
        experiences={experiences}
        onAddExperience={handleAddExperience}
        onDeleteExperience={handleDeleteExperience}
        reels={reels}
        onAddReel={handleAddReel}
        onDeleteReel={handleDeleteReel}
      />
    );
  }

  // ── Main portfolio ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#2A151D] text-rose-50 font-sans selection:bg-[#DE4373] selection:text-white relative">

      <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      <main className="space-y-0">
        <Hero onExplorePortfolio={handleExplorePortfolio} photoCount={photos.length} reels={reels} />

        <AboutSection />

        {/* Work Experience — only shown when cards exist */}
        <WorkExperienceSection experiences={experiences} />

        <PortfolioSection
          photos={photos}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenLightbox={photo => setLightboxPhoto(photo)}
          onResetToDefault={handleResetToDefault}
        />

        <ContactSection prefilledService={contactPrefilledService} />
      </main>

      <Footer onNavigateAddPhoto={navigateToAddPhoto} />

      <LightboxModal
        photo={lightboxPhoto}
        photosList={photos.filter(p => {
          if (p.category === activeCategory) return true;
          const normP = p.category.toLowerCase().replace(/[-_]/g, '');
          const normA = activeCategory.toLowerCase().replace(/[-_]/g, '');
          return normP === normA;
        })}
        onClose={() => setLightboxPhoto(null)}
        onSelectPhoto={photo => setLightboxPhoto(photo)}
      />
    </div>
  );
}
