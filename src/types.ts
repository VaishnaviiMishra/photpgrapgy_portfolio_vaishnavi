export type PhotoCategory = 'landscapes' | 'concert' | 'fauna' | 'furbabies' | 'portraits' | 'tech' | 'fur-babies' | 'concerts-fests';

export interface Photo {
  id: string;
  title: string;
  category: PhotoCategory;
  categoryLabel: string;
  imageUrl: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  description?: string;
  location?: string;
  eventOrClient?: string;
  year?: string;
  cameraInfo?: {
    body?: string;
    lens?: string;
    settings?: string;
    lightroomPreset?: string;
  };
  tags?: string[];
  isFeatured?: boolean;
  isUserAdded?: boolean;
  dateAdded?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  startingPrice?: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  eventDate?: string;
  location?: string;
  message: string;
}
