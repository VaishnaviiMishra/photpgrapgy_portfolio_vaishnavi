import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

interface PhotoItem {
  id: string;
  imageUrl: string;
  category: string;
  categoryLabel?: string;
  title: string;
  description?: string;
  location?: string;
  eventOrClient?: string;
  year?: string;
  lens?: string;
  settings?: string;
  lightroomPreset?: string;
  cameraInfo?: {
    lens?: string;
    settings?: string;
    lightroomPreset?: string;
  };
  isFeatured?: boolean;
  isUserAdded?: boolean;
  tags?: string[];
  dateAdded?: string;
}

interface DatabasePayload {
  customPhotos: PhotoItem[];
  topPicks: string[];
}

const DB_KEY = 'vaishnavi_portfolio_db_v1';
const DB_FILE = path.resolve(process.cwd(), 'src/data/database.json');

// Initialize Redis via official Redis.fromEnv() or credentials
function getRedisClient(): Redis | null {
  try {
    return Redis.fromEnv();
  } catch {
    const url = (
      process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      ''
    ).trim();

    const token = (
      process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      ''
    ).trim();

    if (url && token) {
      return new Redis({ url, token });
    }
    return null;
  }
}

// In-memory cache for fallback
let memoryCache: DatabasePayload = {
  customPhotos: [],
  topPicks: []
};

// Load initial from local file if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryCache = {
      customPhotos: Array.isArray(parsed.customPhotos) ? parsed.customPhotos : [],
      topPicks: Array.isArray(parsed.topPicks) ? parsed.topPicks : []
    };
  }
} catch {
  // ignore
}

async function getStoredData(): Promise<DatabasePayload> {
  const redis = getRedisClient();

  // 1. Try Upstash Redis / Vercel KV
  if (redis) {
    try {
      const data = await redis.get<DatabasePayload | string>(DB_KEY);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        return {
          customPhotos: Array.isArray(parsed.customPhotos) ? parsed.customPhotos : [],
          topPicks: Array.isArray(parsed.topPicks) ? parsed.topPicks : []
        };
      }
    } catch (err) {
      console.warn('Redis.fromEnv() get error, trying local fallback:', err);
    }
  }

  // 2. Try local file if available
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        customPhotos: Array.isArray(parsed.customPhotos) ? parsed.customPhotos : [],
        topPicks: Array.isArray(parsed.topPicks) ? parsed.topPicks : []
      };
    }
  } catch {
    // ignore
  }

  return memoryCache;
}

async function saveStoredData(data: DatabasePayload): Promise<boolean> {
  memoryCache = data;
  const redis = getRedisClient();

  // 1. Save to Upstash Redis
  if (redis) {
    try {
      await redis.set(DB_KEY, JSON.stringify(data));
      try {
        if (fs.existsSync(path.dirname(DB_FILE))) {
          fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        }
      } catch {
        // ignore in serverless
      }
      return true;
    } catch (err) {
      console.warn('Redis.fromEnv() set error:', err);
    }
  }

  // 2. Fallback to local file
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    // In serverless readonly environments, local write is ignored
  }

  return true;
}

export default async function handler(req: any, res: any) {
  // Disable caching so clients ALWAYS receive the freshest custom photos
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const currentData = await getStoredData();

    // GET /api/photos
    if (req.method === 'GET') {
      return res.status(200).json(currentData);
    }

    // POST /api/photos (Add new photo OR update top picks)
    if (req.method === 'POST') {
      const body = req.body || {};

      // If updating top picks list
      if (Array.isArray(body.topPicks)) {
        currentData.topPicks = body.topPicks;
        await saveStoredData(currentData);
        return res.status(200).json({ success: true, topPicks: currentData.topPicks });
      }

      // If adding a new photo
      if (body.imageUrl) {
        const newPhoto: PhotoItem = {
          id: body.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          imageUrl: body.imageUrl,
          category: body.category || 'landscapes',
          categoryLabel: body.categoryLabel || body.category,
          title: body.title || 'Untitled Creation',
          description: body.description || '',
          location: body.location || '',
          eventOrClient: body.eventOrClient || '',
          year: body.year || new Date().getFullYear().toString(),
          cameraInfo: {
            lens: body.cameraInfo?.lens || body.lens || 'Canon RF System',
            settings: body.cameraInfo?.settings || body.settings || 'Curated Exposure',
            lightroomPreset: body.cameraInfo?.lightroomPreset || body.lightroomPreset || 'Custom Lightroom Profile',
          },
          isFeatured: !!body.isFeatured,
          isUserAdded: true,
          tags: Array.isArray(body.tags) ? body.tags : [],
          dateAdded: body.dateAdded || new Date().toISOString(),
        };

        // If marked as featured, ensure it's in topPicks
        if (newPhoto.isFeatured && !currentData.topPicks.includes(newPhoto.id)) {
          currentData.topPicks = [newPhoto.id, ...currentData.topPicks];
        }

        currentData.customPhotos = [newPhoto, ...currentData.customPhotos.filter((p) => p.id !== newPhoto.id)];
        await saveStoredData(currentData);
        return res.status(200).json({ success: true, photo: newPhoto, customPhotos: currentData.customPhotos });
      }

      return res.status(400).json({ error: 'Invalid payload. imageUrl or topPicks required.' });
    }

    // DELETE /api/photos?id=...
    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Photo id is required to delete.' });
      }

      currentData.customPhotos = currentData.customPhotos.filter((p) => p.id !== id);
      currentData.topPicks = currentData.topPicks.filter((pId) => pId !== id);
      await saveStoredData(currentData);
      return res.status(200).json({ success: true, customPhotos: currentData.customPhotos, topPicks: currentData.topPicks });
    }

    // PATCH /api/photos (Toggle individual Top Pick status)
    if (req.method === 'PATCH') {
      const { photoId, isFeatured } = req.body || {};
      if (!photoId) {
        return res.status(400).json({ error: 'photoId is required.' });
      }

      // Update custom photo if present
      currentData.customPhotos = currentData.customPhotos.map((p) => {
        if (p.id === photoId) {
          return { ...p, isFeatured: !!isFeatured };
        }
        return p;
      });

      // Update topPicks array
      if (isFeatured) {
        if (!currentData.topPicks.includes(photoId)) {
          currentData.topPicks = [photoId, ...currentData.topPicks];
        }
      } else {
        currentData.topPicks = currentData.topPicks.filter((id) => id !== photoId);
      }

      await saveStoredData(currentData);
      return res.status(200).json({ success: true, topPicks: currentData.topPicks });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Photos API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
