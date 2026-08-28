import { describe, expect, it, vi } from 'vitest';
import {
  amountCount,
  formatRate,
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
  it('formats rate and amounts', () => {
    expect(
      formatRate(
        {
          partner_denom: 'gujarat-water-unit',
          base_amount: '100',
          partner_amount: '10',
        },
        'uosmo',
      ),
    ).toBe('100 uosmo = 10 partner units');
    expect(amountCount('5')).toBe('5');
    expect(amountCount(undefined)).toBe('0');
  });
});
