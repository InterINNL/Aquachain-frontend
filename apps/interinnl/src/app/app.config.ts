import {
  ApplicationConfig,
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
import {
  DEFAULT_OG_IMAGE,
  SEO_SITE_CONFIG,
  SITE_ORIGIN,
  SeoService,
} from '@site-seo';

import { appRoutes } from './app.routes';
import { interinnlContent } from './content';
import { createHubInfoWebMcpTools, createHubOpenPageWebMcpTools } from './core/webmcp.tools';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: SEO_SITE_CONFIG,
      useValue: {
        siteName: 'InterINNL',
        canonicalBase: SITE_ORIGIN,
        defaultTitle: 'InterINNL | India and Netherlands tech bridge',
        defaultDescription: interinnlContent.mission,
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
    provideExperimentalWebMcpTools(createHubInfoWebMcpTools()),
    provideExperimentalWebMcpTools(createHubOpenPageWebMcpTools()),
    provideAppInitializer(() => inject(SeoService).init()),
  ],
};
