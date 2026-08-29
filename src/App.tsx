import React, { useState, useEffect } from 'react';
import { Photo, PhotoCategory } from './types';
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

const STORAGE_KEY = 'vaishnavi_portfolio_photos_v10';
const FAVORITES_KEY = 'vaishnavi_portfolio_favorites_v10';

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

  // Photos state loaded with local persistence
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

  // Favorites state initialized with top featured picks
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    const initialFavs = new Set<string>();
    INITIAL_PHOTOS.filter((p) => p.isFeatured).forEach((p) => initialFavs.add(p.id));
    return initialFavs;
  });

  // Active navigation & category filter state (defaults to 'top')
  const [activeCategory, setActiveCategory] = useState<string>('top');
  
  // Lightbox Modal state
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Contact prefilled service
  const [contactPrefilledService, setContactPrefilledService] = useState<string>('');

  // Persist photos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to persist photos', e);
    }
  }, [photos]);

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Failed to persist favorites', e);
    }
  }, [favorites]);

  // Add new photo handler
  const handleAddPhoto = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setActiveCategory(newPhoto.category);
  };

  // Delete user added photo handler
  const handleDeleteUserPhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (lightboxPhoto?.id === id) {
      setLightboxPhoto(null);
    }
  };

  // Reset to default curated photos
  const handleResetToDefault = () => {
    if (window.confirm('Reset gallery back to default showcase shots?')) {
      setPhotos(INITIAL_PHOTOS);
      const initialFavs = new Set<string>();
      INITIAL_PHOTOS.filter((p) => p.isFeatured).forEach((p) => initialFavs.add(p.id));
      setFavorites(initialFavs);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FAVORITES_KEY);
    }
  };

  // Toggle favorite photo
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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

        {/* Portfolio Gallery Showcase with Advanced Filter & EXIF Details */}
        <PortfolioSection
          photos={photos}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenLightbox={(photo) => setLightboxPhoto(photo)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onDeleteUserPhoto={handleDeleteUserPhoto}
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
          if (activeCategory === 'top' || activeCategory === 'all') {
            return favorites.size > 0 ? favorites.has(p.id) : p.isFeatured;
          }
          return p.category === activeCategory;
        })}
        onClose={() => setLightboxPhoto(null)}
        onSelectPhoto={(photo) => setLightboxPhoto(photo)}
        isFavorite={lightboxPhoto ? favorites.has(lightboxPhoto.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

    </div>
  );
}
