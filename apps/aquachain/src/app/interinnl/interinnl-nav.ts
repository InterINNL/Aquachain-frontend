import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'interinnl-nav',
  imports: [RouterModule],
  templateUrl: './interinnl-nav.html',
  styleUrl: './interinnl-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterinnlNav {}
