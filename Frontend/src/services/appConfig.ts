const DEFAULT_API_BASE_URL = '/api';
const DEFAULT_SIMULATED_LATENCY_MS = 180;

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const appConfig = Object.freeze({
  apiBaseUrl: normalizeBaseUrl(import.meta.env.PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL),
  simulatedLatencyMs: Number(import.meta.env.PUBLIC_SIMULATED_LATENCY_MS || DEFAULT_SIMULATED_LATENCY_MS),
});
