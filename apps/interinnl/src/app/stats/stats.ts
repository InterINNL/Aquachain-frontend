import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsRibbon implements AfterViewInit, OnDestroy {
  readonly stats = interinnlContent.stats;
  readonly shown = signal(false);
  readonly host = viewChild.required<ElementRef<HTMLElement>>('host');

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.shown.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.shown.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    this.observer.observe(this.host().nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  label(stat: (typeof interinnlContent.stats)[number]): string {
    return `${stat.value}${stat.suffix}`;
  }
}
