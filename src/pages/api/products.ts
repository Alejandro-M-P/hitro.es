// src/pages/api/products.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
    // SECURITY WARNING: This is NOT a production-ready solution.
    // 1. It directly modifies the source code, which is a bad practice.
    // 2. There is no validation or sanitization of the input.
    // 3. This will not work in most production environments (e.g., serverless, read-only filesystems).
    // A proper database should be used instead.
    
    let data: Record<string, string> = {};
    const contentType = request.headers.get('content-type') || '';

    try {
        if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
            const form = await request.formData();
            data = Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, String(v)]));
        } else {
            const bodyText = await request.text();
            if (bodyText) {
                try {
                    const parsed = JSON.parse(bodyText);
                    if (parsed && typeof parsed === 'object') {
                        data = Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, String(v)]));
                    }
                } catch {
                    const params = new URLSearchParams(bodyText);
                    data = Object.fromEntries(params.entries());
                }
            }
        }
    } catch {
        // fallback: try text parsing
        const bodyText = await request.text().catch(() => '');
        if (bodyText) {
            try {
                const parsed = JSON.parse(bodyText);
                if (parsed && typeof parsed === 'object') {
                    data = Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, String(v)]));
                }
            } catch {
                const params = new URLSearchParams(bodyText);
                data = Object.fromEntries(params.entries());
            }
        }
    }

    const newProduct = {
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        description: data.description,
    };

    // Basic validation
    const missing = [
        !newProduct.name ? 'name' : '',
        !newProduct.price ? 'price' : '',
        !newProduct.imageUrl ? 'imageUrl' : '',
        !newProduct.category ? 'category' : '',
        !newProduct.description ? 'description' : '',
    ].filter(Boolean);
    if (missing.length > 0) {
        return new Response(JSON.stringify({ message: 'Missing required fields', missing }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const newProductString = `
,
  {
    name: '${newProduct.name}',
    price: '${newProduct.price}',
    imageUrl: '${newProduct.imageUrl}',
    category: '${newProduct.category}',
    description: 
${newProduct.description}
  }
];
`;
    try {
        const filePath = path.resolve(process.cwd(), 'src/data/products.ts');
        
        // Read the file, remove the closing bracket and semicolon, then append the new product.
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const updatedContent = fileContent.trim().slice(0, -2) + newProductString;
        
        await fs.writeFile(filePath, updatedContent);

        return new Response('Product added successfully', { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response('Error writing to file', { status: 500 });
    }
};
