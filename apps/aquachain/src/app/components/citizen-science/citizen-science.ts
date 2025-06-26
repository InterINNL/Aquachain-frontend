import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
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

@Component({
  selector: 'citizen-science',
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './citizen-science.html',
  styleUrl: './citizen-science.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CitizenScience implements OnInit, AfterViewInit {
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
  loadingSensors!: boolean;
  showOnlyMine!: boolean;
  currentPage = 1;
  pageSize = pageSize;
  totalSensors = 0;
  totalPages = 1;
  pageCursors: number[] = [];

  selectedSensor: ParsedSensor | null = null;
  @ViewChild('formHeaderRef') formHeaderRef!: ElementRef;

  private walletService = inject(WalletService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private contractService = inject(ContractService);
  private toastrService = inject(ToastrService);
  private document = inject(DOCUMENT);
  private window = this.document.defaultView as
    | (Window &
        typeof globalThis & {
          keplr?: any;
          getOfflineSigner?: any;
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
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // if (!this.walletAddress) {
      //   await this.connectWallet();
      // }
      this.loadSensors();
    }
  }

  setActiveTab(index: number) {
    this.activeTab = index;
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
    this.loadDataEntries(sensor.id);
    this.mode = 'view';
    this.scrollToFormHeaderRef();
  }

  async toggleSensorView() {
    this.showOnlyMine = !this.showOnlyMine;
    if (this.showOnlyMine) {
      if (!this.walletAddress) {
        await this.connectWallet();
      }
    }
    this.pageCursors = [];
    this.currentPage = 1;
    await this.loadSensors();
  }

  async activate(sensor: ParsedSensor) {
    if (!this.walletAddress) {
      await this.connectWallet();
    }

    const msg = {
      activate: {
        sensor_id: sensor.id,
      },
    };

    try {
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        'activate sensor',
      );

      if (result) {
        await this.loadSensors();
        this.toastrService.showSuccess(result, 'Sensor Activated');
      }
    } catch (err: unknown) {
      console.error('Error activating sensor:', err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, 'Activation Failed');
    }
  }

  async deactivate(sensor: ParsedSensor) {
    if (!this.walletAddress) {
      await this.connectWallet();
    }

    const msg = {
      deactivate: {
        sensor_id: sensor.id,
      },
    };

    try {
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        'deactivate sensor',
      );

      if (result) {
        await this.loadSensors();
        this.toastrService.showSuccess(result, 'Sensor Deactivated');
      }
    } catch (err: unknown) {
      console.error('Error deactivating sensor:', err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, 'Deactivation Failed');
    }
  }

  async deleteSensor(sensor: ParsedSensor) {
    if (!this.walletAddress) {
      await this.connectWallet();
    }

    const msg = {
      delete: {
        sensor_id: sensor.id,
      },
    };

    try {
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        'delete sensor',
      );

      if (result) {
        await this.loadSensors();
        this.toastrService.showSuccess(result, 'Sensor Deleted');
      }
    } catch (err: unknown) {
      console.error('Error deleting sensor:', err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, 'Deletion Failed');
    }
  }

  async connectWallet() {
    await this.walletService.connectWallet().catch(console.error);
    this.walletAddress = this.walletService.walletAddress ?? '';
  }

  async onRegisterSensor() {
    if (this.sensorForm.invalid) return;

    if (!this.walletAddress) {
      await this.connectWallet();
    }

    const value = this.sensorForm.value;
    const sensorJson: SensorSubmission = {
      type: value.type,
      model: value.model,
      location: {
        lat: value.latitude,
        lng: value.longitude,
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

    if (!this.walletAddress) {
      await this.connectWallet();
    }

    const value = this.submitDataForm.value.value;

    const msg = {
      submit_data: {
        sensor_id: this.selectedSensor.id,
        data: {
          value,
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

      this.sensors = rawSensors
        .map((sensor): ParsedSensor | null => {
          try {
            let parsed;
            if (typeof sensor.data_str === 'string') {
              parsed = JSON.parse(sensor.data_str);
            }
            return {
              ...sensor,
              ...parsed,
              created_at: sensor.created_at
                ? new Date(Number(sensor.created_at) * 1000).toISOString()
                : sensor.created_at,
            };
          } catch {
            return null;
          }
        })
        .filter((s): s is ParsedSensor => s !== null);

      const lastSensor = this.sensors[this.sensors.length - 1];

      if (this.sensors.length === this.pageSize) {
        this.pageCursors[this.currentPage - 1] = lastSensor.id;
      }
    } catch (err) {
      console.error('Failed to load sensors:', err);
    } finally {
      this.loadingSensors = false;
    }
  }

  async loadTotalSensors(): Promise<void> {
    try {
      this.totalSensors = await this.contractService.getTotalSensors(
        this.citizenScienceContractAddress,
        this.showOnlyMine ? this.walletAddress : undefined,
      );
      this.totalPages = Math.ceil(this.totalSensors / this.pageSize) || 1;
    } catch (err) {
      console.error('Failed to load total sensors count:', err);
      this.totalSensors = 0;
      this.totalPages = 1;
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadSensors();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.loadSensors();
  }

  async loadDataEntries(sensorId?: number, submitter?: string): Promise<void> {
    try {
      const queryOptions: {
        sensor_id?: number;
        submitter?: string;
      } = {};

      if (sensorId !== undefined) {
        queryOptions.sensor_id = sensorId;
      }
      if (submitter !== undefined) {
        queryOptions.submitter = submitter;
      }

      const rawDataEntries = await this.contractService.listDataEntries(
        this.citizenScienceContractAddress,
        queryOptions,
      );

      this.dataEntries = rawDataEntries
        .map((entry): ParsedDataEntry | null => {
          try {
            let parsed;
            if (typeof entry.data_str === 'string') {
              parsed = JSON.parse(entry.data_str);
            }
            return {
              ...entry,
              ...parsed,
              created_at: entry.created_at
                ? new Date(Number(entry.created_at) * 1000).toISOString()
                : entry.created_at,
              updated_at: entry.updated_at
                ? new Date(Number(entry.updated_at) * 1000).toISOString()
                : entry.updated_at,
            };
          } catch (e) {
            console.warn('Failed to parse data entry:', entry.id, e);
            return null;
          }
        })
        .filter((entry): entry is ParsedDataEntry => entry !== null);
      console.log(this.dataEntries);
    } catch (err) {
      console.error('Failed to load data entries:', err);
      // this.toastrService.showError('Could not fetch data entries');
    }
  }

  truncate(text: string | undefined | null, max = 20): string {
    if (!text) return '—';
    return text.length > max ? text.slice(0, max) + '…' : text;
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
