// src/pages/api/videos.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { PlayCircle, Shield, Zap } from 'lucide-astro'; // We need to handle the icon somehow

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

export const POST: APIRoute = async ({ request }) => {
    // SECURITY WARNING: This is NOT a production-ready solution.
    // See src/pages/api/products.ts for more details.

    const data = await request.formData();
    const title = data.get('title') as string;

    if (!title) {
        return new Response('Missing title', { status: 400 });
    }

    const newLesson = {
        title,
        slug: slugify(title),
        category: data.get('category'),
        imageUrl: data.get('imageUrl'),
        duration: data.get('duration'),
        icon: 'Shield', // Defaulting to Shield, this needs a better solution
        youtubeId: data.get('youtubeId'),
        description: data.get('description'),
    };
    
    // This is very simplistic. A real app would need a way to select the icon.
    const iconName = newLesson.category === 'Mentalidad' ? 'Zap' : newLesson.category === 'Avanzado' ? 'PlayCircle' : 'Shield';

    const newLessonString = `
,
  {
    title: '${newLesson.title}',
    slug: '${newLesson.slug}',
    category: '${newLesson.category}',
    imageUrl: '${newLesson.imageUrl}',
    duration: '${newLesson.duration}',
    icon: ${iconName},
    youtubeId: '${newLesson.youtubeId}',
    description: 
${newLesson.description}
  }
];
`;
    try {
        const filePath = path.resolve(process.cwd(), 'src/data/lessons.ts');
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const updatedContent = fileContent.trim().slice(0, -2) + newLessonString;
        
        await fs.writeFile(filePath, updatedContent);

        return new Response('Video added successfully', { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response('Error writing to file', { status: 500 });
    }
};
