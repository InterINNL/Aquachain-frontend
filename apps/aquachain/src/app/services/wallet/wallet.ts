import { DOCUMENT, inject, Injectable } from '@angular/core';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: (chainId: string) => OfflineSigner;
  }
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  public walletAddress: string | null = null;
  public client: SigningCosmWasmClient | null = null;

  private document = inject(DOCUMENT);
  private window = this.document.defaultView as
    | (Window &
        typeof globalThis & {
          keplr?: any;
          getOfflineSigner?: any;
        })
    | null;

  private readonly chainId = 'testing';
  private readonly rpcEndpoint = 'http://localhost:4200/rpc';
  private readonly restEndpoint = 'http://localhost:1317';

  async connectWallet(): Promise<void> {
    if (!this.window?.keplr || !this.window?.getOfflineSigner) {
      throw new Error('Keplr extension not found');
    }
    await this.window?.keplr.experimentalSuggestChain({
      chainId: this.chainId,
      chainName: 'Local Testing Chain',
      rpc: this.rpcEndpoint,
      rest: this.restEndpoint,
      stakeCurrency: {
        coinDenom: 'STAKE',
        coinMinimalDenom: 'ustake',
        coinDecimals: 6,
      },
      bip44: { coinType: 118 },
      bech32Config: {
        bech32PrefixAccAddr: 'wasm',
        bech32PrefixAccPub: 'wasmpub',
        bech32PrefixValAddr: 'wasmvaloper',
        bech32PrefixValPub: 'wasmvaloperpub',
        bech32PrefixConsAddr: 'wasmvalcons',
        bech32PrefixConsPub: 'wasmvalconspub',
      },
      currencies: [
        {
          coinDenom: 'STAKE',
          coinMinimalDenom: 'ustake',
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'STAKE',
          coinMinimalDenom: 'ustake',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        },
      ],
      features: ['stargate', 'cosmwasm'],
    });

    await window.keplr.enable(this.chainId);
    const offlineSigner = this.window?.getOfflineSigner(this.chainId);
    const accounts = await offlineSigner.getAccounts();

    this.walletAddress = accounts[0].address;
    this.client = await SigningCosmWasmClient.connectWithSigner(
      this.rpcEndpoint,
      offlineSigner,
    );

    // console.info('✅ Wallet connected:', this.walletAddress);
  }
}
