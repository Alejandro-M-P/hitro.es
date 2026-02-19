import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { trainingCourses } from '../../data/training';
import { PlayCircle, Shield, Zap } from 'lucide-astro';

export const prerender = false;

type IconName = 'Shield' | 'Zap' | 'PlayCircle';

type CourseItem = {
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
  duration: string;
  icon: IconName;
  price: string;
  youtubeId: string;
  description: string;
};

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop';
const lessonsFilePath = path.resolve(process.cwd(), 'src/data/training.ts');

function getIconFromCategory(category: string): IconName {
  if (category.includes('Mentalidad')) return 'Zap';
  if (category.includes('Avanzado')) return 'PlayCircle';
  return 'Shield';
}

function toIconName(iconValue: unknown, category: string): IconName {
  if (iconValue === Zap) return 'Zap';
  if (iconValue === PlayCircle) return 'PlayCircle';
  if (iconValue === Shield) return 'Shield';
  return getIconFromCategory(category);
}

function normalizePayload(data: Record<string, string>) {
  return {
    title: (data.title || '').trim(),
    slug: (data.slug || '').trim(),
    category: (data.category || '').trim(),
    imageUrl: (data.imageUrl || '').trim(),
    duration: (data.duration || '').trim(),
    price: (data.price || '').trim(),
    youtubeId: (data.youtubeId || '').trim(),
    description: (data.description || '').trim(),
  };
}

async function readRequestData(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData();
    return Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, String(value)]));
  }

  const text = await request.text();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed && typeof parsed === 'object') {
      return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [key, String(value)]));
    }
  } catch {
    const params = new URLSearchParams(text);
    return Object.fromEntries(params.entries());
  }
  return {};
}

async function readLessons(): Promise<CourseItem[]> {
  return (trainingCourses as Array<Record<string, unknown>>).map((lesson) => ({
    title: String(lesson.title || ''),
    slug: String(lesson.slug || ''),
    category: String(lesson.category || ''),
    imageUrl: String(lesson.imageUrl || DEFAULT_IMAGE_URL),
    duration: String(lesson.duration || ''),
    icon: toIconName(lesson.icon, String(lesson.category || '')),
    price: String(lesson.price || '49.99€'),
    youtubeId: String(lesson.youtubeId || ''),
    description: String(lesson.description || ''),
  }));
}

async function writeLessons(nextLessons: CourseItem[]) {
  const serialized = JSON.stringify(nextLessons, null, 2).replace(
    /"icon": "(Shield|Zap|PlayCircle)"/g,
    '"icon": $1'
  );

  const nextContent = `// src/data/training.ts
import { PlayCircle, Shield, Zap } from 'lucide-astro';

export const trainingCourses = ${serialized};
`;
  await fs.writeFile(lessonsFilePath, nextContent, 'utf-8');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await readRequestData(request);
    const payload = normalizePayload(data);
    if (!payload.title || !payload.price || !payload.slug) {
      return new Response('Missing required fields', { status: 400 });
    }

    const newCourse: CourseItem = {
      title: payload.title,
      slug: payload.slug,
      category: payload.category || 'Formacion Especializada · Metodo HITRO Adultos',
      imageUrl: payload.imageUrl || DEFAULT_IMAGE_URL,
      duration: payload.duration || '',
      icon: getIconFromCategory(payload.category || ''),
      price: payload.price,
      youtubeId: payload.youtubeId || '',
      description: payload.description || '',
    };

    const currentLessons = await readLessons();
    await writeLessons([...currentLessons, newCourse]);
    return new Response('Course added successfully', { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(`Error: ${message}`, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    const currentLessons = await readLessons();
    const nextLessons = currentLessons.filter((lesson) => lesson.slug !== slug);
    if (nextLessons.length === currentLessons.length) {
      return new Response('Course with that slug not found', { status: 404 });
    }

    await writeLessons(nextLessons);
    return new Response('Course deleted successfully', { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(`Error: ${message}`, { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await readRequestData(request);
    const index = Number.parseInt(String(data.index ?? '-1'), 10);
    const payload = normalizePayload(data);
    if (Number.isNaN(index) || index < 0) {
      return new Response('Missing or invalid index', { status: 400 });
    }
    if (!payload.title || !payload.price || !payload.slug) {
      return new Response('Missing required fields', { status: 400 });
    }

    const currentLessons = await readLessons();
    if (!currentLessons[index]) {
      return new Response('Invalid index', { status: 400 });
    }

    currentLessons[index] = {
      ...currentLessons[index],
      title: payload.title,
      slug: payload.slug,
      category: payload.category || 'Formacion Especializada',
      imageUrl: payload.imageUrl || DEFAULT_IMAGE_URL,
      duration: payload.duration || '',
      icon: getIconFromCategory(payload.category || ''),
      price: payload.price,
      youtubeId: payload.youtubeId || '',
      description: payload.description || '',
    };
    await writeLessons(currentLessons);
    return new Response('Course updated successfully', { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(`Error: ${message}`, { status: 500 });
  }
};
