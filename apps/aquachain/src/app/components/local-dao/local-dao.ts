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
  canExecute,
  isVotingOpen,
  LocalDaoService,
  parseProposal,
  ParsedProposal,
  proposalStatusLabel,
  voteCount,
  VoteChoice,
} from '@services/local-dao/local-dao';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

@Component({
  selector: 'local-dao',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './local-dao.html',
  styleUrl: './local-dao.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LocalDao implements OnInit {
  contractAddress = environment.LocalDaoContractAddress;
  walletAddress = '';
  walletWarning = false;
  missingContract = false;
  busyAction = false;
  walletVote: VoteChoice | null = null;

  proposals: ParsedProposal[] = [];
  selected: ParsedProposal | null = null;
  loadingProposals = false;
  proposalPage = 1;
  proposalCursors: number[] = [];
  proposalHasNext = false;

  createForm!: FormGroup;

  readonly pageSize = pageSize;
  readonly canGoPrev = canGoPrev;
  readonly environment = environment;
  readonly proposalStatusLabel = proposalStatusLabel;
  readonly voteCount = voteCount;

  private readonly walletService = inject(WalletService);
  private readonly dao = inject(LocalDaoService);
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
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      action_tag: ['', Validators.required],
      location: ['', Validators.required],
      summary: [''],
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.window?.keplr) {
      this.walletWarning = true;
    }
    this.missingContract = !this.contractAddress;
    if (!this.missingContract) {
      void this.loadProposals();
    }
  }

  canGoNextPage(hasNext: boolean): boolean {
    return hasNext;
  }

  votingOpen(proposal: ParsedProposal): boolean {
    return isVotingOpen(proposal, Math.floor(Date.now() / 1000));
  }

  readyToExecute(proposal: ParsedProposal): boolean {
    return canExecute(proposal, Math.floor(Date.now() / 1000));
  }

  formatEnd(votingEnd: number | string): string {
    const ts = Number(votingEnd);
    if (!Number.isFinite(ts)) {
      return '—';
    }
    return new Date(ts * 1000).toLocaleString();
  }

  async selectProposal(proposal: ParsedProposal) {
    this.selected = proposal;
    this.walletVote = null;
    try {
      const fresh = await this.dao.getProposal(this.contractAddress, proposal.id);
      this.selected = parseProposal(fresh);
      if (this.walletAddress) {
        await this.refreshWalletVote();
      }
    } catch (err) {
      console.error('Failed to refresh proposal:', err);
    }
    this.cdr.detectChanges();
  }

  nextProposals() {
    if (!this.proposalHasNext) {
      return;
    }
    this.proposalPage++;
    void this.loadProposals();
  }

  prevProposals() {
    if (!canGoPrev(this.proposalPage)) {
      return;
    }
    this.proposalPage--;
    void this.loadProposals();
  }

  async onCreateProposal() {
    if (this.createForm.invalid || this.busyAction) {
      return;
    }
    const value = this.createForm.value;
    await this.runAction(
      () =>
        this.dao.createProposal(
          this.walletAddress,
          this.contractAddress,
          String(value.title),
          String(value.description),
          String(value.action_tag),
          {
            location: String(value.location),
            summary: String(value.summary ?? ''),
          },
        ),
      'Proposal Created',
      'Create Failed',
      async () => {
        this.createForm.reset();
        this.proposalPage = 1;
        this.proposalCursors = [];
        await this.loadProposals();
      },
    );
  }

  async onVote(choice: VoteChoice) {
    if (!this.selected) {
      return;
    }
    await this.runAction(
      () =>
        this.dao.vote(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
          choice,
        ),
      'Vote Recorded',
      'Vote Failed',
      async () => {
        await this.loadProposals();
        await this.selectProposal(this.selected!);
      },
    );
  }

  async onExecuteSelected() {
    if (!this.selected) {
      return;
    }
    await this.runAction(
      () =>
        this.dao.executeProposal(
          this.walletAddress,
          this.contractAddress,
          this.selected!.id,
        ),
      'Proposal Finalized',
      'Execute Failed',
      async () => {
        await this.loadProposals();
        await this.selectProposal(this.selected!);
      },
    );
  }

  truncate(text: string | undefined | null, max = 28): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadProposals() {
    this.loadingProposals = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.proposalPage > 1
          ? this.proposalCursors[this.proposalPage - 2]
          : undefined;
      const raw = await this.dao.listProposals(
        this.contractAddress,
        start_after,
        this.pageSize,
      );
      this.ngZone.run(() => {
        this.proposals = raw.map(parseProposal);
        this.proposalHasNext = raw.length === this.pageSize;
        const last = raw[raw.length - 1];
        if (this.proposalHasNext && last) {
          this.proposalCursors[this.proposalPage - 1] = last.id;
        }
        this.loadingProposals = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load proposals:', err);
      this.ngZone.run(() => {
        this.loadingProposals = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async refreshWalletVote() {
    if (!this.walletAddress || !this.selected) {
      this.walletVote = null;
      return;
    }
    try {
      const record = await this.dao.getVote(
        this.contractAddress,
        this.selected.id,
        this.walletAddress,
      );
      const vote = record.vote;
      if (typeof vote === 'object' && vote !== null && !Array.isArray(vote)) {
        if ('yes' in vote) {
          this.walletVote = 'yes';
        } else if ('no' in vote) {
          this.walletVote = 'no';
        } else {
          this.walletVote = 'abstain';
        }
      } else {
        this.walletVote = null;
      }
    } catch {
      this.walletVote = null;
    }
    this.cdr.detectChanges();
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
