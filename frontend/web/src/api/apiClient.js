import axios from 'axios';

/**
 * Prefer same-origin `/api` so production (Vercel) and mobile browsers work without embedding localhost.
 * Vite dev proxies `/api` → http://localhost:4000 (vite.config.js).
 * Override with VITE_API_BASE_URL when the API is on another host (e.g. direct https://api.example.com/api).
 */
function resolveApiBaseURL() {
  const v = import.meta.env.VITE_API_BASE_URL;
  if (v && String(v).trim()) {
    const s = String(v).trim().replace(/\/+$/, '');
    // Production builds must not call localhost (breaks phones / Vercel); use same-origin proxy.
    if (import.meta.env.PROD && /localhost|127\.0\.0\.1/i.test(s)) return '/api';
    return s;
  }
  return '/api';
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseURL(),
  timeout: 10000
});

export const setAuthToken = (token) => {
  if (token) apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete apiClient.defaults.headers.common.Authorization;
};

