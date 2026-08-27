import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { aquachainContent } from '../../content';

@Component({
  selector: 'site-footer',
  imports: [RouterModule],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  readonly content = aquachainContent;
  readonly year = new Date().getFullYear();
}
