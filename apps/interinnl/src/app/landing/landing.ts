import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  readonly content = interinnlContent;
  readonly aquachain = interinnlContent.projects[0];
}
