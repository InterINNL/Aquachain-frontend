import { describe, expect, it, vi } from 'vitest';
import {
  amountCount,
  formatRateHuman,
  osmoToUosmo,
  previewSwap,
  suggestedOsmoAmounts,
} from '@services/cross-platform-exchange/cross-platform-exchange';

vi.mock('@services/wallet/wallet', () => ({
  WalletService: class {
    connectWallet = vi.fn();
  },
}));

vi.mock('@services/contract/contract', () => ({
  ContractService: class {
    simulateAndExecute = vi.fn();
    getqueryClient = vi.fn();
  },
  pageSize: 10,
}));

vi.mock('@cosmjs/cosmwasm-stargate', () => ({
  SigningCosmWasmClient: {
    connect: vi.fn(),
    connectWithSigner: vi.fn(),
  },
  CosmWasmClient: {
    connect: vi.fn(),
  },
}));

describe('CrossExchange', () => {
  it('loads after CosmJS mocks', async () => {
    const { CrossExchange } = await import('./cross-exchange');
    expect(CrossExchange).toBeTruthy();
  });
});

describe('cross-exchange helpers', () => {
  const gujaratRate = {
    partner_denom: 'gujarat-water-unit',
    base_amount: '1000000',
    partner_amount: '100',
  };

  it('formats human OSMO rates', () => {
    expect(formatRateHuman(gujaratRate)).toBe('1 OSMO = 100 ledger units');
    expect(amountCount('5')).toBe('5');
    expect(amountCount(undefined)).toBe('0');
  });

  it('converts OSMO input to uosmo for chain swaps', () => {
    expect(osmoToUosmo('2')).toBe('2000000');
    expect(osmoToUosmo('1.5')).toBe('1500000');
  });

  it('previews exact swap output for whole OSMO amounts', () => {
    const preview = previewSwap('base_to_partner', gujaratRate, '2');
    expect(preview?.exact).toBe(true);
    expect(preview?.chainAmount).toBe('2000000');
    expect(preview?.outputLabel).toBe('200 ledger units');
  });

  it('suggests demo-friendly OSMO quick picks', () => {
    expect(suggestedOsmoAmounts(gujaratRate)).toEqual(['1', '2', '5']);
  });
});
