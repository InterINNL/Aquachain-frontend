import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { filter, map, startWith } from 'rxjs';
import { aquachainContent, HeaderBrand } from '../../content';

@Component({
  selector: 'site-header',
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  readonly content = aquachainContent;
  readonly open = signal(false);

  private readonly router = inject(Router);

  readonly moduleBrand = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.resolveBrand()),
      startWith(this.resolveBrand()),
    ),
    { initialValue: this.resolveBrand() },
  );

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  brandIcon(brand: HeaderBrand | null): string {
    return brand?.icon ?? 'droplet';
  }

  brandAccent(brand: HeaderBrand | null): string {
    return brand?.accent ?? 'teal';
  }

  private resolveBrand(): HeaderBrand | null {
    const path = this.router.url.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    return this.content.headerBrands[path] ?? null;
  }
}
