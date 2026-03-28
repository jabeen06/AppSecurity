/**
 * Emails that always receive admin access (API + UI), in addition to AdminList.
 * Normalise with trim + toLowerCase before checking.
 */
const SUPER_ADMIN_EMAILS = new Set(['alsuha5c@arborinternationalschool.com']);

export function isSuperAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return SUPER_ADMIN_EMAILS.has(email.trim().toLowerCase());
}

/** Admin if super-admin list or AdminList row exists. */
export function resolveUserRole(email, inAdminList) {
  if (isSuperAdminEmail(email)) return 'admin';
  return inAdminList ? 'admin' : 'student';
}
