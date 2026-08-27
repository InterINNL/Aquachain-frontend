import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  signal,
} from '@angular/core';
import { Flags } from '../flags/flags';
import { FounderCards } from '../founders/founders';
import { PhotoMosaic } from '../mosaic/mosaic';
import { SocialTease } from '../social-tease/social-tease';
import { StoryCarousel } from '../stories/stories';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-landing',
  imports: [Flags, StoryCarousel, PhotoMosaic, FounderCards, SocialTease],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing implements AfterViewInit, OnDestroy {
  readonly content = interinnlContent;
  readonly aquachain = interinnlContent.projects[0];
  readonly heroPhotos = interinnlContent.heroPhotos;
  readonly heroIndex = signal(0);
  readonly parallax = signal(0);

  private reducedMotion = false;
  private rotateTimer: ReturnType<typeof setInterval> | undefined;

  ngAfterViewInit(): void {
    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.reducedMotion) {
      this.rotateTimer = setInterval(() => {
        this.heroIndex.update((index) => (index + 1) % this.heroPhotos.length);
      }, 5500);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.rotateTimer);
  }

  goHero(index: number): void {
    this.heroIndex.set(index);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.reducedMotion) {
      return;
    }
    this.parallax.set(window.scrollY * 0.12);
  }
}
