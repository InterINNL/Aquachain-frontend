import { Route } from '@angular/router';
import { Demo } from './components/demo/demo';
import { WaterUtilities } from './components/water-utilities/water-utilities';
import { WaterWellInitiative } from './components/water-well-initiative/water-well-initiative';
import { Home } from './components/home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'demo',
    component: Demo,
  },
  {
    path: 'water-utilities',
    component: WaterUtilities,
  },
  {
    path: 'water-well-initiative',
    component: WaterWellInitiative,
  },
  {
    path: 'citizen-science',
    loadComponent: () =>
      import('./components/citizen-science/citizen-science').then(
        (m) => m.CitizenScience,
      ),
  },
];
