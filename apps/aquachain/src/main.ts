import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
