import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { SiteHeader } from './components/site-header/site-header';
import { SiteFooter } from './components/site-footer/site-footer';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [RouterModule, FontAwesomeModule, SiteHeader, SiteFooter],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const library = inject(FaIconLibrary);
    library.addIconPacks(fas);
  }
}
