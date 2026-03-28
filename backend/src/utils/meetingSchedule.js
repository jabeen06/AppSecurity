/** Accepts HH:mm or HH:mm:ss (and H:mm). Strips trailing fractional seconds from HTML time inputs. Returns HH:mm or null. */
export function normalizeMeetingTimeHHmm(input) {
  const s = String(input ?? '').trim().replace(/\.\d+$/, '');
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export function isValidMeetingDateISO(date) {
  const d = String(date ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = new Date(`${d}T12:00:00.000Z`);
  return !Number.isNaN(t.getTime());
}

/** Date + time in the machine's local timezone (stable across Node vs ISO-string quirks). */
export function computeStartsAtLocal(dateISO, timeHHmm) {
  const p = String(dateISO).trim().split('-').map((x) => parseInt(x, 10));
  const t = String(timeHHmm).trim().split(':').map((x) => parseInt(x, 10));
  if (p.length !== 3 || t.length < 2) return null;
  const [y, mo, d] = p;
  const [h, mi] = t;
  if ([y, mo, d, h, mi].some((n) => Number.isNaN(n))) return null;
  const dt = new Date(y, mo - 1, d, h, mi, 0, 0);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

/** Midnight local time for the given instant's calendar day. */
export function startOfLocalDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
