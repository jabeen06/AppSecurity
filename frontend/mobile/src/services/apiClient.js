import axios from 'axios';

/**
 * Must be your **API** base URL (same value as web `VITE_API_BASE_URL`), ending in `/api`.
 * Do not use the Vercel / static **website** URL — that is HTML, not JSON.
 */
const rawBase =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) || 'http://localhost:4000/api';
const baseURL = String(rawBase).replace(/\/+$/, '');

if (__DEV__ && /vercel\.app/i.test(baseURL) && !baseURL.endsWith('/api')) {
  console.warn(
    '[Oratory Guild] EXPO_PUBLIC_API_BASE_URL should be your API (…/api), same as VITE_API_BASE_URL — not the Vercel web app URL alone.'
  );
}

export const apiClient = axios.create({
  baseURL,
  timeout: 10000
});

export const setAuthToken = (token) => {
  apiClient.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
};
