import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Inline India + Netherlands flag SVGs for reuse. */
@Component({
  selector: 'innl-flags',
  template: `
    <span class="innl-flags" [class.innl-flags--lg]="size === 'lg'">
      <span class="innl-flag" title="India" aria-label="India">
        <svg viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="9" height="2" y="0" fill="#FF9933" />
          <rect width="9" height="2" y="2" fill="#fff" />
          <rect width="9" height="2" y="4" fill="#138808" />
          <circle cx="4.5" cy="3" r="0.7" fill="#000080" />
        </svg>
      </span>
      <span class="innl-flag" title="Netherlands" aria-label="Netherlands">
        <svg viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="9" height="2" y="0" fill="#AE1C28" />
          <rect width="9" height="2" y="2" fill="#fff" />
          <rect width="9" height="2" y="4" fill="#21468B" />
        </svg>
      </span>
      @if (labels) {
        <span class="innl-flags__labels">India · Netherlands</span>
      }
    </span>
  `,
  styles: `
    .innl-flags {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .innl-flags--lg .innl-flag {
      width: 1.6rem;
      height: 1.15rem;
    }
    .innl-flags__labels {
      margin-left: 0.35rem;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--innl-navy);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flags {
  @Input() size: 'sm' | 'lg' = 'sm';
  @Input() labels = false;
}
