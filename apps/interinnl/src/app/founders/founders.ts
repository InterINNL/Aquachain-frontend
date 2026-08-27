import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-founders',
  templateUrl: './founders.html',
  styleUrl: './founders.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FounderCards {
  readonly founders = interinnlContent.founders;
}
