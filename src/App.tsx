import React, { useState, useEffect } from 'react';
import { Photo } from './types';
import { INITIAL_PHOTOS } from './data/initialPhotos';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { AddPhotoPage } from './components/AddPhotoPage';

const STORAGE_KEY = 'vaishnavi_portfolio_photos_v12';

export default function App() {
  // Routing state ('/' or '/addphoto')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/addphoto' || hash === '#/addphoto' || hash === '#addphoto') {
        return '/addphoto';
      }
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/addphoto' || hash === '#/addphoto' || hash === '#addphoto') {
        setCurrentPath('/addphoto');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAddPhoto = () => {
    try {
      window.history.pushState({}, '', '/addphoto');
    } catch {
      window.location.hash = '/addphoto';
    }
    setCurrentPath('/addphoto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Photos state loaded with initial photos and local persistence
  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PHOTOS;
  });

  // Active category filter state (defaults to 'tech')
  const [activeCategory, setActiveCategory] = useState<string>('tech');
  
  // Lightbox Modal state
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Contact prefilled service
  const [contactPrefilledService, setContactPrefilledService] = useState<string>('');

  // 1. Fetch serverless database photos on mount and route switch
  const loadServerData = async () => {
    try {
      const res = await fetch('/api/photos', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        
        // Merge custom photos from database at the beginning
        if (Array.isArray(data.customPhotos)) {
          const customMap = new Map(data.customPhotos.map((p: Photo) => [p.id, p]));
          setPhotos((prev) => {
            const baseList = INITIAL_PHOTOS.filter((p) => !customMap.has(p.id));
            const merged = [...data.customPhotos, ...baseList];
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn('Could not load photos from database API:', err);
    }
  };

  useEffect(() => {
    loadServerData();
  }, [currentPath]);

  // Persist photos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to persist photos', e);
    }
  }, [photos]);

  // Add new photo handler
  const handleAddPhoto = async (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev.filter(p => p.id !== newPhoto.id)]);
    setActiveCategory(newPhoto.category);

    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      });
    } catch (err) {
      console.warn('Failed to persist new photo to database:', err);
    }
  };

  // Delete user added photo handler
  const handleDeleteUserPhoto = async (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (lightboxPhoto?.id === id) {
      setLightboxPhoto(null);
    }

    try {
      await fetch(`/api/photos?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Failed to delete photo from database:', err);
    }
  };

  // Reset to default curated photos
  const handleResetToDefault = () => {
    if (window.confirm('Reset gallery back to default showcase shots?')) {
      setPhotos(INITIAL_PHOTOS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Handle explore portfolio click from Hero
  const handleExplorePortfolio = (category?: string) => {
    if (category) {
      setActiveCategory(category);
    }
    const portfolioElement = document.getElementById('portfolio');
    if (portfolioElement) {
      portfolioElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle service booking selection
  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setContactPrefilledService(serviceTitle);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If on /addphoto, render Creator Studio Page
  if (currentPath === '/addphoto') {
    return (
      <AddPhotoPage
        onBack={navigateToHome}
        onAddPhoto={handleAddPhoto}
        photos={photos}
        onDeleteUserPhoto={handleDeleteUserPhoto}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#2A151D] text-rose-50 font-sans selection:bg-[#DE4373] selection:text-white relative">
      
      {/* Top Floating Glass Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Content Flow */}
      <main className="space-y-0">
        {/* Editorial Hero Banner */}
        <Hero
          onExplorePortfolio={handleExplorePortfolio}
          photoCount={photos.length}
        />

        {/* The Photographer Biography & Journey */}
        <AboutSection />

        {/* Portfolio Gallery Showcase with Direct Category Tabs */}
        <PortfolioSection
          photos={photos}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenLightbox={(photo) => setLightboxPhoto(photo)}
          onResetToDefault={handleResetToDefault}
        />

        {/* Services, Packages & Production Banner */}
        <ServicesSection
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
        />

        {/* Contact, Inquiries & Shoot Request Form */}
        <ContactSection
          prefilledService={contactPrefilledService}
        />
      </main>

      {/* Footer with Discreet Creator Access */}
      <Footer onNavigateAddPhoto={navigateToAddPhoto} />

      {/* Interactive Fullscreen Lightbox & Photo Inspector Modal */}
      <LightboxModal
        photo={lightboxPhoto}
        photosList={photos.filter((p) => {
          if (p.category === activeCategory) return true;
          const normP = p.category.toLowerCase().replace(/[-_]/g, '');
          const normA = activeCategory.toLowerCase().replace(/[-_]/g, '');
          return normP === normA;
        })}
        onClose={() => setLightboxPhoto(null)}
        onSelectPhoto={(photo) => setLightboxPhoto(photo)}
      />

    </div>
  );
}
