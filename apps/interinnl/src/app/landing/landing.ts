import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { Flags } from '../flags/flags';
import { FounderCards } from '../founders/founders';
import { PhotoMosaic } from '../mosaic/mosaic';
import { SocialTease } from '../social-tease/social-tease';
import { StatsRibbon } from '../stats/stats';
import { StoryCarousel } from '../stories/stories';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-landing',
  imports: [
    Flags,
    StatsRibbon,
    StoryCarousel,
    PhotoMosaic,
    FounderCards,
    SocialTease,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing implements AfterViewInit {
  readonly content = interinnlContent;
  readonly aquachain = interinnlContent.projects[0];
  readonly parallax = signal(0);

  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.reducedMotion) {
      return;
    }
    this.parallax.set(window.scrollY * 0.12);
  }
}
