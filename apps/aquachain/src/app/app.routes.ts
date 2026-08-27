import { Route } from '@angular/router';
import { Home } from './components/home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact').then((m) => m.Contact),
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
];
