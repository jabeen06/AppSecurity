import { resolvedApiBaseURL } from '../services/apiClient';

/** Readable axios/API errors; extra context when the device cannot reach the server. */
export function formatApiError(err) {
  const msg = err?.message || '';
  const noResponse = !err?.response;
  const isNetwork =
    noResponse &&
    (msg === 'Network Error' || err?.code === 'ERR_NETWORK' || msg.toLowerCase().includes('network'));

  if (isNetwork) {
    const base = resolvedApiBaseURL;
    return `Cannot reach API at ${base}. On a real phone, localhost is this phone — use your PC's LAN IP or a deployed HTTPS API (same as VITE_API_BASE_URL). Restart Expo after changing .env.`;
  }

  const d = err?.response?.data;
  if (!d) return msg || 'Request failed.';
  if (typeof d.message === 'string' && d.message.trim()) return d.message.trim();
  const fe = d.errors?.fieldErrors;
  if (fe && typeof fe === 'object') {
    const parts = [];
    for (const [, vals] of Object.entries(fe)) {
      if (Array.isArray(vals)) parts.push(...vals.filter(Boolean));
    }
    if (parts.length) return parts.join(' ');
  }
  return 'Request failed.';
}
