import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'loading-row',
  templateUrl: './loading-row.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingRow {
  readonly message = input('Loading…');
}
