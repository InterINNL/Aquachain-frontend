import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'innl-nav',
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {}
