import { describe, expect, it, vi } from 'vitest';
import {
  formatExpiry,
  listingIsBuyable,
} from '@services/water-credit-marketplace/water-credit-marketplace';

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

describe('WaterCredits', () => {
  it('loads after CosmJS mocks', async () => {
    const { WaterCredits } = await import('./water-credits');
    expect(WaterCredits).toBeTruthy();
  });
});

describe('water-credit-marketplace helpers', () => {
  it('detects buyable listing', () => {
    expect(
      listingIsBuyable(
        {
          id: 1,
          seller: 'osmo1',
          credits: '10',
          price: '100',
          region: 'Delhi, India',
          active: true,
          created_at: 0,
        },
        50,
      ),
    ).toBe(true);
  });

  it('formats expiry', () => {
    expect(formatExpiry(null)).toBe('No expiry');
  });
});
