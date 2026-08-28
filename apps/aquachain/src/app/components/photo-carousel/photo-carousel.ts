import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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

  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
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

  selectSlide(index: number): void {
    this.activeIndex.set(index);
  }
}
