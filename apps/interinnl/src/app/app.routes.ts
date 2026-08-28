import { Route } from '@angular/router';
import { Landing } from './landing/landing';
import { interinnlContent } from './content';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Landing,
    data: {
      title: 'InterINNL | India and Netherlands tech bridge',
      description: interinnlContent.mission,
    },
  },
];
