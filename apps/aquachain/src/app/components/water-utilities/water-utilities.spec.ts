import { describe, expect, it, vi } from 'vitest';
import { parseCompany } from '@services/water-footprint/water-footprint';

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

describe('WaterUtilities', () => {
  it('loads after CosmJS mocks', async () => {
    const { WaterUtilities } = await import('./water-utilities');
    expect(WaterUtilities).toBeTruthy();
  });
});

describe('water-footprint helpers', () => {
  it('parses company metadata', () => {
    const parsed = parseCompany({
      id: 1,
      owner: 'wasm1abc',
      name: 'Aqua Co',
      metadata_str: JSON.stringify({ sector: 'utility', region: 'north' }),
    });
    expect(parsed.sector).toBe('utility');
    expect(parsed.region).toBe('north');
  });
});
