import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  ArrowRight,
  Cpu,
  HeartHandshake,
  Compass,
  Music,
  Sliders,
  Camera,
  X,
  Laptop,
  Heart,
  Phone
} from 'lucide-react';
import { SERVICES_DATA } from '../data/services';
import { ServiceItem } from '../types';
import { useOutsideClick } from '../hooks/use-outside-click';

// Exact service showcase images specified by user
import furbabiesImage from '../../assets/photos/furbabies/coco.jpeg';
import techImage from '../../assets/photos/tech/IMG_2362.JPG';
import portraitsImage from '../../assets/photos/portraits/20240302101948_IMG_1520.jpg';
import specialOccasionsImage from '../../assets/photos/portraits/20260507_174422(1)(1)(1).jpg';
import concertImage from '../../assets/photos/concert/Image 3.jpg';
import festEventImage from '../../assets/photos/concert/behance_project_1714277524575.jpg';
import photoEditingImage from '../../assets/photos/Landscapes/IMG_0206.jpg';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
}) => {
  const [active, setActive] = useState<ServiceItem | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  // Get image for each service
  const getServiceImage = (serviceId: string): string => {
    switch (serviceId) {
      case 'service-pets-family':
        return furbabiesImage;
      case 'service-tech':
        return techImage;
      case 'service-portraits':
        return portraitsImage;
      case 'service-occasions':
        return specialOccasionsImage;
      case 'service-concerts':
        return concertImage;
      case 'service-fests':
        return festEventImage;
      case 'service-editing':
        return photoEditingImage;
      default:
        return photoEditingImage;
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-[#DE4373]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-[#DE4373]" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-[#DE4373]" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-[#DE4373]" />;
      case 'Music':
        return <Music className="w-4 h-4 text-[#DE4373]" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-[#DE4373]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#DE4373]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#DE4373]" />;
    }
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <section id="services" className="py-20 bg-[#3E232B] relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider">
            <span>Capabilities & Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Specialized Services & Coverage
          </h2>
          <p className="text-rose-100/80 text-sm font-normal leading-relaxed">
            Click any service card to expand full coverage details, package deliverables, and reserve your date.
          </p>
        </div>

        {/* Modal Backdrop & Expanded Card */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md h-full w-full z-50 cursor-pointer"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active ? (
            <div className="fixed inset-0 grid place-items-center z-50 p-4 sm:p-6 overflow-y-auto">
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex absolute top-4 right-4 sm:top-6 sm:right-6 items-center justify-center bg-[#2F1720] hover:bg-[#DE4373] text-white rounded-full h-9 w-9 border border-white/20 z-[110] transition-colors shadow-lg cursor-pointer"
                onClick={() => setActive(null)}
              >
                <X className="w-4 h-4" />
              </motion.button>

              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-full max-w-[620px] max-h-[90vh] flex flex-col bg-[#381E26] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-[100]"
              >
                <motion.div layoutId={`image-${active.title}-${id}`} className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#2A131A]">
                  <img
                    src={getServiceImage(active.id)}
                    alt={active.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#381E26] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A131A]/90 backdrop-blur-md border border-[#DE4373]/50 text-white text-xs font-bold uppercase tracking-wider">
                      {getServiceIcon(active.iconName)}
                      <span>{active.category}</span>
                    </span>
                  </div>
                </motion.div>

                <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="text-2xl font-bold text-white tracking-tight"
                      >
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.description}-${id}`}
                        className="text-xs text-[#DE4373] font-semibold mt-1 uppercase tracking-wider"
                      >
                        {active.startingPrice}
                      </motion.p>
                    </div>

                    <motion.button
                      layoutId={`button-${active.title}-${id}`}
                      onClick={() => {
                        onSelectServiceForInquiry(active.title);
                        setActive(null);
                      }}
                      className="px-6 py-3 text-xs font-bold rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] text-white shadow-lg shadow-pink-950/40 hover:scale-105 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                    >
                      Book This Service →
                    </motion.button>
                  </div>

                  <p className="text-sm text-rose-100/90 leading-relaxed font-normal">
                    {active.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <h4 className="text-xs font-bold text-[#DE4373] uppercase tracking-wider">
                      Included Deliverables & Workflow
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {active.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-rose-100/80">
                          <div className="w-4 h-4 rounded-full bg-[#4E2735] text-[#DE4373] flex items-center justify-center shrink-0 mt-0.5 border border-[#DE4373]/30">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ideal For callout */}
                  <div className="p-4 rounded-2xl bg-[#2D161F] border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-[#DE4373] uppercase tracking-wider">Ideal For</span>
                    <p className="text-xs text-rose-100/75 leading-relaxed">{active.idealFor}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        {/* Expandable Cards Grid (2-Column Responsive Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto w-full mb-16">
          {SERVICES_DATA.map((service) => (
            <motion.div
              layoutId={`card-${service.title}-${id}`}
              key={`card-${service.title}-${id}`}
              onClick={() => setActive(service)}
              className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#351C24] hover:bg-[#43232E] border border-white/10 hover:border-[#DE4373]/50 rounded-2xl cursor-pointer transition-all duration-200 shadow-md group"
            >
              <div className="flex gap-3.5 items-center w-full sm:w-auto">
                <motion.div layoutId={`image-${service.title}-${id}`} className="shrink-0">
                  <img
                    src={getServiceImage(service.id)}
                    alt={service.title}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover object-center shadow border border-white/10"
                  />
                </motion.div>

                <div className="text-left space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DE4373] px-2 py-0.5 rounded-full bg-[#2A131A] border border-[#DE4373]/20 inline-block">
                      {service.category}
                    </span>
                  </div>
                  <motion.h3
                    layoutId={`title-${service.title}-${id}`}
                    className="font-bold text-white text-sm sm:text-base group-hover:text-rose-100 transition-colors truncate"
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${service.description}-${id}`}
                    className="text-xs text-rose-200/70 line-clamp-1"
                  >
                    {service.description}
                  </motion.p>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <motion.button
                  layoutId={`button-${service.title}-${id}`}
                  className="px-4 py-2 text-xs rounded-full font-bold bg-[#482531] hover:bg-[#DE4373] text-white border border-white/10 group-hover:border-[#DE4373]/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow whitespace-nowrap"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3 text-[#DE4373] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hardware & Trust Highlights Banner */}
        <div className="p-6 sm:p-8 bg-[#351C24] rounded-2xl border border-white/10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 rounded-full bg-[#46222F] text-[#DE4373] border border-white/10 shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Hardware Pipeline</h4>
                <p className="text-xs text-rose-200 font-medium">MacBook & Lightroom Setup</p>
                <span className="text-[10px] text-rose-300/60 uppercase tracking-wider">Fast turnaround editing & export</span>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0 md:px-6">
              <div className="p-3 rounded-full bg-[#46222F] text-[#DE4373] border border-white/10 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct WhatsApp</h4>
                <a
                  href="https://wa.me/918826402661"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#DE4373] font-bold hover:underline block"
                >
                  +91-8826402661
                </a>
                <span className="text-[10px] text-rose-300/60 uppercase tracking-wider">Instant availability checks</span>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 rounded-full bg-[#46222F] text-[#DE4373] border border-white/10 shrink-0">
                <Heart className="w-5 h-5 fill-[#DE4373] text-[#DE4373]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Track Record</h4>
                <p className="text-xs text-rose-200 font-medium">Good reviews by everyone till now</p>
                <span className="text-[10px] text-rose-300/60 uppercase tracking-wider">100% genuine client trust</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
