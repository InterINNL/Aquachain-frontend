import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideExperimentalWebMcpTools,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AQUACHAIN_ORIGIN,
  DEFAULT_OG_IMAGE,
  SEO_SITE_CONFIG,
  SeoService,
} from '@site-seo';

import { appRoutes } from './app.routes';
import { aquachainHomeSeo } from './seo-route-data';
import {
  createAquachainInfoWebMcpTools,
  createAquachainOpenModuleWebMcpTools,
} from './core/webmcp.tools';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: SEO_SITE_CONFIG,
      useValue: {
        siteName: 'AquaChain',
        canonicalBase: AQUACHAIN_ORIGIN,
        defaultTitle: aquachainHomeSeo.title,
        defaultDescription: aquachainHomeSeo.description,
        defaultOgImage: DEFAULT_OG_IMAGE,
      },
    },
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    importProvidersFrom(BrowserAnimationsModule),
    provideExperimentalWebMcpTools(createAquachainInfoWebMcpTools()),
    provideExperimentalWebMcpTools(createAquachainOpenModuleWebMcpTools()),
    provideAppInitializer(() => inject(SeoService).init()),
  ],
};
