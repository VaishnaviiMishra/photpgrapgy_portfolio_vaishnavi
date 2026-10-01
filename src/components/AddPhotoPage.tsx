import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Check,
  Plus,
  AlertCircle,
  Loader2,
  CloudUpload,
  Trash2,
  Lock,
  Briefcase,
  Camera,
  Film,
} from 'lucide-react';
import { Photo, PhotoCategory } from '../types';
import { WorkExperience } from '../types/workExperience';
import { Reel, DEFAULT_REELS } from './Hero';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcilsfof2';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_uploads';

interface AddPhotoPageProps {
  onBack: () => void;
  onAddPhoto: (photo: Photo) => void;
  photos: Photo[];
  onDeleteUserPhoto: (photoId: string) => void;
  experiences: WorkExperience[];
  onAddExperience: (exp: WorkExperience) => void;
  onDeleteExperience: (id: string) => void;
  reels: Reel[];
  onAddReel: (reel: Reel) => void;
  onDeleteReel: (id: string) => void;
}

// ─── shared Cloudinary uploader ──────────────────────────────────────────────
async function uploadToCloudinary(
  file: File,
  category: string,
  cloudName: string,
  preset: string,
  onProgress: (state: 'uploading' | 'done' | 'error', url?: string, err?: string) => void
) {
  onProgress('uploading');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  formData.append('tags', `portfolio,${category}`);
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
    onProgress('done', data.secure_url);
  } catch (e: any) {
    onProgress('error', undefined, e.message || 'Upload error');
  }
}

