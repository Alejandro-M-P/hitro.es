// src/pages/api/videos.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { lessons } from '../../data/lessons';
import { PlayCircle, Shield, Zap } from 'lucide-astro';

export const prerender = false;

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

type IconName = 'Shield' | 'Zap' | 'PlayCircle';

type LessonItem = {
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

const lessonsFilePath = path.resolve(process.cwd(), 'src/data/lessons.ts');

function getIconFromCategory(category: string): IconName {
    if (category === 'Mentalidad') return 'Zap';
    if (category === 'Avanzado') return 'PlayCircle';
    return 'Shield';
}

function normalizePayload(data: Record<string, string>) {
    return {
        title: (data.title || '').trim(),
        category: (data.category || '').trim(),
        imageUrl: (data.imageUrl || '').trim(),
        duration: (data.duration || '').trim(),
        youtubeId: (data.youtubeId || '').trim(),
        description: (data.description || '').trim(),
    };
}

function validatePayload(payload: ReturnType<typeof normalizePayload>): string[] {
    return [
        !payload.title ? 'title' : '',
        !payload.category ? 'category' : '',
        !payload.imageUrl ? 'imageUrl' : '',
        !payload.duration ? 'duration' : '',
        !payload.youtubeId ? 'youtubeId' : '',
        !payload.description ? 'description' : '',
    ].filter(Boolean);
}

async function readRequestData(request: Request): Promise<Record<string, string>> {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
        const form = await request.formData();
        return Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, String(v)]));
    }

    const text = await request.text();
    if (!text) return {};

    try {
        const parsed = JSON.parse(text) as unknown;
        if (parsed && typeof parsed === 'object') {
            return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)]));
        }
    } catch {
        const params = new URLSearchParams(text);
        return Object.fromEntries(params.entries());
    }

    return {};
}

function toIconName(iconValue: unknown, category: string): IconName {
    if (iconValue === Zap) return 'Zap';
    if (iconValue === PlayCircle) return 'PlayCircle';
    if (iconValue === Shield) return 'Shield';
    return getIconFromCategory(category);
}

async function readLessons(): Promise<LessonItem[]> {
    return (lessons as Array<Record<string, unknown>>).map((lesson) => ({
        title: String(lesson.title || ''),
        slug: String(lesson.slug || ''),
        category: String(lesson.category || ''),
        imageUrl: String(lesson.imageUrl || ''),
        duration: String(lesson.duration || ''),
        icon: toIconName(lesson.icon, String(lesson.category || '')),
        price: String(lesson.price || '49.99€'),
        youtubeId: String(lesson.youtubeId || ''),
        description: String(lesson.description || ''),
    }));
}

async function writeLessons(nextLessons: LessonItem[]) {
    const serialized = JSON.stringify(nextLessons, null, 2).replace(
        /"icon": "(Shield|Zap|PlayCircle)"/g,
        '"icon": $1'
    );
    const nextContent = `// src/data/lessons.ts
import { PlayCircle, Shield, Zap } from 'lucide-astro';

export const lessons = ${serialized};
`;

    await fs.writeFile(lessonsFilePath, nextContent, 'utf-8');
}

export const POST: APIRoute = async ({ request }) => {
    const data = await readRequestData(request);
    const payload = normalizePayload(data);
    const missing = validatePayload(payload);

    if (missing.length > 0) {
        return new Response(JSON.stringify({ message: 'Missing required fields', missing }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const newLesson: LessonItem = {
        ...payload,
        slug: slugify(payload.title),
        icon: getIconFromCategory(payload.category),
        price: '49.99€',
    };

    try {
        const currentLessons = await readLessons();
        await writeLessons([...currentLessons, newLesson]);
        return new Response('Video added successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error writing to file', { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request }) => {
    const data = await readRequestData(request);
    const index = Number.parseInt(String(data.index ?? '-1'), 10);
    const payload = normalizePayload(data);
    const missing = validatePayload(payload);

    if (Number.isNaN(index) || index < 0) {
        return new Response('Invalid index', { status: 400 });
    }
    if (missing.length > 0) {
        return new Response(JSON.stringify({ message: 'Missing required fields', missing }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const currentLessons = await readLessons();
        if (!currentLessons[index]) {
            return new Response('Video not found', { status: 404 });
        }

        currentLessons[index] = {
            ...currentLessons[index],
            ...payload,
            slug: slugify(payload.title),
            icon: getIconFromCategory(payload.category),
        };
        await writeLessons(currentLessons);
        return new Response('Video updated successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error writing to file', { status: 500 });
    }
};
