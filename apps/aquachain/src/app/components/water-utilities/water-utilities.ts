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
  FootprintCertificate,
  formatLogTime,
  parseCompany,
  ParsedCompany,
  UsageLog,
  WaterFootprintService,
} from '@services/water-footprint/water-footprint';
import { ModuleShell } from '../module-shell/module-shell';
import { WalletBanner } from '../shared/wallet-banner/wallet-banner';

@Component({
  selector: 'water-utilities',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleShell,
    WalletBanner,
  ],
  templateUrl: './water-utilities.html',
  styleUrl: './water-utilities.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WaterUtilities implements OnInit {
  footprintContractAddress = environment.UtilityWaterFootprintContractAddress;
  walletAddress = '';
  walletWarning = false;
  missingContract = false;
  busyAction = false;

  companies: ParsedCompany[] = [];
  selected: ParsedCompany | null = null;
  loadingCompanies = false;
  companyPage = 1;
  companyCursors: number[] = [];
  companyHasNext = false;

  logs: UsageLog[] = [];
  loadingLogs = false;
  logPage = 1;
  logCursors: number[] = [];
  logHasNext = false;

  certificates: FootprintCertificate[] = [];
  loadingCerts = false;
  certPage = 1;
  certCursors: number[] = [];
  certHasNext = false;
  selectedCert: FootprintCertificate | null = null;

  registerForm!: FormGroup;
  logForm!: FormGroup;
  issuePeriod = '';
  verifierAddress = '';
  amVerifier = false;

  readonly pageSize = pageSize;
  readonly canGoPrev = canGoPrev;
  readonly formatLogTime = formatLogTime;

  private readonly walletService = inject(WalletService);
  private readonly footprint = inject(WaterFootprintService);
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
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      sector: [''],
      region: [''],
      notes: [''],
    });
    this.logForm = this.fb.group({
      period: ['', Validators.required],
      usage: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      savings: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.window?.keplr) {
      this.walletWarning = true;
    }
    this.missingContract = !this.footprintContractAddress;
    if (!this.missingContract) {
      void this.loadCompanies();
    }
  }

  canGoNextPage(hasNext: boolean): boolean {
    return hasNext;
  }

  async selectCompany(company: ParsedCompany) {
    this.selected = company;
    this.logPage = 1;
    this.logCursors = [];
    this.certPage = 1;
    this.certCursors = [];
    this.selectedCert = null;
    this.issuePeriod = '';
    try {
      const fresh = await this.footprint.getCompany(
        this.footprintContractAddress,
        company.id,
      );
      this.selected = parseCompany(fresh);
    } catch (err) {
      console.error('Failed to refresh company:', err);
    }
    await Promise.all([this.loadLogs(), this.loadCertificates()]);
    if (this.walletAddress) {
      await this.refreshVerifierFlag();
    }
  }

  nextCompanies() {
    if (!this.companyHasNext) {
      return;
    }
    this.companyPage++;
    void this.loadCompanies();
  }

  prevCompanies() {
    if (!canGoPrev(this.companyPage)) {
      return;
    }
    this.companyPage--;
    void this.loadCompanies();
  }

  nextLogs() {
    if (!this.logHasNext) {
      return;
    }
    this.logPage++;
    void this.loadLogs();
  }

  prevLogs() {
    if (!canGoPrev(this.logPage)) {
      return;
    }
    this.logPage--;
    void this.loadLogs();
  }

  nextCerts() {
    if (!this.certHasNext) {
      return;
    }
    this.certPage++;
    void this.loadCertificates();
  }

  prevCerts() {
    if (!canGoPrev(this.certPage)) {
      return;
    }
    this.certPage--;
    void this.loadCertificates();
  }

  async onRegisterCompany() {
    if (this.registerForm.invalid || this.busyAction) {
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

    const value = this.registerForm.value;
    this.busyAction = true;
    try {
      const result = await this.footprint.registerCompany(
        this.walletAddress,
        this.footprintContractAddress,
        String(value.name),
        {
          sector: String(value.sector ?? ''),
          region: String(value.region ?? ''),
          notes: String(value.notes ?? ''),
          created_at: new Date().toISOString(),
        },
      );
      if (result) {
        this.toastr.showSuccess(result, 'Company Registered');
        this.registerForm.reset();
        this.companyPage = 1;
        this.companyCursors = [];
        await this.loadCompanies();
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Register Failed',
      );
    } finally {
      this.busyAction = false;
    }
  }

  async onLogUsage() {
    if (!this.selected || this.logForm.invalid || this.busyAction) {
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

    const value = this.logForm.value;
    this.busyAction = true;
    try {
      const result = await this.footprint.logUsage(
        this.walletAddress,
        this.footprintContractAddress,
        this.selected.id,
        String(value.period),
        String(value.usage),
        String(value.savings),
      );
      if (result) {
        this.toastr.showSuccess(result, 'Usage Logged');
        this.logForm.reset();
        this.logPage = 1;
        this.logCursors = [];
        await this.loadLogs();
      }
    } catch (err: unknown) {
      this.toastr.showError(
        err instanceof Error ? err.message : String(err),
        'Log Failed',
      );
    } finally {
      this.busyAction = false;
    }
  }

  async onValidateLog(log: UsageLog) {
    await this.runAction(
      () =>
        this.footprint.validateLog(
          this.walletAddress,
          this.footprintContractAddress,
          log.id,
        ),
      'Log Validated',
      'Validate Failed',
      async () => this.loadLogs(),
    );
  }

  async onIssueCertificate() {
    if (!this.selected || !this.issuePeriod.trim()) {
      this.toastr.showError('Enter a period to certify.', 'Missing Period');
      return;
    }
    const period = this.issuePeriod.trim();
    await this.runAction(
      () =>
        this.footprint.issueCertificate(
          this.walletAddress,
          this.footprintContractAddress,
          this.selected!.id,
          period,
        ),
      'Certificate Issued',
      'Issue Failed',
      async () => {
        this.certPage = 1;
        this.certCursors = [];
        await this.loadCertificates();
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
        this.footprint.addVerifier(
          this.walletAddress,
          this.footprintContractAddress,
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
        this.footprint.removeVerifier(
          this.walletAddress,
          this.footprintContractAddress,
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

  selectCertificate(cert: FootprintCertificate) {
    this.selectedCert = cert;
  }

  truncate(text: string | undefined | null, max = 24): string {
    if (!text) {
      return '—';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadCompanies() {
    this.loadingCompanies = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.companyPage > 1
          ? this.companyCursors[this.companyPage - 2]
          : undefined;
      const raw = await this.footprint.listCompanies(
        this.footprintContractAddress,
        start_after,
        this.pageSize,
      );
      const companies = raw.map(parseCompany);
      this.ngZone.run(() => {
        this.companies = companies;
        this.companyHasNext = companies.length === this.pageSize;
        const last = companies[companies.length - 1];
        if (this.companyHasNext && last) {
          this.companyCursors[this.companyPage - 1] = last.id;
        }
        this.loadingCompanies = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load companies:', err);
      this.ngZone.run(() => {
        this.loadingCompanies = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async loadLogs() {
    if (!this.selected) {
      this.logs = [];
      return;
    }
    this.loadingLogs = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.logPage > 1 ? this.logCursors[this.logPage - 2] : undefined;
      const logs = await this.footprint.listLogs(
        this.footprintContractAddress,
        this.selected.id,
        start_after,
        this.pageSize,
      );
      this.ngZone.run(() => {
        this.logs = logs;
        this.logHasNext = logs.length === this.pageSize;
        const last = logs[logs.length - 1];
        if (this.logHasNext && last) {
          this.logCursors[this.logPage - 1] = last.id;
        }
        this.loadingLogs = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load logs:', err);
      this.ngZone.run(() => {
        this.loadingLogs = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async loadCertificates() {
    if (!this.selected) {
      this.certificates = [];
      return;
    }
    this.loadingCerts = true;
    this.cdr.markForCheck();
    try {
      const start_after =
        this.certPage > 1 ? this.certCursors[this.certPage - 2] : undefined;
      const certificates = await this.footprint.listCertificates(
        this.footprintContractAddress,
        this.selected.id,
        start_after,
        this.pageSize,
      );
      this.ngZone.run(() => {
        this.certificates = certificates;
        this.certHasNext = certificates.length === this.pageSize;
        const last = certificates[certificates.length - 1];
        if (this.certHasNext && last) {
          this.certCursors[this.certPage - 1] = last.id;
        }
        this.loadingCerts = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load certificates:', err);
      this.ngZone.run(() => {
        this.loadingCerts = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async refreshVerifierFlag() {
    if (!this.walletAddress || !this.footprintContractAddress) {
      this.amVerifier = false;
      return;
    }
    try {
      this.amVerifier = await this.footprint.isVerifier(
        this.footprintContractAddress,
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
    await this.refreshVerifierFlag();
    return address;
  }
}