export const AddPhotoPage: React.FC<AddPhotoPageProps> = ({
  onBack,
  onAddPhoto,
  photos,
  onDeleteUserPhoto,
  experiences,
  onAddExperience,
  onDeleteExperience,
  reels,
  onAddReel,
  onDeleteReel,
}) => {
  // ── Tab state ───────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<'photos' | 'work' | 'clips'>('photos');

  // ── Photo form state ────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<PhotoCategory>('landscapes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState('');
  const [eventOrClient, setEventOrClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tagsInput, setTagsInput] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishedSuccessMsg, setPublishedSuccessMsg] = useState<string | null>(null);

  // ── Work experience form state ──────────────────────────────────────────────
  const workFileRef = useRef<HTMLInputElement>(null);
  const [wHeading, setWHeading] = useState('');
  const [wBrief, setWBrief] = useState('');
  const [wLink, setWLink] = useState('');
  const [wLinkLabel, setWLinkLabel] = useState('');
  const [wImageUrl, setWImageUrl] = useState('');
  const [wImagePreview, setWImagePreview] = useState<string | null>(null);
  const [wUploading, setWUploading] = useState(false);
  const [wInputMode, setWInputMode] = useState<'upload' | 'url'>('upload');
  const [wError, setWError] = useState<string | null>(null);
  const [wSuccess, setWSuccess] = useState<string | null>(null);

  // ── Reel (Best Clips) form state ────────────────────────────────────────────
  const [rTitle, setRTitle] = useState('');
  const [rUrl, setRUrl] = useState('');
  const [rError, setRError] = useState<string | null>(null);
  const [rSuccess, setRSuccess] = useState<string | null>(null);

  const CATEGORY_OPTIONS: { value: PhotoCategory; label: string; helper: string }[] = [
    { value: 'tech', label: 'Tech Events & Fests', helper: 'Google Devs, Hackathons, Keynotes' },
    { value: 'landscapes', label: 'Landscapes', helper: 'Vistas, Horizons, Skies & Nature' },
    { value: 'fauna', label: 'Fauna & Wildlife', helper: 'Birds, Avian Encounters & Nature Wildlife' },
    { value: 'concerts-fests', label: 'Concerts & Fests', helper: 'Live Stages, Lighting & Energy' },
    { value: 'fur-babies', label: 'Fur Babies', helper: 'Dog Portraits & Companion Pet Shoots' },
    { value: 'portraits', label: 'Portraits', helper: 'Individual Portraits & Creative Expressions' },
  ];

  // ── Photo handlers ──────────────────────────────────────────────────────────
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) { setErrorMsg('Please select a valid image file.'); return; }
    const local = URL.createObjectURL(file);
    setImagePreview(local);
    setIsUploading(true);
    uploadToCloudinary(file, category, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, (state, url, err) => {
      setIsUploading(false);
      if (state === 'done' && url) { setImageUrl(url); setImagePreview(url); }
      else if (state === 'error') setErrorMsg(err || 'Upload failed');
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) { setErrorMsg('Wait for upload to finish.'); return; }
    const finalImage = inputMode === 'upload' ? (imageUrl || imagePreview) : imageUrl;
    if (!finalImage?.trim()) { setErrorMsg('Please provide an image.'); return; }
    if (!title.trim()) { setErrorMsg('Please enter a title.'); return; }

    const tags = tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    const catObj = CATEGORY_OPTIONS.find(c => c.value === category);
    const newPhoto: Photo = {
      id: `user-photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      description: description.trim() || `Shot by Vaishnavi Mishra (${catObj?.label}).`,
      imageUrl: finalImage,
      category,
      categoryLabel: catObj?.label || 'Portfolio',
      location: location.trim() || undefined,
      eventOrClient: eventOrClient.trim() || undefined,
      year: year.trim() || new Date().getFullYear().toString(),
      cameraInfo: { lens: 'Canon RF System', settings: 'Curated Exposure', lightroomPreset: 'Custom Lightroom Profile' },
      tags: tags.length > 0 ? tags : [category, 'photography'],
      isFeatured: true,
      isUserAdded: true,
    };
    onAddPhoto(newPhoto);
    try { await fetch('/api/photos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPhoto) }); }
    catch { /* silent */ }
    setTitle(''); setDescription(''); setImageUrl(''); setImagePreview(null);
    setLocation(''); setEventOrClient(''); setTagsInput('');
    setPublishedSuccessMsg(`"${newPhoto.title}" published successfully!`);
    setTimeout(() => setPublishedSuccessMsg(null), 5000);
  };

  // ── Work experience handlers ─────────────────────────────────────────────────
  const handleWorkFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) { setWError('Please select a valid image.'); return; }
    const local = URL.createObjectURL(file);
    setWImagePreview(local);
    setWUploading(true);
    uploadToCloudinary(file, 'work', CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, (state, url, err) => {
      setWUploading(false);
      if (state === 'done' && url) { setWImageUrl(url); setWImagePreview(url); }
      else if (state === 'error') setWError(err || 'Upload failed');
    });
  };

  const handleWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wUploading) { setWError('Wait for upload to finish.'); return; }
    const finalImg = wInputMode === 'upload' ? (wImageUrl || wImagePreview) : wImageUrl;
    if (!finalImg?.trim()) { setWError('Please provide an image.'); return; }
    if (!wHeading.trim()) { setWError('Please enter a heading.'); return; }
    if (!wLink.trim()) { setWError('Please enter a link.'); return; }

    const exp: WorkExperience = {
      id: `work-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      heading: wHeading.trim(),
      brief: wBrief.trim(),
      imageUrl: finalImg,
      link: wLink.trim(),
      linkLabel: wLinkLabel.trim() || 'View Project',
      isUserAdded: true,
    };
    onAddExperience(exp);
    setWHeading(''); setWBrief(''); setWLink(''); setWLinkLabel('');
    setWImageUrl(''); setWImagePreview(null);
    setWSuccess(`"${exp.heading}" added to Work Experience!`);
    setTimeout(() => setWSuccess(null), 5000);
  };

  const handleReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRError(null);
    if (!rTitle.trim()) { setRError('Please enter a reel title.'); return; }
    if (!rUrl.trim()) { setRError('Please enter the Instagram Reel URL.'); return; }
    try { new URL(rUrl.trim()); } catch { setRError('Please enter a valid URL.'); return; }
    const reel: Reel = {
      id: `reel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: rTitle.trim(),
      url: rUrl.trim(),
    };
    onAddReel(reel);
    setRTitle('');
    setRUrl('');
    setRSuccess(`"${reel.title}" added to Best Clips!`);
    setTimeout(() => setRSuccess(null), 5000);
  };

  const userPhotos = photos.filter(p => p.isUserAdded);


  return (
    <div className="min-h-screen bg-[#2E141D] text-white flex flex-col">

      {/* Header */}
      <header className="bg-[#351C24] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#46222F] hover:bg-[#DE4373] text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer shadow">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white block">Creator Studio</span>
              <span className="text-[11px] text-rose-200/70">Manage Portfolio Content</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#46222F] border border-white/10 text-xs text-rose-200">
            <CloudUpload className="w-3.5 h-3.5 text-[#DE4373]" />
            <span>Cloudinary CDN Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Page title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Ingest Endpoint (/addphoto)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Creator Studio</h1>
          <p className="text-rose-100/70 text-sm leading-relaxed">
            Publish photos to your portfolio gallery or manage your Work Experience cards.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#351C24] border border-white/10 w-fit">
          <button
            onClick={() => setTab('photos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'photos' ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/70 hover:text-white'}`}
          >
            <Camera className="w-3.5 h-3.5" />
            Photos
          </button>
          <button
            onClick={() => setTab('work')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'work' ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/70 hover:text-white'}`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Work Experience
          </button>
          <button
            onClick={() => setTab('clips')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${tab === 'clips' ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/70 hover:text-white'}`}
          >
            <Film className="w-3.5 h-3.5" />
            Best Clips
          </button>
        </div>

        {/* ── Photos tab ─────────────────────────────────────────────────────── */}
        {tab === 'photos' && (
          <div className="space-y-10">
            {publishedSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-100 text-xs flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-semibold text-sm">{publishedSuccessMsg}</span>
                </div>
                <button onClick={onBack} className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer">
                  View in Portfolio
                </button>
              </div>
            )}

            <div className="bg-[#351C24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
              <form onSubmit={handlePhotoSubmit} className="space-y-8">

                {/* Step 1: Category */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#DE4373] text-white text-xs font-bold flex items-center justify-center">1</div>
                    <h2 className="text-base font-bold text-white">Select Portfolio Category</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {CATEGORY_OPTIONS.map(opt => (
                      <button key={opt.value} type="button" onClick={() => setCategory(opt.value)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${category === opt.value ? 'bg-[#4B2834] border-[#DE4373] text-white shadow-lg ring-1 ring-[#DE4373]' : 'bg-[#2C131C] border-white/5 text-rose-200/70 hover:border-white/20 hover:text-white'}`}>
                        <span className={`text-xs font-bold block ${category === opt.value ? 'text-[#DE4373]' : 'text-white'}`}>{opt.label}</span>
                        <span className="text-[10px] text-rose-200/60 block mt-1 line-clamp-1">{opt.helper}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#DE4373] text-white text-xs font-bold flex items-center justify-center">2</div>
                      <h2 className="text-base font-bold text-white">Upload Photograph</h2>
                    </div>
                    <div className="flex items-center p-1 rounded-xl bg-[#2C131C] border border-white/5 text-xs">
                      {(['upload', 'url'] as const).map(m => (
                        <button key={m} type="button" onClick={() => setInputMode(m)}
                          className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${inputMode === m ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/60 hover:text-white'}`}>
                          {m === 'upload' ? 'File Upload' : 'Image URL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {inputMode === 'upload' ? (
                    <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed bg-[#2C131C] rounded-3xl p-8 text-center transition-all space-y-3 group ${isUploading ? 'border-[#DE4373] cursor-wait opacity-80' : 'border-white/15 hover:border-[#DE4373] cursor-pointer'}`}>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
                      {isUploading ? (
                        <div className="py-8 space-y-3">
                          <Loader2 className="w-10 h-10 text-[#DE4373] animate-spin mx-auto" />
                          <p className="text-sm font-bold text-white">Uploading to Cloudinary...</p>
                        </div>
                      ) : imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Cloudinary Ready
                            </div>
                          </div>
                          <p className="text-xs text-rose-200/80">Click or drop to replace</p>
                        </div>
                      ) : (
                        <div className="py-8 space-y-3">
                          <div className="w-14 h-14 rounded-full bg-[#3C1F28] text-[#DE4373] group-hover:scale-110 transition-transform flex items-center justify-center mx-auto shadow-inner">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-white">Click or drag & drop your photo</p>
                          <p className="text-xs text-rose-200/60">JPEG, PNG, WebP up to 50MB</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <input type="url" placeholder="https://res.cloudinary.com/..." value={imageUrl}
                          onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                          className="w-full px-4 py-3 pl-10 rounded-2xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                        <LinkIcon className="w-4 h-4 text-rose-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                      {imageUrl && <div className="max-w-xs mx-auto aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"><img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /></div>}
                    </div>
                  )}
                  {errorMsg && <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[#DE4373] shrink-0" /><span>{errorMsg}</span></div>}
                </div>

                {/* Step 3: Metadata */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#DE4373] text-white text-xs font-bold flex items-center justify-center">3</div>
                    <h2 className="text-base font-bold text-white">Photo Title & Story Details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-rose-200/80">Photo Title <span className="text-[#DE4373]">*</span></label>
                      <input type="text" required placeholder="e.g., Golden Hour Horizon..." value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-rose-200/80">Location / Venue</label>
                      <input type="text" placeholder="e.g., Delhi NCR / Studio" value={location} onChange={e => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-rose-200/80">Story / Description</label>
                    <textarea rows={2} placeholder="Short narrative on lighting, context, or subject..." value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-rose-200/80">Client / Event Tag</label>
                      <input type="text" placeholder="e.g., Google Developers Group" value={eventOrClient} onChange={e => setEventOrClient(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-rose-200/80">Tags (comma separated)</label>
                      <input type="text" placeholder="e.g., tech, gdg, hackathon" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button type="button" onClick={onBack} className="px-6 py-3 rounded-full bg-[#46222F] hover:bg-[#582B3B] text-rose-100 text-xs font-semibold transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isUploading}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 disabled:opacity-50">
                    {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></> : <><Plus className="w-4 h-4" /><span>Publish & Save to Portfolio</span></>}
                  </button>
                </div>
              </form>
            </div>

            {/* User photos vault */}
            {userPhotos.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">Your Uploaded Photos ({userPhotos.length})</h3>
                  <p className="text-xs text-rose-200/70">Photos saved to your global portfolio</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userPhotos.map(photo => (
                    <div key={photo.id} className="p-4 rounded-2xl bg-[#351C24] border border-white/10 space-y-3">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#2C131C] relative">
                        <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] text-white font-medium">{photo.categoryLabel || photo.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{photo.title}</h4>
                          <p className="text-[10px] text-rose-200/60">{photo.location || photo.year}</p>
                        </div>
                        <button onClick={() => { if (confirm(`Delete "${photo.title}"?`)) onDeleteUserPhoto(photo.id); }}
                          className="p-2 rounded-full bg-[#46222F] hover:bg-red-600 text-rose-200 hover:text-white transition-colors cursor-pointer border border-white/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Work Experience tab ─────────────────────────────────────────────── */}
        {tab === 'work' && (
          <div className="space-y-10">
            {wSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-100 text-xs flex items-center gap-3 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-emerald-400" /></div>
                <span className="font-semibold text-sm">{wSuccess}</span>
              </div>
            )}

            <div className="bg-[#351C24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
              <div>
                <h2 className="text-lg font-black text-white">Add Work Experience Card</h2>
                <p className="text-xs text-rose-200/70 mt-1">Each card shows on the Work Experience section with a direction-aware hover effect.</p>
              </div>

              <form onSubmit={handleWorkSubmit} className="space-y-6">

                {/* Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-white">Cover Image <span className="text-[#DE4373]">*</span></label>
                    <div className="flex items-center p-1 rounded-xl bg-[#2C131C] border border-white/5 text-xs">
                      {(['upload', 'url'] as const).map(m => (
                        <button key={m} type="button" onClick={() => setWInputMode(m)}
                          className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${wInputMode === m ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/60 hover:text-white'}`}>
                          {m === 'upload' ? 'File Upload' : 'Image URL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {wInputMode === 'upload' ? (
                    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.[0]) handleWorkFileUpload(e.dataTransfer.files[0]); }}
                      onClick={() => !wUploading && workFileRef.current?.click()}
                      className={`border-2 border-dashed bg-[#2C131C] rounded-3xl p-8 text-center transition-all space-y-3 group ${wUploading ? 'border-[#DE4373] cursor-wait opacity-80' : 'border-white/15 hover:border-[#DE4373] cursor-pointer'}`}>
                      <input ref={workFileRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { if (e.target.files?.[0]) handleWorkFileUpload(e.target.files[0]); }} />
                      {wUploading ? (
                        <div className="py-6 space-y-2"><Loader2 className="w-8 h-8 text-[#DE4373] animate-spin mx-auto" /><p className="text-sm font-bold text-white">Uploading...</p></div>
                      ) : wImagePreview ? (
                        <div className="space-y-3">
                          <div className="relative max-w-xs mx-auto aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-white/20">
                            <img src={wImagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ready
                            </div>
                          </div>
                          <p className="text-xs text-rose-200/70">Click or drop to replace</p>
                        </div>
                      ) : (
                        <div className="py-6 space-y-2">
                          <div className="w-12 h-12 rounded-full bg-[#3C1F28] text-[#DE4373] group-hover:scale-110 transition-transform flex items-center justify-center mx-auto"><Upload className="w-5 h-5" /></div>
                          <p className="text-sm font-bold text-white">Click or drag & drop</p>
                          <p className="text-xs text-rose-200/60">JPEG, PNG, WebP</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <input type="url" placeholder="https://..." value={wImageUrl}
                          onChange={e => { setWImageUrl(e.target.value); setWImagePreview(e.target.value); }}
                          className="w-full px-4 py-3 pl-10 rounded-2xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                        <LinkIcon className="w-4 h-4 text-rose-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                      {wImageUrl && <div className="max-w-xs mx-auto aspect-[4/3] rounded-xl overflow-hidden border border-white/10"><img src={wImageUrl} alt="Preview" className="w-full h-full object-cover" /></div>}
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-rose-200/80">Heading / Title <span className="text-[#DE4373]">*</span></label>
                    <input type="text" required placeholder="e.g., GDG DevFest 2024 — Official Photographer" value={wHeading} onChange={e => setWHeading(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-rose-200/80">Brief Description (2 lines max)</label>
                    <textarea rows={2} maxLength={160} placeholder="Short description of the work, event, or collaboration..." value={wBrief} onChange={e => setWBrief(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] resize-none" />
                    <p className="text-[10px] text-rose-300/40 text-right">{wBrief.length}/160</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-rose-200/80">Link URL <span className="text-[#DE4373]">*</span></label>
                    <input type="url" required placeholder="https://instagram.com/... or https://behance.net/..." value={wLink} onChange={e => setWLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-rose-200/80">Link Button Label</label>
                    <input type="text" placeholder="View Project  /  See Photos  /  Open Reel" value={wLinkLabel} onChange={e => setWLinkLabel(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]" />
                  </div>
                </div>

                {wError && <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[#DE4373] shrink-0" /><span>{wError}</span></div>}

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => { setWHeading(''); setWBrief(''); setWLink(''); setWLinkLabel(''); setWImageUrl(''); setWImagePreview(null); setWError(null); }}
                    className="px-6 py-3 rounded-full bg-[#46222F] hover:bg-[#582B3B] text-rose-100 text-xs font-semibold transition-colors cursor-pointer">
                    Clear
                  </button>
                  <button type="submit" disabled={wUploading}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 disabled:opacity-50">
                    {wUploading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></> : <><Plus className="w-4 h-4" /><span>Add Work Experience Card</span></>}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing work experience cards */}
            {experiences.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">Current Work Experience ({experiences.length})</h3>
                  <p className="text-xs text-rose-200/70">Manage your published work experience cards</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experiences.map(exp => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-[#351C24] border border-white/10 flex gap-4 items-start">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#2C131C] shrink-0">
                        <img src={exp.imageUrl} alt={exp.heading} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{exp.heading}</h4>
                        <p className="text-[11px] text-rose-200/60 mt-0.5 line-clamp-2">{exp.brief}</p>
                        <a href={exp.link} target="_blank" rel="noreferrer" className="text-[10px] text-[#DE4373] hover:underline mt-1 inline-block truncate max-w-full">{exp.linkLabel || exp.link}</a>
                      </div>
                      <button onClick={() => { if (confirm(`Delete "${exp.heading}"?`)) onDeleteExperience(exp.id); }}
                        className="p-2 rounded-full bg-[#46222F] hover:bg-red-600 text-rose-200 hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── Best Clips tab ──────────────────────────────────────────────────── */}
        {tab === 'clips' && (
          <div className="space-y-10">

            {rSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-100 text-xs flex items-center gap-3 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-semibold text-sm">{rSuccess}</span>
              </div>
            )}

            {/* Add reel form */}
            <div className="bg-[#351C24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">Add Best Clip</h2>
                <p className="text-xs text-rose-200/70 mt-1">
                  Each reel appears in the hover dropdown on the Hero "Best Clips" button. Just a title and an Instagram Reel URL.
                </p>
              </div>

              <form onSubmit={handleReelSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">
                    Reel Title <span className="text-[#DE4373]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cinematic Metro, Bhimtal Reel, Concert Night..."
                    value={rTitle}
                    onChange={e => setRTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#2C131C] border border-white/10 text-white text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">
                    Instagram Reel URL <span className="text-[#DE4373]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="https://www.instagram.com/reel/..."
                      value={rUrl}
                      onChange={e => setRUrl(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-2xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                    />
                    <LinkIcon className="w-4 h-4 text-rose-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {rError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#DE4373] shrink-0" />
                    <span>{rError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => { setRTitle(''); setRUrl(''); setRError(null); }}
                    className="px-6 py-3 rounded-full bg-[#46222F] hover:bg-[#582B3B] text-rose-100 text-xs font-semibold transition-colors cursor-pointer">
                    Clear
                  </button>
                  <button type="submit"
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105">
                    <Plus className="w-4 h-4" />
                    Add to Best Clips
                  </button>
                </div>
              </form>
            </div>

            {/* Current reels list */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Active Best Clips ({reels.length})
                </h3>
                <p className="text-xs text-rose-200/70">
                  Default reels are preserved as fallback. User-added reels can be deleted.
                </p>
              </div>

              <div className="space-y-2">
                {reels.map(reel => {
                  const isDefault = reel.id.startsWith('reel-default');
                  return (
                    <div key={reel.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#351C24] border border-white/10">
                      <Film className="w-4 h-4 text-[#DE4373] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-white block truncate">{reel.title}</span>
                        <a href={reel.url} target="_blank" rel="noreferrer"
                          className="text-[10px] text-rose-300/60 hover:text-[#DE4373] truncate block max-w-full transition-colors">
                          {reel.url}
                        </a>
                      </div>
                      {isDefault ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2C131C] border border-white/10 text-rose-300/50 shrink-0">default</span>
                      ) : (
                        <button
                          onClick={() => { if (confirm(`Delete "${reel.title}"?`)) onDeleteReel(reel.id); }}
                          className="p-2 rounded-full bg-[#46222F] hover:bg-red-600 text-rose-200 hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
