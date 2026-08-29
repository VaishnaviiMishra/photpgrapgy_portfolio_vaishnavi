import React from 'react';
import { Camera, Code2, Heart, Instagram, Linkedin, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateAddPhoto?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAddPhoto }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2E141D] border-t border-white/10 pt-16 pb-12 text-rose-200/70 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#DE4373] to-[#F06292] text-white font-bold text-lg shadow-md">
              V
            </div>
            <div>
              <span className="text-base font-bold text-white block tracking-tight">
                Vaishnavi Mishra
              </span>
              <span className="text-[11px] text-rose-200/70">
                Photographer & Visual Storyteller
              </span>
            </div>
          </div>

          {/* Social and Portfolio links */}
          <div className="flex items-center gap-3 text-rose-100">
            <a
              href="https://www.instagram.com/vaishnaviii_ii/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#41242E] hover:bg-[#DE4373] text-white border border-white/5 transition-all shadow"
              title="Instagram @vaishnaviii_ii"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.behance.net/vaishnavimishra16"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#41242E] hover:bg-[#DE4373] text-white border border-white/5 transition-all shadow"
              title="Behance Portfolio"
            >
              <span className="text-xs font-bold">Bē</span>
            </a>
            <a
              href="https://www.linkedin.com/in/vaishnavi-mishra-b17ba6256"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#41242E] hover:bg-[#DE4373] text-white border border-white/5 transition-all shadow"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:vaishnavisudha111@gmail.com"
              className="p-2.5 rounded-full bg-[#41242E] hover:bg-[#DE4373] text-white border border-white/5 transition-all shadow"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#41242E] hover:bg-[#522B38] text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer shadow"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#DE4373]" />
          </button>
        </div>

        {/* Bottom copyright and coder statement */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-rose-300/60 text-xs">
          <p className="font-normal">
            © {new Date().getFullYear()} Vaishnavi Mishra · Tech Events, Fur Babies, Landscapes & Concerts.
          </p>

          <div className="flex items-center justify-center gap-1.5 text-xs">
            <span>Crafted by</span>
            <span className="text-white font-medium">Vaishnavi Mishra</span>
            <span className="text-[#DE4373]">·</span>
            <span>Coder & Photographer</span>
            {onNavigateAddPhoto && (
              <a
                href="/addphoto"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateAddPhoto();
                }}
                className="text-rose-400/30 hover:text-[#DE4373] transition-colors ml-1 font-mono text-[11px] font-bold tracking-tight"
                title="Creator Studio"
                id="footer-creator-access"
              >
                &lt;/&gt;
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};

