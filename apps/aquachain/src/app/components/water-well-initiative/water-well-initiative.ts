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
import {
  canGoNext,
  canGoPrev,
  totalPages as computeTotalPages,
} from '../../utils/pagination';
import {
  parseWellProject,
  ParsedWellProject,
  projectProgressPercent,
  ProjectStatus,
  ProjectStatusCounts,
  statusBadgeClass,
  sumStatusCounts,
  WaterWellService,
} from '@services/water-well/water-well';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

const STATUS_FILTERS: Array<{ value: '' | ProjectStatus; label: string }> = [
  { value: '', label: 'All' },
  { value: 'proposed', label: 'Proposed' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'funded', label: 'Funded' },
  { value: 'disbursable', label: 'Disbursable' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

@Component({
  selector: 'water-well-initiative',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './water-well-initiative.html',
  styleUrl: './water-well-initiative.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WaterWellInitiative implements OnInit {
  waterWellContractAddress = environment.WaterWellContractAddress;
  coinMinimalDenom = environment.coinMinimalDenom;
  coinDenom = environment.coinDenom;
  walletAddress = '';
  walletWarning = false;
  missingContract = false;

  loadingProjects = false;
  busyAction = false;
  projects: ParsedWellProject[] = [];
  selected: ParsedWellProject | null = null;
  statusCounts: ProjectStatusCounts = {};
  statusFilters = STATUS_FILTERS;
  statusFilter: '' | ProjectStatus = '';

  currentPage = 1;
  pageSize = pageSize;
  totalProjects = 0;
  totalPages = 1;
  pageCursors: number[] = [];

  donateAmount = '';
  createForm!: FormGroup;

  readonly canGoNext = canGoNext;
  readonly canGoPrev = canGoPrev;
  readonly statusBadgeClass = statusBadgeClass;
  readonly projectProgressPercent = projectProgressPercent;

  private readonly walletService = inject(WalletService);
  private readonly waterWell = inject(WaterWellService);
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
      location: ['', Validators.required],
      description: ['', Validators.required],
      goal: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.window?.keplr) {
      this.walletWarning = true;
    }
    this.missingContract = !this.waterWellContractAddress;
    if (!this.missingContract) {
      void this.refreshAll();
    }
  }

  async refreshAll() {
    await Promise.all([this.loadStatusCounts(), this.loadProjects()]);
  }

  async setStatusFilter(value: '' | ProjectStatus) {
    this.statusFilter = value;
    this.pageCursors = [];
    this.currentPage = 1;
    this.selected = null;
    await this.loadProjects();
  }

  async selectProject(project: ParsedWellProject) {
    this.selected = project;
    this.donateAmount = '';
    try {
      const fresh = await this.waterWell.getProject(
        this.waterWellContractAddress,
        project.id,
      );
      this.selected = parseWellProject(fresh);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to refresh project:', err);
    }
  }

  nextPage() {
    if (!canGoNext(this.currentPage, this.totalPages)) {
      return;
    }
    this.currentPage++;
    void this.loadProjects();
  }

  prevPage() {
    if (!canGoPrev(this.currentPage)) {
      return;
    }
    this.currentPage--;
    void this.loadProjects();
  }

  async onCreateProject() {
    if (this.createForm.invalid || this.busyAction) {
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

    const value = this.createForm.value;
    const data = {
      title: String(value.title),
      location: String(value.location),
      description: String(value.description),
      created_at: new Date().toISOString(),
    };

    this.busyAction = true;
    try {
      const result = await this.waterWell.createProject(
        this.walletAddress,
        this.waterWellContractAddress,
        String(value.goal),
        data,
      );
      if (result) {
        this.toastr.showSuccess(result, 'Project Created');
        this.createForm.reset();
        this.pageCursors = [];
        this.currentPage = 1;
        await this.refreshAll();
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Create Failed',
      );
    } finally {
      this.busyAction = false;
    }
  }

  async onValidate() {
    await this.runProjectAction(
      'validate',
      'Project Validated',
      'Validate Failed',
    );
  }

  async onUnlock() {
    await this.runProjectAction('unlock', 'Project Unlocked', 'Unlock Failed');
  }

  async onCancel() {
    await this.runProjectAction('cancel', 'Project Cancelled', 'Cancel Failed');
  }

  async onDisburse() {
    await this.runProjectAction(
      'disburse',
      'Funds Disbursed',
      'Disburse Failed',
    );
  }

  async onRefund() {
    await this.runProjectAction('refund', 'Donation Refunded', 'Refund Failed');
  }

  async onDonate() {
    if (!this.selected || this.busyAction) {
      return;
    }
    const amount = String(this.donateAmount).trim();
    if (!/^[1-9]\d*$/.test(amount)) {
      this.toastr.showError(
        'Enter a positive integer amount in the chain minimal denom.',
        'Invalid Amount',
      );
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
      const result = await this.waterWell.donate(
        this.walletAddress,
        this.waterWellContractAddress,
        this.selected.id,
        [{ denom: this.coinMinimalDenom, amount }],
      );
      if (result) {
        this.toastr.showSuccess(result, 'Donation Sent');
        this.donateAmount = '';
        await this.refreshSelectedAndList();
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Donate Failed',
      );
    } finally {
      this.busyAction = false;
    }
  }

  statusLabel(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  truncate(text: string | undefined | null, max = 24): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadStatusCounts() {
    try {
      const counts = await this.waterWell.getProjectStatusCounts(
        this.waterWellContractAddress,
      );
      this.ngZone.run(() => {
        this.statusCounts = counts ?? {};
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load status counts:', err);
    }
  }

  private async loadProjects() {
    this.loadingProjects = true;
    this.cdr.markForCheck();
    try {
      await this.loadStatusCounts();
      const total = this.statusFilter
        ? Number(this.statusCounts[this.statusFilter] ?? 0)
        : sumStatusCounts(this.statusCounts);
      this.totalProjects = total;
      this.totalPages = computeTotalPages(total, this.pageSize);

      const start_after =
        this.currentPage > 1
          ? this.pageCursors[this.currentPage - 2]
          : undefined;

      const raw = this.statusFilter
        ? await this.waterWell.getProjectsByStatus(
            this.waterWellContractAddress,
            this.statusFilter,
            start_after,
            this.pageSize,
          )
        : await this.waterWell.listProjects(
            this.waterWellContractAddress,
            start_after,
            this.pageSize,
          );

      const projects = raw.map(parseWellProject);

      this.ngZone.run(() => {
        this.projects = projects;
        const last = projects[projects.length - 1];
        if (projects.length === this.pageSize && last) {
          this.pageCursors[this.currentPage - 1] = last.id;
        }
        if (
          this.selected &&
          !projects.some((p) => p.id === this.selected?.id)
        ) {
          // keep selected detail even if not on this page
        }
        this.loadingProjects = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load projects:', err);
      this.ngZone.run(() => {
        this.loadingProjects = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async refreshSelectedAndList() {
    await this.refreshAll();
    if (this.selected) {
      await this.selectProject(this.selected);
    }
  }

  private async runProjectAction(
    action: 'validate' | 'unlock' | 'cancel' | 'disburse' | 'refund',
    successTitle: string,
    errorTitle: string,
  ) {
    if (!this.selected || this.busyAction) {
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
      const id = this.selected.id;
      const result =
        action === 'validate'
          ? await this.waterWell.validate(
              this.walletAddress,
              this.waterWellContractAddress,
              id,
            )
          : action === 'unlock'
            ? await this.waterWell.unlock(
                this.walletAddress,
                this.waterWellContractAddress,
                id,
              )
            : action === 'cancel'
              ? await this.waterWell.cancel(
                  this.walletAddress,
                  this.waterWellContractAddress,
                  id,
                )
              : action === 'disburse'
                ? await this.waterWell.disburse(
                    this.walletAddress,
                    this.waterWellContractAddress,
                    id,
                  )
                : await this.waterWell.refund(
                    this.walletAddress,
                    this.waterWellContractAddress,
                    id,
                  );

      if (result) {
        this.toastr.showSuccess(result, successTitle);
        await this.refreshSelectedAndList();
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
