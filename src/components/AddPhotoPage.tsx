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
} from 'lucide-react';
import { Photo, PhotoCategory } from '../types';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcilsfof2';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_uploads';

interface AddPhotoPageProps {
  onBack: () => void;
  onAddPhoto: (photo: Photo) => void;
  photos: Photo[];
  onDeleteUserPhoto: (photoId: string) => void;
}

export const AddPhotoPage: React.FC<AddPhotoPageProps> = ({
  onBack,
  onAddPhoto,
  photos,
  onDeleteUserPhoto,
}) => {
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

  const CATEGORY_OPTIONS: { value: PhotoCategory; label: string; helper: string }[] = [
    { value: 'tech', label: 'Tech Events & Fests', helper: 'Google Devs, Hackathons, Keynotes' },
    { value: 'landscapes', label: 'Landscapes', helper: 'Vistas, Horizons, Skies & Nature' },
    { value: 'fauna', label: 'Fauna & Wildlife', helper: 'Birds, Avian Encounters & Nature Wildlife' },
    { value: 'concerts-fests', label: 'Concerts & Fests', helper: 'Live Stages, Lighting & Energy' },
    { value: 'fur-babies', label: 'Fur Babies', helper: 'Dog Portraits & Companion Pet Shoots' },
    { value: 'portraits', label: 'Portraits', helper: 'Individual Portraits & Creative Expressions' },
  ];

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    setErrorMsg(null);

    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview(localPreviewUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('tags', `portfolio,${category}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary.');
      }

      setImageUrl(data.secure_url);
      setImagePreview(data.secure_url);
    } catch (err: any) {
      console.error('Cloudinary Upload Error:', err);
      setErrorMsg(err.message || 'Error uploading file to Cloudinary. Please try again or use direct URL.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    uploadToCloudinary(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploading) {
      setErrorMsg('Please wait for the image to finish uploading to Cloudinary.');
      return;
    }

    const finalImage = inputMode === 'upload' ? (imageUrl || imagePreview) : imageUrl;

    if (!finalImage || !finalImage.trim()) {
      setErrorMsg('Please provide an image either by uploading a file or pasting a URL.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Please enter a photo title.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const categoryObj = CATEGORY_OPTIONS.find((c) => c.value === category);

    const newPhoto: Photo = {
      id: `user-photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      description: description.trim() || `Shot by Vaishnavi Mishra (${categoryObj?.label || 'Portfolio'}).`,
      imageUrl: finalImage,
      category,
      categoryLabel: categoryObj?.label || 'Portfolio',
      location: location.trim() || undefined,
      eventOrClient: eventOrClient.trim() || undefined,
      year: year.trim() || new Date().getFullYear().toString(),
      cameraInfo: {
        lens: 'Canon RF System',
        settings: 'Curated Exposure',
        lightroomPreset: 'Custom Lightroom Profile',
      },
      tags: tags.length > 0 ? tags : [category, 'photography'],
      isFeatured: true,
      isUserAdded: true,
    };

    // 1. Update client state
    onAddPhoto(newPhoto);

    // 2. Persist to serverless database API
    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      });
    } catch (err) {
      console.warn('Could not sync photo to server API:', err);
    }

    // Reset form fields for next photo
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImagePreview(null);
    setLocation('');
    setEventOrClient('');
    setTagsInput('');
    setPublishedSuccessMsg(`"${newPhoto.title}" has been successfully published to your portfolio!`);

    setTimeout(() => {
      setPublishedSuccessMsg(null);
    }, 5000);
  };

  const userPhotos = photos.filter((p) => p.isUserAdded);

  return (
    <div className="min-h-screen bg-[#2E141D] text-white flex flex-col">
      {/* Studio Header */}
      <header className="bg-[#351C24] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#46222F] hover:bg-[#DE4373] text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white block">Creator Studio</span>
              <span className="text-[11px] text-rose-200/70">Upload & Publish to Cloudinary</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#46222F] border border-white/10 text-xs text-rose-200">
              <CloudUpload className="w-3.5 h-3.5 text-[#DE4373]" />
              <span>Cloudinary CDN Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Title & Introduction */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A2632] border border-white/10 text-[#DE4373] text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Ingest Endpoint (/addphoto)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Publish New Photography
          </h1>
          <p className="text-rose-100/80 text-sm max-w-3xl leading-relaxed">
            Upload high-resolution shots to Cloudinary and persist them permanently in your global portfolio.
          </p>
        </div>

        {/* Global Success / Alert Banner */}
        {publishedSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-100 text-xs flex items-center justify-between shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm">{publishedSuccessMsg}</span>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              View in Portfolio
            </button>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#351C24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Category Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DE4373] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-bold text-white">Select Portfolio Category</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {CATEGORY_OPTIONS.map((opt) => {
                  const isSelected = category === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4B2834] border-[#DE4373] text-white shadow-lg ring-1 ring-[#DE4373]'
                          : 'bg-[#2C131C] border-white/5 text-rose-200/70 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${isSelected ? 'text-[#DE4373]' : 'text-white'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-rose-200/60 block mt-1 line-clamp-1">
                        {opt.helper}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Upload Image / Source */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#DE4373] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-base font-bold text-white">Upload Photograph</h2>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-[#2C131C] border border-white/5 text-xs">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      inputMode === 'upload' ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/60 hover:text-white'
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('url')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      inputMode === 'url' ? 'bg-[#DE4373] text-white shadow' : 'text-rose-200/60 hover:text-white'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {inputMode === 'upload' ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed bg-[#2C131C] rounded-3xl p-8 text-center transition-all space-y-3 group ${
                    isUploading
                      ? 'border-[#DE4373] cursor-wait opacity-80'
                      : 'border-white/15 hover:border-[#DE4373] cursor-pointer'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {isUploading ? (
                    <div className="py-8 space-y-3">
                      <Loader2 className="w-10 h-10 text-[#DE4373] animate-spin mx-auto" />
                      <p className="text-sm font-bold text-white">
                        Uploading directly to Cloudinary...
                      </p>
                      <p className="text-xs text-rose-300/70">
                        Generating CDN URL and responsive formats
                      </p>
                    </div>
                  ) : imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shadow">
                          <Check className="w-3 h-3" />
                          <span>Cloudinary Ready</span>
                        </div>
                      </div>
                      <p className="text-xs text-rose-200/80">Click or drop a different image to replace</p>
                    </div>
                  ) : (
                    <div className="py-8 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-[#3C1F28] text-[#DE4373] group-hover:scale-110 transition-transform flex items-center justify-center mx-auto shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">
                          Click to browse or drag and drop your photo
                        </p>
                        <p className="text-xs text-rose-200/60">
                          Supports JPEG, PNG, WebP up to 50MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-3 pl-10 rounded-2xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                    />
                    <LinkIcon className="w-4 h-4 text-rose-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {imageUrl && (
                    <div className="max-w-xs mx-auto aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <img src={imageUrl} alt="URL Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#DE4373] shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Step 3: Photo Title & Story Metadata */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DE4373] text-white text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <h2 className="text-base font-bold text-white">Photo Title & Story Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Photo Title <span className="text-[#DE4373]">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Golden Hour Horizon, Tech Summit Keynote..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g., Delhi NCR / Studio / Stadium Stage"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-rose-200/80">Story / Description</label>
                <textarea
                  rows={2}
                  placeholder="Short narrative on lighting, context, or subject..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Client / Event Tag</label>
                  <input
                    type="text"
                    placeholder="e.g., Google Developers Group, Personal Work"
                    value={eventOrClient}
                    onChange={(e) => setEventOrClient(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/80">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., tech, gdg, hackathon, goldenhour"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2C131C] border border-white/10 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-[#DE4373]"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-full bg-[#46222F] hover:bg-[#582B3B] text-rose-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#DE4373] to-[#BF2C5B] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish & Save to Portfolio</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Recently Ingested User Photos Vault */}
        {userPhotos.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Your Custom Uploaded Pictures ({userPhotos.length})</h3>
                <p className="text-xs text-rose-200/70">Custom photos saved permanently to your global portfolio</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPhotos.map((photo) => (
                <div key={photo.id} className="p-4 rounded-2xl bg-[#351C24] border border-white/10 space-y-3 group">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#2C131C] relative">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] text-white font-medium">
                      {photo.categoryLabel || photo.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{photo.title}</h4>
                      <p className="text-[10px] text-rose-200/60">{photo.location || photo.year}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${photo.title}"?`)) {
                          onDeleteUserPhoto(photo.id);
                        }
                      }}
                      className="p-2 rounded-full bg-[#46222F] hover:bg-red-600 text-rose-200 hover:text-white transition-colors cursor-pointer border border-white/10"
                      title="Delete custom photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
