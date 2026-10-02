import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

interface WorkExperienceItem {
  id: string;
  heading: string;
  brief: string;
  imageUrl: string;
  link: string;
  linkLabel?: string;
  isUserAdded?: boolean;
}

const DB_KEY  = 'vaishnavi_work_experience_v1';
const DB_FILE = path.resolve(process.cwd(), 'src/data/work_experience.json');

function getRedisClient(): Redis | null {
  try {
    return Redis.fromEnv();
  } catch {
    const url   = (process.env.KV_REST_API_URL  || process.env.UPSTASH_REDIS_REST_URL  || '').trim();
    const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
    if (url && token) return new Redis({ url, token });
    return null;
  }
}

let memoryCache: WorkExperienceItem[] = [];

try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) memoryCache = parsed;
  }
} catch { /* ignore */ }

async function getData(): Promise<WorkExperienceItem[]> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<WorkExperienceItem[] | string>(DB_KEY);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Redis get error (work):', err);
    }
  }
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return memoryCache;
}

async function saveData(items: WorkExperienceItem[]): Promise<void> {
  memoryCache = items;
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(DB_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Redis set error (work):', err);
    }
  }
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch { /* readonly env */ }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const items = await getData();

    // GET — return all work experiences
    if (req.method === 'GET') {
      return res.status(200).json({ experiences: items });
    }

    // POST — add new work experience
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.heading || !body.imageUrl || !body.link) {
        return res.status(400).json({ error: 'heading, imageUrl and link are required.' });
      }
      const newItem: WorkExperienceItem = {
        id:        body.id        || `work-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        heading:   body.heading,
        brief:     body.brief    || '',
        imageUrl:  body.imageUrl,
        link:      body.link,
        linkLabel: body.linkLabel || 'View Project',
        isUserAdded: true,
      };
      const updated = [newItem, ...items.filter(i => i.id !== newItem.id)];
      await saveData(updated);
      return res.status(200).json({ success: true, experience: newItem, experiences: updated });
    }

    // DELETE — remove by id
    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) return res.status(400).json({ error: 'id is required.' });
      const updated = items.filter(i => i.id !== id);
      await saveData(updated);
      return res.status(200).json({ success: true, experiences: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Work Experience API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
