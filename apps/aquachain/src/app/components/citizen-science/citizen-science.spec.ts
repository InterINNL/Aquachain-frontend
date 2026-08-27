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
    listSensors = vi.fn();
    getTotalSensors = vi.fn();
    listDataEntries = vi.fn();
  },
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

describe('CitizenScience', () => {
  it('loads after CosmJS mocks', async () => {
    const { CitizenScience } = await import('./citizen-science');
    expect(CitizenScience).toBeTruthy();
  });
});
