import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { DirectionAwareHover } from './ui/direction-aware-hover';
import { WorkExperience } from '../types/workExperience';
import { cn } from '../lib/utils';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ experiences }) => {
  if (experiences.length === 0) return null;

  return (
    <section
      id="work"
      className="py-20 bg-[#2E141D] border-b border-white/10 relative overflow-hidden"
    >
      {/* grid background */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(222,67,115,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(222,67,115,0.06)_1px,transparent_1px)]"
        )}
      />
      {/* glow orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-[#DE4373]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 rounded-full bg-[#BF2C5B]/8 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Work{' '}
            <span className="bg-gradient-to-r from-[#DE4373] via-[#E84E7E] to-[#F06292] bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-rose-200/70 text-sm max-w-xl leading-relaxed">
            Hover over each card to reveal more. Click the arrow to open the full project or event.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="group relative">
              <DirectionAwareHover
                imageUrl={exp.imageUrl}
                className="w-full aspect-[4/3] border border-white/10 hover:border-[#DE4373]/50 transition-colors shadow-xl shadow-black/40"
              >
                {/* Revealed content on hover */}
                <div className="space-y-2">
                  <h3 className="text-base font-black text-white leading-tight drop-shadow">
                    {exp.heading}
                  </h3>
                  <p className="text-rose-100/90 text-xs leading-relaxed line-clamp-2 drop-shadow">
                    {exp.brief}
                  </p>
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-full bg-[#DE4373] hover:bg-[#E84E7E] text-white text-[11px] font-bold transition-colors shadow"
                    id={`work-link-${exp.id}`}
                  >
                    {exp.linkLabel || 'View Project'}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </DirectionAwareHover>

              {/* Static title below card */}
              <div className="mt-3 px-1">
                <h4 className="text-sm font-bold text-white truncate">{exp.heading}</h4>
                <p className="text-xs text-rose-300/60 mt-0.5 truncate">{exp.brief}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
