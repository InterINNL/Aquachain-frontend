import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interinnlContent } from './content';

@Component({
  selector: 'interinnl-footer',
  templateUrl: './interinnl-footer.html',
  styleUrl: './interinnl-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterinnlFooter {
  readonly content = interinnlContent;
}
