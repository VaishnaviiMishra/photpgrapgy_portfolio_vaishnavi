import React from 'react';
import {
  Heart,
  Laptop,
  Calendar,
  Sliders,
  ExternalLink,
  Instagram,
  Linkedin,
  MapPin,
  Cpu,
  Sparkles,
  Camera,
  Smile,
  Video,
  Aperture
} from 'lucide-react';
import { GEAR_DATA } from '../data/services';
import vaishnaviImage from '../../assets/vaishnavi.jpg';
import { WobbleCard } from './ui/wobble-card';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { cn } from '../lib/utils';

export const AboutSection: React.FC = () => {
  const getGearIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-3.5 h-3.5 text-[#DE4373]" />;
      case 'Aperture':
        return <Aperture className="w-3.5 h-3.5 text-[#DE4373]" />;
      case 'Laptop':
        return <Laptop className="w-3.5 h-3.5 text-[#DE4373]" />;
      case 'Smile':
        return <Smile className="w-3.5 h-3.5 text-[#DE4373]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#DE4373]" />;
    }
  };

  return (
    <section id="about" className="py-20 bg-[#381F26] border-b border-white/10 relative overflow-hidden">

      {/* Aceternity Grid & Dot Backgrounds */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(222,67,115,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(222,67,115,0.07)_1px,transparent_1px)]"
        )}
      />

      {/* Radial vignette gradient for container to give a faded, luxurious look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#381F26] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Ambient decorative glowing colored orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#DE4373]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#BF2C5B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Story Grid: Editorial Frame on Left & Seamless Bio Narrative on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">

          {/* Left Column: Visual Avatar / Editorial Frame with Aceternity 3D Card */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-28">
            <CardContainer className="relative mx-auto max-w-md w-full">
              <CardBody className="relative w-full">
                <CardItem
                  translateZ="50"
                  className="relative overflow-hidden rounded-3xl border-2 border-[#552A38] bg-[#43232E] shadow-2xl shadow-black/60 w-full group"
                >
                  <img
                    src={vaishnaviImage}
                    alt="Vaishnavi Mishra"
                    className="w-full h-[480px] object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#261218] via-transparent to-transparent opacity-90" />

                  <CardItem
                    translateZ="90"
                    className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#2E141D]/90 backdrop-blur-md border border-white/10 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold text-base">Vaishnavi Mishra</h4>
                        <p className="text-rose-200 text-xs mt-0.5 font-medium">
                          Photographer & Visual Storyteller
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href="https://www.instagram.com/vaishnaviii_ii/"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-full bg-[#46222F] hover:bg-[#DE4373] text-white transition-colors shadow"
                          title="Instagram @vaishnaviii_ii"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                        <a
                          href="https://www.linkedin.com/in/vaishnavi-mishra-b17ba6256"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-full bg-[#46222F] hover:bg-[#DE4373] text-white transition-colors shadow"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </CardItem>
                </CardItem>

                {/* Milestone Tag floating in 3D */}
                <CardItem
                  translateZ="100"
                  className="absolute -top-3 -left-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Camera Dedicated: Aug 14, 2023</span>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>

          {/* Right Column: Unified Journey, Bio, Capabilities & Direct Links */}
          <div className="lg:col-span-7 space-y-6">

            {/* Seamless Section Header directly integrated into Narrative */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Bio & Journey</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                About Me
              </h2>
              <p className="text-rose-200/90 text-sm sm:text-base font-medium leading-relaxed">
                From picking up my first camera in high school to shooting tech summits, live concerts, sweeping landscapes, and heartfelt animal sessions.
              </p>
            </div>

            {/* Narrative Box with WobbleCard */}
            <WobbleCard
              containerClassName="bg-[#41242E] border border-white/10 shadow-xl"
              className="p-6 sm:p-7 space-y-3.5"
            >
              <p className="text-xs sm:text-sm leading-relaxed text-rose-100/90 font-normal">
                Photography has been a part of my life since 10th grade. Even after becoming a software engineer, I’ve continued to make time for the camera because photography is something I genuinely love.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-rose-100/90 font-normal">
                Now, I want to take that passion a step further. I’m available on weekends for events, pet photography, portraits, concerts, tech events, and more, and I’m always open to exploring something new.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-white font-medium">
                I’m building my name in photography, one shoot at a time. If you like my work and have a project, event, or idea in mind, I’d love to be a part of it.
              </p>
            </WobbleCard>

            {/* Core Pillars with WobbleCard interactive 3D physics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <WobbleCard
                containerClassName="bg-[#41242E] border border-white/5 hover:border-[#DE4373]/40 transition-colors"
                className="p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-[#DE4373] text-xs font-bold uppercase tracking-wider">
                  <Camera className="w-4 h-4" />
                  <span>Photography</span>
                </div>
                <p className="text-xs text-rose-100/70 leading-relaxed">
                  Portraits, tech summits, live concerts, furbabies, and landscapes.
                </p>
              </WobbleCard>

              <WobbleCard
                containerClassName="bg-[#41242E] border border-white/5 hover:border-[#DE4373]/40 transition-colors"
                className="p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-[#DE4373] text-xs font-bold uppercase tracking-wider">
                  <Video className="w-4 h-4" />
                  <span>Videography</span>
                </div>
                <p className="text-xs text-rose-100/70 leading-relaxed">
                  Event highlight reels, stage motion, and dynamic short-form storytelling.
                </p>
              </WobbleCard>

              <WobbleCard
                containerClassName="bg-[#41242E] border border-white/5 hover:border-[#DE4373]/40 transition-colors"
                className="p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-[#DE4373] text-xs font-bold uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  <span>Editing & Color Grading</span>
                </div>
                <p className="text-xs text-rose-100/70 leading-relaxed">
                  Custom Lightroom tone curves, color grading, and atmospheric moods.
                </p>
              </WobbleCard>

              <WobbleCard
                containerClassName="bg-[#41242E] border border-white/5 hover:border-[#DE4373]/40 transition-colors"
                className="p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-[#DE4373] text-xs font-bold uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Camera & Other Gears</span>
                </div>
                <p className="text-xs text-rose-100/70 leading-relaxed">
                  Canon EOS R10 mirrorless rig with fast prime and zoom glass.
                </p>
              </WobbleCard>
            </div>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              <a
                href="https://www.instagram.com/vaishnaviii_ii/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
                id="about-instagram-cta"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram @vaishnaviii_ii</span>
              </a>

              <a
                href="https://www.behance.net/vaishnavimishra16"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4E2835] hover:bg-[#5D3040] text-rose-100 hover:text-white border border-white/10 text-xs font-bold transition-all shadow"
                id="about-behance-link"
              >
                <span>Behance Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

        {/* Gear & Hardware Setup */}
        <div className="pt-10 border-t border-white/10">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#DE4373] uppercase tracking-wider">The Arsenal</span>
            <h3 className="text-2xl font-bold text-white mt-1">Hardware & Optics Setup</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GEAR_DATA.map((gear, idx) => (
              <WobbleCard
                key={idx}
                containerClassName="bg-[#41242E] border border-white/10 hover:border-[#DE4373]/60 transition-colors shadow-lg"
                className="p-5 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F1720] border border-[#DE4373]/30 text-[#DE4373] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {getGearIcon(gear.icon)}
                      <span>{gear.category}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#DE4373] transition-colors mb-2">
                    {gear.name}
                  </h4>
                  <p className="text-xs text-rose-100/75 leading-relaxed font-normal">
                    {gear.description}
                  </p>
                </div>
              </WobbleCard>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
