import { Route } from '@angular/router';
import { Home } from './components/home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./interinnl/landing').then((m) => m.InterinnlLanding),
  },
  {
    path: 'aquachain',
    children: [
      {
        path: '',
        component: Home,
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
      },
      {
        path: 'water-well-initiative',
        loadComponent: () =>
          import('./components/water-well-initiative/water-well-initiative').then(
            (m) => m.WaterWellInitiative,
          ),
      },
      {
        path: 'citizen-science',
        loadComponent: () =>
          import('./components/citizen-science/citizen-science').then(
            (m) => m.CitizenScience,
          ),
      },
    ],
  },
  {
    path: 'citizen-science',
    redirectTo: 'aquachain/citizen-science',
  },
  {
    path: 'water-well-initiative',
    redirectTo: 'aquachain/water-well-initiative',
  },
  {
    path: 'water-utilities',
    redirectTo: 'aquachain/water-utilities',
  },
  {
    path: 'demo',
    redirectTo: 'aquachain/citizen-science',
  },
];
