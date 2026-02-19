// src/pages/api/logout.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('session', { path: '/' });
  return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};
