// src/pages/api/login.ts
import type { APIRoute } from 'astro';

function extractPasswordFromUrl(urlValue: string | null | undefined) {
  if (!urlValue) return '';
  try {
    const url = new URL(urlValue, 'http://localhost');
    const direct = url.searchParams.get('password')?.trim() || '';
    if (direct) return direct;
    const rawQuery = urlValue.includes('?') ? urlValue.split('?')[1] : '';
    if (rawQuery) {
      const params = new URLSearchParams(rawQuery);
      return params.get('password')?.trim() || '';
    }
  } catch {
    // ignore
  }
  return '';
}

function extractPasswordFromRequest(request: Request) {
  let password = extractPasswordFromUrl(request.url);
  if (password) return password;

  const urlHeaderKeys = [
    'x-original-url',
    'x-forwarded-url',
    'x-forwarded-uri',
    'x-rewrite-url',
  ];
  for (const key of urlHeaderKeys) {
    const headerValue = request.headers.get(key);
    password = extractPasswordFromUrl(headerValue);
    if (password) return password;
  }

  return '';
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const adminPassword =
    (import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? '').trim();
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD is not set.');
    return new Response(JSON.stringify({ message: 'Server misconfigured' }), { status: 500 });
  }

  try {
    let password = '';
    const contentType = request.headers.get('content-type') || '';
    const headerPassword = String(request.headers.get('x-admin-password') ?? '').trim();
    const urlPassword = extractPasswordFromRequest(request);
    const debugHeaders = Object.fromEntries(request.headers.entries());
    let debugBodyText = '';

    try {
      if (contentType.includes('multipart/form-data')) {
        const form = await request.formData();
        password = String(form.get('password') ?? '').trim();
      } else {
        const bodyText = await request.text();
        debugBodyText = bodyText;
        if (bodyText) {
          if (contentType.includes('application/x-www-form-urlencoded')) {
            const params = new URLSearchParams(bodyText);
            password = String(params.get('password') ?? '').trim();
          } else if (contentType.includes('application/json')) {
            const data = JSON.parse(bodyText);
            password = String(data?.password ?? '').trim();
          } else {
            try {
              const data = JSON.parse(bodyText);
              password = String(data?.password ?? '').trim();
            } catch {
              password = bodyText.trim();
            }
          }
        }
      }
    } catch {
      // ignore body parse errors, fallback to header
    }

    if (!password && urlPassword) {
      password = urlPassword;
    }

    if (!password && headerPassword) {
      password = headerPassword;
    }

    if (!password) {
      return new Response(
        JSON.stringify({
          message: 'Invalid request body',
          debug: {
            contentType,
            hasHeaderPassword: !!headerPassword,
            headers: debugHeaders,
            bodyLength: debugBodyText.length,
            bodyText: debugBodyText,
            url: request.url,
            method: request.method,
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password === adminPassword) {
      cookies.set('session', 'admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return new Response(JSON.stringify({ message: 'Success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ request, cookies }) => {
  const adminPassword =
    (import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? '').trim();
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD is not set.');
    return new Response(JSON.stringify({ message: 'Server misconfigured' }), { status: 500 });
  }

  const password = extractPasswordFromRequest(request);
  if (!password) {
    const debugHeaders = Object.fromEntries(request.headers.entries());
    return new Response(
      JSON.stringify({
        message: 'Invalid request body',
        debug: {
          url: request.url,
          headers: debugHeaders,
        },
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (password === adminPassword) {
    cookies.set('session', 'admin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
