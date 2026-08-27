import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  public walletAddress: string | null = null;
  private _queryClient: CosmWasmClient | null = null;
  private _signingClient: SigningCosmWasmClient | null = null;
  private document = inject(DOCUMENT);
  private window = this.document.defaultView as
    | (Window &
        typeof globalThis & {
          keplr?: any;
          getOfflineSigner?: any;
        })
    | null;
  private readonly chainId = environment.chainId;
  private readonly rpcEndpoint = environment.rpcEndpoint;
  private readonly restEndpoint = environment.restEndpoint;
  private queryClientReady!: Promise<void>;
  private resolveQueryClientReady!: () => void;
  private signingClientReady!: Promise<void>;
  private resolveSigningClientReady!: () => void;

  private chainSuggested = false;

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.queryClientReady = new Promise((resolve) => {
        this.resolveQueryClientReady = resolve;
      });

      this.signingClientReady = new Promise((resolve) => {
        this.resolveSigningClientReady = resolve;
      });

      SigningCosmWasmClient.connect(this.rpcEndpoint)
        .then((client) => {
          this._queryClient = client;
          this.resolveQueryClientReady();
        })
        .catch((err) => {
          console.error('Failed to initialize query client:', err);
        });
    }
  }

  async getQueryClient(): Promise<CosmWasmClient> {
    await this.queryClientReady;
    return this._queryClient!;
  }

  async getSigningClient(): Promise<SigningCosmWasmClient> {
    await this.signingClientReady;
    return this._signingClient!;
  }

  async connectWallet(): Promise<void> {
    if (
      typeof this.window === 'undefined' ||
      !this.window?.keplr ||
      !this.window?.getOfflineSigner
    ) {
      console.warn('Keplr extension not found or running outside browser');
      return;
    }

    if (!this.chainSuggested) {
      const prefix = environment.bech32Prefix;
      const denom = environment.coinDenom;
      const minimal = environment.coinMinimalDenom;
      const decimals = environment.coinDecimals;
      await this.window.keplr.experimentalSuggestChain({
        chainId: this.chainId,
        chainName: environment.chainName,
        rpc: this.rpcEndpoint,
        rest: this.restEndpoint,
        stakeCurrency: {
          coinDenom: denom,
          coinMinimalDenom: minimal,
          coinDecimals: decimals,
        },
        bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: prefix,
          bech32PrefixAccPub: `${prefix}pub`,
          bech32PrefixValAddr: `${prefix}valoper`,
          bech32PrefixValPub: `${prefix}valoperpub`,
          bech32PrefixConsAddr: `${prefix}valcons`,
          bech32PrefixConsPub: `${prefix}valconspub`,
        },
        currencies: [
          {
            coinDenom: denom,
            coinMinimalDenom: minimal,
            coinDecimals: decimals,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: denom,
            coinMinimalDenom: minimal,
            coinDecimals: decimals,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.04,
            },
          },
        ],
        features: ['cosmwasm'],
      });
      this.chainSuggested = true;
    }

    await this.window.keplr.enable(this.chainId);
    const offlineSigner = this.window.getOfflineSigner(this.chainId);
    const [accounts, signingClient] = await Promise.all([
      offlineSigner.getAccounts(),
      SigningCosmWasmClient.connectWithSigner(this.rpcEndpoint, offlineSigner),
    ]);
    this._signingClient = signingClient;
    this.walletAddress = accounts[0].address;
    this.resolveSigningClientReady();
  }
}
