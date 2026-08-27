import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { interinnlContent } from '../content';

type MosaicPhoto = {
  src: string;
  alt: string;
  caption: string;
};

@Component({
  selector: 'innl-mosaic',
  templateUrl: './mosaic.html',
  styleUrl: './mosaic.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoMosaic implements AfterViewInit, OnDestroy {
  readonly leftPhotos = interinnlContent.mosaic.left;
  readonly rightCarousels = interinnlContent.mosaic.right;

  readonly leftIndex = signal(0);
  readonly rightIndexes = signal(this.rightCarousels.map(() => 0));

  private timers: ReturnType<typeof setInterval>[] = [];

  ngAfterViewInit(): void {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      return;
    }

    this.timers.push(
      setInterval(() => {
        this.leftIndex.update((index) => (index + 1) % this.leftPhotos.length);
      }, 6000),
    );

    const rightIntervals = [4100, 5000, 3700, 6800];
    this.rightCarousels.forEach((photos, carouselIndex) => {
      if (photos.length < 2) {
        return;
      }

      this.timers.push(
        setInterval(() => {
          this.rightIndexes.update((indexes) => {
            const next = [...indexes];
            next[carouselIndex] = (next[carouselIndex] + 1) % photos.length;
            return next;
          });
        }, rightIntervals[carouselIndex] ?? 5000),
      );
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearInterval);
  }

  activePhoto(photos: MosaicPhoto[], index: number): MosaicPhoto {
    return photos[index];
  }
}
