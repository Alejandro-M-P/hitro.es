// src/pages/api/courses.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

const lessonsFilePath = path.resolve(process.cwd(), 'src/data/lessons.json');

async function readLessons() {
    try {
        const fileContent = await fs.readFile(lessonsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading lessons file:', error);
        throw new Error('Could not read lessons data.');
    }
}

async function writeLessons(newLessons) {
    try {
        await fs.writeFile(lessonsFilePath, JSON.stringify(newLessons, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing lessons file:', error);
        throw new Error('Could not save lessons data.');
    }
}


export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());

        if (!data.title || !data.price || !data.slug) {
            return new Response('Missing required fields', { status: 400 });
        }
        
        const imageUrl = 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop';

        const newLesson = {
            title: String(data.title),
            slug: String(data.slug),
            category: String(data.category),
            imageUrl,
            duration: String(data.duration),
            icon: 'Shield', // Default icon
            price: String(data.price),
            youtubeId: String(data.youtubeId),
            description: String(data.description),
        };

        const currentLessons = await readLessons();
        const updatedLessons = [...currentLessons, newLesson];
        await writeLessons(updatedLessons);

        return new Response('Course added successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
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
        const updatedLessons = currentLessons.filter(lesson => lesson.slug !== slug);

        if (currentLessons.length === updatedLessons.length) {
             return new Response('Course with that slug not found', { status: 404 });
        }

        await writeLessons(updatedLessons);

        return new Response('Course deleted successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const index = parseInt(formData.get('index'), 10);
        const newPrice = formData.get('newPrice');

        if (isNaN(index) || !newPrice) {
            return new Response('Missing or invalid index or newPrice', { status: 400 });
        }

        const currentLessons = await readLessons();
        
        if (index < 0 || index >= currentLessons.length) {
            return new Response('Invalid index', { status: 400 });
        }

        currentLessons[index].price = newPrice;

        await writeLessons(currentLessons);

        return new Response('Price updated successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
};
