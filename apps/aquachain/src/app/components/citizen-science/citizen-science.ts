import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  faGaugeHigh,
  faMapLocationDot,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { WalletService } from '@services/wallet/wallet';
import { environment } from '@env/environment';
import {
  ContractService,
  pageSize,
  ParsedDataEntry,
  ParsedSensor,
  SensorSubmission,
} from '@services/contract/contract';
import { ToastrService } from '@services/toastr/toastr';
import {
  canGoNext,
  canGoPrev,
  totalPages as computeTotalPages,
} from '../../utils/pagination';
import {
  parseDataEntry,
  parseSensor,
  sensorCoords,
  statusClass,
} from '../../utils/sensor-parse';
import type { Map as LeafletMap, CircleMarker } from 'leaflet';

const MAP_MAX_PAGES = 5;

@Component({
  selector: 'citizen-science',
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './citizen-science.html',
  styleUrl: './citizen-science.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CitizenScience implements OnInit, OnDestroy {
  activeTab = 1;
  loadingRegisterSensor = false;
  loadingSubmitData = false;
  sensorForm!: FormGroup;
  submitDataForm!: FormGroup;
  walletAddress = '';
  citizenScienceContractAddress = environment.CitizenScienceContractAddress;
  walletWarning!: boolean;

  mode: 'register' | 'submit' | 'view' | null = 'register';

  tabs = [
    { label: 'Dashboard', icon: faGaugeHigh },
    { label: 'Sensors', icon: faGaugeHigh },
    { label: 'Map View', icon: faMapLocationDot },
    { label: 'Rewards', icon: faCoins },
  ];

  sensors: ParsedSensor[] = [];
  dataEntries: ParsedDataEntry[] = [];
  loadingSensors = false;
  loadingViewEntries = false;
  showOnlyMine = false;
  currentPage = 1;
  pageSize = pageSize;
  totalSensors = 0;
  totalPages = 1;
  pageCursors: number[] = [];

  viewEntriesPage = 1;
  viewEntriesTotal = 0;
  viewEntriesTotalPages = 1;
  viewEntriesCursors: number[] = [];

  loadingDashboard = false;
  dashboardActive = 0;
  dashboardInactive = 0;
  dashboardProposed = 0;
  dashboardTotal = 0;
  dashboardRecentSensors: ParsedSensor[] = [];
  dashboardRecentEntries: ParsedDataEntry[] = [];
  dashboardUnverified = 0;

  mapSensors: ParsedSensor[] = [];
  mapSelected: ParsedSensor | null = null;
  loadingMap = false;
  mapMarkerCount = 0;

  rewardEntries: ParsedDataEntry[] = [];
  loadingRewards = false;
  rewardsPage = 1;
  rewardsTotal = 0;
  rewardsTotalPages = 1;
  rewardsCursors: number[] = [];

  selectedSensor: ParsedSensor | null = null;
  @ViewChild('formHeaderRef') formHeaderRef!: ElementRef;
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  readonly canGoNext = canGoNext;
  readonly canGoPrev = canGoPrev;
  readonly statusClass = statusClass;

  private map: LeafletMap | null = null;
  private markers: CircleMarker[] = [];

  private walletService = inject(WalletService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private contractService = inject(ContractService);
  private toastrService = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private document = inject(DOCUMENT);
  private window = this.document.defaultView as
    | (Window &
        typeof globalThis & {
          keplr?: unknown;
          getOfflineSigner?: unknown;
        })
    | null;

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof this.window === 'undefined' || !this.window?.keplr) {
        this.walletWarning = true;
      }
    }

    this.sensorForm = this.fb.group({
      type: ['', Validators.required],
      model: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.submitDataForm = this.fb.group({
      value: ['', Validators.required],
    });

    if (isPlatformBrowser(this.platformId)) {
      await this.loadSensors();
    }
  }

  ngOnDestroy() {
    this.destroyMap();
  }

  async setActiveTab(index: number) {
    this.activeTab = index;
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (index !== 2) {
      this.destroyMap();
    }
    if (index === 0) {
      await this.loadDashboard();
    } else if (index === 1) {
      await this.loadSensors();
    } else if (index === 2) {
      await this.loadMapSensors();
      setTimeout(() => this.initMap(), 0);
    } else if (index === 3) {
      await this.loadRewards();
    }
  }

  setRegisterNewSensor() {
    this.mode = 'register';
    this.scrollToFormHeaderRef();
  }

  setSubmitData(sensor: ParsedSensor) {
    this.selectedSensor = sensor;
    this.mode = 'submit';
    this.scrollToFormHeaderRef();
  }

  setView(sensor: ParsedSensor) {
    this.selectedSensor = sensor;
    this.viewEntriesPage = 1;
    this.viewEntriesCursors = [];
    this.mode = 'view';
    void this.loadDataEntries(sensor.id);
    this.scrollToFormHeaderRef();
  }

  selectMapSensor(sensor: ParsedSensor) {
    this.mapSelected = sensor;
    this.cdr.detectChanges();
  }

  openMapSensorInSensors() {
    if (!this.mapSelected) {
      return;
    }
    const sensor = this.mapSelected;
    void this.setActiveTab(1).then(() => this.setView(sensor));
  }

  async toggleSensorView() {
    this.showOnlyMine = !this.showOnlyMine;
    if (this.showOnlyMine) {
      try {
        await this.ensureWallet();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.toastrService.showError(message, 'Wallet Connection Failed');
        this.showOnlyMine = false;
        return;
      }
    }
    this.pageCursors = [];
    this.currentPage = 1;
    await this.loadSensors();
  }

  async activate(sensor: ParsedSensor) {
    await this.runSensorExec(
      sensor,
      'activate',
      'activate sensor',
      'Sensor Activated',
      'Activation Failed',
    );
  }

  async deactivate(sensor: ParsedSensor) {
    await this.runSensorExec(
      sensor,
      'deactivate',
      'deactivate sensor',
      'Sensor Deactivated',
      'Deactivation Failed',
    );
  }

  async deleteSensor(sensor: ParsedSensor) {
    await this.runSensorExec(
      sensor,
      'delete',
      'delete sensor',
      'Sensor Deleted',
      'Deletion Failed',
    );
  }

  async connectWallet(): Promise<string> {
    const address = await this.walletService.connectWallet();
    this.walletAddress = address;
    return address;
  }

  async onRegisterSensor() {
    if (this.sensorForm.invalid) return;

    try {
      await this.ensureWallet();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(message, 'Wallet Connection Failed');
      return;
    }

    const value = this.sensorForm.value;
    const sensorJson: SensorSubmission = {
      type: value.type,
      model: value.model,
      location: {
        lat: String(value.latitude),
        lng: String(value.longitude),
        description: value.description,
      },
    };

    this.loadingRegisterSensor = true;
    try {
      const msg = { submit_sensor: { data: sensorJson } };
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        'submit sensor',
      );

      if (result) {
        await this.loadSensors();
        this.toastrService.showSuccess(result, 'Transaction Confirmed');
      }
    } catch (err: unknown) {
      console.error('Error submitting sensor:', err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, 'Transaction Failed');
    } finally {
      this.loadingRegisterSensor = false;
    }
  }

  async onSubmitSensorData() {
    if (this.submitDataForm.invalid || !this.selectedSensor) return;

    try {
      await this.ensureWallet();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(message, 'Wallet Connection Failed');
      return;
    }

    const value = this.submitDataForm.value.value;

    const msg = {
      submit_data: {
        sensor_id: this.selectedSensor.id,
        data: {
          value: String(value),
        },
      },
    };

    this.loadingSubmitData = true;
    try {
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        'submit data',
      );

      if (result) {
        this.toastrService.showSuccess(result, 'Sensor Data Submitted');
      }
    } catch (err: unknown) {
      console.error('Error submitting sensor data:', err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, 'Submission Failed');
    } finally {
      this.loadingSubmitData = false;
    }
  }

  async loadSensors(): Promise<void> {
    this.loadingSensors = true;
    this.cdr.markForCheck();
    try {
      await this.loadTotalSensors();

      const start_after =
        this.currentPage > 1
          ? this.pageCursors[this.currentPage - 2]
          : undefined;

      const rawSensors = await this.contractService.listSensors(
        this.citizenScienceContractAddress,
        this.showOnlyMine ? this.walletAddress : undefined,
        undefined,
        start_after,
        this.pageSize,
      );

      const sensors = rawSensors
        .map(parseSensor)
        .filter((s): s is ParsedSensor => s !== null);

      this.ngZone.run(() => {
        this.sensors = sensors;
        const lastSensor = this.sensors[this.sensors.length - 1];
        if (this.sensors.length === this.pageSize && lastSensor) {
          this.pageCursors[this.currentPage - 1] = lastSensor.id;
        }
        this.loadingSensors = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load sensors:', err);
      this.ngZone.run(() => {
        this.loadingSensors = false;
        this.cdr.detectChanges();
      });
    }
  }

  nextPage(): void {
    if (!canGoNext(this.currentPage, this.totalPages)) {
      return;
    }
    this.currentPage++;
    this.loadSensors();
  }

  prevPage(): void {
    if (!canGoPrev(this.currentPage)) {
      return;
    }
    this.currentPage--;
    this.loadSensors();
  }

  nextRewardsPage(): void {
    if (!canGoNext(this.rewardsPage, this.rewardsTotalPages)) {
      return;
    }
    this.rewardsPage++;
    this.loadRewards();
  }

  prevRewardsPage(): void {
    if (!canGoPrev(this.rewardsPage)) {
      return;
    }
    this.rewardsPage--;
    this.loadRewards();
  }

  nextViewEntriesPage(): void {
    if (!canGoNext(this.viewEntriesPage, this.viewEntriesTotalPages)) {
      return;
    }
    this.viewEntriesPage++;
    if (this.selectedSensor) {
      void this.loadDataEntries(this.selectedSensor.id);
    }
  }

  prevViewEntriesPage(): void {
    if (!canGoPrev(this.viewEntriesPage)) {
      return;
    }
    this.viewEntriesPage--;
    if (this.selectedSensor) {
      void this.loadDataEntries(this.selectedSensor.id);
    }
  }

  async loadDataEntries(sensorId?: number, submitter?: string): Promise<void> {
    this.loadingViewEntries = true;
    this.cdr.markForCheck();
    try {
      const total = await this.contractService.countDataEntries(
        this.citizenScienceContractAddress,
        {
          sensor_id: sensorId,
          submitter,
        },
      );
      const start_after =
        this.viewEntriesPage > 1
          ? this.viewEntriesCursors[this.viewEntriesPage - 2]
          : undefined;

      const rawDataEntries = await this.contractService.listDataEntries(
        this.citizenScienceContractAddress,
        {
          sensor_id: sensorId,
          submitter,
          start_after,
          limit: this.pageSize,
        },
      );

      const dataEntries = rawDataEntries
        .map(parseDataEntry)
        .filter((entry): entry is ParsedDataEntry => entry !== null);

      this.ngZone.run(() => {
        this.viewEntriesTotal = total;
        this.viewEntriesTotalPages = computeTotalPages(total, this.pageSize);
        this.dataEntries = dataEntries;
        const last = dataEntries[dataEntries.length - 1];
        if (dataEntries.length === this.pageSize && last) {
          this.viewEntriesCursors[this.viewEntriesPage - 1] = last.id;
        }
        this.loadingViewEntries = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load data entries:', err);
      this.ngZone.run(() => {
        this.loadingViewEntries = false;
        this.cdr.detectChanges();
      });
    }
  }

  truncate(text: string | undefined | null, max = 20): string {
    if (!text) return '—';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  private async loadDashboard(): Promise<void> {
    this.loadingDashboard = true;
    this.cdr.markForCheck();
    try {
      const addr = this.citizenScienceContractAddress;
      const [total, active, inactive, proposed, recentRaw, entriesRaw] =
        await Promise.all([
          this.contractService.getTotalSensors(addr),
          this.contractService.getTotalSensors(addr, undefined, 'active'),
          this.contractService.getTotalSensors(addr, undefined, 'inactive'),
          this.contractService.getTotalSensors(addr, undefined, 'proposed'),
          this.contractService.listSensors(
            addr,
            undefined,
            undefined,
            undefined,
            this.pageSize,
          ),
          this.contractService.listDataEntries(addr, { limit: this.pageSize }),
        ]);

      const recentSensors = recentRaw
        .map(parseSensor)
        .filter((s): s is ParsedSensor => s !== null);
      const recentEntries = entriesRaw
        .map(parseDataEntry)
        .filter((e): e is ParsedDataEntry => e !== null);

      this.ngZone.run(() => {
        this.dashboardTotal = total;
        this.dashboardActive = active;
        this.dashboardInactive = inactive;
        this.dashboardProposed = proposed;
        this.dashboardRecentSensors = recentSensors;
        this.dashboardRecentEntries = recentEntries;
        this.dashboardUnverified = recentEntries.filter(
          (e) => !e.verified,
        ).length;
        this.loadingDashboard = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      this.ngZone.run(() => {
        this.loadingDashboard = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async loadMapSensors(): Promise<void> {
    this.loadingMap = true;
    this.mapSelected = null;
    this.cdr.markForCheck();
    try {
      const collected: ParsedSensor[] = [];
      let start_after: number | undefined;
      for (let page = 0; page < MAP_MAX_PAGES; page++) {
        const raw = await this.contractService.listSensors(
          this.citizenScienceContractAddress,
          undefined,
          undefined,
          start_after,
          this.pageSize,
        );
        if (raw.length === 0) {
          break;
        }
        for (const sensor of raw) {
          const parsed = parseSensor(sensor);
          if (parsed) {
            collected.push(parsed);
          }
        }
        const last = raw[raw.length - 1];
        start_after = last?.id;
        if (raw.length < this.pageSize) {
          break;
        }
      }

      this.ngZone.run(() => {
        this.mapSensors = collected;
        this.mapMarkerCount = collected.filter((s) => sensorCoords(s)).length;
        this.loadingMap = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load map sensors:', err);
      this.ngZone.run(() => {
        this.loadingMap = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async loadRewards(): Promise<void> {
    this.loadingRewards = true;
    this.cdr.markForCheck();
    try {
      const total = await this.contractService.countDataEntries(
        this.citizenScienceContractAddress,
      );
      const start_after =
        this.rewardsPage > 1
          ? this.rewardsCursors[this.rewardsPage - 2]
          : undefined;

      const raw = await this.contractService.listDataEntries(
        this.citizenScienceContractAddress,
        { start_after, limit: this.pageSize },
      );
      const entries = raw
        .map(parseDataEntry)
        .filter((e): e is ParsedDataEntry => e !== null);

      this.ngZone.run(() => {
        this.rewardsTotal = total;
        this.rewardsTotalPages = computeTotalPages(total, this.pageSize);
        this.rewardEntries = entries;
        const last = entries[entries.length - 1];
        if (entries.length === this.pageSize && last) {
          this.rewardsCursors[this.rewardsPage - 1] = last.id;
        }
        this.loadingRewards = false;
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Failed to load rewards:', err);
      this.ngZone.run(() => {
        this.loadingRewards = false;
        this.cdr.detectChanges();
      });
    }
  }

  private async loadTotalSensors(): Promise<void> {
    try {
      const total = await this.contractService.getTotalSensors(
        this.citizenScienceContractAddress,
        this.showOnlyMine ? this.walletAddress : undefined,
      );
      this.ngZone.run(() => {
        this.totalSensors = total;
        this.totalPages = computeTotalPages(total, this.pageSize);
      });
    } catch (err) {
      console.error('Failed to load total sensors count:', err);
      this.ngZone.run(() => {
        this.totalSensors = 0;
        this.totalPages = 1;
      });
    }
  }

  private async initMap(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.mapContainer) {
      return;
    }
    this.destroyMap();
    const L = await import('leaflet');
    const el = this.mapContainer.nativeElement;
    const withCoords = this.mapSensors
      .map((s) => ({ sensor: s, coords: sensorCoords(s) }))
      .filter(
        (
          row,
        ): row is {
          sensor: ParsedSensor;
          coords: { lat: number; lng: number };
        } => row.coords !== null,
      );

    this.map = L.map(el).setView(
      withCoords.length > 0
        ? [withCoords[0].coords.lat, withCoords[0].coords.lng]
        : [20, 0],
      withCoords.length > 0 ? 4 : 2,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);

    this.markers = [];
    for (const { sensor, coords } of withCoords) {
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: 8,
        color: '#0d6efd',
        fillColor: '#0d6efd',
        fillOpacity: 0.75,
        weight: 2,
      }).addTo(this.map);
      marker.bindTooltip(`#${sensor.id} ${sensor.type ?? ''}`);
      marker.on('click', () => {
        this.ngZone.run(() => this.selectMapSensor(sensor));
      });
      this.markers.push(marker);
    }

    if (withCoords.length > 1) {
      const bounds = L.latLngBounds(
        withCoords.map(
          (row) => [row.coords.lat, row.coords.lng] as [number, number],
        ),
      );
      this.map.fitBounds(bounds, { padding: [24, 24] });
    }

    setTimeout(() => this.map?.invalidateSize(), 50);
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }

  private async ensureWallet(): Promise<string> {
    if (this.walletAddress) {
      return this.walletAddress;
    }
    return this.connectWallet();
  }

  private async runSensorExec(
    sensor: ParsedSensor,
    action: 'activate' | 'deactivate' | 'delete',
    memo: string,
    successTitle: string,
    errorTitle: string,
  ): Promise<void> {
    try {
      await this.ensureWallet();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(message, 'Wallet Connection Failed');
      return;
    }

    const msg = { [action]: { sensor_id: sensor.id } };

    try {
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        memo,
      );

      if (result) {
        await this.loadSensors();
        this.toastrService.showSuccess(result, successTitle);
      }
    } catch (err: unknown) {
      console.error(`Error ${action} sensor:`, err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, errorTitle);
    }
  }

  private scrollToFormHeaderRef() {
    setTimeout(() => {
      this.formHeaderRef?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }
}
