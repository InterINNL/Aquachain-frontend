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
  CreditListing,
  formatExpiry,
  listingIsBuyable,
  WaterCreditMarketplaceService,
} from '@services/water-credit-marketplace/water-credit-marketplace';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

@Component({
  selector: 'water-credits',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './water-credits.html',
  styleUrl: './water-credits.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WaterCredits implements OnInit {
  contractAddress = environment.WaterCreditMarketplaceContractAddress;
  walletAddress = '';
  walletBalance = '0';
  walletWarning = false;
  missingContract = false;
  busyAction = false;

  listings: CreditListing[] = [];
  selected: CreditListing | null = null;
  loadingListings = false;
  listingPage = 1;
  listingCursors: number[] = [];
  listingHasNext = false;
  showActiveOnly = true;

  listForm!: FormGroup;
  transferForm!: FormGroup;
  mintForm!: FormGroup;

  readonly pageSize = pageSize;
  readonly canGoPrev = canGoPrev;
  readonly environment = environment;
  readonly formatExpiry = formatExpiry;

  private readonly walletService = inject(WalletService);
  private readonly marketplace = inject(WaterCreditMarketplaceService);
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
    this.listForm = this.fb.group({
      credits: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      region: ['', Validators.required],
      expiry_days: ['', Validators.pattern(/^(\d+)?$/)],
    });

    this.transferForm = this.fb.group({
      recipient: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });

    this.mintForm = this.fb.group({
      recipient: ['', Validators.required],
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
      void this.loadListings();
    }
  }

  canGoNextPage(hasNext: boolean): boolean {
    return hasNext;
  }

  isBuyable(listing: CreditListing): boolean {
    return listingIsBuyable(listing, Math.floor(Date.now() / 1000));
  }

  isSeller(listing: CreditListing): boolean {
    return (
      !!this.walletAddress &&
      listing.seller.toLowerCase() === this.walletAddress.toLowerCase()
    );
  }

  async selectListing(listing: CreditListing) {
    this.selected = listing;
    try {
      this.selected = await this.marketplace.getListing(
        this.contractAddress,
        listing.id,
      );
    } catch (err) {
      console.error('Failed to refresh listing:', err);
    }
    this.cdr.detectChanges();
  }

  nextListings() {
    if (!this.listingHasNext) {
      return;
    }
    this.listingPage++;
    void this.loadListings();
  }

  prevListings() {
    if (!canGoPrev(this.listingPage)) {
      return;
    }
    this.listingPage--;
    void this.loadListings();
  }

  toggleActiveFilter() {
    this.showActiveOnly = !this.showActiveOnly;
    this.listingPage = 1;
    this.listingCursors = [];
    void this.loadListings();
  }

  async onListCredits() {
    if (this.listForm.invalid || this.busyAction) {
      return;
    }
    const value = this.listForm.value;
    const expiryDays = String(value.expiry_days ?? '').trim();
    const expiresAt =
      expiryDays.length > 0
        ? Math.floor(Date.now() / 1000) + Number(expiryDays) * 86_400
        : undefined;

    await this.runAction(
      () =>
        this.marketplace.listCredit(
          this.walletAddress,
          this.contractAddress,
          String(value.credits),
          String(value.price),
          String(value.region),
          expiresAt,
        ),
      'Listing Created',
      'List Failed',
      async () => {
        this.listForm.reset();
        this.listingPage = 1;
        this.listingCursors = [];
        await Promise.all([this.loadListings(), this.refreshWalletBalance()]);
      },
    );
  }

  async onBuySelected() {
    if (!this.selected || this.busyAction) {
      return;
    }
    await this.runAction(
      () =>
        this.marketplace.buyCredit(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
          [
            {
              denom: environment.coinMinimalDenom,
              amount: this.selected!.price,
            },
          ],
        ),
      'Credits Purchased',
      'Buy Failed',
      async () => {
        await Promise.all([
          this.loadListings(),
          this.refreshWalletBalance(),
        ]);
        if (this.selected) {
          await this.selectListing(this.selected);
        }
      },
    );
  }

  async onCancelSelected() {
    if (!this.selected) {
      return;
    }
    await this.runAction(
      () =>
        this.marketplace.cancelListing(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
        ),
      'Listing Cancelled',
      'Cancel Failed',
      async () => {
        await Promise.all([this.loadListings(), this.refreshWalletBalance()]);
        if (this.selected) {
          await this.selectListing(this.selected);
        }
      },
    );
  }

  async onTransferCredits() {
    if (this.transferForm.invalid || this.busyAction) {
      return;
    }
    const value = this.transferForm.value;
    await this.runAction(
      () =>
        this.marketplace.transferCredit(
          this.walletAddress,
          this.contractAddress,
          String(value.recipient).trim(),
          String(value.amount),
        ),
      'Credits Transferred',
      'Transfer Failed',
      async () => {
        this.transferForm.reset();
        await this.refreshWalletBalance();
      },
    );
  }

  async onMintCredits() {
    if (this.mintForm.invalid || this.busyAction) {
      return;
    }
    const value = this.mintForm.value;
    await this.runAction(
      () =>
        this.marketplace.mintCredits(
          this.walletAddress,
          this.contractAddress,
          String(value.recipient).trim(),
          String(value.amount),
        ),
      'Credits Minted',
      'Mint Failed',
      async () => {
        this.mintForm.reset();
        await this.refreshWalletBalance();
      },
    );
  }

  truncate(text: string | undefined | null, max = 28): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadListings() {
    this.loadingListings = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.listingPage > 1
          ? this.listingCursors[this.listingPage - 2]
          : undefined;
      const raw = await this.marketplace.listListings(
        this.contractAddress,
        this.showActiveOnly,
        start_after,
        this.pageSize,
      );
      this.ngZone.run(() => {
        this.listings = raw;
        this.listingHasNext = raw.length === this.pageSize;
        const last = raw[raw.length - 1];
        if (this.listingHasNext && last) {
          this.listingCursors[this.listingPage - 1] = last.id;
        }
        this.loadingListings = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load listings:', err);
      this.ngZone.run(() => {
        this.loadingListings = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async refreshWalletBalance() {
    if (!this.walletAddress || !this.contractAddress) {
      this.walletBalance = '0';
      return;
    }
    try {
      this.walletBalance = await this.marketplace.getBalance(
        this.contractAddress,
        this.walletAddress,
      );
      this.cdr.detectChanges();
    } catch {
      this.walletBalance = '0';
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
    await this.refreshWalletBalance();
    return address;
  }
}
