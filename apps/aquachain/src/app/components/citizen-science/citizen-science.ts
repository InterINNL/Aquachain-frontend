import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  OnInit,
  PLATFORM_ID,
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
  walletAddress = '';
  citizenScienceContractAddress = environment.CitizenScienceContractAddress;

  mode: 'register' | 'submit' | 'view' | null = 'register';

  tabs = [
    { label: 'Dashboard', icon: faGaugeHigh },
    { label: 'Sensors', icon: faGaugeHigh },
    { label: 'Map View', icon: faMapLocationDot },
    { label: 'Rewards', icon: faCoins },
  ];

  sensors: ParsedSensor[] = [];
  loadingSensors = false;

  selectedSensor: ParsedSensor | null = null;

  private walletService = inject(WalletService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private contractService = inject(ContractService);
  private toastrService = inject(ToastrService);

  async ngOnInit() {
    this.sensorForm = this.fb.group({
      type: ['', Validators.required],
      model: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async ngAfterViewInit() {
    await this.connectWallet();
    await this.loadSensors();
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  setRegisterNewSensor() {
    this.mode = 'register';
  }

  setSubmitData(sensor: ParsedSensor) {
    this.selectedSensor = sensor;
    this.mode = 'submit';
  }

  setView(sensor: ParsedSensor) {
    this.selectedSensor = sensor;
    this.mode = 'view';
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

  async deleteSensor(sensor: ParsedSensor) {}

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

  async connectWallet() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

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

  async loadSensors(): Promise<void> {
    this.loadingSensors = true;
    try {
      const rawSensors = await this.contractService.listSensors(
        this.citizenScienceContractAddress,
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
              created_at: parsed.created_at ?? new Date().toISOString(),
            };
          } catch (e) {
            console.warn('Failed to parse sensor:', sensor.id, e);
            return null;
          }
        })
        .filter((s): s is ParsedSensor => s !== null);
    } catch (err) {
      console.error('Failed to load sensors:', err);
      // this.toastrService.showError('Could not fetch sensors');
    } finally {
      this.loadingSensors = false;
    }
  }

  truncate(text: string | undefined | null, max = 20): string {
    if (!text) return '—';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
