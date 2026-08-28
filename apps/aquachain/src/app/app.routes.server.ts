import { RenderMode, ServerRoute } from '@angular/ssr';

/** Prerender public AquaChain routes (must match sitemap + _redirects). */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'agent-ops', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'citizen-science', renderMode: RenderMode.Prerender },
  { path: 'water-well-initiative', renderMode: RenderMode.Prerender },
  { path: 'water-utilities', renderMode: RenderMode.Prerender },
  { path: 'sustainable-actions', renderMode: RenderMode.Prerender },
  { path: 'community-bounty', renderMode: RenderMode.Prerender },
  { path: 'water-credits', renderMode: RenderMode.Prerender },
  { path: 'local-dao', renderMode: RenderMode.Prerender },
  { path: 'cross-exchange', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
