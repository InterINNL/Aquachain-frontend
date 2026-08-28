import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Inline India + Netherlands flag SVGs for reuse. */
@Component({
  selector: 'innl-flags',
  template: `
    <span class="innl-flags" [class.innl-flags--lg]="size === 'lg'" role="group" [attr.aria-label]="labels ? null : 'India and Netherlands flags'">
      <span class="innl-flag" role="img" aria-label="India flag">
        <svg viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="9" height="2" y="0" fill="#FF9933" />
          <rect width="9" height="2" y="2" fill="#fff" />
          <rect width="9" height="2" y="4" fill="#138808" />
          <circle cx="4.5" cy="3" r="0.7" fill="#000080" />
        </svg>
      </span>
      <span class="innl-flag" role="img" aria-label="Netherlands flag">
        <svg viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="9" height="2" y="0" fill="#AE1C28" />
          <rect width="9" height="2" y="2" fill="#fff" />
          <rect width="9" height="2" y="4" fill="#21468B" />
        </svg>
      </span>
      @if (labels) {
        <span class="innl-flags__labels" aria-hidden="true">India · Netherlands</span>
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
      flex-shrink: 0;
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
