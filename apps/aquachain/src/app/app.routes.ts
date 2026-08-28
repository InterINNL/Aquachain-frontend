import { Route } from '@angular/router';
import { Home } from './components/home/home';
import { aquachainRouteSeo } from './seo-route-data';

function seo(path: string) {
  return aquachainRouteSeo[path] ?? aquachainRouteSeo[''];
}

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
    data: seo(''),
  },
  {
    path: 'agent-ops',
    loadComponent: () =>
      import('./components/agent-ops/agent-ops').then((m) => m.AgentOps),
    data: seo('agent-ops'),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact').then((m) => m.Contact),
    data: seo('contact'),
  },
  {
    path: 'demo',
    redirectTo: 'citizen-science',
    pathMatch: 'full',
  },
  {
    path: 'water-utilities',
    loadComponent: () =>
      import('./components/water-utilities/water-utilities').then(
        (m) => m.WaterUtilities,
      ),
    data: seo('water-utilities'),
  },
  {
    path: 'water-well-initiative',
    loadComponent: () =>
      import('./components/water-well-initiative/water-well-initiative').then(
        (m) => m.WaterWellInitiative,
      ),
    data: seo('water-well-initiative'),
  },
  {
    path: 'citizen-science',
    loadComponent: () =>
      import('./components/citizen-science/citizen-science').then(
        (m) => m.CitizenScience,
      ),
    data: seo('citizen-science'),
  },
  {
    path: 'sustainable-actions',
    loadComponent: () =>
      import('./components/sustainable-actions/sustainable-actions').then(
        (m) => m.SustainableActions,
      ),
    data: seo('sustainable-actions'),
  },
  {
    path: 'community-bounty',
    loadComponent: () =>
      import('./components/community-bounty/community-bounty').then(
        (m) => m.CommunityBounty,
      ),
    data: seo('community-bounty'),
  },
  {
    path: 'water-credits',
    loadComponent: () =>
      import('./components/water-credits/water-credits').then(
        (m) => m.WaterCredits,
      ),
    data: seo('water-credits'),
  },
  {
    path: 'local-dao',
    loadComponent: () =>
      import('./components/local-dao/local-dao').then((m) => m.LocalDao),
    data: seo('local-dao'),
  },
  {
    path: 'cross-exchange',
    loadComponent: () =>
      import('./components/cross-exchange/cross-exchange').then(
        (m) => m.CrossExchange,
      ),
    data: seo('cross-exchange'),
  },
];
