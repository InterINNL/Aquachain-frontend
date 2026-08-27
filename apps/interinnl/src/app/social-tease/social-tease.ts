import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interinnlContent } from '../content';

@Component({
  selector: 'innl-social-tease',
  templateUrl: './social-tease.html',
  styleUrl: './social-tease.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialTease {
  readonly social = interinnlContent.social;
}
