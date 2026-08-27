import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-stories',
  templateUrl: './stories.html',
  styleUrl: './stories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryCarousel {
  readonly stories = interinnlContent.stories;
  readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  readonly index = signal(0);

  prev(): void {
    this.scrollBy(-1);
  }

  next(): void {
    this.scrollBy(1);
  }

  go(i: number): void {
    const el = this.track().nativeElement;
    const card = el.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    this.index.set(i);
  }

  onScroll(): void {
    const el = this.track().nativeElement;
    const cardWidth = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    const gap = 16;
    const i = Math.round(el.scrollLeft / (cardWidth + gap));
    this.index.set(Math.min(Math.max(i, 0), this.stories.length - 1));
  }

  private scrollBy(dir: number): void {
    const next = Math.min(
      Math.max(this.index() + dir, 0),
      this.stories.length - 1,
    );
    this.go(next);
  }
}
