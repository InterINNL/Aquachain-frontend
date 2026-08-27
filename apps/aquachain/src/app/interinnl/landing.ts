import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { interinnlContent } from './content';

@Component({
  selector: 'interinnl-landing',
  imports: [RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterinnlLanding {
  readonly content = interinnlContent;
  readonly aquachain = interinnlContent.projects[0];
}
