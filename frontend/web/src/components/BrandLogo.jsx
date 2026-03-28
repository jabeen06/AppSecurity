import React from 'react';
import logoAsset from '../assets/logo-5-1.png';

/**
 * Brand image shipped with the app: keep `src/assets/logo-5-1.png` in git.
 * `npm run build` inlines it into `dist/assets/` — no extra CDN step for static hosts.
 */
export const LOGO_SRC = logoAsset;

/**
 * @param {'header' | 'auth' | 'inline'} variant
 */
export default function BrandLogo({ variant = 'header', className = '' }) {
  const v =
    variant === 'auth' ? 'brand-logo--auth' : variant === 'inline' ? 'brand-logo--inline' : 'brand-logo--header';
  return (
    <img
      src={LOGO_SRC}
      alt="Arbor International School — The Oratory Guild"
      className={`brand-logo ${v} ${className}`.trim()}
      decoding="async"
    />
  );
}
