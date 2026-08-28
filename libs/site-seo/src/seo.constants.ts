import { InjectionToken } from '@angular/core';

/** Public hub origin (canonical + Open Graph base). */
export const SITE_ORIGIN = 'https://interinnl.interchouette.net';

/** AquaChain demo mounted under the hub. */
export const AQUACHAIN_ORIGIN = `${SITE_ORIGIN}/aquachain`;

/** Default social preview image (hub). */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-interinnl.svg`;

/** Route `data` keys consumed by SeoService. */
export interface SeoRouteData {
  title?: string;
  description?: string;
  ogType?: 'website' | 'profile';
  robots?: string;
}

export interface SeoSiteConfig {
  siteName: string;
  canonicalBase: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: string;
}

export const SEO_SITE_CONFIG = new InjectionToken<SeoSiteConfig>('SEO_SITE_CONFIG');
