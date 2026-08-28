import { describe, expect, it, vi } from 'vitest';
import {
  bountyStatusLabel,
  isBountyOpen,
  parseSubmission,
} from '@services/community-bounty/community-bounty';

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

describe('CommunityBounty', () => {
  it('loads after CosmJS mocks', async () => {
    const { CommunityBounty } = await import('./community-bounty');
    expect(CommunityBounty).toBeTruthy();
  });
});

describe('community-bounty helpers', () => {
  it('parses work json', () => {
    const parsed = parseSubmission({
      id: 1,
      bounty_id: 2,
      worker: 'osmo1abc',
      work_str: JSON.stringify({
        summary: 'Yamuna cleanup shift',
        location: 'Delhi, India',
        evidence: '42 kg plastic logged',
        hours_spent: '5',
      }),
      submitted_at: 100,
      approved: false,
    });
    expect(parsed.summary).toBe('Yamuna cleanup shift');
    expect(parsed.location).toBe('Delhi, India');
  });

  it('labels bounty status', () => {
    expect(bountyStatusLabel('open')).toBe('Open');
    expect(bountyStatusLabel('completed')).toBe('Completed');
  });

  it('detects open bounty before deadline', () => {
    expect(
      isBountyOpen(
        {
          id: 1,
          poster: 'osmo1',
          title: 'Test',
          description: '',
          location: 'Delhi, India',
          deadline: 200,
          reward_amount: '100',
          status: 'open',
          created_at: 0,
        },
        150,
      ),
    ).toBe(true);
  });
});
