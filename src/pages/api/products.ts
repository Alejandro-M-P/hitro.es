// src/pages/api/products.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { products } from '../../data/products';

export const prerender = false;

type ProductItem = {
    name: string;
    price: string;
    imageUrl: string;
    category: string;
    description: string;
};

const productsFilePath = path.resolve(process.cwd(), 'src/data/products.ts');

function normalizePayload(data: Record<string, string>): ProductItem {
    return {
        name: (data.name || '').trim(),
        price: (data.price || '').trim(),
        imageUrl: (data.imageUrl || '').trim(),
        category: (data.category || '').trim(),
        description: (data.description || '').trim(),
    };
}

function validatePayload(payload: ProductItem): string[] {
    return [
        !payload.name ? 'name' : '',
        !payload.price ? 'price' : '',
        !payload.imageUrl ? 'imageUrl' : '',
        !payload.category ? 'category' : '',
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

async function readProducts(): Promise<ProductItem[]> {
    return products as ProductItem[];
}

async function writeProducts(nextProducts: ProductItem[]) {
    const nextContent = `// src/data/products.ts
export const products = ${JSON.stringify(nextProducts, null, 2)};
`;
    await fs.writeFile(productsFilePath, nextContent, 'utf-8');
}

export const POST: APIRoute = async ({ request }) => {
    const data = await readRequestData(request);
    const newProduct = normalizePayload(data);
    const missing = validatePayload(newProduct);

    if (missing.length > 0) {
        return new Response(JSON.stringify({ message: 'Missing required fields', missing }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const currentProducts = await readProducts();
        await writeProducts([...currentProducts, newProduct]);
        return new Response('Product added successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error writing to file', { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request }) => {
    const data = await readRequestData(request);
    const index = Number.parseInt(String(data.index ?? '-1'), 10);
    const updatedProduct = normalizePayload(data);
    const missing = validatePayload(updatedProduct);

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
        const currentProducts = await readProducts();
        if (!currentProducts[index]) {
            return new Response('Product not found', { status: 404 });
        }
        currentProducts[index] = updatedProduct;
        await writeProducts(currentProducts);
        return new Response('Product updated successfully', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error writing to file', { status: 500 });
    }
};
