import {
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
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { environment } from '@env/environment';
import { ContractService } from '@services/contract/contract';
import { ToastrService } from '@services/toastr/toastr';

@Component({
  selector: 'citizen-science',
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './citizen-science.html',
  styleUrl: './citizen-science.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CitizenScience implements OnInit {
  activeTab = 1;
  loading = false;
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

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  setRegisterNewSensor() {
    this.mode = 'register';
  }

  setSubmitData() {
    this.mode = 'submit';
  }

  setView() {
    this.mode = 'view';
  }

  activate() {}
  deactivate() {}

  async connectWallet() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (
      typeof window === 'undefined' ||
      !window.keplr ||
      !window.getOfflineSigner
    ) {
      throw new Error('Keplr extension not found or running outside browser');
    }
    await this.walletService.connectWallet().catch(console.error);
    this.walletAddress = this.walletService.walletAddress ?? '';
  }

  async onRegisterSensor() {
    if (this.sensorForm.invalid) return;

    await this.connectWallet();

    const value = this.sensorForm.value;
    const sensorJson = {
      type: value.type,
      model: value.model,
      location: {
        lat: value.latitude,
        lng: value.longitude,
        description: value.description,
      },
    };

    this.loading = true;
    try {
      const msg = { submit_sensor: { data: sensorJson } };
      const result = await this.contractService.simulateAndExecute(
        this.walletAddress,
        this.citizenScienceContractAddress,
        msg,
        'submit sensor',
      );

      if (result) {
        this.toastrService.showSuccess(result, 'Transaction Confirmed');
      }
    } catch (err: unknown) {
      console.error('Error submitting sensor:', err);
      const transactionError = err instanceof Error ? err.message : String(err);
      this.toastrService.showError(transactionError, 'Transaction Failed');
    } finally {
      this.loading = false;
    }
  }
}
