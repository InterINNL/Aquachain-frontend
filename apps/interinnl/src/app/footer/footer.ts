import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Flags } from '../flags/flags';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-footer',
  imports: [Flags],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly content = interinnlContent;
  readonly aquachain = interinnlContent.projects[0];
  readonly year = new Date().getFullYear();
}
