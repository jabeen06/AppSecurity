/** Readable message from axios error + Express/Zod JSON body. */
export function formatApiError(err) {
  const d = err?.response?.data;
  if (!d) return err?.message || 'Request failed.';
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
