import { describe, expect, it, vi } from 'vitest';
import { parseEcoAction } from '@services/sustainable-action-rewards/sustainable-action-rewards';

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

describe('SustainableActions', () => {
  it('loads after CosmJS mocks', async () => {
    const { SustainableActions } = await import('./sustainable-actions');
    expect(SustainableActions).toBeTruthy();
  });
});

describe('sustainable-action-rewards helpers', () => {
  it('parses action evidence', () => {
    const parsed = parseEcoAction({
      id: 1,
      actor: 'osmo1abc',
      evidence_str: JSON.stringify({
        title: 'Yamuna cleanup',
        location: 'Delhi, India',
        impact_points: '50',
      }),
      impact_points: '50',
      verified: false,
      rewarded: false,
      created_at: 1,
    });
    expect(parsed.title).toBe('Yamuna cleanup');
    expect(parsed.location).toBe('Delhi, India');
  });
});
