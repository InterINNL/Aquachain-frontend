import { describe, expect, it, vi } from 'vitest';

vi.mock('@services/wallet/wallet', () => ({
  WalletService: class {
    connectWallet = vi.fn();
    getQueryClient = vi.fn();
    getSigningClient = vi.fn();
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

describe('WaterWellInitiative', () => {
  it('loads after CosmJS mocks', async () => {
    const { WaterWellInitiative } = await import('./water-well-initiative');
    expect(WaterWellInitiative).toBeTruthy();
  });
});

describe('water-well helpers', () => {
  it('parses metadata and progress', async () => {
    const { parseWellProject, projectProgressPercent, sumStatusCounts } =
      await import('@services/water-well/water-well');

    const parsed = parseWellProject({
      id: 1,
      owner: 'wasm1abc',
      goal: '1000',
      total_donated: '250',
      status: 'fundraising',
      data_str: JSON.stringify({
        title: 'Well A',
        location: 'Village',
        description: 'Pump',
      }),
    });
    expect(parsed.title).toBe('Well A');
    expect(projectProgressPercent(parsed)).toBe(25);
    expect(sumStatusCounts({ proposed: 2, fundraising: 3 })).toBe(5);
  });
});
