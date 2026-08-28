import { describe, expect, it, vi } from 'vitest';
import {
  canExecute,
  isVotingOpen,
  parseProposal,
  previewProposalEffect,
  proposalStatusLabel,
  voteCount,
} from '@services/local-dao/local-dao';

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

describe('LocalDao', () => {
  it('loads after CosmJS mocks', async () => {
    const { LocalDao } = await import('./local-dao');
    expect(LocalDao).toBeTruthy();
  });
});

describe('local-dao helpers', () => {
  it('parses proposal metadata', () => {
    const parsed = parseProposal({
      id: 1,
      proposer: 'osmo1',
      title: 'Yamuna cleanup fund',
      description: 'Approve supplies',
      action_tag: 'fund_cleanup',
      metadata_str: JSON.stringify({ location: 'Delhi, India' }),
      status: 'open',
      yes_votes: 2,
      no_votes: 0,
      abstain_votes: 0,
      voting_end: 9999,
      created_at: 0,
    });
    expect(parsed.location).toBe('Delhi, India');
  });

  it('labels status and vote counts', () => {
    expect(proposalStatusLabel('executed')).toBe('Executed');
    expect(voteCount('3')).toBe(3);
    expect(isVotingOpen(
      {
        id: 1,
        proposer: 'osmo1',
        title: 'Test',
        description: '',
        action_tag: 'tag',
        metadata_str: '{}',
        status: 'open',
        yes_votes: 0,
        no_votes: 0,
        abstain_votes: 0,
        voting_end: 200,
        created_at: 0,
      },
      100,
    )).toBe(true);
    expect(canExecute(
      {
        id: 1,
        proposer: 'osmo1',
        title: 'Test',
        description: '',
        action_tag: 'tag',
        metadata_str: '{}',
        status: 'open',
        yes_votes: 0,
        no_votes: 0,
        abstain_votes: 0,
        voting_end: 100,
        created_at: 0,
      },
      200,
    )).toBe(true);
  });

  it('previews post_bounty effect copy', () => {
    const text = previewProposalEffect(
      'post_bounty',
      { location: 'Delhi, India', reward: '5000000', deadline: 9999 },
      'Yamuna cleanup crew',
      'OSMO',
    );
    expect(text).toContain('5000000');
    expect(text).toContain('Yamuna cleanup crew');
    expect(text).toContain('Delhi, India');
  });
});
