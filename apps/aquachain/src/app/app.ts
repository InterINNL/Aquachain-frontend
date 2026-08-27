import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { filter, map, startWith } from 'rxjs';
import { Navbar } from './components/navbar/navbar';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { InterinnlFooter } from './interinnl/interinnl-footer';
import { InterinnlNav } from './interinnl/interinnl-nav';

@Component({
  imports: [
    RouterModule,
    FontAwesomeModule,
    Navbar,
    InterinnlNav,
    InterinnlFooter,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'InterINNL';

  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly isAquachain = computed(() =>
    (this.url() ?? '').startsWith('/aquachain'),
  );

  constructor() {
    const library = inject(FaIconLibrary);
    library.addIconPacks(fas);
  }
}
