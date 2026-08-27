import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly content = interinnlContent;
}
