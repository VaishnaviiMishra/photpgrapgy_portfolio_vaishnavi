import React, { useState } from 'react';
import {
  Camera,
  PlusCircle,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { Button as MovingBorderButton } from './ui/moving-border';

interface NavbarProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  activeCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    scrollToSection('portfolio');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#3E232B]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left Brand Identity: Exact screenshot replica */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
            id="nav-brand-logo"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DE4373] to-[#BF2C5B] flex items-center justify-center text-white shadow-md shadow-pink-950/50 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#DE4373] border-2 border-[#3E232B]" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg group-hover:text-rose-200 transition-colors">
                Vaishnavi Mishra
              </span>
              <span className="text-[9px] text-rose-200/70 uppercase tracking-widest font-mono">
                A Corporte Majdoor trying to keep her passion alive
              </span>
            </div>
          </div>

          {/* Desktop Central Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-rose-100/80">
            <button
              onClick={() => scrollToSection('home')}
              className="hover:text-white transition-colors cursor-pointer py-1"
              id="nav-home-btn"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-white transition-colors cursor-pointer py-1"
              id="nav-about-btn"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="hover:text-white transition-colors cursor-pointer py-1"
              id="nav-services-btn"
            >
              Service
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="hover:text-white transition-colors cursor-pointer py-1"
              id="nav-clicks-btn"
            >
              Best Clicks
            </button>
          </nav>

          {/* Action CTAs (Contact Me pill with moving border) */}
          <div className="hidden lg:flex items-center gap-3">
            <MovingBorderButton
              borderRadius="9999px"
              duration={2800}
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] text-white px-6 py-2.5 font-semibold text-sm shadow-lg shadow-pink-950/40"
              id="nav-contact-pill-btn"
            >
              Contact Me
            </MovingBorderButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-rose-100 hover:text-white rounded-full bg-[#4A2833] border border-white/10"
              aria-label="Toggle navigation"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#321A22] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-medium text-rose-100/90">
            <button
              onClick={() => scrollToSection('home')}
              className="text-left hover:text-[#DE4373] py-1"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left hover:text-[#DE4373] py-1"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-left hover:text-[#DE4373] py-1"
            >
              Service
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-left hover:text-[#DE4373] py-1"
            >
              Best Clicks
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-sm font-semibold shadow-md"
            >
              <span>Contact Me</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
