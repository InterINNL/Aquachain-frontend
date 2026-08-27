import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'wallet-banner',
  imports: [FontAwesomeModule],
  templateUrl: './wallet-banner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBanner {}
