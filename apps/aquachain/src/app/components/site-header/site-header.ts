import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
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
  readonly moreMenuOpen = signal(false);

  private readonly router = inject(Router);

  readonly moduleBrand = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.resolveBrand()),
      startWith(this.resolveBrand()),
    ),
    { initialValue: this.resolveBrand() },
  );

  readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.normalizePath()),
      startWith(this.normalizePath()),
    ),
    { initialValue: this.normalizePath() },
  );

  toggle(): void {
    this.open.update((v) => !v);
    this.moreMenuOpen.set(false);
  }

  close(): void {
    this.open.set(false);
    this.moreMenuOpen.set(false);
  }

  toggleMoreMenu(event: Event): void {
    event.stopPropagation();
    this.moreMenuOpen.update((v) => !v);
  }

  isMoreModuleActive(): boolean {
    const path = this.currentPath();
    return this.content.nav.moreModules.some((item) => item.route === path);
  }

  brandIcon(brand: HeaderBrand | null): string {
    return brand?.icon ?? 'droplet';
  }

  brandAccent(brand: HeaderBrand | null): string {
    return brand?.accent ?? 'teal';
  }

  @HostListener('document:click')
  closeMoreMenu(): void {
    this.moreMenuOpen.set(false);
  }

  private resolveBrand(): HeaderBrand | null {
    const path = this.normalizePath();
    return this.content.headerBrands[path] ?? null;
  }

  private normalizePath(): string {
    return this.router.url.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  }
}
