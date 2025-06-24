import { Route } from '@angular/router';
import { Demo } from './components/demo/demo';
import { WaterUtilities } from './components/water-utilities/water-utilities';
import { Home } from './components/home/home';
import { CitizenScience } from './components/citizen-science/citizen-science';

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
    component: WaterUtilities,
  },
  {
    path: 'citizen-science',
    component: CitizenScience,
  },
];
