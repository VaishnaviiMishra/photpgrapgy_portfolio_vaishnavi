import React, { useState } from 'react';
import {
  ArrowRight,
  Instagram,
  Film,
  Clapperboard,
  Camera,
  Music2,
  User2,
  ExternalLink,
} from 'lucide-react';
import profileImage from '../../assets/profileImage.png';
import { WavyBackground } from './ui/wavy-background';

export interface Reel {
  id: string;
  title: string;
  url: string;
}

export const DEFAULT_REELS: Reel[] = [];


interface HeroProps {
  onExplorePortfolio: (category?: string) => void;
  photoCount?: number;
  reels?: Reel[];
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePortfolio,
  photoCount = 60,
  reels = DEFAULT_REELS,
}) => {
  const [clipsOpen, setClipsOpen] = useState(false);
  const activeReels = reels.length > 0 ? reels : DEFAULT_REELS;

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-[#3E232B] pt-10 pb-12 lg:pt-8 lg:pb-16"
    >
      <WavyBackground
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        containerClassName="min-h-[calc(100vh-5rem)] bg-[#3E232B] w-full"
        colors={['#DE4373', '#BF2C5B', '#E84E7E', '#8B1E43', '#F06292']}
        waveWidth={45}
        backgroundFill="#3E232B"
        blur={12}
        speed="slow"
        waveOpacity={0.4}
        waveOffset={0.24}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── Left Column ───────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">

            {/* Weekend badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A2632] border border-[#DE4373]/30 text-[#DE4373] text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#DE4373] animate-pulse" />
              <span>Available on Weekends for Shoots &amp; Events</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[0.98]">
              Vaishnavi <br />
              Mishra <br />
              <span className="bg-gradient-to-r from-[#F06292] via-[#F8A5C2] to-[#FECDD3] bg-clip-text text-transparent">
                Photographer &amp; Cinematographer
              </span>
            </h1>

            {/* Sub-quote */}
            <p className="text-base sm:text-lg lg:text-xl text-rose-100/90 font-normal leading-relaxed max-w-2xl">
              "I'm a software engineer by profession and a visual storyteller at heart. From cinematic concert films and intimate portraits (human and pets alike) to curated photo shoots, I capture moments that matter."
            </p>

            {/* Topic pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Cinematography', icon: <Clapperboard className="w-3.5 h-3.5" /> },
                { label: 'Portrait — Human & Pets', icon: <User2 className="w-3.5 h-3.5" /> },
                { label: 'Photo Shoot', icon: <Camera className="w-3.5 h-3.5" /> },
                { label: 'Concerts & Live Events', icon: <Music2 className="w-3.5 h-3.5" /> },
              ].map(({ label, icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#5A1E35]/80 to-[#4A2632]/80 border border-[#DE4373]/30 text-rose-100 text-xs font-semibold shadow"
                >
                  <span className="text-[#DE4373]">{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/vaishnaviii_ii/"
                target="_blank"
                rel="noreferrer"
                id="hero-instagram-btn"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] text-white text-sm font-semibold shadow-xl shadow-pink-950/40 hover:shadow-pink-900/60 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              {/* ── Best Clips — hover dropdown (only when reels exist) ── */}
              {activeReels.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => setClipsOpen(true)}
                  onMouseLeave={() => setClipsOpen(false)}
                >
                  {/* Dropdown panel — appears above the button */}
                  <div
                    className={`
                    absolute bottom-[calc(100%+10px)] left-0
                    w-72 rounded-2xl overflow-hidden
                    bg-[#2A131A]/95 backdrop-blur-md
                    border border-[#DE4373]/30 shadow-2xl shadow-black/60
                    transition-all duration-200 origin-bottom-left z-50
                    ${clipsOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
                  `}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-[#DE4373]" />
                      <span className="text-[#DE4373] text-[11px] font-bold uppercase tracking-widest">
                        Best Clips
                      </span>
                    </div>

                    {/* Reel list */}
                    <ul className="py-1">
                      {activeReels.map((reel, i) => (
                        <li key={i}>
                          <a
                            href={reel.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group/item flex items-center justify-between px-4 py-3 hover:bg-[#DE4373]/15 transition-colors duration-150"
                          >
                            <span className="text-rose-100 text-sm font-medium group-hover/item:text-white transition-colors leading-tight pr-2">
                              {reel.title}
                            </span>
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3E232B] border border-[#DE4373]/30 group-hover/item:bg-[#DE4373] group-hover/item:border-[#DE4373] flex items-center justify-center transition-all duration-150">
                              <ExternalLink className="w-3.5 h-3.5 text-[#DE4373] group-hover/item:text-white transition-colors" />
                            </span>
                          </a>
                          {i < activeReels.length - 1 && (
                            <div className="mx-4 border-b border-white/5" />
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Footer hint */}
                    <div className="px-4 py-2.5 border-t border-white/10 bg-[#1E0E14]/50">
                      <p className="text-rose-300/50 text-[10px]">
                        Opens on Instagram ↗
                      </p>
                    </div>
                  </div>

                  {/* The button itself */}
                  <button
                    id="hero-clips-btn"
                    className={`px-7 py-3.5 rounded-full text-white text-sm font-semibold border transition-all flex items-center gap-2 cursor-pointer shadow-md
                    ${clipsOpen
                        ? 'bg-[#5D3040] border-[#DE4373]/50'
                        : 'bg-[#4E2835] border-white/10 hover:bg-[#5D3040] hover:border-[#DE4373]/50'}
                  `}
                  >
                    <Film className="w-4 h-4 text-[#DE4373]" />
                    <span>Best Clips</span>
                    <ArrowRight
                      className={`w-4 h-4 text-[#DE4373] transition-transform duration-200 ${clipsOpen ? 'rotate-[-90deg]' : ''}`}
                    />
                  </button>
                </div>
              )}
              {/* ── end Best Clips ──────────────────────────────────────── */}

            </div>


          </div>

          {/* ── Right Column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end gap-6 sm:gap-10">

            {/* Arched portrait frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px]">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[200px] rounded-b-[200px] border-4 border-[#522B38] bg-[#42222C] shadow-2xl shadow-black/60 group">
                <img
                  src={profileImage || '/assets/profileImage.png'}
                  alt="Vaishnavi Mishra Photographer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#261218]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#2A131A]/90 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium tracking-wider whitespace-nowrap shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DE4373]" />
                  <span>{photoCount}+ Curated Clicks</span>
                </div>
              </div>
            </div>

            {/* Vertical VAISHNAVI letters */}
            <div className="hidden sm:flex flex-col items-center justify-between py-6 h-[400px] text-rose-200/50 text-xs sm:text-sm uppercase tracking-[0.3em] font-light select-none">
              {['V', 'A', 'I', 'S', 'H', 'N', 'A', 'V', 'I'].map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>

          </div>

        </div>
      </WavyBackground>
    </section>
  );
};
