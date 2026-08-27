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
    if (!this._signingClient) {
      throw new Error('Wallet is not connected');
    }
    return this._signingClient;
  }

  async connectWallet(): Promise<string> {
    if (typeof this.window === 'undefined' || !this.window?.keplr) {
      throw new Error(
        'Keplr extension not found. Install Keplr and unlock it.',
      );
    }

    if (!this.chainSuggested) {
      try {
        await this.suggestChain();
      } catch (err) {
        // Chain may already be registered in Keplr with a different config.
        console.warn('experimentalSuggestChain failed, continuing:', err);
      }
      this.chainSuggested = true;
    }

    await this.window.keplr.enable(this.chainId);

    // Keplr overwrites CosmJS fees with its chain gasPriceStep unless disabled.
    this.window.keplr.defaultOptions = {
      ...(this.window.keplr.defaultOptions ?? {}),
      sign: {
        ...(this.window.keplr.defaultOptions?.sign ?? {}),
        preferNoSetFee: true,
        preferNoSetMemo: true,
      },
    };

    const offlineSigner =
      this.window.keplr.getOfflineSigner?.(this.chainId) ??
      this.window.getOfflineSigner?.(this.chainId);

    if (!offlineSigner) {
      throw new Error('Keplr offline signer is unavailable');
    }

    const [accounts, signingClient] = await Promise.all([
      offlineSigner.getAccounts(),
      SigningCosmWasmClient.connectWithSigner(this.rpcEndpoint, offlineSigner),
    ]);

    if (!accounts[0]?.address) {
      throw new Error('No Keplr account available for this chain');
    }

    const address = accounts[0].address;
    this._signingClient = signingClient;
    this.walletAddress = address;
    this.resolveSigningClientReady();
    return address;
  }

  private async suggestChain(): Promise<void> {
    const prefix = environment.bech32Prefix;
    const denom = environment.coinDenom;
    const minimal = environment.coinMinimalDenom;
    const decimals = environment.coinDecimals;
    await this.window!.keplr.experimentalSuggestChain({
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
            low: 0.05,
            average: 0.1,
            high: 0.25,
          },
        },
      ],
      features: ['cosmwasm'],
    });
  }
}
