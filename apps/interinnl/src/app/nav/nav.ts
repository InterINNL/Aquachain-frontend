import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { Flags } from '../flags/flags';

@Component({
  selector: 'innl-nav',
  imports: [Flags],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
    this.syncBody();
  }

  close(): void {
    this.open.set(false);
    this.syncBody();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  private syncBody(): void {
    document.body.classList.toggle('innl-drawer-open', this.open());
  }
}
