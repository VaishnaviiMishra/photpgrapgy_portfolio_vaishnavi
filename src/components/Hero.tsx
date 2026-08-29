import React from 'react';
import {
  PlusCircle,
  ArrowRight,
  Instagram,
  ExternalLink,
  Sparkles,
  Heart
} from 'lucide-react';
import profileImage from '../../assets/profileImage.png';
import { WavyBackground } from './ui/wavy-background';

interface HeroProps {
  onExplorePortfolio: (category?: string) => void;
  photoCount?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePortfolio,
  photoCount = 60
}) => {
  return (
    <section id="home" className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-[#3E232B] py-12 lg:py-16">
      <WavyBackground
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        containerClassName="min-h-[calc(100vh-5rem)] bg-[#3E232B] w-full"
        colors={["#DE4373", "#BF2C5B", "#E84E7E", "#8B1E43", "#F06292"]}
        waveWidth={45}
        backgroundFill="#3E232B"
        blur={12}
        speed="slow"
        waveOpacity={0.4}
        waveOffset={0.24}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Left Column: Huge Headline, Statement & Pill CTAs (Exact match to screenshot) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">

            {/* Main Bold Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[0.98]">
              Vaishnavi <br />
              Mishra <br />
              <span className="text-white">Photographer & Videographer</span>
            </h1>

            {/* Sub-quote statement from screenshot */}
            <p className="text-base sm:text-lg lg:text-xl text-rose-100/90 font-normal leading-relaxed max-w-2xl">
              "I’m a software engineer by profession and a photographer at heart. While engineering is my career, photography is the passion I never want to leave behind. I’m here to keep creating, keep learning, and build a name for myself through my photography. "
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Instagram Pill Button */}
              <a
                href="https://www.instagram.com/vaishnaviii_ii/"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] text-white text-sm font-semibold shadow-xl shadow-pink-950/40 hover:shadow-pink-900/60 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                id="hero-instagram-btn"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              {/* Best Clicks Pill Button */}
              <button
                onClick={() => onExplorePortfolio()}
                className="px-7 py-3.5 rounded-full bg-[#4E2835] hover:bg-[#5D3040] text-white text-sm font-semibold border border-white/10 hover:border-[#DE4373]/50 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                id="hero-clicks-btn"
              >
                <span>Best Clicks</span>
                <ArrowRight className="w-4 h-4 text-[#DE4373]" />
              </button>

            </div>

            {/* Quick Series Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-rose-200/70 uppercase tracking-wider mr-1">Specialties:</span>
              {['Tech Events & GDG', 'Fur Babies', 'Landscapes', 'Concerts & Stage', 'Portraits', 'Fauna & Wildlife'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag.includes('Tech')) onExplorePortfolio('tech');
                    else if (tag.includes('Fur')) onExplorePortfolio('fur-babies');
                    else if (tag.includes('Landscapes')) onExplorePortfolio('landscapes');
                    else if (tag.includes('Concerts')) onExplorePortfolio('concerts-fests');
                    else if (tag.includes('Fauna')) onExplorePortfolio('fauna');
                    else onExplorePortfolio('portraits');
                  }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#4A2632] hover:bg-[#DE4373] text-rose-100 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Signature Arched Portrait Frame & Vertical VAISHNAVI Spaced Text */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end gap-6 sm:gap-10">

            {/* Iconic Arched Portrait Photo Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px]">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[200px] rounded-b-[200px] border-4 border-[#522B38] bg-[#42222C] shadow-2xl shadow-black/60 group">
                <img
                  src={profileImage || '/assets/profileImage.png'}
                  alt="Vaishnavi Mishra Photographer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Soft gradient bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#261218]/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating mini badge at bottom of arch */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#2A131A]/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium tracking-wider whitespace-nowrap shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DE4373]" />
                  <span>{photoCount}+ Curated Clicks</span>
                </div>
              </div>
            </div>

            {/* Vertical Spaced "V A I S H N A V I" Text (Exact match from screenshot) */}
            <div className="hidden sm:flex flex-col items-center justify-between py-6 h-[400px] text-rose-200/50 text-xs sm:text-sm uppercase tracking-[0.3em] font-light select-none">
              <span>V</span>
              <span>A</span>
              <span>I</span>
              <span>S</span>
              <span>H</span>
              <span>N</span>
              <span>A</span>
              <span>V</span>
              <span>I</span>
            </div>

          </div>

        </div>
      </WavyBackground>
    </section>
  );
};
