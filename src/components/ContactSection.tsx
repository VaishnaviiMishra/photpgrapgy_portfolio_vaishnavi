import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Send, 
  Instagram, 
  Linkedin, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  MessageSquare,
  Clock,
  MapPin,
  Calendar,
  Zap,
  Camera,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ContactFormState } from '../types';
import { cn } from '../lib/utils';

interface ContactSectionProps {
  prefilledService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledService = '',
}) => {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    serviceType: prefilledService || 'Pet & Family Photography',
    eventDate: '',
    location: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDirectEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMessage('Please enter your name or organization.');
      return;
    }
    if (!form.email.trim() && !form.phone.trim()) {
      setErrorMessage('Please provide either an Email address or Phone number so Vaishnavi can reach back.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch inquiry.');
      }

      setIsSentSuccess(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Portrait Photography',
        eventDate: '',
        location: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Email Dispatch Error:', err);
      setErrorMessage(
        err.message || 'Could not send directly. Please contact directly via WhatsApp or your email client.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Vaishnavi! I would like to book a photography session with you.
- Name: ${form.name || 'Not provided'}
- Service: ${form.serviceType}
- Email: ${form.email || 'Not provided'}
- Phone: ${form.phone || 'Not provided'}
- Date: ${form.eventDate || 'Flexible'}
- Location: ${form.location || 'Not specified'}
- Message: ${form.message || 'Looking forward to discussing your availability and portfolio!'}`;

    const url = `https://wa.me/918826402661?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailClientFallback = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Photography Shoot Inquiry: ${form.serviceType} - ${form.name || 'Client'}`;
    const body = `Hi Vaishnavi,

I visited your portfolio and would like to inquire about your photography services!

Details:
- Name: ${form.name}
- Email: ${form.email}
- Phone: ${form.phone}
- Service Needed: ${form.serviceType}
- Preferred Date: ${form.eventDate}
- Event Location: ${form.location}

Message:
${form.message}

Looking forward to hearing from you!`;

    window.location.href = `mailto:vaishnavisudha111@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const SERVICES_LIST = [
    'Pet & Family Photography',
    'Tech Events & Conferences',
    'Portrait Photography',
    'Special Occasions',
    'Concerts & Live Performances',
    'Fest & Event Photography',
    'Photo Editing',
    'Other / Custom Inquiries'
  ];

  return (
    <section id="contact" className="py-20 bg-[#331A22] relative border-b border-white/10 overflow-hidden">
      
      {/* Aceternity Grid & Dot Backgrounds */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(222,67,115,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(222,67,115,0.07)_1px,transparent_1px)]"
        )}
      />

      {/* Radial vignette gradient for container to give a faded, luxurious look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#331A22] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Ambient decorative glowing colored orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#DE4373]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#BF2C5B]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initiate Collaboration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1">
            Let's Connect & Collaborate
          </h2>
          <p className="text-rose-100/80 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
            An open invitation to book a shoot for your tech conference, fur babies, scenic portraiture, concerts, or intimate celebrations.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Direct Info Cards, Trust Badges & Social Links */}
          <div className="lg:col-span-5 space-y-4">

            {/* Email Card */}
            <div className="p-5 bg-[#3F212B]/90 backdrop-blur-md rounded-2xl border border-white/10 space-y-3 shadow-xl hover:border-[#DE4373]/50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-[#4E2735] group-hover:bg-[#DE4373] text-[#DE4373] group-hover:text-white transition-colors border border-white/5 shadow-inner">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-200/70 font-semibold uppercase tracking-wider block">Direct Email</span>
                    <a
                      href="mailto:vaishnavisudha111@gmail.com"
                      className="text-xs sm:text-sm font-semibold text-white hover:text-[#DE4373] transition-colors"
                    >
                      vaishnavisudha111@gmail.com
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy('vaishnavisudha111@gmail.com', 'email')}
                  className="p-2.5 rounded-full bg-[#4E2735] hover:bg-[#5D3040] text-rose-200 hover:text-white border border-white/5 transition-all cursor-pointer shadow"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-5 bg-[#3F212B]/90 backdrop-blur-md rounded-2xl border border-white/10 space-y-3 shadow-xl hover:border-[#DE4373]/50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-[#4E2735] group-hover:bg-[#DE4373] text-[#DE4373] group-hover:text-white transition-colors border border-white/5 shadow-inner">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-200/70 font-semibold uppercase tracking-wider block">WhatsApp Instant</span>
                    <a
                      href="https://wa.me/918826402661"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs sm:text-sm font-semibold text-white hover:text-[#DE4373] transition-colors"
                    >
                      +91-8826402661
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy('+918826402661', 'phone')}
                  className="p-2.5 rounded-full bg-[#4E2735] hover:bg-[#5D3040] text-rose-200 hover:text-white border border-white/5 transition-all cursor-pointer shadow"
                  title="Copy phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="p-5 bg-[#3F212B]/90 backdrop-blur-md rounded-2xl border border-white/10 space-y-3 shadow-xl">
              <span className="text-[10px] text-rose-200/70 font-semibold uppercase tracking-wider block">
                Social Profiles & Portfolios
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="https://www.instagram.com/vaishnaviii_ii/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#4E2735] hover:bg-[#5D3040] border border-white/5 hover:border-[#DE4373]/50 text-rose-100 hover:text-white flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#DE4373] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Instagram</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-rose-300/60" />
                </a>

                <a
                  href="https://www.behance.net/vaishnavimishra16"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#4E2735] hover:bg-[#5D3040] border border-white/5 hover:border-[#DE4373]/50 text-rose-100 hover:text-white flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#DE4373] group-hover:scale-110 transition-transform">Bē</span>
                    <span className="text-xs font-semibold">Behance</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-rose-300/60" />
                </a>

                <a
                  href="https://www.linkedin.com/in/vaishnavi-mishra-b17ba6256"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#4E2735] hover:bg-[#5D3040] border border-white/5 hover:border-[#DE4373]/50 text-rose-100 hover:text-white flex items-center justify-between transition-all col-span-2 group"
                >
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#DE4373] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">LinkedIn Profile</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-rose-300/60" />
                </a>
              </div>
            </div>

            {/* Creative Quick Highlights Box */}
            <div className="p-4 rounded-2xl bg-[#2D161F]/90 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#DE4373] uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Shoot Workflow Standard</span>
              </div>
              <p className="text-xs text-rose-100/75 leading-relaxed">
                Shot on Canon EOS R10 mirrorless rig with prime & zoom glass, custom color-curved in Adobe Lightroom, with quick delivery turnarounds.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Shoot Request Composer */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#3F212B]/90 backdrop-blur-md rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">

            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DE4373] via-[#F06292] to-[#BF2C5B]" />

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F1720] border border-[#DE4373]/30 text-[#DE4373] text-[11px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                <span>Direct Ingest Form</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">Book Your Photography Session</h3>
              <p className="text-xs text-rose-200/80">
                Submit directly to Vaishnavi's inbox or connect instantly over WhatsApp.
              </p>
            </div>

            {isSentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-3 shadow-lg animate-in fade-in duration-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Inquiry Sent Successfully!</span>
                  <span>Your shoot request has been delivered directly to Vaishnavi. You will receive a response shortly.</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3 shadow-lg animate-in fade-in duration-300">
                <AlertCircle className="w-4 h-4 text-[#DE4373] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-white">Dispatch Notice:</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleDirectEmailSend} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Your Name / Organization <span className="text-[#DE4373]">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Vaishnavi / Tech Summit Lead"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Service Category</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs focus:outline-none focus:border-[#DE4373] transition-colors cursor-pointer"
                  >
                    {SERVICES_LIST.map((srv) => (
                      <option key={srv} value={srv} className="bg-[#2A131A] text-white">
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#DE4373]" />
                    <span>Preferred Date / Timeline</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Next Weekend / Nov 15th"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#DE4373]" />
                    <span>Shoot Location / City</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Delhi NCR / Noida / Venue"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-rose-200/80">Shoot Vision & Specific Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Share details about your event, custom ideas, pet temperament, venue aesthetics, or desired photo style..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2A131A] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] resize-none transition-colors"
                />
              </div>

              {/* Primary Dispatch Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] hover:from-[#E84E7E] hover:to-[#CE3666] disabled:opacity-60 text-white text-xs font-bold shadow-lg shadow-pink-950/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="direct-send-email-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Directly to Inbox...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Shoot Inquiry Directly</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Instant Options */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-200/70 border-t border-white/10">
                <span>Prefer instant messaging or default client?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="px-3.5 py-1.5 rounded-full bg-[#3D1E28] hover:bg-[#4F2533] text-emerald-300 hover:text-emerald-200 border border-white/10 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    id="fallback-whatsapp-btn"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailClientFallback}
                    className="px-3.5 py-1.5 rounded-full bg-[#3D1E28] hover:bg-[#4F2533] text-rose-200 hover:text-white border border-white/10 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    id="fallback-email-client-btn"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email Client</span>
                  </button>
                </div>
              </div>

            </form>

          </div>

        </div>
      </div>
    </section>
);
};

