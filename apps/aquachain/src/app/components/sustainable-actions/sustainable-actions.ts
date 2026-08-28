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
  parseEcoAction,
  ParsedEcoAction,
  SustainableActionRewardsService,
} from '@services/sustainable-action-rewards/sustainable-action-rewards';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

@Component({
  selector: 'sustainable-actions',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './sustainable-actions.html',
  styleUrl: './sustainable-actions.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SustainableActions implements OnInit {
  contractAddress = environment.SustainableActionRewardsContractAddress;
  walletAddress = '';
  walletWarning = false;
  missingContract = false;
  busyAction = false;
  walletImpact = '0';

  actions: ParsedEcoAction[] = [];
  selected: ParsedEcoAction | null = null;
  loadingActions = false;
  actionPage = 1;
  actionCursors: number[] = [];
  actionHasNext = false;

  submitForm!: FormGroup;
  rewardAmount = '';
  verifierAddress = '';
  amVerifier = false;

  readonly pageSize = pageSize;
  readonly canGoPrev = canGoPrev;
  readonly environment = environment;

  private readonly walletService = inject(WalletService);
  private readonly rewards = inject(SustainableActionRewardsService);
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
    this.submitForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      impact_points: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)],
      ],
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.window?.keplr) {
      this.walletWarning = true;
    }
    this.missingContract = !this.contractAddress;
    if (!this.missingContract) {
      void this.loadActions();
    }
  }

  canGoNextPage(hasNext: boolean): boolean {
    return hasNext;
  }

  async selectAction(action: ParsedEcoAction) {
    this.selected = action;
    try {
      const fresh = await this.rewards.getAction(this.contractAddress, action.id);
      this.selected = parseEcoAction(fresh);
    } catch (err) {
      console.error('Failed to refresh action:', err);
    }
    this.cdr.detectChanges();
  }

  nextActions() {
    if (!this.actionHasNext) {
      return;
    }
    this.actionPage++;
    void this.loadActions();
  }

  prevActions() {
    if (!canGoPrev(this.actionPage)) {
      return;
    }
    this.actionPage--;
    void this.loadActions();
  }

  async onSubmitAction() {
    if (this.submitForm.invalid || this.busyAction) {
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

    const value = this.submitForm.value;
    this.busyAction = true;
    try {
      const result = await this.rewards.submitAction(
        this.walletAddress,
        this.contractAddress,
        {
          title: String(value.title),
          location: String(value.location),
          description: String(value.description ?? ''),
          impact_points: String(value.impact_points),
        },
      );
      if (result) {
        this.toastr.showSuccess(result, 'Action Submitted');
        this.submitForm.reset();
        this.actionPage = 1;
        this.actionCursors = [];
        await this.loadActions();
        await this.refreshWalletImpact();
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Submit Failed',
      );
    } finally {
      this.busyAction = false;
    }
  }

  async onVerifySelected() {
    if (!this.selected) {
      return;
    }
    await this.runAction(
      () =>
        this.rewards.verifyAction(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
        ),
      'Action Verified',
      'Verify Failed',
      async () => {
        await this.loadActions();
        if (this.selected) {
          await this.selectAction(this.selected);
        }
        await this.refreshWalletImpact();
      },
    );
  }

  async onRewardSelected() {
    if (!this.selected || !this.rewardAmount.trim()) {
      this.toastr.showError('Enter a reward amount.', 'Missing Amount');
      return;
    }
    const amount = this.rewardAmount.trim();
    await this.runAction(
      () =>
        this.rewards.rewardActor(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
          [{ denom: environment.coinMinimalDenom, amount }],
        ),
      'Reward Sent',
      'Reward Failed',
      async () => {
        this.rewardAmount = '';
        await this.loadActions();
        if (this.selected) {
          await this.selectAction(this.selected);
        }
      },
    );
  }

  async onAddVerifier() {
    const verifier = this.verifierAddress.trim();
    if (!verifier) {
      this.toastr.showError('Enter a verifier address.', 'Missing Address');
      return;
    }
    await this.runAction(
      () =>
        this.rewards.addVerifier(
          this.walletAddress,
          this.contractAddress,
          verifier,
        ),
      'Verifier Added',
      'Add Verifier Failed',
      async () => {
        this.verifierAddress = '';
        await this.refreshVerifierFlag();
      },
    );
  }

  async onRemoveVerifier() {
    const verifier = this.verifierAddress.trim();
    if (!verifier) {
      this.toastr.showError('Enter a verifier address.', 'Missing Address');
      return;
    }
    await this.runAction(
      () =>
        this.rewards.removeVerifier(
          this.walletAddress,
          this.contractAddress,
          verifier,
        ),
      'Verifier Removed',
      'Remove Verifier Failed',
      async () => {
        this.verifierAddress = '';
        await this.refreshVerifierFlag();
      },
    );
  }

  truncate(text: string | undefined | null, max = 28): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadActions() {
    this.loadingActions = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.actionPage > 1
          ? this.actionCursors[this.actionPage - 2]
          : undefined;
      const raw = await this.rewards.listActions(
        this.contractAddress,
        start_after,
        this.pageSize,
      );
      const actions = raw.map(parseEcoAction);
      this.ngZone.run(() => {
        this.actions = actions;
        this.actionHasNext = actions.length === this.pageSize;
        const last = actions[actions.length - 1];
        if (this.actionHasNext && last) {
          this.actionCursors[this.actionPage - 1] = last.id;
        }
        this.loadingActions = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load actions:', err);
      this.ngZone.run(() => {
        this.loadingActions = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async refreshWalletImpact() {
    if (!this.walletAddress || !this.contractAddress) {
      this.walletImpact = '0';
      return;
    }
    try {
      this.walletImpact = await this.rewards.getActorImpact(
        this.contractAddress,
        this.walletAddress,
      );
      this.cdr.detectChanges();
    } catch {
      this.walletImpact = '0';
    }
  }

  private async refreshVerifierFlag() {
    if (!this.walletAddress || !this.contractAddress) {
      this.amVerifier = false;
      return;
    }
    try {
      this.amVerifier = await this.rewards.isVerifier(
        this.contractAddress,
        this.walletAddress,
      );
      this.cdr.detectChanges();
    } catch {
      this.amVerifier = false;
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
    await Promise.all([this.refreshVerifierFlag(), this.refreshWalletImpact()]);
    return address;
  }
}
