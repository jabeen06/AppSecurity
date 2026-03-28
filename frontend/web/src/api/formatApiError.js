/** Readable message from axios error + Express/Zod JSON body. */
export function formatApiError(err) {
  const msg = err?.message || '';
  if (msg === 'Network Error' || err?.code === 'ERR_NETWORK') {
    return 'Cannot reach the API. Start the backend (e.g. cd backend && npm run start), use npm run dev for the web app, and ensure VITE_API_BASE_URL ends with /api if you set it.';
  }
  const status = err?.response?.status;
  if (status === 404) {
    return 'API not found (404). If using VITE_API_BASE_URL, it must end with /api (e.g. http://localhost:4000/api).';
  }
  const d = err?.response?.data;
  if (!d) return msg || 'Request failed.';
  if (typeof d === 'string') return d.includes('<!DOCTYPE') || d.includes('<html') ? 'Server returned HTML instead of JSON — check API URL and /api base path.' : d;
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
