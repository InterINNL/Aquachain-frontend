import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '@env/environment';
import { pageSize } from '@services/contract/contract';
import { ToastrService } from '@services/toastr/toastr';
import { WalletService } from '@services/wallet/wallet';
import { canGoPrev } from '../../utils/pagination';
import {
  amountCount,
  CrossPlatformExchangeService,
  ExchangePartner,
  ExchangeRate,
  formatRate,
  SwapDirection,
} from '@services/cross-platform-exchange/cross-platform-exchange';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

interface PartnerRow extends ExchangePartner {
  rate?: ExchangeRate;
  locked?: string;
}

@Component({
  selector: 'cross-exchange',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './cross-exchange.html',
  styleUrl: './cross-exchange.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CrossExchange implements OnInit {
  contractAddress = environment.CrossPlatformExchangeContractAddress;
  walletAddress = '';
  walletWarning = false;
  missingContract = false;
  busyAction = false;

  partners: PartnerRow[] = [];
  selected: PartnerRow | null = null;
  loadingPartners = false;
  partnerPage = 1;
  partnerCursors: string[] = [];
  partnerHasNext = false;

  swapForm!: FormGroup;
  withdrawForm!: FormGroup;

  readonly pageSize = pageSize;
  readonly canGoPrev = canGoPrev;
  readonly environment = environment;
  readonly formatRate = formatRate;
  readonly amountCount = amountCount;

  private readonly walletService = inject(WalletService);
  private readonly exchange = inject(CrossPlatformExchangeService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView as
    | (Window & typeof globalThis & { keplr?: unknown })
    | null;

  ngOnInit() {
    this.swapForm = this.fb.group({
      direction: ['base_to_partner' as SwapDirection, Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });

    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.window?.keplr) {
      this.walletWarning = true;
    }
    this.missingContract = !this.contractAddress;
    if (!this.missingContract) {
      void this.loadPartners();
    }
  }

  baseSymbol(): string {
    return environment.coinMinimalDenom || 'uosmo';
  }

  canGoNextPage(hasNext: boolean): boolean {
    return hasNext;
  }

  async selectPartner(partner: PartnerRow) {
    this.selected = partner;
    await this.refreshSelected();
  }

  nextPartners() {
    if (!this.partnerHasNext) {
      return;
    }
    this.partnerPage++;
    void this.loadPartners();
  }

  prevPartners() {
    if (!canGoPrev(this.partnerPage)) {
      return;
    }
    this.partnerPage--;
    void this.loadPartners();
  }

  async onSwap() {
    if (!this.selected || this.swapForm.invalid || this.busyAction) {
      return;
    }
    const value = this.swapForm.value;
    const direction = value.direction as SwapDirection;
    const amount = String(value.amount);
    const funds =
      direction === 'base_to_partner'
        ? [{ denom: environment.coinMinimalDenom, amount }]
        : [];

    await this.runAction(
      () =>
        this.exchange.swap(
          this.walletAddress,
          this.contractAddress,
          this.selected!.denom,
          direction,
          amount,
          funds,
        ),
      'Swap Complete',
      'Swap Failed',
      async () => {
        await this.loadPartners();
        if (this.selected) {
          await this.refreshSelected();
        }
      },
    );
  }

  async onWithdraw() {
    if (!this.selected || this.withdrawForm.invalid || this.busyAction) {
      return;
    }
    const amount = String(this.withdrawForm.value.amount);
    await this.runAction(
      () =>
        this.exchange.withdraw(
          this.walletAddress,
          this.contractAddress,
          this.selected!.denom,
          amount,
        ),
      'Withdraw Complete',
      'Withdraw Failed',
      async () => {
        this.withdrawForm.reset();
        await this.loadPartners();
        if (this.selected) {
          await this.refreshSelected();
        }
      },
    );
  }

  truncate(text: string | undefined | null, max = 28): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadPartners() {
    this.loadingPartners = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.partnerPage > 1
          ? this.partnerCursors[this.partnerPage - 2]
          : undefined;
      const raw = await this.exchange.listPartners(
        this.contractAddress,
        true,
        start_after,
        this.pageSize,
      );
      const rows: PartnerRow[] = [];
      for (const partner of raw) {
        const row: PartnerRow = { ...partner };
        try {
          row.rate = await this.exchange.getRate(
            this.contractAddress,
            partner.denom,
          );
        } catch {
          row.rate = undefined;
        }
        if (this.walletAddress) {
          try {
            row.locked = await this.exchange.getLockedBalance(
              this.contractAddress,
              this.walletAddress,
              partner.denom,
            );
          } catch {
            row.locked = '0';
          }
        }
        rows.push(row);
      }

      this.ngZone.run(() => {
        this.partners = rows;
        this.partnerHasNext = raw.length === this.pageSize;
        const last = raw[raw.length - 1];
        if (this.partnerHasNext && last) {
          this.partnerCursors[this.partnerPage - 1] = last.denom;
        }
        this.loadingPartners = false;
        if (
          this.selected &&
          !rows.some((p) => p.denom === this.selected?.denom)
        ) {
          this.selected = rows[0] ?? null;
        } else if (!this.selected && rows.length > 0) {
          this.selected = rows[0];
        }
        this.cdr.detectChanges();
      });

      if (this.selected) {
        await this.refreshSelected();
      }
    } catch (err) {
      console.error('Failed to load partners:', err);
      this.ngZone.run(() => {
        this.loadingPartners = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async refreshSelected() {
    if (!this.selected) {
      return;
    }
    try {
      const partner = await this.exchange.getPartner(
        this.contractAddress,
        this.selected.denom,
      );
      const rate = await this.exchange.getRate(
        this.contractAddress,
        this.selected.denom,
      );
      let locked = '0';
      if (this.walletAddress) {
        locked = await this.exchange.getLockedBalance(
          this.contractAddress,
          this.walletAddress,
          this.selected.denom,
        );
      }
      this.selected = { ...partner, rate, locked };
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to refresh partner:', err);
    }
  }

  private async runAction(
    action: () => Promise<unknown>,
    successTitle: string,
    errorTitle: string,
    after?: () => Promise<void>,
  ) {
    if (this.busyAction) {
      return;
    }
    try {
      await this.ensureWallet();
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Wallet Connection Failed',
      );
      return;
    }

    this.busyAction = true;
    try {
      const result = await action();
      if (result) {
        this.toastr.showSuccess(result as never, successTitle);
        if (after) {
          await after();
        }
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        errorTitle,
      );
    } finally {
      this.busyAction = false;
    }
  }

  private async ensureWallet(): Promise<string> {
    if (this.walletAddress) {
      return this.walletAddress;
    }
    const address = await this.walletService.connectWallet();
    this.walletAddress = address;
    return address;
  }
}
