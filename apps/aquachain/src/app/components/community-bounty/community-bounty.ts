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
  Bounty,
  bountyStatusLabel,
  CommunityBountyService,
  isBountyOpen,
  parseSubmission,
  ParsedSubmission,
} from '@services/community-bounty/community-bounty';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

@Component({
  selector: 'community-bounty',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './community-bounty.html',
  styleUrl: './community-bounty.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CommunityBounty implements OnInit {
  contractAddress = environment.CommunityBountyContractAddress;
  walletAddress = '';
  walletWarning = false;
  missingContract = false;
  busyAction = false;

  bounties: Bounty[] = [];
  selected: Bounty | null = null;
  submissions: ParsedSubmission[] = [];
  loadingBounties = false;
  loadingSubmissions = false;
  bountyPage = 1;
  bountyCursors: number[] = [];
  bountyHasNext = false;

  postForm!: FormGroup;
  workForm!: FormGroup;

  readonly pageSize = pageSize;
  readonly canGoPrev = canGoPrev;
  readonly environment = environment;
  readonly bountyStatusLabel = bountyStatusLabel;

  private readonly walletService = inject(WalletService);
  private readonly bountyService = inject(CommunityBountyService);
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
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      deadline_days: [
        '14',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)],
      ],
      reward_amount: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)],
      ],
    });

    this.workForm = this.fb.group({
      summary: ['', Validators.required],
      location: ['', Validators.required],
      evidence: ['', Validators.required],
      hours_spent: ['', Validators.pattern(/^(\d+(\.\d+)?)?$/)],
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.window?.keplr) {
      this.walletWarning = true;
    }
    this.missingContract = !this.contractAddress;
    if (!this.missingContract) {
      void this.loadBounties();
    }
  }

  canGoNextPage(hasNext: boolean): boolean {
    return hasNext;
  }

  isSelectedOpen(): boolean {
    if (!this.selected) {
      return false;
    }
    return isBountyOpen(this.selected, Math.floor(Date.now() / 1000));
  }

  isPoster(bounty: Bounty): boolean {
    return (
      !!this.walletAddress &&
      bounty.poster.toLowerCase() === this.walletAddress.toLowerCase()
    );
  }

  formatDeadline(deadline: number | string): string {
    const ts = Number(deadline);
    if (!Number.isFinite(ts)) {
      return '—';
    }
    return new Date(ts * 1000).toLocaleString();
  }

  async selectBounty(bounty: Bounty) {
    this.selected = bounty;
    try {
      const fresh = await this.bountyService.getBounty(
        this.contractAddress,
        bounty.id,
      );
      this.selected = fresh;
      await this.loadSubmissions(fresh.id);
    } catch (err) {
      console.error('Failed to refresh bounty:', err);
    }
    this.cdr.detectChanges();
  }

  nextBounties() {
    if (!this.bountyHasNext) {
      return;
    }
    this.bountyPage++;
    void this.loadBounties();
  }

  prevBounties() {
    if (!canGoPrev(this.bountyPage)) {
      return;
    }
    this.bountyPage--;
    void this.loadBounties();
  }

  async onPostBounty() {
    if (this.postForm.invalid || this.busyAction) {
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

    const value = this.postForm.value;
    const deadlineDays = Number(value.deadline_days);
    const deadline = Math.floor(Date.now() / 1000) + deadlineDays * 86_400;
    this.busyAction = true;
    try {
      const result = await this.bountyService.postBounty(
        this.walletAddress,
        this.contractAddress,
        String(value.title),
        String(value.description),
        String(value.location),
        deadline,
        String(value.reward_amount),
        environment.coinMinimalDenom,
      );
      if (result) {
        this.toastr.showSuccess(result, 'Bounty Posted');
        this.postForm.reset({ deadline_days: '14' });
        this.bountyPage = 1;
        this.bountyCursors = [];
        await this.loadBounties();
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Post Failed',
      );
    } finally {
      this.busyAction = false;
    }
  }

  async onSubmitWork() {
    if (!this.selected || this.workForm.invalid || this.busyAction) {
      return;
    }
    if (!this.isSelectedOpen()) {
      this.toastr.showError('This bounty is closed.', 'Submit Failed');
      return;
    }

    const value = this.workForm.value;
    await this.runAction(
      () =>
        this.bountyService.submitWork(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
          {
            summary: String(value.summary),
            location: String(value.location),
            evidence: String(value.evidence),
            hours_spent: String(value.hours_spent ?? ''),
          },
        ),
      'Work Submitted',
      'Submit Failed',
      async () => {
        this.workForm.reset();
        await this.loadSubmissions(this.selected!.id);
        await this.selectBounty(this.selected!);
      },
    );
  }

  async onApproveSubmission(sub: ParsedSubmission) {
    if (!this.selected) {
      return;
    }
    await this.runAction(
      () =>
        this.bountyService.approveWork(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
          sub.id,
        ),
      'Work Approved',
      'Approve Failed',
      async () => {
        await this.loadBounties();
        await this.selectBounty(this.selected!);
      },
    );
  }

  async onCancelSelected() {
    if (!this.selected) {
      return;
    }
    await this.runAction(
      () =>
        this.bountyService.cancelBounty(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
        ),
      'Bounty Cancelled',
      'Cancel Failed',
      async () => {
        await this.loadBounties();
        await this.selectBounty(this.selected!);
      },
    );
  }

  truncate(text: string | undefined | null, max = 28): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadBounties() {
    this.loadingBounties = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.bountyPage > 1
          ? this.bountyCursors[this.bountyPage - 2]
          : undefined;
      const raw = await this.bountyService.listBounties(
        this.contractAddress,
        start_after,
        this.pageSize,
      );
      this.ngZone.run(() => {
        this.bounties = raw;
        this.bountyHasNext = raw.length === this.pageSize;
        const last = raw[raw.length - 1];
        if (this.bountyHasNext && last) {
          this.bountyCursors[this.bountyPage - 1] = last.id;
        }
        this.loadingBounties = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load bounties:', err);
      this.ngZone.run(() => {
        this.loadingBounties = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async loadSubmissions(bountyId: number) {
    this.loadingSubmissions = true;
    this.cdr.markForCheck();
    try {
      const raw = await this.bountyService.listSubmissions(
        this.contractAddress,
        bountyId,
      );
      this.submissions = raw.map(parseSubmission);
    } catch (err) {
      console.error('Failed to load submissions:', err);
      this.submissions = [];
    } finally {
      this.loadingSubmissions = false;
      this.cdr.detectChanges();
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
