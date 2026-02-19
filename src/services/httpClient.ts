import { appConfig } from './appConfig';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HttpRequestOptions {
  method?: HttpMethod;
  body?: BodyInit | null;
  headers?: HeadersInit;
}

interface HttpErrorPayload {
  status: number;
  message: string;
}

export class HttpError extends Error {
  public readonly status: number;

  constructor(payload: HttpErrorPayload) {
    super(payload.message);
    this.name = 'HttpError';
    this.status = payload.status;
  }
}

export async function apiRequest<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers,
  });

  if (!response.ok) {
    throw new HttpError({
      status: response.status,
      message: (await response.text()) || 'Unexpected API error',
    });
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function simulateFetch<T>(factory: () => T | Promise<T>, latencyMs = appConfig.simulatedLatencyMs): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  return await factory();
}
