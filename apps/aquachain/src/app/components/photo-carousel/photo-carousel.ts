import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { AcPhoto } from '../../content';

@Component({
  selector: 'ac-photo-carousel',
  templateUrl: './photo-carousel.html',
  styleUrl: './photo-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCarousel implements OnInit, OnDestroy {
  readonly photos = input.required<AcPhoto[]>();
  readonly activeIndex = signal(0);

  private readonly platformId = inject(PLATFORM_ID);
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const count = this.photos().length;
    if (count <= 1) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.activeIndex.update((index) => (index + 1) % count);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }
}
