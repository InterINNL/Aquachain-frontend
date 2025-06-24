import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { config } from '@fortawesome/fontawesome-svg-core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

config.autoAddCss = false;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
